define(['zepto'], function ($) {
  var API = {
    openid : function () {
      return {openid: "oWDWeuJ910PI8UmPjxvK758Pzseo"}
    },
    url: function () {
      return APP.globalConfig.apiURL;
    },
    // 获取城市列表
    getCities: function (params) {
      var reqData = $.extend(this.openid(), params);
      return $.get(this.url() + "/cities", reqData);
    },
    // 获取热门城市列表    
    getHotCities: function (params) {
      var reqData = $.extend(this.openid(), params);
      return $.get(this.url() + "/cities/hot", reqData);
    },
    // 城市定位  
    getCurrentCity: function (params) {
      var reqData = $.extend(this.openid(), params);
      return $.get(this.url() + "/cities/current", reqData);
    },
    // 获取学校列表    
    getCampuses: function (params) {
      var reqData = $.extend(this.openid(), params);
      return $.get(this.url() + "/campuses", reqData);
    },
    // 附近学校 
    getCurrentCampuse: function (params) {
      var reqData = $.extend(this.openid(), params);
      return $.get(this.url() + "/campuses/near", reqData);
    },
    // 获取商品分类列表列表    
    getCategories: function (params) {
      var reqData = $.extend(this.openid(), params);
      return $.get(this.url() + "/categories", reqData);
    },
    // 获取商品列表
    getItems: function (params) {
      var reqData = $.extend(this.openid(), params);
      return $.get(this.url() + "/items", reqData);
    },
    // 搜索商品
    searchItems: function (params) {
      var reqData = $.extend(this.openid(), params);
      return $.get(this.url() + "/items/search", reqData);
    },
    // 商品详情
    getItemDetails: function (id) {      
      return $.get(this.url() + "/items/" + id , this.openid());
    },
    // // 加入/移出购物车（商品数量+/-1）
    joinToCart1: function (shopid, itemid) {      
      return $.post(this.url() + "/cart/shops/" + shopid + "/items/" + itemid , this.openid());
    },
    // 加入/移出购物车（商品数量+/-1）   
    joinToCart: function (params) {
      var reqData = $.extend(this.openid(), params);
      return $.post(this.url() + "/cart/shops/", reqData);
    },
    // 移除商品
    delFromCart: function (shopid, itemid) {      
      return $.post(this.url() + "/cart/shops/" + shopid + "/itemsid/" + itemid + "/all" , this.openid());
    }
    

  }

  return API;
});