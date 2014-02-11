define(["lib/news_special/bootstrap"], function (news) {

    var Quiz = function(data) {
        this.questions = data.questions;
        this.totalNumberOfQuestions = (this.questions.length+1);
        this.results   = data.results;
        this.score     = 0;
        this.currentQuestion = 1;
        this.setupPubsubs();
    }

    Quiz.prototype = {
        setupPubsubs: function () {
            news.pubsub.on('reset', this.reset);
        },
        reset: function () {
            this.score = 0;
            this.currentQuestion = 1;
        },
        answerQuestion: function (answer) {
            var score = this.currentQuestion.options[answer];
            this.addToScore(score);
            this.nextQuestion();
        },
        addToScore: function (score) {
            this.score += score;
        },
        nextQuestion: function () {
            if ( (this.currentQuestion+1) > this.totalNumberOfQuestions) {
                news.pubsub.emit('endOfQuiz', [this.score, this.getResult()]);
            }
            else {
                var newQuestion = this.questions[this.currentQuestion];
                this.currentQuestion += 1;
                news.pubsub.emit('showQuestion', [newQuestion.text, newQuestion.answers, newQuestion.fact]);
            }
        },
        getResult: function () {
            var Quiz = this,
                correctResult = null;
            this.results.forEach(function () {
                if (Quiz.score <= this.maxScore) {
                    correctResult = this;
                    return;
                }
            });
            return correctResult;
        }
    };

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