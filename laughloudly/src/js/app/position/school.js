define(['backbone', 'getTpl', 'juicer', 'swiper'], function (Backbone, getTpl, juicer, Swiper) {
  window.APP = window.APP || {};
  var APP = window.APP;

  var school = {};
  
  school.init = function (objectId, name) {   
    school.cityname = name; 
    school.objectId = objectId;       
    var _self = this;
    var pageView = new school.PageView();
    configBar(); 
    function configBar (){
      BAR.clear().tab(1).center('', name).left('back', '返回');
      BAR.ell.on('click', function(event) {
        history.back()        
      });      
      $('.bottombar').hide();     
    };
  };
  school.PageView = Backbone.View.extend({
    className: 'school',
    events: {      
      'click #currentSchool': 'renderCurrentSchool',      
      'click #search_school': 'searchSchool',
      'input #search_input': 'search',
      'click #search_clear': 'searchClear',
      'click .js_schoolul a': 'saveResult'
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
      getTpl('position/school', 'page', function (tpl) {
        if (tpl) {
          $(_self.el).html(tpl);         
          _self.trigger('render:page');          
          _self.renderSchool();
          _self.renderCurrentSchool();
        }
      });
    },    
    fetch: function(data){
      getJsonX('/campuses', data, function(re){
        if(re.state){
          var data = re.data;
          var name = [];
          var schools = {};
          data.forEach(function(_school, index){
            var district = _school.district;
            if(_.indexOf(name, district) === -1){
              name.push(district);
              schools[district] = [];
              schools[district].push(_school);
            }else{
              schools[district].push(_school);
            }
          });
          school.schools = schools;
          var ntpl = $('#tm_schoollist').html();
          var nhtml = juicer(ntpl, {data: schools});
          $('#schools').html(nhtml);
        }else{
          console.log(re.msg)
        }
      });
    },
    renderSchool: function(){ 
      var data = {city: school.objectId};
      var _self = this;
      _self.fetch(data);
    },
    renderCurrentSchool: function() {
      $('#currentSchool').empty().hide();
      $('#schoolPositining').show();
      var storage = window.localStorage;
      var data = JSON.parse(storage.getItem("DM_AddressLocation"));
      var tpl = $('#tm_currentschool').html();
      getJsonX('/campuses/near', data, function (re) {
        if (re) {
          var data = re.data[0];
          var html = juicer(tpl, {name: data['name']});
          $('#currentSchool').html(html).show();
          $('#schoolPositining').hide();
          localStorage.DM_schoolId = data.objectId;
          localStorage.DM_schoolName = data.name;
          localStorage.DM_shopId = data.shop.objectId;
        }
      }, function () {
        var html = juicer(tpl, {name: '没有定位到学校'})
        $('#currentSchool').html(html).show();
        $('#schoolPositining').hide();
      });
    },
    searchSchool: function(e){
      $('#search_school, #searchbox').addClass('focus');
      $('#search_input').focus();
    },
    search: function(e){ 
      $('#search_result').html('');
      var val = $.trim($(e.currentTarget).val());
      if(val === '') return false;
      var data = {};
      for( var k in school.schools){
        var _school = school.schools[k];    
        if(!data[k]){
          data[k] = []
        }               
        data[k] = _.filter(_school, function(_schoolObj){ return _schoolObj.name.indexOf(val) > -1; });
      }
      
      for(var key in data){
        if(data[key].length === 0){
          delete data[key]
        }
      }
      
      var tpl = $('#tm_result').html();
      var html = juicer(tpl, {data: data});
      $('#search_result').html(html);
    },
    searchClear: function(){    
      $('#search_result').empty();  
      $('#search_input').val('');
      $('#search_school, #searchbox').removeClass('focus');
    },
    saveResult: function(e){
      localStorage.DM_schoolId = $(e.currentTarget).data('id');
      localStorage.DM_schoolName = $(e.currentTarget).text();
      localStorage.DM_shopId = $(e.currentTarget).data('shopid');
      location.hash = "#page/index";
    }
  });
  return school;
});
