define(['lib/news_special/bootstrap', 'quizModelnew'],  function (news, Quiz) {

    beforeEach(function () {
    });

    afterEach(function () {
    });

    describe('quiz', function () {
        it('instantiates correctly', function () {
            var myQuiz = new Quiz({
                questions: ["foo"],
                feedback: ["bar"]
            });
            expect(myQuiz.questions).toEqual(["foo"]);
            expect(myQuiz.totalNumberOfQuestions).toEqual(1);
            expect(myQuiz.feedback).toEqual(["bar"]);
            expect(myQuiz.score).toEqual(0);
            expect(myQuiz.currentQuestion).toEqual(1);
        });
        it('resets correctly', function () {
            var myQuiz = new Quiz({
                questions: {a: 0, b: 1},
                results: {c: 2, d: 3}
            });
            myQuiz.score = 100;
            myQuiz.currentQuestion = 10;
            myQuiz.reset();
            expect(myQuiz.score).toEqual(0);
            expect(myQuiz.currentQuestion).toEqual(1);
        });
        it('adds score correctly', function () {
            var myQuiz = new Quiz({
                questions: ["foo"],
                feedback: ["bar"]
            });
            myQuiz.score = 100;
            myQuiz.currentQuestion = 10;
            myQuiz.reset();
            expect(myQuiz.score).toEqual(0);
            expect(myQuiz.currentQuestion).toEqual(1);
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
                text
            news.pubsub.on('quiz:showQuestion', function (q, o, t) {
                question = q;
                options = o;
                text = t;
            });
            var myQuiz = new Quiz({
                questions: [{
                    question: 'foo?',
                    options: {a: 0, b: 10},
                    text: 'foo is a programming word'
                }]
            });
            myQuiz.getFirstQuestion();
            setTimeout(function () {
                expect(question).toEqual('foo?');
                expect(options).toEqual({a: 0, b: 10});
                expect(text).toEqual('foo is a programming word');
            }, 1000);
        });
        it('should get the correct next question', function () {
            news.pubsub.on('quiz:showQuestion', function (question, options, text) {
                expect(question).toEqual('bar?');
                expect(options).toEqual({a: 0, b: 10});
                expect(text).toEqual('bar always comes after foo');
            });
            setTimeout(function () {
                var myQuiz = new Quiz({
                    questions: [{
                        question: 'foo?',
                        options: {a: 0, b: 10},
                        text: 'foo is a programming word'
                    }, {
                        question: 'bar?',
                        options: {a: 0, b: 10},
                        text: 'bar always comes after foo'
                    }]
                });
                myQuiz.nextQuestion();
            }, 1000);
        });
        it('should end the quiz when all questions have been answered', function () {
            var called = false;
            news.pubsub.on('quiz:end', function () {
                called = true;
            });
            var myQuiz = new Quiz({
                questions: [{
                    question: 'foo?',
                    options: {a: 0, b: 10},
                    text: 'foo is a programming word'
                }],
                feedback: [{
                    maxScore: 10,
                    summary: 'ten or below is not a good score',
                    extraText: 'people who score ten or less need a hug'
                }]
            });
            myQuiz.nextQuestion();
            setTimeout(function () {
                expect(called).toBeTruthy();
            }, 1000);
        });
    });

});