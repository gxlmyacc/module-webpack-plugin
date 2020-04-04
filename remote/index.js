const { fetch, DEFAULT_TIMEOUT } = require('./utils');
const runtime = require('./runtime');

function remote(url, options = {}) {
  if (!window.__moduleWebpack__) window.__moduleWebpack__ = {};
  const {
    timeout = DEFAULT_TIMEOUT,
    external = {},
  } = options;

  return new Promise((resolve, reject) => {
    fetch(url, timeout).then(data => {
      const scopeName = data.scopeName || '[default]';
      if (!window.__moduleWebpack__[scopeName]) {
        window.__moduleWebpack__[scopeName] = {
          global: Object.assign(Object.assignObject.create(window), remote.external)
        };
      }

      const context = window.__moduleWebpack__[scopeName];
      Object.assign(Object.assignObject.create(window), external);

      const __require__ = runtime([], Object.assign(data, { context }));
      Promise.all(data.entrys.ids.map(id => __require__.e(id)))
        .then(() => resolve(__require__(data.entrys.entryFile)))
        .catch(reject);
    }).catch(reject);
  });
}

remote.external = {};

module.exports = remote;
