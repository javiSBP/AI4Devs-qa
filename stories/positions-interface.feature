Feature: Position Interview Flow Interface
  As a recruiter
  I want to view the interview flow for a specific position
  So that I can track candidates through different interview stages

  Background:
    Given I am logged in as a recruiter
    And there is a position with id "1" titled "Senior Software Engineer"
    And the position has an interview flow with steps "Initial Screening", "Technical Test", "Technical Interview", "HR Interview"
    And there are candidates at different steps in the interview process

  Scenario: View position interface with interview flow columns
    When I navigate to "/positions/1"
    Then I should see "Senior Software Engineer" as the position title
    And I should see 4 stage columns
    And I should see a column titled "Initial Screening"
    And I should see a column titled "Technical Test"
    And I should see a column titled "Technical Interview"
    And I should see a column titled "HR Interview"
    And each candidate should be in their correct interview step column

  Scenario: Verify candidate cards are displayed in the correct columns
    When I navigate to "/positions/1"
    Then candidates in the "Initial Screening" step should be displayed in the "Initial Screening" column
    And candidates in the "Technical Test" step should be displayed in the "Technical Test" column
    And candidates in the "Technical Interview" step should be displayed in the "Technical Interview" column
    And candidates in the "HR Interview" step should be displayed in the "HR Interview" column
    And each candidate card should display the candidate's name 