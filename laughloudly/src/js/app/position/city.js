define(['backbone', 'getTpl', 'juicer', 'swiper'], function (Backbone, getTpl, juicer, Swiper) {
  window.APP = window.APP || {};
  var APP = window.APP;
  var city = {};  

  city.init = function () {
    var _self = this;
    city.hotcities = [];
    city.cities = {};    
    var pageView = new city.PageView(); 
    configBar(); 
    function configBar (){
      BAR.clear().tab(1).center('', '选择城市');
      if(localStorage.DM_schoolId && localStorage.DM_schoolName && localStorage.DM_shopId){
        BAR.left('close', '关闭');
        BAR.ell.on('click', function() {
          location.href = "#/page/index"          
        });
      }
      $('.bottombar').hide();     
    }
  };

  city.PageView = Backbone.View.extend({
    className: 'city',
    events: {
      'click #rightnav li': 'jump',
      'click #refresh': 'renderCurrent',
      'click #positionfail': 'renderCurrent',
      'click #search_city': 'searchCity',
      'input #search_input': 'search',
      'click #search_clear': 'searchClear'
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
      getTpl('position/city', 'page', function (tpl) {
        _self.trigger('render:page');
        $(_self.el).html(tpl);
        _self.renderHotCities();
        _self.renderCities();       
        _self.renderCurrent();        
      });
    },    
    renderHotCities: function(){    
      getJsonX('/cities/hot', '', function(re){
        if(re.state){            
          var tpl = $('#tm_hotcities').html();
          var html = juicer(tpl, {data: re.data});
          $('#hotCities').html(html);
        }
      }) 
    },
    renderCities: function(){
      var _self = this;
      getJsonX('cities', "",function (re) {
        if(re.state){
          var data = re.data;
          var a = _.groupBy(data, function(val){
            return val.pinyin.charAt(0);
          })
          var b =[]
          for(var key in a){
            b.push({char: key, data: a[key]})
          }
          city.cities = _.sortBy(b, function(val){
            return val.char;
          });
          var tpl = $('#tm_citylist').html();
          var html = juicer(tpl, {data: city.cities});
          $('#cities').html(html);
          _self.renderRightnav();
        }
      });
    },
    renderRightnav: function(){
      var tpl = $('#tm_rightnav').html();
      var html = juicer(tpl, {data: city.cities});      
      $('#rightnav').html(html);     
    },
    renderCurrent: function(){
      var _self = this;
      $('#positioning').show();
      $('#positionfail, #current, #refresh').hide();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
          var data = {lat:pos.coords.latitude, lng:pos.coords.longitude};
          _self.getData(data);
        }, function(err) {
          var data = {lat: 37.565868, lng: 121.232748};
          _self.getData(data);
        }, {
          enableHighAccuracy: true, // 是否获取高精度结果
          timeout: 5000, //超时,毫秒
          maximumAge: 0 //可以接受多少毫秒的缓存位置
          // 详细说明 https://developer.mozilla.org/cn/docs/Web/API/PositionOptions
        });
      } else {
        var data = {lat: 37.565868, lng: 121.232748};
        this.getData(data);
      }
    },
    getData: function(data){
      var storage = window.localStorage;
      storage.setItem("DM_AddressLocation", JSON.stringify(data));
      getJsonX("/cities/current", data, function(re){
        if(re.state){
          var tpl = $('#tm_current').html();
          var html = juicer(tpl, re.data)
          $('#positioning, #positionfail').hide();
          $('#current').html(html).show();
          $('#refresh').show();
        }
      }, function () {
        $('#positioning, #current, #refresh').hide();
        $('#positionfail').show();
      });
    },
    jump: function(e){
      var id = '#jump' + $(e.currentTarget).data('id');
      if($(id).length > 0){
        var top = $(id).offset().top;
        var top_height = $('.topbar').height();
        $('body').scrollTop(top - top_height);        
      }
      return false;
    },
    searchCity: function(e){
      $('#search_city, #searchbox').addClass('focus');
      $('#search_input').focus();
    },
    search: function(e){      
      $('#search_result').html('');
      var val = $.trim($(e.currentTarget).val());
      if(val === '') return false;

      var array = $.extend(true, [], city.cities)      
      for (var i = 0; i < array.length; i++) {
        var _city = array[i]; 
        for(var j = 0; j < _city.data.length; ){
          if(_city.data[j].name.indexOf(val) === -1){
            _city.data.splice(j, 1)
          }else{
            j++
          }
        }
      };
      for (var i = 0; i < array.length; ) {
        var _city = array[i]; 
        if(_city.data.length === 0){
          array.splice(i, 1);
        }else{
          i++
        }
      };     
      
      var tpl = $('#tm_searchresult').html();
      var html = juicer(tpl, {data: array, input: val})
      var array = []
      $('#search_result').html(html);
    },
    searchClear: function(e){    
      $('#search_result').empty();  
      $('#search_input').val('');
      $('#search_city, #searchbox').removeClass('focus');
    }
  });    

  return city;
});
