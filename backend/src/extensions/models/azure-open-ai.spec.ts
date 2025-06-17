import { AzureOpenAIModelExtension } from './azure-open-ai';
import { modelExtensionTestSuite } from './model-test.base';

const instance = {
  invoke: jest.fn().mockReturnThis(),
};

jest.mock('@langchain/openai', () => {
  return {
    AzureChatOpenAI: jest.fn().mockImplementation(() => {
      return instance;
    }),
  };
});

describe('OpenAIModelExtension', () => modelExtensionTestSuite(AzureOpenAIModelExtension, instance));
