/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _scope;
    var _imgRatio;
    var _imgHeight = 23;


    function ThumbNavigation(imageRatio) {
        _scope = this;

        this.s = {
            onClickThumb: new signals.Signal()
        };

        this.isLocked = false;
        this.thumbs = [];


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
            if (!_scope.isLocked) {
                _scope.s.onClickThumb.dispatch(e.target.ID);
                _scope.isLocked = true;
                TweenLite.delayedCall(1.5, function () {
                    _scope.isLocked = false;
                    }
                )
            }
        }

        this.onHoverThumb = function (e) {
            _scope.thumbs[e.target.ID].onHover();
        }

        this.onHoverOutThumb = function (e) {
            _scope.thumbs[e.target.ID].onHoverOut();
        }


        this.init = function (slideObject) {
            console.log('init - ThumbNavigation');
            //console.log(slideObject.slideNumImages);


            for (var i = 0; i < slideObject.slideNumImages; i++) {
                var thumb = new jks.Thumb(i,_imgRatio, PIXI.Texture.fromImage(slideObject.configData.pageData[slideObject.pageID].images[i].src));
                _imgHeight = thumb.thumbSize.height;
                _compWidth += thumb.thumbSize.width + 10;
                thumb.mask.on('click', this.onClickThumb);
                thumb.mask.on('mouseover', this.onHoverThumb);
                thumb.mask.on('mouseout', this.onHoverOutThumb);
                thumb.container.x = i * (thumb.thumbSize.width + 10);
                this.container.addChild(thumb.container);
                this.thumbs.push(thumb);

            }


        }


    }

    //function Thumb(_id, _texture) {
    //
    //    console.log(_imgHeight);
    //
    //    var thumbImageWidth = 300;
    //    this.thumbSize = {
    //        width: 75,
    //        height: 75
    //    }
    //    _imgHeight = this.thumbSize.height;
    //
    //
    //    this.container = new PIXI.Container();
    //
    //    var thumb = new PIXI.Sprite();
    //    thumb.texture = _texture;
    //    thumb.width = thumbImageWidth;
    //    thumb.height = thumb.width / _imgRatio;
    //    thumb.x = (this.thumbSize.width - thumb.width) * .5;
    //    thumb.y = (this.thumbSize.height - thumb.height) * .5;
    //
    //    this.mask = new PIXI.Graphics();
    //    this.mask.beginFill();
    //    this.mask.drawRect(0, 0, this.thumbSize.width, this.thumbSize.height);
    //    this.mask.endFill();
    //
    //    var outline = new PIXI.Graphics();
    //    outline.lineStyle(2, 0x506995, 1);
    //    outline.drawRect(this.mask.x, this.mask.y, this.mask.width, this.mask.height);
    //
    //
    //    this.container.addChild(thumb);
    //    this.container.addChild(this.mask);
    //    this.container.addChild(outline);
    //    thumb.mask = this.mask;
    //
    //    this.mask.interactive = true;
    //    this.mask.buttonMode = true;
    //    this.mask.ID = _id;
    //
    //
    //}


    //jks.Thumb = Thumb;
    jks.ThumbNavigation = ThumbNavigation;

}());


