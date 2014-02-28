<!--[if IE]>
<iframe id="yui-history-iframe" src="${url.context}/res/yui/history/assets/blank.html"></iframe> 
<![endif]-->
<input id="yui-history-field" type="hidden" />

<#assign el=args.htmlid?html>
<script type="text/javascript">//<![CDATA[
    new Extras.MyAlfrescoConsole("${el}").setMessages(${messages}).setOptions({
        endpointId: "${endpointId?js_string}"
    });
//]]></script>
</script>

<div id="${el}-body" class="api-console">

    <div id="${el}-form" class="hidden">
        <div class="header-bar">
           <div class="title"><label for="${el}-userdata">${msg("label.title-form")}</label></div>
        </div>
        <div>
            ${msg("label.path")}:
            https://api.alfresco.com/-default-/public/alfresco/versions/1/<input id="${el}-path" name="path" class="api-path" />
            <button type="submit" name="${el}-execute-button" id="${el}-execute-button">${msg("button.execute")}</button>
            ${msg("label.execute.key")}
        </div>
        <div class="api-result" id="${el}-result"></div>
        <pre class="api-response prettyprint" id="${el}-response">
        </pre>
    </div>
</div>
