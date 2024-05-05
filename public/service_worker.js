chrome.action.onClicked.addListener(function () {
  chrome.windows.create({
    url: chrome.runtime.getURL("index.html"),
    type: "popup",
    width: 960,
    height: 640,
  });
});
