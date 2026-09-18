import * as htmlToImage from "html-to-image";
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
  const {
    element,
    filename = "UniversalPoetryVibe-Postcard",
    format = "png",
    quality = 0.95,
  } = options;

  try {
    // Ensure all Google / Bengali web fonts are ready before snapshotting
    if (document.fonts) {
      await document.fonts.ready;
    }

    const exportConfig = {
      quality: quality,
      pixelRatio: 2.5, // High-DPI HD export
      cacheBust: false,
      skipFonts: true,
      backgroundColor: "#16100c",
      style: {
        transform: "none",
        boxShadow: "none",
      },
    };

    let dataUrl: string;
    if (format === "jpeg") {
      dataUrl = await htmlToImage.toJpeg(element, exportConfig);
    } else {
      dataUrl = await htmlToImage.toPng(element, exportConfig);
    }

    const extension = format === "jpeg" ? "jpg" : "png";
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `${filename}-${timestamp}.${extension}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Celebration confetti
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#d4af37", "#f4e8cf", "#7c1d24", "#ffffff"],
      });
    } catch {
      // ignore confetti error if canvas is not available
    }

    return true;
  } catch (error) {
    console.error("Failed to export postcard image with html-to-image:", error);
    
    // Attempt fallback with toBlob / direct canvas if primary fails
    try {
      const blob = await htmlToImage.toBlob(element, {
        pixelRatio: 2,
        skipFonts: true,
        backgroundColor: "#16100c",
      });
      if (blob) {
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const timestamp = new Date().toISOString().slice(0, 10);
        link.download = `${filename}-${timestamp}.${format === "jpeg" ? "jpg" : "png"}`;
        link.href = objectUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
        return true;
      }
    } catch (fallbackError) {
      console.error("Fallback export failed:", fallbackError);
    }
    
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

    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.8 },
        colors: ["#d4af37", "#f4e8cf", "#7c1d24"],
      });
    } catch {
      // ignore
    }

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
