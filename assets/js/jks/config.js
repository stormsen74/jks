/**
 * Created by STORMSEN on 12.08.2016.
 */

/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _json;

    function Config(json) {

        this.version = 0.1;
        this.debug = true;

        _json = json;

        //console.log('config :: version: ', this.version);
        //console.log('config :: debug: ', this.debug);
        //console.log('config :: json: ', _json);

        console.log(_json.pages[0].items.length)


        this.setParam = function () {
            _param = true;
        }

        this.getParam = function () {
            return _param;
        }


    }

    jks.Config = Config;

}());