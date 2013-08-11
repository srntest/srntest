define(['lib/Base', 'framework/Page', 'template!NotFoundPage'], function(Base, Page, template) {
	return Page.extend({
		title: 'Not found',
		template: template,
		index: function () {
		}
	});
});