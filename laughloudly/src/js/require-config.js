require.config({
  baseUrl: 'js',
  waitSeconds: 0,
  paths: {
    'zepto': 'lib/bower_components/zeptojs/zepto',
    'touch': 'lib/bower_components/zeptojs/src/touch',
    'jquery': 'lib/bower_components/zeptojs/zepto',
    'underscore': 'lib/bower_components/underscore/underscore',
    'backbone': 'lib/backbone',
    'juicer': 'lib/juicer',
    'getTpl': 'components/getTpl',
    'backbone.chosen': 'lib/backbone.chosen',
    'backbone.nested': 'lib/bower_components/backbone-nested-model/backbone-nested',
    'swiper': 'lib/swiper.min',
    'userAgent': 'components/userAgent',
    'fastclick': 'lib/bower_components/fastclick/lib/fastclick',
    'md5': 'lib/md5',
    'cookie': 'lib/bower_components/cookie/cookie',
    'comment': 'components/comment',
    'uploadImage': 'components/uploadImage',
    'frozen': 'lib/frozen/frozen',
    'kqrcode': 'lib/kqrcode',
    'slider':'components/slider',
  },

  shim: {
    'backbone': {
      exports: 'Backbone'
    },
    'underscore': {
      exports: '_'
    },
    'zepto': {
      exports: '$'
    },
    'swiper': {
      deps: ['zepto'],
      exports: 'Swiper'
    },
    'cookie': {
      exports: 'cookie'
    },
    'frozen': ['zepto'],
    'kqrcode': {
      exports: 'QRCode'
    },
    'slider': {
      deps: ['zepto']
    }
  }

});