'use strict'

const targetUrl = "https://www.cs.tsukuba.ac.jp/lecture/midterm/local/21_data/index.html";
const createdTabIds = [];


function sendToActiveTab(message) {
    chrome.tabs.query({ active: true }, (tabs) => {
        const targetId = tabs[0].id
        chrome.tabs.sendMessage(targetId, message);
    });
}

function onUpdateComplete(tabId, tab) {
    const url = tab.url;
    if (url && url === targetUrl) {
        sendToActiveTab({
            method: "onCreateTabComplete"
        });
        chrome.tabs.sendMessage(tabId, {
            method: "csParse"
        });
    }
}

function onCreateTab(tab) {
    createdTabIds.push(tab.id)
}

function createTab() {
    const properties = {
        active: false,
        url: targetUrl
    };
    chrome.tabs.create(properties, onCreateTab);
}

function requestOnCsParsed(payload) {
    sendToActiveTab({
        method: "onCsParsed",
        payload: payload
    })
}

(() => {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        switch (changeInfo.status) {
            case "complete":
                onUpdateComplete(tabId, tab)
                break;
            default:
                break;
        }
    })
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        switch (message.method) {
            case "createTab":
                createTab();
                break;
            case "requestOnCsParsed":
                requestOnCsParsed(message.payload)
                break;
            default:
                break;
        }
    });
})();
