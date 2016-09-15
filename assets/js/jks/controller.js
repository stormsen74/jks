/**
 * Created by STORMSEN on 12.08.2016.
 */

/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _scope;


    function Controller(config, dataHandler, router, navigation, view) {

        _scope = this;

        console.log(navigation, this)

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


        navigation.s.onKeyDownEvent.add(onKeyDown);

        function onKeyDown(e) {
            console.log(e, 'down');
            e == 'next' ? view.slideNext() : view.slidePrev();
        }


    }

    jks.Controller = Controller;

}());