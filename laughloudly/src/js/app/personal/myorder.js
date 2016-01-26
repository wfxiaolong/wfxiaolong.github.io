define(['backbone', 'getTpl', 'juicer', 'swiper'], function(Backbone, getTpl, juicer, Swiper) {
    window.APP = window.APP || {};
    var APP = window.APP;

    var myorder = {};
    myorder.data = [];

    myorder.init = function(status) {
        myorder.flag = !!status;
        configBar();

        $('body').removeClass().addClass('bg-gray');
        $('.bottombar').hide();
        switch (status) {
            case '1':
                BAR.center('', '代付款订单');
                break;
            case '2':
                BAR.center('', '待处理订单');
                break;
            case '3':
                BAR.center('', '配送中订单');
                break;
            case '4':
                BAR.center('', '已完成订单');
                break;
            default:
                BAR.center('', '我的订单');
                // document.addEventListener('touchmove', function (event) {
                //   event.preventDefault();
                // }, false);       
                break;
        }

        myorder.params = {
            campus: localStorage.DM_schoolId,
            status: status || 1
        }
        var pageView = new myorder.PageView();
    };

    function configBar() {
        BAR.left('back', '返回');
        BAR.ell.on('click', function(event) {
            history.back();
        });
    }

    myorder.PageView = Backbone.View.extend({
        className: 'myorder nobottombar',
        events: {
            'click #myorder_type div': 'changeType',
            'click .js-goods-details': 'goodsDetails',
            'click .js-cancel': 'cancel',
            'click .js-pay': 'pay',
            'click .js-check': 'check',
            'swipeLeft #box_myorderlist': 'swipel',
            'swipeRight #box_myorderlist': 'swiper',
        },
        initialize: function() {
            var _self = this;
            this.on('render:page', function() {
                $('#loading').hide();
                $('.wraper').prepend(_self.el);
                myorder.flag || $('#myorder_type').css({
                    display: '-webkit-box'
                });
            });
            this.render();
        },
        render: function() {
            var _self = this;
            getTpl('personal/myorder', 'page', function(tpl) {
                if (tpl) {
                    $(_self.el).prepend(tpl);
                    _self.trigger('render:page');
                    _self.renderContent();
                }
            });
        },
        renderContent: function() {
            $('#box_myorderlist').empty();
            $('#crazyLoad').addClass('show');
            var _self = this;
            getJsonX('/orders', myorder.params, function(re) {
                if (re.state) {
                    if (re.data) {
                        var tpl = $('#tm_myorderlist').html();
                        var data = re.data;
                        for (var i = 0; i < data.length; i++) {
                            data[i].createdAt = data[i].createdAt.substr(0, 16).replace(/T/, ' ');
                        };
                        myorder.data = data;
                        this.templatec = this.templatec || juicer(tpl);
                        var html = this.templatec.render({
                            data: data
                        })
                        $('#crazyLoad').removeClass('show');
                        $('#box_myorderlist').html(html);
                    }
                } else {
                    console.log(re.msg)
                }
            }, function(err) {
                console.log(err)
            })
        },
        changeType: function(e) {
            e.preventDefault();
            $(e.currentTarget).addClass('active').siblings().removeClass('active');
            myorder.params.status = $(e.currentTarget).data('status');
            this.renderContent();
        },
        goodsDetails: function(e) {
            var index = $(e.currentTarget).data('index');
            var data = myorder.data[index].items;
            location.href = "#params/myorderlist&" + encodeURIComponent(JSON.stringify(data));
        },
        cancel: function(e) {
            var _self = this;
            var id = $(e.currentTarget).data('id');
            var dialog = $.dialog({
                content: '确定要取消该订单么？',
                button: ["否", "是"]
            });

            dialog.on("dialog:action", function(e) {
                if (e.index == 1) {
                    $('#crazyLoad p').text('正在取消订单');
                    $('#crazyLoad').addClass('show');
                    var data = {
                        orderId: id,
                        _method: "DELETE"
                    };
                    console.log(data)
                    var params = 'orderId=' + id + '&_method=' + 'DELETE&';
                    customRequestCX('orders/' + id + '?_method=DELETE&', '', function(re) {
                        console.log(re)
                        console.log("success");
                        $.tips({content: "订单已取消"})
                        $('#crazyLoad').removeClass('show').find('p').text('疯狂加载中...');
                        _self.renderContent();
                    }, function(re) {
                        console.log(re)
                        console.log("error");
                        $.tips({content: "订单取消失败"})
                        $('#crazyLoad').removeClass('show').find('p').text('疯狂加载中...');
                    }, 'POST')
                }
            });

        },
        pay: function(e) {
            var index = $(e.currentTarget).data('index');
            var data = myorder.data[index];
            console.log(data)  

            // 待处理
            data = {
                "cash": [],
                "bill": {
                    "objectId": "56a3348ad342d30054f818d6",
                    "serial": "160123363941002128",
                    "result": 3,
                    "createdAt": "2016-01-23T08:06:34.359Z",
                    "payments": [{
                        "key": "wechat",
                        "name": "微信支付",
                        "desc": {
                            "text": "订单支付待处理",
                            "style": "stroke",
                            "color": 16748325
                        }
                    }, {
                        "key": "alipay",
                        "name": "支付宝"
                    }]
                }
            }
            data = encodeURIComponent(JSON.stringify(data)); 
            
            location.href = "#params/payContent&" + data;

            // var params = {};
            // params.address = data.contact.address;
            // params.shops = {};
            // params.shops[data.shop.objectId] = {
            //   delivery: data.delivery.time,
            // }
            // // location.href = "#params/payContent&" + data;
            // console.log(params)
            // postJsonCX('/orders/'+ data.objectId , params, function (re) {
            //   if(re.state){
            //     var data = encodeURIComponent(JSON.stringify(re.data));

            //   }else{
            //     $.tips({content: re.msg});
            //   }        
            // }, function (err) {
            //   console.log(err)
            // })
        },
        check: function(e) {
            var _self = this;
            var id = $(e.currentTarget).data('id');
            $('#crazyLoad p').text('正在查询付款状态');
            $('#crazyLoad').addClass('show');
            var params = {
                campus: localStorage.DM_schoolId,
                status: 1
            }
            getJsonX('/orders', params, function(re) {
                if (re.state) {
                    if (re.data.length) {
                        var data = re.data;
                        var result = _.where(data, {
                            objectId: id
                        }).length;
                        if (length) {
                            $('#crazyLoad').removeClass('show').find('p').text('疯狂加载中');
                            $.tips({content: "尚未付款"})
                        } else {
                            $('#crazyLoad').removeClass('show').find('p').text('疯狂加载中');
                            $.tips({content: "你已付款"})
                            _self.render();
                        }
                    } else {
                        $('#crazyLoad').removeClass('show').find('p').text('疯狂加载中');
                        $.tips({content: "你已付款"})
                        _self.render();
                    }
                } else {
                    console.log(re.msg)
                }
            }, function(err) {
                console.log(err)
            })
        },
        swipel: function(e) {
            e.preventDefault();
            $('#myorder_type .active').next().click();
        },
        swiper: function(e) {
            e.preventDefault();
            $('#myorder_type .active').prev().click();
        }
    });

    return myorder;
});
