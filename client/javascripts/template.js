define(function() {
	return {
		load: function (templateName, localRequire, load, config) {
			localRequire(['lib/text!' + templateName], function (template) {
				if (toString.call(template) === '[object String]'){
          template = template.replace(/\s+/g, ' ');
        }

				load.apply(this, [template]);
			});
		},

		normalize: function (name) {
			// work-around to ensure templates being compiled properly when building the app with r.js
			name = name.replace('.html', '');
			
			return './' + name + '.html';
		}
	};
});