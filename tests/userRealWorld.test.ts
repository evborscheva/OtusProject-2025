import { AuthService } from '../framework/services';
import { UserService } from '../framework/services';
import { UserFixture } from '../framework/fixtures';
import config from '../framework/config/configRealWorld';

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

describe('RealWorld - users', () => {
  let newUser: any;
  let newUser_1: any;
  let token: string;

  beforeAll(async () => {
    newUser = UserFixture.generateUserCredentials();
    const responseRegisterUser = await AuthService.registerUser(newUser.email, newUser.password, newUser.username);
    token = responseRegisterUser.data.user.token;
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
    newUser_1 = UserFixture.generateUserCredentials();

    const params = {
      password: '123QWEasdzxc!!!!',
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
    const params = {
      password: '123QWEasdzxc!!!!',
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
    const params = {
      password: '123QWEasdzxc!!!!',
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

    const getResponse = await UserService.getUser(token);
    expect(getResponse.status).toBe(200);
    expect(getResponse.data).toMatchObject({
      user: {
        email: newUser_1.email,
        token: expect.any(String),
        username: newUser_1.username,
        bio: 'I like to do my homework',
        image: 'https://share.google/images/bqhrXQUgaAp9yoFrH'
      }
    });
  });
});
