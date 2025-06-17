import { MistralModelExtension } from './mistral';
import { modelExtensionTestSuite } from './model-test.base';

const instance = {
  invoke: jest.fn().mockReturnThis(),
};

jest.mock('@langchain/mistralai', () => {
  return {
    ChatMistralAI: jest.fn().mockImplementation(() => {
      return instance;
    }),
  };
});

describe('MistralModelExtension', () => modelExtensionTestSuite(MistralModelExtension, instance));
