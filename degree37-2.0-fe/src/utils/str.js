/**
 * It takes a word as input and returns the word with the first letter capitalized
 * and the rest of the letters in lowercase.
 * @param word The `word` parameter is a string that represents a word or phrase.
 * @return The function `toTitle` returns the input `word` with the first letter capitalized and the
 * rest of the letters in lowercase. If the input is not a string, it returns the input as is.
 */
export const toTitle = (word) => {
  if (typeof word === 'string')
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  return word;
};
