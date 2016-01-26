define(['config/app-config'], function (appConfig) {
  var getTpl = function (name, type, callback) {
    window.__tplCache = window.__tplCache || {module:{},page: {}};
    var tplCache = window.__tplCache;
    if (tplCache[type][name]) {
      if (typeof callback === 'function') {
        callback(tplCache[type][name]);
      }
      return
    }
    if (type === 'module') {
      $.get(appConfig.relURL + 'templates/modules/' + name + '.html?_=' + (+new Date()), function (data) {
        var tpl = data;
        tplCache['module'][name] = tpl;
        if (typeof callback === 'function') {
          callback(tpl);
        }
      });
    } else {
      $.get(appConfig.relURL + 'templates/' + name + '.html?_=' + (+new Date()), function (data) {
        var tpl = data;
        tplCache['page'][name] = tpl;
        if (typeof callback === 'function') {
          callback(tpl);
        }
      });
    }
  }
  return getTpl;
});