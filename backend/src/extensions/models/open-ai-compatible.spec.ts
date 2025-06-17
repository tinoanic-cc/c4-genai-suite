import { modelExtensionTestSuite } from './model-test.base';
import { OpenAICompatibleModelExtension } from './open-ai-compatible';

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

describe('OpenAICompatibleModelExtension', () => modelExtensionTestSuite(OpenAICompatibleModelExtension, instance));
