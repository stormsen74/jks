/**
 * Created by STORMSEN on 12.08.2016.
 */

/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _scope;

    var logo;
    var navTopContainer;
    var navToggleIcon;
    var navSlideContainer;


    function Navigation(config) {
        _scope = this;

        console.log('init - Navigation', jks.Config.getDeviceType());


        this.s = {
            onKeyDownEvent: new signals.Signal(),
            onNavSelect: new signals.Signal(),
            onTapHome: new signals.Signal()
        };

        this.isMobile = false;
        this.topNavButtons = [];

        var currentSelectedID = null;


        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.buttonMode = true;


        if (jks.Config.getDeviceType() == 'desktop') {
            initKeyMode();
        }


        /*--------------------------------------------
         ~ LOGO / HOME BUTTON
         --------------------------------------------*/

        logo = document.getElementById('jk-logo');
        logo.addEventListener('mousedown', onTapHome);
        TweenLite.set(logo, {
                left: 15,
                top: 15
            }
        );

        this.wakeUp = function () {
            TweenLite.set(logo, {display: 'block', opacity: 1})
            //TweenLite.to(_logo, 1, { opacity: 1, ease: Sine.easeOut})
        };

        function onTapHome() {
            _scope.s.onTapHome.dispatch();
            currentSelectedID = null;
        }

        /*--------------------------------------------
         ~SLIDE NAVIGATION
         --------------------------------------------*/

        navSlideContainer = new PIXI.Container();
        navSlideContainer.visible = false;
        //navContainer.width = jks.View.getScreenWidth();
        //navSlideContainer.pivot.x = .5;
        //navSlideContainer.pivot.y = .5;
        //navSlideContainer.x = jks.View.getScreenWidth() * 0;
        //navSlideContainer.y = jks.View.getScreenHeight() * 0;
        _scope.container.addChild(navSlideContainer);


        var buttons = [];

        var s = .37;

        function generateSlideNavigation() {
            var size = 180 * s;
            var margin = size * .12;
            var length = size + margin;

            var sprite;

            for (var i = 0; i < config.numPages; i++) {
                console.log('create Button!', i, config.pages[i].category)

                this['button_' + i] = new PIXI.Graphics();
                this['button_' + i].interactive = true;
                this['button_' + i].buttonMode = true;
                this['button_' + i].beginFill(0x00cc00);
                this['button_' + i].drawRect(0, 0, size, size);

                sprite = new PIXI.Sprite.fromImage(jks.DataHandler.getAssetByID(config.pages[i].category).src)
                sprite.scale.x = sprite.scale.y = s;
                //_sideArrowRight.anchor.x = 1;
                //_sideArrowRight.anchor.y = .5;

                this['button_' + i].addChild(sprite)

                this['button_' + i].endFill;
                this['button_' + i].alpha = 1;
                this['button_' + i].on('mousedown', onTapDown).on('touchstart', onTapDown);
                this['button_' + i].pivot.x = .5;
                this['button_' + i].pivot.y = .5;
                this['button_' + i].x -= size * .5;
                this['button_' + i].y += length;
                //this['button_' + i].y = -20;
                this['button_' + i].selectionID = i;

                length += size + margin;

                navSlideContainer.addChild(this['button_' + i]);
                buttons.push(this['button_' + i]);

            }

            for (var i = 0; i < buttons.length; i++) {
                buttons[i].y -= length * .5 - margin * .5;
            }


        }

        //TweenLite.to(navContainer, 2, {delay: 2, rotation: Math.PI * 2, ease: Sine.easeInOut})

        function onTapDown(e) {
            console.log('tap', e.target.selectionID);
            if (e.target.selectionID != currentSelectedID) {
                _scope.s.onNavSelect.dispatch(e.target.selectionID);
                currentSelectedID = e.target.selectionID;
            }
        }

        /*--------------------------------------------
         ~ TOP NAVIGATION
         --------------------------------------------*/
        var navVisible = false;

        navTopContainer = new PIXI.Container();
        //navTopContainer.visible = false;
        //navContainer.width = jks.View.getScreenWidth();
        //navTopContainer.pivot.x = 0;
        //navTopContainer.pivot.y = 0;
        //navTopContainer.x = jks.View.getScreenWidth();
        //navTopContainer.y = jks.View.getScreenHeight() + 30;
        _scope.container.addChild(navTopContainer);


        var navTop = {
            width: 0
        }

        this.generateTopNavigtion = function () {
            var compWidth = 0;

            for (var i = 0; i < config.navigationData.menue.length; i++) {
                console.log('create Top!', i)

                var topNavButton = new jks.TopNavButton(config.navigationData.menue[i]);
                topNavButton.container.x = compWidth;
                //compWidth += topNavButton.getWidth() + margin;
                compWidth += topNavButton.container.width;

                if (i == config.navigationData.menue.length - 1) {
                    navTop.width = compWidth;
                }

                navTopContainer.addChild(topNavButton.container);
                this.topNavButtons.push(topNavButton);
            }


            initMobileNavToogle()


        }

        function initMobileNavToogle() {
            navToggleIcon = new PIXI.Container();
            navToggleIcon.interactive = true;
            navToggleIcon.buttonMode = true;
            navToggleIcon.x = navTopContainer.width;
            navToggleIcon.y = 10;
            //navToggleIcon.visible = false;
            navToggleIcon.on('mousedown', onToggleNav).on('touchstart', onToggleNav)

            var icon = new PIXI.Graphics();
            //this.shape.interactive = true;
            ////this.shape.buttonMode = true;
            icon.beginFill(0x00cc00);
            icon.drawRect(0, 0, 30, 30);
            icon.endFill;
            icon.alpha = .3;
            //icon.x = navTopContainer.width;
            //icon.y = 10;


            navToggleIcon.addChild(icon);
            navTopContainer.addChild(navToggleIcon);


        }


        function onToggleNav() {
            !navVisible ? showNav() : hideNav();
        }


        function hideNav() {
            navVisible = false;
            for (var i = 0; i < _scope.topNavButtons.length; i++) {
                TweenLite.set(_scope.topNavButtons[i].container, {alpha: 0, visible: false})
            }
        }

        function showNav() {
            navVisible = true;
            for (var i = 0; i < _scope.topNavButtons.length; i++) {
                TweenLite.set(_scope.topNavButtons[i].container, {visible: true})
                TweenLite.to(_scope.topNavButtons[i].container, .5, {alpha: 1, delay: i * .1})
            }
        }


        this.switchMobile = function () {

            hideNav();

            var compHeight = 0;
            for (var i = 0; i < this.topNavButtons.length; i++) {
                _scope.topNavButtons[i].switchMobile();
                _scope.topNavButtons[i].container.x = 230;
                _scope.topNavButtons[i].container.y = 40 + compHeight;
                compHeight += _scope.topNavButtons[i].container.height;
            }
        }


        this.switchDefault = function () {

            showNav();

            var compWidth = 0;
            for (var i = 0; i < this.topNavButtons.length; i++) {
                _scope.topNavButtons[i].switchDefault();
                _scope.topNavButtons[i].container.x = compWidth;
                _scope.topNavButtons[i].container.y = 0;
                compWidth += _scope.topNavButtons[i].container.width;
            }
        }


        this.switchMode = function (isMobile) {
            console.log('navigation - switchMode', isMobile);

            _scope.isMobile = isMobile;

            isMobile ? _scope.switchMobile() : this.switchDefault();
        }


        this.hide = function () {
            navSlideContainer.visible = false;
        }

        this.show = function () {
            navSlideContainer.visible = true;
        }


        /*--------------------------------------------
         ~UPDATE VIEW
         --------------------------------------------*/

        var w, s, o;
        var minOffset = 10;
        var maxOffset = 30;
        this.updateView = function () {
            //return
            w = jks.View.getScreenWidth()
            if (w <= 768) {
                s = mathUtils.convertToRange(w, [0, 768], [.4, .7]);
                //_logo.x = _logo.y = minOffset;
                TweenLite.set(logo, {
                        left: minOffset,
                        top: minOffset
                    }
                )
            } else {
                s = .7;
                o = mathUtils.convertToRange(w, [728, 1200], [0, 1]);
                //_logo.x = _logo.y = minOffset + o * maxOffset;
                TweenLite.set(logo, {
                        left: minOffset + o * maxOffset,
                        top: minOffset + o * maxOffset
                    }
                )
            }

            TweenLite.set(logo, {
                    width: s * 360
                }
            )

            if (!_scope.isMobile) {
                navTopContainer.x = jks.View.getScreenWidth() - navTop.width;
                navTopContainer.y = 0;
            } else {
                navTopContainer.x = jks.View.getScreenWidth() - navTop.width - 50;
                navTopContainer.y = 0;
            }


            navSlideContainer.x = jks.View.getScreenWidth() * .5;
            navSlideContainer.y = jks.View.getScreenHeight() * .3;

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
                        //('right');
                        break;
                    case 37:
                        if (!jks.ThumbNavigation.isLocked()) {
                            _scope.s.onKeyDownEvent.dispatch('prev');
                            jks.SideNavigation.triggerArrow('prev');
                        }
                        //('left');
                        break;
                    case 38:
                        //('up');
                        break;
                    case 40:
                        //('down');
                        break;
                }
            };

        }


        generateSlideNavigation();
        this.generateTopNavigtion();


    }

    jks.Navigation = Navigation;

}());