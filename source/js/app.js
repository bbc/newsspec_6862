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
            this.setupModelViewPubsubs();
            this.setupShare(shareTools, storyPageUrl);
        },
        setupModelViewPubsubs: function () {
            news.$('.options').on('click', 'input', function () {
                quizModel.submitResponse();
            });
            news.$('.button--next_question').on('click', function (e) {
                e.preventDefault();
                quizModel.renderNextQuestion(parseFloat(news.$('.options input[name=candidate_options]:checked').val()));
            });
            news.$('.button--reset_quiz').on('click', function () {
                quizModel.resetQuiz();
            });
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