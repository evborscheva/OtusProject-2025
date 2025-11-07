import { AuthService } from '../framework/services';
import { UserService } from '../framework/services';
import { UserFixture } from '../framework/fixtures';
import config from '../framework/config/configRealWorld';
import DatabaseService from '../framework/services/DatabaseService';

describe('RealWorld - выполнение методов без авторизации', () => {
  test('Получение текущего пользователя - пользователь не авторизован', async () => {
    const response = await UserService.getUser();

    expect(response.status).toBe(401);
    // expect(response.data).toBe('unauthorized: invalid or expired token');
  });

  test('Изменение пользователя - пользователь не авторизован', async () => {
    const params = {
      email: '000QWE@test.com',
      bio: 'I like to do my homework',
      username: 'ElenaElena'
    };
    const response = await UserService.updateUser(params);

    expect(response.status).toBe(401);
    //  expect(response.data).toBe('unauthorized: invalid or expired token');
  });
});

describe('RealWorld - проверки изменения пользователя и получения данных о пользователе', () => {
  let newUser: any;
  let token: string;

  beforeEach(async () => {
    newUser = UserFixture.generateUserCredentials();
    const responseRegisterUser = await AuthService.registerUser(newUser);
    token = responseRegisterUser.data.user.token;
  });

  beforeAll(async () => {
    await DatabaseService.connect();
  });

  afterAll(async () => {
    await DatabaseService.disconnect();
  });

  test('Получение данных текущего пользователя', async () => {
    const response = await UserService.getUser(token);

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      user: {
        email: newUser.email,
        token: expect.any(String),
        username: newUser.username,
        bio: '',
        image: null
      }
    });
  });

  test('Обновление текущего пользователя - указанный в запросе email есть у ранее созданного пользователя', async () => {
    const newUser_1 = UserFixture.generateUserCredentials();

    const params = {
      password: newUser_1.password,
      email: config.email,
      bio: 'I like to do my homework',
      username: newUser_1.username,
      image: 'https://share.google/images/bqhrXQUgaAp9yoFrH'
    };
    const response = await UserService.updateUser(params, token);

    expect(response.status).toBe(400);
    expect(response.data).toMatchObject({
      errors: {
        error: ['Failed to update user']
      }
    });
  });

  test('Обновление текущего пользователя - указанный в запросе username есть у ранее созданного пользователя', async () => {
    const newUser_1 = UserFixture.generateUserCredentials();
    const params = {
      password: newUser_1.password,
      email: newUser_1.email,
      bio: 'I like to do my homework',
      username: config.username,
      image: 'https://share.google/images/bqhrXQUgaAp9yoFrH'
    };
    const response = await UserService.updateUser(params, token);

    expect(response.status).toBe(400);
    expect(response.data).toMatchObject({
      errors: {
        error: ['Failed to update user']
      }
    });
  });

  test('Обновление текущего пользователя - указанных в запросе  email и username нет у ранее созданных пользователей', async () => {
    const newUser_1 = UserFixture.generateUserCredentials();
    const params = {
      password: newUser_1.password,
      email: newUser_1.email,
      bio: 'I like to do my homework',
      username: newUser_1.username,
      image: 'https://share.google/images/bqhrXQUgaAp9yoFrH'
    };
    const response = await UserService.updateUser(params, token);

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      user: {
        email: newUser_1.email,
        token: expect.any(String),
        username: newUser_1.username,
        bio: 'I like to do my homework',
        image: 'https://share.google/images/bqhrXQUgaAp9yoFrH'
      }
    });

    const dbUser = await DatabaseService.findUser(newUser_1.username);
    expect(dbUser).toBeDefined();
    expect(dbUser.email).toBe(newUser_1.email);
    expect(dbUser.bio).toBe('I like to do my homework');
    expect(dbUser.password).toBe(newUser_1.password);
    expect(dbUser.image).toBe('https://share.google/images/bqhrXQUgaAp9yoFrH');
  });
});

describe('RealWorld - при обновлении передано пустое значение поля password/email/username', () => {
  const newUser = UserFixture.generateUserCredentials();
  const newUser_1 = UserFixture.generateUserCredentials();
  let token: string;

  beforeAll(async () => {
    const responseRegisterUser = await AuthService.registerUser(newUser);
    token = responseRegisterUser.data.user.token;
  });

  const params: { name: string; param: string; user: any }[] = [
    {
      name: 'Обновление пользователя - пустое значение поля password',
      param: 'password',
      user: {
        password: '',
        email: newUser_1.email,
        bio: 'I like to do my homework',
        username: newUser_1.username,
        image: 'https://share.google/images/bqhrXQUgaAp9yoFrH'
      }
    },
    {
      name: 'Обновление пользователя - пустое значение поля email',
      param: 'email',
      user: {
        password: newUser_1.password,
        email: '',
        bio: 'I like to do my homework',
        username: newUser_1.username,
        image: 'https://share.google/images/bqhrXQUgaAp9yoFrH'
      }
    },
    {
      name: 'Обновление пользователя - пустое значение поля username',
      param: 'username',
      user: {
        password: newUser_1.password,
        email: newUser_1.email,
        bio: 'I like to do my homework',
        username: '',
        image: 'https://share.google/images/bqhrXQUgaAp9yoFrH'
      }
    }
  ];
  test.each(params)('$name', async ({ user, param }) => {
    const response = await UserService.updateUser(user, token);

    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
      errors: {
        [param]: ["can't be empty"]
      }
    });
  });

  describe('RealWorld - при обновлении передано пустое значение поля bio/image', () => {
    let newUser: any;
    let token: string;

    beforeEach(async () => {
      newUser = UserFixture.generateUserCredentials();
      const responseRegisterUser = await AuthService.registerUser(newUser);
      token = responseRegisterUser.data.user.token;
      const params = {
        bio: 'I like to do my homework',
        image: 'https://share.google/images/bqhrXQUgaAp9yoFrH'
      };
      const response = await UserService.updateUser(params, token);

      expect(response.data).toMatchObject({
        user: {
          email: newUser.email,
          token: expect.any(String),
          username: newUser.username,
          bio: 'I like to do my homework',
          image: 'https://share.google/images/bqhrXQUgaAp9yoFrH'
        }
      });
    });

    test('Обновление пользователя - пустое значение поля bio', async () => {
      const params = {
        bio: ''
      };
      const response = await UserService.updateUser(params, token);

      expect(response.status).toBe(200);
      expect(response.data).toMatchObject({
        user: {
          email: newUser.email,
          token: expect.any(String),
          username: newUser.username,
          bio: '',
          image: null
        }
      });

      const dbUser = await DatabaseService.findUser(newUser.username);
      expect(dbUser.email).toBe(newUser.email);
      expect(dbUser.bio).toBe('');
      expect(dbUser.password).toBe(newUser.password);
      expect(dbUser.image).toBeNull();
    });
    test('Обновление пользователя - пустое значение поля image', async () => {
      const params = {
        image: ''
      };
      const response = await UserService.updateUser(params, token);

      expect(response.status).toBe(200);
      expect(response.data).toMatchObject({
        user: {
          email: newUser.email,
          token: expect.any(String),
          username: newUser.username,
          bio: 'I like to do my homework',
          image: ''
        }
      });
      const dbUser = await DatabaseService.findUser(newUser.username);
      expect(dbUser.email).toBe(newUser.email);
      expect(dbUser.bio).toBe('I like to do my homework');
      expect(dbUser.password).toBe(newUser.password);
      expect(dbUser.image).toBe('');
    });
  });
});
