<!--[if IE]>
<iframe id="yui-history-iframe" src="${url.context}/res/yui/history/assets/blank.html"></iframe> 
<![endif]-->
<input id="yui-history-field" type="hidden" />

<#assign el=args.htmlid?html>
<script type="text/javascript">//<![CDATA[
    new Extras.MyAlfrescoConsole("${el}").setMessages(${messages}).setOptions({
        endpointId: "${endpointId?js_string}",
        endpointUrl: "${endpointUrl?js_string}",
        clientId: "${clientId?js_string}",
        authorizationUrl: "${authorizationUrl?js_string}"
    });
//]]></script>
</script>

<div id="${el}-body" class="api-console">

    <div id="${el}-form" class="hidden">
        <div class="header-bar">
           <div class="title"><label for="${el}-userdata">${msg("label.title-form")}</label></div>
        </div>
        <div class="connect" id="${el}-connect">
            <div>${msg('message.notConnected')}</div>
            <button id="${el}-connectButton" name="connectButton" disabled="disabled">${msg('button.connect')}</button>
        </div>
        <div class="buttons needs-auth"><button name="${el}-clear-button" id="${el}-clear-button">${msg("button.clear")}</button></div>
        <div class="run-controls needs-auth">
            <select name="method" id="${el}-method"><option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option><option>OPTIONS</option></select>
            <span id="${el}-api-base">https://api.alfresco.com</span>/<span id="${el}-api-network">-default-</span>/<select id="${el}-root" class="api-method"><option>public/alfresco/versions/1</option><option>public/cmis/versions/1/atom</option><option>public/cmis/versions/1.1/browser</option></select>/<input id="${el}-path" name="path" class="api-path" />
            <textarea id="${el}-postdata" name="postdata"></textarea>
            <button type="submit" name="${el}-execute-button" id="${el}-execute-button">${msg("button.execute")}</button>
            ${msg("label.execute.key")}
        </div>
        <div class="api-results needs-auth" id="${el}-results"></div>
        </pre>
    </div>
</div>
