/*

	TODO: Use this file to load in modules that need to exist externally to the concatenated file

*/

require.config({
	paths: {
	    'istats':     './vendors/istats', // 'http://static.bbci.co.uk/frameworks/istats/0.16.1/modules/istats-1',
		'bump-3':     'http://emp.bbci.co.uk/emp/bump-3/bump-3',
        'jquery-1.9': 'http://static.bbci.co.uk/frameworks/jquery/0.3.0/sharedmodules/jquery-1.9.1'
	}
});

define(['istats', 'lib/news_special/bootstrap'], function(istats, news){
	// for link tracking
	// istats.track('external', { region: document.getElementsByTagName('body')[0] });
	// istats.track('download', { region: document.getElementsByTagName('body')[0] });
	console.log(istats);
	istats.init();
	news.pubsub.on('istats', function(actionType, actionName, newLabels) {
		console.log('istats', [actionType, actionName, newLabels]);
		istats.log(actionType, actionName, newLabels);
	});

	return {};
});