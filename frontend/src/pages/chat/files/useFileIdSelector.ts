import { useEffect, useReducer } from 'react';
import { JSONObject, useExtensionContext } from 'src/hooks';

type FileIdList = number[];
type Action = { type: 'ADD' | 'REMOVE' | 'TOGGLE'; id: number } | { type: 'INIT'; ids: number[] };

const numberArrayReducer =
  ({ updateContext, context }: ReturnType<typeof useExtensionContext>, extensionId: number) =>
  (idList: FileIdList, action: Action): FileIdList => {
    switch (action.type) {
      case 'INIT':
        idList = action.ids;
        break;
      case 'ADD':
        idList = [...idList, action.id];
        break;
      case 'REMOVE':
        idList = idList.filter((id) => id !== action.id);
        break;
      case 'TOGGLE':
        idList = idList.some((id) => id === action.id) ? idList.filter((id) => id !== action.id) : [...idList, action.id];
        break;
    }

    // If INIT would trigger the updateContext, we would create a loop with the useEffect watching the context below
    if (action.type !== 'INIT') {
      if (!context) context = {};
      context[extensionId] = { ...context[extensionId], fileIdFilter: idList.join(',') };
      updateContext(context);
    }

    return idList;
  };

const hasFileIdFilter = (extensionData: JSONObject | undefined): extensionData is { fileIdFilter: string } => {
  return typeof (extensionData as { fileIdFilter: string } | undefined)?.fileIdFilter === 'string';
};

export const useFileIdSelector = (conversationId: number, extensionId: number) => {
  const extensionContext = useExtensionContext(conversationId);
  const [selectedIDs, dispatch] = useReducer(numberArrayReducer(extensionContext, extensionId), []);
  useEffect(() => {
    const extensionData = extensionContext?.context?.[extensionId];

    const ids = hasFileIdFilter(extensionData)
      ? extensionData.fileIdFilter
          .split(',')
          .map((id) => parseInt(id))
          .filter((id) => Number(id))
      : [];

    dispatch({ type: 'INIT', ids });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extensionContext.context]);

  return {
    selectedIDs,
    selectId: (id: number) => dispatch({ type: 'ADD', id }),
    deselectId: (id: number) => dispatch({ type: 'REMOVE', id }),
    toggleIdSelection: (id: number) => dispatch({ type: 'TOGGLE', id }),
  };
};
