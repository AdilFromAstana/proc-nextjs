import { extractFormulaText } from "./ommlParser";

// Математические функции (sin, cos, log, tan и т.д.)
export const handleFunc = (node: any, mNs: string, walk: Function): string => {
  const fNameNode = node.children.find((c: any) =>
    c.tagName?.endsWith("fName")
  );
  const eNode = node.children.find((c: any) => c.tagName === "e");

  // имя функции
  let fname = "";
  if (fNameNode) {
    const tNode = fNameNode.children
      .find((c: any) => c.tagName === "r")
      ?.children.find((c: any) => c.tagName === "t");
    fname = tNode?.text || "";
  }

  // аргумент
  let arg = "";
  if (eNode) {
    arg = eNode.children.map((c: any) => walk(c, mNs)).join("");
  }

  if (!arg) return `\\${fname}`;

  // всегда оборачиваем в скобки
  return `\\${fname}\\left(${arg}\\right)`;
};

export const handleFrac = (node: any, mNs: string, walk: Function): string => {
  const numNode = node.children.find((c: any) => c.tagName?.endsWith("num"));
  const denNode = node.children.find((c: any) => c.tagName?.endsWith("den"));
  const num = numNode
    ? numNode.children.map((c: any) => walk(c, mNs)).join("")
    : "";
  const den = denNode
    ? denNode.children.map((c: any) => walk(c, mNs)).join("")
    : "";
  return `\\frac{${num}}{${den}}`;
};

// Интегралы и другие n-арные операторы (с пределами)
export const handleNary = (node: any, mNs: string, walk: Function): string => {
  const subNode = node.children.find((c: any) => c.tagName?.endsWith("sub"));
  const supNode = node.children.find((c: any) => c.tagName?.endsWith("sup"));
  const eNode = node.children.find((c: any) => c.tagName?.endsWith("e"));

  let sub = "",
    sup = "",
    expr = "";

  if (subNode) {
    sub = subNode.children.map((c: any) => walk(c, mNs)).join("");
  }
  if (supNode) {
    sup = supNode.children.map((c: any) => walk(c, mNs)).join("");
  }
  if (eNode) {
    expr = eNode.children.map((c: any) => walk(c, mNs)).join("");
  }

  // Пока считаем, что это именно интеграл — при желании можно расширить
  return `\\int_{${sub}}^{${sup}} ${expr}`;
};

export const handleRad = (node: any, mNs: string, walk: Function): string => {
  const eNode = node.children.find((c: any) => c.tagName?.endsWith("e"));
  const degNode = node.children.find((c: any) => c.tagName?.endsWith("deg"));
  const radicand = eNode
    ? eNode.children.map((c: any) => walk(c, mNs)).join("")
    : "";
  const degree = degNode
    ? degNode.children.map((c: any) => walk(c, mNs)).join("")
    : "";
  return degree ? `\\sqrt[${degree}]{${radicand}}` : `\\sqrt{${radicand}}`;
};

// Векторы и прочие акценты
export const handleAcc = (node: any, mNs: string, walk: Function): string => {
  const accPr = node.children.find((c: any) => c.tagName?.endsWith("accPr"));
  const eNode = node.children.find((c: any) => c.tagName?.endsWith("e"));

  let accent = "";
  if (accPr) {
    const chrNode = accPr.children.find((c: any) => c.tagName?.endsWith("chr"));
    const chrVal = chrNode?.attrs?.val || chrNode?.attrs?.["m:val"];
    if (chrVal === "⃗") accent = "\\vec";
    if (chrVal === "¯") accent = "\\bar";
    if (chrVal === "ˆ") accent = "\\hat";
    // можно дополнять при необходимости
  }

  const base = eNode
    ? eNode.children.map((c: any) => walk(c, mNs)).join("")
    : "";
  return accent ? `${accent}{${base}}` : base;
};

// Верхние индексы (степени)
export const handleSup = (node: any, mNs: string, walk: Function): string => {
  const eNode = node.children.find((c: any) => c.tagName?.endsWith("e"));
  const supNode = node.children.find((c: any) => c.tagName?.endsWith("sup"));
  const base = eNode
    ? eNode.children.map((c: any) => walk(c, mNs)).join("")
    : "";
  const exponent = supNode
    ? supNode.children.map((c: any) => walk(c, mNs)).join("")
    : "";
  return `${base}^{${exponent}}`;
};

