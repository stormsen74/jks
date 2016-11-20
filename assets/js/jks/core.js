/**
 * Created by STORMSEN on 12.08.2016.
 */


this.jks = this.jks || {};


( function () {


    var _scope;
    var _config;
    var _dataHandler;
    var _controller;

    var isRelease;


    function Core(_release) {

        _scope = this;

        isRelease = _release;

        function init() {

            console.log('init => core', _release);

            var _jsonLoader;

            isRelease ? _jsonLoader = new createjs.JSONLoader("assets/js/bin/content.json") : _jsonLoader = new createjs.JSONLoader("assets/js/jks/content.json");

            _jsonLoader.addEventListener("complete", onJSONLoaded);
            _jsonLoader.load();

            function onJSONLoaded() {

                _config = new jks.Config(_jsonLoader.getResult()[0]);
                _jsonLoader.destroy();

                _dataHandler = new jks.DataHandler(_config);
                _dataHandler.s.onDataHandlerReady.add(onDataHandlerReady);

                function onDataHandlerReady() {
                    _controller = new jks.Controller(_config, _dataHandler);
                }


            }

        }

        init();
    }

    jks.Core = Core;


    jks.Core.releaseMode = function () {
        return isRelease;
    }


}());