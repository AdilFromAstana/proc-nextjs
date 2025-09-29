import {
  handleFrac,
  handleRad,
  handleAcc,
  handleSup,
  handleSub,
  handleEqArr,
  handleDelimiters,
  handleNary,
  handleFunc,
} from "./extractors";

export const parseOmmlToTree = (xmlString: string) => {
  if (!xmlString.trim()) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "text/xml");
  const rootElement = doc.documentElement;

  const buildTree = (element: Element, level = 0, parentId = "root") => {
    const nodes: any[] = [];
    const attrs: Record<string, string> = {};
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      attrs[attr.name] = attr.value;
    }

    const node: any = {
      id: `${parentId}-${element.tagName}-${level}`,
      tagName: element.localName,
      namespaceURI: element.namespaceURI,
      text: element.textContent?.trim() || null,
      level,
      children: [],
      attrs,
    };

    for (let i = 0; i < element.children.length; i++) {
      node.children.push(...buildTree(element.children[i], level + 1, node.id));
    }

    nodes.push(node);
    return nodes;
  };

  return buildTree(rootElement);
};

export const walkNode = (node: any, mNs: string): string => {
  if (!node) return "";

  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as Element;
    console.log("[walk]", el.localName, el.namespaceURI);
  }

  if (node.tagName?.endsWith("f")) return handleFrac(node, mNs, walkNode);
  if (node.tagName?.endsWith("rad")) return handleRad(node, mNs, walkNode);
  if (node.tagName?.endsWith("acc")) return handleAcc(node, mNs, walkNode);
  if (node.tagName?.endsWith("sSup")) return handleSup(node, mNs, walkNode);
  if (node.tagName?.endsWith("sSub")) return handleSub(node, mNs, walkNode);
  if (node.tagName?.endsWith("eqArr")) return handleEqArr(node, mNs, walkNode);
  if (node.tagName?.endsWith("d")) return handleDelimiters(node, mNs, walkNode);
  if (node.tagName?.endsWith("nary")) return handleNary(node, mNs, walkNode);
  if (node.tagName?.endsWith("func")) return handleFunc(node, mNs, walkNode);

  if (node.children && node.children.length > 0) {
    return node.children.map((c: any) => walkNode(c, mNs)).join("");
  }

  return node.text || "";
};

export const extractFormulaText = (ommlXml: string, mNs: string): string => {
  console.log("ommlXml: ", ommlXml);
  const latexMatch = ommlXml.match(
    /<m:annotation encoding="application\/x-tex">([^<]*)<\/m:annotation>/
  );
  if (latexMatch) {
    return latexMatch[1]
      .replace(/\s+/g, " ")
      .replace(/\\mathrm/g, "")
      .replace(/≤/g, "\\le")
      .replace(/≥/g, "\\ge")
      .trim();
  }

  const tree = parseOmmlToTree(ommlXml);
  return tree
    .map((n) => walkNode(n, mNs))
    .join("")
    .trim();
};
