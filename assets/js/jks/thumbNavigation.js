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
        this.isMobile = jks.Core.isMobile();
        this.thumbs = [];
        this.selectedThumb = null;

        this.dragShape = new PIXI.Graphics();


        _imgRatio = imageRatio;


        var _compWidth = 0;
        this.container = new PIXI.Container();


        this.container.getWidth = function () {
            return _compWidth;
        }
        this.container.getHeight = function () {
            return _imgHeight;
        }


        this.onClickThumb = function (e) {
            console.log('click')
            if (!_scope.isLocked) {
                _scope.s.onClickThumb.dispatch(e.target.ID);
            }
        }

        this.onHoverThumb = function (e) {
            if (!_scope.thumbs[e.target.ID].selected) _scope.thumbs[e.target.ID].onHover();
        }

        this.onHoverOutThumb = function (e) {
            if (!_scope.thumbs[e.target.ID].selected) _scope.thumbs[e.target.ID].onHoverOut();
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
        }

        this.updateDragProgress = function (p) {
            this.selectedThumb.updateDragProgress(p);
            //_scope.thumbs[id].updateDragProgress(p);
        }


        function onTapStart() {
            console.log('onTapStart');
        }

        function onTapEnd() {
            console.log('onTapEnd');
        }


        this.init = function (slideObject) {
            console.log('init - ThumbNavigation', jks.Core.isMobile());
            //console.log(slideObject.slideNumImages);

            if (jks.Core.isMobile()) {
                $ThumbOffsetX = 0;
                $OffsetBottom = 0;
            }


            for (var i = 0; i < slideObject.slideNumImages; i++) {
                var thumb = new jks.Thumb(i, _imgRatio, PIXI.Texture.fromImage(slideObject.configData.pageData[slideObject.pageID].images[i].src));
                _imgHeight = thumb.thumbSize.height;
                _compWidth += thumb.thumbSize.width + $ThumbOffsetX;

                thumb.mask.on('click', this.onClickThumb);
                thumb.mask.on('mousedown', this.onClickThumb).on('touchstart', this.onClickThumb)
                thumb.mask.on('mouseover', this.onHoverThumb);
                thumb.mask.on('mouseout', this.onHoverOutThumb);

                 //thumb.mask
                    // .on('mousedown', onTapStart).on('touchstart', onTapStart)
                    // .on('mousemove', onDragMove).on('touchmove', onDragMove)
                    // .on('mouseup', onTapEnd).on('mouseupoutside', onTapEnd)
                    // .on('touchend', onTapEnd).on('touchendoutside', onTapEnd)


                function onTapStart() {
                    console.log('onTapStart')
                }

                function onTapEnd() {
                    _scope.activateSlideDrag();
                    console.log('onTapEnd')
                }

                thumb.container.x = i * (thumb.thumbSize.width + $ThumbOffsetX);

                this.container.addChild(thumb.container);
                this.thumbs.push(thumb);
            }

            _compWidth -= $ThumbOffsetX;

            _scope.thumbs[0].select();


            initDrag(thumb, slideObject.slideNumImages);


        }


        function initDrag(_lastThumb, _numThumbs) {

            console.log(_lastThumb.thumbSize.width);

            _scope.tracker = VelocityTracker.track(_scope.container, "x,y");

            _scope.shapeWidth = _lastThumb.thumbSize.width * _numThumbs;


            _scope.dragShape.beginFill(0x55ff00);
            _scope.dragShape.drawRect(0, 0, _scope.shapeWidth, _lastThumb.thumbSize.height);
            _scope.dragShape.alpha = .0;
            _scope.dragShape.endFill();

            _scope.dragShape.buttonMode = true;

            _scope.container.addChild(_scope.dragShape)

            _scope.dragShape
                .on('mousedown', onDragStart).on('touchstart', onDragStart)
                .on('mousemove', onDragMove).on('touchmove', onDragMove)
                .on('mouseup', onDragEnd).on('mouseupoutside', onDragEnd)
                .on('touchend', onDragEnd).on('touchendoutside', onDragEnd)

        }




        this.activateSlideDrag = function () {
            _scope.dragShape.alpha = .3;
            _scope.dragShape.interactive = true;
        }


        this.deactivateSlideDrag = function () {
            _scope.dragShape.alpha = 0;
            _scope.dragShape.interactive = false;
        }

        //TweenLite.delayedCall(2, _scope.activateSlideDrag)
        //TweenLite.delayedCall(5, _scope.deactivateSlideDrag)

        var dragData = {
            startX: 0,
            offsetX: 0,
            isDragging: false,
            normalizedDrag: 0
        };

        function onDragStart(event) {
            dragData.startX = event.data.global.x - _scope.container.x;
            dragData.isDragging = true;
            //_dragShape.defaultCursor = "none";

            console.log('onStartDrag', dragData.startX);
        }

        function onDragEnd(event) {
            dragData.isDragging = false;
            TweenLite.to(_scope.container, 1, {
                throwProps: {
                    x: {
                        velocity: _scope.tracker.getVelocity("x"),
                        max: 0,
                        min: -_scope.shapeWidth + jks.View.getScreenWidth()
                    }
                },
                ease: Strong.easeOut
            });

            console.log('onDragEnd');
        }


        var oldX = 0;

        function onDragMove(e) {
            if (dragData.isDragging) {
                //console.log(e.data)
                _scope.container.x = e.data.global.x - dragData.startX;
            }

        }


        this.update = function () {
            if (!_scope.isMobile) {
                _scope.container.x = jks.View.getScreenWidth() * .5 - _scope.container.getWidth() * .5;
            }
            _scope.container.y = jks.View.getScreenHeight() - _scope.container.getHeight() - $OffsetBottom;
        }


    }


    jks.ThumbNavigation = ThumbNavigation;

}());


