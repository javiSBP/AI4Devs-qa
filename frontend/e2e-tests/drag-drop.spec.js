// @ts-check
const { test, expect } = require("@playwright/test");
const {
  dragAndDrop,
  findColumnByTitle,
  findCandidateCard,
} = require("./utils/helpers");
const {
  fetchInterviewFlow,
  fetchCandidates,
  updateCandidateStep,
  getInterviewStepByName,
} = require("./utils/api-helpers");

test.describe("Drag and Drop Functionality Tests", () => {
  let interviewFlowData;
  let candidatesData;
  let firstCandidate;

  test.beforeEach(async ({ page }) => {
    // Fetch real data from the API
    interviewFlowData = await fetchInterviewFlow(1);
    candidatesData = await fetchCandidates(1);

    // Get the first candidate for testing
    firstCandidate = candidatesData[0];

    // Navigate to the position details page
    await page.goto("/positions/1");

    // Wait for the content to be fully loaded
    await page.waitForSelector("h2.text-center");
  });

  test("should move a candidate from one stage to another using drag and drop", async ({
    page,
  }) => {
    // Skip test if there are no candidates
    if (!firstCandidate) {
      test.skip();
      return;
    }

    // Determine source and target steps
    const sourceStepName = firstCandidate.currentInterviewStep;

    // Find the next step to move to
    const steps = interviewFlowData.interviewFlow.interviewFlow.interviewSteps;
    const currentStepIndex = steps.findIndex(
      (step) => step.name === sourceStepName
    );
    const nextStepIndex = (currentStepIndex + 1) % steps.length;
    const targetStepName = steps[nextStepIndex].name;

    // Find the source column and candidate card
    const sourceColumn = await findColumnByTitle(page, sourceStepName);
    const candidateCard = await findCandidateCard(
      page,
      firstCandidate.fullName
    );

    // Find the target column
    const targetColumn = await findColumnByTitle(page, targetStepName);

    // Setup a promise to track the API call
    const targetStepId = getInterviewStepByName(
      interviewFlowData,
      targetStepName
    ).id;

    // Capture network requests to verify the API call
    let apiCallMade = false;
    let requestDetails = { url: "", body: {} };

    await page.route("**/candidates/**", async (route) => {
      if (route.request().method() === "PUT") {
        apiCallMade = true;
        requestDetails.url = route.request().url();
        const postData = await route.request().postData();
        if (postData) {
          requestDetails.body = JSON.parse(postData);
        }
      }
      await route.continue();
    });

    // Perform the drag and drop
    await dragAndDrop(page, candidateCard, targetColumn);

    // Allow time for the API call to complete
    await page.waitForTimeout(500);

    // Verify the candidate is no longer in the source column
    const sourceColumnCards = await sourceColumn.locator(".card-title").all();
    let candidateStillInSource = false;
    for (const card of sourceColumnCards) {
      const name = await card.textContent();
      if (name === firstCandidate.fullName) {
        candidateStillInSource = true;
        break;
      }
    }
    expect(candidateStillInSource).toBe(false);

    // Verify the candidate appears in the target column
    const targetColumnCards = await targetColumn.locator(".card-title").all();
    let candidateInTarget = false;
    for (const card of targetColumnCards) {
      const name = await card.textContent();
      if (name === firstCandidate.fullName) {
        candidateInTarget = true;
        break;
      }
    }
    expect(candidateInTarget).toBe(true);

    // Verify the API request was made with correct data
    expect(apiCallMade).toBe(true);
    expect(requestDetails.url).toContain(
      `/candidates/${firstCandidate.candidateId}`
    );
    expect(requestDetails.body).toHaveProperty(
      "applicationId",
      firstCandidate.applicationId
    );
    expect(requestDetails.body).toHaveProperty(
      "currentInterviewStep",
      targetStepId
    );
  });

  test("should verify API request details when updating candidate step", async ({
    page,
  }) => {
    // Skip test if there are no candidates
    if (!firstCandidate) {
      test.skip();
      return;
    }

    // Determine source and target steps
    const sourceStepName = firstCandidate.currentInterviewStep;

    // Find the next step to move to
    const steps = interviewFlowData.interviewFlow.interviewFlow.interviewSteps;
    const currentStepIndex = steps.findIndex(
      (step) => step.name === sourceStepName
    );
    const nextStepIndex = (currentStepIndex + 1) % steps.length;
    const targetStepName = steps[nextStepIndex].name;
    const targetStepId = getInterviewStepByName(
      interviewFlowData,
      targetStepName
    ).id;

    // Create a direct API call to update the candidate
    const updateResponse = await updateCandidateStep(
      firstCandidate.candidateId,
      firstCandidate.applicationId,
      targetStepId
    );

    // Verify the API response
    expect(updateResponse).toBeTruthy();
    expect(updateResponse).toHaveProperty("data");
    expect(updateResponse.data).toHaveProperty(
      "id",
      firstCandidate.candidateId
    );
    expect(updateResponse.data).toHaveProperty(
      "currentInterviewStep",
      targetStepId
    );

    // Refresh the page to see the updated UI
    await page.reload();
    await page.waitForSelector("h2.text-center");

    // Find the target column
    const targetColumn = await findColumnByTitle(page, targetStepName);

    // Verify the candidate appears in the target column
    const targetColumnCards = await targetColumn.locator(".card-title").all();
    let candidateInTargetColumn = false;
    for (const card of targetColumnCards) {
      const name = await card.textContent();
      if (name === firstCandidate.fullName) {
        candidateInTargetColumn = true;
        break;
      }
    }
    expect(candidateInTargetColumn).toBe(true);
  });

  test("should update UI elements correctly after candidate drag and drop", async ({
    page,
  }) => {
    // Skip test if there are no candidates
    if (!firstCandidate) {
      test.skip();
      return;
    }

    // Determine source and target steps
    const sourceStepName = firstCandidate.currentInterviewStep;

    // Find the next step to move to
    const steps = interviewFlowData.interviewFlow.interviewFlow.interviewSteps;
    const currentStepIndex = steps.findIndex(
      (step) => step.name === sourceStepName
    );
    const nextStepIndex = (currentStepIndex + 1) % steps.length;
    const targetStepName = steps[nextStepIndex].name;

    // Get the initial candidate counts
    const sourceColumn = await findColumnByTitle(page, sourceStepName);
    const targetColumn = await findColumnByTitle(page, targetStepName);

    const sourceColumnCardsBefore = await sourceColumn
      .locator(".card-title")
      .all();
    const targetColumnCardsBefore = await targetColumn
      .locator(".card-title")
      .all();

    // Find our test candidate
    const candidateCard = await findCandidateCard(
      page,
      firstCandidate.fullName
    );

    // Perform the drag and drop
    await dragAndDrop(page, candidateCard, targetColumn);

    // Get the post-move candidate counts
    const sourceColumnCardsAfter = await sourceColumn
      .locator(".card-title")
      .all();
    const targetColumnCardsAfter = await targetColumn
      .locator(".card-title")
      .all();

    // Verify the source column lost a candidate
    expect(sourceColumnCardsAfter.length).toBe(
      sourceColumnCardsBefore.length - 1
    );

    // Verify the target column gained a candidate
    expect(targetColumnCardsAfter.length).toBe(
      targetColumnCardsBefore.length + 1
    );

    // Verify candidate is no longer in source column
    let candidateFoundInSource = false;
    for (const card of sourceColumnCardsAfter) {
      if ((await card.textContent()) === firstCandidate.fullName) {
        candidateFoundInSource = true;
        break;
      }
    }
    expect(candidateFoundInSource).toBe(false);

    // Verify candidate is now in target column
    let candidateFoundInTarget = false;
    for (const card of targetColumnCardsAfter) {
      if ((await card.textContent()) === firstCandidate.fullName) {
        candidateFoundInTarget = true;
        break;
      }
    }
    expect(candidateFoundInTarget).toBe(true);
  });
});