// Нижние индексы (подстрочные)
export const handleSub = (node: any, mNs: string, walk: Function): string => {
  const eNode = node.children.find((c: any) => c.tagName?.endsWith("e"));
  const subNode = node.children.find((c: any) => c.tagName?.endsWith("sub"));
  const base = eNode
    ? eNode.children.map((c: any) => walk(c, mNs)).join("")
    : "";
  const subscript = subNode
    ? subNode.children.map((c: any) => walk(c, mNs)).join("")
    : "";
  return `${base}_{${subscript}}`;
};

// Системы уравнений
export const handleEqArr = (node: any, mNs: string, walk: Function): string => {
  const rowNodes = node.children.filter((c: any) => c.tagName?.endsWith("e"));
  const rows = rowNodes.map((row: any) =>
    row.children
      .map((c: any) => walk(c, mNs))
      .join("")
      .trim()
  );
  return `\\begin{cases}${rows.join(" \\\\ ")}\\end{cases}`;
};

// Ограничители (скобки, модули)
export const handleDelimiters = (
  node: any,
  mNs: string,
  walk: Function
): string => {
  const dPr = node.children.find((c: any) => c.tagName?.endsWith("dPr"));
  const begChr = dPr?.children?.find((c: any) => c.tagName?.endsWith("begChr"));
  const endChr = dPr?.children?.find((c: any) => c.tagName?.endsWith("endChr"));
  const eNode = node.children.find((c: any) => c.tagName?.endsWith("e"));

  let content = eNode
    ? eNode.children.map((c: any) => walk(c, mNs)).join("")
    : "";

  if (begChr?.attrs?.val && endChr?.attrs?.val) {
    // есть явные ограничители
    const left = begChr.attrs.val === "∣" ? "|" : begChr.attrs.val;
    const right = endChr.attrs.val === "∣" ? "|" : endChr.attrs.val;
    return `\\left${left} ${content} \\right${right}`;
  }

  // 🔥 fallback: если ограничителей нет, но внутри есть символы "|"
  if (content.includes("|")) {
    let count = 0;
    content = content.replace(/\|/g, () =>
      ++count % 2 ? "\\left|" : "\\right|"
    );
  }

  return content;
};

export const ommlToLatex = (ommlXml: string): string => {
  try {
    let latex = ommlXml;
    latex = latex.replace(/<m:t>(.*?)<\/m:t>/g, "$1");
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

export const extractParagraph = (
  p: Element,
  serializer: XMLSerializer,
  wNs: string,
  mNs: string
): string => {
  let out = "";

  const walk = (node: Node | null) => {
    if (!node) return;

    if (node.nodeType === Node.TEXT_NODE) {
      out += node.nodeValue ?? "";
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

    if (ns === wNs && ln === "t") {
      const text = el.textContent ?? "";

      out += text;
      return;
    }

    if (ns === wNs && ln === "tab") {
      out += "\t";
      return;
    }
    if (ns === wNs && (ln === "br" || ln === "cr")) {
      out += "\n";
      return;
    }

    if (ns === wNs && ln === "instrText") {
      out += el.textContent ?? "";
      return;
    }

    if (ns === wNs && ln === "drawing") {
      // ищем r:embed
      const blip = el.querySelector("a\\:blip, blip");
      const embedId = blip?.getAttribute("r:embed");
      if (embedId) {
        out += ` [IMAGE:${embedId}] `;
      }
      return;
    }

    if (ns === mNs && (ln === "oMath" || ln === "oMathPara")) {
      const ommlXml = serializer.serializeToString(el);
      let formulaText = extractFormulaText(ommlXml, mNs);
      if (!formulaText) formulaText = ommlToLatex(ommlXml);

      out += formulaText
        ? ` [FORMULA:${formulaText}] `
        : " [Формула не распознана] ";

      return; // ⚡ важно, чтобы дальше не шёл рекурсивный walk
    }

    for (const child of Array.from(el.childNodes)) walk(child);
  };

  walk(p);

  let result = out.replace(/\s+/g, " ").trim();

  if (result.includes("|")) {
    let count = 0;
    result = result.replace(/\|/g, () =>
      ++count % 2 ? "\\left|" : "\\right|"
    );
  }

  return result;
};
