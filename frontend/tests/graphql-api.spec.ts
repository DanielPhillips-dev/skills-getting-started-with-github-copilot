import { test, expect } from "@playwright/test";

test("can call the GraphQL API", async ({ request }) => {
  const response = await request.post("http://localhost:8080/graphql", {
    data: {
      query: `
        query {
          prompt(id: "1") {
            id
            name
            activeVersionId
            versions{
            id
            versionNumber
            status
            template}
          }
        }
      `,
    },
  });

  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  console.log(JSON.stringify(body, null, 2));

  expect(body.data.prompt).toBeDefined();
});

test("can call the list prompts API", async ({ request }) => {
  const response = await request.post("http://localhost:8080/graphql", {
    data: {
      query: `
        query {
          prompts {
            id
            name
            description
          }
        }
          `,
    }
    
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.data.prompts).toBeInstanceOf(Array);
  expect(body.data.prompts.length).toBe(3);

});

test("can call the createPrompts API", async ({ request }) => {
  const response = await request.post("http://localhost:8080/graphql", {
    data: {
      query: `
        mutation {
          createPrompt(input: {
            name: "API mutated prompt"
            description: "Created by playwright test"
    })
            {
            id
            name
            description
          }
        }
          `,
    },
            });
    const body = await response.json();
expect(body.data.createPrompt.name).toBe("API mutated prompt");
expect(body.data.createPrompt.description).toBe("Created by playwright test");
expect(body.data.createPrompt.id).toBeDefined();


});