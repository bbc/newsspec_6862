define(['lib/news_special/bootstrap', 'lib/news_special/share_tools/model', 'lib/news_special/share_tools/view'], function (news, SharetoolsModel, SharetoolsView) {

    var model,
        view;

    var _callFaceBook = function () {
        news.pubsub.emit('ns:request:launchshare', [model.fbShareTarget()]);
    };

    var _callTwitter = function () {
        news.pubsub.emit('ns:request:launchshare', [model.twitterShareTarget()]);
    };

    var _callEmail = function () {
        news.pubsub.emit('ns:request:launchshare', [model.emailShareTarget()]);
    };

    var _updateMessage = function (e) {
        model.setShareMessage(e);
    };

    var _initialiseModule = function () {
        news.pubsub.on('ns:share:message', function (target) { _updateMessage(target); });
        news.pubsub.on('ns:share:call:facebook', _callFaceBook);
        news.pubsub.on('ns:share:call:twitter', _callTwitter);
        news.pubsub.on('ns:share:call:email', _callEmail);
    };

    return {
        init: function (elm, storyPageUrl, message) {
            model = new SharetoolsModel();
            model.storyPageUrl = storyPageUrl;
            view = new SharetoolsView(elm);
            // this gets called once...
            news.pubsub.on('ns:module:ready', _initialiseModule);
            // this has ran
            // this builds the share HTML fragment
            news.pubsub.emit('ns:request:personalshare', [model]);
            // load the share tool with text
            news.pubsub.emit('ns:share:message', [message]);
            // set the text value
            // model.setHeader('Monkey');
        }
    };
});