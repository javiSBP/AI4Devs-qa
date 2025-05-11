// Mock API responses for E2E tests
const mockInterviewFlow = {
  interviewFlow: {
    interviewFlow: {
      id: 1,
      description: "Standard Software Engineering Interview Process",
      interviewSteps: [
        { id: 1, name: "Initial Screening", orderIndex: 1 },
        { id: 2, name: "Technical Test", orderIndex: 2 },
        { id: 3, name: "Technical Interview", orderIndex: 3 },
        { id: 4, name: "HR Interview", orderIndex: 4 },
      ],
    },
    positionName: "Senior Software Engineer",
  },
};

const mockCandidates = [
  {
    candidateId: 101,
    fullName: "John Smith",
    currentInterviewStep: "Initial Screening",
    averageScore: 3,
    applicationId: 201,
  },
  {
    candidateId: 102,
    fullName: "Jane Doe",
    currentInterviewStep: "Technical Test",
    averageScore: 4,
    applicationId: 202,
  },
  {
    candidateId: 103,
    fullName: "Michael Johnson",
    currentInterviewStep: "Technical Interview",
    averageScore: 5,
    applicationId: 203,
  },
  {
    candidateId: 104,
    fullName: "Emily Davis",
    currentInterviewStep: "HR Interview",
    averageScore: 4,
    applicationId: 204,
  },
];

// Mock API routes that our tests will intercept
const setupApiMocks = async (page) => {
  // Interview flow mock
  await page.route("**/positions/1/interviewFlow", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockInterviewFlow),
    });
  });

  // Candidates mock
  await page.route("**/positions/1/candidates", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockCandidates),
    });
  });

  // Candidate update mock
  await page.route("**/candidates/**", async (route) => {
    if (route.request().method() === "PUT") {
      const requestData = JSON.parse(await route.request().postData());

      // Update the mock data
      const candidateId = parseInt(route.request().url().split("/").pop());
      const candidate = mockCandidates.find(
        (c) => c.candidateId === candidateId
      );

      if (candidate) {
        // Find the step name corresponding to the step id
        const stepId = requestData.currentInterviewStep;
        const stepName =
          mockInterviewFlow.interviewFlow.interviewFlow.interviewSteps.find(
            (step) => step.id === stepId
          )?.name;

        if (stepName) {
          candidate.currentInterviewStep = stepName;
        }
      }

      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Candidate updated successfully",
          data: {
            id: candidateId,
            applicationId: requestData.applicationId,
            currentInterviewStep: requestData.currentInterviewStep,
          },
        }),
      });
    } else {
      route.continue();
    }
  });
};

module.exports = {
  setupApiMocks,
  mockInterviewFlow,
  mockCandidates,
};
