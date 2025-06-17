import { SourceDto } from '../../../controllers/shared';
import { MCPText } from './transformer';

export type C4JsonType = {
  kind: string;
  version: string;
  data: {
    text: string;
    original: string;
    id: string;
    score: number;
    region: {
      bounding_boxes: {
        left: number;
        top: number;
        width: number;
        height: number;
        page: number;
      }[];
    };
    metadata: {
      uri: string;
      mime_type: string;
      attributes: Record<string, any>;
    };
  };
};

const getDistinctPages = (regions: C4JsonType['data']['region']): string => {
  const pages = Array.from(new Set(regions.bounding_boxes.map((x) => x.page)));
  return pages.join(',');
};

export const convertC4JsonToText = (type: C4JsonType): { type: 'text'; text: string } => {
  return { type: 'text', text: type.data.text };
};

export const convertC4JsonToSource = (type: C4JsonType): SourceDto => {
  const metadata = type.data.metadata;
  return {
    title: type.data.id,
    identity: {
      fileName: type.data.id,
      sourceSystem: 'Sherloq',
      uniquePathOrId: type.data.id,
      // Link to tool proxy which shows the uri
      //link: type.data.metadata.uri,
      mimeType: metadata.mime_type,
    },
    metadata: {
      ...(metadata.attributes ?? {}),
      page: getDistinctPages(type.data.region),
    },
  };
};

export const getDataFromC4Json = ({
  mimeType,
  text,
}: {
  mimeType?: string;
  text: unknown;
}): { text: MCPText; source: SourceDto } | undefined => {
  if (mimeType === 'application/x-c4-json-v1') {
    const sourceData = JSON.parse(text as string) as C4JsonType;
    return {
      text: convertC4JsonToText(sourceData),
      source: convertC4JsonToSource(sourceData),
    };
  }

  return undefined;
};
