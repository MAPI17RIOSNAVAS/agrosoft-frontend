import api from './Axios';

/**
 * @typedef {'APRENDIZ' | 'ENCARGADO_TECNICO'} RolRegistro
 * @typedef {'ADSO' | 'AGRICULTORES'} ProgramaFormacion
 * @typedef {{ value: string, label: string }} Opcion
 *
 * @typedef {Object} CrearUsuarioDto
 * @property {string} nombre
 * @property {string} apellido
 * @property {string} identificacion
 * @property {string} correo
 * @property {string} password            Mínimo 8 caracteres
 * @property {string} [telefono]
 * @property {RolRegistro} [rol]          Si se omite, el backend asume APRENDIZ
 * @property {ProgramaFormacion} [programaFormacion]  Obligatorio para APRENDIZ
 * @property {number} [idFicha]           Entero. Obligatorio para APRENDIZ
 * @property {string} [fotoPerfil]       Data URL en base64 (JPEG, PNG o WEBP)
 *
 * @typedef {Object} ActualizarUsuarioDto  No acepta rol, correo ni password
 * @property {string} [nombre]
 * @property {string} [apellido]
 * @property {string} [identificacion]
 * @property {string} [telefono]
 * @property {ProgramaFormacion} [programaFormacion]
 * @property {number} [idFicha]
 * @property {string} [fotoPerfil]
 */

const CAMPOS_CREAR = [
    'nombre', 'apellido', 'identificacion', 'correo', 'password',
    'telefono', 'rol', 'programaFormacion', 'idFicha', 'fotoPerfil',
];
const CAMPOS_ACTUALIZAR = [
    'nombre', 'apellido', 'identificacion', 'telefono', 'programaFormacion', 'idFicha', 'fotoPerfil',
];

// El backend usa forbidNonWhitelisted: solo se envían los campos permitidos.
// Al crear se omiten los vacíos; al editar se conserva null para poder borrar un valor (ej. la foto).
const filtrarCampos = (datos, permitidos, { conservarNull = false } = {}) =>
    Object.fromEntries(
        Object.entries(datos).filter(
            ([clave, valor]) =>
                permitidos.includes(clave) &&
                valor !== undefined &&
                valor !== '' &&
                (conservarNull || valor !== null)
        )
    );

const headersAutenticacion = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/** @param {CrearUsuarioDto} datosUsuario */
export const crearUsuarioRequest = async (datosUsuario) => {
    const response = await api.post('/usuarios', filtrarCampos(datosUsuario, CAMPOS_CREAR));
    return response.data;
};

/**
 * @param {number | string} id
 * @param {ActualizarUsuarioDto} datosUsuario
 */
export const actualizarUsuarioRequest = async (id, datosUsuario) => {
    const response = await api.patch(
        `/usuarios/${id}`,
        filtrarCampos(datosUsuario, CAMPOS_ACTUALIZAR, { conservarNull: true }),
        { headers: headersAutenticacion() }
    );
    return response.data;
};

/**
 * Cambia la contraseña del usuario dueño del token.
 * @returns {Promise<{ mensaje: string, passwordActualizadoAt: string }>}
 */
export const cambiarPasswordRequest = async (passwordActual, passwordNueva) => {
    const response = await api.patch(
        '/usuarios/me/password',
        { passwordActual, passwordNueva },
        { headers: headersAutenticacion() }
    );
    return response.data;
};

/** @returns {Promise<Opcion[]>} */
export const obtenerRolesOpcionesRequest = async () => {
    const response = await api.get('/roles/opciones');
    // ADMINISTRADOR no se puede enviar desde el registro
    return response.data.filter((opcion) => opcion.value !== 'ADMINISTRADOR');
};

/** @returns {Promise<Opcion[]>} */
export const obtenerProgramasFormacionOpcionesRequest = async () => {
    const response = await api.get('/programas-formacion/opciones');
    return response.data;
};
