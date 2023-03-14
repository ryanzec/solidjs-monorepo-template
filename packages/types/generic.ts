export type RequestedAnimationFrameReference = number | null;

// to reference for new values:
// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
export enum Key {
  ESCAPE = 'Escape',
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  TAB = 'Tab',
  ENTER = 'Enter',
}

export type BaseCommonDataType = boolean | string | number | object;

export type CommonDataType = BaseCommonDataType | BaseCommonDataType[];
