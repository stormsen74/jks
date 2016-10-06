/**
 * Created by STORMSEN on 12.08.2016.
 */



this.jks = this.jks || {};


( function () {

    var _scope;
    var _json;


    function Config(json) {
        _scope = this;

        this.version = '0.5.4';
        this.device = '';
        this.debug = false;
        this.log = false;


        _json = json;
        this.numPages = _json.pages.length;
        this.pages = _json.pages;
        this.pageData = [];


        this.navigationData = {
            menue: [
                {title: 'vita'},
                {title: 'kontakt'},
                {title: 'impressum'},
                {title: 'aktuelles'}
            ]
        }

        this.colors = {
            blue: 0x408080,
            overlay: 0xcaf0f0
        }

        this.shaders = [];

        this.backgroundImageSize = {
            width: 1200,
            height: 800
        }


        for (var i = 0; i < this.numPages; i++) {
            var data = {};
            data.pageID = i;
            data.contentLoaded = false;
            data.category = _json.pages[i].category;
            data.categoryText = _json.pages[i].categoryText;
            data.numImages = _json.pages[i].items.length;
            data.images = [];
            data.items = _json.pages[i].items
            this.pageData.push(data);
        }


        this.assets = {};
        this.assets.manifest = [
            {
                "src": "assets/img/bg_home.jpg",
                "id": "bg_home"
            },
            {
                "src": "assets/img/navigation/side_nav_arrow.png",
                "id": "side_nav_arrow"
            },
            {
                "src": "assets/img/navigation/01_meeresrauschen.png",
                "id": "meeresrauschen"
            },
            {
                "src": "assets/img/navigation/02_fragmente.png",
                "id": "fragmente"
            },
            {
                "src": "assets/img/navigation/03_entschaerft.png",
                "id": "entschaerft"
            },
            {
                "src": "assets/img/navigation/04_trauringe.png",
                "id": "trauringe"
            }
        ];


        if (device.mobile()) {
            this.device = 'mobile';
        } else if (device.tablet() || isMobile.apple.tablet) {
            this.device = 'tablet';
        } else if (device.desktop()) {
            this.device = 'desktop';


        }

        if (this.debug || this.log) {
            document.getElementById('version').innerHTML = 'version: ' + this.version +
                '<br/>' + 'device: ' + this.device +
                '<br/>' + 'dpr: ' + jks.Config.getDeviceResolution() +
                '<br/>' + 'webgl: ' + PIXI.utils.isWebGLSupported();

            document.getElementById('version').style.display = 'block';

            if (this.debug) {
                document.getElementById('version').style.width = '130px';
            }

            if (this.log) {
                window.debugLog();
            }
        } else {
            window.hideLog();
        }


        console.log('Config :: pageData created!');

        // console.log('config',this.pageData);
        // console.log('config :: version: ', this.version);
        // console.log('config :: debug: ', this.debug);
        // console.log('config :: json: ', _json);
        // console.log(_json.pages[0].items.length);
        // console.log(_json.pages);


    }

    jks.Config = Config;

    jks.Config.getDeviceType = function () {
        return _scope.device;
    }

    jks.Config.getDeviceResolution = function () {
        // maybe exclude some slower devicves
        var _device_pixel_ratio = device.desktop() ? 1 : res.dppx();
        return _device_pixel_ratio;
    }

    jks.Config.getColor = function (id) {
        return _scope.colors[id]
    }

    jks.Config.backgroundImageSize = function () {
        return _scope.backgroundImageSize;
    }

    jks.Config.shaders = function () {
        return _scope.shaders;
    }

}())