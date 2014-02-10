define([
    'jquery',
    'lib/news_special/iframemanager__frame',
    'lib/news_special/imager',
    'istats',
    'pubsub'
], function ($, iframemanager__frame, Imager, istats) {

    iframemanager__frame.init();

    var imager = new Imager({
        availableWidths: [320, 640, 1024],
        regex: /(\/news\/.*img\/)\d+(\/.*)$/i
    });

    istats.init();
    $.on('istats', function (actionType, actionName, newLabels) {
        istats.log(actionType, actionName, newLabels);
    });

    return {
        $: $,
        pubsub: $,
        setIframeHeight: iframemanager__frame.setHeight,
        hostPageSetup: iframemanager__frame.setHostPageInitialization
    };

});