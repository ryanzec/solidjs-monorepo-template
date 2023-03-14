import { test, expect, Page } from '@playwright/test';

import { playwrightUtils } from '$/utils/playwright';

const urls = {
  single: '/packages/components/auto-complete/single',
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

test.describe('form store', () => {
  test.describe('core', () => {
    test('set value outside of input element @component', () => {});

    test('clear form @component', () => {});

    test('reset form without initial data @component', () => {});

    test('reset form with initial data @component', () => {});

    test('update schema @component', () => {});

    test('check if input was touched @component', () => {
      // updating should not show touched
      // after blur, should show touched
      // manually updating to original value should show touched
      // after reset, should not show touched
    });
  });

  test.describe('validation', () => {
    test('works for text fields @component', () => {
      // should not show validation on initial modification
      // should show after initial blur
    });

    test('works for checkboxes @component', () => {});

    test('works for radios @component', () => {});

    test('works for textarea @component', () => {
      // should not show validation on initial modification
      // should show after initial blur
    });

    test('works for auto complete @component', () => {});
  });

  test.describe('array fields', () => {
    test('add element @component', () => {});

    test('remove element @component', () => {});

    test('validation @component', () => {});

    test('added element should not be considered as touched by default @component', () => {
      // currently not implemented in code
    });
  });
});
