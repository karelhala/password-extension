chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  showPopup();
  setTimeout(() => sendToPopup(request.data), 100);
  sendResponse();
});

chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    toBrowser(msg);
  });
});

function sendToPopup(data) {
  chrome.runtime.sendMessage({
    fields: [{type: 'text', name: 'login'}, {type: 'password', name: 'password'}],
    key: data.key
  });
}

function toBrowser(data) {
  chrome.tabs.query({active: true}, function (tabs){
    chrome.tabs.sendMessage(tabs[0].id, data);
  });
}

function showPopup() {
  window.open("popup.html", "extension_popup", "width=300,height=400,status=no,scrollbars=yes,resizable=no,top=150");
}
