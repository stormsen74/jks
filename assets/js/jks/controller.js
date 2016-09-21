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

        pageSwitch(1);

        TweenLite.delayedCall(5, pageSwitch, [0])
        //TweenLite.delayedCall(6, pageSwitch, [1])

        function pageSwitch(id) {
            if (!config.pageData[id].contentLoaded) {
                dataHandler.loadPage(id);
                dataHandler.s.onContentLoaded.add(onContentLoaded);
            } else {
                switchPage(id);
            }
        }

        function onContentLoaded(pageID) {
            console.log('content loaded', config.pageData[0].contentLoaded);

            switchPage(pageID);
        }

        function switchPage(pageID) {

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