/**
 * Created by xiaoyunhuan on 2017/4/20.
 */
console.log( "a" );
setTimeout(function() {
    console.log( "c" )
}, 500 );
setTimeout(function() {
    console.log( "d" )
}, 500 );
setTimeout(function() {
    console.log( "e" )
}, 500 );
console.log( "b" );