define(['lib/news_special/bootstrap', 'quizModel'],  function (news, Quiz) {

    beforeEach(function () {
    });

    afterEach(function () {
    });

    describe('quiz', function () {
        it('instantiates correctly', function () {
            var myQuiz = new Quiz({
                questions: ['foo'],
                feedback: ['bar']
            });
            expect(myQuiz.questions).toEqual(['foo']);
            expect(myQuiz.totalNumberOfQuestions).toEqual(1);
            expect(myQuiz.feedback).toEqual(['bar']);
            expect(myQuiz.score).toEqual(0);
            expect(myQuiz.currentQuestion).toEqual(1);
        });
        it('resets correctly', function () {
            var myQuiz = new Quiz({
                    questions: [{
                        question: 'foo?',
                        options: {a: 0, b: 10},
                        supportingText: 'foo is a programming word'
                    }],
                    results: ['bar']
                }),
                firstQuestionFired = false;
            news.pubsub.on('quiz:showQuestion', function (q) {
                firstQuestionFired = q;
            });

            myQuiz.score = 100;
            myQuiz.currentQuestion = 10;
            myQuiz.reset();

            waitsFor(function () {
                return !!firstQuestionFired;
            }, 500);

            runs(function () {
                expect(myQuiz.score).toEqual(0);
                expect(myQuiz.currentQuestion).toEqual(1);
            });
        });
        it('adds score correctly', function () {
            var myQuiz = new Quiz({
                questions: ['foo'],
                feedback: ['bar']
            });
            myQuiz.score = 100;
            myQuiz.currentQuestion = 10;
            myQuiz.reset();
            expect(myQuiz.score).toEqual(0);
            expect(myQuiz.currentQuestion).toEqual(1);
        });
        it('should expose the number of questions in the quiz', function () {
            // TO DO
        });
        it('answers are scored correctly', function () {
            var myQuiz = new Quiz({
                questions: [{
                    question: 'foo?',
                    options: {a: 0, b: 10}
                }],
                feedback: [{
                    maxScore: 10,
                    summary: 'ten or below is not a good score',
                    extraText: 'people who score ten or less need a hug'
                }]
            });
            myQuiz.answerQuestion('b');
            expect(myQuiz.score).toEqual(10);
        });
        it('the correct feedback is returned', function () {
            var myQuiz = new Quiz({
                questions: [],
                feedback: [{
                    maxScore: 10,
                    summary: 'ten or below is not a good score',
                    extraText: 'people who score ten or less need a hug'
                }, {
                    maxScore: 20,
                    summary: 'Up to twenty is a great score!',
                    extraText: 'You are doing it right!!!'
                }]
            });

            var result = myQuiz.getFeedback();
            expect(result.maxScore).toEqual(10);

            myQuiz.score = 10;
            result = myQuiz.getFeedback();
            expect(result.maxScore).toEqual(10);

            myQuiz.score = 15;
            result = myQuiz.getFeedback();
            expect(result.maxScore).toEqual(20);
        });
        it('should return the first question', function () {
            var question,
                options,
                text;
            news.pubsub.on('quiz:showQuestion', function (q, o, t) {
                question = q;
                options = o;
                text = t;
            });
            var myQuiz = new Quiz({
                questions: [{
                    question: 'foo?',
                    options: {a: 0, b: 10},
                    supportingText: 'foo is a programming word'
                }]
            });
            myQuiz.getFirstQuestion();

            waitsFor(function () {
                return !!question;
            }, 'question to be set to a value', 500);

            runs(function () {
                expect(question).toEqual('foo?');
                expect(options).toEqual({a: 0, b: 10});
                expect(text).toEqual('foo is a programming word');
            });
        });
        it('should get the correct next question', function () {
            var question,
                options,
                text;
            news.pubsub.on('quiz:showQuestion', function (q, o, t) {
                question = q;
                options = o;
                text = t;
            });

            var myQuiz = new Quiz({
                questions: [{
                    question: 'foo?',
                    options: {a: 0, b: 10},
                    supportingText: 'foo is a programming word'
                }, {
                    question: 'bar?',
                    options: {a: 0, b: 10},
                    supportingText: 'bar always comes after foo'
                }]
            });
            myQuiz.nextQuestion();

            waitsFor(function () {
                return !!question;
            }, 'question to be set to a value', 500);

            runs(function () {
                expect(question).toEqual('bar?');
                expect(options).toEqual({a: 0, b: 10});
                expect(text).toEqual('bar always comes after foo');
            });
        });
        it('should end the quiz when all questions have been answered', function () {
            var score,
                outOf,
                feedback;
            news.pubsub.on('quiz:end', function (s, o, f) {
                score    = s;
                outOf    = o;
                feedback = f;
            });

            var myQuiz = new Quiz({
                questions: [{
                    question: 'foo?',
                    options: {a: 0, b: 10},
                    supportingText: 'foo is a programming word'
                }, {
                    question: 'bar?',
                    options: {a: 5, b: 0},
                    supportingText: 'bar is a programming word'
                }, {
                    question: 'car?',
                    options: {a: 0, b: 5},
                    supportingText: 'car is a thing'
                }],
                feedback: [{
                    maxScore: 10,
                    summary: 'ten or below is not a good score',
                    extraText: 'people who score ten or less need a hug'
                }, {
                    maxScore: 20,
                    summary: 'Between 11 and 20 is a great score',
                    extraText: 'people who score over 10 are fantasic'
                }]
            });
            myQuiz.score = 20;
            myQuiz.currentQuestion = myQuiz.totalNumberOfQuestions;
            myQuiz.nextQuestion();

            waitsFor(function () {
                return score === 20;
            }, 'score to be set to a value', 1000);

            runs(function () {
                expect(score).toEqual(20);
                expect(outOf).toEqual(20);
                expect(feedback.maxScore).toEqual(20);
                expect(feedback.summary).toEqual('Between 11 and 20 is a great score');
                expect(feedback.extraText).toEqual('people who score over 10 are fantasic');
            });
        });
        it('should emit the correct progress pubsub with each question', function () {
            var currentQuestion,
                totalNumberOfQuestions;
            news.pubsub.on('quiz:progress', function (c, t) {
                currentQuestion = c;
                totalNumberOfQuestions = t;
            });
            var myQuiz = new Quiz({
                questions: [{
                    question: 'foo?',
                    options: {a: 0, b: 10},
                    supportingText: 'foo is a programming word'
                }, {
                    question: 'bar?',
                    options: {a: 5, b: 0},
                    supportingText: 'bar is a programming word'
                }, {
                    question: 'car?',
                    options: {a: 0, b: 5},
                    supportingText: 'car is a thing'
                }],
                feedback: [{
                    maxScore: 10,
                    summary: 'ten or below is not a good score',
                    extraText: 'people who score ten or less need a hug'
                }, {
                    maxScore: 20,
                    summary: 'Between 11 and 20 is a great score',
                    extraText: 'people who score over 10 are fantasic'
                }]
            });
            news.pubsub.emit('quiz:requestFirstQuestion');

            waitsFor(function () {
                return !!currentQuestion;
            }, 500);

            runs(function () {
                expect(currentQuestion).toEqual(1);
                expect(totalNumberOfQuestions).toEqual(3);
                myQuiz.nextQuestion();
            });
            

            waitsFor(function () {
                return currentQuestion === 2;
            }, 500);

            runs(function () {
                expect(currentQuestion).toEqual(2);
                expect(totalNumberOfQuestions).toEqual(3);
            });
        });
    });

});