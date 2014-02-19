define(['lib/news_special/bootstrap'], function (news) {

    var View = function (elm, vocab) {
        this.elm = news.$(elm);
        this.vocab = vocab;
        this.setupHtml();
        this.setupPubsubs();
        this.setupEvents();
        this.updateProgress(0, 0);
        news.pubsub.emit('quiz:requestFirstQuestion');
    };

    View.prototype = {
        elm: null,
        setupHtml: function () {
            this.elm.append('<div class="quiz--progress-bar"><div class="quiz--progress-indicator"><div></div>');
            this.elm.append(
                '<div class="quiz--question-section">' +
                    '<div class="quiz--question"></div>' +
                    '<ul class="quiz--list-of-options"></ul>' +
                    '<div class="quiz--supporting-text"></div>' +
                    '<button class="quiz--next-button">' + this.vocab.next + '</button>' +
                '</div>');
            this.elm.append(
                '<div class="quiz--result-section">' +
                    '<div class="quiz--score"></div>' +
                    '<div class="quiz--summary"></div>' +
                    '<button class="quiz--restart-button">' + this.vocab.restart + '</button>' +
                    '<div class="quiz--share-tools"></div>' +
                    '<div class="quiz--extra-text"></div>' +
                    '<div class="quiz--general-advice"></div>' +
                '</div>'
            );
        },
        setupPubsubs: function () { // would prefer this to call methods on class directly, but pubsub lib binds callbacks to jquery for chaining
            var View = this;
            news.pubsub.on('quiz:showQuestion', function (question, options, supportingText) {
                View.renderQuestion(question, options, supportingText);
            });
            news.pubsub.on('quiz:end', function (score, outOf, feedback) {
                View.renderResult(score, outOf, feedback);
            });
            news.pubsub.on('quiz:progress', function (currentQuestion, totalNumberOfQuestions) {
                View.updateProgress(currentQuestion, totalNumberOfQuestions);
            });
        },
        setupEvents: function () {
            var View = this;
            this.elm.find('.quiz--list-of-options')[0].addEventListener('click', function (e) {
                var targetElm = e.target || e.srcElement;
                if (targetElm.nodeName !== 'UL') {
                    View.showSupportingText();
                }
            }, false);
            this.elm.find('.quiz--next-button')[0].addEventListener('click', function () {
                View.nextButtonClick();
            }, false);
            this.elm.find('.quiz--restart-button')[0].addEventListener('click', function () {
                View.resetButtonClick();
            }, false);
        },
        renderQuestion: function (question, options, supportingText) {
            this.elm.addClass('quiz__mode-question');
            this.elm.removeClass('quiz__mode-result');
            this.elm.find('.quiz--question').html(question);
            this.elm.find('.quiz--list-of-options').html('');
            var View = this;
            news.$.each(options, function (key) {
                var optionId = 'quiz--option-' + (key.split(' ').join('')),
                    li       = '<li class="quiz--option">' +
                                    '<label for="' + optionId + '" class="quiz--label">' +
                                        '<input type="radio" name="quiz--option" id="' + optionId + '" value="' + key + '" class="quiz--checkbox" /> ' +
                                        key +
                                    '</label>' +
                                '</li>';
                View.elm.find('.quiz--list-of-options').append(li);
            });
            this.elm.find('.quiz--supporting-text').html(supportingText);
            this.elm.find('.quiz--supporting-text').hide();
            this.elm.find('.quiz--next-button').hide();
        },
        renderResult: function (score, outOf, feedback) {
            this.elm.addClass('quiz__mode-result');
            this.elm.removeClass('quiz__mode-question');
            this.elm.find('.quiz--score').html(this.vocab.youRated + score + this.vocab.outOf + outOf + this.vocab.onTheQuiz);
            this.elm.find('.quiz--summary').html(feedback.summary);
            this.elm.find('.quiz--extra-text').html(feedback.extraText);
            this.elm.find('.quiz--general-advice').html(this.vocab.generalAdvice);
            news.pubsub.emit('shareTools:message', [this.vocab.iRated + score + this.vocab.outOf + outOf + this.vocab.onTheQuiz]);
            this.updateProgress(1, 0);
        },
        showSupportingText: function () {
            this.elm.find('.quiz--supporting-text').show();
            this.elm.find('.quiz--next-button').show();
        },
        resetButtonClick: function () {
            news.pubsub.emit('quiz:reset');
            news.pubsub.emit('shareTools:reset');
        },
        nextButtonClick: function () {
            news.pubsub.emit('quiz:answerQuestion', [this.elm.find('.quiz--checkbox:checked').val()]);
        },
        updateProgress: function (currentQuestion, totalNumberOfQuestions) {
            var progress = Math.floor((currentQuestion / (totalNumberOfQuestions + 1)) * 100);
            if (isNaN(progress)) {
                progress = 0;
            }
            this.elm.find('.quiz--progress-indicator').css('width', progress + '%');
            this.elm.find('.quiz--question-section')[0].className = ('quiz--question-section quiz--question-section__' + currentQuestion);
        }
    };

    return View;

});