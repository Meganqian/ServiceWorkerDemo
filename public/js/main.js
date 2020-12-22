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
        window.addEventListener('load',function(){
            navigator.serviceWorker.register('sw.js',{scope:'/'})
            .then(res=>{
                alert('注册成功了',res)
            })
            navigator.serviceWorker.oncontrollerchange = function (event) {
                alert('页面已更新');
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
