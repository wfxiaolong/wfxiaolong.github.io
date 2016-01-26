define(['backbone', 'getTpl', 'juicer'], function (Backbone, getTpl, juicer) {

	var page = {};

	page.init = function () {
		var _self = this;
		var listView = new page.ListView();

		configBar(listView);
	}
	var configBar = function(listView) {
    $('.bottombar').hide();
    BAR.left('back', "返回", '');
    BAR.center('','选择收货地址','');
    BAR.right('','管理','');
    BAR.ell.click(function(){
      listView.back();
    });
    BAR.elr.click(function(){
      listView.addAddress();
    })
  };

  page.ListView = Backbone.View.extend({
  	className: 'choose-address',

  	editFlag: false, //判断是进入新增地址还是修改地址

  	initialize: function() {
  		var _self = this;

  		this.on('render:page',function() {
  			$('#loading').hide();
  			$('.wraper').prepend(_self.el);
  			$(' body').removeClass();
        $(' body').addClass('bg-white');
  		});
      this.getData();
  		this.render();
  	},
  	render: function() {
  		var _self = this;
  		getTpl('personal/chooseAddress', 'page', function (tpl) {
  		  if (tpl) {
  		    var data = _self.dataList; 

  		    _self.template = _self.template || juicer(tpl);
  		    var html = _self.template.render({data: data});
  		    $(_self.el).html(html);
  		    _self.trigger('render:page');
  		  }
  		  _self.initArea();
  		});
  	},
  	events: {
      'click .js-add-addr'       : 'addAddressPanel',
      'click .js-addr-edit'      : 'editAddressPanel',
      'click .topbar .top-right' : 'addAddress',
      'change #js_area'          : 'initBuildings',
      'click .js-chooseAddr'     : 'chooseAddress'
    },
  	//进入页面时，加载数据
    getData: function (){
          var _self = this;
          var postData = {
            campus: localStorage.DM_schoolId
          };

          getJsonX('/addresses', postData, function (re) {
            if (re.state) {
              _self.dataList = re.data; //page.data全局，供render使用
              _self.render();
            }
          }, '');
        },
    //跳转添加地址面板
    addAddressPanel: function() {
      $('.js-add-addr').hide();
      $('.choose-addr').hide();
      $('.add-addr').show();
      $('.topbar .title').text('修改地址');
      $('.topbar .top-right').text('保存');
      $('#js_school').text(localStorage.DM_schoolName);
    },
    //跳转修改地址面板
    editAddressPanel: function(e) { 
      var _self = this;
      var dataNode = $(e.currentTarget.parentNode),
          name = dataNode.data('name'),
          phone = dataNode.data('phone'),
          area = dataNode.data('area'),
          building = dataNode.data('building'),
          address = dataNode.data('address');
      this.editID = dataNode.data('id');

      $('#js_school').text(localStorage.DM_schoolName);
      // 初始化信息
      $('#js_name').val(name);
      $('#js_phone').val(phone);
      $('#js_area').val(area);
      this.initBuildings(); //根据area初始化宿舍楼
      $('#js_building').val(building);
      $('#js_address').val(address);
      // 调出面板
      $('.js-add-addr').hide();
      $('.choose-addr').hide();
      $('.add-addr').show();
      $('.topbar .title').text('修改地址');
      $('.topbar .top-right').text('保存');
      _self.editFlag = true;
      
    },
    //添加地址
    addAddress: function() {
    	if ($('.topbar .top-right').text().trim() == '管理') {
    		location.href = '#page/manaAddress';
        return;
    	}
      var _self = this;
      var name = $('#js_name').val(),
          phone =  $('#js_phone').val(),
          area = $('#js_area').val(),
          building = $('#js_building').val(),
          address = $('#js_address').val();
      var is_validity = this.data_validity(name,phone,area,building,address);

      if (is_validity === "true"){ //判断表单信息正确与否
        var postData = {
          name: name,
          mobile: phone,
          address: address,
          dorm: area,
          building: building
        };
        if (!_self.editFlag) { //新增地址
          postJsonCX('/addresses', postData, function (re) { 
            if (re.state) {
              var data = re.data;
              //往dataList里面添加新增的地址，然后渲染
              _self.dataList.push(data);
              _self.back();
              _self.render();
            } 
          }, '');
          
        } else { //修改地址
          var list = _self.dataList;
          var id = _self.editID;
          customRequestCX('/addresses/' + id + '?&_method=PUT&', postData,function (re) {
            if (re.state) {
              for(i = 0,len = list.length;i < len;i++){
                if (id == list[i].objectId) {
                  list[i].name = name;
                  list[i].mobile = phone;
                  list[i].address = address;
                  list[i].dorm = area;
                  list[i].building = building;
                  list[i].result = re.data.result;
                  break;
                }
              }
              _self.editID = '';
              _self.back(); //back函数将editFlag置false
              _self.render();
            } 
          }, '', 'POST');
          
        }
      } else { //输出错误信息
        $.tips({
            content:is_validity.msg
          });
      }

    },
    //选地址并返回上一页面
    chooseAddress: function(e) {
    	var _self = this;
    	var dataNode = $(e.currentTarget.parentNode);
      var defaultID = dataNode.data('id');
      var postData = {
        using: true
      }

      for(i = 0, len = _self.dataList.length;i < len;i++){
            if (defaultID == _self.dataList[i].objectId){
              _self.dataList[i].using = true;
            } else {
              _self.dataList[i].using = false;
            }
          }
      _self.render();
      //返回到上一页面
    },
    //数据验证
    data_validity: function(name,phone,area,building,address) {
      if(name == "")           return {msg:"收货人姓名不能为空"};
      if(phone === '')         return {msg:"手机号不能为空"};
      if(!/^(13|18|15|14|17)\d{9}$/i.test(phone)) return {msg:"手机号格式不正确"};
      if(area == "请选择")     return {msg:"请选择你的宿舍区"};
      if(building == "请选择") return {msg:"请选择你的宿舍楼"};
      if(address == "")        return {msg:"详细收货地址不能为空"};
      return 'true';
    },
    // 初始化校区
    initArea: function() {
      if (!this.areaData) { //areaData不存在则请求
        var _self = this;
        var postData = {campus: localStorage.DM_schoolId}; 

        getJsonX('/buildings', postData, function (re) {
          if (re.state) {
            _self.areaData = re.data;
            //下拉列表初始化
            var area = re.data,
            html = '<option value="请选择">请选择</option>';
            for(var i = 0, len = area.length;i < len;i++) {
              html += '<option value="'+area[i].dorm+'">'+area[i].dorm+'</option>';
            }
            $('#js_area').html(html);
            $('#js_building').html('<option value="请选择">请选择</option>');  
          }
        });
      } else {  //存在则直接加载
        //下拉列表初始化
        var area = this.areaData,
            html = '<option value="请选择">请选择</option>';
        for(var i = 0, len = area.length;i < len;i++) {
          html += '<option value="'+area[i].dorm+'">'+area[i].dorm+'</option>';
        }
        $('#js_area').html(html);
        $('#js_building').html('<option value="请选择">请选择</option>');
      }
    },
    //初始化宿舍楼
    initBuildings: function() {
       var currentArea = $('#js_area').prop('selectedIndex') - 1; //当前选择的校区

       if (currentArea >= 0) { 
        var buildings = this.areaData[currentArea].buildings,
            html = '<option value="请选择">请选择</option>';
        for(var i = 0, len = buildings.length;i < len;i++) {
           html += '<option value="'+buildings[i]+'">'+buildings[i]+'</option>';
         }
         $('#js_building').html(html);
       } else { //选择到了“请选择”的情况
         $('#js_building').html('<option value="请选择">请选择</option>');
       }
    },
    //返回功能
    back: function() {
    	var _self = this;
      var title = $('.topbar .title');

      if (title.text() == '添加新地址' || title.text() == '修改地址'){
        $('.topbar .top-right').text('管理');
        $('.add-addr').hide();
        $('.choose-addr').show();
        $('.js-add-addr').show();
        title.text('选择收货地址'); //改变标题方式有待选择
        //面板信息还原
        $('#js_name').val('');
        $('#js_phone').val('');
        $('#js_area').val('请选择');
        $('#js_building').val('请选择');
        $('#js_address').val('');
        _self.editFlag = false;
      } else { 
        //回跳到上一级页面
        window.history.go(-1);
      }
    }
  });
  return page;
});