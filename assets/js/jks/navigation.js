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

        console.log(config);


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
        }

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
        navSlideContainer.pivot.x = 1;
        navSlideContainer.pivot.y = .5;
        navSlideContainer.x = jks.View.getScreenWidth() * .63;
        navSlideContainer.y = jks.View.getScreenHeight() * .3;
        _scope.container.addChild(navSlideContainer);

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

        this.top = {}
        this.generateTopNavigtion = function () {
            var compWidth = 0;

            console.log(config.navigationData.menue)

            for (var i = 0; i < config.navigationData.menue.length; i++) {
                console.log('create Top!', i)

                var topNavButton = new jks.TopNavButton(config.navigationData.menue[i]);
                this.top[config.navigationData.menue[i].title] = new jks.TopNavButton(config.navigationData.menue[i]);
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
            navToggleIcon.x = navTopContainer.width;
            navToggleIcon.y = 10;

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


        //iconMobile = new PIXI.Graphics();
        ////this.shape.interactive = true;
        ////this.shape.buttonMode = true;
        //closeShape.beginFill(0x00cc00);
        //closeShape.drawRect(0, 0, 30, 30);
        //closeShape.endFill;
        //closeShape.x = navTopContainer.width - 30;
        //closeShape.y = 10;
        //navTopContainer.addChild(closeShape);


        function hideNav() {
            for (var i = 0; i < _scope.topNavButtons.length; i++) {
                TweenLite.set(_scope.topNavButtons[i].container, {alpha: 0, visible: false})
            }
        }

        function showNav() {
            navTopContainer.visible = true;
            for (var i = 0; i < _scope.topNavButtons.length; i++) {
                TweenLite.set(_scope.topNavButtons[i].container, {visible: true})
                TweenLite.to(_scope.topNavButtons[i].container, .5, {alpha: 1, delay: i * .1})
            }
        }


        this.switchMobile = function () {

            //hideNav();

            var compHeight = 0;
            for (var i = 0; i < this.topNavButtons.length; i++) {
                console.log(_scope.topNavButtons[i].id)
                _scope.topNavButtons[i].switchMobile();
                _scope.topNavButtons[i].container.x = 150;
                _scope.topNavButtons[i].container.y = 40 + compHeight;
                compHeight += _scope.topNavButtons[i].container.height;


            }
        }


        this.switchDefault = function () {

            showNav();

            var compWidth = 0;
            for (var i = 0; i < this.topNavButtons.length; i++) {
                console.log(_scope.topNavButtons[i].id)
                _scope.topNavButtons[i].switchDefault();
                _scope.topNavButtons[i].container.x = compWidth;
                _scope.topNavButtons[i].container.y = 0;
                compWidth += _scope.topNavButtons[i].container.width;


            }
        }


        this.switchMode = function (isMobile) {
            console.log('navigation - switchMode', isMobile);

            _scope.isMobile = isMobile

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
                navTopContainer.x = jks.View.getScreenWidth() - navTop.width ;
                navTopContainer.y = 0;
            } else {
                navTopContainer.x = jks.View.getScreenWidth() - navTop.width - 50;
                navTopContainer.y = 0;
            }


            navSlideContainer.x = jks.View.getScreenWidth() * .63;
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


        generateSlideNavigation();
        this.generateTopNavigtion();


    }

    jks.Navigation = Navigation;

}());