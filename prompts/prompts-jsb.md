# E2E Testing Prompts

## Role

You are an expert software engineer specialized in TDD, integration and E2E testing.

## Context

You have been required to create a couple of E2E test for the LTI project.

1. Test the position interface that is shown on the route /positions/:id.
   The test must verify:

- The title is shown on the top and is correct.
- Each step column for the interview flow must be shown.
- Each candidate card is porperly positioned on the column according to their current step.

2. Test user changing the for a candidate on the route /positions/:id

- Simulate drag'n drop of a candidate card from one column to another.
- Verify that the candidate card is moved to the new column.
- Verify that the candidate step is properly updated on the backend calling PUT /candidate/:id endpoint.

## Requirements

- Use playwright as E2E testing framework. Install it on @frontend.
- Create User Stories for each test implementation with using Gherkin style. Create them on a new /stories directory. Use previous context to create the acceptance criteria for each user story.
- Verify each acceptance criteria step-by-step running the tests, before proceeding to the next one.
- Think and plan each step before acting.

## Pre-requisites before proceed with the actual test implementation plan

- Read README.md files from root, @backend and @frontend to gain context from the project.
- Check project structure.
- Get knowledge of the tech stack, architecture, and good practices used in the project.
- Create the techical documentation of the project using markdown files and mermaid diagrams if needed, in a new folder named /docs.
- Use these docs when needed to fulfill the requirements.
