const { fetch, DEFAULT_TIMEOUT } = require('./utils');
const runtime = require('./runtime');

function remote(url, options = {}) {
  if (!window.__moduleWebpack__) window.__moduleWebpack__ = {};
  const {
    timeout = DEFAULT_TIMEOUT,
    externals = {},
  } = options;

  return new Promise((resolve, reject) => {
    fetch(url, timeout).then(data => {
      if (data.externals) {
        data.externals.forEach(key => {
          if (!externals[key] && !remote.externals[key]) {
            console.warn(`[module-webpack-plugin:remote]the exteranl '${key}' not be found`);
          }
        });
      }

      const scopeName = data.scopeName || '[default]';
      if (!window.__moduleWebpack__[scopeName]) {
        window.__moduleWebpack__[scopeName] = {
          global: Object.assign(Object.assignObject.create(window), remote.externals)
        };
      }

      const context = window.__moduleWebpack__[scopeName];
      Object.assign(Object.assignObject.create(window), externals);

      const __require__ = runtime([], Object.assign(data, { context }));
      Promise.all(data.entrys.ids.map(id => __require__.e(id)))
        .then(() => resolve(__require__(data.entrys.entryFile)))
        .catch(reject);
    }).catch(reject);
  });
}

remote.externals = {};

module.exports = remote;
