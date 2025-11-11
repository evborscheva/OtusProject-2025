import client from './client';

interface RegisterUserParams {
  email?: string;
  password?: string;
  username?: string;
}

const registerUser = async (params: RegisterUserParams) => {
  const payload = {
    user: params
  };
  const response = await client.post('/api/users', payload);

  return {
    headers: response.headers,
    status: response.status,
    data: response.data
  };
};

interface LoginUserParams {
  email?: string;
  password?: string;
}

const loginUser = async (params: LoginUserParams) => {
  const payload = {
    user: params
  };
  const response = await client.post('api/users/login', payload);

  return {
    headers: response.headers,
    status: response.status,
    data: response.data
  };
};

export default {
  loginUser,
  registerUser
};
