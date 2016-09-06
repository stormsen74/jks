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
        var _dragShape;

        var _slideObject = {};

        var $imageWidth = 1200;
        var $imageHeight = 800;
        var $imageRatio = $imageWidth / $imageHeight;

        var $transitionTime = 1.5;

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


            function initDragShape() {
                _dragShape = new PIXI.Graphics();

                _dragShape.beginFill(0x00ff66);
                _dragShape.drawRect(0, 0, screenWidth(), screenHeight());
                _dragShape.endFill;

                _dragShape.alpha = .01;
                _dragShape.interactive = true;
                _dragShape.buttonMode = true;
                _dragShape.defaultCursor = 'auto';
                _stage.addChild(_dragShape);


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
                dragData.range = screenWidth() * .7;

                _dragShape.defaultCursor = "ew-resize";

                console.log(dragData.startX)

                console.log('_slideObject.currentImage: ', _slideObject.currentImage)
                _thumbNavigation.setSelectedThumb(_slideObject.currentImage);


            }


            function onDragMove(event) {
                if (dragData.isDragging) {

                    dragData.offsetX = event.data.global.x - dragData.startX;
                    dragData.offsetX >= 0 ? dragData.direction = 'next' : dragData.direction = 'prev';
                    dragData.offsetX = Math.abs(dragData.offsetX)

                    if (dragData.offsetX > 0 && !_setTextures) {
                        setTransitionTextures();
                    }

                    dragData.normalizedDrag = mathUtils.convertToRange(dragData.offsetX, [0, dragData.range], [0, 1]);
                    // console.log(dragData.offsetX, dragData.normalizedDrag, dragData.direction);

                    if (_setTextures) {
                        updateTransition(dragData.normalizedDrag);
                        //_thumbNavigation.updateDragProgress(dragData.normalizedDrag);
                    }

                }
            }

            function onDragEnd(event) {
                dragData.isDragging = false;
                _dragShape.defaultCursor = 'auto';

                //console.log(dragData.normalizedDrag);

                var t = {p: dragData.normalizedDrag}
                if (dragData.normalizedDrag <= .5) {
                    TweenLite.to(t, 1, {
                        p: 0,
                        ease: Sine.easeOut,
                        onUpdate: function () {
                            updateTransition(t.p)
                        },
                        onComplete: function () {
                            // TODO RESET
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
                        }
                    })
                }
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

                tl_1 = new TimelineLite({paused: true});
                tl_1.add(TweenLite.to(_tresholdFilter.offset, $transitionTime, {
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
                // console.log('updateTransition', p)
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

                console.log('setTransitionTextures', _slideObject.currentImage, _slideObject.previousImage)

                _imgSpriteBack.texture = PIXI.Texture.fromImage(_slideObject.configData.pageData[_slideObject.pageID].images[_slideObject.previousImage].src);
                _imgSpriteFront.texture = PIXI.Texture.fromImage(_slideObject.configData.pageData[_slideObject.pageID].images[_slideObject.currentImage].src);

                _setTextures = true;
            }

            function transition() {

                _imgSpriteBack.texture = PIXI.Texture.fromImage(_slideObject.configData.pageData[_slideObject.pageID].images[_slideObject.previousImage].src);
                _imgSpriteFront.texture = PIXI.Texture.fromImage(_slideObject.configData.pageData[_slideObject.pageID].images[_slideObject.currentImage].src);

                TweenLite.to(tl_1, $transitionTime, {progress: 1, ease: Sine.easeOut});
                TweenLite.to(tl_2, $transitionTime, {progress: 1, ease: Circ.easeOut});

            }

            function filterUpdate() {
                _colorMatrixFilter.saturate(_o.saturation);
            }

            function onTransitionStart() {
                console.log('onTransitionStart');

                if (!dragData.isDragging) {
                    _thumbNavigation.showProgress(_slideObject.currentImage, $transitionTime);
                }
            }

            function onTransitionEnd() {
                console.log('onTransitionEnd');

                _o.saturation = -1;
                _tresholdFilter.offset.x = 1;
                _colorMatrixFilter.saturate(-1);

                _imgSpriteBack.texture = PIXI.Texture.fromImage(_slideObject.configData.pageData[_slideObject.pageID].images[_slideObject.currentImage].src);

                _thumbNavigation.unselectThumb(_slideObject.previousImage)
                // TODO - unselect all ...
                _thumbNavigation.selectThumb(_slideObject.currentImage)

                tl_1.progress(0);
                tl_2.progress(0);

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
                _scope.resizeScreen();
            }


            function updateContent() {
                _thumbNavigation.container.x = screenWidth() * .5 - _thumbNavigation.container.getWidth() * .5;
                _thumbNavigation.container.y = screenHeight() - _thumbNavigation.container.getHeight() - 30;

                _dragShape.width = screenWidth();
                _dragShape.height = screenHeight() - _thumbNavigation.container.getHeight() - 60;
            }

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


            initDevStuff();
            initRenderer();
            initFSImages();
            initDragShape();
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

    }

    ()
);