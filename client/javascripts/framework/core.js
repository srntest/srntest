define(['lib/Base', 'lib/knockout', './bindingHandlers', './app', './Page'], function (Base, knockout, bindingHandlers, app, Page) {
	if (!window.ko){
    window.ko = knockout;
  }

	return {
		Application: app,
		Base: Base,
		ko: knockout,
		Page: Page
	};
});