import JSZip from "jszip";
import { Option, Question } from "./WordToCreateTest";

// --- Парсинг всего файла с извлечением формул ---
const parseDocx = async (file: File): Promise<Question[]> => {
  const genId = () =>
    `opt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const short = (s: string, n = 140) =>
    typeof s === "string"
      ? s.length > n
        ? s.slice(0, n) + "..."
        : s
      : String(s);

  // console.group("[parseDocx] start");
  console.log("[parseDocx] file:", file?.name ?? "unknown");

  const buffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);
  const xmlFile = zip.file("word/document.xml");

  if (!xmlFile) {
    console.error("[parseDocx] document.xml not found");
    // console.groupEnd();
    return [];
  }

  const xmlText = await xmlFile.async("string");
  console.log("[parseDocx] document.xml length:", xmlText.length);

  // Парсим document.xml в DOM
  const dom = new DOMParser().parseFromString(xmlText, "application/xml");
  // пространства имён Word / Math
  const wNs = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  const mNs = "http://schemas.openxmlformats.org/officeDocument/2006/math";

  // Получаем все параграфы <w:p>
  let paraNodes = Array.from(dom.getElementsByTagNameNS(wNs, "p") || []);
  if (paraNodes.length === 0) {
    paraNodes = Array.from(dom.getElementsByTagName("w:p") || []);
  }

  console.log("[parseDocx] paragraph nodes count:", paraNodes.length);

  const serializer = new XMLSerializer();

  const ommlToLatex = (ommlXml: string): string => {
    try {
      let latex = ommlXml;

      latex = latex.replace(/<m:t>(.*?)<\/m:t>/g, "$1"); // текст
      latex = latex.replace(/<m:sup>/g, "^{").replace(/<\/m:sup>/g, "}");
      latex = latex.replace(/<m:sub>/g, "_{").replace(/<\/m:sub>/g, "}");
      latex = latex.replace(/<m:f>/g, "\\frac{").replace(/<\/m:f>/g, "}");
      latex = latex.replace(/<m:num>(.*?)<\/m:num>/g, "{$1}");
      latex = latex.replace(/<m:den>(.*?)<\/m:den>/g, "{$1}");
      latex = latex.replace(/≤/g, "\\le").replace(/≥/g, "\\ge");

      return latex;
    } catch (e) {
      console.error("Ошибка конвертации OMML → LaTeX:", e);
      return ommlXml;
    }
  };

  const extractParagraph = (p: Element): string => {
    // Внутри extractParagraph, сразу после walk(p):
    console.log(
      "NODE:",
      p.tagName,
      p.namespaceURI,
      serializer.serializeToString(p)
    );

    let out = "";

    const walk = (node: Node | null) => {
      if (!node) return;
      // Текстовый узел (обычно внутри <w:t>)
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue ?? "";
        console.log("TEXT NODE:", text); // <-- отладочный лог
        out += text;
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;

      const el = node as Element;
      const ln = el.localName;
      const ns = el.namespaceURI;

      if (ns === wNs && ln === "r") {
        for (const child of Array.from(el.childNodes)) walk(child);
        return;
      }

      // если это <w:t> — берём текст
      if (ns === wNs && ln === "t") {
        const text = el.textContent ?? "";
        console.log("W:T TEXT:", text); // <-- отладочный лог
        out += text;
        return;
      }

      // табуляция / перенос
      if (ns === wNs && ln === "tab") {
        out += "\t";
        return;
      }
      if (ns === wNs && (ln === "br" || ln === "cr")) {
        out += "\n";
        return;
      }

      // поле/инструкция (иногда формулы вставлены как инструкции)
      if (ns === wNs && ln === "instrText") {
        const text = el.textContent ?? "";
        console.log("INSTR TEXT:", text); // <-- отладочный лог
        out += text;
        return;
      }

      // OMML формула (обычно m:oMath или m:oMathPara)
      if (ns === mNs && (ln === "oMath" || ln === "oMathPara")) {
        try {
          const ommlXml = serializer.serializeToString(el);

          // Сначала пробуем найти LaTeX-аннотацию
          let formulaText = extractFormulaText(ommlXml);

          // Если аннотации нет — используем упрощённый конвертер
          if (!formulaText) {
            formulaText = ommlToLatex(ommlXml);
          }

          if (formulaText) {
            out += ` [FORMULA:${formulaText}] `;
          } else {
            out += " [Формула не распознана] ";
          }
        } catch (e) {
          out += " [Формула не распознана] ";
        }
        return;
      }

      // Иначе рекурсивно обходим детей
      for (const child of Array.from(el.childNodes)) walk(child);
    };

    walk(p);
    // Нормализуем пробелы
    let result = out.replace(/\s+/g, " ").trim();

    if (result.includes("|")) {
      // превращаем первую | в \left| и вторую в \right|
      let count = 0;
      result = result.replace(/\|/g, () =>
        ++count % 2 ? "\\left|" : "\\right|"
      );
    }

    console.log("EXTRACTED FORMULA:", result);
    return result;
  };

  // Вспомогательная функция: разбор OMML в дерево
  const parseOmmlToTree = (xmlString: string) => {
    if (!xmlString.trim()) return [];

    try {
      // Добавляем пространство имён, если его нет
      let correctedXml = xmlString;
      if (xmlString.includes("w:") && !xmlString.match(/xmlns:w=['"]/)) {
        const rootTagRegex = /<([a-zA-Z:]+)/;
        const match = rootTagRegex.exec(xmlString);
        if (match && match[1]) {
          const rootTag = match[1];
          correctedXml = xmlString.replace(
            `<${rootTag}`,
            `<${rootTag} xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"`
          );
        }
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(correctedXml, "text/xml");

      if (doc.getElementsByTagName("parsererror").length > 0) {
        console.error(
          "XML Parsing Error:",
          doc.getElementsByTagName("parsererror")[0]
        );
        throw new Error("Failed to parse XML. Check for syntax errors.");
      }

      const rootElement = doc.documentElement;

      const buildTree = (element: Element, level = 0, parentId = "root") => {
        const nodes = [];
        const hasChildren = element.children.length > 0;
        const fullTagName = element.tagName;
        const textContent = element.textContent
          ? element.textContent.trim()
          : null;

        // === ЕДИНСТВЕННОЕ ИЗМЕНЕНИЕ: сохраняем атрибуты ===
        const attrs: Record<string, string> = {};
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i];
          attrs[attr.name] = attr.value;
        }

        const node = {
          id: `${parentId}-${fullTagName}-${level}`,
          tagName: fullTagName,
          text: null,
          level: level,
          children: [],
          isOpen: true,
          attrs, // ← добавлено
        };

        // Обходим детей
        for (let i = 0; i < element.childNodes.length; i++) {
          const child = element.childNodes[i];
          if (child.nodeType === 1) {
            // ELEMENT_NODE
            node.children.push(
              ...buildTree(child as Element, level + 1, node.id)
            );
          }
        }

        // Обрабатываем текст
        if (textContent && !hasChildren) {
          node.text = textContent;
        }

        nodes.push(node);
        return nodes;
      };

      return buildTree(rootElement);
    } catch (error) {
      console.error("XML Parsing Error:", error);
      return [];
    }
  };

  // Извлечение LaTeX-аннотации из OMML с разбором дерева
  const extractFormulaText = (ommlXml: string): string => {
    console.log("OMML XML:", ommlXml);

    // Ищем LaTeX-аннотацию в OMML
    const latexMatch = ommlXml.match(
      /<m:annotation encoding="application\/x-tex">([^<]*)<\/m:annotation>/
    );
    if (latexMatch) {
      let latex = latexMatch[1];
      console.log("LATEX ANNOTATION:", latex);

      // Убираем лишние пробелы и нормализуем
      latex = latex
        .replace(/\s+/g, " ")
        .replace(/\\cdot/g, "\\cdot ")
        .replace(/(\d),(\d)/g, "$1.$2")
        .replace(/≤/g, "\\le")
        .replace(/≥/g, "\\ge")
        .replace(/\\mathrm/g, "")
        .trim();

      return latex;
    }

    // Если LaTeX-аннотация не найдена — разбираем XML в дерево
    const tree = parseOmmlToTree(ommlXml);
    let out = "";

    const walk = (node: any) => {
      // Обработка <m:r> — просто проходим вглубь
      if (node.tagName === "r" && node.namespaceURI === mNs) {
        if (node.children) {
          for (const child of node.children) {
            walk(child);
          }
        }
        return;
      }

      // Обработка <m:t> — извлекаем текст
      if (node.tagName === "t" && node.namespaceURI === mNs) {
        if (node.text) {
          out += node.text;
        } else if (node.children) {
          // Иногда текст — дочерний узел
          for (const child of node.children) {
            if (child.nodeType === 3) {
              // TEXT_NODE
              out += child.nodeValue || "";
            }
          }
        }
        return;
      }

      if (node.tagName?.endsWith("nary") && node.children) {
        const subNode = node.children.find((c: any) =>
          c.tagName?.endsWith("sub")
        );
        const supNode = node.children.find((c: any) =>
          c.tagName?.endsWith("sup")
        );
        const eNode = node.children.find((c: any) => c.tagName?.endsWith("e"));

        let sub = "",
          sup = "",
          expr = "";

        if (subNode) {
          let tmp = "";
          for (const child of subNode.children) {
            const prevOut = out;
            out = "";
            walk(child);
            tmp += out;
            out = prevOut;
          }
          sub = tmp.trim();
        }

        if (supNode) {
          let tmp = "";
          for (const child of supNode.children) {
            const prevOut = out;
            out = "";
            walk(child);
            tmp += out;
            out = prevOut;
          }
          sup = tmp.trim();
        }

        if (eNode) {
          let tmp = "";
          for (const child of eNode.children) {
            const prevOut = out;
            out = "";
            walk(child);
            tmp += out;
            out = prevOut;
          }
          expr = eNode.children.map(walk).join("").trim();
        }

        // Пока считаем, что это интеграл (можно уточнять по атрибутам)
        out += `\\int_{${sub}}^{${sup}} ${expr} dx`;
        return;
      }

      // функции <m:func>
      if (node.tagName?.endsWith("func") && node.children) {
        const fNameNode = node.children.find((c: any) =>
          c.tagName?.endsWith("fName")
        );
        const eNode = node.children.find((c: any) => c.tagName?.endsWith("e"));

        let fname = "",
          arg = "";

        if (fNameNode) {
          let tmp = "";
          for (const child of fNameNode.children) {
            const prevOut = out;
            out = "";
            walk(child);
            tmp += out;
            out = prevOut;
          }
          fname = tmp.trim();
        }

        if (eNode) {
          let tmp = "";
          for (const child of eNode.children) {
            const prevOut = out;
            out = "";
            walk(child);
            tmp += out;
            out = prevOut;
          }
          arg = tmp.trim();
        }
        out += `\\${fname}(${arg})`;
        return;
      }

      if (node.tagName?.endsWith("f") && node.children) {
        const numNode = node.children.find((c: any) =>
          c.tagName?.endsWith("num")
        );
        const denNode = node.children.find((c: any) =>
          c.tagName?.endsWith("den")
        );

        let num = "",
          den = "";

        if (numNode) {
          let tmp = "";
          for (const child of numNode.children) {
            const prevOut = out;
            out = "";
            walk(child);
            tmp += out;
            out = prevOut;
          }
          num = tmp.trim();
        }

        if (denNode) {
          let tmp = "";
          for (const child of denNode.children) {
            const prevOut = out;
            out = "";
            walk(child);
            tmp += out;
            out = prevOut;
          }
          den = tmp.trim();
        }

        out += `\\frac{${num}}{${den}}`;
        return;
      }

      // радикал: <m:rad> → \sqrt{...} или \sqrt[deg]{...}
      if (node.tagName?.endsWith("rad") && node.children) {
        const degNode = node.children.find((c: any) =>
          c.tagName?.endsWith("deg")
        );
        const eNode = node.children.find((c: any) => c.tagName?.endsWith("e"));

        let radicand = "",
          degree = "";

        if (eNode) {
          let tmp = "";
          for (const child of eNode.children) {
            const prevOut = out;
            out = "";
            walk(child);
            tmp += out;
            out = prevOut;
          }
          radicand = tmp.trim();
        }

        if (degNode) {
          let tmp = "";
          for (const child of degNode.children) {
            const prevOut = out;
            out = "";
            walk(child);
            tmp += out;
            out = prevOut;
          }
          degree = tmp.trim();
        }

        if (degree) {
          out += `\\sqrt[${degree}]{${radicand}}`;
        } else {
          out += `\\sqrt{${radicand}}`;
        }
        return;
      }

      // === НОВОЕ: обработка ограничителей <m:d> (модули, скобки) ===
      if (node.tagName?.endsWith("d") && node.children) {
        const dPr = node.children.find((c: any) => c.tagName?.endsWith("dPr"));

        // ищем символы ограничителей
        const begChr = dPr?.children?.find((c: any) =>
          c.tagName?.endsWith("begChr")
        );
        const endChr = dPr?.children?.find((c: any) =>
          c.tagName?.endsWith("endChr")
        );

        // содержимое <m:e>
        const eNode = node.children.find((c: any) => c.tagName?.endsWith("e"));
        let content = "";
        if (eNode) {
          let tmp = "";
          for (const child of eNode.children) {
            const prevOut = out;
            out = "";
            walk(child);
            tmp += out;
            out = prevOut;
          }
          content = tmp.trim();
        }

        if (begChr?.attrs?.val && endChr?.attrs?.val) {
          // есть явные ограничители — рендерим \left..\right..
          out += `\\left${begChr.attrs.val} ${content} \\right${endChr.attrs.val}`;
        } else {
          // просто контейнер — без скобок
          out += content;
        }
        return;
      }

      // массив уравнений <m:eqArr>
      if (node.tagName?.endsWith("eqArr") && node.children) {
        out += "\\begin{cases}";

        const rowNodes = node.children.filter((c: any) =>
          c.tagName?.endsWith("e")
        );

        rowNodes.forEach((row, idx) => {
          let tmp = "";
          const prevOut = out;
          out = "";
          walk(row);
          tmp = out.trim();
          out = prevOut;

          if (tmp) {
            out += tmp;
            if (idx < rowNodes.length - 1) out += " \\\\ ";
          }
        });

        out += "\\end{cases}";
        return;
      }

      if (node.tagName?.endsWith("sSub") && node.children) {
        const eNode = node.children.find((c: any) => c.tagName?.endsWith("e"));
        const subNode = node.children.find((c: any) =>
          c.tagName?.endsWith("sub")
        );

        let base = "";
        let subscript = "";

        if (eNode) {
          let tmp = "";
          for (const child of eNode.children) {
            const prevOut = out;
            out = "";
            walk(child);
            tmp += out;
            out = prevOut;
          }
          base = tmp.trim();
        }

        if (subNode) {
          let tmp = "";
          for (const child of subNode.children) {
            const prevOut = out;
            out = "";
            walk(child);
            tmp += out;
            out = prevOut;
          }
          subscript = tmp.trim();
        }

        out += `${base}_{${subscript}}`;
        return;
      }

      if (node.tagName?.endsWith("sSup") && node.children) {
        const eNode = node.children.find((c: any) => c.tagName?.endsWith("e"));
        const supNode = node.children.find((c: any) =>
          c.tagName?.endsWith("sup")
        );

        let base = "";
        let exponent = "";

        if (eNode) {
          let tmp = "";
          for (const child of eNode.children) {
            const prevOut = out;
            out = "";
            walk(child);
            tmp += out;
            out = prevOut;
          }
          base = tmp.trim();
        }

        if (supNode) {
          let tmp = "";
          for (const child of supNode.children) {
            const prevOut = out;
            out = "";
            walk(child);
            tmp += out;
            out = prevOut;
          }
          exponent = tmp.trim();
        }

        out += `${base}^{${exponent}}`;
        return;
      }

      // === НОВОЕ: обработка акцентов <m:acc> (векторы и т.д.) ===
      if (node.tagName?.endsWith("acc") && node.children) {
        const accPr = node.children.find((c: any) =>
          c.tagName?.endsWith("accPr")
        );
        const eNode = node.children.find((c: any) => c.tagName?.endsWith("e"));

        let accent = "";
        if (accPr) {
          const chrNode = accPr.children.find((c: any) =>
            c.tagName?.endsWith("chr")
          );
          const chrVal = chrNode?.attrs?.val || chrNode?.attrs?.["m:val"];
          if (chrVal === "⃗") {
            accent = "\\vec";
          }
        }

        let base = "";
        if (eNode) {
          let tmp = "";
          for (const child of eNode.children) {
            const prevOut = out;
            out = "";
            walk(child);
            tmp += out;
            out = prevOut;
          }
          base = tmp.trim();
        }

        if (accent && base) {
          out += `${accent}{${base}}`;
        } else {
          out += base;
        }
        return;
      }

      // Если это <m:mo> — оператор
      if (node.tagName === "mo" && node.text) {
        const op = node.text;
        // Декодируем HTML-сущности
        const decodedOp = op
          .replace(/&#x22C5;/g, "\\cdot")
          .replace(/&#xB7;/g, "\\cdot")
          .replace(/&sdot;/g, "\\cdot")
          .replace(/&lowast;/g, "\\ast")
          .replace(/&ast;/g, "\\ast");
        out += decodedOp;
        return;
      }

      // Если есть текст — добавляем
      if (node.text) {
        let processedText = node.text
          .replace(/·/g, "\\cdot")
          .replace(/\s+/g, " ");

        // заменяем модуль ∣ (U+2223) на обычный |,
        // чтобы потом его поймать постобработкой
        processedText = processedText.replace(/\u2223/g, "|");

        out += processedText;
      }

      // Обходим детей
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          walk(child);
        }
      }
    };

    for (const node of tree) {
      walk(node);
    }

    const result = out.replace(/\s+/g, " ").trim();
    console.log("EXTRACTED FORMULA:", result);

    return result;
  };

  // Собираем строки-параграфы (строки могут быть пустыми)
  const paragraphs: string[] = [];
  for (let i = 0; i < paraNodes.length; i++) {
    try {
      const text = extractParagraph(paraNodes[i]);
      paragraphs.push(text);
    } catch (e) {
      console.warn("[parseDocx] extractParagraph failed for index", i, e);
      paragraphs.push("");
    }
  }

  console.log(
    "[parseDocx] paragraphs preview:",
    paragraphs.map((p, i) => `${i}:${short(p)}`)
  );

  // --- Блочная сборка вопросов ---
  const questions: Question[] = [];
  let currentId: number | null = null;
  let currentLines: string[] = [];

  const flushBlock = () => {
    if (!currentId || currentLines.length === 0) return;
    const blockText = currentLines.join(" ").replace(/\s+/g, " ").trim();
    console.log("raw block:", blockText);
    // console.group(`[flushBlock] Q${currentId}`);

    // Жёсткое разделение по маркерам A) ... H)
    const optionMarkers = /([A-H]\))/g;
    const parts = blockText.split(optionMarkers).filter(Boolean);

    const questionText = (parts[0] ?? "[Пустой вопрос]").trim();
    const options: Option[] = [];
    for (let i = 1; i < parts.length; i += 2) {
      const marker = parts[i];
      const candidate =
        parts[i + 1] && !/^[A-H]\)$/.test(parts[i + 1])
          ? parts[i + 1].trim()
          : "";
      const text = candidate.length > 0 ? candidate : "[Формула не распознана]";
      const opt = { text: `${marker} ${text}`, isCorrect: false, id: genId() };
      options.push(opt);
      //   console.log("[option]", marker, "=>", short(text));
    }

    questions.push({ id: currentId, question: questionText, options });
    console.log(">>> flushBlock questionText:", JSON.stringify(questionText));
    options.forEach((o, i) =>
      console.log(`>>> option[${i}]:`, JSON.stringify(o.text))
    );

    currentId = null;
    currentLines = [];
  };

  for (let idx = 0; idx < paragraphs.length; idx++) {
    const line = paragraphs[idx];
    // console.groupCollapsed(`[Paragraph ${idx}] ${short(line)}`);
    const qMatch = line.match(/^(\d+)\.\s*(.*)$/);
    if (qMatch) {
      flushBlock();
      currentId = parseInt(qMatch[1], 10);
      currentLines = [qMatch[2].trim()];
      console.log(
        "[Question start] id:",
        currentId,
        "preview:",
        short(qMatch[2])
      );
    } else if (currentId) {
      currentLines.push(line);
      //   console.log("[append paragraph] to current block:", short(line));
    } else {
      //   console.log("[Ignored] paragraph outside any question block");
    }
    // console.groupEnd();
  }
  flushBlock();

  // console.group("[parseDocx] finished");
  console.log("total questions parsed:", questions.length);
  console.table(
    questions.map((q) => ({
      id: q.id,
      q: short(q.question),
      opts: q.options.length,
    }))
  );
  // console.groupEnd();

  return questions;
};
export default parseDocx;
