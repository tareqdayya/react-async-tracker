const logger = new Proxy(console.log, {
  apply: (target, _thisArg, argArray) => {
    if (process.env.NODE_ENV === 'production') return;

    let cache: any = [];

    const jsonArgs = argArray.map((arg: any) => JSON.stringify(
      arg,
      (_key, value) => {
        if (typeof value === 'object' && value !== null) {
          const cacheIndex = cache.indexOf(value);
          if (cacheIndex !== -1) {
            // Duplicate reference found, discard key
            return 'CIRCULAR_REF';
          }
          // Store value in our collection
          cache.push(value);
        }
        return value;
      },
      2,
    ));

    cache = null;

    return target(...jsonArgs);
  },
});

export default logger;
