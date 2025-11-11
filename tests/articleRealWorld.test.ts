import { AuthService } from '../framework/services';
import { UserFixture } from '../framework/fixtures';
import { ArticleService } from '../framework/services';
import DatabaseService from '../framework/services/DatabaseService';
import { faker } from '@faker-js/faker';

describe('RealWorld - создание новой статьи', () => {
  let newUser: any;
  let token: string;

  beforeAll(async () => {
    newUser = UserFixture.generateUserCredentials();
    const responseRegisterUser = await AuthService.registerUser(newUser);
    token = responseRegisterUser.data.user.token;

    await DatabaseService.connect();
  });

  test('Создание статьи - в теле запроса есть только заполненные обязательные поля', async () => {
    const params = {
      title: 'Проверка методов создания статьи',
      description: 'Проверяем отправку запроса с обязательными полями',
      body: 'Запрос отправлен. Статья создана'
    };
    const response = await ArticleService.CreateArticle(token, params);

    expect(response.status).toBe(201);
    expect(response.data).toMatchObject({
      article: {
        slug: expect.any(String),
        title: 'Проверка методов создания статьи',
        description: 'Проверяем отправку запроса с обязательными полями',
        body: 'Запрос отправлен. Статья создана',
        tagList: [],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        favorited: false,
        favoritesCount: 0,
        author: {
          username: newUser.username,
          bio: '',
          image: null,
          following: false
        }
      }
    });
    const dbArticle = await DatabaseService.findArticle(response.data.article.slug);
    expect(dbArticle).toBeDefined();
    expect(dbArticle.title).toBe(params.title);
    expect(dbArticle.description).toBe(params.description);
    expect(dbArticle.body).toBe(params.body);
  });

  test('Создание статьи -  в теле запроса заполнены все поля, указаны несколько существующих тегов', async () => {
    const params = {
      title: 'Проверка методов создания статьи',
      description: 'Проверяем отправку запроса с обязательными полями',
      body: 'Запрос отправлен. Статья создана',
      tagList: ['expansion', 'legal', 'soon']
    };
    const response = await ArticleService.CreateArticle(token, params);

    expect(response.status).toBe(201);
    expect(response.data).toMatchObject({
      article: {
        slug: expect.any(String),
        title: 'Проверка методов создания статьи',
        description: 'Проверяем отправку запроса с обязательными полями',
        body: 'Запрос отправлен. Статья создана',
        tagList: ['expansion', 'legal', 'soon'],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        favorited: false,
        favoritesCount: 0,
        author: {
          username: newUser.username,
          bio: '',
          image: null,
          following: false
        }
      }
    });
  });
  test('Создание статьи -  в теле запроса заполнены все поля, указан несуществующий тег', async () => {
    const params = {
      title: 'Проверка методов создания статьи',
      description: 'Проверяем отправку запроса с обязательными полями',
      body: 'Запрос отправлен. Статья создана',
      tagList: [faker.music.album()]
    };
    const response = await ArticleService.CreateArticle(token, params);

    expect(response.status).toBe(201);
    expect(response.data).toMatchObject({
      article: {
        slug: expect.any(String),
        title: 'Проверка методов создания статьи',
        description: 'Проверяем отправку запроса с обязательными полями',
        body: 'Запрос отправлен. Статья создана',
        tagList: params.tagList,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        favorited: false,
        favoritesCount: 0,
        author: {
          username: newUser.username,
          bio: '',
          image: null,
          following: false
        }
      }
    });

    const responseArticle = await ArticleService.getTags();
    expect(responseArticle.status).toBe(200);
    expect(responseArticle.data.tags).toContain(params.tagList[0]);
  });
});

describe('RealWorld - при создании статьи не передано обязательное поле/не указано значение в обязательном поле', () => {
  let newUser: any;
  let token: string;

  beforeAll(async () => {
    newUser = UserFixture.generateUserCredentials();
    const responseRegisterUser = await AuthService.registerUser(newUser);
    token = responseRegisterUser.data.user.token;
  });

  const params: { name: string; title: string; description: string; body: string; param: string }[] = [
    {
      name: 'Создание статьи - пустое значение поля title',
      param: 'title',
      description: 'test',
      body: 'test test',
      title: ''
    },
    {
      name: 'Создание статьи - пустое значение поля body',
      param: 'body',
      description: 'test',
      body: '',
      title: 'test-test'
    },
    {
      name: 'Создание статьи - пустое значение поля description',
      param: 'description',
      description: '',
      body: 'test test',
      title: 'test-test'
    }
  ];
  test.each(params)('$name', async ({ description, body, title, param }) => {
    const payload = {
      description,
      body,
      title
    };
    const response = await ArticleService.CreateArticle(token, payload);

    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
      errors: {
        [param]: ["can't be empty"]
      }
    });
  });

  const params_1: { name: string; title?: string; description?: string; body?: string; param: string }[] = [
    {
      name: 'Создание статьи - не передано поле title',
      param: 'title',
      description: 'test',
      body: 'test test'
    },
    {
      name: 'Создание статьи - не передано поле body',
      param: 'body',
      description: 'test',
      title: 'test-test'
    },
    {
      name: 'Создание статьи - не передано поле description',
      param: 'description',
      body: 'test test',
      title: 'test-test'
    }
  ];
  test.each(params_1)('$name', async ({ description, body, title, param }) => {
    const payload = {
      description,
      body,
      title
    };
    const response = await ArticleService.CreateArticle(token, payload);

    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
      errors: {
        [param]: ["can't be empty"]
      }
    });
  });
});
