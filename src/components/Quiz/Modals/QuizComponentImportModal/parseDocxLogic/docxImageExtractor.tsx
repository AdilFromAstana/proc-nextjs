import JSZip from "jszip";
import path from "path";

export async function extractDocxImagesBase64(fileBuffer: Buffer) {
  const zip = await JSZip.loadAsync(fileBuffer);

  const relsXml = await zip
    .file("word/_rels/document.xml.rels")
    ?.async("string");
  if (!relsXml) throw new Error("Нет relationships");

  const parser = new DOMParser();
  const relsDoc = parser.parseFromString(relsXml, "application/xml");
  const relationships = relsDoc.getElementsByTagName("Relationship");

  const relMap: Record<string, string> = {};

  for (let i = 0; i < relationships.length; i++) {
    const rId = relationships[i].getAttribute("Id")!;
    const target = relationships[i].getAttribute("Target")!;
    if (target.startsWith("media/")) {
      const imgFile = zip.file("word/" + target);
      if (!imgFile) continue;

      const imgBuffer = await imgFile.async("base64");
      const ext = path.extname(target).substring(1); // png, jpeg
      relMap[rId] = `data:image/${ext};base64,${imgBuffer}`;
    }
  }

  return relMap; // например { rId8: "data:image/png;base64,..." }
}
