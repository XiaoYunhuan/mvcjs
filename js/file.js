/**
 * Created by xiaoyunhuan on 2017/4/21.
 */
var input = $("input[type=file]");
input.change(function(){
    var files = this.files;
    for (var i=0; i < files.length; i++)
        console.log(files[i].type.match(/image.*/));
});

var element = $("#dragme");
element.bind("dragstart", function(event){
// 我们不想使用 jQuery 的抽象方法
    event = event.originalEvent;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", $(this).text());
    event.dataTransfer.setData("text/html", $(this).html());
    event.dataTransfer.setDragImage(document.getElementById("aa"), 0, 0);
    event.dataTransfer.setData("text/uri-list", "http://example.com");
    event.dataTransfer.setData("text/plain", "http://example.com");
    event.dataTransfer.setData("DownloadURL", [
        "application/octet-stream", // MIME 类型
        "File.exe", // 文件名
        "http://example.com/file.png" // 文件地址
    ].join(":"));
});