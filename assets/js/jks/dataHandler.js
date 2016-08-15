/**
 * Created by STORMSEN on 12.08.2016.
 */

/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _loader;
    var _config;

    function DataHandler(config) {


        console.log('init - DataHandler', config);


        var manifest = [
            {
                src: "assets/img/fsImage_1200x750_c.jpg",
                id: "img_0"
            }
        ];

        _loader = new createjs.LoadQueue(false);
        _loader.addEventListener("progress", onLoadProgress);
        _loader.addEventListener("complete", onAssetsLoaded);
        _loader.loadManifest(manifest);

        function onLoadProgress(e) {
            //console.log(e.loaded);
        }

        function onAssetsLoaded() {
            console.log('loaded!', _loader.getResult("img_0"))
            //var sprite = new PIXI.Sprite(PIXI.Texture.fromImage(_loader.getResult("img_0").src));

        }


        _loader.loadManifest(manifest);


        this.do = function () {
            console.log(config.getParam())
        }


        //init();


    }

    jks.DataHandler = DataHandler;

}());