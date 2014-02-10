define(["lib/news_special/bootstrap"], function (news) {
    return {
        currentQuestion: 0,
        crumbTrail: [],
        lastResponse: null,
        data: null,
        currentScore: 0,
        resetCrumbTrail: function () {
            for (var i = this.data.questions.length; i--;) {
                this.crumbTrail[i] = "";
            }
        },
        getCurrentQuestion: function () {
            return this.currentQuestion;
        },
        getLastResponse: function () {
            return this.lastResponse;
        },
        getScore: function () {
            return this.currentScore;
        },
        resetQuiz: function () {
            this.resetCrumbTrail();
            this.currentScore = 0;
            news.pubsub.emit("resetQuizView");
        },
        update: function () {
            news.pubsub.emit("updateQuestion");
        },
        submitResponse: function () {
            news.pubsub.emit("submitResponse");
        },
        renderNextQuestion: function (points) {
            this.currentScore += points;
            if ((this.currentQuestion + 1) === this.data.questions.length) {
                news.pubsub.emit("loadResult");
                news.pubsub.emit("shareResult");
                this.currentQuestion = 0;
            }
            else {
                this.currentQuestion++;
                news.pubsub.emit("updateQuestion");
                news.pubsub.emit("nextQuestion");
            }
        }
    };
});