import { modelExtensionTestSuite } from './model-test.base';
import { OpenAIModelExtension } from './open-ai';

const instance = {
  invoke: jest.fn().mockReturnThis(),
};

jest.mock('@langchain/openai', () => {
  return {
    ChatOpenAI: jest.fn().mockImplementation(() => {
      return instance;
    }),
  };
});

describe('OpenAIModelExtension', () => modelExtensionTestSuite(OpenAIModelExtension, instance));
