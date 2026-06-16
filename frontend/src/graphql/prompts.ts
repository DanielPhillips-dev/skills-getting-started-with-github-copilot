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