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
    var _loadingContent = []
    var _config;

    function DataHandler(config) {
        _scope = this;

        this.s = {
            onContentLoaded: new signals.Signal(),
            onDataHandlerReady: new signals.Signal()
            // onResponse_getAllFromToday: new signals.Signal(),
        };


        function init() {

            console.log('init - DataHandler', config);

            generateLoadingContent();
        }

        function generateLoadingContent() {
            for (var i = 0; i < config.numPages; i++) {
                // console.log('page: ', i);
                var maifest = [];
                for (var j = 0; j < config.pages[i].items.length; j++) {
                    // console.log(config.pages[i].items[j]);
                    maifest.push(config.pages[i].items[j]['img']);
                    maifest.push(config.pages[i].items[j]['thumb']);
                }
                _loadingContent.push(maifest);


            }

            console.log(_loadingContent, '°°°°°°°°°°°°°°°°');
            TweenLite.delayedCall(.03, function () {
                console.log('f');
                _scope.s.onDataHandlerReady.dispatch();
            });


            //_scope.loadPage(0);
        }


        this.loadPage = function (id) {

            _loader = new createjs.LoadQueue(false);
            _loader.addEventListener("progress", onLoadProgress);
            _loader.addEventListener("complete", onAssetsLoaded);
            _loader.loadManifest(_loadingContent[id]);

            console.log(config.pageData[id]);

            function onLoadProgress(e) {
                console.log(e.loaded);
            }

            function onAssetsLoaded() {

                console.log(config.pageData[id].category)


                for (var i = 0; i < config.pageData[id].numImages; i++) {
                    // console.log(_loader.getResult("img_" + config.pageData[id].category + "_" + i));
                    var data = config.pageData[id];
                    data.images.push(_loader.getResult("img_" + config.pageData[id].category + "_" + i));
                    data.thumbs.push(_loader.getResult("thumb_" + config.pageData[id].category + "_" + i));
                }

                console.log('assetsLoaded!', id);
                config.pageData[id].contentLoaded = true;
                console.log(config.pageData[id]);

                // console.log('loaded!', _loader.getResult());
                _scope.s.onContentLoaded.dispatch(id);
                //var sprite = new PIXI.Sprite(PIXI.Texture.fromImage(_loader.getResult("img_0").src));

            }

        }


        init();


    }

    jks.DataHandler = DataHandler;

}());