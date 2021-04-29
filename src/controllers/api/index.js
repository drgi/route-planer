const apis = ['direction'];

const actionsCollection = new Map();

apis.forEach((api) => {
  const fnsObj = require(`./${api}.js`);
  for (const [key, value] of Object.entries(fnsObj)) {
    actionsCollection.set(key, value);
  }
});

const apiAction = (actionStr, ...args) => {
  const fn = actionsCollection.get(actionStr);
  if (!fn) {
    throw new Error(`Wrong action name "${actionStr}"`);
  }
  return fn(...args);
};

export default apiAction;
