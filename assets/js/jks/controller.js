/**
 * Created by STORMSEN on 12.08.2016.
 */

/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _scope;

    var view, navigation, router;
    var pageHome;

    var isSlideLoader = false;


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

        function onAssetsLoaded(shader) {

            console.log('onAssetsLoaded');

            dataHandler.s.onAssetsLoadingProgress.remove(onAssetsLoadingProgress);
            dataHandler.s.onAssetsLoaded.remove(onAssetsLoaded);
            window.removeEventListener('resize', onResizePreloader);


            //return

            router = new jks.Router();


            pageHome = new jks.PageHome(config, shader);

            view = new jks.View(config, shader);
            view.s.onReady.addOnce(onViewReady);
            view.s.onResize.add(viewOnResize);
            view.s.onOrientationChange.add(onOrientationChange);
            view.s.switchMode.add(switchMode);

            navigation = new jks.Navigation(config);
            navigation.s.onNavSelect.add(onNavSelect);
            navigation.s.onTapHome.add(onTapHome);
            navigation.s.onToggleThumbNav.add(onToggleThumbNav);

            addToDisplay();

        }

        function addToDisplay() {
            view.containerPages.addChild(pageHome.container);
            view.containerNavigation.addChild(navigation.container)
            TweenLite.delayedCall(.1, view.resizeScreen);
        }

        /*--------------------------------------------
         ~ VIEW HANDLING
         --------------------------------------------*/

        function onViewReady() {

            pageHome.show();
            navigation.wakeUp();
            TweenLite.delayedCall(1.5, function () {
                navigation.show();
            })

        }

        function viewOnResize() {

            navigation.updateView();
            pageHome.updateView();

        }

        function onOrientationChange(orientation) {
            navigation.onOrientationChange(orientation);
        }

        function switchMode(isMobile) {
            navigation.switchMode(isMobile);
        }


        /*--------------------------------------------
         ~ NAVIGATION HANDLING
         --------------------------------------------*/

        function onKeyDown(e) {
            e == 'next' ? view.slideNext() : view.slidePrev();
        }

        function onNavSelect(id) {
            console.log(id = id || 0, 'onNavSelect');
            slideSwitch(id);
        }

        function onTapHome() {
            pageHome.show();
            TweenLite.delayedCall(1.5, navigation.show);
            navigation.s.onKeyDownEvent.remove(onKeyDown);
        }

        function onToggleThumbNav(activated) {
            view.thumbNavToggle(activated);
        }

        /*--------------------------------------------
         ~ SLIDE SWITCH
         --------------------------------------------*/

        function slideSwitch(id) {

            navigation.hide();

            if (!config.pageData[id].contentLoaded) {
                dataHandler.loadSlide(id);
                dataHandler.s.onSlideLoadingProgress.add(onSlideLoadingProgress);
                dataHandler.s.onSlideLoaded.add(onSlideLoaded);
                isSlideLoader = true;
                view.showSlideLoadingProgress();
            } else {
                switchSlide(id);
            }
        }

        function onSlideLoadingProgress(progress) {
            view.updateSlideLoadingProgress(progress);
        }

        function onSlideLoaded(pageID) {
            // console.log('onSlideLoaded', config.pageData[pageID].contentLoaded);
            dataHandler.s.onSlideLoadingProgress.remove(onSlideLoadingProgress);
            dataHandler.s.onSlideLoaded.remove(onSlideLoaded);

            if (isSlideLoader) {
                // show loader for .2s when loaded ...
                TweenLite.delayedCall(.2, function () {
                    view.hideSlideLoadingProgress();
                    isSlideLoader = false;
                    switchSlide(pageID);
                })
            }

        }

        function switchSlide(pageID) {

            pageHome.hide();

            view.initSlide(config, pageID);
            view.initThumbNavigation();

            if (jks.Config.getDeviceType() != 'mobile') {
                view.initSideNavigation();
                navigation.s.onKeyDownEvent.add(onKeyDown);
            }

            TweenLite.delayedCall(.1, view.resizeScreen);
        }


    }

    jks.Controller = Controller;

}());