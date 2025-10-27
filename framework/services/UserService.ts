import client from './client';

const getUser = async (token?: string) => {

  const response = await client.get(
    '/api/user',
    {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

  return {
    headers: response.headers,
    status: response.status,
    data: response.data
  };
};

interface UpdateUserParams {
  email?: string;
  password?: string;
  username?: string;
  bio?: string;
  image?: string;
}

const updateUser = async (params: UpdateUserParams, token?: string) => {
  const payload = {
    user: params
  };
  const response = await client.put(
    '/api/user',
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
);


  return {
    headers: response.headers,
    status: response.status,
    data: response.data
  };
};



export default {
getUser,
updateUser
};