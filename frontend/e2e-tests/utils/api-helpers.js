/**
 * API helper functions for E2E tests
 */

/**
 * Base URL for API
 */
const API_BASE_URL = "http://localhost:3010";

/**
 * Fetches the interview flow for a position
 */
async function fetchInterviewFlow(positionId) {
  const response = await fetch(
    `${API_BASE_URL}/positions/${positionId}/interviewFlow`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch interview flow: ${response.statusText}`);
  }
  return await response.json();
}

/**
 * Fetches candidates for a position
 */
async function fetchCandidates(positionId) {
  const response = await fetch(
    `${API_BASE_URL}/positions/${positionId}/candidates`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch candidates: ${response.statusText}`);
  }
  return await response.json();
}

/**
 * Updates a candidate's interview step
 */
async function updateCandidateStep(
  candidateId,
  applicationId,
  interviewStepId
) {
  const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      applicationId,
      currentInterviewStep: interviewStepId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update candidate: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Gets interview step by id
 */
function getInterviewStepById(interviewFlow, stepId) {
  return interviewFlow.interviewFlow.interviewFlow.interviewSteps.find(
    (step) => step.id === stepId
  );
}

/**
 * Gets interview step by name
 */
function getInterviewStepByName(interviewFlow, stepName) {
  return interviewFlow.interviewFlow.interviewFlow.interviewSteps.find(
    (step) => step.name === stepName
  );
}

module.exports = {
  API_BASE_URL,
  fetchInterviewFlow,
  fetchCandidates,
  updateCandidateStep,
  getInterviewStepById,
  getInterviewStepByName,
};
