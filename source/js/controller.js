define(["lib/news_special/bootstrap", "quizModel", "questionsView", "crumbtrailView"], function (news, quizModel, QuestionView, CrumbtrailView) {

    return {
        init: function (appData, vocab) {
            quizModel.data = appData;
            new QuestionView(quizModel, vocab);
            var crumbtrailView = new CrumbtrailView(quizModel);
            quizModel.update();
            crumbtrailView.updateCrumbtrail();
            news.$(".options").on("click", "input", function () {
                quizModel.submitResponse();
            });
            news.$(".button--next_question").on("click", function (e) {
                e.preventDefault();
                quizModel.renderNextQuestion(parseFloat(news.$(".options input[name=candidate_options]:checked").val()));
            });
            news.$(".button--reset_quiz").on("click", function () {
                quizModel.resetQuiz();
            });
        }
    };

});