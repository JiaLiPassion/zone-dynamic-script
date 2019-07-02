Zone.__load_patch('script', (global, Zone, api) => {
  const HTMLScriptElement = global['HTMLScriptElement'];
  if (!HTMLScriptElement) {
    return;
  }
  if (!global[api.symbol('getScriptIndex')]) {
    global[api.symbol('getScriptIndex')] = function() {
      if (!global[api.symbol('scriptIndex')]) {
        global[api.symbol('scriptIndex')] = 1;
      } else {
        global[api.symbol('scriptIndex')]++;
      }
      return global[api.symbol('scriptIndex')];
    };
  }
  if (!global[api.symbol('scriptZoneMap')]) {
    global[api.symbol('scriptZoneMap')] = {};
  }
  const oriDesc =
      Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
  Object.defineProperty(HTMLScriptElement.prototype, 'src', {
    configurable: true,
    enumerable: true,
    get: function() {
      return '';
    },
    set: function(src) {
      // load script content and eval in the current Zone.
      fetch(src).then(scriptContent => scriptContent.text()).then(text => {
        const scriptIndex = global[api.symbol('getScriptIndex')]();
        global[api.symbol('scriptZoneMap')][scriptIndex] = Zone.current;
        global[api.symbol(`script${scriptIndex}`)] = new Function(`${text}`);
        this.text = `
        const func = window[Zone.__symbol__('script${scriptIndex}')];
        func();
        `;
      });
    }
  });
});