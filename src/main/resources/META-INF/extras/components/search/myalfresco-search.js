/*
 * Copyright (C) 2010-2013 Share Extras contributors
 *
 * This file is part of the Share Extras project.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
* Extras root namespace.
* 
* @namespace Extras
*/
if (typeof Extras == "undefined" || !Extras)
{
   var Extras = {};
}

/**
* Extras dashlet namespace.
* 
* @namespace Extras.component
*/
if (typeof Extras.component == "undefined" || !Extras.component)
{
   Extras.component = {};
}

/**
 * MyAlfresco Sites Dashlet.
 * 
 * @namespace Extras
 * @class Extras.component.MyAlfrescoSearch
 */
(function()
{
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event;

   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML,
      $combine = Alfresco.util.combinePaths;


   /**
    * Dashboard MyAlfrescoSearch constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.dashlet.MyAlfrescoSearch} The new component instance
    * @constructor
    */
   Extras.component.MyAlfrescoSearch = function MyAlfrescoSearch_constructor(htmlId)
   {
      return Extras.component.MyAlfrescoSearch.superclass.constructor.call(this, "Extras.component.MyAlfrescoSearch", htmlId);
   };

   /**
    * Extend from Alfresco.component.Base and add class implementation
    */
   YAHOO.extend(Extras.component.MyAlfrescoSearch, Alfresco.component.Base,
   {
      /**
       * Object container for initialization options
       *
       * @property options
       * @type object
       */
      options:
      {
         /**
          * Identifier used for storing the an OAuth 2.0 token in the repository personal credentials
          * store.
          * 
          * @property endpointId
          * @type string
          * @default ""
          */
         endpointId: "",
         
         /**
          * URI of the provider's authorization page. If an access token does not already exist then the
          * user will be sent here in order to obtain one.
          * 
          * @property authorizationUrl
          * @type string
          * @default ""
          */
         authorizationUrl: "",
         
         /**
          * Comma-separated list of scopes to be requested
          * 
          * @property scopes
          * @type string
          * @default "public_api"
          */
         scopes: "public_api",
         
         /**
          * OAuth client (application) ID
          * 
          * Must be included as a URL parameters when the user is sent to the provider's authorization page
          * 
          * @property clientId
          * @type string
          * @default ""
          */
         clientId: "",
         
         /**
          * URL of the web script (minus the leading slash) to be used as the return landing page after
          * authorization has taken place. The script must exchange the temporary code for an access
          * token and persist it to the repository.
          * 
          * @property returnPage
          * @type string
          * @default "extras/oauth/auth2-return"
          */
         returnPage: "extras/oauth/auth2-return"
      },

      /**
       * Fired by YUI when parent element is available for scripting
       * @method onReady
       */
      onReady: function MyAlfrescoSearch_onReady()
      {
         // Connect button
         Alfresco.util.createYUIButton(this, "connectButton", this.onConnectClick);
         
         Event.addListener(this.id + "-myalfresco-search-header-link", "click", function(e) {
            if (Dom.getStyle(this.id + "-myalfresco-search-results", "display") === "none")
            {
               Alfresco.util.Anim.fadeIn(this.id + "-myalfresco-search-results");
            }
            else
            {
               Alfresco.util.Anim.fadeOut(this.id + "-myalfresco-search-results");
            }
            Event.stopEvent(e);
         }, this, true);
         
         if (this.options.initialSearchTerm && this.options.initialSearchTerm.length > 3)
         {
            this.load();
         }
      },
      
      /**
       * Load the list of sites for display in the dashlet
       * 
       * @method load
       */
      load: function MyAlfrescoSearch_load()
      {
          var xmlDataSource = new YAHOO.util.XHRDataSource(
                Alfresco.constants.PROXY_URI.replace("/alfresco/", "/" + this.options.endpointId +"/") + 
                "-default-/public/cmis/versions/1.1/atom/query"
             );
          xmlDataSource.useXPath = true;
          xmlDataSource.responseType = YAHOO.util.XHRDataSource.TYPE_XML;
          xmlDataSource.responseSchema = {
                metaFields: {
                   numItems: "//cmisra:numItems"
               },
               resultNode: "entry",
               fields: [
                   { key: "name", locator: "cmisra:object/cmis:properties/cmis:propertyString[@localName='contentStreamFileName']/cmis:value" },
                   { key: "nodeRef", locator: "cmisra:object/cmis:properties/cmis:propertyId[@localName='nodeRef']/cmis:value" }
               ]
          }
          xmlDataSource.sendRequest(
             "?q=" + encodeURIComponent(
                   "SELECT * FROM cmis:document WHERE cmis:name LIKE '" + this.options.initialSearchTerm + "%'"
                ),
          {
             success: this.renderFeed,
             failure: function(p_obj) {
                // Do nothing
             },
             scope: this
          });
      },
      
      /**
       * Show the Connect to Chatter button at the top of the dashlet
       */
      showConnect: function MyAlfrescoSearch_showConnect()
      {
          Dom.setStyle(this.id + "-connect", "display", "block");
          Alfresco.util.Anim.fadeIn(this.id + "-connect", {});
      },
      
      /**
       * Render the feed in the dashlet
       * 
       * @method renderFeed
       */
      renderFeed: function MyAlfrescoSearch_renderFeed(oRequest, oParsedResponse)
      {
          Dom.get(this.id + "-myalfresco-search-header-link").innerHTML = this.msg("myalfresco.numResults", oParsedResponse.meta.numItems);
          Dom.get(this.id + "-myalfresco-search-results").innerHTML = this._itemsHTML(oParsedResponse.results);
          Alfresco.util.Anim.fadeIn(this.id + "-myalfresco-search");
      },
      
      /**
       * Generate items markup
       * 
       * @method _itemsHTML
       * @private
       */
      _itemsHTML: function MyAlfrescoSearch__itemsHTML(items)
      {
          var item, html = "";
          for (var i = 0; i < items.length; i++)
          {
              item = items[i];
              if (item.nodeRef && item.name)
              {
                  html += "<div class=\"" + "\">" + 
                      "<div class=\"site-list-item-bd\"><a href=\"https://my.alfresco.com/share/alfresco.com/page/document-details?nodeRef=" + item.nodeRef + "\">" + item.name + 
                      "</a><div>" + (item.description || "") + "</div></div>" + 
                      "</div>";
              }
          }
          return html;
      },

      /**
       * YUI WIDGET EVENT HANDLERS
       * Handlers for standard events fired from YUI widgets, e.g. "click"
       */
      
      /**
       * Click handler for Connect to Chatter button clicked
       * 
       * @method onConnectClick
       * @param p_oEvent {object} HTML event
       */
      onConnectClick: function MyAlfrescoSearch_onConnectClick(p_oEvent)
      {
         // TODO if this is a site dashboard we need to persist the location of the page we started from,
         // since it seems URL parameters specified on the return URL are not preserved.
         
         // TODO add a random parameter to the state and ensure that this comes back unmodified
         
         var returnUrl = window.location.protocol + "//" + window.location.host + 
               Alfresco.constants.URL_PAGECONTEXT + this.options.returnPage + "/" + encodeURIComponent(this.options.endpointId),
            pageUrl = window.location.pathname.replace(Alfresco.constants.URL_CONTEXT, ""),
            state = "rp=" + encodeURIComponent(pageUrl),
            authUri = this.options.authorizationUrl + 
               "?response_type=code&client_id=" + 
               this.options.clientId + "&redirect_uri=" +
               encodeURIComponent(returnUrl) + "&state=" + 
               encodeURIComponent(state);
         if (this.options.scopes)
         {
            authUri += "&scope=" + encodeURIComponent(this.options.scopes)
         }
         
         window.location = authUri;
         
      }
   });
})();
