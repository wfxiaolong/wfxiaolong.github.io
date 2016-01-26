require(['require-config'], function () {
  require(['backbone', 'router', 'fastclick', 'userAgent', 'cookie', 'frozen', 'juicer', 'components/util'],
    function(Backbone, Router, fastClick, userAgent, cookie, frozen, juicer, Util) {
    $(function() {
      init();
      APP.router = new Router();
      Backbone.history.start();
    });
    function init() {
      window.APP = window.APP || {};
      var APP = window.APP;
      APP.ua = userAgent();
      window.cookie = cookie;
      window.juicer = juicer;

      juicerRegFunc();

      if (!APP.ua.os.android && !APP.ua.browser.damaiapp) {  // Android Web View下使用效果较差
        fastClick.attach(document.body);  // 解决click 300ms延迟问题
      }
    }
    function juicerRegFunc() {
      juicer.register('salesFormat', Util.salesFormat);
      juicer.register('dataFormat', Util.dataFormat);
    }
  });
});
