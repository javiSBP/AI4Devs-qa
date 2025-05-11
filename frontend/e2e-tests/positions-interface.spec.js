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

  test("should verify candidate card display in columns", async ({ page }) => {
    // Get all candidates that are actually visible in the UI
    const allVisibleCandidates = new Map();

    // First, build a map of all visible candidates and their columns
    for (const step of interviewFlowData.interviewFlow.interviewFlow
      .interviewSteps) {
      const column = await findColumnByTitle(page, step.name);

      // Get the candidate cards in this column
      const candidateCards = await column
        .locator(".card-body .card-title")
        .all();

      for (const card of candidateCards) {
        const name = await card.textContent();
        allVisibleCandidates.set(name, step.name);
      }
    }

    // Now verify that at least some candidates from our API are visible somewhere
    const apiCandidateNames = candidatesData.map((c) => c.fullName);

    let foundAtLeastOne = false;

    for (const candidateName of apiCandidateNames) {
      if (allVisibleCandidates.has(candidateName)) {
        foundAtLeastOne = true;
        // We've found a candidate from the API in the UI
      }
    }

    // At a minimum, verify that at least one candidate from the API is visible
    expect(foundAtLeastOne).toBe(true);
  });

  test("each candidate card should display the candidate name", async ({
    page,
  }) => {
    // Get all candidate cards
    const candidateCards = await page.locator(".card-title").all();

    // Skip test if no cards are present
    if (candidateCards.length === 0) {
      test.skip();
      return;
    }

    // Check that all cards have a name
    for (const card of candidateCards) {
      const name = await card.textContent();
      expect(name).toBeTruthy();
    }
  });
});
