import { useEffect, useRef, useState } from 'react';
import { Camera, ImagePlus, Upload, X } from 'lucide-react';
import { aDataUrlCuadrado, archivoADataUrlCuadrado } from '../utils/imagen';

export default function FotoPerfilInput({ value, onChange }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [camaraAbierta, setCamaraAbierta] = useState(false);
  const [errorCamara, setErrorCamara] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const archivoRef = useRef(null);

  const detenerCamara = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  // Apaga la cámara si el componente se desmonta
  useEffect(() => detenerCamara, []);

  const abrirCamara = async () => {
    setMenuAbierto(false);
    setErrorCamara('');
    setCamaraAbierta(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setErrorCamara('No se pudo acceder a la cámara. Revisa los permisos del navegador o sube una foto desde un archivo.');
    }
  };

  const cerrarCamara = () => {
    detenerCamara();
    setCamaraAbierta(false);
  };

  const capturar = () => {
    const video = videoRef.current;
    if (!video?.videoWidth) return;
    onChange(aDataUrlCuadrado(video, video.videoWidth, video.videoHeight));
    cerrarCamara();
  };

  const seleccionarArchivo = (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    archivoADataUrlCuadrado(archivo).then(onChange).catch(() => {});
  };

  return (
    <div className="relative flex items-center gap-3">
      <button
        type="button"
        onClick={() => setMenuAbierto(!menuAbierto)}
        className="relative w-14 h-14 rounded-full border-2 border-dashed border-emerald-400 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50/50 transition shrink-0 overflow-hidden"
        aria-label="Agregar foto de perfil"
      >
        {value ? (
          <img src={value} alt="Foto de perfil" className="w-full h-full object-cover" />
        ) : (
          <>
            <ImagePlus className="w-4 h-4 text-emerald-600" />
            <span className="text-[9px] text-slate-500 font-medium text-center leading-none mt-0.5">Foto</span>
          </>
        )}
      </button>

      <div className="flex flex-col">
        <span className="text-xs text-slate-400 max-w-30 leading-tight">
          {value ? 'Foto de perfil lista' : 'Sube una foto de perfil opcional'}
        </span>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[11px] text-red-500 hover:text-red-600 font-medium text-left mt-0.5"
          >
            Quitar foto
          </button>
        )}
      </div>

      {menuAbierto && (
        <div className="absolute right-0 md:left-0 md:right-auto top-16 z-20 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1">
          <button
            type="button"
            onClick={abrirCamara}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Camera className="w-4 h-4 text-emerald-600" /> Tomar foto
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuAbierto(false);
              archivoRef.current?.click();
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Upload className="w-4 h-4 text-emerald-600" /> Subir desde archivo
          </button>
        </div>
      )}

      <input
        ref={archivoRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={seleccionarArchivo}
        className="hidden"
      />

      {camaraAbierta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Tomar foto de perfil</h3>
              <button
                type="button"
                onClick={cerrarCamara}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Cerrar cámara"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorCamara ? (
              <p className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{errorCamara}</p>
            ) : (
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-900">
                {/* Vista en espejo para que se sienta como un selfie */}
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover -scale-x-100" />
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={cerrarCamara}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              {!errorCamara && (
                <button
                  type="button"
                  onClick={capturar}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white text-sm font-semibold"
                >
                  <Camera className="w-4 h-4" /> Capturar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
