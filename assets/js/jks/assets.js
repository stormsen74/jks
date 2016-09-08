/**
 * Created by STORMSEN on 12.08.2016.
 */



this.jks = this.jks || {};


( function () {

    var _json;


    function Assets(json) {

        _json = json;

        //console.log(_json.assets[0]);


        this.numAssets = _json.assets.length;
        this.assets = [];

        for (var i = 0; i < this.numAssets; i++) {
            var asset = {};
            asset.src = _json.assets[i].src;
            asset.id = _json.assets[i].id;
            asset.contentLoaded = false;
            this.assets.push(asset);

            console.log(asset)
        }

        console.log('Assets :: pageData created!');


    }

    jks.Assets = Assets;

}())