/**
 * Created by xiaoyunhuan on 2017/4/20.
 */
//MVC和命名空间
var User = function(attrs){
    this.attributes = attrs || {};
};

User.prototype.destory = function(){
  /*     */
};
User.fetchRemote = function(){
    /*  */
};

// ORM Object-relational mapper 对象关系映射
//原型继承
//实现Object.create()
if(typeof Object.create !== "function"){
    Object.create = function(o){
        function F(){};
        F.prototype = o;
        return new F();
    }
}
//Model对象 用于创建新模型和实例
var Model = {
    inherited: function(){},
    created: function(){
        this.records = {};
        this.attributes = [];
    },
    prototype:{
        init: function(){}
    },
    create: function(){
        var object = Object.create(this);
        object.parent = this;
        object.prototype = object.fn = Object.create(this.prototype);
        object.created();
        this.inherited(object);
        return object;
    },
    init: function(){
        var instance = Object.create(this.prototype);
        instance.parent = this;
        instance.init.apply(instance, arguments);
        return instance;
    },
    extend: function(o){
        var extended = o.extended;
        jQuery.extend(this, o);
        if(extended){
            extended(this);
        }
    },
    include: function(o){
        var included = o.included;
        jQuery.extend(this.prototype, o);
        if(included){
            included(this);
        }
    }
};
//添加对象属性
Model.extend({
    find: function (id) {
        if(this.records[id]){
            return this.records[id].dup();
        }
        throw("Unknown record");
    },
    //向ORM中添加记录
    populate: function(values){
        this.records = {};
        for(var i = 0, il = values.length; i< il; i++){
            var record = this.init(values[i]);
            record.newRecord = false;
            this.records[record.id] = record;
        }
    }
});
//添加实例属性
Model.include({
    init: function(atts){
        for(var i in atts){
            this[i] = atts[i];
        }
    },
    load: function(attributes){},

    newRecord: true,
    create: function(){
        if(!this.id){
            this.id = Math.guid();
        }
        this.newRecord = false;
        this.parent.records[this.id] = this.dup();
    },
    destroy: function(){
        delete this.parent.records[this.id];
    },
    update: function(){
        this.parent.records[this.id] = this.dup();
    },
    save: function(){
        this.newRecord ? this.create() : this.update();
    },
    dup: function(){
        return jQuery.extend(true, {}, this);
    },
    attributes: function(){
        var result = {};
        for(var i in this.parent.attributes){
            var attr = this.parent.attributes[i];
            result[attr] = this[attr];
        }
        result.id = this.id;
        return result;
    },
    toJSON: function(){
        return this.attributes();
    },
    createRemote: function(url, callback){
        $.post(url, this.attributes(), callback);
    },
    updateRemote: function(url, callback){
        $.ajax({
            url: url,
            data: this.attributes(),
            success: callback,
            type: "PUT"
        });
    }
});

//生成随机数
Math.guid = function(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0,
            v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    }).toUpperCase()
};
//本地存储
Model.LocalStorage = {
    saveLocal: function(name){
        var result = [];
        for(var i in this.records){
            result.push(this.records[i]);
        }
        localStorage[name] = JSON.stringify(result);
    },
    loadLocal: function(name){
        var result = JSON.parse(localStorage[name]);
        this.populate(result);
    }
};

var Asset = Model.create();

Asset.extend(Model.LocalStorage);

Asset.attributes = ["name", "ext"];
var asset = Asset.init({name: "document", ext: ".txt"});
asset.save();
var json = JSON.stringify(Asset.records);
console.log(json);
console.log(Asset.records);

// Asset.init({name:"jason.txt"}).createRemote("/assets");



