import { Test, TestingModule } from '@nestjs/testing';

describe('CmdController', () => {

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
    }).compile();

  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
    });
  });
});
