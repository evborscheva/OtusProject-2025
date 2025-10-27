import { AuthService } from '../framework/services';
import { UserFixture } from '../framework/fixtures';

describe('RealWorld - auth', () => {
  let newUser: any;
  let newUser_1: any;

  // console.log('payload', newUser);

  test('Регистрация нового пользователя - указанных имени и email нет у имеющихся пользователей', async () => {
    newUser = UserFixture.generateUserCredentials();
    const response = await AuthService.registerUser(newUser.email, newUser.password, newUser.username);
    // console.log('Response status:', response.status);
    // console.log('Response data:', response.data);

    expect(response.status).toBe(201);
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

  test('Регистрация нового пользователя - указанное имя есть у другого пользователя', async () => {
    newUser_1 = UserFixture.generateUserCredentials();

    const response = await AuthService.registerUser(newUser_1.email, newUser_1.password, newUser.username);

    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
      errors: {
        username: ['user with username already exists']
      }
    });
  });

  test('Регистрация нового пользователя - указанный email есть у другого пользователя', async () => {
    const response = await AuthService.registerUser(newUser.email, newUser_1.password, newUser_1.username);

    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
      errors: {
        email: ['user with email already exists']
      }
    });
  });

  //Для варианта, когда значение одного из полей - пустая строка
  test('Регистрация нового пользователя - пустое значение поля email', async () => {
    const response = await AuthService.registerUser('', newUser_1.password, newUser_1.username);

    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
      errors: {
        email: ["can't be empty"]
      }
    });
  });

  //Вариант, когда одно из полей отсутствует - сервер получает JSON без поля email
  /*
 test('Регистрация нового пользователя - не передано поле email', async () => {
const user = {
email: newUser_1.email,
username newUser_1.username
}
    const response = await AuthService.registerUser(user);
  
    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
    errors: {
        email: [
            "can't be empty"
        ]
    }
})
    
  });
  */

  test('Регистрация нового пользователя - пустое значение поля password', async () => {
    const response = await AuthService.registerUser(newUser_1.email, '', newUser_1.username);

    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
      errors: {
        password: ["can't be empty"]
      }
    });
  });

  test('Регистрация нового пользователя - пустое значение поля username', async () => {
    const response = await AuthService.registerUser(newUser_1.email, newUser_1.password, '');

    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
      errors: {
        username: ["can't be empty"]
      }
    });
  });

  //Для варианта, когда значение одного из полей - пустая строка
  test('Авторизация - пустое значение поля email', async () => {
    const response = await AuthService.loginUser('', newUser.password);

    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
      errors: {
        email: ["can't be empty", 'invalid credentials'],
        password: ['invalid credentials']
      }
    });
  });

  test('Авторизация - пустое значение поля password', async () => {
    const response = await AuthService.loginUser(newUser.email, '');

    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
      errors: {
        email: ['invalid credentials'],
        password: ["can't be empty", 'invalid credentials']
      }
    });
  });

  test('Авторизация - указан неверный пароль', async () => {
    const response = await AuthService.loginUser(newUser.email, '654QWERTasd!');

    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
      errors: {
        email: ['invalid credentials'],
        password: ['invalid credentials']
      }
    });
  });

  test('Авторизация - указан неверный (несуществующий) email', async () => {
    const response = await AuthService.loginUser('ytrreQWER123@test.ru', newUser.password);

    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
      errors: {
        email: ['invalid credentials'],
        password: ['invalid credentials']
      }
    });
  });

  test('Авторизация - указаны верные логин и пароль', async () => {
    const response = await AuthService.loginUser(newUser.email, newUser.password);

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
});
