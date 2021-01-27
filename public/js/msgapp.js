// 注册Service Worker
if(navigator.serviceWorker){
    var sendBtn = document.getElementById('send-msg-button')
    var value = document.getElementById('msg-input').value
    sendBtn.addEventListener('click',function(){
        // 主页面发送消息到Service Worker
        navigator.serviceWorker.controller.postMessage(value)
    })
    // 等待onload事件触发 为了首次尽快加载资源，减少白屏时间
    window.addEventListener('load',function(){
        // 注册service Worker,register返回一个promise scope属性指定service worker要控制的域
        navigator.serviceWorker.register('msgsw.js',{scope:'./'})
        .then(res=>{
            console.log(res)
        })
        .catch(err=>{
            console.log(err)
        })
    })
    
}else{
    alert('service Worker id not support')
}