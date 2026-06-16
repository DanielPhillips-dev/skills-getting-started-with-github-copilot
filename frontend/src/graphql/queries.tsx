// src/graphql/queries.ts
import { gql } from "@apollo/client";

export const GET_PROMPTS = gql`
  query GetPrompts {
    prompts {
      id
      name
      description
      activeVersionId
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROMPT = gql`
  query GetPrompt($id: ID!) {
    prompt(id: $id) {
      id
      name
      description
      activeVersionId
      createdAt
      updatedAt
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

export const GET_PROMPT_VERSIONS = gql`
  query GetPromptVersions($promptId: ID!) {
    promptVersions(promptId: $promptId) {
      id
      versionNumber
      template
      status
      createdAt
      updatedAt
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