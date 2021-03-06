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
            onTapNext: new signals.Signal(),
            onTapPrev: new signals.Signal()
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

        _sideArrowRight = new PIXI.Sprite.fromImage(jks.DataHandler.getAssetByID('side_nav_arrow').src)
        _sideArrowRight.anchor.x = 1;
        _sideArrowRight.anchor.y = .5;
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

        _sideArrowLeft = new PIXI.Sprite.fromImage(jks.DataHandler.getAssetByID('side_nav_arrow').src)
        _sideArrowLeft.anchor.x = 1;
        _sideArrowLeft.anchor.y = .5;
        _sideArrowLeft.scale.x = -1;
        _sideArrowLeft.x = $OffsetSide;

        this.sideArrowLeft = new PIXI.Container();
        this.sideArrowLeft.addChild(_sideArrowLeft);
        this.sideArrowLeft.addChild(_activeLeft);

        $ArrowHeight = jks.DataHandler.getAssetByID('side_nav_arrow').height;

        this.container.addChild(this.sideArrowRight);
        this.container.addChild(this.sideArrowLeft);


        _activeRight.on('mouseover', onHoverRight);
        _activeRight.on('mouseout', onHoverOutRight);
        _activeRight.on('mousedown', onTapNext).on('touchstart', onTapNext);

        _activeLeft.on('mouseover', onHoverLeft);
        _activeLeft.on('mouseout', onHoverOutLeft);
        _activeLeft.on('mousedown', onTapPrev).on('touchstart', onTapPrev);


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

        function onTapNext() {
            if (!_scope.isLocked) {
                _scope.s.onTapNext.dispatch();
            }
        }

        function onTapPrev() {
            if (!_scope.isLocked) {
                _scope.s.onTapPrev.dispatch();
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

    jks.SideNavigation.triggerArrow = function (_type) {
        if (_type == 'next') {
            TweenLite.to(_sideArrowRight, .3, {x: 0, ease: $HoverEase})
            TweenLite.to(_sideArrowRight, .4, {delay: .3, x: -$OffsetSide, ease: $HoverOutEase})
        } else {
            TweenLite.to(_sideArrowLeft, .3, {x: 0, ease: $HoverEase})
            TweenLite.to(_sideArrowLeft, .4, {delay: .3, x: $OffsetSide, ease: $HoverOutEase})
        }
    }

}());


