define(['jquery'], function ($) {
    var hostCommunicator = {
        init: function () {
            this.setHeight();
            this.startWatching();
            if (window.postMessage) {
                this.setupPostMessage();
            }
            else {
                this.setupIframeBridge();
            }
        },
        height: 0,
        setupPostMessage: function () {
            var externalHostCommunicator = this,
                talker_uid = window.location.pathname;
            window.setInterval(function () {
                var message = {
                    height:           externalHostCommunicator.height,
                    hostPageCallback: externalHostCommunicator.hostPageCallback
                };
                window.parent.postMessage(talker_uid + '::' + JSON.stringify(message), '*');
            }, 32);
        },
        setupIframeBridge: function () {
            var externalHostCommunicator = this;
            window.setInterval(function () {
                window.iframeBridge = {
                    height:           externalHostCommunicator.height,
                    hostPageCallback: externalHostCommunicator.hostPageCallback
                };
            }, 32);
        },
        startWatching: function () {
            var externalHostCommunicator = this;
            window.addEventListener('resize', externalHostCommunicator.setHeight, false);
            window.setInterval(function () {
                externalHostCommunicator.setHeight();
            }, 32);
        },
        newHeight: null,
        setHeight: function () {
            var heightValues = [this.newHeight || 0];
            this.newHeight = null;
            if ($('.main').length > 0) {
                heightValues.push($('.main')[0].scrollHeight);
            }
            // return Math.max.apply(Math, [height, document.body.scrollHeight, $('.main').height()]),
            this.height = Math.max.apply(Math, heightValues);
        },
        hostPageCallback: false,
        setHostPageInitialization: function (callback) {
            this.hostPageCallback = callback.toString();
        }
    };
    return hostCommunicator;
});