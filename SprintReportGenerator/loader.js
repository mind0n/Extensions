function addjs(name){
    var s = document.createElement('script');
    s.src = chrome.extension.getURL(name);
    console.log(s.src);
    (document.head || document.documentElement).appendChild(s);
}
addjs('clip.js');
addjs('worker.js');
