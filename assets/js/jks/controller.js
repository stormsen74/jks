/**
 * Created by STORMSEN on 12.08.2016.
 */

/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _scope;

    var pageHome;
    var view, navigation


    function Controller(config, dataHandler) {

        _scope = this;

        console.log('init - Controller || version: ', config.version);

        window.addEventListener('resize', onResizePreloader);
        document.getElementById('preload').style.height = window.innerHeight + 'px'
        function onResizePreloader() {
            document.getElementById('preload').style.height = window.innerHeight + 'px'
        }

        dataHandler.s.onAssetsLoadingProgress.add(onAssetsLoadingProgress);
        dataHandler.s.onAssetsLoaded.add(onAssetsLoaded);
        dataHandler.loadAssets();

        function onAssetsLoadingProgress(progress) {
            document.getElementById('preload').style.width = progress * 100 + '%'
        }

        function onAssetsLoaded(assets) {

            console.log('onAssetsLoaded');

            //return

            //router = new jks.Router();


            view = new jks.View(config, assets);
            view.s.onResize.add(viewOnResize)
            view.s.onReady.add(onViewReady)

            pageHome = new jks.PageHome(config);

            navigation = new jks.Navigation(config);
            navigation.s.onKeyDownEvent.add(onKeyDown);
            navigation.s.onNavSelect.add(onNavSelect);
            navigation.s.onTapHome.add(onTapHome);


            view.containerPages.addChild(pageHome.container);
            view.containerNavigation.addChild(navigation.container)
            TweenLite.delayedCall(.1, view.resizeScreen);



            // remove
            dataHandler.s.onAssetsLoadingProgress.remove(onAssetsLoadingProgress);
            dataHandler.s.onAssetsLoaded.remove(onAssetsLoaded);
            window.removeEventListener('resize', onResizePreloader);


            //slideSwitch(1)
        }


        function viewOnResize() {
            navigation.updateView();
            pageHome.updateView();
        }

        function onViewReady() {
            pageHome.show();
            navigation.wakeUp();

            view.s.onReady.remove(onViewReady)
        }

        function slideSwitch(id) {
            if (!config.pageData[id].contentLoaded) {
                dataHandler.loadSlide(id);
                dataHandler.s.onSlideLoadingProgress.add(onSlideLoadingProgress);
                dataHandler.s.onSlideLoaded.add(onSlideLoaded);
            } else {
                switchSlide(id);
            }
        }


        function onSlideLoadingProgress(progress) {
            console.log('onSlideLoadingProgress', progress);
            // document.getElementById('preload').style.width = progress * 100 + '%'
        }

        function onSlideLoaded(pageID) {
            console.log('onSlideLoaded', config.pageData[pageID].contentLoaded);
            dataHandler.s.onSlideLoadingProgress.remove(onSlideLoadingProgress);
            dataHandler.s.onSlideLoaded.remove(onSlideLoaded);
            switchSlide(pageID);
        }

        function switchSlide(pageID) {

            pageHome.hide();

            view.initSlide(config, pageID);
            view.initThumbNavigation();

            if (!jks.Core.isMobile()) {
                view.initSideNavigation();
            }

            TweenLite.delayedCall(.1, view.resizeScreen);
        }


        function onKeyDown(e) {
            e == 'next' ? view.slideNext() : view.slidePrev();
        }

        function onNavSelect(id) {
            console.log(id = id || 0, 'onNavSelect');
            slideSwitch(id);
            // pageHome.hide();
        }

        function onTapHome() {
            console.log('onTapHome')
            pageHome.show();
        }


    }

    jks.Controller = Controller;

}());