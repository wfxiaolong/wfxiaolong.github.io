define(['backbone', 'getTpl', 'juicer', 'swiper'], function (Backbone, getTpl, juicer, Swiper) {
  window.APP = window.APP || {};
  var APP = window.APP;

  var Serve = {};
  Serve.data = {};

  Serve.init = function () {    
    var _self = this;
    $('body').removeClass().addClass('bg-gray');
    configBar(); 
    getJsonX('/shops/' +localStorage.DM_shopId , '' , function (re) {
      if(re.state){
        Serve.data = re.data.profile;
        var pageView = new Serve.PageView();
      }else{
        $.tips({content: re.msg});
      }      
    }, function (re) {
      $.tips({content: re.msg});
    })
    
  };

  function configBar (){
    BAR.center('', '服务与反馈').left('back', '返回'); 
    BAR.ell.on('click', function(event) {
      history.back();      
    });     
  };

  Serve.PageView = Backbone.View.extend({
    className: 'Serve',
    events: {
      //'click .js-type-order': 'typeOrder',
    },
    initialize: function () {
      var _self =this;
      this.on('render:page', function () {
        $('#loading').hide();
        $('.wraper').prepend(_self.el);
      });
      this.render();  
    },
    render: function () {
      var _self = this;
      getTpl('personal/serve', 'page', function (tpl) {
        if (tpl) {
          _self.template = _self.template || juicer(tpl);
          var html = _self.template.render({data: Serve.data})
          $(_self.el).html(html);
          _self.trigger('render:page');
        }
      });
    }
  });
  return Serve;
});
