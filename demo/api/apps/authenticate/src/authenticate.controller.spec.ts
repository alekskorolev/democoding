import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticateController } from './authenticate.controller';
import { AuthenticateService } from './authenticate.service';

describe('AuthenticateController', () => {
  let authenticateController: AuthenticateController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticateController],
      providers: [AuthenticateService],
    }).compile();

    authenticateController = app.get<AuthenticateController>(AuthenticateController);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      expect(await authenticateController.me()).toBe('Hello World!');
    });
  });
});
