const TAMANO_FOTO = 400; // px, la foto se guarda cuadrada
const CALIDAD_JPEG = 0.85;
export const TIPOS_IMAGEN_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];

// Recorta al centro en un cuadrado y la reduce para no enviar imágenes pesadas
export const aDataUrlCuadrado = (fuente, ancho, alto) => {
  const lado = Math.min(ancho, alto);
  const canvas = document.createElement('canvas');
  canvas.width = TAMANO_FOTO;
  canvas.height = TAMANO_FOTO;
  canvas
    .getContext('2d')
    .drawImage(fuente, (ancho - lado) / 2, (alto - lado) / 2, lado, lado, 0, 0, TAMANO_FOTO, TAMANO_FOTO);
  return canvas.toDataURL('image/jpeg', CALIDAD_JPEG);
};

// Convierte un archivo de imagen en un data URL cuadrado y comprimido
export const archivoADataUrlCuadrado = (archivo) =>
  new Promise((resolve, reject) => {
    if (!archivo || !TIPOS_IMAGEN_PERMITIDOS.includes(archivo.type)) {
      reject(new Error('Formato no permitido. Usa una imagen JPG, PNG o WEBP.'));
      return;
    }
    const url = URL.createObjectURL(archivo);
    const img = new Image();
    img.onload = () => {
      resolve(aDataUrlCuadrado(img, img.naturalWidth, img.naturalHeight));
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo leer la imagen.'));
    };
    img.src = url;
  });
