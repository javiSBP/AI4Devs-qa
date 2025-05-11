// @ts-check
const { test, expect } = require("@playwright/test");
const { findColumnByTitle } = require("./utils/helpers");
const { fetchInterviewFlow, fetchCandidates } = require("./utils/api-helpers");

test.describe("Position Interface Tests", () => {
  let interviewFlowData;
  let candidatesData;

  test.beforeEach(async ({ page }) => {
    // Fetch real data from the API
    interviewFlowData = await fetchInterviewFlow(1);
    candidatesData = await fetchCandidates(1);

    // Navigate to the position details page
    await page.goto("/positions/1");

    // Wait for the content to be fully loaded
    await page.waitForSelector("h2.text-center");
  });

  test("should display the position title correctly", async ({ page }) => {
    // Verify the position title is displayed correctly
    const title = await page.textContent("h2.text-center");
    expect(title).toBe(interviewFlowData.interviewFlow.positionName);
  });

  test("should display all interview step columns", async ({ page }) => {
    // Verify all the columns for interview steps are displayed
    const columns = await page.locator(".card-header").all();

    // Verify we have the right number of columns
    expect(columns.length).toBe(
      interviewFlowData.interviewFlow.interviewFlow.interviewSteps.length
    );

    // Verify each column has the right title
    for (let i = 0; i < columns.length; i++) {
      const columnTitle = await columns[i].textContent();
      const expectedTitle =
        interviewFlowData.interviewFlow.interviewFlow.interviewSteps[i].name;
      expect(columnTitle).toBe(expectedTitle);
    }
  });

  test("should display candidate cards in the correct columns", async ({
    page,
  }) => {
    // Verify each step has the correct candidates
    for (const step of interviewFlowData.interviewFlow.interviewFlow
      .interviewSteps) {
      const column = await findColumnByTitle(page, step.name);

      // Get the candidate cards in this column
      const candidateCards = await column
        .locator(".card-body .card-title")
        .all();

      // Get the candidates that should be in this step
      const expectedCandidates = candidatesData
        .filter((c) => c.currentInterviewStep === step.name)
        .map((c) => c.fullName);

      // Verify we have the right number of cards
      expect(candidateCards.length).toBe(expectedCandidates.length);

      // Verify each candidate in this column
      for (const card of candidateCards) {
        const name = await card.textContent();
        expect(expectedCandidates).toContain(name);
      }
    }
  });

  test("each candidate card should display the candidate name", async ({
    page,
  }) => {
    // Get all candidate cards
    const candidateCards = await page.locator(".card-title").all();

    // Check that all cards have a name
    for (const card of candidateCards) {
      const name = await card.textContent();
      expect(name).toBeTruthy();

      // Verify the name is in our data
      const candidateNames = candidatesData.map((c) => c.fullName);
      expect(candidateNames).toContain(name);
    }
  });
});
