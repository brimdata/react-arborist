const {calculateTypeScale} = require('utopia-core');

module.exports = {
  items: calculateTypeScale({
    minWidth: 320,
    maxWidth: 1240,
    minFontSize: 18,
    maxFontSize: 20,
    minTypeScale: 1.2,
    maxTypeScale: 1.25,
    positiveSteps: 5,
    negativeSteps: 2
  }).map(size => {
    return {name: 'step-' + size.step, value: size.clamp};
  })
};
