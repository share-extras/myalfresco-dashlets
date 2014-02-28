/**
 * Copyright (C) 2010-2014 Share Extras contributors.
 *
 */

/**
* Extras root namespace.
* 
* @namespace Extras
*/
// Ensure Extras root object exists
if (typeof Extras == "undefined" || !Extras)
{
   var Extras = {};
}

/**
 * MyAlfrescoConsole tool component.
 * 
 * @namespace Extras
 * @class Extras.MyAlfrescoConsole
 */
(function()
{
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
       Event = YAHOO.util.Event,
       Element = YAHOO.util.Element;
   
   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML;

   /**
    * MyAlfrescoConsole constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {Extras.MyAlfrescoConsole} The new MyAlfrescoConsole instance
    * @constructor
    */
   Extras.MyAlfrescoConsole = function(htmlId)
   {
      this.name = "Extras.MyAlfrescoConsole";
      Extras.MyAlfrescoConsole.superclass.constructor.call(this, htmlId);
      
      /* Register this component */
      Alfresco.util.ComponentManager.register(this);

      /* Load YUI Components */
      Alfresco.util.YUILoaderHelper.require(["button", "container", "datasource", "datatable", "json", "history"], this.onComponentsLoaded, this);

      /* Define panel handlers */
      var parent = this;
      
      // NOTE: the panel registered first is considered the "default" view and is displayed first
      
      /* Search Panel Handler */
      FormPanelHandler = function FormPanelHandler_constructor()
      {
         FormPanelHandler.superclass.constructor.call(this, "form");
      };
      
      YAHOO.extend(FormPanelHandler, Alfresco.ConsolePanelHandler,
      {
         /**
          * PANEL LIFECYCLE CALLBACKS
          */
         
         /**
          * Called by the ConsolePanelHandler when this panel shall be loaded
          *
          * @method onLoad
          */
         onLoad: function onLoad()
         {
            // User data textarea
            parent.widgets.path = Dom.get(parent.id + "-path");
            parent.widgets.response = Dom.get(parent.id + "-response");
            parent.widgets.helpLink = Dom.get(parent.id + "-help-link");
            parent.widgets.helpText = Dom.get(parent.id + "-format-help");
            // Buttons
            parent.widgets.executeButton = Alfresco.util.createYUIButton(parent, "execute-button", parent.onExecuteClick);
            
            // Add Ctrl-Enter listener
            YAHOO.util.Event.on(parent.widgets.path, "keyup", function (e) {
               if (e.keyCode && e.keyCode == 13 && !e.altKey) {
                    Event.stopEvent(e);
                    parent.onExecuteClick(e);
                  }
              }, this
            );
            
            // Help link listener
            YAHOO.util.Event.on(parent.widgets.helpLink, "click", parent.onHelpClick, parent, true);
         },
         
         onShow: function onShow()
         {
            parent.widgets.path.focus();
         }
      });
      new FormPanelHandler();
      
      return this;
   };
   
   YAHOO.extend(Extras.MyAlfrescoConsole, Alfresco.ConsoleTool,
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
         endpointId: ""
      },
      
      /**
       * Fired by YUI when parent element is available for scripting.
       * Component initialisation, including instantiation of YUI widgets and event listener binding.
       *
       * @method onReady
       */
      onReady: function MyAlfrescoConsole_onReady()
      {
         // Call super-class onReady() method
         Extras.MyAlfrescoConsole.superclass.onReady.call(this);
      },
      
      _getApiRoot: function MyAlfrescoConsole__getApiRoot()
      {
         return Dom.get(this.id + "-root").options[Dom.get(this.id + "-root").selectedIndex].value;
      },
      
      /**
       * YUI WIDGET EVENT HANDLERS
       * Handlers for standard events fired from YUI widgets, e.g. "click"
       */
      
      /**
       * Execute button click event handler
       *
       * @method onExecuteClick
       * @param e {object} DomEvent
       * @param args {array} Event parameters (depends on event type)
       */
      onExecuteClick: function MyAlfrescoConsole_onExecuteClickk(e, args)
      {
         var pathData = this.widgets.path.value,
            apiroot = this._getApiRoot();

         // Disable the create button temporarily
         this.widgets.executeButton.set("disabled", true);
         
         this.timestamp = Date.now();
         
         this._request(
         {
            url: "-default-/" + apiroot + "/" + pathData,
            method: Alfresco.util.Ajax.GET,
            //dataObj: input,
            requestContentType: Alfresco.util.Ajax.XML,
            responseContentType: Alfresco.util.Ajax.XML,
            successCallback:
            {
               fn: this.onExecuteSuccess,
               scope: this
            },
            failureCallback:
            {
               fn: this.onExecuteFailure,
               scope: this
            }
         });
      },
      
      /**
       * Execute call success handler
       *
       * @method onExecuteSuccess
       * @param response {object} Server response
       */
      onExecuteSuccess: function MyAlfrescoConsole_onExecuteSuccess(response)
      {
         var container = document.createElement("div"), 
         result = document.createElement("div"), 
         content = document.createElement("pre");
         
         container.appendChild(result);
         container.appendChild(content);
         Dom.addClass(result, "api-result");
         Dom.addClass(content, "api-response prettyprint");
         Dom.get(this.id + "-results").insertBefore(container, Dom.getFirstChild(this.id + "-results"));
         
         if (response.json)
         {
            content.textContent = JSON.stringify(response.json, null, "  ");
         }
         else if (response.serverResponse.responseXML)
         {
            var oSerializer = new XMLSerializer();
            var sPrettyXML = vkbeautify.xml(oSerializer.serializeToString(response.serverResponse.responseXML));
            content.textContent = sPrettyXML;
         }
         else
         {
            content.textContent = response.serverResponse.responseText;
         }
         prettyPrint();
         
         result.innerHTML = this.msg("message.success", this._getApiRoot() + "/" + this.widgets.path.value, Date.now() - this.timestamp);
         this.widgets.executeButton.set("disabled", false);
      },
      
      /**
       * Execute call failure handler
       *
       * @method onCreateFailure
       * @param response {object} Server response
       */
      onExecuteFailure: function MyAlfrescoConsole_onExecuteFailure(response)
      {
         var container = document.createElement("div"), 
            result = document.createElement("div"), 
            content = document.createElement("pre");
         
         container.appendChild(result);
         container.appendChild(content);
         Dom.addClass(result, "api-result");
         Dom.addClass(content, "api-response prettyprint");
         Dom.get(this.id + "-results").insertBefore(container, Dom.getFirstChild(this.id + "-results"));
         
         if (response.json && response.json.message)
         {
            content.innerHTML = response.json.message;
         }
         else if (response.json && response.json.error && response.json.error.briefSummary)
         {
            content.innerHTML = response.json.error.briefSummary + " (" + (response.json.error.statusCode || response.serverResponse.status) + ")";
         }
         else
         {
            content.innerHTML = response.serverResponse.statusText + " (" + response.serverResponse.status + ")";
         }
         Dom.addClass(content, "error");
         this.widgets.executeButton.set("disabled", false);
      },
      
      /**
       * Help link click event handler
       *
       * @method onHelpClick
       * @param e {object} DomEvent
       * @param args {array} Event parameters (depends on event type)
       */
      onHelpClick: function MyAlfrescoConsole_onHelpClick(e, args)
      {
         Event.stopEvent(e);
         if (Dom.getStyle(this.widgets.helpText, "display") == "none")
         {
            Alfresco.util.Anim.fadeIn(this.widgets.helpText);
         }
         else
         {
            Alfresco.util.Anim.fadeOut(this.widgets.helpText);
         }
      },
      
      /**
       * Make a request against the API
       */
      _request: function MyAlfrescoConsole__request(config)
      {
          Alfresco.util.Ajax.jsonRequest({
              url: Alfresco.constants.PROXY_URI.replace("/alfresco/", "/" + this.options.endpointId +"/") + config.url,
              method: config.method || "GET",
              dataObj: config.dataObj || {},
              successCallback: config.successCallback,
              failureCallback: config.failureCallback,
              noReloadOnAuthFailure: true
          });
      },
   });
})();