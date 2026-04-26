// ==UserScript==
// @name         Tự động chuyển hướng sau 5 phút
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ở trang https://linkhuongdan.online/, sau 10 phút về kiemgao.site/nhiemvu
// @author       Bố mày là Lucas
// @match        https://linkhuongdan.online/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Thời gian chờ: 4 phút = 240000 mili giây
    const delay = 300000;

    // Hàm chuyển hướng
    function redirect() {
        window.location.href = "https://kiemgao.site/nhiemvu";
    }

    // In ra console để biết script đã chạy
    console.log(`Script đã được kích hoạt. Trang sẽ chuyển hướng sau ${delay/1000} giây.`);

    // Đặt hẹn giờ
    setTimeout(redirect, delay);
})();
