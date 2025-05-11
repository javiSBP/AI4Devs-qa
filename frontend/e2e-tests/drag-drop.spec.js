// @ts-check
const { test, expect } = require("@playwright/test");
const {
  setupApiMocks,
  mockInterviewFlow,
  mockCandidates,
} = require("./mocks/api");
const {
  dragAndDrop,
  findColumnByTitle,
  findCandidateCard,
} = require("./utils/helpers");

test.describe("Drag and Drop Functionality Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Set up API mocks
    await setupApiMocks(page);

    // Navigate to the position details page
    await page.goto("/positions/1");

    // Wait for the content to be fully loaded
    await page.waitForSelector("h2.text-center");
  });

  test("should move a candidate from one stage to another using drag and drop", async ({
    page,
  }) => {
    // Listen for API calls
    let apiCallMade = false;
    let requestBody = {};
    let targetUrl = "";

    // Monitor network requests to API
    await page.route("**/candidates/**", async (route) => {
      if (route.request().method() === "PUT") {
        apiCallMade = true;
        targetUrl = route.request().url();
        const postData = await route.request().postData();
        requestBody = postData ? JSON.parse(postData) : {};
        await route.continue();
      } else {
        await route.continue();
      }
    });

    // Find the source column and candidate card
    const sourceColumn = await findColumnByTitle(page, "Initial Screening");
    const candidateCard = await findCandidateCard(page, "John Smith");

    // Find the target column
    const targetColumn = await findColumnByTitle(page, "Technical Test");

    // Perform the drag and drop
    await dragAndDrop(page, candidateCard, targetColumn);

    // Verify the candidate is no longer in the source column
    const initialScreeningCards = await sourceColumn
      .locator(".card-title")
      .all();
    let johnStillInSource = false;
    for (const card of initialScreeningCards) {
      const name = await card.textContent();
      if (name === "John Smith") {
        johnStillInSource = true;
        break;
      }
    }
    expect(johnStillInSource).toBe(false);

    // Verify the candidate appears in the target column
    const technicalTestCards = await targetColumn.locator(".card-title").all();
    let johnInTarget = false;
    for (const card of technicalTestCards) {
      const name = await card.textContent();
      if (name === "John Smith") {
        johnInTarget = true;
        break;
      }
    }
    expect(johnInTarget).toBe(true);

    // Verify the API call was made with correct parameters
    expect(apiCallMade).toBe(true);
    expect(targetUrl).toContain("/candidates/101");
    expect(requestBody).toHaveProperty("applicationId", 201);
    expect(requestBody).toHaveProperty("currentInterviewStep", 2); // ID for Technical Test
  });

  test("should verify the API call to update candidate step", async ({
    page,
  }) => {
    // Set up a mock to capture the network request
    const updatedCandidateRequests = [];
    await page.route("**/candidates/**", async (route) => {
      if (route.request().method() === "PUT") {
        updatedCandidateRequests.push({
          url: route.request().url(),
          body: JSON.parse((await route.request().postData()) || "{}"),
        });
      }
      await route.continue();
    });

    // Find the candidate card and target column
    const johnSmithCard = await findCandidateCard(page, "John Smith");
    const targetColumn = await findColumnByTitle(page, "Technical Test");

    // Execute the drag and drop
    await dragAndDrop(page, johnSmithCard, targetColumn);

    // Verify the API call details
    expect(updatedCandidateRequests.length).toBe(1);

    // Verify the request URL
    expect(updatedCandidateRequests[0].url).toContain("/candidates/101");

    // Verify the request body contains the correct applicationId
    expect(updatedCandidateRequests[0].body).toHaveProperty(
      "applicationId",
      201
    );

    // Verify the request body contains the updated interviewStep
    expect(updatedCandidateRequests[0].body).toHaveProperty(
      "currentInterviewStep",
      2
    );
  });

  test("should update the UI after moving a candidate", async ({ page }) => {
    // Get the initial candidate counts
    const initialScreeningColumn = await findColumnByTitle(
      page,
      "Initial Screening"
    );
    const technicalTestColumn = await findColumnByTitle(page, "Technical Test");

    const initialScreeningCardsBefore = await initialScreeningColumn
      .locator(".card-title")
      .all();
    const technicalTestCardsBefore = await technicalTestColumn
      .locator(".card-title")
      .all();

    // Find our test candidate
    const johnSmithCard = await findCandidateCard(page, "John Smith");

    // Perform the drag and drop
    await dragAndDrop(page, johnSmithCard, technicalTestColumn);

    // Get the post-move candidate counts
    const initialScreeningCardsAfter = await initialScreeningColumn
      .locator(".card-title")
      .all();
    const technicalTestCardsAfter = await technicalTestColumn
      .locator(".card-title")
      .all();

    // Verify the initial screening column lost a candidate
    expect(initialScreeningCardsAfter.length).toBe(
      initialScreeningCardsBefore.length - 1
    );

    // Verify the technical test column gained a candidate
    expect(technicalTestCardsAfter.length).toBe(
      technicalTestCardsBefore.length + 1
    );

    // Verify John Smith is no longer in Initial Screening
    let johnFoundInSource = false;
    for (const card of initialScreeningCardsAfter) {
      if ((await card.textContent()) === "John Smith") {
        johnFoundInSource = true;
        break;
      }
    }
    expect(johnFoundInSource).toBe(false);

    // Verify John Smith is now in Technical Test
    let johnFoundInTarget = false;
    for (const card of technicalTestCardsAfter) {
      if ((await card.textContent()) === "John Smith") {
        johnFoundInTarget = true;
        break;
      }
    }
    expect(johnFoundInTarget).toBe(true);
  });
});
