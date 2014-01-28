<@markup id="css" >
   <#-- CSS Dependencies -->
   <@link rel="stylesheet" type="text/css" href="${url.context}/res/extras/components/dashlets/myalfresco-sites.css" group="dashlets"  />
</@>

<@markup id="js">
   <#-- JavaScript Dependencies -->
   <@script type="text/javascript" src="${url.context}/res/extras/components/dashlets/myalfresco-sites.js" group="dashlets"/>
</@>

<@markup id="widgets">
   <@createWidgets group="dashlets"/>
</@>

<@markup id="html">
   <@uniqueIdDiv>
      <#assign id = args.htmlid>
      <div class="dashlet myalfresco-sites-dashlet">
         <div class="title">${msg('dashlet.title')}</div>
         <div class="body scrollableList" <#if args.height??>style="height: ${args.height}px;"</#if>>
            <div id="${id}-connect" class="connect">
               <div>${msg('message.notConnected')}</div>
               <button id="${id}-connectButton" name="connectButton" disabled="disabled">${msg('button.connect')}</button>
            </div>
            <div id="${id}-sites" class="site-list"></div>
         </div>
      </div>
   </@uniqueIdDiv>
</@markup>