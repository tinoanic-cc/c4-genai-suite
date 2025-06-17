import { screen } from '@testing-library/react';
import { addDays, startOfDay } from 'date-fns';
import { describe, expect, it, vi } from 'vitest';
import { ConversationDto } from 'src/api';
import { render } from 'src/pages/admin/test-utils';
import { Conversations } from 'src/pages/chat/Conversations';
import { useAIConversation } from 'src/pages/chat/state';

vi.mock('src/api', () => ({
  useApi: () => ({}),
}));

vi.mock('src/pages/chat/state', () => ({
  useAIConversation: vi.fn(),
}));

describe('Conversations', () => {
  const now = new Date();

  const mockedConversations: ConversationDto[] = [
    { id: 1, createdAt: now, configurationId: 1 },
    { id: 4, createdAt: new Date('2023-10-01'), configurationId: 1 },
    { id: 3, createdAt: startOfDay(addDays(now, -20)), configurationId: 1 },
    { id: 2, createdAt: startOfDay(addDays(now, -2)), configurationId: 1 },
    { id: 5, createdAt: new Date('2022-10-01'), configurationId: 1 },
  ];

  it('should render conversations components sorted by date', () => {
    vi.mocked(useAIConversation).mockImplementation(() => ({
      conversations: mockedConversations,
      removeConversation: vi.fn(),
      setConversation: vi.fn(),
      setConversations: vi.fn(),
      sendMessage: vi.fn(),
      refetch: vi.fn(),
    }));

    render(<Conversations onConversationDeleted={() => undefined} selectedConversationId={null} />);

    const todayElement = screen.getByText('Today');
    const previous7DaysElement = screen.getByText('Previous 7 Days');
    const previous30DaysElement = screen.getByText('Previous 30 Days');
    const year2023Element = screen.getByText('2023');
    const year2022Element = screen.getByText('2022');

    expect(todayElement).toBeInTheDocument();
    expect(previous7DaysElement).toBeInTheDocument();
    expect(previous30DaysElement).toBeInTheDocument();
    expect(year2023Element).toBeInTheDocument();
    expect(year2022Element).toBeInTheDocument();

    // Today is above Previous 7 Days
    expect(todayElement.compareDocumentPosition(previous7DaysElement) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    // Previous 7 Days is above Previous 30 Days
    expect(previous7DaysElement.compareDocumentPosition(previous30DaysElement) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    // Previous 30 Days is above 2023
    expect(previous30DaysElement.compareDocumentPosition(year2023Element) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    // 2023 is above 2022
    expect(year2023Element.compareDocumentPosition(year2022Element) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
