/**
 * Created by STORMSEN on 12.08.2016.
 */

/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _scope;
    var _renderer;
    var _stage;

    var $imageWidth = 1200;
    var $imageHeight = 750;

    var screenWidth = function () {
        return window.innerWidth
    };
    var screenHeight = function () {
        return window.innerHeight
    };


    function View() {
        _scope = this;

        console.log('init - View');


        function initRenderer() {
            var _screen = document.getElementById('screen');

            var rendererOptions = {
                antialiasing: false,
                transparent: false,
                backgroundColor: 0x0a5a15,
                autoResize: false
            };

            _renderer = new PIXI.autoDetectRenderer(screenWidth(), screenHeight(), rendererOptions);
            _screen.appendChild(_renderer.view);

            _stage = new PIXI.Container();
            _stage.interactive = true;
        }


        function renderLoop() {
            requestAnimationFrame(renderLoop);

            // render the container
            _renderer.render(_stage);

            // stats.update();

        }


        initRenderer();
        renderLoop();


        this.add = function (_img) {
            var spr = new PIXI.Sprite(PIXI.Texture.fromImage(_img));
            _stage.addChild(spr);
        }


    }

    jks.View = View;

}());