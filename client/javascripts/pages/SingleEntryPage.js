define(['lib/Base', 'framework/Page', 'template!SingleEntry'], function(Base, Page, template) {
	var SingleEntryPage =  Page.extend({
		template: template,

    routes: [
      {
        id: 'single-entry',
        url: '/:year/:month/:slug',
        action: 'index'
      }
    ],

    constructor: function(){
      this.title = ko.observable('dsa');
    },

		index: function (year, month, slug) {
      var self = this;

      var entry = this.app.entryService.getBySlug('test');
      self.title(entry.title);
		}
	});

  return SingleEntryPage;
});