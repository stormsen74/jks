/**
 * Created by STORMSEN on 12.08.2016.
 */

/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _loader;

    function Controller(config, dataHandler, router, navigation, view) {

        console.log('init - Controller');

        dataHandler.loadPage(0);
        dataHandler.s.onContentLoaded.add(onContentLoaded);


        function onContentLoaded(pageID) {
            console.log('onContentLoaded! ::', pageID);
            //view.addFSImage(config, _id);
            TweenLite.delayedCall(.5, view.resizeScreen);
            view.initSlide(config, pageID);
        }


    }

    jks.Controller = Controller;

}());