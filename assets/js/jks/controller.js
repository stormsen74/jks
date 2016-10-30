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
    var pageManager;

    var currentActivePageID = 'home';

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
            pageManager = new jks.PageManager(config, shader);

            TweenLite.set('.content', {borderRadius: '5px 0 0 0'})

            addToDisplay();

        }

        function addToDisplay() {
            view.containerPages.addChild(pageHome.container);
            view.containerPages.addChild(pageManager.container);
            view.containerNavigation.addChild(navigation.container)
            TweenLite.delayedCall(.1, view.resizeScreen);
        }

        /*--------------------------------------------
         ~ VIEW HANDLING
         --------------------------------------------*/

        function onViewReady() {

            pageHome.show();
            currentActivePageID = 'home';
            navigation.wakeUp();
            TweenLite.delayedCall(1.5, function () {
                navigation.show();
            })

        }

        function viewOnResize() {

            navigation.updateView();
            pageHome.updateView();
            pageManager.updateView();

        }

        function onOrientationChange(orientation) {
            console.log('onOrientationChange', currentActivePageID)
            navigation.onOrientationChange(orientation);
            if (currentActivePageID == 'home') {
                pageHome.onOrientationChange();
            }
        }

        function switchMode(isMobile) {
            navigation.switchMode(isMobile);

            //if (jks.Navigation.getCurrentSelectedPage() == 'vita') {
            pageManager.switchMode(isMobile);
            //}

        }

        function onThumbNavigationShow(show, height) {
            navigation.thumbNavigationShow(show, height);
        }

        /*--------------------------------------------
         ~ VIEW PAGE
         --------------------------------------------*/


        function viewPage(id) {
            console.log('viewPage', id);

            view.s.onThumbNavigationShow.remove(onThumbNavigationShow);
            jks.SelectNavigation.setButtonColors('default');

            switch (id) {
                case 'slides':
                    currentActivePageID = 'slides';

                    pageManager.hide();
                    pageManager.blendOut();
                    pageHome.hide();

                    view.s.onThumbNavigationShow.add(onThumbNavigationShow);
                    break;
                case 'home':
                    currentActivePageID = 'home';

                    pageManager.hide();
                    pageManager.blendOut();
                    //currentActivePage = pageHome;
                    pageHome.show();
                    TweenLite.delayedCall(1.5, navigation.show);
                    navigation.s.onKeyDownEvent.remove(onKeyDown);
                    break;
                case 'vita':
                    hideContent()
                    currentActivePageID = 'vita';
                    showCurrentContent()

                    navigation.hide();

                    pageManager.show();
                    pageManager.blendIn();
                    break;
                case 'kontakt':
                    hideContent()
                    currentActivePageID = 'kontakt';
                    showCurrentContent()

                    navigation.hide();

                    pageManager.show();
                    pageManager.blendIn();
                    break;
                case 'impressum':
                    hideContent()
                    currentActivePageID = 'impressum';
                    showCurrentContent()

                    navigation.hide();

                    pageManager.show();
                    pageManager.blendIn();
                    break;
                case 'aktuelles':
                    hideContent()
                    currentActivePageID = 'aktuelles';
                    showCurrentContent()

                    navigation.hide();

                    pageManager.show();
                    pageManager.blendOut();
                    pageHome.show();
                    break;
            }
        }

        var content_blocks = ['#content_vita', '#content_kontakt', '#content_impressum', '#content_aktuelles']

        function hideContent() {

            content_blocks.forEach(function (selector) {
                TweenLite.set(selector, {display: 'none', opacity: 0})
            });

        }

        function showCurrentContent() {
            var selector = '#content_' + currentActivePageID
            TweenLite.set(selector, {display: 'block', opacity: 1})
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
                        bool ? pageManager.hideContent() : pageManager.showContent();
                        break;
                    case 'navVisible':
                        bool ? pageManager.hideContent() : pageManager.showContent();
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

    jks.Controller.getCurrentActivePageID = function () {
        return currentActivePageID;
    }

}());