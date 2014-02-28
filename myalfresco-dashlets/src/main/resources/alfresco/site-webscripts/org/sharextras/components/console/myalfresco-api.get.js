function main()
{
   var endpointId = "myalfresco-api",
      connector = remote.connect(endpointId);

   model.endpointId = endpointId;
   model.clientId = connector !== null ? connector.getDescriptor().getStringProperty("client-id") : "";
   model.authorizationUrl = "https://api.alfresco.com/auth/oauth/versions/2/authorize";

   // TODO use model widgets object
}
main();