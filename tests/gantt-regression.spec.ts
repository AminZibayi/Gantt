import { expect, test } from "@playwright/test";

async function openApp(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

test("toolbar tooltips render above header in English and Persian", async ({ page }) => {
  await openApp(page);

  for (const languageButtonName of ["English", "فارسی"]) {
    await page.getByRole("button", { name: languageButtonName }).click();
    const zoomIn = page.getByRole("button", { name: /Zoom In|بزرگ‌نمایی/ });
    await zoomIn.hover();

    const tooltipState = await zoomIn.evaluate((el) => {
      const style = getComputedStyle(el, "::after");
      const btnRect = el.getBoundingClientRect();
      const headerRect = document.querySelector(".app-header")!.getBoundingClientRect();
      return {
        opacity: style.opacity,
        zIndex: Number(style.zIndex || "0"),
        tooltipTop: btnRect.top - parseFloat(style.height || "0"),
        headerBottom: headerRect.bottom,
      };
    });

    expect(tooltipState.opacity).toBe("1");
    expect(tooltipState.zIndex).toBeGreaterThan(100);
    expect(tooltipState.tooltipTop).toBeLessThan(tooltipState.headerBottom);
  }
});

test("Today button scrolls to current date and has no extra tooltip", async ({ page }) => {
  await openApp(page);
  await page.getByRole("button", { name: "English" }).click();

  const timeline = page.locator(".gantt_task");
  await timeline.evaluate((el) => {
    el.scrollLeft = 100000;
  });

  const before = await timeline.evaluate((el) => el.scrollLeft);
  const todayButton = page.getByRole("button", { name: /^Today$/ });
  await expect(todayButton).not.toHaveAttribute("data-tooltip", /.+/);
  await todayButton.click();
  await page.waitForTimeout(200);
  const after = await timeline.evaluate((el) => el.scrollLeft);

  expect(after).toBeLessThan(before);
});

test("Persian RTL keeps scale mirrored and link arrows rendered", async ({ page }) => {
  await openApp(page);
  await page.getByRole("button", { name: "فارسی" }).click();

  const rtl = page.locator(".gantt_rtl");
  await expect(rtl).toBeVisible();

  const monthCells = page.locator(".gantt_scale_line").first().locator(".gantt_scale_cell");
  const first = monthCells.first();
  const last = monthCells.last();
  const firstBox = await first.boundingBox();
  const lastBox = await last.boundingBox();

  expect(firstBox).not.toBeNull();
  expect(lastBox).not.toBeNull();
  expect(firstBox!.x).toBeGreaterThan(lastBox!.x);

  const arrow = page.locator(".gantt_task_link .gantt_link_arrow").first();
  await expect(arrow).toBeVisible();
  const transform = await arrow.evaluate((el) => getComputedStyle(el).transform);
  expect(transform).not.toBe("none");
});
