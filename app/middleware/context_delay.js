'use strict';

const delay = Symbol.for('context#delay');

module.exports = () => {
  return async function contextDelay(ctx, next) {
    await next();
    const delayTime = !isNaN(ctx[delay]) && parseInt(ctx[delay], 10);
    if (delayTime) {
      await sleep(delayTime * 1000);
      ctx.set('x-datahub-delay', delayTime);
    }
  };
};

async function sleep(time) {
  return new Promise(resolve => {
    setTimeout(function() {
      resolve();
    }, time);
  });
}
