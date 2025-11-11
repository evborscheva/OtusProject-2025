import DatabaseService from './framework/services/DatabaseService';

afterAll(async () => {
  await DatabaseService.disconnect();
});
