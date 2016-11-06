/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _scope;

    var _loader;
    var _assetLoader;
    var _loadingContent = []

    function DataHandler(config) {
        _scope = this;

        this.s = {
            onDataHandlerReady: new signals.Signal(),
            onAssetsLoadingProgress: new signals.Signal(),
            onAssetsLoaded: new signals.Signal(),
            onSlideLoadingProgress: new signals.Signal(),
            onSlideLoaded: new signals.Signal()
        };


        function init() {

            console.log('init - DataHandler');

            generateSlideContent();
        }

        function generateSlideContent() {
            for (var i = 0; i < config.numPages; i++) {
                var mainfest = [];
                for (var j = 0; j < config.pages[i].items.length; j++) {
                    // force reload ?!
                    //config.pages[i].items[j]['img'].src = config.pages[i].items[j]['img'].src + '?' + new Date().getTime();
                    config.pages[i].items[j]['img'].src = config.pages[i].items[j]['img'].src;
                    mainfest.push(config.pages[i].items[j]['img']);
                }
                _loadingContent.push(mainfest);
            }


            TweenLite.delayedCall(.0333, function () {
                _scope.s.onDataHandlerReady.dispatch();
            });
        }

        /*--------------------------------------------
         ~ LOAD ASSETS
         --------------------------------------------*/


        this.loadAssets = function () {

            _assetLoader = new createjs.LoadQueue(false);
            _assetLoader.addEventListener("progress", onLoadAssets);
            _assetLoader.addEventListener("complete", onAssetsLoaded);
            _assetLoader.loadManifest(config.assets.manifest);

            function onLoadAssets(e) {
                _scope.s.onAssetsLoadingProgress.dispatch(e.loaded);
            }

            function onAssetsLoaded() {
                console.log('assets loaded!')

                //_scope.s.onAssetsLoaded.dispatch();

                loadShaderData();
            }
        }



        if (jks.Core.releaseMode()) {
            PIXI.loader.add('shader', 'assets/js/bin/filters/treshold.frag');
        } else {
            PIXI.loader.add('shader', 'assets/js/jks/filters/treshold.frag');
        }

        PIXI.loader.once('complete', onLoaded);
        function loadShaderData() {
            PIXI.loader.load();
        }

        function onLoaded(loader, res) {
            console.log('shader laoded')
            _scope.s.onAssetsLoaded.dispatch(res.shader.data);
        }

        /*--------------------------------------------
         ~ LOAD PAGES
         --------------------------------------------*/

        this.loadSlide = function (pageID) {

            console.log('loadSlide', config.pageData[pageID]);
            _loader = new createjs.LoadQueue(false);
            _loader.addEventListener("progress", onLoadProgress);
            _loader.addEventListener("complete", onPageLoad);
            _loader.loadManifest(_loadingContent[pageID]);


            function onLoadProgress(e) {
                _scope.s.onSlideLoadingProgress.dispatch(e.loaded);
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

                // delayed dispatch / maybe bugfix?
                //TweenLite.delayedCall(.1, _scope.s.onSlideLoaded.dispatch, [pageID])
                _scope.s.onSlideLoaded.dispatch(pageID);

            }

        }


        init();

    }

    jks.DataHandler = DataHandler;

    jks.DataHandler.getAssetByID = function (id) {
        return _assetLoader.getResult(id);
    }

    jks.DataHandler.getShader = function (id) {
        console.log(_scope.shaders[0])
        return _scope.shaders[0];
    }

}());