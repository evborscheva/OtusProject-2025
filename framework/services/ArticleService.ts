import client from './client';

interface CreateArticleParams {
  title?: string;
  description?: string;
  body?: string;
  tagList?: any;
}

const CreateArticle = async (token: string, params: CreateArticleParams) => {
  const payload = {
    article: params
  };
  const response = await client.post('/api/articles', payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return {
    headers: response.headers,
    status: response.status,
    data: response.data
  };
};
const getTags = async () => {
  const response = await client.get('/api/tags');

  return {
    headers: response.headers,
    status: response.status,
    data: response.data
  };
};

export default {
  CreateArticle,
  getTags
};
