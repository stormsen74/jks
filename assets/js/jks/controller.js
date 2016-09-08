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

        console.log('init - Controller || version: ', config.version);

        //dataHandler.loadAssets();
        //dataHandler.s.onAssetsLoaded.add(onAssetsLoaded);
        //function onAssetsLoaded(pageID) {
        //    console.log('onAssetsLoaded!');
        //    view.initAssets(assets);
        //}

        dataHandler.loadPage(1);
        dataHandler.s.onContentLoaded.add(onContentLoaded);


        function onContentLoaded(pageID) {
            console.log('onContentLoaded! ::', pageID);
            TweenLite.delayedCall(.5, view.resizeScreen);
            view.initSlide(config, pageID);
        }


    }

    jks.Controller = Controller;

}());