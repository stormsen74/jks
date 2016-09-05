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
    var _imgSpriteBack, _imgSpriteFront;
    var _tresholdFilter, _colorMatrixFilter;
    var _o = {saturation: -1};

    var _thumbNavigation;

    var _slideObject = {};

    var $imageWidth = 1200;
    var $imageHeight = 800;
    var $imageRatio = $imageWidth / $imageHeight;

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

        /*--------------------------------------------
         ~ FS-IMAGE
         --------------------------------------------*/

        function initFSImages() {

            _fsImageContainerBack = new PIXI.Container();
            _fsImageContainerFront = new PIXI.Container();

            _stage.addChild(_fsImageContainerBack);
            _stage.addChild(_fsImageContainerFront);

            _imgSpriteBack = new PIXI.Sprite();
            _imgSpriteFront = new PIXI.Sprite();

            _fsImageContainerBack.addChild(_imgSpriteBack);
            _fsImageContainerFront.addChild(_imgSpriteFront);

        }

        /*--------------------------------------------
         ~ TRANSITION / FILTERS
         --------------------------------------------*/

        function initTransition() {

            _tresholdFilter = new TresholdFilter();
            _tresholdFilter.offset.x = 1;

            _colorMatrixFilter = new PIXI.filters.ColorMatrixFilter()
            _colorMatrixFilter.saturate(-1);

            _fsImageContainerFront.filters = [_tresholdFilter, _colorMatrixFilter];

        }


        function transition() {

            _imgSpriteBack.texture = PIXI.Texture.fromImage(_slideObject.configData.pageData[_slideObject.pageID].images[_slideObject.previousImage].src);
            _imgSpriteFront.texture = PIXI.Texture.fromImage(_slideObject.configData.pageData[_slideObject.pageID].images[_slideObject.currentImage].src);

            _o.saturation = -1


            TweenLite.to(_tresholdFilter.offset, 1.5, {x: 0, ease: Sine.easeOut});
            TweenLite.to(_o, 1, {
                delay: .5,
                saturation: 0,
                ease: Circ.easeOut,
                onUpdate: filterUpdate,
                onComplete: onTransitionEnd
            });

            function filterUpdate() {
                _colorMatrixFilter.saturate(_o.saturation);
            }

            function onTransitionEnd() {
                _tresholdFilter.offset.x = 1;
                _colorMatrixFilter.saturate(-1);
                _imgSpriteBack.texture = PIXI.Texture.fromImage(_slideObject.configData.pageData[_slideObject.pageID].images[_slideObject.currentImage].src);

                _thumbNavigation.unselectThumb(_slideObject.previousImage)
                _thumbNavigation.selectThumb(_slideObject.currentImage)

            }
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
            updateContent();
            _scope.resizeScreen();
        }


        function updateContent() {
            _thumbNavigation.container.x = screenWidth() * .5 - _thumbNavigation.container.getWidth() * .5;
            _thumbNavigation.container.y = screenHeight() - _thumbNavigation.container.getHeight() - 30;
        }

        this.resizeScreen = function () {

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

        };


        initDevStuff();
        initRenderer();
        initFSImages();
        initTransition();

        initListener();
        renderLoop();


        /*--------------------------------------------
         ~ PUBLIC METHODS
         --------------------------------------------*/


        this.initSlide = function (_config, _pageID) {

            console.log('initSlide:', _slideObject);

            _slideObject.previousImage = 0;
            _slideObject.currentImage = 0;
            _slideObject.slideNumImages = _config.pageData[_pageID].images.length;
            _slideObject.pageID = _pageID;
            _slideObject.configData = _config;

            _imgSpriteBack.texture = PIXI.Texture.fromImage(_slideObject.configData.pageData[_pageID].images[_slideObject.currentImage].src);


            //TweenLite.delayedCall(2.6, _scope.slideNext);


            /*--------------------------------------------
             ~ THUMB NAVIGATION
             --------------------------------------------*/

            _thumbNavigation = new jks.ThumbNavigation($imageRatio);
            _thumbNavigation.s.onClickThumb.add(onThumbClick)
            _stage.addChild(_thumbNavigation.container);
            _thumbNavigation.init(_slideObject);

            function onThumbClick(id) {
                if (id != _slideObject.currentImage) {
                    _scope.slideTo(id);

                }
            }


        }


        this.slideNext = function () {

            _slideObject.previousImage = _slideObject.currentImage;
            _slideObject.currentImage < _slideObject.slideNumImages - 1 ? _slideObject.currentImage++ : _slideObject.currentImage = 0;

            transition();

            console.log('slideNext ', _slideObject.currentImage);
        };

        this.slideTo = function (id) {

            _slideObject.previousImage = _slideObject.currentImage;
            _slideObject.currentImage = id;



            transition();

            console.log('slideTo ', _slideObject.currentImage);
        };


        //function setSpriteTextures(_id_f, _id_b) {
        //    sprite_1.setTexture(PIXI.Texture.fromImage(_config.pageData[_id].images[1].src));
        //}


    }

    jks.View = View;

}());