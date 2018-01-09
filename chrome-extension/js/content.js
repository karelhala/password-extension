var port = chrome.runtime.connect();

// window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
window.addEventListener("message", function(event) {
  if (event.source != window)
    return;
  if (event.data.type && (event.data.type === "FROM_PAGE")) {        
    toBackground(event.data)
  } // else ignore messages seemingly not sent to yourself
}, false);

// window.addEventListener("message", event => doSomething(), false);
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    toPage(request.data);
    sendResponse();
  }
);

function toPage(data) {
  window.postMessage({ type: "FROM_SCRIPT", data: data}, "*");
}

function toBackground(data) {
  chrome.runtime.sendMessage({type: "SHOW_POPUP", data: data});
}
