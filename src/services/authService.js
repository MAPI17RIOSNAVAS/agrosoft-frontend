import api from '../api/Axios';

export const loginRequest = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// Solicita el correo con las instrucciones para restablecer la contraseña
export const recuperarPasswordRequest = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};


// Fija la nueva contraseña usando el token recibido por correo
export const restablecerPasswordRequest = async (token, passwordNueva) => {
  const response = await api.post('/auth/reset-password', { token, passwordNueva });
  return response.data;
};
