import JSZip from "jszip";
import {
  Option,
  ParseError,
  Question,
} from "../WordToCreateTest/WordToCreateTest";
import { extractParagraph } from "./extractors";

const parseDocx = async (
  file: File
): Promise<{ questions: Question[]; errors: ParseError[] }> => {
  const genId = () =>
    `opt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const errors: ParseError[] = []; // ✅ теперь локально

  const buffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);

  // --- 1. читаем relationships (Id -> media/imageX.png)
  const relsXml = await zip
    .file("word/_rels/document.xml.rels")
    ?.async("string");
  const relMap: Record<string, string> = {};
  if (relsXml) {
    const relsDoc = new DOMParser().parseFromString(relsXml, "application/xml");
    const relationships = Array.from(
      relsDoc.getElementsByTagName("Relationship")
    );
    for (const rel of relationships) {
      const rId = rel.getAttribute("Id")!;
      const target = rel.getAttribute("Target")!;
      if (target?.startsWith("media/")) {
        const imgFile = zip.file("word/" + target);
        if (imgFile) {
          const imgBuffer = await imgFile.async("base64");
          const ext = target.split(".").pop() || "png";
          relMap[rId] = `data:image/${ext};base64,${imgBuffer}`;
        }
      }
    }
  }

  // --- 2. читаем основной текст документа
  const xmlFile = zip.file("word/document.xml");
  if (!xmlFile) return { questions: [], errors }; // ✅ исправлено
  const xmlText = await xmlFile.async("string");
  const dom = new DOMParser().parseFromString(xmlText, "application/xml");

  const wNs = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  const mNs = "http://schemas.openxmlformats.org/officeDocument/2006/math";

  let paraNodes = Array.from(dom.getElementsByTagNameNS(wNs, "p") || []);
  if (paraNodes.length === 0) {
    paraNodes = Array.from(dom.getElementsByTagName("w:p") || []);
  }

  const serializer = new XMLSerializer();
  let paragraphs: string[] = paraNodes.map((p) =>
    extractParagraph(p, serializer, wNs, mNs)
  );

  // --- 3. заменяем [IMAGE:rIdX] на [IMAGE:data:image/...]
  paragraphs = paragraphs.map((p) =>
    p.replace(/\[IMAGE:(.*?)\]/g, (_, rid) => `[IMAGE:${relMap[rid] || rid}]`)
  );

  // --- 4. собираем вопросы
  const questions: Question[] = [];
  let currentId: number | null = null;
  let currentLines: string[] = [];

  const flushBlock = () => {
    try {
      if (!currentId || currentLines.length === 0) return;
      const blockText = currentLines.join(" ").replace(/\s+/g, " ").trim();

      if (!/[A-H]\)/.test(blockText)) {
        errors.push({
          questionId: currentId,
          line: blockText,
          reason: "Не найдены варианты ответов (A) B) ...)",
        });
        questions.push({
          id: currentId,
          question: blockText || "[Вопрос не распознан]",
          options: [], // 👈 пустые опции, чтобы можно было вручную отредактировать
        });
        return;
      }

      const optionMarkers = /([A-H]\))/g;
      const parts = blockText.split(optionMarkers).filter(Boolean);

      const questionText = (parts[0] ?? "[Пустой вопрос]").trim();
      const options: Option[] = [];

      for (let i = 1; i < parts.length; i += 2) {
        const candidate =
          parts[i + 1] && !/^[A-H]\)$/.test(parts[i + 1])
            ? parts[i + 1].trim()
            : "";

        if (!candidate) {
          errors.push({
            questionId: currentId,
            line: parts[i],
            reason: "Пустой вариант ответа",
          });
        }

        options.push({
          id: genId(),
          isCorrect: false,
          text: candidate || "[Формула не распознана]",
        });
      }

      questions.push({ id: currentId, question: questionText, options });
    } catch (e) {
      errors.push({
        questionId: currentId ?? undefined,
        line: currentLines.join(" "),
        reason: (e as Error).message,
      });
    } finally {
      currentId = null;
      currentLines = [];
    }
  };

  for (let idx = 0; idx < paragraphs.length; idx++) {
    const line = paragraphs[idx];
    const qMatch = line.match(/^(\d+)\.\s*(.*)$/);
    if (qMatch) {
      flushBlock();
      currentId = parseInt(qMatch[1], 10);
      currentLines = [qMatch[2].trim()];
    } else if (currentId) {
      currentLines.push(line);
    }
  }
  flushBlock();

  return { questions, errors }; // ✅ теперь всегда возвращается объект
};

export default parseDocx;
