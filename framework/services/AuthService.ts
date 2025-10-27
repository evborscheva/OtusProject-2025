import client from './client';

//Для варианта, когда одно из полей - пустая строка

const registerUser = async (email:string, password:string, username:string) => {

    const payload = {
    user: {
      email, 
      password, 
      username   
    }
}
  const response = await client.post(
    '/api/users',
    payload
);

  return {
    headers: response.headers,
    status: response.status,
    data: response.data
  };
};

//Для варианта, когда одно из полей отсутствует - сервер получает JSON без поля email/password/username
/*

interface RegisterUserParams {
  email?: string;
  password?: string;
  username?: string;
}

const registerUser = async (params: RegisterUserParams) => {
  const payload = {
    user: params
  };
  const response = await client.post(
    '/api/users',
    payload
);

  return {
    headers: response.headers,
    status: response.status,
    data: response.data
  };
};      */ 

const loginUser = async (email:string, password:string) => {

      const payload = {
    user: {
      email, 
      password 
    }
}
  const response = await client.post(
    'api/users/login',
     payload)

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