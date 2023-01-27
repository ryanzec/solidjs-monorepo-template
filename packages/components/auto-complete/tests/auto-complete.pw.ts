import { test, expect, Page } from '@playwright/test';

const urls = {
  single: '/packages/components/auto-complete/single',
  multi: '/packages/components/auto-complete/multi',
  singlePreselected: '/packages/components/auto-complete/single-preselected',
  multiPreselected: '/packages/components/auto-complete/multi-preselected',
  singleAutoShowOptions: '/packages/components/auto-complete/single-auto-show-options',
  multiAutoShowOptions: '/packages/components/auto-complete/multi-auto-show-options',
  singleNoForceSelection: '/packages/components/auto-complete/single-no-force-selection',
  multiNoForceSelection: '/packages/components/auto-complete/multi-no-force-selection',
  singlePlaceholder: '/packages/components/auto-complete/single-placeholder',
  multiPlaceholder: '/packages/components/auto-complete/multi-placeholder',
  singleAsync: '/packages/components/auto-complete/single-async',
  multiAsync: '/packages/components/auto-complete/multi-async',
};

const locators = {
  resetSelectedButton: '[data-id="reset-selected-button"]',
  autoCompleteInput: '[data-id="auto-complete"] [data-id="input"]',
  autoCompleteOptionsContainer: '[data-id="auto-complete"] [data-id="options"]',
  autoCompleteOptions: '[data-id="auto-complete"] [data-id="options"] [data-id*="option"]',
  firstAutoCompleteOption: '[data-id="auto-complete"] [data-id="options"] [data-id*="option"]:nth-child(1)',
  autoCompleteHighlightedOption: '[data-id="auto-complete"] [data-id="options"] [data-id*="highlighted-option"]',
  checkSelectedAutoCompleteValue: '[data-id="check-selected-auto-complete-value"]',
  checkFormValue: '[data-id="check-form-value"]',
  selectedOptions: '[data-id="auto-complete"] [data-id="selected-option"]',
  secondSelectedOptionDeleteIndicator:
    '[data-id="auto-complete"] [data-id="selected-option"]:nth-child(2) [data-id="delete-indicator"]',
  asyncDataLoadingIndicator: '[data-id="auto-complete"] [data-id="async-options-loading"]',
  noOptionsFound: '[data-id="auto-complete"] [data-id*="no-options-found"]',
};

const testSelectedValue = async (page: Page, checkValue: string, isMultiSelect: boolean, errorContext?: string) => {
  if (isMultiSelect) {
    await expect(page.locator(locators.selectedOptions), errorContext).toContainText(checkValue);

    return;
  }

  await expect(page.locator(locators.checkSelectedAutoCompleteValue), errorContext).toContainText(checkValue);
};

const testNoSelectedValue = async (page: Page, isMultiSelect: boolean, errorContext?: string) => {
  if (isMultiSelect) {
    await expect(page.locator(locators.selectedOptions), errorContext).toHaveCount(0);

    return;
  }

  await expect(page.locator(locators.checkSelectedAutoCompleteValue), errorContext).toHaveCount(0);
};

