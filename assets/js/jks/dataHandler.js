/**
 * Created by STORMSEN on 12.08.2016.
 */

/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _scope;

    var _loader;
    var _loadingAssets = []
    var _loadingContent = []

    function DataHandler(config) {
        _scope = this;

        this.s = {
            onContentLoaded: new signals.Signal(),
            onAssetsLoadingProgress: new signals.Signal(),
            onAssetsLoaded: new signals.Signal(),
            onDataHandlerReady: new signals.Signal()
        };


        function init() {

            console.log('init - DataHandler');

            generateSlideContent();
        }

        function generateSlideContent() {
            for (var i = 0; i < config.numPages; i++) {
                var mainfest = [];
                for (var j = 0; j < config.pages[i].items.length; j++) {
                    mainfest.push(config.pages[i].items[j]['img']);
                }
                _loadingContent.push(mainfest);
            }


            TweenLite.delayedCall(.01, function () {
                _scope.s.onDataHandlerReady.dispatch();
            });
        }

        /*--------------------------------------------
         ~ LOAD ASSETS
         --------------------------------------------*/


        this.loadAssets = function () {
            var assetLoader= new createjs.LoadQueue(false);
            assetLoader.addEventListener("progress", onLoadAssets);
            assetLoader.addEventListener("complete", onAssetsLoaded);
            assetLoader.loadManifest(config.assets.manifest);

            function onLoadAssets(e) {
                _scope.s.onAssetsLoadingProgress.dispatch(e.loaded);
            }

            function onAssetsLoaded() {
                console.log('assets loaded!')

                _scope.s.onAssetsLoaded.dispatch(assetLoader);
                //TweenLite.delayedCall(.3, _scope.s.onAssetsLoadingProgress.dispatch,[assetLoader])
                //TODO - get Assets from Loader?
            }
        }

        /*--------------------------------------------
         ~ LOAD PAGES
         --------------------------------------------*/

        this.loadPage = function (pageID) {

            _loader = new createjs.LoadQueue(false);
            _loader.addEventListener("progress", onLoadProgress);
            _loader.addEventListener("complete", onPageLoad);
            _loader.loadManifest(_loadingContent[pageID]);

            //console.log('loadPage',config.pageData[pageID]);

            function onLoadProgress(e) {
                console.log(e.loaded);
            }

            function onPageLoad() {

                for (var i = 0; i < config.pageData[pageID].numImages; i++) {
                    var add = i + 1;
                    var str = add < 10 ? '0' : '';
                    var data = config.pageData[pageID];
                    data.images.push(_loader.getResult("img_" + config.pageData[pageID].category + "_" + str + add));
                }

                console.log('pageLoaded!', pageID);
                config.pageData[pageID].contentLoaded = true;

                _scope.s.onContentLoaded.dispatch(pageID);

            }

        }


        init();

    }

    jks.DataHandler = DataHandler;

}());