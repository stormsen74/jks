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
    var _setTextures = false;
    var _imgSpriteBack, _imgSpriteFront;
    var _tresholdFilter, _colorMatrixFilter;
    var _o = {saturation: -1, none: 0};
    var tl_1, tl_2;

    var _thumbNavigation;
    var _sideNavigation;
    var _textField;
    var _dragShape;
    var _overlay, _progressBar;
    var _slideObject = {isActive: false, isCreated: false};

    var $imageWidth;
    var $imageHeight;
    var $imageRatio;
    var $transitionTime = 1.5;
    var $imageScaleMode = PIXI.SCALE_MODES.LINEAR;
    var $imageCrossOrigin = false;

    var screenWidth = function () {
        return window.innerWidth
    };
    var screenHeight = function () {
        return window.innerHeight
    };


    function View(config, shader) {
        _scope = this;

        $imageWidth = config.backgroundImageSize.width;
        $imageHeight = config.backgroundImageSize.height;
        $imageRatio = $imageWidth / $imageHeight;

        console.log('init - View');

        this.s = {
            onReady: new signals.Signal(),
            onResize: new signals.Signal(),
            onOrientationChange: new signals.Signal(),
            switchMode: new signals.Signal(),
            onThumbNavigationShow: new signals.Signal()
        };


        this.isMobile = false;


        this.containerPages = new PIXI.Container();
        this.containerNavigation = new PIXI.Container();
        this.containerSlideImages = new PIXI.Container();
        this.containerSlideNavigation = new PIXI.Container();


        /*--------------------------------------------
         ~ DEV-STUFF
         --------------------------------------------*/
        if (config.debug) {
            _stats = new Stats();
            _stats.setMode(0); // 0: fps, 1: ms

            document.body.appendChild(_stats.domElement);

            _stats.domElement.style.position = 'absolute';

            _stats.domElement.style.left = '0px';
            _stats.domElement.style.top = '60px';
        }

        /*--------------------------------------------
         ~ LISTENER
         --------------------------------------------*/

        function initListener() {
            window.addEventListener('resize', onResize);
            window.addEventListener("orientationchange", function () {
                var orientation;
                device.portrait() ? orientation = 'portrait' : orientation = 'landscape';
                //console.log('view :: orientationchange:', orientation)
                _scope.s.onOrientationChange.dispatch(orientation);
                onOrientationChange(orientation);
            }, false);
        };

        /*--------------------------------------------
         ~ RENDERER
         --------------------------------------------*/

        function initRenderer() {
            var _screen = document.getElementById('screen');

            var rendererOptions = {
                transparent: false,
                backgroundColor: jks.Config.getColor('blue'),
                resolution: jks.Config.getDeviceResolution(),
                antialias: false,
                autoResize: false,
                roundPixels: true //performance
            };

            _renderer = new PIXI.autoDetectRenderer(screenWidth(), screenHeight(), rendererOptions);
            _screen.appendChild(_renderer.view);

            _stage = new PIXI.Container();
            _stage.interactive = true;

        }

        /*--------------------------------------------
         ~ DRAG / TRANSITION
         --------------------------------------------*/

        function initDragShape() {
            _dragShape = new PIXI.Graphics();

            _dragShape.beginFill(0x00ff66);
            _dragShape.drawRect(0, 0, 1, 1);
            _dragShape.endFill;

            _dragShape.alpha = 0;
            _dragShape.interactive = true;
            _dragShape.buttonMode = true;
            _dragShape.defaultCursor = 'auto';


            _dragShape
                .on('mousedown', onDragStart).on('touchstart', onDragStart)
                .on('mousemove', onDragMove).on('touchmove', onDragMove)
                .on('mouseup', onDragEnd).on('mouseupoutside', onDragEnd)
                .on('touchend', onDragEnd).on('touchendoutside', onDragEnd)
        }

        var dragData = {
            startX: 0,
            offsetX: 0,
            direction: '',
            isDragging: false,
            normalizedDrag: 0
        };

        function onDragStart(event) {
            dragData.startX = event.data.global.x;
            dragData.isDragging = true;
            dragData.startTransition = false;
            dragData.range = screenWidth() * .7;
            _dragShape.defaultCursor = "none";

            //console.log('_slideObject.currentImage: ', _slideObject.currentImage, dragData.startX);

            _thumbNavigation.setSelectedThumb(_slideObject.currentImage);

        }

        function onDragMove(event) {
            if (dragData.isDragging) {

                dragData.offsetX = event.data.global.x - dragData.startX;
                dragData.offsetX >= 0 ? dragData.direction = 'next' : dragData.direction = 'prev';
                dragData.offsetX = Math.abs(dragData.offsetX)

                if (dragData.offsetX > 0) {
                    if (!_setTextures) setTransitionTextures();
                    dragData.startTransition = true;
                    _thumbNavigation.isLocked = true;
                }

                dragData.normalizedDrag = mathUtils.convertToRange(dragData.offsetX, [0, dragData.range], [0, 1]);
                // console.log(dragData.offsetX, dragData.normalizedDrag, dragData.direction);

                if (_setTextures && dragData.startTransition) {
                    if (dragData.normalizedDrag < 1) {
                        updateTransition(dragData.normalizedDrag);
                    } else {
                        onTransitionEnd()
                        dragData.isDragging = false;
                        dragData.startTransition = false;
                        _setTextures = false;
                        _thumbNavigation.isLocked = false;
                    }
                }

            }
        }

        function onDragEnd(event) {
            dragData.isDragging = false;
            _dragShape.defaultCursor = 'auto';

            //console.log(dragData.normalizedDrag);

            var t = {p: dragData.normalizedDrag};

            if (dragData.startTransition) {

                if (dragData.normalizedDrag <= .5) {
                    _slideObject.currentImage = _slideObject.previousImage;
                    TweenLite.to(t, 1, {
                        p: 0,
                        ease: Sine.easeOut,
                        onUpdate: function () {
                            updateTransition(t.p)
                        },
                        onComplete: function () {
                            _setTextures = false;
                            _thumbNavigation.isLocked = false;
                            dragData.startTransition = false;
                            _tresholdFilter.uniforms.offset.x = 1;
                        }
                    })
                } else {
                    TweenLite.to(t, .5, {
                        p: 1,
                        ease: Circ.easeIn,
                        onUpdate: function () {
                            updateTransition(t.p)
                        },
                        onComplete: function () {
                            _setTextures = false;
                            _thumbNavigation.isLocked = false;
                            dragData.startTransition = false;
                            _tresholdFilter.uniforms.offset.x = 1;
                        }
                    })
                }
            }

        }

        /*--------------------------------------------
         ~ SLIDE - IMAGES
         --------------------------------------------*/

        function initSlideImages() {

            _fsImageContainerBack = new PIXI.Container();
            _fsImageContainerFront = new PIXI.Container();

            _scope.containerSlideImages.addChild(_fsImageContainerBack);
            _scope.containerSlideImages.addChild(_fsImageContainerFront);

            _imgSpriteBack = new PIXI.Sprite();
            _imgSpriteFront = new PIXI.Sprite();

            _fsImageContainerBack.addChild(_imgSpriteBack);
            _fsImageContainerFront.addChild(_imgSpriteFront);

        }

        /*--------------------------------------------
         ~ TRANSITION / FILTERS
         --------------------------------------------*/

        function TresholdFilter(fragmentSource) {

            PIXI.Filter.call(this,
                // vertex shader
                null,
                // fragment shader
                fragmentSource
            );
        }

        TresholdFilter.prototype = Object.create(PIXI.Filter.prototype);
        TresholdFilter.prototype.constructor = TresholdFilter;

        function initTresholdFilter() {

            _tresholdFilter = new TresholdFilter(shader);
            _tresholdFilter.padding = 0;

            initTransition();
        }

        function initTransition() {

            _tresholdFilter.uniforms.offset.x = 1;

            _colorMatrixFilter = new PIXI.filters.ColorMatrixFilter()
            _colorMatrixFilter.saturate(-1);

            _fsImageContainerFront.filters = [_tresholdFilter, _colorMatrixFilter];

            tl_1 = new TimelineLite({paused: true});
            tl_1.add(TweenLite.to(_tresholdFilter.uniforms.offset, $transitionTime, {
                x: 0,
                ease: Linear.easeNone,
                onStart: onTransitionStart
            }))

            tl_2 = new TimelineLite({paused: true, align: 'sequence'});
            tl_2.add(TweenLite.to(_o, .5, {
                delay: 1.0,
                saturation: 0,
                ease: Linear.easeNone,
                onUpdate: filterUpdate,
                onComplete: onTransitionEnd
            }))

        }

        function updateTransition(p) {
            _thumbNavigation.updateDragProgress(p);
            tl_1.progress(p);
            tl_2.progress(p);
        }

        function setTransitionTextures() {

            if (dragData.direction == 'next') {
                _slideObject.previousImage = _slideObject.currentImage;
                _slideObject.currentImage < _slideObject.slideNumImages - 1 ? _slideObject.currentImage++ : _slideObject.currentImage = 0;
            } else if (dragData.direction == 'prev') {
                _slideObject.previousImage = _slideObject.currentImage;
                _slideObject.currentImage > 0 ? _slideObject.currentImage-- : _slideObject.currentImage = _slideObject.slideNumImages - 1;
            }

            //console.log('setTransitionTextures', dragData.direction, _slideObject.currentImage, _slideObject.previousImage)

            _imgSpriteBack.texture = PIXI.Texture.fromImage(_slideObject.configData.pageData[_slideObject.pageID].images[_slideObject.previousImage].src);
            _imgSpriteFront.texture = PIXI.Texture.fromImage(_slideObject.configData.pageData[_slideObject.pageID].images[_slideObject.currentImage].src);

            _setTextures = true;
        }

        function setText(id) {
            //console.log(_slideObject.configData.pageData[_slideObject.pageID].items[id]);
            _textField.setText(_slideObject.configData.pageData[_slideObject.pageID].items[id])
        }

        function transition() {

            _thumbNavigation.isLocked = true;
            if (_sideNavigation)_sideNavigation.isLocked = true;

            _imgSpriteBack.texture = PIXI.Texture.fromImage(_slideObject.configData.pageData[_slideObject.pageID].images[_slideObject.previousImage].src, $imageCrossOrigin, $imageScaleMode);
            _imgSpriteFront.texture = PIXI.Texture.fromImage(_slideObject.configData.pageData[_slideObject.pageID].images[_slideObject.currentImage].src, $imageCrossOrigin, $imageScaleMode);

            TweenLite.to(tl_1, $transitionTime, {progress: 1, ease: Sine.easeOut});
            TweenLite.to(tl_2, $transitionTime, {progress: 1, ease: Circ.easeOut});

        }

        function filterUpdate() {
            _colorMatrixFilter.saturate(_o.saturation);
        }

        function onTransitionStart() {
            //console.log('onTransitionStart');

            if (!dragData.isDragging) {
                _thumbNavigation.showProgress(_slideObject.currentImage, $transitionTime);
            }
        }

        function onTransitionEnd() {
            //console.log('onTransitionEnd');

            _o.saturation = -1;
            _tresholdFilter.uniforms.offset.x = 1;
            _colorMatrixFilter.saturate(-1);

            _imgSpriteBack.texture = PIXI.Texture.fromImage(_slideObject.configData.pageData[_slideObject.pageID].images[_slideObject.currentImage].src);

            _thumbNavigation.unselectThumbs();
            _thumbNavigation.selectThumb(_slideObject.currentImage);

            _thumbNavigation.isLocked = false;
            if (_sideNavigation) _sideNavigation.isLocked = false;

            tl_1.progress(0);
            tl_2.progress(0);


            setText(_slideObject.currentImage)

        }

        /*--------------------------------------------
         ~ SLIDE LOADER
         --------------------------------------------*/

        function initSlideLoader() {
            _overlay = new PIXI.Graphics();

            // _overlay.beginFill(jks.Config.getColor('blue'));
            _overlay.beginFill(jks.Config.getColor('overlay'));
            _overlay.drawRect(0, 0, screenWidth(), screenHeight());
            _overlay.endFill;

            _overlay.alpha = .6;
            _overlay.interactive = true;
            _overlay.visible = false;

            _progressBar = document.getElementById('progressBar');

            updateSlideLoader();

        }

        this.showSlideLoadingProgress = function () {
            _overlay.alpha = 0;
            _overlay.visible = true;
            TweenLite.to(_overlay, .2, {alpha: .5, ease: Sine.easeIn});
            TweenLite.set(_progressBar, {
                opacity: 1,
                width: 0,
                display: 'block'
            })
            updateSlideLoader();
        }

        this.hideSlideLoadingProgress = function () {
            TweenLite.to(_progressBar, .2, {opacity: 0})
            TweenLite.to(_overlay, .2, {
                alpha: 0, ease: Sine.easeOut, onComplete: function () {
                    _overlay.visible = false;
                    _progressBar.style.display = 'none';
                }
            });
        }

        this.updateSlideLoadingProgress = function (progress) {
            document.getElementById('progressBar').style.width = progress * 120 + 'px';
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


        function onOrientationChange(orientation) {
            if (_thumbNavigation.container) {
                _thumbNavigation.onOrientationChange(orientation);
            }
        }

        /*--------------------------------------------
         ~ RESIZE
         --------------------------------------------*/

        var _screenWidth, _screenHeight;
        var _scalePoint = new PIXI.Point(0, 0);

        this.isMobile = false;

        function onResize(e) {

            if (screenWidth() <= jks.Config.mobileSwitchWidth() && !_scope.isMobile || jks.Config.getDeviceType() == 'mobile') {
                _scope.isMobile = true;
                _scope.s.switchMode.dispatch(_scope.isMobile);
            } else if (screenWidth() > jks.Config.mobileSwitchWidth() && _scope.isMobile) {
                _scope.isMobile = false;
                _scope.s.switchMode.dispatch(_scope.isMobile);
            }

            _scope.resizeScreen();
            _scope.s.onResize.dispatch();
        }


        function updateSlideLoader() {
            _overlay.width = screenWidth();
            _overlay.height = screenHeight();

            _progressBar.style.left = screenWidth() * .5 - 60 + 'px';
            _progressBar.style.top = screenHeight() * .5 - 30 + 'px';
        }


        function updateContent() {

            if (_slideObject.isActive) {

                _thumbNavigation.updateView();
                if (_sideNavigation.container != null) _sideNavigation.update();

                _dragShape.width = screenWidth();
                _dragShape.height = screenHeight() - _thumbNavigation.container.getHeight() - 60;

            }

            if (_overlay.visible) {
                updateSlideLoader();
            }


            _textField.updateView();

        }


        initRenderer();
        initSlideImages();
        initTresholdFilter();
        initDragShape();
        initSlideLoader();

        _stage.addChild(_scope.containerSlideImages);
        _stage.addChild(_dragShape);
        _stage.addChild(_scope.containerSlideNavigation);
        _stage.addChild(_scope.containerPages);
        _stage.addChild(_overlay);
        _stage.addChild(_scope.containerNavigation);

        _textField = new jks.TextField();
        _scope.containerSlideImages.addChild(_textField.container);

        initListener();
        renderLoop();


        TweenLite.delayedCall(.5, function () {
            onResize();
            _scope.s.onReady.dispatch();
        });


        /*--------------------------------------------
         ~ PUBLIC METHODS
         --------------------------------------------*/

        /*--------------------------------------------
         ~ CORE RESIZE
         --------------------------------------------*/

        this.resizeScreen = function () {

            updateContent();

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

        this.initSlide = function (_config, _pageID) {

            //console.log('initSlide:', _slideObject);

            if (_slideObject.isCreated) {
                _imgSpriteBack.texture = PIXI.Texture.fromImage(_slideObject.configData.pageData[_slideObject.pageID].images[_slideObject.currentImage].src, $imageCrossOrigin, $imageScaleMode);
            }

            _slideObject.previousImage = 0;
            _slideObject.currentImage = 0;
            _slideObject.slideNumImages = _config.pageData[_pageID].images.length;
            _slideObject.pageID = _pageID;
            _slideObject.configData = _config;
            _slideObject.isActive = true;


            if (_slideObject.isCreated) {
                _imgSpriteFront.texture = PIXI.Texture.fromImage(_slideObject.configData.pageData[_pageID].images[_slideObject.currentImage].src);
                transitionSwitch();
            } else {
                _imgSpriteBack.texture = PIXI.Texture.fromImage(_slideObject.configData.pageData[_pageID].images[_slideObject.currentImage].src);
            }
            _slideObject.isCreated = true;


            _textField.setCategory(_slideObject.configData.pageData[_pageID].categoryText);
            _textField.show();
            setText(_slideObject.currentImage)

        }

        function transitionSwitch() {

            _thumbNavigation.isLocked = true;
            if (_sideNavigation)_sideNavigation.isLocked = true;

            _scope.resizeScreen();
            TweenLite.to(tl_1, $transitionTime, {progress: 1, ease: Sine.easeOut});
            TweenLite.to(tl_2, $transitionTime, {progress: 1, ease: Circ.easeOut});

        }

        /*--------------------------------------------
         ~ THUMB NAVIGATION
         --------------------------------------------*/

        var _thumbNavigation = {};
        _thumbNavigation.container = null;

        this.initThumbNavigation = function () {
            //console.log('initThumbNavigation:', _thumbNavigation.container);

            if (_thumbNavigation.container) {
                console.log('destroy thumb')
                //_thumbNavigation.container.destroy();
                _thumbNavigation.s.onClickThumb.remove(onThumbClick);
                //TODO - listener!?
                _thumbNavigation.container.removeChildren();
                _scope.containerSlideNavigation.removeChild(_thumbNavigation.container);
                _thumbNavigation.container = null;
                _thumbNavigation = null;
            }

            _thumbNavigation = new jks.ThumbNavigation($imageRatio);
            _thumbNavigation.s.onClickThumb.add(onThumbClick);
            _thumbNavigation.s.onThumbNavigationShow.add(onThumbNavigationShow);
            _scope.containerSlideNavigation.addChild(_thumbNavigation.container);
            _thumbNavigation.init(_slideObject);

            function onThumbClick(id) {
                //console.log('onThumbClick', id)
                if (id != _slideObject.currentImage) {
                    _scope.slideTo(id);
                }
            }
        }

        function onThumbNavigationShow(show) {
            _scope.s.onThumbNavigationShow.dispatch(show, _thumbNavigation.container.getHeight());
        }

        this.thumbNavToggle = function (activated) {
            activated ? _thumbNavigation.show() : _thumbNavigation.hide();
        }

        /*--------------------------------------------
         ~ SIDE NAVIGATION
         --------------------------------------------*/

        var _sideNavigation = {};
        _sideNavigation.container = null;

        this.initSideNavigation = function () {
            //console.log('jks.SideNavigation')


            if (_sideNavigation.container) {
                //console.log('destroy side')

                _sideNavigation.s.onTapNext.remove(onTapNext);
                _sideNavigation.s.onTapPrev.remove(onTapPrev);
                //_thumbNavigation.container.destroy();
                _scope.containerSlideNavigation.removeChild(_sideNavigation.container);
                _sideNavigation.container = null;
                _sideNavigation = null;
            }

            _sideNavigation = new jks.SideNavigation();
            //_sideNavigation.init();
            _scope.containerSlideNavigation.addChild(_sideNavigation.container);


            _sideNavigation.s.onTapNext.add(onTapNext);
            _sideNavigation.s.onTapPrev.add(onTapPrev);

            function onTapNext() {
                _scope.slideNext();
            }

            function onTapPrev() {
                _scope.slidePrev();
            }
        }

        this.slideNext = function () {
            _slideObject.previousImage = _slideObject.currentImage;
            _slideObject.currentImage < _slideObject.slideNumImages - 1 ? _slideObject.currentImage++ : _slideObject.currentImage = 0;
            transition();
            console.log('slideNext ', _slideObject.currentImage);
        };

        this.slidePrev = function () {
            _slideObject.previousImage = _slideObject.currentImage;
            _slideObject.currentImage > 0 ? _slideObject.currentImage-- : _slideObject.currentImage = _slideObject.slideNumImages - 1;
            transition();
            console.log('slidePrev ', _slideObject.currentImage);
        };

        this.slideTo = function (id) {
            _slideObject.previousImage = _slideObject.currentImage;
            _slideObject.currentImage = id;
            transition();
            console.log('slideTo ', _slideObject.currentImage);
        };


    }

    jks.View = View;

    jks.View.isMobile = function () {
        return _scope.isMobile;
    }

    jks.View.getScreenWidth = function () {
        return screenWidth();
    }

    jks.View.getScreenHeight = function () {
        return screenHeight();
    }

    jks.View.forceResize = function () {
        _scope.resizeScreen()
    }

    jks.View.showOverlay = function () {
        TweenLite.killTweensOf(_overlay);
        //_overlay.alpha = 0;
        _overlay.visible = true;
        _overlay.width = screenWidth();
        _overlay.height = screenHeight();
        _textField.hide();
        TweenLite.to(_overlay, .3, {alpha: .6, ease: Sine.easeOut})
    }

    jks.View.isOverlay = function () {
        return _overlay.visible;
    }

    jks.View.hideOverlay = function () {
        if (jks.Navigation.getCurrentSelectedPage() == 'vita' && jks.Config.getDeviceType() == 'nobile') {
            return;
        }
        //console.log('hide overlay')
        TweenLite.to(_overlay, .3, {
            alpha: 0, ease: Sine.easeIn, onComplete: function () {
                _overlay.visible = false;
                _textField.show();
            }
        })
    }


}());