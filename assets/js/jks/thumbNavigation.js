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
                thumb.mask.on('mouseover', this.onHoverThumb);
                thumb.mask.on('mouseout', this.onHoverOutThumb);
                thumb.container.x = i * (thumb.thumbSize.width + $ThumbOffsetX);
                this.container.addChild(thumb.container);
                this.thumbs.push(thumb);
            }

            _compWidth -= $ThumbOffsetX;

            _scope.thumbs[0].select();


        }


        this.update = function() {
            _scope.container.x = jks.View.getScreenWidth() * .5 - _scope.container.getWidth() * .5;
            _scope.container.y = jks.View.getScreenHeight() - _scope.container.getHeight() - $OffsetBottom;
        }


    }


    jks.ThumbNavigation = ThumbNavigation;

}());


