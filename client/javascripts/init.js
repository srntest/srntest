requirejs.config({
	shim: {
    'String.prototype': {
    }
	},
	paths: {
	}
});

requirejs(['main', 'framework/String.prototype']);