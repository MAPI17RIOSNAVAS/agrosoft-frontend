import api from './Axios';

export const crearUsuarioRequest = async (datosUsuario) => {
    const response = await api.post('/usuarios', datosUsuario);
    return response.data;
};