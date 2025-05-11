Feature: Drag and Drop Candidate Between Interview Stages
  As a recruiter
  I want to move candidates between interview stages using drag and drop
  So that I can update their progress in the interview process quickly

  Background:
    Given I am logged in as a recruiter
    And there is a position with id "1" titled "Senior Software Engineer"
    And the position has an interview flow with steps "Initial Screening", "Technical Test", "Technical Interview", "HR Interview"
    And there is a candidate named "John Smith" in the "Initial Screening" stage with id "101"

  Scenario: Move a candidate from one stage to another using drag and drop
    When I navigate to "/positions/1"
    And I drag the candidate "John Smith" from "Initial Screening" to "Technical Test"
    Then the candidate "John Smith" should appear in the "Technical Test" column
    And the candidate "John Smith" should no longer appear in the "Initial Screening" column
    And the backend should receive a PUT request to "/candidates/101" with updated interview step

  Scenario: Verify the API is called correctly when moving a candidate
    When I navigate to "/positions/1"
    And I drag the candidate "John Smith" from "Initial Screening" to "Technical Test"
    Then a PUT request should be sent to "/candidates/101"
    And the request body should contain the correct applicationId
    And the request body should contain the updated interviewStep
    And the API should respond with a 200 status code
    
  Scenario: Verify the UI updates after moving a candidate
    When I navigate to "/positions/1"
    And I drag the candidate "John Smith" from "Initial Screening" to "Technical Test"
    Then I should see the candidate card for "John Smith" in the "Technical Test" column
    And the "Initial Screening" column should not contain the candidate "John Smith"
    And the UI should reflect the change without requiring a page refresh 