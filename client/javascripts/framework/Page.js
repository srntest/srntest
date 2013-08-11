define(['lib/base', 'lib/knockout'], function(base, ko) {
	return base.extend({
		title: document.title,

		app: null, // injected by Application

		constructor: function() {
			if (this.title && this.title.subscribe) {
				this.title.subscribe(function(newTitle) {
					document.title = newTitle;
				});
			}
			document.title = ko.utils.unwrapObservable(this.title);
		},

		navigate: function(routeId, routeParameters, options) {
			this.app.navigate(routeId, routeParameters, options);
		},

		dispose: function() {
			// Called when the application disposes the page - do custom cleanup here
		}
	});
});