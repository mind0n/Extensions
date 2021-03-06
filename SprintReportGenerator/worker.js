function parseSprintItem(itemEl){
    var type = $(itemEl).find('.ghx-type').prop('title').toLowerCase();
    var id = $(itemEl).find('a.js-key-link').prop('title');
    var link = $(itemEl).find('a.js-key-link').prop('href');
    var title = $(itemEl).find('span.ghx-inner')[0].innerHTML.trim();
    var assignEl = $(itemEl).find('.ghx-avatar-img')[0];
    var assign = assignEl?assignEl.getAttribute('data-tooltip'):'';
    if (assign){
        if (assign.indexOf(':')>0){
            assign = assign.split(':')[1].trim();
        }
    }
    var point = parseInt($(itemEl).find('span.ghx-statistic-badge')[0].innerHTML) || 0;
    var t = title.toLowerCase();
    if (t.indexOf('regression')<0 
        && t.indexOf('qa only')<0 
        && t.indexOf('[qa ')!=0
    ){
        return {type:type, id:id, assign:assign.toLowerCase(), link:link, title:title, point:point};
    }
    return null;
}
function isoffshore(item){
    if (!item.assign || (item.assign != 'ellis tian' && item.assign != 'mark yuan' && item.assign != 'matt ma')){
        return false;
    }
    return true;
}
function parseSprint(sprintEl, isbacklog){
    var title = isbacklog ? 'Backlog' : $(sprintEl).find('div.ghx-name span, div.ghx-summary span')[0].innerHTML;
    var bodyEl = $(sprintEl).find('div.ghx-issues, div.ghx-has-issues')[0];
    var list = [];
    for(var i=0; i<bodyEl.childNodes.length; i++){
        var itemEl = bodyEl.childNodes[i];
        if (itemEl.getAttribute('data-issue-id')){
            var item = parseSprintItem(itemEl);
            if (item){
                if (!isbacklog && !isoffshore(item)){
                    item = null;
                }
                if (item){
                    list[list.length] = item;
                }
            }
        }
    }
    return {
        mode:'sprint'
        , title:title
        , list:list
        , backlog:isbacklog
        , report:function(){
            console.log('===[' + this.title + ']=======================================');
            var point = 0;
            var groomed = 0;
            var nongroomed = 0;
            for(var i=0; i<this.list.length; i++){
                var item = this.list[i];
                if (!this.backlog){
                    if (isoffshore(item)){
                        point += item.point;
                    }
                }else{
                    point += item.point;
                }
                if (item.point == 0){
                    nongroomed++;
                }else{
                    groomed++;
                }
            }
            console.log('Total Committed Points: ' + point);
            console.log('Total Groomed: ' + groomed);
            console.log('Total Non-groomed: ' + nongroomed);
            console.log('----------------------------------------------------------------------------');
            for(var i=0; i<this.list.length; i++){
                var item = this.list[i];
                if (this.backlog){
                    console.log('(' + item.point + ')' + item.title);
                }else{
                    console.log('{' + item.assign + '}' + item.title);
                }
            }
            console.log(' ');
        }
    };
}
function parseGroup(groupEl){
    var group = {
        mode:'group'
        , sprints:[]
        , report: function(){
            for(var i=0; i<this.sprints.length;i++){
                var s = this.sprints[i];
                s.report();
            }
        }
    };
    for(var i=0; i<groupEl.childNodes.length; i++){
        var sprintEl = groupEl.childNodes[i];
        //$($0).find('div.ghx-name span.field-value')[0]
        var sprint = parseSprint(sprintEl);
        group.sprints[group.sprints.length] = sprint;
    }
    return group;
}
function generateSprintReport(){
    console.clear();
    var groupEl = $('.ghx-sprint-group')[0];
    var group = parseGroup(groupEl);
    group.report();

    var backlogEl = $('.ghx-backlog-group')[0];
    var backlog = parseSprint(backlogEl, true);
    backlog.report();
}
function generateStoryTitle(event){
    console.clear();
    var parentEl = $('#parent_issue_summary')[0];
    var curtEl = $('#key-val')[0];
    var titleEl = $('#summary-val')[0];
    var item = {
        title:titleEl.firstChild.nodeValue
    };
    if (parentEl){
        item.id = parentEl.getAttribute('data-issue-key');
        item.cid = curtEl.getAttribute('data-issue-key');
    }else{
        item.id = curtEl.getAttribute('data-issue-key');
    }
    var titleContent = item.id + " " + (item.cid?"("+item.cid+") ":" ") + item.title;
    console.log(titleContent);
    $('#quickSearchInput').val(titleContent);
    $('#quickSearchInput')[0].select();
    document.execCommand('copy');
    return titleContent;
}
function parseUrl(url){
    if (url.indexOf('pd/secure')>0){
        var btn = document.createElement('button');
        btn.value = btn.innerHTML = 'Generate Report';            
        btn.onclick = generateSprintReport;
        btn.className = 'aui-button aui-button-primary ghx-actions-tools';
        var area = $('.ghx-view-section')[0];
        area.insertBefore(btn, area.firstChild);
    }else if (url.indexOf('pd/browse')>0){
        var btn = document.createElement('button');
        btn.value = btn.innerHTML = 'Generate Title';            
        btn.onclick = generateStoryTitle;
        btn.className = 'aui-button aui-button-primary ghx-actions-tools generate_title';
        var area = $('header div.aui-page-header-actions')[0];
        area.insertBefore(btn, area.firstChild);
    }
}
var h = window.setInterval(function(){
    if ($){
        window.clearInterval(h);

        $(function(){
            parseUrl(window.location.href);
        });
    }
},500);
