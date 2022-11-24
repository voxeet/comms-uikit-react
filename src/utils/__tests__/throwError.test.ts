import { isErrorWithMessage, toErrorWithMessage, getErrorMessage, throwErrorMessage } from '../throwError.util';

describe('throwError utilities', () => {
  test('isErrorWithMessage', () => {
    expect(isErrorWithMessage(null)).toBeFalsy();
    expect(isErrorWithMessage({ message: 'Error' })).toBeTruthy();
    expect(isErrorWithMessage({ 1: 1 })).toBeFalsy();
    expect(isErrorWithMessage({ message: 123 })).toBeFalsy();
  });
  test('toErrorWithMessage', () => {
    const errorMessage = { message: 'Error' };
    expect(toErrorWithMessage(errorMessage)).toEqual(errorMessage);
    expect(toErrorWithMessage('this should be an error')).toStrictEqual(new Error('this should be an error'));
  });

  ['1', 2, null, { test: 'test' }].forEach((el) => {
    test(`getErrorMessage for ${el} input`, () => {
      expect(getErrorMessage(el)).toEqual(typeof el === 'string' ? el : JSON.stringify(el));
    });
  });

  test('throwErrorMessage', () => {
    try {
      throwErrorMessage('try to throw error');
    } catch (e) {
      expect((e as Error).message).toBe('try to throw error');
    }
  });
});
