define(function () {
  var DEV,                // 开发环境标志
      VERSION,
      REL_URL,            // tpl相对路径
      INDEX_REL_URL;      // index.html 相对路径

  DEV = true;
//  DEV = false;

  VERSION = '1.0.0';

  if (DEV) {  // src开发环境
    REL_URL = '';
    INDEX_REL_URL = 'src/';
  } else {  // dist线上环境
    REL_URL = 'dist/v' + VERSION +'/';
    INDEX_REL_URL = '';
  }

  var Config = {
    version: VERSION,
    relURL: REL_URL,
    indexRelURL: INDEX_REL_URL
  };

  return Config
});