define(['lib/news_special/bootstrap'], function (news) {

    var progress_bar = news.$('.progress--bar');
    
    function _reset() {
        progress_bar.css('width', '0%');
    }

    var CrumbtrailView = function (model) {
        var CrumbtrailView = this;
        this.model = model;
        news.pubsub.on('nextQuestion', function () {
            CrumbtrailView.updateCrumbtrail();
        });
        news.pubsub.on('loadResult', function () {
            progress_bar.css('width', '100%');
        });
        news.pubsub.on('resetQuizView', function () {
            _reset();
        });
    };

    CrumbtrailView.prototype.updateCrumbtrail = function () {
        var model = this.model,
            currentQuestion = model.getCurrentQuestion();
            // crumbTrail = model.crumbTrail(); this line is redundant

        var width  = (currentQuestion / model.data.questions.length) * 100;
        if (width > 0) {
            progress_bar.css('width', Math.floor(width) + '%');
        }
    };

    return CrumbtrailView;
});