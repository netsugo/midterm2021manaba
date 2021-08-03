'use strict'

// https://r17n.page/2019/10/27/chrome-extension-message-from-background-to-content/
// https://golang.hateblo.jp/entry/browser-extension-addon-messaging#contentScript%E3%81%8B%E3%82%89background%E3%81%AB%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E3%82%92%E9%80%81%E3%82%8B

function getTbody(index) {
    const tbodies = document.querySelectorAll('tbody');
    return tbodies.length < (index + 1) ? null : tbodies[index];
}

function parseManaba() {
    return getTbody(3).rows;
}

function searchArray(strArrays, name) {
    return strArrays.find(array => array[0] === name) || [name];
}

// heavy task (O(MN))
function onCsParsed(payload) {
    const trs = parseManaba();
    for (let i = 0; i < trs.length; i++) {
        const tds = trs[i].cells;
        [0, 3, 6].forEach(j => {
            const td = tds[j];
            const array = searchArray(payload, td.innerHTML);
            if (array.length > 0) {
                td.innerHTML = array.join("<br>");
            }
        })
    }
}

(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        switch (message.method) {
            case "onCreateTabComplete":
                break;
            case "onCsParsed":
                onCsParsed(message.payload);
                break;
        }
    });
    chrome.runtime.sendMessage({
        method: "createTab"
    });
})();
