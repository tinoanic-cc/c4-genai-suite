import { CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { SourceDto } from '../../../controllers/shared';
import { getDataFromC4Json } from './c4-json.type';

export type MCPText = { type: 'text'; text: string };
export type TransformedResponse = { content: MCPText[]; sources: SourceDto[] };

export function transformMCPToolResponse(res: z.infer<typeof CallToolResultSchema>): TransformedResponse {
  const textContent = res.content.filter((x) => x.type === 'text');
  return res.content
    .filter((x) => x.type === 'resource')
    .reduce(
      (prev, curr) => {
        const { mimeType, text } = curr.resource;
        const data = getDataFromC4Json({ mimeType, text });
        if (data) {
          prev.sources.push(data.source);
          prev.content.push(data.text);
        }

        return prev;
      },
      { content: textContent, sources: [] as SourceDto[] } as TransformedResponse,
    );
}
