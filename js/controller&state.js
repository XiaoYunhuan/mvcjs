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
(function($, exports){
    var mod = function(includes){
        if(includes){
            this.include(includes);
        }
    };
    mod.fn = mod.prototype;

    mod.fn.proxy = function(func){
        return $.proxy(func, this);
    };

    mod.fn.load = function(func){
        $(this.proxy(func));
    };

    mod.fn.include = function(ob){
        $.extend(this, ob);
    };

    exports.Controller = mod;
})(jQuery, window);

(function($, Controller){
    var mod = new Controller;
    mod.toggleClass = function(e){
        this.view.toggleClass("over", e.data);
    };
    mod.load(function(){
       this.view = $("#view");
       this.view.mouseover(true, this.proxy(this.toggleClass));
       this.view.mouseout(false, this.proxy(this.toggleClass));
    });
})(jQuery, Controller);

Controller.fn.unload = function(func){
    jQuery(window).bind("unload", this.proxy(func));
};

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























