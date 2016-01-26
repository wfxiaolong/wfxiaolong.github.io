//--------------------------------
// @authors: xlong
// @desc: 笑呵呵Strage 操作库
// @time: 2016-01-21
//--------------------------------

(function () {
  var storage = window.localStorage;

  var GoodsCountKey = "DM_Goods_Count";

  getCartCount = function() {
    var count = storage.getItem(GoodsCountKey);
    return count;
  };

  getCartCountClever = function() {
    var count = storage.getItem(GoodsCountKey);
    if (count>999) return "...";
    if (!count) return false;
    return count;
  };

  setCartCount = function(count) {
    storage.setItem(GoodsCountKey, count);
  };

})();



