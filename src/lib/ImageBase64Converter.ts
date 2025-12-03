// src/lib/ImageBase64Converter.ts
export class ImageBase64Converter {

  /**
   * Convierte uno o varios archivos a Base64 (solo datos, sin prefijo data:image)
   * @param files Un File o un arreglo de Files
   * @returns Promise<string[]> Array de cadenas Base64
   */
  static async convertirA64(files: File | File[]): Promise<string[]> {
    const archivos = Array.isArray(files) ? files : [files];

    const promises = archivos.map((file) => this.fileToBase64(file));
    return Promise.all(promises);
  }

  /**
   * Convierte un archivo a Base64 (solo datos, sin prefijo data:image)
   * @param file File a convertir
   * @returns Promise<string> Cadena Base64
   */
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          // Separamos la metadata y nos quedamos con solo la cadena Base64
          const base64Data = reader.result.split(",")[1];
          resolve(base64Data);
        } else {
          reject(new Error("Error al leer el archivo"));
        }
      };
      reader.onerror = () => reject(new Error("Error leyendo el archivo"));
      reader.readAsDataURL(file);
    });
  }
}
