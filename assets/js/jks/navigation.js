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
    var navSelectIcon;
    var navSelectContainer;


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
         ~SELECT/SLIDE NAVIGATION
         --------------------------------------------*/

        navSelectContainer = new PIXI.Container();
        navSelectContainer.visible = false;
        navSelectContainer.pivot.x = .5;
        navSelectContainer.pivot.y = .5;
        _scope.container.addChild(navSelectContainer);

        var selectButtons = [];

        function generateSelectNavigation() {

            for (var i = 0; i < config.numPages; i++) {
                console.log('create Button!', i, config.pages[i].categoryText)

                var select_btn = new jks.SelectNavButton(jks.DataHandler.getAssetByID(config.pages[i].category).src, config.pages[i].categoryText, i)

                select_btn.container.alpha = 1;
                select_btn.s.onTapSelect.add(onTapSelect);

                navSelectContainer.addChild(select_btn.container);
                selectButtons.push(select_btn);

            }

            //for (var i = 0; i < selectButtons.length; i++) {
            //    selectButtons[i].y -= length * .5 - margin * .5;
            //}


        }


        function onTapSelect(selectionID) {
            console.log('onTapSelect', selectionID);
            if (selectionID != currentSelectedID) {
                _scope.s.onNavSelect.dispatch(selectionID);
                currentSelectedID = selectionID;
            }
        }

        /*--------------------------------------------
         ~ TOP NAVIGATION
         --------------------------------------------*/
        var navVisible = false;

        navTopContainer = new PIXI.Container();
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


            initMobileNavToogle();
            initSelectButton();


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

        function initSelectButton() {
            navSelectIcon = new PIXI.Container();
            navSelectIcon.interactive = true;
            navSelectIcon.buttonMode = true;
            navSelectIcon.x = -30;
            navSelectIcon.y = 10;
            //navSelectIcon.visible = false;
            navSelectIcon.on('mousedown', onToggleSelection).on('touchstart', onToggleSelection)

            var icon = new PIXI.Graphics();
            //this.shape.interactive = true;
            ////this.shape.buttonMode = true;
            icon.beginFill(0xcc0000);
            icon.drawRect(0, 0, 30, 30);
            icon.endFill;
            icon.alpha = .3;
            //icon.x = navTopContainer.width;
            //icon.y = 10;


            navSelectIcon.addChild(icon);
            navTopContainer.addChild(navSelectIcon);

        }

        function onToggleSelection() {
            console.log('onToggleSelection');
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

            navSelectIcon.x = 280;
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

            navSelectIcon.x = -30;
        }


        this.switchMode = function (isMobile) {
            // console.log('navigation - switchMode', isMobile);

            _scope.isMobile = isMobile;

            isMobile ? _scope.switchMobile() : this.switchDefault();
        }


        this.hide = function () {
            navSelectContainer.visible = false;
        }

        this.show = function () {
            navSelectContainer.visible = true;
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

                navSelectContainer.x = navTopContainer.x;
                navSelectContainer.y = jks.View.getScreenHeight() * .3;

            } else {

                navTopContainer.x = jks.View.getScreenWidth() - navTop.width - 50;
                navTopContainer.y = 0;

                navSelectContainer.x = jks.View.getScreenWidth() * .5;
                navSelectContainer.y = jks.View.getScreenHeight() * .2;

            }


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


        generateSelectNavigation();
        this.generateTopNavigtion();


    }

    jks.Navigation = Navigation;

}());