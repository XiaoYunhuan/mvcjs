//模块模式
// (function($, exports){
//     exports.Foo = "wem";
//
// })(jQuery, window);
//添加少量上下文
// (function($){
//     var mod = {};
//     mod.load = function(func){
//         $($.proxy(func, this));
//     };
//     mod.load(function(){
//         this.view = $("#view");
//     });
//     mod.assetsClick = function(e){
//         //处理点击
//     };
//     mod.load(function(){
//         this.view.find(".assets").click(
//             $.proxy(this.assetsClick, this)
//         );
//     });
// })(jQuery);
//抽象出库
// (function($, exports){
//     var mod = function(includes){
//         if(includes){
//             this.include(includes);
//         }
//     };
//     mod.fn = mod.prototype;
//
//     mod.fn.proxy = function(func){
//         return $.proxy(func, this);
//     };
//
//     mod.fn.load = function(func){
//         $(this.proxy(func));
//     };
//
//     mod.fn.include = function(ob){
//         $.extend(this, ob);
//     };
//
//     exports.Controller = mod;
// })(jQuery, window);
//
// (function($, Controller){
//     var mod = new Controller;
//     mod.toggleClass = function(e){
//         this.view.toggleClass("over", e.data);
//     };
//     mod.load(function(){
//        this.view = $("#view");
//        this.view.mouseover(true, this.proxy(this.toggleClass));
//        this.view.mouseout(false, this.proxy(this.toggleClass));
//     });
// })(jQuery, Controller);
//
// Controller.fn.unload = function(func){
//     jQuery(window).bind("unload", this.proxy(func));
// };

// 使用全局对象作为上下文，而不是 window 对象
// 用来创建全局对象
var exports = this;
(function ($) {
    var mod = {};
    mod.create = function (includes) {
        var result = function () {
            this.init.apply(this, arguments);
        };

        result.fn = result.prototype;
        result.fn.init = function () {
        };

        result.proxy = function (func) {
            return $.proxy(func, this);
        };
        result.fn.proxy = result.proxy;

        result.include = function (ob) {
            $.extend(this.fn, ob);
        };
        result.extend = function (ob) {
            $.extend(this, ob);
        };
        if (includes) {
            result.include(includes);
        }
        return result;
    };
    exports.Controller = mod;
})(jQuery);

jQuery(function($){
    //return function
   var ToggleView = Controller.create({
       init:function(view){
           this.view = $(view);
           this.view.mouseover(true, this.proxy(this.toggleClass));
           this.view.mouseout(false, this.proxy(this.toggleClass));
       },
       toggleClass: function(e){
           this.view.toggleClass("over", e.data);
       }
   });
   var bb = new ToggleView("#view");
   console.log(bb);
});

//访问视图
var exports = this;
jQuery(function($){
    exports.SearchView = Controller.create({
        //选择器到局部变量名的映射
        elements:{
            "input[type=search]":"searchInput",
            "form":"searchForm"
        },
        //所有事件名称，选择器，回调的映射
        events:{
            "submit form":"search"
        },
        //实例化时调用
        init: function(element){
            this.el = $(element);
            this.refreshElements();
            //this.searchForm.submit(this.proxy(this.search));
            this.delegateEvents();
        },
        search: function() {
            console.log("Searching:", this.searchInput.val());
            return false;
        },
        //私有
        $:function(selector){
            return $(selector, this.el);
        },
        //设置本地变量
        refreshElements: function(){
            for(var key in this.elements){
                this[this.elements[key]] = this.$(key);
            }
        },
        eventSplitter:/^(\w+)\s*(.*)$/,
        delegateEvents: function(){
            for(var key in this.events){
                var methodName = this.events[key];
                var method = this.proxy(this[methodName]);
                var match = key.match(this.eventSplitter);
                var eventName = match[1],
                    selector = match[2];

                if(selector === ''){
                    this.el.bind(eventName, method);
                }else{
                    this.el.delegate(selector, eventName, method);
                }
            }
        }
    });
   var aa = new SearchView("#users");
   console.log(aa);
});

//状态机
var Events = {
    bind:function(){
        if(!this.o){
            this.o = $({});
        }
        this.o.bind.apply(this.o, arguments);
    },
    trigger: function(){
        if(!this.o){
            this.o = $({});
        }
        this.o.trigger.apply(this.o, arguments);
    }
};

var StateMachine = function(){};
StateMachine.fn = StateMachine.prototype;

$.extend(StateMachine.fn, Events);

StateMachine.fn.add = function(controller){
    this.bind("change", function(e, current){
        if(controller == current){
            controller.activate();
        }else{
            controller.deactivate();
        }
    });
    controller.active = $.proxy(function(){
        this.trigger("change", controller);
    }, this);
};

var con1 = {
    activate: function(){
       $("#con1").addClass("active");
    },
    deactivate: function(){
        $("#con1").removeClass("active");
    }
};
var con2 = {
    activate: function(){
        $("#con2").addClass("active");
    },
    deactivate: function(){
        $("#con2").removeClass("active");
    }
};
var sm = new StateMachine;
sm.add(con1);
sm.add(con2);
con1.active();
// sm.trigger("change", con2);

//路由选择
//hash
window.location.hash = "foo";
//hashchange事件
window.addEventListener("hashchange", function(){},false);
$(window).bind("hashchange", function(event){});
jQuery(function(){
    var hashValue = location.hash.slice(1);
    if(hashValue){
        $(window).trigger("hashchange");
    }
});
//抓取ajax
//http://twitter.com/#!/maccman
//http://twitter.com/?_escaped_fragment_=/maccman

//HTML5 History API
var dataObject = {
    createdAt:'2011-10-10',
    author:'donnamoss'
};
var url = '/posts/new-url';
window.addEventListener("popstate",function(event){
    if(event.state){
       console.log(event.state);
   }
});
$(window).bind("popstate", function(event){
    event = event.originalEvent;
   if(event.state){
       console.log("state");
   }
});

//history.pushState(dataObject, document.title, url);




