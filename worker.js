function generateSprintReport(){
    console.log($('.ghx-sprint-group')[0]);
}
var h = window.setInterval(function(){
    if ($){
        window.clearInterval(h);
        $(function(){
            var btn = document.createElement('button');
            btn.value = btn.innerHTML = 'Generate Report';            
            btn.onclick = generateSprintReport;
            btn.className = 'aui-button ghx-actions-tools';
            var area = $('.ghx-view-section')[0];
            area.insertBefore(btn, area.firstChild);
        });
    }
},500);
