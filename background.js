var xhr = new XMLHttpRequest();
xhr.open("GET", "https://verificasursa.ro", false);
xhr.send();
var result = document.createElement( 'html' );
result.innerHTML = xhr.responseText;
var divs = result.getElementsByTagName("h4");
var danger = '(';
for(var i = 0; i < divs.length; i++){
   danger += divs[i].innerText;
   if (i < divs.length-1) { danger += '|'; }
}
danger += ')';
var danger = danger.split(".").join("[.]");
console.log(danger);
chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    var query = tabs[0].url;
    search = function(){
    chrome.tabs.create({url: "https://verificasursa.ro?url=" + query});
  };
  chrome.contextMenus.create({
    title: "Verifică Sursa!",
    contexts:["all"],
    onclick: search
  });
  });
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlMatches: danger },
          })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});
