import { useEventListener } from '@mantine/hooks';
import { RefObject, useEffect, useState } from 'react';

const SCROLL_TRESHOLD = 200;

export const useScrollToBottom = (instantScrollTiggers: unknown[], animatedScrollTriggers: unknown[]) => {
  const [showButton, setShowButton] = useState(false);
  const messagesContainerRef = useEventListener<keyof HTMLElementEventMap, HTMLDivElement>('scroll', () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;

    const isAtBottom = scrollHeight - scrollTop - clientHeight <= SCROLL_TRESHOLD;
    setShowButton(!isAtBottom);
  });
  const scrollToBottom = (instant?: boolean) =>
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current?.scrollHeight,
      behavior: instant ? 'instant' : 'smooth',
    });
  useEffect(() => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;

    const isAtBottom = scrollHeight - scrollTop - clientHeight <= SCROLL_TRESHOLD;
    setShowButton(!isAtBottom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, animatedScrollTriggers);
  useEffect(() => {
    scrollToBottom(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, instantScrollTiggers);
  return {
    canScrollToBottom: showButton,
    scrollToBottom,
    containerRef: messagesContainerRef as RefObject<HTMLDivElement>,
  };
};
