define(['framework/core', 'template!SinglePageApplication', 'pages/TestPage', 'pages/SingleEntryPage', 'pages/ArchivePage'],
	function (core, template, TestPage, SingleEntryPage, ArchivePage) {
		return core.Application.extend({
			template: template,

			constructor: function() {
				this.base();
			},

			launch: function () {
				this.registerPages({
					pages: [
						TestPage,
            SingleEntryPage,
            ArchivePage
					]
				});

				this.base({ 
					container: '.page'
				});
			}
		});
});