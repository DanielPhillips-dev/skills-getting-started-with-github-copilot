import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { PromptList } from './PromptList';
import { GET_PROMPTS } from '../graphql/prompts';

const mocks = [
  {
    request: { query: GET_PROMPTS },
    result: {
      data: {
        prompts: [
          {
            id: '1',
            name: 'Test Prompt',
            description: 'A test',
            activeVersionId: 'v1',
            createdAt: '',
            updatedAt: '',
          },
        ],
      },
    },
  },
];

test('renders a list of prompts', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <PromptList />
    </MockedProvider>
  );

  // Wait for MockedProvider to resolve the query
  await waitFor(() => expect(screen.getByText('Test Prompt')).toBeInTheDocument());
});
