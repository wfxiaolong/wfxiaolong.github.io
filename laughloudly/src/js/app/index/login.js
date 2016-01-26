define(['backbone', 'getTpl', 'juicer'], function (Backbone, getTpl, juicer) {
  var page = {};

  page.init = function () {
    configBar();
    var _self = this;
    var pageView = new page.PageView();
  };
  var configBar = function(){
    $('.bottombar').hide();
    BAR.center('','笑呵呵账号登录');
  };
  page.PageView = Backbone.View.extend({
    className: 'login nobottombar',
    events: {
      'click #getCode': 'getCode',
      'click #getCodeByvoice': 'getCodeVoice',
      'click .btn-login': 'login'
    },
    initialize: function () {
      var _self =this;
      this.on('render:page', function () {
        $('#loading').hide();
        $('.wraper').prepend(_self.el);
        $(' body').removeClass();
        $(' body').addClass('bg-gray');
      });
      this.render();
    },
    render: function () {
      var _self = this;
      getTpl('index/login', 'page', function (tpl) {
        if (tpl) {
          $(_self.el).html(tpl);
          _self.trigger('render:page');
        }
      });
    },
    getCode: function (e) {
      e.preventDefault();
      var phone = $('.js-phone-num').val();
      if (!phone) return;
      var target = $(e.currentTarget);
      var time = 60;
      var t;
      if (time > 0) {
        target.text(time + 's');
        var data = new Object();
        data.mobile = phone;
        postJsonX("/auth/code", data, function(re){
          time = 0;
          if (re.state) {
            $.dialog({
              content:re.data,
              button:["确认"]
            });
          }
        }, function(){time = 0;});
        t = setInterval(function() {
          time--;
          if (time >= 0) {
            target.text(time + 's');
          } else {
            clearInterval(t);
            target.text('获取验证码');
          }
        }, 1000);
      }
    },
    getCodeVoice: function() {
      var phone = $('.js-phone-num').val();
      var data = new Object();
      data.mobile = phone;
      data.type = "voice";
      postJsonX("/auth/code", data, function(re){
        if (re.state) {
          $.dialog({
            content:re.data,
            button:["确认"]
          });
        }
      });
    },
    login: function (e) {
      e.preventDefault();
      if ($('.btn-login').hasClass('btn-disable')) return;
      var phone = $('.js-phone-num').val();
      var code = $('.js-code-num').val();
      if (!phone || !code) return;
      $('.btn-login').addClass('btn-disable').text('提交中…');
      var data = new Object();
      data.mobile = phone;
      data.code = code;
      postJsonX("/auth/register", data, function(re){
        if (re.state) {
          $.dialog({
            content:re.data,
            button:["确认"]
          });
          var storage = window.localStorage;
          storage.setItem("DM_PhoneNum", phone);
          location.href = "#page/index";
        }
        $('.btn-login').removeClass('btn-disable').text('登录');
      }, function(){});
    }
  });

  return page;
});
