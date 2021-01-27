define(function (require) {
    'use strict';
    let axios = require('axios');
    let render = require('./render');
    // 异步请求数据，并在前端渲染
    axios.get('/api/movies').then(function (response) {
        let $movieList = document.querySelector('.movie-list');
        if (response.status !== 200) {
            $movieList.innerHTML = '网络错误';
            return;
        }
        $movieList.innerHTML = render(response.data);
    });

    if('serviceWorker' in window.navigator){
        // 防止页面在首次打开的时候就进行缓存sw的资源，占用资源
        window.addEventListener('load',function(){
            // sw的作用域不同，监听的 fetch 请求也是不一样的
            navigator.serviceWorker.register('sw.js',{ scope:'/' })
            .then(res=>{
                console.log('register1',res)
            })
            navigator.serviceWorker.oncontrollerchange = function (event) {
                window.location.reload();
                console.log('update');
            };
            // 如果用户处于断网状态进入页面，用户可能无法感知内容是过期，需要提示用户断网了，并在重新连接后告诉用户
            if (!window.navigator.onLine) {
                alert('网络断开，内容可能已过期');
                window.addEventListener('online', function () {
                    alert('已连接网络');
                });
            }
        })
    };
});
