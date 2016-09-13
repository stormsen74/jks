/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _scope;
    var _imgRatio;
    var $outlineWidth = 2;
    var _imgHeight = 23;
    var _o;

    var _thumb;
    var _colorMatrixFilter;


    function Thumb(_id, r, _texture) {

        _scope = this;
        this.selected = false;
        this.ID = _id;

        this.s = {
            onTapDown: new signals.Signal(),
            onTapUp: new signals.Signal()
        };

        _imgRatio = r;

        this.thumbSize = {
            width: device.portrait() ? jks.View.getScreenWidth() / 4 : 75,
            height: device.portrait() ? jks.View.getScreenWidth() / 4 : 75,
            //width: 75,
            //height: 75
        }
        //console.log(Math.round(jks.View.getScreenWidth() / 4))
        var thumbImageWidth = device.portrait() ? jks.View.getScreenWidth() * .6 : 300;
        _imgHeight = this.thumbSize.height;

        this.o = {saturation: -.5};
        this.container = new PIXI.Container();
        this.color = 0x408080; //0x506995

        _thumb = new PIXI.Sprite(_texture);
        _thumb.width = thumbImageWidth;
        _thumb.height = _thumb.width / _imgRatio;
        _thumb.x = (this.thumbSize.width - _thumb.width) * .5;
        _thumb.y = (this.thumbSize.height - _thumb.height) * .5;
        //console.log(this.thumbSize.width)
        //_thumb.cacheAsBitmap = true;

        this.front = new PIXI.Sprite(_texture);
        this.front.width = thumbImageWidth;
        this.front.height = this.front.width / _imgRatio;
        this.front.x = (this.thumbSize.width - this.front.width) * .5;
        this.front.y = (this.thumbSize.height - this.front.height) * .5;


        _colorMatrixFilter = new PIXI.filters.ColorMatrixFilter()
        _colorMatrixFilter.padding = 0;
        _colorMatrixFilter.saturate(-.9);
        this.front.filters = [_colorMatrixFilter];
        //this.front.cacheAsBitmap = true;


        this.mask = new PIXI.Graphics();
        this.mask.beginFill(0x00ff00);
        this.mask.drawRect(0, 0, this.thumbSize.width, this.thumbSize.height);
        this.mask.endFill();

        this.overlay = new PIXI.Graphics();
        this.overlay.beginFill(this.color);
        this.overlay.drawRect(this.mask.x, this.mask.y, this.mask.width, this.mask.height);
        this.overlay.endFill;
        this.overlay.scale.x = 1.0;
        this.overlay.alpha = 0.0;


        this.outline = new PIXI.Graphics();
        this.outline.lineStyle($outlineWidth, this.color);
        this.outline.drawRect(
            this.mask.x + $outlineWidth,
            this.mask.y + $outlineWidth,
            this.mask.width - $outlineWidth * 2,
            this.mask.height - $outlineWidth * 2
        );
        this.outline.alpha = 0;

        this.container.addChild(_thumb);
        this.container.addChild(this.front);
        this.container.addChild(this.overlay);
        this.container.addChild(this.outline);
        this.container.addChild(this.mask);
        this.container.mask = this.mask;
        // this.container.cacheAsBitmap = true;

        this.mask.interactive = true;
        this.mask.buttonMode = true;
        this.mask.ID = _id;


        this.mask.on('mousedown', onTapDown).on('touchstart', onTapDown)
        this.mask.on('mouseup', onTapUp).on('touchend', onTapUp)
        this.mask.on('mouseover', onHover);
        this.mask.on('mouseout', onHoverOut);

        function onTapDown(event) {
            _scope.s.onTapDown.dispatch(event);
            //console.log('e', event);
        }

        function onTapUp(event) {
            _scope.s.onTapUp.dispatch(this.ID, event);
            //_scope.activateSlideDrag();
        }

        function onHover(e) {
            jks.ThumbNavigation.getThumbByID(this.ID).onHover();
        }

        function onHoverOut(e) {
            jks.ThumbNavigation.getThumbByID(this.ID).onHoverOut();
        }


        this.onHover = function () {
            TweenLite.to(this.front, .3, {
                alpha: 0,
                ease: Cubic.easeOut
            });
        };

        this.onHoverOut = function () {
            TweenLite.to(this.front, .4, {
                alpha: 1,
                ease: Cubic.easeIn
            });
        };

        this.showProgress = function (t) {
            this.overlay.alpha = .2;
            this.overlay.scale.x = 0;
            TweenLite.to(this.overlay, t, {alpha: .5, ease: Sine.easeInOut})
            TweenLite.to(this.overlay.scale, t, {x: 1, ease: Circ.easeOut})

        }

        this.updateDragProgress = function (p) {
            this.overlay.x = this.thumbSize.width * p;
            // console.log('th_updateDragProgress ', p)
        }

        this.select = function () {
            // console.log('select', this.mask.ID, this.overlay)
            this.selected = true;
            this.outline.alpha = 1;
            this.overlay.x = 0;
            this.overlay.scale.x = 1;
            //this.onHover();
            TweenLite.to(this.overlay, .3, {delay: .2, alpha: .2, ease: Circ.easeOut})
        };

        this.unselect = function () {
            this.selected = false;
            this.outline.alpha = 0;
            this.onHoverOut();
            TweenLite.to(this.overlay, .2, {alpha: 0, ease: Sine.easeIn})
        }


    }


    jks.Thumb = Thumb;

}());


