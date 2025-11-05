import { AuthService } from '../framework/services';
import { UserFixture } from '../framework/fixtures';

describe('RealWorld - проверки регистрации и авторизации пользователя', () => {
  test('Регистрация нового пользователя - указанных имени и email нет у имеющихся пользователей', async () => {
    const newUser = UserFixture.generateUserCredentials();
    console.log(newUser);
    const response = await AuthService.registerUser(newUser);

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
    const existingUser = UserFixture.generateUserCredentials();
    await AuthService.registerUser(existingUser);

    const newUser = UserFixture.generateUserCredentials();
    const user = {
      email: newUser.email,
      password: newUser.password,
      username: existingUser.username
    };

    const response = await AuthService.registerUser(user);

    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
      errors: {
        username: ['user with username already exists']
      }
    });
  });

  test('Регистрация нового пользователя - указанный email есть у другого пользователя', async () => {
    const existingUser = UserFixture.generateUserCredentials();
    await AuthService.registerUser(existingUser);

    const newUser = UserFixture.generateUserCredentials();
    const user = {
      email: existingUser.email,
      password: newUser.password,
      username: newUser.username
    };
    const response = await AuthService.registerUser(user);

    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
      errors: {
        email: ['user with email already exists']
      }
    });
  });
  test('Авторизация - указан неверный пароль', async () => {
    const existingUser = UserFixture.generateUserCredentials();
    await AuthService.registerUser(existingUser);

    const authUser = {
      email: existingUser.email,
      password: '654QWERTasd!'
    };
    const response = await AuthService.loginUser(authUser);

    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
      errors: {
        email: ['invalid credentials'],
        password: ['invalid credentials']
      }
    });
  });

  test('Авторизация - указан неверный (несуществующий) email', async () => {
    const existingUser = UserFixture.generateUserCredentials();
    await AuthService.registerUser(existingUser);

    const authUser = {
      email: 'ytrreQWER123@test.ru',
      password: existingUser.password
    };
    const response = await AuthService.loginUser(authUser);

    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
      errors: {
        email: ['invalid credentials'],
        password: ['invalid credentials']
      }
    });
  });

  test('Авторизация - указаны верные логин и пароль', async () => {
    const newUser = UserFixture.generateUserCredentials();
    await AuthService.registerUser(newUser);

    const authUser = {
      email: newUser.email,
      password: newUser.password
    };
    const response = await AuthService.loginUser(authUser);

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

describe('RealWorld - регистрация с пустыми значениями полей/не переданными полями', () => {
  const newUser = UserFixture.generateUserCredentials();

  const params: { name: string; param: string; user: any }[] = [
    {
      name: 'Регистрация нового пользователя - пустое значение поля email',
      param: 'email',
      user: {
        email: '',
        password: newUser.password,
        username: newUser.username
      }
    },
    {
      name: 'Регистрация нового пользователя - пустое значение поля password',
      param: 'password',
      user: {
        email: newUser.email,
        password: '',
        username: newUser.username
      }
    },
    {
      name: 'Регистрация нового пользователя - пустое значение поля username',
      param: 'username',
      user: {
        email: newUser.email,
        password: newUser.password,
        username: ''
      }
    }
  ];
  test.each(params)('$name', async ({ user, param }) => {
    const response = await AuthService.registerUser(user);

    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
      errors: {
        [param]: ["can't be empty"]
      }
    });
  });

  const params_1: { name: string; param: string; user: any }[] = [
    {
      name: 'Регистрация нового пользователя - не передано поле email',
      param: 'email',
      user: {
        password: newUser.password,
        username: newUser.username
      }
    },
    {
      name: 'Регистрация нового пользователя - не передано поле password',
      param: 'password',
      user: {
        email: newUser.email,
        username: newUser.username
      }
    },
    {
      name: 'Регистрация нового пользователя - не передано поле username',
      param: 'username',
      user: {
        email: newUser.email,
        password: newUser.password
      }
    }
  ];

  test.each(params_1)('$name', async ({ user, param }) => {
    const response = await AuthService.registerUser(user);

    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
      errors: {
        [param]: ["can't be empty"]
      }
    });
  });
});

describe('RealWorld - авторизация с пустыми значениями полей/не переданными полями', () => {
  const newUser = UserFixture.generateUserCredentials();

  beforeAll(async () => {
    await AuthService.registerUser(newUser);
  });

  const params: { name: string; param_1: string; param_2: string; user: any }[] = [
    {
      name: 'Авторизация - пустое значение поля email',
      param_1: 'email',
      param_2: 'password',
      user: {
        email: '',
        password: newUser.password
      }
    },
    {
      name: 'Авторизация - пустое значение поля password',
      param_1: 'password',
      param_2: 'email',
      user: {
        email: newUser.email,
        password: ''
      }
    }
  ];
  const params_1: { name: string; param_1: string; param_2: string; user: any }[] = [
    {
      name: 'Авторизация - не передано поле email',
      param_1: 'email',
      param_2: 'password',
      user: {
        password: newUser.password
      }
    },
    {
      name: 'Авторизация - не передано поле password',
      param_1: 'password',
      param_2: 'email',
      user: {
        email: newUser.email
      }
    }
  ];

  test.each(params)('$name', async (payload: { user: any; param_1: string; param_2: string }) => {
    const { user, param_1, param_2 } = payload;
    const response = await AuthService.loginUser(user);

    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
      errors: {
        [param_1]: ["can't be empty", 'invalid credentials'],
        [param_2]: ['invalid credentials']
      }
    });
  });

  test.each(params_1)('$name', async (payload: { user: any; param_1: string; param_2: string }) => {
    const { user, param_1, param_2 } = payload;
    const response = await AuthService.loginUser(user);

    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({
      errors: {
        [param_1]: ["can't be empty", 'invalid credentials'],
        [param_2]: ['invalid credentials']
      }
    });
  });
});
