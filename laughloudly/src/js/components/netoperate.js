//--------------------------------
// @authors: xlong
// @desc: 笑呵呵网络请求封装库
// @time: 2016-01-14
//--------------------------------

(function () {
  var BaseUrl = "https://www.xiaohehe.org/m/api/";
  var openidKey = "DM_OpenId";
  var campusKey = "DM_schoolId";

  var storage = window.localStorage;

  /// 发送get请求的地址，返回数据转json，并且添加上openid
  getJsonX = function (url, data, success, failure) {
    var append = "?openid=" + getOpenid();  // 添加openid
    url = BaseUrl + url + append;
    createRequest(url, data, success, failure);
  };

  /// 发送get请求的地址，返回数据转json，并且添加上openid 以及商城id campuse
  getJsonCX = function (url, data, success, failure) {
    var appendId = "?openid=" + getOpenid();         // 添加openid
    var appendCamp = "&campus=" + getCampus();   // 添加campuses
    url = BaseUrl + url + appendId + appendCamp;
    createRequest(url, data, success, failure);
  };

  /// 发送get请求的地址，返回数据转json，并且添加上openid 以及商城id  campuses
  getJsonCXX = function (url, data, success, failure) {
    var appendId = "?openid=" + getOpenid();         // 添加openid
    var appendCamp = "&campuses=" + getCampus();   // 添加campuses
    url = BaseUrl + url + appendId + appendCamp;
    createRequest(url, data, success, failure);
  };

  /// 发送get请求的地址，返回数据转json，并且添加上openid 以及商城id + campuse + shopid
  getJsonCXS = function (url, data, success, failure) {
    var appendId = "?openid=" + getOpenid();         // 添加openid
    var shopId = "&shop=" + getShop();                // 添加shopid
    var appendCamp = "&campus=" + getCampus();       // 添加campuses
    url = BaseUrl + url + appendId + appendCamp + shopId;
    createRequest(url, data, success, failure);
  };

  /// 发送get请求的地址，返回数据转json，并且添加上openid
  postJsonX = function (url, data, success, failure) {
    var appendId = "?openid=" + getOpenid();         // 添加openid
    url = BaseUrl + url + appendId;
    createRequest(url, data, success, failure, 'post');
  };

  /// 发送get请求的地址，返回数据转json，并且添加上openid 以及商城id  campus
  postJsonCX = function (url, data, success, failure) {
    var appendId = "?openid=" + getOpenid();         // 添加openid
    var appendCamp = "&campus=" + getCampus();   // 添加campus
    url = BaseUrl + url + appendId + appendCamp;
    createRequest(url, data,success, failure, 'post');
  };

  /// 发送get请求的地址，返回数据转json，并且添加上openid 以及商城id  campuses
  postJsonCXX = function (url, data, success, failure) {
    var appendId = "?openid=" + getOpenid();         // 添加openid
    var appendCamp = "&campuses=" + getCampus();   // 添加campuses
    url = BaseUrl + url + appendId + appendCamp;
    createRequest(url, data, success, failure, 'post');
  };

  // 添加任意类型的请求，返回数据转json，并且添加上openid 以及商城id  campus
  customRequestCX = function(url, data, success, failure, type, beforeSend) {
    var appendId = "openid=" + getOpenid();         // 添加openid
    var appendCamp = "&campus=" + getCampus();   // 添加campuse
    url = BaseUrl + url + appendId + appendCamp;
    createRequest(url, data, success, failure, type, beforeSend);
  };

  // 统一发送请求，这里进行一个统一的处理，例如没有错误码处理，登录认证
  createRequest = function(url, data, success, failure, type, beforeSend) {
    makeRequest(url, data, function(re){
      if (!re.state) {
        $.tips({content: re.msg});
        if (re.code == "411") {
          // 需要登录
          location.href = '#page/login';
        }
      }
      success(re);
    }, function(re){
      console.log(JSON.stringify(re));
    }, type, beforeSend);
  };

  clearAllRequest = function() {
    clearRequest();
  };

  getShop = function() {
    var shopid = storage.getItem("DM_shopId");
    return shopid;
  };

  getCampus = function() {
    var campus = storage.getItem(campusKey);
    if (!campus) {
      // 需要定位
      location.href = '#page/city';
    } else {
      return campus;
    }
  };

  // 判断是否有openid 返回openid
  getOpenid = function () {
    var openid = storage.getItem(openidKey);
    // 测试代码
    openid = "oWDWeuJ910PI8UmPjxvK758Pzseo";
    openid = "oWDWeuJ910PI8UmPjxvK758P1113";
    storage.setItem(openidKey, openid);

    if (openid) return openid;

    // 授权获取openid
    var aurl = encodeURIComponent(APP.globalConfig.baseURL + "/system/webapp/" + AppConfig.indexRelURL + "?#");
    if (redirect) {
      aurl = aurl + redirect;
    }
    /// 微信回调地址
    var cburl = encodeURIComponent(APP.globalConfig.baseURL.replace(/\/\/\d+/, '//' + AppConfig.wxAuthPhpSubdom) + "/weixinAuth.php?url=" + aurl);
    /// 发送到微信服务器
    location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID + "&redirect_uri=" + cburl + "&response_type=code&scope=snsapi_userinfo&state=" + state + "#wechat_redirect";

  };
})();



