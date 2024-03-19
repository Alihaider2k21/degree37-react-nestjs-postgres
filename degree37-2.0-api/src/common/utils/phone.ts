/**
 * The `trimPhone` function removes spaces, parentheses, and dashes from a phone number string.
 * @param {string} phone - phone is a string representing a phone number.
 * @returns The function `trimPhone` returns a string with all spaces, parentheses, and dashes removed
 * from the input `phone` string.
 */
export const trimPhone = (phone: string) => {
  return phone
    .split('')
    .filter((letter) => ![' ', '(', ')', '-'].includes(letter))
    .join('');
};
