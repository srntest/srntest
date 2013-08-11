define(['lib/knockout', './app'], function (ko, app) {
	ko.bindingHandlers.navigate = {
		update: function (element, valueAccessor) {
			var navigationOptions = ko.utils.unwrapObservable(valueAccessor());

			var routeId,
					data;
			
			if (_.isString(navigationOptions)) {
				routeId = navigationOptions;
			} else {
				routeId = navigationOptions.routeId;

				data = navigationOptions.data || {};
			}

			$(element).off('click').on('click', function (event) {
				event.preventDefault();

				var options = {
					trigger: true
				};
				
				app.instance.navigate(routeId, data, options, function () { });
			});
		}
	};

	ko.bindingHandlers.view = {
		init: function (element, valueAccessor) {
			var value = valueAccessor();

			if (!ko.utils.unwrapObservable(value)) {
				$(element).empty();
				return void 0;
			}

			var options = _createTemplateOptions(element, value);

			return ko.bindingHandlers.template.init.call(this, element, function () { return options; });
		},

		update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var value = valueAccessor();

			if (!ko.utils.unwrapObservable(value)) {
				$(element).empty();
				return void 0;
			}

			var options = _createTemplateOptions(element, value);

			return ko.bindingHandlers.template.update.call(this, element, function () { return options; }, allBindingsAccessor, viewModel, bindingContext);
		}
	};

	ko.templateSources.viewTemplateSource = function (templateName) {
		this.templateName = templateName;
		this._data = {};
	};

	if (!window.____templates){
    window.____templates = {};
  }

	_.extend(ko.templateSources.viewTemplateSource.prototype, {
		text: function (valueToWrite) {
			if (arguments.length === 0) {
				if (!(this.templateName in ____templates)) {
					var element = $('#' + this.templateName);

					if (element.length !== 1){
            throw new ReferenceError('View template ' + this.templateName + ' not found in ____templates.?');
          }

					____templates[this.templateName] = element.text();
				}

				return ____templates[this.templateName];
			} else {
				____templates[this.templateName] = valueToWrite;
			}
		},

		data: function (key, valueToWrite) {
			this._data[this.templateName] = this._data[this.templateName] || {};

			if (arguments.length === 1) {
				return this._data[this.templateName][key];
			} else {
				this._data[this.templateName][key] = valueToWrite;
			}
		}
	});

	ko.createViewTemplateEngine = function () {
		var templateEngine = new ko.nativeTemplateEngine();
		templateEngine.makeTemplateSource = function (templateName) {
			return new ko.templateSources.viewTemplateSource(templateName);
		};
		return templateEngine;
	};
	
	ko.setTemplateEngine(ko.createViewTemplateEngine());

	function _createTemplateOptions(element, value) {
		return {
			foreach: value,
			name: function (object) {
				return _getTemplateName(object);
			},
			afterRender: function (elements, model) {
				model.elements = elements;
				if (_.isFunction(model.afterRender)){
          model.afterRender(elements);
        }
			}
		};
	}
	
	// http://stackoverflow.com/a/15710692
	var hash = _.memoize(function (s) {
		return s.split("").reduce(function (a, b) {
			a = ((a << 5) - a) + b.charCodeAt(0);

			return a & a;
		}, 0);
	});

	function _getTemplateName(object) {
		if (!object.template){
      throw new ReferenceError('template is not defined.');
    }

		var templateName = '__templateName_id_' + hash(object.template);

		if (!____templates[templateName]) {
			____templates[templateName] = object.template.replace(/\r/g, '').replace(/\n/g, '').replace(/\t/g, '');
		}
		return templateName.replace(/\./g, '_');
	}
	
	ko.bindingHandlers.hidden = {
		update: function (element, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			var isCurrentlyHidden = element.style.display !== '';

			if (value && !isCurrentlyHidden){
        element.style.display = "none";
      } else if ((!value) && isCurrentlyHidden){
        element.style.display = "";
      }
		}
	};
});