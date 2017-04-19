/**
 * Created by xiaoyunhuan on 2017/4/19.
 */
//断言方法
var assert = function(value, msg){
  if(!value){
      throw(msg || (value + "does not equal true"));
  }
};
var assertEqual = function(val1, val2, msg){
  if (val1 !== val2 ){
      throw(msg || (val1 + "does not equal " + val2));
  }
};
//模型--把数据包装成模型实例--数据是面向对象的

//视图--解耦出来

//控制器
var Controller = {};
(Controller.users = function(s){
    var nameClick = function(){};
    $(function(){
        $("#view .name").click(nameClick);
    })
})(jQuery);

//类模拟库
var Class = function(parent){
    var klass = function(){
        this.init.apply(this, arguments);
    };
    //改变klass的原型
    if(parent){
        var subclass = function(){};
        subclass.prototype = parent.prototype;
        klass.prototype = new subclass;
    }
    //实例初始化方法
    klass.prototype.init = function(){};

    //定义prototype的别名
    klass.fn = klass.prototype;

    //添加一个proxy函数，控制"类"库的作用域
    klass.proxy = function(func){
        var self = this;
        return (function(){
            return func.apply(self, argumensts);
        });
    };
    //在实例中也添加proxy函数
    klass.fn.proxy = klass.proxy;


    //定义类的别名
    klass.fn.parent = klass;

    klass._super = klass.__proto__;

    //给类添加属性
    klass.extend = function(obj){
      var extended = obj.extended;
      for(var i in obj){
          klass[i] = obj[i];
      }
      if(extended){
          extended(klass);
      }
    };

    //给实例添加属性
    klass.include = function(obj){
        var included = obj.included;
        for(var i in obj){
            klass.fn[i] = obj[i];
        }
        if(included){
            included(klass);
        }
    };
    return klass;
};

//new 一个新类Person
var Person = new Class;
//给Person添加静态方法
Person.extend({
   find: function(id){},
   exists: function(id){},
   //实现支持了extended，included回调
   extended: function(klass){
       console.log(klass, "was extended!");
   }
});
//给Person添加实例方法
Person.include({
   save: function(id){},
    destory: function(id){}
});
//调用静态方法
Person.find(1);
//实例化，调用实例方法
var person = new Person;
person.save();


//js中函数调用情况分类---this
//1.函数调用
//2.方法调用
//3.apply(),call()

// this分析
// $('.clicky').click(function(){
//     //'this' 指向当前节点
//     $(this).hide()
// });

// $('p').each(function(){
//    //'this'指向本次迭代
//     $(this).remove();
// });

var clicky = {
    wasClicked: function(){console.log("wasClicked1")},
    addListeners: function(){
        //访问原始上下文，this存入局部变量中
        var self = this;
        $('.clicky').click(function(){
            self.wasClicked();
        })
    }
};
clicky.addListeners();

//代理函数
var proxy = function(func, thisObject){
    return (function(){
       return func.apply(thisObject,arguments);
    });
};

var clicky1 = {
    wasClicked: function(){console.log("wasClicked2");},
    addListeners: function(){
        $('.clicky').click(proxy(this.wasClicked, this));
    }
};
clicky1.addListeners();

//klass.proxy函数应用
var Button = new Class;
// Button.include({
//     init: function(element){
//         this.element = jQuery(element);
//         //代理了这个click函数
//         this.element.click(this.proxy(this.click));
//     },
//     click: function(){}
// });

//bind()函数实现
    Function.prototype.bind = function(obj){
        var slice = [].slice,
            args = slice.call(arguments, 1),
            self = this,
            nop = function(){},
            bound = function(){
                //console.log(this);//此处this为element
                //console.log(this instanceof nop );//false
                return self.apply(this instanceof nop ? this : (obj ||{}), args.concat(slice.call(arguments)));
            };
            nop.prototype = self.prototype;
            bound.prototype = new nop();
            return bound;
    };

//es5-bind()函数应用
Button.include({
    init: function(element){
        this.element = jQuery(element);
        //代理了这个click函数
        this.element.click(this.click.bind(this));
    },
    click: function(){}
});
var button = new Button;
button.init('.clicky');





