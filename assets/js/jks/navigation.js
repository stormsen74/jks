/**
 * Created by STORMSEN on 12.08.2016.
 */

/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _scope;

    var _logo;


    function Navigation(config) {
        _scope = this;

        console.log('init - Navigation', jks.Config.getDeviceType());

        console.log(config);


        this.s = {
            onKeyDownEvent: new signals.Signal(),
            onNavSelect: new signals.Signal(),
            onTapHome: new signals.Signal()
        };

        var currentSelectedID = null;


        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.buttonMode = true;

        //var _logoColor = new PIXI.Sprite.fromImage(jks.View.getAssetByID('logo').src, false, PIXI.SCALE_MODES.NEAREST);
        //_logoColor.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        //_logoColor.texture.baseTexture.mipmap = true;
        //_logoColor.mipmap = true;
        //
        //_logo = new PIXI.Container();
        //_logo.interactive = true;
        //_logo.addChild(_logoColor);
        //
        //_logo.x = 15;
        //_logo.y = 15;
        //_logo.on('mousedown', onTapHome).on('touchstart', onTapHome);
        //
        //_scope.container.addChild(_logo);
        //_logo.scaleMode = PIXI.SCALE_MODES.NEAREST;
        // _logo.scale.x = _logo.scale.y = .5;

        // _logo = document.getElementById('svg_logo');
        // console.log(_logo)
        // _logo.addEventListener('mousedown', onTapHome);
        // TweenLite.set(_logo, {
        //         left: 15,
        //        top: 15
        //     }
        // )

        //_logo.style.width = '180px';

        this.wakeUp = function () {
            // TweenLite.set(_logo, {display: 'block', opacity: 1})
            //TweenLite.to(_logo, 1, { opacity: 1, ease: Sine.easeOut})
        }


        function onTapHome() {
            _scope.s.onTapHome.dispatch();
            currentSelectedID = null;
        }

        var navContainer = new PIXI.Container();
        //navContainer.width = jks.View.getScreenWidth();
        navContainer.pivot.x = 1;
        navContainer.pivot.y = .5;
        navContainer.x = jks.View.getScreenWidth() * .63;
        navContainer.y = jks.View.getScreenHeight() * .1;
        _scope.container.addChild(navContainer);

        var buttons = [];

        function generateSlideNavigation() {
            var size = 50;
            var margin = 30;
            var length = 50;

            for (var i = 0; i < config.numPages; i++) {
                console.log('create Button!', i)

                this['button_' + i] = new PIXI.Graphics();
                this['button_' + i].interactive = true;
                this['button_' + i].buttonMode = true;
                this['button_' + i].beginFill(0x00cc00);
                this['button_' + i].drawRect(0, 0, size, size);

                this['button_' + i].endFill;
                this['button_' + i].alpha = 0.5;
                this['button_' + i].on('mousedown', onTapDown).on('touchstart', onTapDown);
                this['button_' + i].pivot.x = .5;
                this['button_' + i].pivot.y = .5;
                this['button_' + i].x -= length;
                this['button_' + i].y = size;
                //this['button_' + i].y = -20;
                this['button_' + i].selectionID = i;

                length += size + margin;

                navContainer.addChild(this['button_' + i]);
                buttons.push(this['button_' + i]);

            }

            for (var i = 0; i < buttons.length; i++) {
                buttons[i].y -= length * .5 - margin * .5;
            }


        }

        generateSlideNavigation();

        //TweenLite.to(navContainer, 2, {delay: 2, rotation: Math.PI * 2, ease: Sine.easeInOut})


        function onTapDown(e) {
            console.log('tap', e.target.selectionID);
            if (e.target.selectionID != currentSelectedID) {
                _scope.s.onNavSelect.dispatch(e.target.selectionID);
                currentSelectedID = e.target.selectionID;
            }
        }


        //jks.View.addNavigationContainer(_scope.container);

        var w, s, o;
        var minOffset = 10;
        var maxOffset = 30;
        this.updateView = function () {
            //return
            w = jks.View.getScreenWidth()
            if (w <= 768) {
                s = mathUtils.convertToRange(w, [0, 768], [.4, .7]);
                //_logo.x = _logo.y = minOffset;
                TweenLite.set(_logo, {
                        left: minOffset,
                        top: minOffset
                    }
                )
            } else {
                s = 1;
                o = mathUtils.convertToRange(w, [728, 1200], [0, 1]);
                //_logo.x = _logo.y = minOffset + o * maxOffset;
                TweenLite.set(_logo, {
                        left: minOffset + o * maxOffset,
                        top: minOffset + o * maxOffset
                    }
                )
            }
            //_logo.scale.x = _logo.scale.y = s;
            TweenLite.set(_logo, {
                    width: s * 360
                }
            )

            //_scope.btn.y = _logo.y;
            //_scope.btn2.y = _scope.btn.y + 35 + _logo.y;
        }


        function initKeyMode() {

            console.log('::initKeyMode');

            document.onkeydown = function (e) {
                switch (e.keyCode) {
                    case 39:
                        if (!jks.ThumbNavigation.isLocked()) {
                            _scope.s.onKeyDownEvent.dispatch('next');
                            jks.SideNavigation.triggerArrow('next');
                        }
                        //alert('right');
                        break;
                    case 37:
                        if (!jks.ThumbNavigation.isLocked()) {
                            _scope.s.onKeyDownEvent.dispatch('prev');
                            jks.SideNavigation.triggerArrow('prev');
                        }
                        //alert('left');
                        break;
                    case 38:
                        //alert('up');
                        break;
                    case 40:
                        //alert('down');
                        break;
                }
            };

        }


    }

    jks.Navigation = Navigation;

}());