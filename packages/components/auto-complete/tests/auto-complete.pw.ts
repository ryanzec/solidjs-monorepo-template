import { test, expect, Page } from '@playwright/test';

import { playwrightUtils } from '$/utils/playwright';

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
  singleInForm: '/packages/components/auto-complete/single-in-form',
  multiInForm: '/packages/components/auto-complete/multi-in-form',
  singleInFormAutoShowOptions: '/packages/components/auto-complete/single-in-form-auto-show-options',
  multiInFormAutoShowOptions: '/packages/components/auto-complete/multi-in-form-auto-show-options',
  singleFormattedSelectables: '/packages/components/auto-complete/single-formatted-selectables',
  multiFormattedSelectables: '/packages/components/auto-complete/multi-formatted-selectables',
  singleFormattedSelectablesRemoveDuplicateSelect:
    '/packages/components/auto-complete/single-formatted-selectables-remove-duplicate-select',
};

const locators = {
  resetSelectedButton: '[data-id="reset-selected-button"]',
  setSelectedButton: '[data-id="set-selected-button"]',
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
  asyncDataBeforeThreshold: '[data-id="auto-complete"] [data-id="async-options-before-threshold"]',
  noOptionsFound: '[data-id="auto-complete"] [data-id*="no-options-found"]',
  inputIconIndicator: '[data-id="auto-complete"] [data-id="input-icon-indicator"]',
  manualSelectedOptions: '[data-id="manual-selected-options"]',
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

        await expect(page.locator(locators.autoCompleteInput), loopErrorContext).toHaveAttribute(
          'placeholder',
          'placeholder',
        );
      }
    });

    test(`setting the selected value form outside the component is reflected in the component @component`, async ({
      page,
    }) => {
      // multi select does not display anything in the input when something is selected
      const testUrls = [urls.single];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.setSelectedButton).click();

        await expect(await page.locator(locators.autoCompleteInput).inputValue(), loopErrorContext).toBe('tes4');
        await testSelectedValue(page, 'tes4', isMultiMode, loopErrorContext);
      }
    });

    test(`clearing the selected value form outside the component is reflected in the component @component`, async ({
      page,
    }) => {
      // multi select does not display anything in the input when something is selected
      const testUrls = [urls.single];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.setSelectedButton).click();
        await page.locator(locators.resetSelectedButton).click();

        await expect(await page.locator(locators.autoCompleteInput).inputValue(), loopErrorContext).toBe('');
        await testNoSelectedValue(page, isMultiMode, loopErrorContext);
      }
    });

    test(`highlight option and then clearing the input and blur should not select that last highlighted option @component`, async ({
      page,
    }) => {
      // multi select does not display anything in the input when something is selected
      const testUrls = [urls.single];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).type('t');
        await page.locator(locators.autoCompleteInput).press('ArrowDown');
        await page.locator(locators.autoCompleteInput).press('Backspace');

        // validate no options are visible which means that nothing should be selected
        await expect(page.locator(locators.autoCompleteOptions), loopErrorContext).toHaveCount(0);

        await page.locator(locators.autoCompleteInput).blur();

        await expect(await page.locator(locators.autoCompleteInput).inputValue(), loopErrorContext).toBe('');
      }
    });

    test(`input icon indicator work when there is no value @component`, async ({ page }) => {
      // multi select does not display anything in the input when something is selected
      const testUrls = [urls.singleNoForceSelection, urls.multiNoForceSelection];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.inputIconIndicator).click();

        await expect(page.locator(locators.autoCompleteInput), loopErrorContext).toBeFocused();
      }
    });

    test(`using the keyboard to select when list is not visible should make list visible @component`, async ({
      page,
    }) => {
      // multi select does not display anything in the input when something is selected
      const testUrls = [urls.single, urls.multi];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).press('ArrowDown');

        await expect(page.locator(locators.autoCompleteInput), loopErrorContext).toBeFocused();
        await expect(page.locator(locators.autoCompleteOptionsContainer), loopErrorContext).toBeVisible();
      }
    });
  });

  test.describe('single-select mode', () => {
    test(`selecting a value should not filter that value out @component`, async ({ page }) => {
      // multi select does not display anything in the input when something is selected
      const testUrls = [urls.singleAutoShowOptions];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).type('t');
        await page.locator(locators.autoCompleteInput).press('ArrowDown');
        await page.locator(locators.autoCompleteInput).blur();
        await page.locator(locators.autoCompleteInput).focus();
        await page.locator(locators.autoCompleteInput).press('Backspace');

        await expect(page.locator(locators.autoCompleteOptions), loopErrorContext).toHaveCount(2);
      }
    });

    test(`input icon indicator should work when there is a selected value @component`, async ({ page }) => {
      // multi select does not display anything in the input when something is selected
      const testUrls = [urls.singleNoForceSelection];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).type('t');
        await page.locator(locators.autoCompleteInput).press('ArrowDown');
        await page.locator(locators.autoCompleteInput).blur();
        await page.locator(locators.inputIconIndicator).click();

        await testNoSelectedValue(page, isMultiMode, loopErrorContext);
        await expect(page.locator(locators.autoCompleteInput), loopErrorContext).toBeFocused();
      }
    });
  });

  test.describe('multi-select mode core functionality', () => {
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

    test(`input icon indicator should work when there is a selected value @component`, async ({ page }) => {
      // multi select does not display anything in the input when something is selected
      const testUrls = [urls.multiNoForceSelection];

      for (let i = 0; i < testUrls.length; i++) {
        const isMultiMode = testUrls[i].includes('/multi');
        const loopErrorContext = `failed url: ${testUrls[i]}${isMultiMode ? '(multi mode)' : ''}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('testing new value');
        await page.locator(locators.autoCompleteInput).press('ArrowDown');
        await page.locator(locators.autoCompleteInput).press('Enter');
        await page.locator(locators.inputIconIndicator).click();

        await testSelectedValue(page, 'testing new value', isMultiMode, loopErrorContext);
        await expect(page.locator(locators.autoCompleteInput)).toBeFocused();
      }
    });
  });

  test.describe('show selected option in list of options', () => {
    test('selected value still show up in list of options @component', async ({ page }) => {
      const testUrls = [urls.multiFormattedSelectables];

      for (let i = 0; i < testUrls.length; i++) {
        const loopErrorContext = `failed url: ${testUrls[i]}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();

        await expect(page.locator(locators.autoCompleteOptions), loopErrorContext).toHaveCount(0);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).press('ArrowDown');
        await page.locator(locators.autoCompleteInput).press('Enter');
        await page.locator(locators.autoCompleteInput).press('ArrowDown');

        await expect(page.locator(locators.autoCompleteOptions, { hasText: 'test1' }), loopErrorContext).toHaveCount(1);
        await expect(page.locator(locators.manualSelectedOptions, { hasText: 'test1' }), loopErrorContext).toHaveCount(
          1,
        );
      }
    });

    test('selecting an already selected value removes that value from being selected in multi-select mode @component', async ({
      page,
    }) => {
      const testUrls = [urls.multiFormattedSelectables];

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

        await expect(page.locator(locators.manualSelectedOptions, { hasText: 'test1' }), loopErrorContext).toHaveCount(
          0,
        );
      }
    });

    test('selecting an already selected value removes that value from being selected in single-select mode @component', async ({
      page,
    }) => {
      const testUrls = [urls.singleFormattedSelectablesRemoveDuplicateSelect];

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

        await testNoSelectedValue(page, false, loopErrorContext);
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

    test('shows before threshold option @component @slow', async ({ page }) => {
      // we need a higher timeout for this test because we are testing code that has a built-in delay of 1 second
      // for each iteration to test the async functionality
      test.setTimeout(30000);

      const testUrls = [urls.singleAsync, urls.multiAsync];

      for (let i = 0; i < testUrls.length; i++) {
        const loopErrorContext = `failed url: ${testUrls[i]}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('t');

        await expect(page.locator(locators.asyncDataLoadingIndicator), loopErrorContext).toHaveCount(0);

        // we delay in order to make sure that the debounce happen and we are still showing the before threshold content
        await playwrightUtils.pauseTest(500);

        await expect(page.locator(locators.asyncDataBeforeThreshold), loopErrorContext).toHaveCount(1);
      }
    });

    test('shows async data after threshold is meet @component @slow', async ({ page }) => {
      // we need a higher timeout for this test because we are testing code that has a built-in delay of 1 second
      // for each iteration to test the async functionality
      test.setTimeout(30000);

      const testUrls = [urls.singleAsync, urls.multiAsync];

      for (let i = 0; i < testUrls.length; i++) {
        const loopErrorContext = `failed url: ${testUrls[i]}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).type('tes');

        await expect(page.locator(locators.asyncDataLoadingIndicator), loopErrorContext).toHaveCount(1);
        await expect(page.locator(locators.autoCompleteOptions), loopErrorContext).toHaveCount(4);
      }
    });
  });

  test.describe('in form', () => {
    // this needs to be testing in a form context as Enter has special meaning for an input when in a form
    test('multi select selects item with enter and keeps input focused without typing @component', async ({ page }) => {
      const testUrls = [urls.multiInForm, urls.multiInFormAutoShowOptions];

      for (let i = 0; i < testUrls.length; i++) {
        const loopErrorContext = `failed url: ${testUrls[i]}`;

        await page.goto(testUrls[i]);

        await page.locator(locators.autoCompleteInput).click();
        await page.locator(locators.autoCompleteInput).press('ArrowDown');
        await page.locator(locators.autoCompleteInput).press('Enter');

        await expect(page.locator(locators.selectedOptions), loopErrorContext).toHaveCount(1);
        await expect(await page.locator(locators.autoCompleteInput).inputValue(), loopErrorContext).toBe('');
        await expect(page.locator(locators.autoCompleteInput), loopErrorContext).toBeFocused();
      }
    });
  });
});
