import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutateNewChat } from './state/listOfChats';

export function NewChatRedirect() {
  const createNewConversation = useMutateNewChat();
  const location = useLocation();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;

      // Check if there's an initial prompt in the location state
      const initialPrompt = (location.state as { initialPrompt?: string } | null)?.initialPrompt;

      if (initialPrompt) {
        // If there's an initial prompt, create a new chat and navigate with the prompt
        void createNewConversation.mutate(undefined, {
          onSuccess: (chat) => {
            void navigate(`/chat/${chat.id}`, {
              state: { initialPrompt },
              replace: true,
            });
          },
          onError: () => {
            // Handle error silently
          },
        });
      } else {
        // If no initial prompt, just create a new chat normally
        void createNewConversation.mutate(undefined, {
          onError: () => {
            // Handle error silently
          },
        });
      }
    }
  }, [createNewConversation, location.state, navigate]);

  return null;
}
