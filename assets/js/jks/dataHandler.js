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

    function DataHandler(config) {
        _scope = this;

        this.s = {
            onContentLoaded: new signals.Signal(),
            onDataHandlerReady: new signals.Signal()
        };


        function init() {

            console.log('init - DataHandler');

            generateLoadingContent();
        }

        function generateLoadingContent() {
            for (var i = 0; i < config.numPages; i++) {
                var maifest = [];
                for (var j = 0; j < config.pages[i].items.length; j++) {
                    // console.log(config.pages[i].items[j]);
                    maifest.push(config.pages[i].items[j]['img']);
                    maifest.push(config.pages[i].items[j]['thumb']);
                }
                _loadingContent.push(maifest);
            }

            TweenLite.delayedCall(.01, function () {
                _scope.s.onDataHandlerReady.dispatch();
            });


        }


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

                console.log('onAssetsLoaded: ', config.pageData[pageID])


                for (var i = 0; i < config.pageData[pageID].numImages; i++) {
                    var add = i + 1;
                    var str = add < 10 ? '0' : '';
                    var data = config.pageData[pageID];
                    data.images.push(_loader.getResult("img_" + config.pageData[pageID].category + "_" + str + add));
                    //data.thumbs.push(_loader.getResult("thumb_" + config.pageData[pageID].category + "_" + i));
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