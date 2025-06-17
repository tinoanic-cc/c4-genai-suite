import { modelExtensionTestSuite } from './model-test.base';
import { OllamaModelExtension } from './ollama';

const instance = {
  invoke: jest.fn().mockReturnThis(),
};

jest.mock('@langchain/ollama', () => {
  return {
    ChatOllama: jest.fn().mockImplementation(() => {
      return instance;
    }),
  };
});
describe('OllamaModelExtension', () => modelExtensionTestSuite(OllamaModelExtension, instance));
