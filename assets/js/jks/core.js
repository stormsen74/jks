/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {


    var _scope;
    var _config;
    var _dataHandler;
    var _router;


    function Core() {
        _scope = this;

        this.setOrder = function () {

        };


        function update() {

        }


        function setMode(debug) {


            /*--------------------------------------------
             ~ DEV-STUFF
             --------------------------------------------*/
            var stats = new Stats();
            stats.setMode(0); // 0: fps, 1: ms

            // Align top-left
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';

            document.body.appendChild(stats.domElement);


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
                _router = new jks.Router();
                //_view
                //_navi
                //_controller


            }

        }

        init();
    }

    jks.Core = Core;

}());