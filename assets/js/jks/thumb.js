/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _scope;
    var _imgRatio;
    var _imgHeight = 23;
    var _o;

    var _thumb;
    var _colorMatrixFilter;


    function Thumb(_id, r, _texture) {

        _scope = this;
        this.selected = false;

        _imgRatio = r;

        var thumbImageWidth = 300;
        this.thumbSize = {
            width: 75,
            height: 75
        }
        _imgHeight = this.thumbSize.height;

        this.o = {saturation: -.5};
        this.container = new PIXI.Container();
        this.color = 0x408080; //0x506995

        _thumb = new PIXI.Sprite();
        _thumb.texture = _texture;
        _thumb.width = thumbImageWidth;
        _thumb.height = _thumb.width / _imgRatio;
        _thumb.x = (this.thumbSize.width - _thumb.width) * .5;
        _thumb.y = (this.thumbSize.height - _thumb.height) * .5;

        this.front = new PIXI.Sprite();
        this.front.texture = _texture;
        this.front.width = thumbImageWidth;
        this.front.height = this.front.width / _imgRatio;
        this.front.x = (this.thumbSize.width - this.front.width) * .5;
        this.front.y = (this.thumbSize.height - this.front.height) * .5;


        _colorMatrixFilter = new PIXI.filters.ColorMatrixFilter()
        _colorMatrixFilter.saturate(-.9);
        this.front.filters = [_colorMatrixFilter];


        this.mask = new PIXI.Graphics();
        this.mask.beginFill();
        this.mask.drawRect(0, 0, this.thumbSize.width, this.thumbSize.height);
        this.mask.endFill();

        this.overlay = new PIXI.Graphics();
        this.overlay.beginFill(this.color);
        this.overlay.drawRect(this.mask.x, this.mask.y, this.mask.width, this.mask.height);
        this.overlay.endFill;
        this.overlay.scale.x = 0.0;
        this.overlay.alpha = .0;

        this.outline = new PIXI.Graphics();
        this.outline.lineStyle(4, this.color, 1);
        this.outline.drawRect(this.mask.x, this.mask.y, this.mask.width, this.mask.height);
        this.outline.alpha = 0;


        this.container.addChild(this.mask);
        this.container.addChild(_thumb);
        this.container.addChild(this.front);
        this.container.addChild(this.overlay);
        this.container.addChild(this.outline);
        this.container.mask = this.mask;

        this.mask.interactive = true;
        this.mask.buttonMode = true;
        this.mask.ID = _id;


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

        this.select = function () {
            this.selected = true;
            this.outline.alpha = 1;
            TweenLite.to(this.overlay, .3, {alpha: .2, ease: Circ.easeOut})
            this.onHover();
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


