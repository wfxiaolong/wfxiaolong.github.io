///  GlobalConfig
define(['backbone', 'config/app-config'], function (Backbone, AppConfig) {
  var GlobalConfig = function () {
    // set global
    window.APP = window.APP || {};
    var APP = window.APP;
    APP.globalConfig = APP.globalConfig || {};
    APP.globalConfig.baseURL = location.href.split(':')[0] +  '://' + location.host;
    APP.globalConfig.appName = "笑呵呵";
    APP.globalConfig.apiURL = "https://www.xiaohehe.org/m/api";


    // set app status
    this.rootFontSize = document.documentElement.clientWidth > 640 ? '12px' : Math.floor(document.documentElement.clientWidth / 320 * 10) + 'px';

  };
  return GlobalConfig;
});