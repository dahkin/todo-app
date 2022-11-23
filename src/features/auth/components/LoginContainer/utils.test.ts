import { validateEmail } from './utils';

describe('validateEmail', () => {
  test('Correct email is valid', () => {
    expect(validateEmail('daria@gmail.com')).toBe(true);
  });

  test('Email without dot is not valid', () => {
    expect(validateEmail('daria@gmailcom')).toBe(false);
  });

  test('Email without @ is not valid', () => {
    expect(validateEmail('dariagmail.com')).toBe(false);
  });

  test('Email without correct symbols is not valid', () => {
    expect(validateEmail('dariagmailcom')).toBe(false);
  });

  test('Empty email is not valid', () => {
    expect(validateEmail('')).toBe(false);
  });
});
