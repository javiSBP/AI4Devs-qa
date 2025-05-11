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

---

# E2E Test TypeScript Error Fix

## Role

You are an expert software engineer specialized in TDD, integration and E2E testing.

## Context

While implementing E2E tests for the LTI project, a TypeScript error was encountered:

```
Argument of type 'string | null' is not assignable to parameter of type 'string'.
  Type 'null' is not assignable to type 'string'.
```

The error occurred because `route.request().postData()` can return either a string or null, but `JSON.parse()` only accepts strings. This required handling the case where postData might be null.

## Solution

To fix this issue, we needed to:

1. Check if postData is null before parsing
2. Provide a default empty object if postData is null

```javascript
// Before:
requestBody = JSON.parse(await route.request().postData());

// After:
const postData = await route.request().postData();
requestBody = postData ? JSON.parse(postData) : {};

// Alternative fix:
body: JSON.parse(await route.request().postData() || "{}"),
```

---

# E2E Test Artifacts in Version Control

## Role

You are an expert software engineer working on E2E testing configuration.

## Context

After running Playwright E2E tests, several test artifacts were generated:

- Playwright reports in the `playwright-report` directory
- Test results in the `test-results` directory

These auto-generated files should not be tracked in version control.

## Solution

Add the Playwright test artifacts directories to the .gitignore file to prevent them from being committed to the repository.

```diff
# testing
**/coverage
+ **/playwright-report
+ **/test-results

# production
**/build
**/dist
```

---

# E2E tests verification

check if E2E tests are passing

# Fix failing playwright tests

tests did not pass, check @e2e-tests /test-results folder to view where they fail
