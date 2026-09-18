import html2canvas from "html2canvas";
import confetti from "canvas-confetti";

export interface ExportOptions {
  element: HTMLElement;
  filename?: string;
  format?: "png" | "jpeg";
  quality?: number;
}

export const downloadElementAsImage = async (
  options: ExportOptions
): Promise<boolean> => {
  const { element, filename = "UniversalPoetryVibe-Postcard", format = "png", quality = 0.95 } = options;

  try {
    // Wait for any fonts/images
    if (document.fonts) {
      await document.fonts.ready;
    }

    const canvas = await html2canvas(element, {
      scale: 3, // High DPI / HD export
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      imageTimeout: 15000,
      onclone: (_clonedDoc, clonedElement) => {
        // Ensure perfect render in clone
        clonedElement.style.transform = "none";
        clonedElement.style.boxShadow = "none";
      },
    });

    const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
    const extension = format === "jpeg" ? "jpg" : "png";
    const dataUrl = canvas.toDataURL(mimeType, quality);

    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `${filename}-${timestamp}.${extension}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Subtle celebration confetti
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#d4af37", "#f4e8cf", "#7c1d24", "#ffffff"],
    });

    return true;
  } catch (error) {
    console.error("Failed to export postcard image:", error);
    throw error;
  }
};

export const downloadRemoteImage = async (
  url: string,
  filename = "UniversalPoetryVibe-Gallery"
): Promise<boolean> => {
  try {
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `${filename}-${timestamp}.jpg`;
    link.href = objectUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);

    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.8 },
      colors: ["#d4af37", "#f4e8cf", "#7c1d24"],
    });

    return true;
  } catch {
    // Fallback: direct window open/download link
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.jpg`;
    link.target = "_blank";
    link.rel = "noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }
};
