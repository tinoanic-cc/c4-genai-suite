import { useFieldArray } from 'react-hook-form';
import { MAX_SUGGESTIONS } from 'src/components';
import { texts } from 'src/texts';
import { Forms } from './Forms';
import { Icon } from './Icon';

interface ChatSuggestionsProps {
  // The name of the form element.
  name: string;
}

export function ChatSuggestions(props: ChatSuggestionsProps) {
  const { name } = props;
  const array = useFieldArray({ name });

  return (
    <div className="grid gap-6">
      {array.fields.map((item, index) => (
        <div className="flex flex-row gap-2" key={item.id}>
          <div className="flex w-full flex-col gap-2">
            <div className="flex flex-row gap-2">
              <div className="w-1/2">
                <Forms.Text vertical name={`${name}.${index}.title`} placeholder={texts.common.title} />
              </div>
              <div className="w-1/2">
                <Forms.Text vertical name={`${name}.${index}.subtitle`} placeholder={texts.common.subtitle} />
              </div>
            </div>

            <div className="flex flex-row gap-2">
              <div className="w-full">
                <Forms.Textarea vertical name={`${name}.${index}.text`} placeholder={texts.common.text} />
              </div>
            </div>
          </div>

          <div>
            <button className="btn text-error font-bold" onClick={() => array.remove(index)}>
              <Icon size={16} icon="close" />
            </button>
          </div>
        </div>
      ))}

      {array.fields.length < MAX_SUGGESTIONS && (
        <div>
          <button type="button" className="btn w-auto" onClick={() => array.append({})}>
            <Icon size={16} icon="plus" />
            <span>{texts.theme.suggestionsAdd}</span>
          </button>
        </div>
      )}
    </div>
  );
}
