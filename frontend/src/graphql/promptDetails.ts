import { gql } from "@apollo/client";

export const GET_PROMPT = gql`
  query GetPrompt($id: ID!) {
    prompt(id: $id) {
      id
      name
      description
      activeVersionId
      versions {
        id
        versionNumber
        template
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_PROMPT_VERSION = gql`
  mutation CreatePromptVersion($promptId: ID!, $input: CreatePromptVersionInput!) {
    createPromptVersion(promptId: $promptId, input: $input) {
      id
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
      input
      output
      executionTime
      createdAt
    }
  }
`;

export const GET_PROMPT_RUNS = gql`
  query GetPromptRuns($promptVersionId: ID!) {
    promptRuns(promptVersionId: $promptVersionId) {
      id
      input
      output
      executionTime
      createdAt
    }
  }
`;

export const PROMOTE_PROMPT_VERSION = gql`
  mutation PromotePromptVersion($promptVersionId: ID!) {
    promotePromptVersion(promptVersionId: $promptVersionId) {
      id
      versionNumber
      template
      status
      createdAt
      updatedAt
    }
  }
`;
