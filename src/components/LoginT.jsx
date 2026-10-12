import Logo_sena from '../assets/Logo_sena.png'
import hoja from '../assets/hoja.png'
import Colibri from '../assets/Colibri.png'

function Login(){
    return(
    <aside className="h-screen w-120 bg-green-800 text-white font-outfit px-20">
        <div className="flex items-center py-12 ">
        <img src={hoja} className="w-15"></img>
        <h1 className="text-4xl font-[800] tracking-1 ">AGROSOFT</h1>
        
        </div>
        <img src={Colibri} className="w-28 absolute -top-4 left-80"></img>
        <span className="mx-20  text-[#FFFFFF80]">SISTEMA AGRÍCOLA</span>
        <div className="text-center ">
            <h2 className="font-bold mt-30 text-xl">
                Tecnología inteligente para una agricultura más eficiente.
            </h2>
            <p className="text-sm tracking-wide text-[#FFFFFFA6]">Gestiona cada etapa de tu producción desde una sola plataforma. Monitorea tus cultivos con IOT, controla tus recursos y  convierte tus datos en decisiones que impulsen mejores resultados.</p>
        </div>
        <div className="mt-30 flex flex-col items-center space-y-2">
            <hr className="w-100 text-[#ffffff1e]"></hr>
            <p className="text-xs text-[#FFFFFF8C]">Centro de Gestión y Desarrollo Surcolombiano</p>
            <span className="text-xs text-[#ffffff4D]">© 2026</span>
            <img src={Logo_sena} className="h-12 w-12 rounded-full"></img>
        </div>
    </aside>
    );
}
export default Login;