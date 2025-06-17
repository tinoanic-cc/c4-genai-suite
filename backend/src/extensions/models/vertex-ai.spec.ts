import { modelExtensionTestSuite } from './model-test.base';
import { VertexAIModelExtension } from './vertex-al';

const instance = {
  invoke: jest.fn().mockReturnThis(),
};

jest.mock('@langchain/google-vertexai', () => {
  return {
    ChatVertexAI: jest.fn().mockImplementation(() => {
      return instance;
    }),
  };
});

describe('VertexAIModelExtension', () => modelExtensionTestSuite(VertexAIModelExtension, instance));
