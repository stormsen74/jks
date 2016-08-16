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
    var _stats;

    var _fsImageContainerBack, _fsImageContainerFront;
    var _renderTexture;

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


        /*--------------------------------------------
         ~ DEV-STUFF
         --------------------------------------------*/

        function initDevStuff() {
            _stats = new Stats();
            _stats.setMode(0); // 0: fps, 1: ms

            // Align top-left
            _stats.domElement.style.position = 'absolute';
            _stats.domElement.style.left = '0px';
            _stats.domElement.style.top = '0px';

            document.body.appendChild(_stats.domElement);
        }


        /*--------------------------------------------
         ~ LISTENER
         --------------------------------------------*/

        function initListener() {
            window.addEventListener('resize', onResize);
        };

        TweenLite.delayedCall(.333, onResize);


        /*--------------------------------------------
         ~ RENDERER
         --------------------------------------------*/

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


        function initFSImages() {
            _fsImageContainerBack = new PIXI.Container();
            _fsImageContainerFront = new PIXI.Container();
            _stage.addChild(_fsImageContainerBack);
            _stage.addChild(_fsImageContainerFront);

            _renderTexture = new PIXI.RenderTexture(_renderer, 800, 600);

        }

        /*--------------------------------------------
         ~ RENDER LOOP
         --------------------------------------------*/

        function renderLoop() {
            requestAnimationFrame(renderLoop);

            _renderer.render(_stage);

            if (_stats) {
                _stats.update();
            }

        }

        /*--------------------------------------------
         ~ RESIZE
         --------------------------------------------*/

        var _screenWidth, _screenHeight;
        var _scalePoint = new PIXI.Point(0, 0);

        function onResize(e) {

            _screenWidth = screenWidth();
            _screenHeight = screenHeight();

            _renderer.view.style.width = _screenWidth + "px";
            _renderer.view.style.height = _screenHeight + "px";
            _renderer.resize(_screenWidth, _screenHeight);

            _scalePoint.set(_screenWidth / $imageWidth);
            _fsImageContainerBack.children[0].scale = _scalePoint;

            if (_fsImageContainerBack.children[0].height >= _screenHeight) {
                _scalePoint.set(_screenWidth / $imageWidth);
                _fsImageContainerBack.children[0].scale = _scalePoint;
                _fsImageContainerBack.children[0].x = 0;
                _fsImageContainerBack.children[0].y = -(_fsImageContainerBack.children[0].height - _screenHeight) * .5;
            } else if (_fsImageContainerBack.height <= _screenHeight) {
                _scalePoint.set(_screenHeight / $imageHeight);
                _fsImageContainerBack.children[0].scale = _scalePoint;
                _fsImageContainerBack.children[0].y = 0;
                _fsImageContainerBack.children[0].x = (_screenWidth - _fsImageContainerBack.children[0].width) * .5;
            }

            _fsImageContainerFront.children[0].x = _fsImageContainerBack.children[0].x;
            _fsImageContainerFront.children[0].y = _fsImageContainerBack.children[0].y;
            _fsImageContainerFront.children[0].scale = _fsImageContainerBack.children[0].scale;

        }


        initDevStuff();
        initRenderer();
        initFSImages();

        initListener();
        renderLoop();


        this.addFSImage = function (_config, _id) {
            var sprite_1 = new PIXI.Sprite(PIXI.Texture.fromImage(_config.pageData[_id].images[0].src));
            var sprite_2 = new PIXI.Sprite(PIXI.Texture.fromImage(_config.pageData[_id].images[1].src));
            _fsImageContainerBack.addChild(sprite_1);
            _fsImageContainerFront.addChild(sprite_2);
            // _fsImageContainerFront.alpha = .5;

            // var filter = new OffsetFilter();
            // filter.offset = {
            //     x: 50,
            //     y: 100
            // };
            // _fsImageContainerFront.filters = [filter];
            // console.log(filter)
            //
            // TweenLite.to(filter.offset, 1, {x: 200})

            var filter = new TresholdFilter();
            filter.offset.x = 0;
            _fsImageContainerFront.filters = [filter];
            //console.log(filter)





            TweenLite.to(filter.offset, 2, {delay: 2, x: 1})
        }


    }

    jks.View = View;

}());