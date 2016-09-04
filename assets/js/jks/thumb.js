/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _scope;
    var _imgRatio;
    var _imgHeight = 23;
    var _o;

    var _colorMatrixFilter;
    var _front;


    function Thumb(_id, r, _texture) {

        _scope = this;

        _imgRatio = r;

        console.log('>', _imgHeight);

        var thumbImageWidth = 300;
        this.thumbSize = {
            width: 75,
            height: 75
        }
        _imgHeight = this.thumbSize.height;

        this.o = {saturation: -.5};
        this.container = new PIXI.Container();

        var thumb = new PIXI.Sprite();
        thumb.texture = _texture;
        thumb.width = thumbImageWidth;
        thumb.height = thumb.width / _imgRatio;
        thumb.x = (this.thumbSize.width - thumb.width) * .5;
        thumb.y = (this.thumbSize.height - thumb.height) * .5;

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

        var outline = new PIXI.Graphics();
        outline.lineStyle(4, 0x506995, 1);
        outline.drawRect(this.mask.x, this.mask.y, this.mask.width, this.mask.height);


        this.container.addChild(this.mask);
        this.container.addChild(thumb);
        this.container.addChild(this.front);
        this.container.addChild(outline);
        this.container.mask = this.mask;

        this.mask.interactive = true;
        this.mask.buttonMode = true;
        this.mask.ID = _id;


        this.onHover = function () {

            TweenLite.to(this.front, .3, {
                alpha: 0,
                ease: Cubic.easeOut
                //onComplete: onTransitionEnd
            });
        }


        this.onHoverOut = function () {

            TweenLite.to(this.front, .4, {
                alpha: 1,
                ease: Cubic.easeIn
                //onComplete: onTransitionEnd
            });
        }


    }


    jks.Thumb = Thumb;

}());


