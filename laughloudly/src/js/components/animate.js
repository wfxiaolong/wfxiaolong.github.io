//--------------------------------
// @authors: yewei
// @desc: 动画效果
// @time: 2016-01-25
//--------------------------------

(function () {
  aniAddToCart = function ($imgwrap, $cart, w0, fn) {
      var $img = $imgwrap.find('img').clone().appendTo('body'),
          h0 = 30/$img.width()*$img.height(),
          top = $imgwrap.offset().top - $('body').scrollTop(),
          left = $imgwrap.offset().left,                
          w = $imgwrap.width(), 
          h = $imgwrap.height(),
          tops = top + h/2 - h0/2,
          lefts = left + w/2 - w0/2,             
          tope = $cart.offset().top - $('body').scrollTop(),
          lefte = $cart.offset().left,
          time = 1.5*Math.sqrt((tope - tops)*(tope - tops)+(lefte - lefts)*(lefte - lefts));  
      $cart.removeClass('on');
      $img.css({
        position: "fixed",
        top: tops,
        left: lefts,
        width: w0,
        height: h0,
        'z-index': 91
      });
      var aniStyle = [              
        "@-webkit-keyframes cart {",
        "0% {top:" + tops + "px;" + "left:" + lefts +"px }",
        "100% {top:"+ tope +"px ;"+ "left:"+ lefte +"px }",
        "}",
        "@keyframes cart {",
        "0% {top:" + tops + "px ;" + "left:" + lefts +"px }",
        "100% {top:"+ tope +"px ;"+ "left:"+ lefte +"px }",
        "}"
      ].join('');            
      $('style').append(aniStyle);
      // 加入购物车动画
      var aniClass = [
        ".ani-cart{",
        "animation: cart cubic-bezier(0.33,-0.21, 0.53, 0.21) " + time + "ms forwards",
        "}",
      ].join('');
      $('style').append(aniClass);
      $img.addClass('ani-cart');
      setTimeout(function () {
        $img.remove();
        $cart.addClass('on');
        fn();
      }, time)
    }
})();



