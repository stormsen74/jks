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
    var pageVita;

    var currentActivePage;

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


            view = new jks.View(config, shader);
            view.s.onReady.addOnce(onViewReady);
            view.s.onResize.add(viewOnResize);
            view.s.onOrientationChange.add(onOrientationChange);
            view.s.switchMode.add(switchMode);
            view.s.onThumbNavigationShow.add(onThumbNavigationShow);

            navigation = new jks.Navigation(config);
            navigation.s.onPageNavSelect.add(onPageNavSelect);
            navigation.s.onIconNavSelect.add(onIconNavSelect);
            navigation.s.onTapHome.add(onTapHome);
            navigation.s.onToggleThumbNav.add(onToggleThumbNav);
            navigation.s.navEvent.add(onNavEvent);

            pageHome = new jks.PageHome(config, shader);
            pageVita = new jks.PageVita(config, shader);

            addToDisplay();

        }

        function addToDisplay() {
            view.containerPages.addChild(pageHome.container);
            view.containerPages.addChild(pageVita.container);
            view.containerNavigation.addChild(navigation.container)
            TweenLite.delayedCall(.1, view.resizeScreen);
        }

        /*--------------------------------------------
         ~ VIEW HANDLING
         --------------------------------------------*/

        function onViewReady() {

            pageHome.show();
            currentActivePage = pageHome;
            navigation.wakeUp();
            TweenLite.delayedCall(1.5, function () {
                navigation.show();
            })

        }

        function viewOnResize() {

            navigation.updateView();
            pageHome.updateView();
            pageVita.updateView();

        }

        function onOrientationChange(orientation) {
            console.log('onOrientationChange', currentActivePage)
            navigation.onOrientationChange(orientation);
            currentActivePage.onOrientationChange();
        }

        function switchMode(isMobile) {
            navigation.switchMode(isMobile);

            if (jks.Navigation.getCurrentSelectedPage() == 'vita') {
                pageVita.switchMode(isMobile);
            }

        }

        function onThumbNavigationShow(show, height) {
            navigation.thumbNavigationShow(show, height);
        }

        /*--------------------------------------------
         ~ VIEW PAGE
         --------------------------------------------*/


        function viewPage(id) {
            console.log('viewPage', id)

            switch (id) {
                case 'slides':
                    currentActivePage.hide();
                    pageHome.hide();
                    //pageVita.hide();
                    break;
                case 'home':
                    currentActivePage.hide();
                    currentActivePage = pageHome;
                    pageHome.show();
                    TweenLite.delayedCall(1.5, navigation.show);
                    navigation.s.onKeyDownEvent.remove(onKeyDown);
                    break;
                case 'vita':
                    currentActivePage = pageVita;
                    navigation.hide();
                    pageVita.show();
                    break;
            }
        }

        /*--------------------------------------------

         ~ NAVIGATION HANDLING
         --------------------------------------------*/

        function onKeyDown(e) {
            e == 'next' ? view.slideNext() : view.slidePrev();
        }

        function onIconNavSelect(id) {
            console.log(id = id || 0, 'navigation: onIconNavSelect');
            slideSwitch(id);
        }

        function onPageNavSelect(id) {
            console.log(id = id || 0, 'navigation: onPageNavSelect');
            viewPage(id)
        }

        function onTapHome() {
            viewPage('home');
        }

        function onToggleThumbNav(activated) {
            view.thumbNavToggle(activated);
        }

        function onNavEvent(type, bool) {
            //console.log('onNavEvent', type, bool, jks.Navigation.getCurrentSelectedPage())
            if (jks.Navigation.getCurrentSelectedPage() != 'home' && jks.Navigation.getCurrentSelectedPage() != 'slides') {
                switch (type) {
                    case 'selectionVisible':
                        bool ? pageVita.hideContent() : pageVita.showContent();
                        break;
                    case 'navVisible':
                        bool ? pageVita.hideContent() : pageVita.showContent();
                        break;
                }
            }
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

            viewPage('slides');

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