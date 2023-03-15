import { test, expect, Page } from '@playwright/test';

import { playwrightUtils } from '$/utils/playwright';

const urls = {
  arrayFields: '/packages/stores/form/array-fields',
  clear: '/packages/stores/form/clear',
  dynamicFormElements: '/packages/stores/form/dynamic-form-elements',
  isTouched: '/packages/stores/form/is-touched',
  resetWithoutInitial: '/packages/stores/form/reset-without-initial',
  resetWithInitial: '/packages/stores/form/reset-with-initial',
  setValue: '/packages/stores/form/set-value',
  initializeWithValues: '/packages/stores/form/initialize-with-values',
  events: '/packages/stores/form/events',
  validateOnChange: '/packages/stores/form/validate-on-change',
  noValidateOnChange: '/packages/stores/form/no-validate-on-change',
};

const locators = {
  setValueButton: '[data-id="set-value-button"]',
  resetButton: '[data-id="reset-button"]',
  clearButton: '[data-id="clear-button"]',
  submitButton: '[data-id="submit-button"]',
  addArrayFieldButton: '[data-id="add-array-field-button"]',
  removeArrayFieldButton: '[data-id="remove-array-field-button"]',
  isTouchedIndicator: '[data-id="is-touched-indicator"]',
  valueChangeEventTriggeredIndicator: '[data-id="value-changed-event-triggered-indicator"]',
  submitEventTriggeredIndicator: '[data-id="submit-event-triggered-indicator"]',
  clearEventTriggeredIndicator: '[data-id="clear-event-triggered-indicator"]',
  resetEventTriggeredIndicator: '[data-id="reset-event-triggered-indicator"]',
  input: '[data-id="container"] input',
  addStringFieldButton: '[data-id="add-string-field"]',
  validationMessage: '[data-id="validation-message"]',
  arrayFieldElement: '[data-id="array-field-element"]',
};

