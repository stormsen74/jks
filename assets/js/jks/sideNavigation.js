/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _scope;
    var $ArrowHeight = 10;
    var $OffsetSide = 15;
    var $HoverShapeWidth = 75;
    var $HoverShapeHeight = 250;
    var $HoverEase = Cubic.easeOut;
    var $HoverOutEase = Sine.easeOut;

    var _sideArrowRight, _sideArrowLeft;
    var _activeRight, _activeLeft;


    function SideNavigation() {
        _scope = this;

        this.s = {
            onClickNext: new signals.Signal(),
            onClickPrev: new signals.Signal()
        };


        this.isLocked = false;

        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.buttonMode = true;

        _activeRight = new PIXI.Graphics();
        _activeRight.beginFill(0x00ff00)
        _activeRight.drawRect(0, 0, $HoverShapeWidth, $HoverShapeHeight)
        _activeRight.endFill();
        _activeRight.alpha = .0;
        _activeRight.x -= $HoverShapeWidth;
        _activeRight.y -= $HoverShapeHeight * .5;
        _activeRight.interactive = true;

        _sideArrowRight = new PIXI.Sprite();
        _sideArrowRight.texture = PIXI.Texture.fromImage(jks.View.getAssetByID('side_nav_arrow').src);
        _sideArrowRight.anchor = new PIXI.Point(1, .5)
        _sideArrowRight.x = -$OffsetSide;

        this.sideArrowRight = new PIXI.Container();
        this.sideArrowRight.addChild(_sideArrowRight);
        this.sideArrowRight.addChild(_activeRight);

        _activeLeft = new PIXI.Graphics();
        _activeLeft.beginFill(0x00ff00)
        _activeLeft.drawRect(0, 0, $HoverShapeWidth, $HoverShapeHeight)
        _activeLeft.endFill();
        _activeLeft.alpha = .0;
        _activeLeft.x = 0;
        _activeLeft.y -= $HoverShapeHeight * .5;
        _activeLeft.interactive = true;

        _sideArrowLeft = new PIXI.Sprite();
        _sideArrowLeft.texture = PIXI.Texture.fromImage(jks.View.getAssetByID('side_nav_arrow').src);
        _sideArrowLeft.scale.x = -1;
        _sideArrowLeft.anchor = new PIXI.Point(1, .5)
        _sideArrowLeft.x = $OffsetSide;

        this.sideArrowLeft = new PIXI.Container();
        this.sideArrowLeft.addChild(_sideArrowLeft);
        this.sideArrowLeft.addChild(_activeLeft);

        $ArrowHeight = jks.View.getAssetByID('side_nav_arrow').height;

        this.container.addChild(this.sideArrowRight);
        this.container.addChild(this.sideArrowLeft);


        _activeRight.on('mouseover', onHoverRight);
        _activeRight.on('mouseout', onHoverOutRight);
        _activeRight.on('click', onClickNext);

        _activeLeft.on('mouseover', onHoverLeft);
        _activeLeft.on('mouseout', onHoverOutLeft);
        _activeLeft.on('click', onClickPrev);


        function onHoverRight() {
            TweenLite.to(_sideArrowRight, .3, {x: 0, ease: $HoverEase})
        }

        function onHoverOutRight() {
            TweenLite.to(_sideArrowRight, .4, {x: -$OffsetSide, ease: $HoverOutEase})
        }

        function onHoverLeft() {
            TweenLite.to(_sideArrowLeft, .3, {x: 0, ease: $HoverEase})
        }

        function onHoverOutLeft() {
            TweenLite.to(_sideArrowLeft, .4, {x: $OffsetSide, ease: $HoverOutEase})
        }

        function onClickNext() {
            if (!_scope.isLocked) {
                _scope.s.onClickNext.dispatch();
            }
        }

        function onClickPrev() {
            if (!_scope.isLocked) {
                _scope.s.onClickPrev.dispatch();
            }
        }


        this.init = function () {
            console.log('init - SideNavigation', jks.Core.isMobile());
        }


        this.update = function () {
            _scope.sideArrowRight.x = jks.View.getScreenWidth();
            _scope.sideArrowLeft.x = 0;
            _scope.container.y = jks.View.getScreenHeight() * .5;
        }


    }


    jks.SideNavigation = SideNavigation;

}());


