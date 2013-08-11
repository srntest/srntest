define('pages/TestPage', ['framework/core', 'template!TestPage', 'model/EntryModel'], function(core, template, EntryModel) {
	var TestPage =  core.Page.extend({
		title: 'Test Page',

		template: template,

    routes: [
      {
        id: 'index',
        url: '/',
        action: 'index'
      }
    ],

    constructor: function(){
      var self = this;

      this.entries = ko.observableArray();

      for (var i = 0; i < 5; i++) {
        self.entries.push(new EntryModel());
      }
    },

		index: function () {
      console.log('testpage:index', arguments);
		},

    navigateToSingleEntry: function(context){
    }
	});

  return TestPage;
});