function parseSprintItem(itemEl){
    var type = $(itemEl).find('.ghx-type').prop('title').toLowerCase();
    var id = $(itemEl).find('a.js-key-link').prop('title');
    var link = $(itemEl).find('a.js-key-link').prop('href');
    var title = $(itemEl).find('span.ghx-inner')[0].innerHTML;
    var point = parseInt($(itemEl).find('span.ghx-statistic-badge')[0].innerHTML) || 0;
    return {type:type, id:id, link:link, title:title, point:point};
}
function parseSprint(sprintEl){
    var title = $(sprintEl).find('div.ghx-name span, div.ghx-summary span')[0].innerHTML;
    var bodyEl = $(sprintEl).find('div.ghx-issues, div.ghx-has-issues')[0];
    var list = [];
    for(var i=0; i<bodyEl.childNodes.length; i++){
        var itemEl = bodyEl.childNodes[i];
        if (itemEl.getAttribute('data-issue-id')){
            var item = parseSprintItem(itemEl);
            list[list.length] = item;
        }
    }
    return {
        mode:'sprint'
        , title:title
        , list:list
    };
}
function parseGroup(groupEl){
    var group = {mode:'group', sprints:[]};
    for(var i=0; i<groupEl.childNodes.length; i++){
        var sprintEl = groupEl.childNodes[i];
        //$($0).find('div.ghx-name span.field-value')[0]
        var sprint = parseSprint(sprintEl);
        group.sprints[group.sprints.length] = sprint;
    }
    return group;
}
function generateSprintReport(){
    var groupEl = $('.ghx-sprint-group')[0];
    var group = parseGroup(groupEl);
    console.log(group);

    var backlogEl = $('.ghx-backlog-group')[0];
    var backlog = parseSprint(backlogEl);
    console.log(backlog);
}
var h = window.setInterval(function(){
    if ($){
        window.clearInterval(h);
        $(function(){
            var btn = document.createElement('button');
            btn.value = btn.innerHTML = 'Generate Report';            
            btn.onclick = generateSprintReport;
            btn.className = 'aui-button aui-button-primary ghx-actions-tools';
            var area = $('.ghx-view-section')[0];
            area.insertBefore(btn, area.firstChild);
        });
    }
},500);
