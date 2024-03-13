const slugify = require('slugify');

const nameSlug = (text) => {
  return slugify(text, {lower: true});
};

/**
 * Converts human readable tokens into tailwind config friendly ones
 *
 * @param {array} tokens {name: string, value: any}
 * @return {object} {key, value}
 */
const tokensToTailwind = (tokens, options = {slugify: true}) => {
  let response = {};

  tokens.forEach(({name, value}) => {
    const key = options.slugify ? nameSlug(name) : name;
    response[key] = value;
  });

  return response;
};

module.exports = tokensToTailwind;
