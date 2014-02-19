define(['lib/news_special/bootstrap'], function (news) {

    var Quiz = function (data) {
        this.questions              = data.questions;
        this.totalNumberOfQuestions = this.questions.length;
        this.feedback               = data.feedback;
        this.score                  = 0;
        this.currentQuestion        = 1;
        this.setupPubsubs();
    };

    Quiz.prototype = {
        setupPubsubs: function () {
            var Quiz = this;
            news.pubsub.on('quiz:requestFirstQuestion', function () {
                Quiz.getFirstQuestion();
            });
            news.pubsub.on('quiz:answerQuestion', function (answer) {
                Quiz.answerQuestion(answer);
            });
            news.pubsub.on('quiz:reset', function () {
                Quiz.reset();
            });
        },
        reset: function () {
            this.score = 0;
            this.currentQuestion = 1;
            this.getFirstQuestion();
        },
        answerQuestion: function (answer) {
            var score = this.questions[(this.currentQuestion - 1)].options[answer];
            this.addToScore(score);
            this.nextQuestion();
        },
        addToScore: function (score) {
            this.score += parseInt(score, 10);
        },
        getFirstQuestion: function () {
            var first = this.questions[0];
            news.pubsub.emit('quiz:showQuestion', [first.question, first.options, first.supportingText]);
            news.pubsub.emit('quiz:progress', [this.currentQuestion, this.totalNumberOfQuestions]);
        },
        nextQuestion: function () {
            if ((this.currentQuestion + 1) > this.totalNumberOfQuestions) {
                news.pubsub.emit('quiz:end', [this.score, this.getHighestPossibleScore(), this.getFeedback()]);
            }
            else {
                var next = this.questions[this.currentQuestion];
                this.currentQuestion += 1;
                news.pubsub.emit('quiz:showQuestion', [next.question, next.options, next.supportingText]);
                news.pubsub.emit('quiz:progress', [this.currentQuestion, this.totalNumberOfQuestions]);
            }
        },
        getFeedback: function () {
            var Quiz = this,
                correctFeedback = null;

            for (var i = 0, len = this.feedback.length; i < len; i++) {
                if (Quiz.score <= this.feedback[i].maxScore) {
                    correctFeedback = this.feedback[i];
                    return correctFeedback;
                }
            }
        },
        getHighestPossibleScore: function () {
            var highScores = 0;
            this.questions.forEach(function (question) {
                var highestScoringOption = 0;
                news.$.each(question.options, function (key, value) {
                    if (value > highestScoringOption) {
                        highestScoringOption = value;
                    }
                });
                highScores += highestScoringOption;
            });
            return highScores;
        }
    };

    return Quiz;

});