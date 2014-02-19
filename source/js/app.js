define(
    ['lib/news_special/bootstrap', 'lib/news_special/share_tools/controller', 'quizModel', 'quizView', 'crumbtrailView'],
    function (news, shareTools, QuizModel, QuestionView, CrumbtrailView) {

    return {
        init: function (storyPageUrl, data, vocab) {
            var myQuizModel    = new QuizModel(data),
                myQuizView     = new QuestionView('.quiz', vocab);

            this.setupShare(shareTools, storyPageUrl);
            // setTimeout(function () {
            //     myQuizModel.score = 5;
            //     myQuizModel.currentQuestion = 9;
            //     myQuizModel.nextQuestion();
            // }, 500);
        },
        setupShare: function (shareTools, storyPageUrl) {
            var shared = false;
            news.pubsub.on('shareTools:message', function (message) {
                if (!shared) {
                    shareTools.init('.quiz--share-tools', storyPageUrl, message);
                    shared = true;
                }
            });
        }
    };

});