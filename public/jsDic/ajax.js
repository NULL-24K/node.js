/**
 * Created by chubin on 2018/4/24.
 */
/* 封装ajax函数
 2  * @param {string}opt.type http连接的方式，包括POST和GET两种方式
 3  * @param {string}opt.url 发送请求的url
 4  * @param {boolean}opt.async 是否为异步请求，true为异步的，false为同步的
 5  * @param {object}opt.data 发送的参数，格式为对象类型
 6  * @param {function}opt.success ajax发送并接收成功调用的回调函数
 7  */
    function ajax(opt) {
            opt = opt || {};
           // opt.method = opt.method.toUpperCase() || 'POST';
           opt.method = (opt.method==null?"GET":opt.method.toUpperCase());
            opt.url = opt.url || '';
            opt.async = opt.async || true;
             opt.data = opt.data || null;
           opt.success = opt.success || function () {};
             var xmlHttp = null;
             if (XMLHttpRequest) {
                     xmlHttp = new XMLHttpRequest();
                 }
            else {
                     xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
                 }var params = [];
             for (var key in opt.data){
                     params.push(key + '=' + opt.data[key]);
                 }
             var postData = params.join('&');
             if (opt.method.toUpperCase() === 'POST') {
                     xmlHttp.open(opt.method, opt.url, opt.async);
                     xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
                     xmlHttp.send(postData);
                 }
             else if (opt.method.toUpperCase() === 'GET') {
                     xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
                     xmlHttp.send(null);
                 }
             xmlHttp.onreadystatechange = function () {
                     if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                             opt.success(xmlHttp.responseText);
                         }
                 };
    }

function Ajax(obj){
    this.method = obj.method || '';
    this.url = obj.url || '';
    this.callback = obj.callback || '';
    this.data = obj.data || '';
};
Ajax.prototype.send = function(method,url,callback,data){
    var method = method || this.method;
    var data = data || this.data;
    var url = url || this.url;
    var callback = callback || this.callback;
    var xhr = new XMLHttpRequest();//新建ajax请求，不兼容IE7以下
    xhr.onreadystatechange = function(){//注册回调函数
        if(xhr.readyState === 4){
            if(xhr.status === 200)
                callback(xhr.responseText);
            else
                alert('服务器未打开，请运行node server.js');
        }
    }
    if(method === 'get'){//如果是get方法，需要把data中的数据转化作为url传递给服务器
        if(typeof data === 'object'){
            var data_send = '?';
            for(var key in data){
                data_send+=key+'='+data[key];
                data_send+='&';
            }
            data_send = data_send.slice(0,-1);
            console.log(data_send);
        }
        xhr.open(method,url+data_send,true);
        xhr.send(null);
    }else if(method === 'post'){//如果是post，需要在头中添加content-type说明
        xhr.open(method,url,true);
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.send(JSON.stringify(data));//发送的数据需要转化成JSON格式
    }else {
        console.log('不识别的方法:'+method);
        return fasle;
    }
}