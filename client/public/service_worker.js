chrome.action.onClicked.addListener(function () {
  chrome.windows.create({
    url: chrome.runtime.getURL("index.html"),
    type: "popup",
    width: 960,
    height: 640,
  });
});

chrome.webRequest.onCompleted.addListener(
  function (details) {
    chrome.runtime.sendMessage({
      type: "request",
      details: {
        id: details.requestId,
        url: details.url,
        statusCode: details.statusCode,
        method: details.method,
        timeStamp: details.timeStamp,
        type: details.type,
        initiator: details.initiator,
      },
    });
  },
  { urls: ["<all_urls>"] }
);
