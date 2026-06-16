// src/graphql/mutations.ts
import { gql } from "@apollo/client";

export const CREATE_PROMPT = gql`
  mutation CreatePrompt($input: CreatePromptInput!) {
    createPrompt(input: $input) {
      id
      name
      description
      activeVersionId
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PROMPT_VERSION = gql`
  mutation CreatePromptVersion($promptId: ID!, $input: CreatePromptVersionInput!) {
    createPromptVersion(promptId: $promptId, input: $input) {
      id
      promptId
      versionNumber
      template
      status
      createdAt
      updatedAt
    }
  }
`;

export const PROMOTE_PROMPT_VERSION = gql`
  mutation PromotePromptVersion($promptVersionId: ID!) {
    promotePromptVersion(promptVersionId: $promptVersionId) {
      id
      promptId
      versionNumber
      template
      status
      createdAt
      updatedAt
    }
  }
`;

export const RUN_PROMPT = gql`
  mutation RunPrompt($promptVersionId: ID!, $input: RunPromptInput!) {
    runPrompt(promptVersionId: $promptVersionId, input: $input) {
      id
      promptVersionId
      input
      output
      executionTime
      createdAt
    }
  }
`;