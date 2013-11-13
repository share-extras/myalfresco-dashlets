function main()
{
   var endpointId = "myalfresco-api",
      connector = remote.connect(endpointId);

   var dashletResizer = {
      id : "DashletResizer",
      name : "Alfresco.widget.DashletResizer",
      initArgs : ["\"" + args.htmlid + "\"", "\"" + instance.object.id + "\""],
      useMessages: false
   };

   var dashlet = {
      id : "GitHubNotifications",
      name : "Extras.dashlet.MyAlfrescoSites",
      options: {
         endpointId: endpointId,
         clientId: connector != null ? connector.getDescriptor().getStringProperty("client-id") : "",
         authorizationUrl: "https://api.alfresco.com/auth/oauth/versions/2/authorize"
      }
   };
   
   model.widgets = [dashlet, dashletResizer];
}
main();