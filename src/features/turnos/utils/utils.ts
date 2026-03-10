const hasEncodingArtifacts = (text: string): boolean => {
  return (
    text.includes("�") ||
    text.includes("Ã") ||
    text.includes("Â") ||
    text.includes("Ð") ||
    text.includes("Ñ") ||
    /[\uFFFD]/.test(text)
  );
};

const cleanText = (text: string): string => {
  return text
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .trim();
};

const normalizeText = (input: any): string => {
  if (!input) return "";

  if (typeof input === "object" && input.type === "Buffer") {
    const bytes = new Uint8Array(input.data);

    const utf8 = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    if (!hasEncodingArtifacts(utf8)) return cleanText(utf8);

    const latin1 = new TextDecoder("latin1").decode(bytes);
    return cleanText(latin1);
  }

  if (typeof input === "string") {
    const cleaned = cleanText(input);

    try {
      const recovered = decodeURIComponent(escape(cleaned));
      if (!hasEncodingArtifacts(recovered)) {
        return cleanText(recovered);
      }
    } catch {}

    return cleaned;
  }

  return "";
};

const formatDate = (date?: string) => {
  if (!date) return "-";

  const [y, m, d] = date.split("T")[0].split("-");

  return y && m && d ? `${d}/${m}/${y}` : "-";
};

const HEX_COLORS = {
  ABEO: "#898CFF",
  AP: "#FEFE00",
  CONTROL: "#FB6461",
  DD: "#000080",
  EFAL: "#FF4000",
  ENT_PEDILEN: "#FDA52A",
  ENTREGA: "#DC143B",
  ENTREGA_ORTESIS: "#807F80",
  FL: "#0A4900",
  ORTESIS: "#C08000",
  PROTESIS: "#4030A0",
  REPITE: "#1699DB",
  TECNICO_ASIGNADO: "#88048E",
  TERMOPLASTICOS: "#00DEF0",
  SIN_ASIGNAR: "#000000ff",
};
export { normalizeText, formatDate, HEX_COLORS };
