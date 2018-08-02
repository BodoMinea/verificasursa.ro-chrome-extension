var tmpurl;

function extractHostname(url) {
    var hostname;
    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    return hostname;
}

function sitealert(){
  var opt = {   
    type: 'basic', 
    iconUrl: 'icon-128.png', 
    title: "Atenție!", 
    buttons: [{
            title: "Detalii ->"
        }],
    message: "Site-ul pe care vă aflați este cunoscut pentru promovarea unor articole cu informații false, exagerate, neverificate și din surse îndoielnice." 
    }
	
	chrome.notifications.create('sitealert', opt, function(id) { console.log("Last error:", chrome.runtime.lastError); });
}

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
var danger = danger.split(".").join("[.]").replace(/\s/g,'');
console.log(danger);
var pattern = RegExp(danger);

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.url) {
	    if(pattern.test(extractHostname(tab.url.replace('www.','')))) {
	    	tmpurl = extractHostname(tab.url.replace('www.',''));
	    	sitealert();
	    }
	}

	chrome.notifications.onButtonClicked.addListener(function callback(){
		window.open('https://verificasursa.ro/intrari/'+tmpurl);
	})
});
