define(['lib/news_special/bootstrap', 'lib/news_special/share_tools/controller', 'controller'], function (news, shareTools, controller) {

    return {
        init: function (storyPageUrl, appData, vocab) {

            var shared = false;
            news.pubsub.on('newsspec_6115:message', function (message) {
                if (!shared) {
                    shareTools.init('.main', storyPageUrl, message);
                    shared = true;
                }
            });

            controller.init(appData, vocab);

        }
    };

});