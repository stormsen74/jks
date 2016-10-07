/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _scope;
    var _imgRatio;
    var $ThumbOffsetX = 10;
    var $OffsetBottom = 30;
    var _imgHeight = 23;


    function ThumbNavigation(imageRatio) {
        _scope = this;

        this.s = {
            onClickThumb: new signals.Signal()
        };

        this.isLocked = false;
        this.thumbs = [];
        this.selectedThumb = null;

        this.dragShape = new PIXI.Graphics();
        this.dragSlideEnabled = false;


        _imgRatio = imageRatio;


        var _compWidth = 0;

        this.container = new PIXI.Container();


        this.container.getWidth = function () {
            return _compWidth;
        };
        this.container.getHeight = function () {
            return _imgHeight;
        };

        this.onDispatchClick = function (id) {
            console.log('onDispatchClick')
            if (!_scope.isLocked) {
                _scope.s.onClickThumb.dispatch(id);
            }
        }

        this.selectThumb = function (id) {
            _scope.thumbs[id].select();
        }

        this.unselectThumb = function (id) {
            _scope.thumbs[id].unselect();
        }

        this.unselectThumbs = function (id) {
            for (var i = 0; i < _scope.thumbs.length; i++) {
                _scope.thumbs[i].unselect();
            }
        }

        this.showProgress = function (id, t) {
            console.log('dp:', +id + '-' + t)
            _scope.thumbs[id].showProgress(t);
        }

        this.setSelectedThumb = function (id) {
            this.selectedThumb = _scope.thumbs[id];
        };

        this.updateDragProgress = function (p) {
            this.selectedThumb.updateDragProgress(p);
            //_scope.thumbs[id].updateDragProgress(p);
        };


        /*--------------------------------------------
         ~ INIT /
         --------------------------------------------*/
        var thumbScaleMode = PIXI.SCALE_MODES.NEAREST;
        var thumbCrossOrigin = false;
        var actDelay = .17;

        this.init = function (slideObject) {
            console.log('init - ThumbNavigation');
            //console.log(slideObject.slideNumImages);

            _compWidth = 0;

            // hide container!
            _scope.container.visible = false;

            //if (jks.Config.getDeviceType() == "mobile" || jks.Config.getDeviceType() == "tablet") {
            if (jks.Config.getDeviceType() == "mobile") {
                $ThumbOffsetX = 0;
                $OffsetBottom = 0;
            }

            for (var i = 0; i < slideObject.slideNumImages; i++) {
                var thumb = new jks.Thumb(i, _imgRatio, PIXI.Texture.fromImage(slideObject.configData.pageData[slideObject.pageID].images[i].src, thumbCrossOrigin, thumbScaleMode));
                _imgHeight = thumb.thumbSize.height;
                _compWidth += thumb.thumbSize.width + $ThumbOffsetX;
                thumb.s.onTapDown.add(onTapDown);
                thumb.s.onTapUp.add(onTapUp);

                function onTapUp(id) {

                    // TODO disable on MoveOut
                    console.log('onTapUp')

                    TweenLite.killDelayedCallsTo(enableDragSlide)

                    if (!_scope.isLocked) {
                        _scope.s.onClickThumb.dispatch(id);
                    }
                }

                function onTapDown(event) {
                    TweenLite.delayedCall(actDelay, enableDragSlide, [event])
                }

                function enableDragSlide(event) {
                    _scope.activateSlideDrag(event);
                }

                thumb.container.x = i * (thumb.thumbSize.width + $ThumbOffsetX);

                this.container.addChild(thumb.container);
                this.thumbs.push(thumb);
            }

            _compWidth -= $ThumbOffsetX;

            _scope.thumbs[0].select();

            initDrag(thumb);

            // show container
            TweenLite.delayedCall(actDelay, function () {
                _scope.container.visible = true;
            })

        };

        /*--------------------------------------------
         ~ DRAGGING
         --------------------------------------------*/


        function initDrag(_lastThumb) {

            _scope.tracker = VelocityTracker.track(_scope.container, "x,y");
            _scope.shapeWidth = _compWidth;

            _scope.dragShape.beginFill(0x408080);
            _scope.dragShape.drawRect(0, 0, _scope.shapeWidth, _lastThumb.thumbSize.height);
            _scope.dragShape.alpha = .2;
            _scope.dragShape.endFill();

            _scope.dragShape.interactive = false;
            _scope.dragShape.visible = false;

            _scope.container.addChild(_scope.dragShape)

            _scope.dragShape
            //.on('mousedown', onDragStart).on('touchstart', onDragStart)
                .on('mousemove', onDragMove).on('touchmove', onDragMove)
                .on('mouseup', onDragEnd).on('mouseupoutside', onDragEnd)
                .on('touchend', onDragEnd).on('touchendoutside', onDragEnd);


            _scope.onOrientationChange();
        }


        this.activateSlideDrag = function (event) {
            _scope.dragSlideEnabled = true;
            _scope.dragShape.visible = true;
            _scope.dragShape.interactive = true;
            onDragStart(event)
        }


        this.deactivateSlideDrag = function () {
            _scope.dragShape.visible = false;
            _scope.dragShape.interactive = false;
            dragData.isDragging = false;
        }


        var dragData = {
            startX: 0,
            offsetX: 0,
            isDragging: false,
            normalizedDrag: 0
        };

        function onDragStart(event) {
            // console.log('onDragStart', dragData.startX);
            TweenLite.killTweensOf(_scope.container);
            dragData.startX = event.data.global.x - _scope.container.x;
            dragData.isDragging = true;
            //_dragShape.defaultCursor = "none";

        }

        function onDragMove(e) {
            if (dragData.isDragging) {
                // console.log('onDragMove', _scope.container.y, e.data.global.y)
                _scope.container.x = e.data.global.x - dragData.startX;

                if (
                    e.data.global.x < 0 ||
                    e.data.global.x > jks.View.getScreenWidth() ||
                    e.data.global.y < _scope.container.y ||
                    e.data.global.y > _scope.container.y + _scope.dragShape.height
                ) {
                    onDragEnd();
                    return;
                }
            }
        }


        function isCentered() {
            //console.log('c', _scope.shapeWidth, jks.View.getScreenWidth())
            return _scope.shapeWidth <= jks.View.getScreenWidth() ? true : false;
        }

        function onDragEnd(e) {

            // console.log('onDragEnd', dragData.isDragging)

            var vel = _scope.tracker.getVelocity("x");

            // console.log('>', isCentered(), vel);


            var throwCentered = {
                x: {
                    velocity: vel,
                    max: jks.View.getScreenWidth() * .5 - _scope.shapeWidth * .5,
                    min: jks.View.getScreenWidth() * .5 - _scope.shapeWidth * .5,
                }
            }

            var throwDefault = {
                x: {
                    velocity: vel,
                    max: 0,
                    min: -_scope.shapeWidth + jks.View.getScreenWidth()
                }
            }

            if (isCentered()) {
                TweenLite.to(_scope.container, .5, {
                    throwProps: throwCentered,
                    onComplete: null,
                    ease: Power2.easeOut
                });
            } else {
                if (vel != 0) {
                    TweenLite.to(_scope.container, .5, {
                        throwProps: throwDefault,
                        onComplete: null,
                        ease: Power2.easeOut
                    });
                } else {
                    if (!dragData.isDragging) {
                        TweenLite.to(_scope.container, .5, {
                            x: 0,
                            onComplete: null,
                            ease: Power2.easeOut
                        });
                    }
                }


            }

            _scope.deactivateSlideDrag();

            // TweenLite.to(_scope.container, .5, {
            //     throwProps: isCentered() ? throwCentered : throwDefault,
            //     onComplete: null,
            //     ease: Power2.easeOut
            // });

            //ThrowPropsPlugin.to(_scope.container, {
            //    throwProps: {
            //        x: {
            //            velocity: _scope.tracker.getVelocity("x"),
            //            max: 0,
            //            min: -_scope.shapeWidth + jks.View.getScreenWidth(),
            //            resistance: 150
            //            // https://greensock.com/docs/#/HTML5/GSAP/Plugins/ThrowPropsPlugin/to/
            //        }
            //    },
            //    ease: Power3.easeOut
            //});

            // console.log('onDragEnd');

        }

        this.onOrientationChange = function (orientation) {
            console.log('onOrientationChange', orientation)
            TweenLite.delayedCall(.2, onDragEnd)
        }


        this.updateView = function () {


            if (jks.Config.getDeviceType() == 'desktop') {
                // _scope.container.x = jks.View.getScreenWidth() * .5 - _scope.container.getWidth() * .5;
                TweenLite.killDelayedCallsTo(onDragEnd);
                TweenLite.delayedCall(.2, onDragEnd);
            }

            _scope.container.y = jks.View.getScreenHeight() - _scope.container.getHeight() - $OffsetBottom;
        }


    }


    jks.ThumbNavigation = ThumbNavigation;

    jks.ThumbNavigation.getThumbByID = function (id) {
        return (_scope.thumbs[id]);
    }

    jks.ThumbNavigation.isLocked = function () {
        return (_scope.isLocked);
    }

}());


