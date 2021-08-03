'use strict'

function getTbody(index) {
    const tbodies = document.querySelectorAll('tbody');
    return tbodies.length < (index + 1) ? null : tbodies[index];
}

function getTbodyRows(index) {
    const tbody = getTbody(index);
    return tbody ? Array.from(tbody.rows) : [];
}

function csParse() {
    return getTbodyRows(0)
        .map(tr => {
            const tds = Array.from(tr.cells)
                .map(td => td.innerHTML);
            return [tds[1], tds[6], tds[7], tds[8], tds[9]]
        });
}

(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        switch (message.method) {
            case "csParse":
                const parsed = csParse();
                chrome.runtime.sendMessage({
                    method: "requestOnCsParsed",
                    payload: parsed
                });
                break;
        }
    });
})();