test.describe('auto complete', () => {
  test.describe('core functionality', () => {
    test('focusing the input should not show the list when not configured @component', async ({ page }) => {
      const testUrls = [urls.single, urls.multi];

      for (let i = 0; i < testUrls.length; i++) {
        const loopErrorContext = `failed url: ${testUrls[i]}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();

        await expect(page.locator(locators.autoCompleteOptions), loopErrorContext).toHaveCount(0);
      }
    });

    test('focusing the input shows the list when configured @component', async ({ page }) => {
      const testUrls = [urls.singleAutoShowOptions, urls.multiAutoShowOptions];

      for (let i = 0; i < testUrls.length; i++) {
        const loopErrorContext = `failed url: ${testUrls[i]}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();

        await expect(page.locator(locators.autoCompleteOptions), loopErrorContext).toHaveCount(4);
      }
    });

    test('typing filters the list @component', async ({ page }) => {
      const testUrls = [urls.single, urls.multi];

      for (let i = 0; i < testUrls.length; i++) {
        const loopErrorContext = `failed url: ${testUrls[i]}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('1');

        await expect(page.locator(locators.autoCompleteOptions), loopErrorContext).toHaveCount(1);
        await expect(page.locator(locators.autoCompleteHighlightedOption), loopErrorContext).toHaveCount(0);
      }
    });

    test('using keyboard highlights item @component', async ({ page }) => {
      const testUrls = [urls.single, urls.multi];

      for (let i = 0; i < testUrls.length; i++) {
        const loopErrorContext = `failed url: ${testUrls[i]}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('t');
        await page.locator(locators.autoCompleteInput).press('ArrowDown');
        await page.locator(locators.autoCompleteInput).press('ArrowDown');

        await expect(page.locator(locators.autoCompleteHighlightedOption), loopErrorContext).toHaveText('test2');
      }
    });

    test('using mouse highlights item @component', async ({ page }) => {
      const testUrls = [urls.single, urls.multi];

      for (let i = 0; i < testUrls.length; i++) {
        const loopErrorContext = `failed url: ${testUrls[i]}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('t');
        await page.locator(locators.firstAutoCompleteOption).hover();

        await expect(page.locator(locators.autoCompleteHighlightedOption), loopErrorContext).toHaveText('test1');
      }
    });

    test('selecting an item hides the list @component', async ({ page }) => {
      const testUrls = [urls.single, urls.multi];

      for (let i = 0; i < testUrls.length; i++) {
        const loopErrorContext = `failed url: ${testUrls[i]}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('t');
        await page.locator(locators.autoCompleteInput).press('ArrowDown');
        await page.locator(locators.autoCompleteInput).press('ArrowDown');
        await page.locator(locators.autoCompleteInput).press('Enter');

        await expect(page.locator(locators.autoCompleteOptions), loopErrorContext).toHaveCount(0);
      }
    });

    test('the escape key hides the list @component', async ({ page }) => {
      const testUrls = [urls.single, urls.multi];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('t');
        await page.locator(locators.autoCompleteInput).press('Escape');

        // @todo(!!!) need to figure this out
        // cy.get(selectors.autoCompleteInput).should('not.be.focused');
        await expect(page.locator(locators.autoCompleteOptions), loopErrorContext).toBeHidden();
      }
    });

    test('the escape key works properly when showing items on focus @component', async ({ page }) => {
      const testUrls = [urls.singleAutoShowOptions, urls.multiAutoShowOptions];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('t');
        await page.locator(locators.autoCompleteInput).press('Escape');

        expect(await page.locator(locators.autoCompleteInput).inputValue(), loopErrorContext).toBe('');

        await expect(page.locator(locators.autoCompleteOptionsContainer), loopErrorContext).toBeVisible();
        await page.locator(locators.autoCompleteInput).press('Escape');

        // @todo(!!!) need to figure this out
        // cy.get(selectors.autoCompleteInput).should('not.be.focused');
        await expect(page.locator(locators.autoCompleteOptions), loopErrorContext).toBeHidden();
      }
    });

    test('preselection works @component', async ({ page }) => {
      const testUrls = [urls.singlePreselected, urls.multiPreselected];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        if (!isMultiMode) {
          expect(await page.locator(locators.autoCompleteInput).inputValue(), loopErrorContext).toBe('test1');
        }

        await testSelectedValue(page, 'test1', isMultiMode);
      }
    });

    test('escape clears selection @component', async ({ page }) => {
      const testUrls = [urls.singlePreselected, urls.multiPreselected];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).press('Escape');

        expect(await page.locator(locators.autoCompleteInput).inputValue(), loopErrorContext).toBe('');

        if (!isMultiMode) {
          await testNoSelectedValue(page, isMultiMode, loopErrorContext);
        }
      }
    });

    test('tab hides the list @component', async ({ page }) => {
      const testUrls = [urls.single, urls.multi];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('t');
        await page.locator(locators.autoCompleteInput).press('Tab');

        await expect(page.locator(locators.autoCompleteInput), loopErrorContext).not.toBeFocused();
        await expect(page.locator(locators.autoCompleteOptionsContainer), loopErrorContext).toBeHidden();
      }
    });

    test('tab with nothing selected does nothing @component', async ({ page }) => {
      const testUrls = [urls.single, urls.multi];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('t');
        await page.locator(locators.autoCompleteInput).press('Tab');

        expect(await page.locator(locators.autoCompleteInput).inputValue(), loopErrorContext).toBe('');

        await testNoSelectedValue(page, isMultiMode, loopErrorContext);
      }
    });

    test('tab with selection should select that item @component', async ({ page }) => {
      const testUrls = [urls.single, urls.multi];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('t');
        await page.locator(locators.autoCompleteInput).press('ArrowDown');
        await page.locator(locators.autoCompleteInput).press('Tab');

        expect(await page.locator(locators.autoCompleteInput).inputValue(), loopErrorContext).toBe(
          isMultiMode ? '' : 'test1',
        );

        await testSelectedValue(page, 'test1', isMultiMode, loopErrorContext);
      }
    });

    test('blurring hides the list @component', async ({ page }) => {
      const testUrls = [urls.single, urls.multi];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('t');
        await page.locator(locators.autoCompleteInput).blur();

        await expect(page.locator(locators.autoCompleteInput), loopErrorContext).not.toBeFocused();
        await expect(page.locator(locators.autoCompleteOptions), loopErrorContext).toBeHidden();
      }
    });

    test('blurring with input value and nothing selected does nothing with force selection @component', async ({
      page,
    }) => {
      const testUrls = [urls.single, urls.multi];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('t');
        await page.locator(locators.autoCompleteInput).blur();

        expect(await page.locator(locators.autoCompleteInput).inputValue(), loopErrorContext).toBe('');

        await testNoSelectedValue(page, isMultiMode, loopErrorContext);
      }
    });

    test('blurring with input value and nothing selected uses input value without force selection @component', async ({
      page,
    }) => {
      const testUrls = [urls.singleNoForceSelection, urls.multiNoForceSelection];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('testing new value');
        await page.locator(locators.autoCompleteInput).blur();

        expect(await page.locator(locators.autoCompleteInput).inputValue(), loopErrorContext).toBe(
          isMultiMode ? '' : 'testing new value',
        );

        await testSelectedValue(page, 'testing new value', isMultiMode, loopErrorContext);
      }
    });

    test('blurring with selection should select that value @component', async ({ page }) => {
      const testUrls = [urls.single, urls.multi];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('t');
        await page.locator(locators.autoCompleteInput).press('ArrowDown');
        await page.locator(locators.autoCompleteInput).blur();

        expect(await page.locator(locators.autoCompleteInput).inputValue(), loopErrorContext).toBe(
          isMultiMode ? '' : 'test1',
        );

        await testSelectedValue(page, 'test1', isMultiMode, loopErrorContext);
      }
    });

    test('blurring with nothing selected but with previously selected value should keep previous value @component', async ({
      page,
    }) => {
      const testUrls = [urls.singlePreselected, urls.multiPreselected];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('Backspace');
        await page.locator(locators.autoCompleteInput).blur();

        expect(await page.locator(locators.autoCompleteInput).inputValue(), loopErrorContext).toBe(
          isMultiMode ? '' : 'test1',
        );

        await testSelectedValue(page, 'test1', isMultiMode, loopErrorContext);
      }
    });

    test('blurring with nothing selected but with previously selected value should keep previous value with show items on focused enabled @component', async ({
      page,
    }) => {
      const testUrls = [urls.singleAutoShowOptions, urls.multiAutoShowOptions];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('t');
        await page.locator(locators.firstAutoCompleteOption).click();
        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).press('Backspace');
        await page.locator(locators.autoCompleteInput).blur();

        expect(await page.locator(locators.autoCompleteInput).inputValue(), loopErrorContext).toBe(
          isMultiMode ? '' : 'test1',
        );

        await testSelectedValue(page, 'test1', isMultiMode, loopErrorContext);
      }
    });

    test('placeholder works @component', async ({ page }) => {
      const testUrls = [urls.singlePlaceholder, urls.multiPlaceholder];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await expect(page.locator(locators.autoCompleteInput)).toHaveAttribute('placeholder', 'placeholder');
      }
    });
  });

  test.describe('multi-select mode', () => {
    test('does not show previously selected items @component', async ({ page }) => {
      const testUrls = [urls.multi];

      for (let i = 0; i < testUrls.length; i++) {
        const loopErrorContext = `failed url: ${testUrls[i]}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();

        await expect(page.locator(locators.autoCompleteOptions), loopErrorContext).toHaveCount(0);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).press('ArrowDown');
        await page.locator(locators.autoCompleteInput).press('Enter');
        await page.locator(locators.autoCompleteInput).press('ArrowDown');

        await expect(page.locator(locators.autoCompleteOptions, { hasText: 'test1' }), loopErrorContext).toHaveCount(0);
      }
    });

    test('can selected multiple items @component', async ({ page }) => {
      const testUrls = [urls.multi];

      for (let i = 0; i < testUrls.length; i++) {
        const loopErrorContext = `failed url: ${testUrls[i]}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();

        await expect(page.locator(locators.autoCompleteOptions), loopErrorContext).toHaveCount(0);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).press('ArrowDown');
        await page.locator(locators.autoCompleteInput).press('Enter');
        await page.locator(locators.autoCompleteInput).press('ArrowDown');
        await page.locator(locators.autoCompleteInput).press('Enter');

        await expect(page.locator(locators.selectedOptions), loopErrorContext).toHaveCount(2);
        await expect(page.locator(locators.selectedOptions, { hasText: 'test1' }), loopErrorContext).toHaveCount(1);
        await expect(page.locator(locators.selectedOptions, { hasText: 'test2' }), loopErrorContext).toHaveCount(1);
      }
    });

    test('delete selected item works @component', async ({ page }) => {
      const testUrls = [urls.multi];

      for (let i = 0; i < testUrls.length; i++) {
        const loopErrorContext = `failed url: ${testUrls[i]}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();

        await expect(page.locator(locators.autoCompleteOptions), loopErrorContext).toHaveCount(0);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).press('ArrowDown');
        await page.locator(locators.autoCompleteInput).press('Enter');
        await page.locator(locators.autoCompleteInput).press('ArrowDown');
        await page.locator(locators.autoCompleteInput).press('Enter');
        await page.locator(locators.secondSelectedOptionDeleteIndicator).click();

        await expect(page.locator(locators.selectedOptions), loopErrorContext).toHaveCount(1);
        await expect(page.locator(locators.selectedOptions, { hasText: 'test1' }), loopErrorContext).toHaveCount(1);
      }
    });

    test('delete selected item shows back in list @component', async ({ page }) => {
      const testUrls = [urls.multi];

      for (let i = 0; i < testUrls.length; i++) {
        const loopErrorContext = `failed url: ${testUrls[i]}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();

        await expect(page.locator(locators.autoCompleteOptions), loopErrorContext).toHaveCount(0);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).press('ArrowDown');
        await page.locator(locators.autoCompleteInput).press('Enter');
        await page.locator(locators.autoCompleteInput).press('ArrowDown');
        await page.locator(locators.autoCompleteInput).press('Enter');
        await page.locator(locators.secondSelectedOptionDeleteIndicator).click();
        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('t');

        await expect(page.locator(locators.autoCompleteOptions), loopErrorContext).toHaveCount(3);
        await expect(page.locator(locators.autoCompleteOptions, { hasText: 'test2' }), loopErrorContext).toHaveCount(1);
      }
    });

    test('available items remain shown after selecting item with clicking when configured @component', async ({
      page,
    }) => {
      const testUrls = [urls.multiAutoShowOptions];

      for (let i = 0; i < testUrls.length; i++) {
        const loopErrorContext = `failed url: ${testUrls[i]}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).press('ArrowDown');
        await page.locator(locators.firstAutoCompleteOption).click();

        await expect(page.locator(locators.autoCompleteOptionsContainer), loopErrorContext).toBeVisible();
        await expect(page.locator(locators.autoCompleteOptions), loopErrorContext).toHaveCount(3);
      }
    });

    test('available items remain shown after selecting item with enter when configured @component', async ({
      page,
    }) => {
      const testUrls = [urls.multiAutoShowOptions];

      for (let i = 0; i < testUrls.length; i++) {
        const loopErrorContext = `failed url: ${testUrls[i]}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).press('ArrowDown');
        await page.locator(locators.autoCompleteInput).press('Enter');

        await expect(page.locator(locators.autoCompleteOptionsContainer), loopErrorContext).toBeVisible();
        await expect(page.locator(locators.autoCompleteOptions), loopErrorContext).toHaveCount(3);
      }
    });
  });

  test.describe('async item retrieval', () => {
    test('no option does not show up while the debounce is wait to be processed @component', async ({ page }) => {
      const testUrls = [urls.singleAsync, urls.multiAsync];

      for (let i = 0; i < testUrls.length; i++) {
        const loopErrorContext = `failed url: ${testUrls[i]}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('t');

        // we need to limit the timeout in the case as the no options found would go away when the debounce
        // async call is executed so we want to make sure the no options is not visible before then
        await expect(page.locator(locators.noOptionsFound), loopErrorContext).toHaveCount(0, { timeout: 50 });
      }
    });

    test('works @component @slow', async ({ page }) => {
      // we need a higher timeout for this test because we are testing code that has a built-in delay of 1 second
      // for each iteration to test the async functionality
      test.setTimeout(30000);

      const testUrls = [urls.singleAsync, urls.multiAsync];

      for (let i = 0; i < testUrls.length; i++) {
        const loopErrorContext = `failed url: ${testUrls[i]}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('t');

        await expect(page.locator(locators.asyncDataLoadingIndicator), loopErrorContext).toHaveCount(1);
        await expect(page.locator(locators.autoCompleteOptions), loopErrorContext).toHaveCount(4);
      }
    });
  });
});
