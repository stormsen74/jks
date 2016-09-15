/**
 * Created by STORMSEN on 12.08.2016.
 */

/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {


    function Controller(config, dataHandler, router, navigation, view) {

        console.log('init - Controller || version: ', config.version);


        dataHandler.loadAssets();
        dataHandler.s.onAssetsLoaded.add(onAssetsLoaded);

        function onAssetsLoaded(assetLoader) {
            view.initAssets(assetLoader);
        }


        dataHandler.loadPage(0);
        dataHandler.s.onContentLoaded.add(onContentLoaded);

        function onContentLoaded(pageID) {
            console.log('onContentLoaded! ::', pageID);

            view.initSlide(config, pageID);
            view.initThumbNavigation();
            if (!jks.Core.isMobile()) {
                view.initSideNavigation();
            }

            TweenLite.delayedCall(.5, view.resizeScreen);
        }





        navigation.s.onKeyDownEvent.add(navigation.onKeyDown);

        function onKeyDown(e) {
            console.log(e,'down');
        }


    }

    jks.Controller = Controller;

}());