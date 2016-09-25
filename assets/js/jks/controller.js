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

        dataHandler.loadAssets();
        dataHandler.s.onAssetsLoaded.add(onAssetsLoaded);

        function onAssetsLoaded(assets) {

            console.log('onAssetsLoaded');

            //router = new jks.Router();


            view = new jks.View(config, assets);
            view.s.onResize.add(viewOnResize)
            view.s.onReady.addOnce(onViewReady)

            pageHome = new jks.PageHome(config);

            navigation = new jks.Navigation();
            navigation.s.onKeyDownEvent.add(onKeyDown);
            navigation.s.onNavSelect.add(onNavSelect);
            navigation.s.onTapHome.add(onTapHome);


            view.containerPages.addChild(pageHome.container);
            view.containerNavigation.addChild(navigation.container)


            //pageSwitch(1)
        }


        function viewOnResize() {
            navigation.updateView();
            pageHome.updateView();
        }

        function onViewReady() {
            pageHome.show();
        }

        //TweenLite.delayedCall(5, pageSwitch, [0])
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
            //console.log('content loaded', config.pageData[0].contentLoaded);
            switchPage(pageID);
        }

        function switchPage(pageID) {

            view.initSlide(config, pageID);

            view.initThumbNavigation();
            if (!jks.Core.isMobile()) {
                view.initSideNavigation();
            }

            TweenLite.delayedCall(.1, view.resizeScreen);
        }


        function onKeyDown(e) {
            console.log(e, 'down');
            e == 'next' ? view.slideNext() : view.slidePrev();
        }

        function onNavSelect(id) {
            console.log(id = id || 0, 'onNavSelect');
            pageSwitch(id);
            pageHome.hide();
        }

        function onTapHome() {
            console.log('onTapHome')
            pageHome.show();
        }


    }

    jks.Controller = Controller;

}());