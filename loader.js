var s = document.createElement('script');
s.src = chrome.extension.getURL("worker.js");
console.log(s.src);
(document.head || document.documentElement).appendChild(s);

