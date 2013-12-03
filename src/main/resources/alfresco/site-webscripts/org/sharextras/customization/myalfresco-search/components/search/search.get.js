function main()
{
   var endpointId = "myalfresco-api",
      connector = remote.connect(endpointId),
      searchWidget = {
         id : "MyAlfrescoSearch",
         name : "Extras.component.MyAlfrescoSearch",
         options : {
            endpointId: endpointId,
            clientId: connector != null ? connector.getDescriptor().getStringProperty("client-id") : "",
            authorizationUrl: "https://api.alfresco.com/auth/oauth/versions/2/authorize",
            initialSearchTerm: model.searchTerm
         }
      };
   model.widgets.push(searchWidget);
}
main();