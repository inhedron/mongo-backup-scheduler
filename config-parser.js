const jsesc = require('jsesc');

module.exports = function() {
	let config = require('./config');
	let keys = Object.keys(config);

	for (let i = 0; i < keys.length; i++) {
		config[keys[i]] = JSON.parse(jsesc(config[keys[i]]));
	}
};