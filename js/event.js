/**
 * Created by xiaoyunhuan on 2017/4/20.
 */
//页面载入后绑定事件  window的load事件
// jQuery(windwo).bind("load", function(){
//    $("#signinForm").submit(checkForm);
// });
// //DOM构建完成触发的事件  DOMContentLoaded
// jQuery.ready(function($){
//     $("#myForm").bind("submit", function(){});
// });
//DOMContentLoaded--更简单的方式
// jQuery(function($){});

//调用事件回调函数上下文的切换--绑定上下文--$.proxy()
// $("signinForm").submit($.proxy(function(){}, this));

//委托事件 ---.on() ,  .delegate()
//原理:
// list.addEventListener("click", function(e){
//    if(e.currentTarget.tagName == "li"){
//        /*...*/
//        return false
//    }
// }, false);

//自定义事件 .bind()  , .trigger()
// $(".class").bind('refresh.widget', function(){});
// $(".class").trigger("refresh.widget");
//
// $(".class").bind("frob.widget", function(event, dataNumber){
//     console.log(dataNumber);
// });
// $(".class").trigger("frob.widget", 5);

//实例
// jQuery.fn.tabs = function(control){
//     var element = $(this);
//     control = $(control);
//     element.find("li").bind("click", function(){
//         element.find("li").removeClass("active");
//         $(this).addClass("active");
//
//         var tabName = $(this).attr("data-tab");
//         control.find(">[data-tab]").removeClass("active");
//         control.find(">[data-tab='" + tabName + "']").addClass("active");
//     });
//     element.find("li:first").addClass("active");
//     return this;
// };
// $("ul#tabs").tabs("#tabsContent");

//修改--自定义事件
jQuery.fn.tabs = function(control){
    var element = $(this);
    control = $(control);

    element.on("click","li",function(){
        var tabName = $(this).attr("data-tab");
        element.trigger("change.tabs", tabName);
    });

    element.bind("change.tabs", function(e, tabName){
        element.find("li").removeClass("active");
        element.find(">[data-tab='" + tabName + "']").addClass("active");
    });

    element.bind("change.tabs", function(e, tabName){
        control.find(">[data-tab]").removeClass("active");
        control.find(">[data-tab='" + tabName + "']").addClass("active");
    });

    var firstName = element.find("li:first").attr("data-tab");
    element.trigger("change.tabs", firstName);
    return this;
};
$("ul#tabs").tabs("#tabsContent");
//hash
$("#tabs").bind("change.tabs", function(e, tabName){
    window.location.hash = tabName;
});
$(window).bind("hashchange", function(){
   var tabName =  window.location.hash.slice(1);
   $('#tabs').trigger("change.tabs", tabName);
});

//发布/订阅 -Pub/Sub 模式
//全局事件
var PubSub = {
    subscribe: function(ev, callback){
        var calls = this._callbacks || (this._callbacks = {});
        (this._callbacks[ev] || (this._callbacks[ev] = [])).push(callback);
        return this;
    },
    publish: function(){
        var args = Array.prototype.slice.call(arguments,0);
        //拿出第1个参数，事件名称
        var ev = args.shift();
        var list, calls, i, l;
        if(!(calls = this._callbacks)){
            return this;
        }
        if(!(list = this._callbacks[ev])){
            return this;
        }
        for(i = 0, l = list.length; i < l; i++){
            list[i].apply(this, args);
        }
        return this;
    }
};
PubSub.subscribe("wem", function(){
    console.log("wen");
    // alert("Wem!");
});
PubSub.publish("wem");


//一个简单sub/pub库
(function($){
    var o = $({});
    $.subscribe = function(){
        o.bind.apply(o, arguments);
    };
    $.unsubscribe = function(){
        o.unbind.apply(o, arguments);
    };
    $.publish = function(){
        o.trigger.apply(o, arguments);
    }
})(jQuery);

$.subscribe("/some/topic", function(event, a){
    console.log( event.type, a );
});
$.publish("/some/topic","我是参数");

//局部事件
var Assert = {};
jQuery.extend(Assert, PubSub);
Assert.subscribe("create", function(){
   console.log("我是局部事件的回调函数!")
});
Assert.publish("create");

