/**
 * Created by STORMSEN on 12.08.2016.
 */



this.jks = this.jks || {};


( function () {

    var _scope;
    var _json;


    function Config(json) {
        _scope = this;

        this.version = '0.4.0';
        this.device = '';
        this.debug = true;

        _json = json;

        this.numPages = _json.pages.length;
        this.pages = _json.pages;
        this.pageData = [];

        for (var i = 0; i < this.numPages; i++) {
            var data = {};
            data.pageID = i;
            data.contentLoaded = false;
            data.category = _json.pages[i].category;
            data.numImages = _json.pages[i].items.length;
            data.images = [];
            this.pageData.push(data);
        }


        this.assets = {};
        this.assets.manifest = [
            {
                "src": "assets/img/navigation/side_nav_arrow.png",
                "id": "side_nav_arrow"
            }
            //{
            //    "src": "assets/img/navigation/nav_arrow_42x130.png",
            //    "id": "nav_arrow_2"
            //}
        ];


        console.log('Config :: pageData created!');

        // console.log('config',this.pageData);

        // console.log('config :: version: ', this.version);
        // console.log('config :: debug: ', this.debug);
        // console.log('config :: json: ', _json);

        // console.log(_json.pages[0].items.length);
        // console.log(_json.pages);


        if (device.mobile()) {
            this.device = 'mobile';
        } else if (device.tablet()) {
            this.device = 'tablet';
        } else if (device.desktop()) {
            this.device = 'desktop';
        }


        if (this.debug) {
            document.getElementById('version').innerHTML = 'version: ' + this.version +
                '<br/>' + 'device: ' + this.device +
                '<br/>' + 'webgl: ' + PIXI.utils.isWebGLSupported();
        }


    }

    jks.Config = Config;

    jks.Config.getDeviceType = function() {
        return _scope.device;
    }

}())