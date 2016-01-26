//--------------------------------
// @authors: xlong
// @desc: 网络请求封装库，添加队列，清除所有网络请求功能
// @time: 2016-01-18
//--------------------------------

(function () {
  var requestQueue = []; //用于存储参数对象的队列

  // 创建请求，并且加入队列中
  makeRequest = function(url, data, success, failure, type, beforeSend) {
    if (!type) type = "get";
    var request = $.ajax({
      type: type,
      data: data,
      url: url,
      dataType: "json",
      success: function (re) {
        success(re);
      },
      error: function (err) {
        if (failure) failure(err);
      },
      beforeSend: function(request) {
        if (beforeSend)beforeSend(request);
      }
    });
    requestQueue.push(request);
  };

  // 清除所有请求
  clearRequest = function() {
    for(var i=0;i<requestQueue.length;i++) {
      var ajax = requestQueue[i];
      if (ajax)ajax.abort();
    }
    requestQueue = [];
  }

})();



