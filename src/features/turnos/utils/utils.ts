const copiar = (sede: string, fecha: string, hora: string) => {
  const texto = `Sede: ${sede}\nFecha: ${fecha}\nHora: ${hora}`;
  navigator.clipboard.writeText(texto);
};

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

const getEstadoAtencionLabel = (id: number, estadosAtencion: any) => {
  const estado = estadosAtencion.find(
    (estado: any) => estado.idtestados_atenciones === id,
  );
  return estado ? estado.estatt_descripcion : "Desconocido";
};

const formatDate = (date?: string) => {
  if (!date) return "-";

  const [y, m, d] = date.split("T")[0].split("-");

  return y && m && d ? `${d}/${m}/${y}` : "-";
};

export { copiar, normalizeText, getEstadoAtencionLabel, formatDate };
