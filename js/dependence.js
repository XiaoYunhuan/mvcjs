/**
 * Created by xiaoyunhuan on 2017/4/21.
 */
//CommonJS 模块声明
// maths.js
exports.per = function(value, total) {
    return( (value / total) * 100 );
};
// application.js
var Maths = require("./maths");
assertEqual( Maths.per(50, 100), 50 );

// maths.js
require.define("maths", function(require, exports){
    exports.per = function(value, total) {
        return( (value / total) * 100 );
    };
});
// application.js
require.define("application", function(require, exports){
    var per = require("./maths").per;
    assertEqual( per(50, 100), 50 );
}, ["./maths"]); // 给出它的依赖 (maths.js)













