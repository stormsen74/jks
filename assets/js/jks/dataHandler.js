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
            onResponse: new signals.Signal()
            // onResponse_getAllFromToday: new signals.Signal(),
        };


        console.log('init - DataHandler', config);

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

                // console.log(_loadingContent)

            }


            _scope.loadPage(0);
        }


        this.loadPage = function (id) {

            _loader = new createjs.LoadQueue(false);
            _loader.addEventListener("progress", onLoadProgress);
            _loader.addEventListener("complete", onAssetsLoaded);
            _loader.loadManifest(_loadingContent[id]);

            console.log(config.pageData[id]);

            function onLoadProgress(e) {
                //console.log(e.loaded);
            }

            function onAssetsLoaded() {
                console.log('loaded!', _loader.getResult("img_zeitlos_0"));
                // console.log('loaded!', _loader.getResult());
                _scope.s.onResponse.dispatch();
                //var sprite = new PIXI.Sprite(PIXI.Texture.fromImage(_loader.getResult("img_0").src));

            }

        }


        // console.log('data', config.pages[0])


        // var manifest = [
        //     {
        //         src: "assets/img/fsImage_1200x750_c.jpg",
        //         id: "img_0"
        //     }
        // ];
        //
        // _loader = new createjs.LoadQueue(false);
        // _loader.addEventListener("progress", onLoadProgress);
        // _loader.addEventListener("complete", onAssetsLoaded);
        // _loader.loadManifest(manifest);
        //
        // function onLoadProgress(e) {
        //     //console.log(e.loaded);
        // }
        //
        // function onAssetsLoaded() {
        //     console.log('loaded!', _loader.getResult("img_0"));
        //     _scope.s.onResponse.dispatch();
        //     //var sprite = new PIXI.Sprite(PIXI.Texture.fromImage(_loader.getResult("img_0").src));
        //
        // }


        // _loader.loadManifest(manifest);


        this.do = function () {
            console.log(config.getParam())
        }


        generateLoadingContent();


    }

    jks.DataHandler = DataHandler;

}());