/**
 * Created by xiaoyunhuan on 2017/4/21.
 */
var object = {
    url: "http://example.com",
    getName: function(){ return "Trevor"; }
};
var template = '<li><a href="${url}">${getName()}</a></li>';
var element = jQuery.tmpl(template, object);
// 得到的结果 : <li><a href="http://example.com">Trevor</a></li>
$("body").append(element);


//绑定
var addChange = function(ob){
    ob.change = function(callback){
        if(callback){
            if(!this._change){
                this._change = [];
            }
            this._change.push(callback);
        }else{
            if(!this._change){
                return;
            }
            for(var i = 0; i < this._change.length; i++){
                this._change[i].apply(this);
            }
        }
    };
};

var object = {};
object.name = "Foo";
addChange(object);
object.change(function(){
    console.log("Changed!", this);
    //更新视图的代码
});
object.change();
object.name = "Bar";
object.change();

//模型中的事件绑定
var User = function(name){
    this.name = name;
};
User.records = [];
User.bind = function(ev, callback){
    var calls = this._callbacks || (this._callbacks = {});
    (this._callbacks[ev] || (this._callbacks[ev] = [])).push(callback);
};
User.trigger = function(ev) {
    var list, calls, i, l;
    if (!(calls = this._callbacks)){
        return this;
    }
    if (!(list = this._callbacks[ev])){
        return this;
    }
    jQuery.each(list, function(){ this() })
};
User.create = function(name){
    this.records.push(new this(name));
    console.log(new this(name));
    this.trigger("change");
};
jQuery(function($){
    User.bind("change", function(){
        var template = $("#userTmpl").tmpl(User.records);
        $("#users").empty();
        $("#users").append(template);
    });

    User.create("Sam Seaborn");
});



