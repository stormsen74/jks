/**
 * Created by STORMSEN on 12.08.2016.
 */


this.jks = this.jks || {};


( function () {


    var _scope;
    var _config;
    var _dataHandler;
    var _router;
    var _navigation;
    var _controller;
    var _view;


    function Core() {
        _scope = this;

        this.setOrder = function () {

        };


        function update() {

        }


        function init() {

            console.log('init => core');

            var _jsonLoader = new createjs.JSONLoader("assets/js/jks/content.json");
            _jsonLoader.addEventListener("complete", onJSONLoaded);
            _jsonLoader.load();

            function onJSONLoaded() {


                _config = new jks.Config(_jsonLoader.getResult()[0]);
                _jsonLoader.destroy();

                _dataHandler = new jks.DataHandler(_config);
                _dataHandler.s.onDataHandlerReady.add(onDataHandlerReady);

                function onDataHandlerReady() {

                    _router = new jks.Router();
                    _navigation = new jks.Navigation();
                    _view = new jks.View();

                    _controller = new jks.Controller(_config, _dataHandler, _router, _navigation, _view);
                }


            }

        }

        init();
    }

    jks.Core = Core;

}());