/**
 * Helper functions for E2E tests
 */

/**
 * Performs drag and drop operation using mouse movements
 * Note: This is needed because Playwright doesn't have built-in drag-and-drop
 * for react-beautiful-dnd which uses custom events
 */
async function dragAndDrop(page, sourceLocator, targetLocator) {
  // Get the source and target elements' bounding boxes
  const sourceRect = await sourceLocator.boundingBox();
  const targetRect = await targetLocator.boundingBox();

  if (!sourceRect || !targetRect) {
    throw new Error("Source or target element not found or not visible");
  }

  // Calculate the center points of source and target
  const sourceX = sourceRect.x + sourceRect.width / 2;
  const sourceY = sourceRect.y + sourceRect.height / 2;
  const targetX = targetRect.x + targetRect.width / 2;
  const targetY = targetRect.y + targetRect.height / 2;

  // Perform the drag and drop operation
  await page.mouse.move(sourceX, sourceY);
  await page.mouse.down();
  await page.mouse.move(targetX, targetY, { steps: 10 }); // Move gradually in 10 steps
  await page.mouse.up();

  // Wait for any animations or state updates to complete
  await page.waitForTimeout(500);
}

/**
 * Finds a column by its title
 */
async function findColumnByTitle(page, title) {
  // Find the column header with the specified title
  const header = page.getByText(title).first();

  // Return the whole column (card component) by going up the DOM
  return header.locator("..").locator("..");
}

/**
 * Finds a candidate card by name
 */
async function findCandidateCard(page, name) {
  return page.getByText(name).first();
}

/**
 * Waits for a network request to a specific URL and returns the request details
 */
async function waitForApiRequest(page, urlPattern, method) {
  const requests = [];

  const removeListener = await page.route(urlPattern, async (route) => {
    if (!method || route.request().method() === method) {
      requests.push({
        url: route.request().url(),
        method: route.request().method(),
        body:
          route.request().method() === "GET"
            ? null
            : JSON.parse(await route.request().postData()),
      });
    }
    await route.continue();
  });

  return {
    requests,
    removeListener,
  };
}

module.exports = {
  dragAndDrop,
  findColumnByTitle,
  findCandidateCard,
  waitForApiRequest,
};
