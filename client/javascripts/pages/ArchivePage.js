define(['framework/Page', 'template!ArchivePage'], function(Page, template) {
	return Page.extend({
		title: 'Archive',

    template: template,

    routes: [
      {
        id: 'archive',
        url: '/archive',
        action: 'index'
      }
    ],

    constructor: function(){
    },

		index: function () {
		}
	});
});