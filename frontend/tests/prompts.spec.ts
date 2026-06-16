import { test, expect } from "@playwright/test";

test("loads prompts from GraphQL", async ({ page }) => {
  await page.route("**/graphql", async (route) => {
    const request = route.request();
    const postData = request.postDataJSON();

    console.log(postData);

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          prompts: [
            {
              id: "1",
              name: "Test Prompt",
              description: "Created by DP using PW",
            },
          ],
        },
      }),
    });
  });

  await page.goto("http://localhost:5173");

  await expect(page.getByText("Test Prompt")).toBeVisible();
  await expect(page.getByText("Created by Playwright")).toBeVisible();
});