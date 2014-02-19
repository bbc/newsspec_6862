define(['lib/news_special/bootstrap', 'quizView'],  function (news, View) {

    var vocab = {
        next:          'Next',
        restart:       'Restart',
        outOf:         ' out of ',
        iRated:        'I rated ',
        youRated:      'You rated ',
        onTheQuiz:     ' on the BBC Relationship Quiz.',
        generalAdvice: '<p>blah blah blah.</p>'
    };

    beforeEach(function () {
        news.$('body').append('<div class="quiz"></div>');
    });

    afterEach(function () {
        news.$('body .quiz').remove();
        news.pubsub.off('quiz:showQuestion');
        news.pubsub.off('quiz:requestFirstQuestion');
        news.pubsub.off('quiz:end');
        news.pubsub.off('quiz:reset');
        news.pubsub.off('quiz:answerQuestion');
    });

    describe('view', function () {
        it('instantiates correctly', function () {
            var myView = new View('.quiz', vocab);
            expect(myView.elm[0]).toEqual(news.$('.quiz')[0]);
        });
        it('renders a question correctly', function () {
            var myView = new View('.quiz', vocab);
            news.pubsub.emit('quiz:showQuestion', [
                'what is a foo?',
                {
                    'Never':       10,
                    'A few times':  0
                },
                'programmers should know what a foo is'
            ]);
            expect(myView.elm.hasClass('quiz__mode-question')).toBeTruthy();
            expect(myView.elm.hasClass('quiz__mode-result')).toBeFalsy();
            expect(myView.elm.find('.quiz--question').html()).toContain('what is a foo?');
            expect(myView.elm.find('.quiz--option').length).toEqual(2);
            expect(news.$(myView.elm.find('.quiz--option')[0]).html()).toContain('Never');
            expect(news.$(myView.elm.find('.quiz--checkbox')[0]).val()).toEqual('Never');
            expect(news.$(myView.elm.find('.quiz--option')[1]).html()).toContain('A few times');
            expect(news.$(myView.elm.find('.quiz--checkbox')[1]).val()).toEqual('A few times');
            expect(myView.elm.find('.quiz--supporting-text').html()).toContain('programmers should know what a foo is');
            expect(myView.elm.find('.quiz--supporting-text').is(':hidden')).toBeTruthy();
            expect(myView.elm.find('.quiz--next-button').is(':hidden')).toBeTruthy();
        });
        it('should show the supporting text and next button when an option is chosen', function () {
            var myView = new View('.quiz', vocab);
            news.pubsub.emit('quiz:showQuestion', [
                'what is a foo?',
                {
                    'an abstract term used as a place holder': 10
                },
                'programmers should know what a foo is'
            ]);
            news.$('.quiz--checkbox')[0].click();
            expect(myView.elm.find('.quiz--supporting-text').is(':visible')).toBeTruthy();
            expect(myView.elm.find('.quiz--next-button').is(':visible')).toBeTruthy();
        });
        it('renders the end of the quiz correctly', function () {
            var myView   = new View('.quiz', vocab),
                score    = 9,
                outOf    = 100,
                feedback = {
                    maxScore: 10,
                    summary: 'ten or below is not a good score',
                    extraText: 'people who score ten or less need a hug'
                },
                shareToolsMessage = false;

            news.pubsub.on('shareTools:message', function (stm) {
                shareToolsMessage = stm;
            });

            news.pubsub.emit('quiz:end', [score, outOf, feedback]);

            expect(myView.elm.hasClass('quiz__mode-result')).toBeTruthy();
            expect(myView.elm.hasClass('quiz__mode-question')).toBeFalsy();
            expect(myView.elm.find('.quiz--score').html()).toContain('You rated 9 out of 100 on the BBC Relationship Quiz.');
            expect(myView.elm.find('.quiz--summary').html()).toContain('ten or below is not a good score');
            expect(myView.elm.find('.quiz--extra-text').html()).toContain('people who score ten or less need a hug');
            expect(myView.elm.find('.quiz--general-advice').html()).toContain(vocab.generalAdvice);

            waitsFor(function () {
                return shareToolsMessage;
            }, 1000);

            runs(function () {
                expect(shareToolsMessage).toEqual('I rated 9 out of 100 on the BBC Relationship Quiz.');
            });
        });
        it('calls the right reset pubsubs', function () {
            var myView = new View('.quiz', vocab),
                resetCalled           = false,
                shareToolsResetCalled = false;

            news.pubsub.on('quiz:reset', function () {
                resetCalled = true;
            });
            news.pubsub.on('shareTools:reset', function () {
                shareToolsResetCalled = true;
            });

            myView.resetButtonClick();

            waitsFor(function () {
                return (resetCalled && shareToolsResetCalled);
            }, 1000);

            runs(function () {
                expect(resetCalled).toBeTruthy();
                expect(shareToolsResetCalled).toBeTruthy();
            });
        });
        it('calls the answerQuestion pubsub correctly', function () {
            var myView = new View('.quiz', vocab),
                answer = null;
            news.pubsub.emit('quiz:showQuestion', [
                'what is a foo?',
                {
                    'Always': 10,
                    'Never':   0
                },
                'programmers should know what a foo is'
            ]);
            news.$('.quiz--checkbox')[0].checked = true;

            news.pubsub.on('quiz:answerQuestion', function (param) {
                answer = param;
            });

            myView.nextButtonClick();

            waitsFor(function () {
                return answer !== null;
            }, 5000);

            runs(function () {
                expect(answer).toEqual('Always');
            });
        });
        it('shows the progress you are making through the quiz', function () {
            console.log('*************************************');
            var myView            = new View('.quiz', vocab),
                progressIndicator = myView.elm.find('.quiz--progress-indicator');

            expect(progressIndicator[0].style.width).toEqual('0%');

            news.pubsub.emit('quiz:progress', [1, 4]);
            expect(progressIndicator[0].style.width).toEqual('20%');
            expect(myView.elm.find('.quiz--question-section').hasClass('quiz--question-section__1')).toBeTruthy();

            news.pubsub.emit('quiz:progress', [2, 4]);
            expect(progressIndicator[0].style.width).toEqual('40%');
            expect(myView.elm.find('.quiz--question-section').hasClass('quiz--question-section__1')).toBeFalsy();
            expect(myView.elm.find('.quiz--question-section').hasClass('quiz--question-section__2')).toBeTruthy();

            news.pubsub.emit('quiz:progress', [3, 4]);
            expect(progressIndicator[0].style.width).toEqual('60%');
            expect(myView.elm.find('.quiz--question-section').hasClass('quiz--question-section__2')).toBeFalsy();
            expect(myView.elm.find('.quiz--question-section').hasClass('quiz--question-section__3')).toBeTruthy();

            news.pubsub.emit('quiz:progress', [4, 4]);
            expect(progressIndicator[0].style.width).toEqual('80%');
            expect(myView.elm.find('.quiz--question-section').hasClass('quiz--question-section__3')).toBeFalsy();
            expect(myView.elm.find('.quiz--question-section').hasClass('quiz--question-section__4')).toBeTruthy();

            news.pubsub.emit('quiz:end', [0, 0, { maxScore: 0, summary: '', extraText: '' }]);
            expect(progressIndicator[0].style.width).toEqual('100%');
        });
    });
});