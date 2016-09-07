/**
 * Created by STORMSEN on 12.08.2016.
 */



this.jks = this.jks || {};


( function () {

    var _json;


    function Config(json) {

        this.version = '0.3.2';
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
            data.thumbs = [];
            this.pageData.push(data);
        }

        console.log('Config :: pageData created!');

        // console.log('config',this.pageData);

        // console.log('config :: version: ', this.version);
        // console.log('config :: debug: ', this.debug);
        // console.log('config :: json: ', _json);

        // console.log(_json.pages[0].items.length);
        // console.log(_json.pages);


        if (this.debug) {
            document.getElementById('version').innerHTML = 'version ' + this.version
        }


    }

    jks.Config = Config;

}())