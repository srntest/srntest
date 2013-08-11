define(['lib/Base', 'lib/knockout', './backboneRouter', './Page', 'pages/NotFoundPage', 'services/EntryService'], function (Base, ko, backboneRouter, Page, NotFoundPage, EntryService) {
  var fallbackRouter = new backboneRouter.Router();
  fallbackRouter.route(/.*/, 'fallback', function() {
    Application.instance.goToPage(Application.instance.notFoundPage, 'index');
  });

  var Application = Base.extend({
    template: '<div data-bind="view: currentPage"></div>',

    constructor: function() {
      var self = this;

      if (Application.instance){
        throw new TypeError('Application: There can only be a single instance of Application');
      }

      Application.instance = this;

      this.routes = [];
      this.pages = [];

      this.currentPage = ko.observable(null);
      this.notFoundPage = NotFoundPage;

      this.entryService = new EntryService();
    },

    _handleError: function (errorMessage, file, lineNumber) {
      this.error(1337, {
        errorMessage: errorMessage,
        file: file + ':' + lineNumber,
        url: window.location.href
      });
    },

    emit: function (eventName, data) {
      if (!eventName){
        throw new ReferenceError('eventName is undefined.');
      }

      $(this).triggerHandler(eventName, data);

      if(!this._listeners){
        return false;
      }

      return this._listeners.filter(function(listener) {
        return listener.eventName === eventName;
      }).length > 0;
    },

    on: function (eventName, handler) {
      if (!eventName){
        throw new ReferenceError('eventName is undefined.');
      }

      if (!_.isFunction(handler)) {
        throw new ReferenceError('handler is undefined or not a function.');
      }

      if (!_.isArray(this._listeners)){
        this._listeners = [];
      }

      var computedListeners = _.memoize(function (listeners) {
        return listeners.filter(function (listener) {
          return listener.eventName === eventName;
        });
      });

      if (computedListeners(this._listeners).length > 10){
        throw new TypeError('Unable to add additional events for \'' + eventName + '\' because the limit has been reached to avoid memory leaks.');
      }

      this._listeners.push({
        eventName: eventName,
        handler: handler
      });

      $(this).on(eventName, handler);
    },

    once: function (eventName, handler) {
      if (!eventName){
        throw new ReferenceError('eventName is undefined.');
      }

      if (!_.isFunction(handler)){
        throw new ReferenceError('handler is undefined or not a function.');
      }

      $(this).one(eventName, handler);
    },

    off: function (eventName) {
      if (!eventName){
        throw new ReferenceError('eventName is undefined.');
      }

      this._listeners = _.reject(this._listeners, function(listener) {
        return listener.eventName === eventName;
      });

      $(this).off(eventName);
    },

    error: function (errorCode, data) {
      data = _.extend({
        errorCode: errorCode || 0
      }, data);

      this.emit('error', data);
    },

    listeners: function (eventName, callback) {
      if (!_.isFunction(callback)){
        throw new ReferenceError('callback is undefined or not a function.');
      }

      if (!_.isArray(this._listeners)){
        this._listeners = [];
      }

      var listeners = this._listeners.filter(function (listener) {
        if (!_.isObject(listener) || !_.isString(listener.eventName)){
          return false;
        }

        return listener.eventName === eventName;
      });

      callback.apply(this, [listeners]);
    },

    launch: function(options) {
      var self = this;

      options = _.extend({
        container: 'body',
        pushState: true
      }, options);

      $(function () {
        var container = $(options.container).html(self.template);
        ko.applyBindings(self, container.get(0));
      });

      backboneRouter.history.start({
        pushState: options.pushState
      });
    },

    goToPage: function (pageClass, action, actionArguments) {
      if (!pageClass){
        throw new ReferenceError('pageClass is not defined.');
      }

      var pageInstance = this.currentPage();

      if (!(pageInstance instanceof pageClass)) {
        if (pageInstance) {
          pageInstance.dispose();
        }

        pageInstance = new pageClass();
        pageInstance.app = this;

        this.currentPage(pageInstance);
      }

      if (_.isString(action)) {
        if (!pageInstance[action]){
          throw new ReferenceError('Unknown page action ', action);
        }

        action = pageInstance[action];
      }

      if (!_.isFunction(action)){
        throw new ReferenceError('Action is not a function.');
      }

      action.apply(pageInstance, actionArguments);
    },

    navigate: function (routeId, routeParameters, options, callback) {
      var self = this;

      options = _.extend({
        replace: false,
        trigger: false
      }, options);

      var route = this.getRouteById(routeId);
      var url = this.getUrlForRoute(route, routeParameters);

      backboneRouter.history.navigate(url, {
        replace: options.replace,
        trigger: options.trigger
      });

      if (_.isFunction(callback)){
        callback.call(this, { url: url });
      }
    },

    getRouteById: function (routeId) {
      var route = this.routes.filter(function(r) {
        return r.id === routeId;
      });

      route = _.first(route);

      if (!route){
        throw new ReferenceError('No route with Id ' + routeId);
      }

      return route;
    },

    getUrlForRoute: function(route, routeParameters) {
      var url = route.fullUrl;

      route.parameters.forEach(function(parameterName) {
        if (!routeParameters || routeParameters[parameterName] === void 0){
          throw new ReferenceError('Route ' + route.id + ' requires parameter ' + parameterName);
        }

        url = url.replace(new RegExp(':' + parameterName + '\\b'), routeParameters[parameterName]);
      });

      return url;
    },

    registerPages: function (options) {
      var self = this;

      if (!options){
        throw new ReferenceError('options is not defined.');
      }

      if (!options.pages){
        throw new ReferenceError('pages is not defined.');
      }

      options.pages.forEach(function(page) {
        self.registerPage(page);
      });
    },

    registerPage: function(pageClass) {
      var self = this;

      if (!pageClass){
        throw new ReferenceError('pageClass is not defined.');
      }

      var baseUrl = '/';

      this.pages.push(pageClass);

      var pageRoutes = pageClass.prototype.routes || pageClass.routes;
      if(!pageRoutes){
        throw new ReferenceError('Could not find any page routes');
      }

      var router = new backboneRouter.Router();

      pageRoutes.forEach(function(pageRoute) {
        pageRoute.fullUrl = ((baseUrl === '/' ? '' : baseUrl) + pageRoute.url).replace(/^\/|\/$/g, '');
        pageRoute.parameters = (pageRoute.fullUrl.match(/:\w+\b/g) || []).map(function (p) {
          return p.substring(1);
        });

        router.route(pageRoute.fullUrl, pageRoute.id, function () {
          self.goToPage(pageClass, pageRoute.action, arguments);

          var urlForRoute = self.getUrlForRoute(pageRoute, _.object(pageRoute.parameters, arguments));
          urlForRoute = urlForRoute.substring(0) !== '/' ? '/' + urlForRoute : urlForRoute;

          self.emit('route:change', urlForRoute);
        });

        self.routes.push(pageRoute);
      });
    }
  });

  return Application;
});