<@markup id="org_sharextras_myalfresco-search_css" target="css" action="after">
    <@link href="${url.context}/res/extras/components/search/myalfresco-search.css" group="search"/>
</@markup>
<@markup id="org_sharextras_myalfresco-search_js" target="js" action="after">
    <@script src="${url.context}/res/extras/components/search/myalfresco-search.js" group="search"/>
</@markup>
<@markup id="org_sharextras_myalfresco-search_content" target="html" action="before">
    <div id="${args.htmlid}-myalfresco-search" class="myalfresco-search">
        <div id="${args.htmlid}-myalfresco-search-header" class="myalfresco-search-header"><a href="#" id="${args.htmlid}-myalfresco-search-header-link"></a></div>
        <div id="${args.htmlid}-myalfresco-search-results" class="myalfresco-search-results"></div>
    </div>
</@markup>