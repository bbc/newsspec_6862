define(['lib/news_special/bootstrap'], function (news) {

    var Quiz = function (data) {
        this.questions = data.questions;
        this.totalNumberOfQuestions = this.questions.length;
        this.feedback = data.feedback;
        this.score = 0;
        this.currentQuestion = 1;
        this.setupPubsubs();
    };

    Quiz.prototype = {
        setupPubsubs: function () {
            news.pubsub.on('quiz:reset', this.reset);
        },
        reset: function () {
            this.score = 0;
            this.currentQuestion = 1;
        },
        answerQuestion: function (answer) {
            var score = this.questions[(this.currentQuestion-1)].options[answer];
            this.addToScore(score);
            this.nextQuestion();
        },
        addToScore: function (score) {
            this.score += score;
        },
        getFirstQuestion: function () {
            var first = this.questions[0];
            news.pubsub.emit('quiz:showQuestion', [first.question, first.options, first.text]);
        },
        nextQuestion: function () {
            if ((this.currentQuestion + 1) > this.totalNumberOfQuestions) {
                news.pubsub.emit('quiz:end', [this.score, this.getFeedback()]);
            }
            else {
                var next = this.questions[this.currentQuestion];
                this.currentQuestion += 1;
                news.pubsub.emit('quiz:showQuestion', [next.question, next.options, next.text]);
            }
        },
        getFeedback: function () {
            var Quiz = this,
                correctFeedback = null;

            for (var i = 0, len = this.feedback.length; i <= len; i++) {
                if (Quiz.score <= this.feedback[i].maxScore) {
                    correctFeedback = this.feedback[i];
                    return correctFeedback;
                }
            }
        }
    };

    return Quiz;

});