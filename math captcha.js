// ==UserScript==
// @name         Master Toán (Lucas)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Bố mày là Lucas
// @author       Bố mày là Lucas
// @match        *://*uptolink.one/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function solveCaptcha() {
        // 1. Tìm div chứa câu hỏi (có thể dùng selector dựa trên style hoặc text)
        let questionDiv = document.querySelector('div[style*="margin-bottom: 10px"][style*="font-size: 18px"][style*="font-weight: bold"]');
        if (!questionDiv) {
            // fallback: tìm bất kỳ div nào chứa "Bảo mật Captcha. Tính:"
            const allDivs = document.querySelectorAll('div');
            for (let div of allDivs) {
                if (div.innerText && div.innerText.includes('Bảo mật Captcha. Tính:')) {
                    questionDiv = div;
                    break;
                }
            }
        }

        if (!questionDiv) {
            console.log('Chưa tìm thấy captcha, có thể đã qua bước này.');
            return;
        }

        const questionText = questionDiv.innerText;
        const match = questionText.match(/Tính:\s*(\d+)\s*\+\s*(\d+)\s*=\s*\?/);
        if (!match) {
            console.log('Không trích xuất được số từ:', questionText);
            return;
        }

        const result = parseInt(match[1], 10) + parseInt(match[2], 10);
        console.log(`[AutoSolve] Captcha: ${match[1]} + ${match[2]} = ${result}`);

        // 2. Tìm input và điền kết quả
        const inputField = document.getElementById('math-captcha-response');
        if (!inputField) {
            console.log('Không tìm thấy input #math-captcha-response');
            return;
        }
        inputField.value = result;
        inputField.dispatchEvent(new Event('input', { bubbles: true }));
        inputField.dispatchEvent(new Event('change', { bubbles: true }));

        // 3. Tìm nút và click
        const submitBtn = document.getElementById('invisibleCaptchaShortlink');
        if (!submitBtn) {
            console.log('Không tìm thấy nút #invisibleCaptchaShortlink');
            return;
        }

        // Delay nhẹ để đảm bảo giá trị đã được cập nhật rồi mới click
        setTimeout(() => {
            submitBtn.click();
            console.log('[AutoSolve] Đã nhấn nút tiếp tục');
        }, 300);
    }

    // Chạy khi DOM tải xong
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(solveCaptcha, 500));
    } else {
        setTimeout(solveCaptcha, 500);
    }

    // Quan sát DOM thay đổi trong trường hợp captcha xuất hiện sau (AJAX)
    const observer = new MutationObserver(() => {
        if (document.getElementById('math-captcha-response') && !window._captchaSolvedFlag) {
            window._captchaSolvedFlag = true;
            solveCaptcha();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
