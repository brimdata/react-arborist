const {calculateSpaceScale} = require('utopia-core');

module.exports = {
  title: 'Spacing',
  description:
    'Consistent spacing sizes, based on a ratio, with min and max sizes. This allows you to set spacing based on the context size. For example, min for mobile and max for desktop browsers.',
  meta: {
    scaleGenerator:
      'https://utopia.fyi/space/calculator/?c=330,18,1.2,1200,24,1.25,6,2,&s=0.75|0.5|0.25,1.5|2|3|4|6|8,s-l|s-xl&g=s,l,xl,12'
  },
  items: Object.values(
    calculateSpaceScale({
      minWidth: 320,
      maxWidth: 1240,
      minSize: 18,
      maxSize: 20,
      positiveSteps: [1.5, 2, 3, 4, 6],
      negativeSteps: [0.75, 0.5, 0.25],
      customSizes: ['s-l', '2xl-4xl']
    })
  )
    .flatMap(value => value)
    .map(spacing => {
      return {name: spacing.label, value: spacing.clamp};
    })
};
