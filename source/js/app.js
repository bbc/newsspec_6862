define(
    ['lib/news_special/bootstrap', 'lib/news_special/share_tools/controller', 'quizModel', 'questionsView', 'crumbtrailView'],
    function (news, shareTools, quizModel, QuestionView, CrumbtrailView) {

    return {
        init: function (storyPageUrl, appData, vocab) {
            quizModel.data = appData;
            new QuestionView(quizModel, vocab);
            var crumbtrailView = new CrumbtrailView(quizModel);
            quizModel.update();
            crumbtrailView.updateCrumbtrail();
            this.setupShare(shareTools, storyPageUrl);
        },
        setupShare: function (shareTools, storyPageUrl) {
            var shared = false;
            news.pubsub.on('newsspec_6115:message', function (message) {
                if (!shared) {
                    shareTools.init('.main', storyPageUrl, message);
                    shared = true;
                }
            });
        }
    };

});