test.describe('form store', () => {
  test.describe('core', () => {
    test('set value outside of input element @component', async ({ page }) => {
      await page.goto(urls.setValue);

      expect(await page.locator(locators.input).nth(0).inputValue()).toBe('');

      await page.locator(locators.setValueButton).click();

      expect(await page.locator(locators.input).nth(0).inputValue()).toBe('test');
    });

    test('initialize form with data', async ({ page }) => {
      await page.goto(urls.initializeWithValues);

      expect(await page.locator(locators.input).nth(0).inputValue()).toBe('test');
      expect(await page.locator(locators.input).nth(1).inputValue()).toBe('test2');
    });

    test('clear form @component', async ({ page }) => {
      await page.goto(urls.clear);

      expect(await page.locator(locators.input).nth(0).inputValue()).toBe('test');
      expect(await page.locator(locators.input).nth(1).inputValue()).toBe('test2');

      await page.locator(locators.clearButton).click();

      expect(await page.locator(locators.input).nth(0).inputValue()).toBe('');
      expect(await page.locator(locators.input).nth(1).inputValue()).toBe('');
    });

    test('reset form without initial data @component', async ({ page }) => {
      await page.goto(urls.resetWithoutInitial);

      await page.locator(locators.input).nth(0).type('first');
      await page.locator(locators.input).nth(1).type('second');

      expect(await page.locator(locators.input).nth(0).inputValue()).toBe('first');
      expect(await page.locator(locators.input).nth(1).inputValue()).toBe('second');

      await page.locator(locators.resetButton).click();

      expect(await page.locator(locators.input).nth(0).inputValue()).toBe('');
      expect(await page.locator(locators.input).nth(1).inputValue()).toBe('');
    });

    test('reset form with initial data @component', async ({ page }) => {
      await page.goto(urls.resetWithInitial);

      await page.locator(locators.clearButton).click();

      expect(await page.locator(locators.input).nth(0).inputValue()).toBe('');
      expect(await page.locator(locators.input).nth(1).inputValue()).toBe('');

      await page.locator(locators.resetButton).click();

      expect(await page.locator(locators.input).nth(0).inputValue()).toBe('test');
      expect(await page.locator(locators.input).nth(1).inputValue()).toBe('test2');
    });

    test('input not marked as touch if input not blurred @component', async ({ page }) => {
      await page.goto(urls.isTouched);

      await page.locator(locators.input).nth(0).type('t');
      await playwrightUtils.pauseTest(100);

      await expect(page.locator(locators.isTouchedIndicator)).toHaveCount(0);
    });

    test('blurring input marks it as touched @component', async ({ page }) => {
      await page.goto(urls.isTouched);

      await page.locator(locators.input).nth(0).click();
      await page.locator(locators.input).nth(0).blur();

      await expect(page.locator(locators.isTouchedIndicator)).toHaveCount(1);
    });

    test('clear form reset touched status @component', async ({ page }) => {
      await page.goto(urls.isTouched);

      await page.locator(locators.input).nth(0).click();
      await page.locator(locators.input).nth(0).blur();
      await page.locator(locators.clearButton).click();

      await expect(page.locator(locators.isTouchedIndicator)).toHaveCount(0);
    });

    test('reset form reset touched status @component', async ({ page }) => {
      await page.goto(urls.isTouched);

      await page.locator(locators.input).nth(0).click();
      await page.locator(locators.input).nth(0).blur();
      await page.locator(locators.resetButton).click();

      await expect(page.locator(locators.isTouchedIndicator)).toHaveCount(0);
    });
  });

  test.describe('events', () => {
    test('submit event @component', async ({ page }) => {
      await page.goto(urls.events);

      await page.locator(locators.submitButton).click();

      await expect(page.locator(locators.submitEventTriggeredIndicator)).toHaveCount(1);
    });

    test('submit event not triggered when there are validation errors @component', async ({ page }) => {
      await page.goto(urls.events);

      await page.locator(locators.clearButton).click();
      await page.locator(locators.submitButton).click();

      await expect(page.locator(locators.submitEventTriggeredIndicator)).toHaveCount(0);
    });

    test('clear event @component', async ({ page }) => {
      await page.goto(urls.events);

      await page.locator(locators.clearButton).click();

      await expect(page.locator(locators.clearEventTriggeredIndicator)).toHaveCount(1);
    });

    test('reset event @component', async ({ page }) => {
      await page.goto(urls.events);

      await page.locator(locators.resetButton).click();

      await expect(page.locator(locators.resetEventTriggeredIndicator)).toHaveCount(1);
    });

    test('value changed event @component', async ({ page }) => {
      await page.goto(urls.events);

      await page.locator(locators.input).nth(0).type('t');

      await expect(page.locator(locators.valueChangeEventTriggeredIndicator)).toHaveCount(1);
    });
  });

  test.describe('validation', () => {
    test('shows when invalid @component', async ({ page }) => {
      await page.goto(urls.validateOnChange);

      await page.locator(locators.input).nth(0).type('t');
      await page.locator(locators.input).nth(0).press('Backspace');

      await expect(page.locator(locators.validationMessage)).toHaveCount(0);

      await page.locator(locators.input).nth(0).blur();

      await expect(page.locator(locators.validationMessage)).toHaveCount(1);
    });

    test('validates on submit @component', async ({ page }) => {
      await page.goto(urls.validateOnChange);

      await page.locator(locators.submitButton).click();

      await expect(page.locator(locators.validationMessage)).toHaveCount(1);
    });

    test('validates on change @component', async ({ page }) => {
      await page.goto(urls.validateOnChange);

      await page.locator(locators.submitButton).click();
      await page.locator(locators.input).nth(0).type('t');

      await expect(page.locator(locators.validationMessage)).toHaveCount(0);
    });

    test('reset form reset validation @component', async ({ page }) => {
      await page.goto(urls.validateOnChange);

      await page.locator(locators.submitButton).click();
      await page.locator(locators.resetButton).click();

      await expect(page.locator(locators.validationMessage)).toHaveCount(0);
    });

    test('clear form reset validation @component', async ({ page }) => {
      await page.goto(urls.validateOnChange);

      await page.locator(locators.submitButton).click();
      await page.locator(locators.clearButton).click();

      await expect(page.locator(locators.validationMessage)).toHaveCount(0);
    });

    test('does not validate on change @component', async ({ page }) => {
      await page.goto(urls.noValidateOnChange);

      await page.locator(locators.submitButton).click();
      await page.locator(locators.input).nth(0).type('t');

      await expect(page.locator(locators.validationMessage)).toHaveCount(1);

      await page.locator(locators.submitButton).click();

      await expect(page.locator(locators.validationMessage)).toHaveCount(0);
    });
  });

  test.describe('array fields', () => {
    test('add element @component', async ({ page }) => {
      await page.goto(urls.arrayFields);

      await page.locator(locators.addArrayFieldButton).click();

      await expect(page.locator(locators.arrayFieldElement)).toHaveCount(1);
    });

    test('remove element @component', async ({ page }) => {
      await page.goto(urls.arrayFields);

      await page.locator(locators.addArrayFieldButton).click();
      await page.locator(locators.removeArrayFieldButton).nth(0).click();

      await expect(page.locator(locators.arrayFieldElement)).toHaveCount(0);
    });

    test('validation @component', async ({ page }) => {
      await page.goto(urls.arrayFields);

      await page.locator(locators.addArrayFieldButton).click();
      await page.locator(locators.submitButton).click();

      // 1 for the array elements itself since it required 2, and 1 for the first array element partA
      await expect(page.locator(locators.validationMessage)).toHaveCount(2);
    });

    test('added element should not be considered as touched by default @component', async ({ page }) => {
      await page.goto(urls.arrayFields);

      await page.locator(locators.addArrayFieldButton).click();

      await expect(page.locator(locators.validationMessage)).toHaveCount(0);

      await page.locator(locators.input).nth(0).type('t');
      await page.locator(locators.input).nth(0).press('Backspace');

      await expect(page.locator(locators.validationMessage)).toHaveCount(0);
    });
  });

  test.describe('dynamic form elements', () => {
    test('added to validation schema @component', async ({ page }) => {
      await page.goto(urls.dynamicFormElements);

      await page.locator(locators.submitButton).click();

      await expect(page.locator(locators.validationMessage)).toHaveCount(1);

      await page.locator(locators.addStringFieldButton).click();
      await page.locator(locators.submitButton).click();

      await expect(page.locator(locators.validationMessage)).toHaveCount(2);
    });
  });
});
