/**
 * Created by STORMSEN on 12.08.2016.
 */


this.jks = this.jks || {};


( function () {

        var _scope;

        var logo, logo_text;
        var navTopContainer;
        var navToggleIcon, mobileNavToggleIcon, mobileNavCloseIcon;
        var navSelectIcon, selectNavToggleIconClosed, selectNavToggleIconOpen;
        var navSelectContainer;
        var selectNavigation;
        var isSwitching;
        var isMobile;

        var currentSelectedPage = 'home';


        function Navigation(config) {
            _scope = this;

            console.log('init - Navigation', jks.Config.getDeviceType());


            this.s = {
                onKeyDownEvent: new signals.Signal(),
                onIconNavSelect: new signals.Signal(),
                onPageNavSelect: new signals.Signal(),
                onTapHome: new signals.Signal(),
                onToggleThumbNav: new signals.Signal(),
                navEvent: new signals.Signal()
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
            logo_text = document.getElementById('svg_logo_text');
            logo.addEventListener('mousedown', onTapHome);
            TweenLite.set(logo, {
                    left: 15,
                    top: 15
                }
            );

            this.wakeUp = function () {
                TweenLite.set(logo, {display: 'block', opacity: 1});
                //TweenLite.to(_logo, 1, { opacity: 1, ease: Sine.easeOut})
            };


            function onTapHome() {
                if (currentSelectedPage != 'home') {
                    _scope.s.onTapHome.dispatch();
                    if (_scope.isMobile) {
                        hideNav();
                    }
                    hideSelection();
                    selectNavigation.reset();
                    currentSelectedPage = 'home';
                    currentSelectedID = null;
                }
            }

            /*--------------------------------------------
             ~SELECT/SLIDE NAVIGATION
             --------------------------------------------*/

            var selectButtons = [];

            function generateSelectNavigation() {

                selectNavigation = new jks.SelectNavigation(config, navSelectContainer);
                selectNavigation.s.onTap.add(onIconSelect);
                _scope.container.addChild(selectNavigation.container);

            }


            function onIconSelect(selectionID) {
                //console.log('onIconSelect', selectionID);
                if (currentSelectedPage != 'slides') {
                    currentSelectedPage = 'slides';
                }
                if (selectionID != currentSelectedID) {
                    if (jks.Config.getDeviceType() == 'mobile' && device.landscape()) {
                        hideThumbNavToogle();
                    }
                    _scope.s.onIconNavSelect.dispatch(selectionID);
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

            console.log(navTopContainer.position);


            var navTop = {
                width: 0
            };

            function generateTopNavigtion() {
                var compWidth = 0;

                for (var i = 0; i < config.navigationData.menue.length; i++) {
                    //console.log('create Top!', i);

                    var topNavButton = new jks.TopNavButton(config.navigationData.menue[i]);
                    topNavButton.container.x = compWidth;
                    topNavButton.s.onTap.add(onPageNavSelect)
                    //compWidth += topNavButton.getWidth() + margin;
                    compWidth += topNavButton.container.width;

                    if (i == config.navigationData.menue.length - 1) {
                        navTop.width = compWidth;
                    }

                    navTopContainer.addChild(topNavButton.container);
                    _scope.topNavButtons.push(topNavButton);
                }


                initMobileNavToogle();
                initSelectionToggleButton();


            }

            function onPageNavSelect(id) {

                //currentSelectedPage = id;

                if (currentSelectedPage != id) {
                    currentSelectedPage = id;
                    //console.log('>>>', currentSelectedPage)
                    selectNavigation.reset();
                    currentSelectedID = null;
                    if (isMobile) {
                        hideNav()
                    }
                    _scope.s.onPageNavSelect.dispatch(id);
                }
            }


            /*--------------------------------------------
             ~ MOBILE NAV TOGGLE
             --------------------------------------------*/

            function initMobileNavToogle() {
                navToggleIcon = new PIXI.Container();
                navToggleIcon.interactive = true;
                navToggleIcon.buttonMode = true;
                navToggleIcon.x = navTopContainer.width + 100;
                navToggleIcon.y = 10;
                navToggleIcon.visible = true;
                navToggleIcon.on('mousedown', onToggleNav).on('touchstart', onToggleNav);

                var icon = new PIXI.Graphics();
                icon.beginFill(0x00cc00);
                icon.drawRect(0, 0, 35, 35);
                icon.endFill;
                icon.alpha = 0;
                //icon.x = navTopContainer.width;
                //icon.y = 10;

                mobileNavToggleIcon = new PIXI.Sprite.fromImage(jks.DataHandler.getAssetByID('mobileNavToggleIcon').src);
                mobileNavCloseIcon = new PIXI.Sprite.fromImage(jks.DataHandler.getAssetByID('mobileNavCloseIcon').src);
                mobileNavToggleIcon.scale.x = mobileNavToggleIcon.scale.y = .5;
                mobileNavCloseIcon.scale.x = mobileNavCloseIcon.scale.y = .5;
                mobileNavCloseIcon.visible = false;


                navToggleIcon.addChild(icon);
                navToggleIcon.addChild(mobileNavToggleIcon);
                navToggleIcon.addChild(mobileNavCloseIcon);
                navTopContainer.addChild(navToggleIcon);

            }

            function onToggleNav() {
                !navVisible ? showNav() : hideNav();
                //console.log('dispatch', navVisible)
                _scope.s.navEvent.dispatch('navVisible', navVisible)
            }

            function hideNav() {
                jks.View.hideOverlay();
                navVisible = false;
                mobileNavCloseIcon.visible = false;
                mobileNavToggleIcon.visible = true;
                for (var i = 0; i < _scope.topNavButtons.length; i++) {
                    TweenLite.killTweensOf(_scope.topNavButtons[i].container);
                    TweenLite.set(_scope.topNavButtons[i].container, {alpha: 0, visible: false})
                }
                if (jks.Config.getDeviceType() == 'mobile' && device.landscape()) {
                    thumbNavToggleIcon.visible = true;
                }
            }

            function showNav() {
                hideSelection();
                if (!isSwitching) {
                    jks.View.showOverlay();
                }
                navVisible = true;
                mobileNavToggleIcon.visible = false;
                mobileNavCloseIcon.visible = true;
                for (var i = 0; i < _scope.topNavButtons.length; i++) {
                    TweenLite.killTweensOf(_scope.topNavButtons[i].container);
                    TweenLite.set(_scope.topNavButtons[i].container, {visible: true});
                    TweenLite.to(_scope.topNavButtons[i].container, .5, {alpha: 1, delay: i * .1});
                }
                if (jks.Config.getDeviceType() == 'mobile' && device.landscape()) {
                    thumbNavToggleIcon.visible = false;
                }
            }

            /*--------------------------------------------
             ~ SELECT BUTTON
             --------------------------------------------*/

            var selectionVisible = true;

            function initSelectionToggleButton() {

                navSelectIcon = new PIXI.Container();
                navSelectIcon.interactive = true;
                navSelectIcon.buttonMode = true;
                navSelectIcon.x = -50;
                navSelectIcon.y = 3;
                navSelectIcon.visible = true;
                navSelectIcon.on('mousedown', onToggleSelection).on('touchstart', onToggleSelection);

                var icon = new PIXI.Graphics();
                icon.beginFill(0xcc0000);
                icon.drawRect(0, 0, 45, 35);
                icon.endFill;
                icon.alpha = 0;
                //icon.x = navTopContainer.width;
                //icon.y = 10;

                selectNavToggleIconClosed = new PIXI.Sprite.fromImage(jks.DataHandler.getAssetByID('selectNavToggleIconClosed').src);
                selectNavToggleIconOpen = new PIXI.Sprite.fromImage(jks.DataHandler.getAssetByID('selectNavToggleIconOpen').src);
                selectNavToggleIconClosed.scale.x = selectNavToggleIconClosed.scale.y = .5;
                selectNavToggleIconOpen.scale.x = selectNavToggleIconOpen.scale.y = .5;
                selectNavToggleIconClosed.x = selectNavToggleIconOpen.x = 5;
                //selectNavToggleIconClosed.visible = false;
                selectNavToggleIconOpen.visible = false;


                navSelectIcon.addChild(icon);
                navSelectIcon.addChild(selectNavToggleIconClosed);
                navSelectIcon.addChild(selectNavToggleIconOpen);
                navTopContainer.addChild(navSelectIcon);

            }

            function onToggleSelection() {
                //console.log('onToggleSelection');

                !selectionVisible ? showSelection() : hideSelection();
                _scope.s.navEvent.dispatch('selectionVisible', selectionVisible)
            }

            function hideSelection(_fast) {
                _fast = _fast || false;
                jks.View.hideOverlay();


                selectionVisible = false;
                selectNavToggleIconOpen.visible = false;
                selectNavToggleIconClosed.visible = true;

                selectNavigation.hide(_fast);

                if (thumbNavToggleIcon && jks.Config.getDeviceType() == 'mobile' && device.landscape()) {
                    thumbNavToggleIcon.visible = true;
                }
            }

            function showSelection() {

                if (_scope.isMobile) {
                    hideNav();
                }


                if (currentSelectedPage != 'home') {
                    jks.View.showOverlay();
                }

                selectionVisible = true;
                selectNavToggleIconClosed.visible = false;
                selectNavToggleIconOpen.visible = true;

                selectNavigation.show();

                if (jks.Config.getDeviceType() == 'mobile' && device.landscape()) {
                    thumbNavToggleIcon.visible = false;
                }
            }


            function changeSelectionMode() {
                //console.log('changeSelectionMode');
                for (var i = 0; i < selectButtons.length; i++) {
                    selectButtons[i].changeSelectionMode('mode');
                }
            }

            /*--------------------------------------------
             ~ THUMB NAV TOGGLE
             --------------------------------------------*/


            var thumbNavToggleIcon;

            var iconSize = {
                width: 103 * .5 + 10,
                height: 45
            };

            function initThumbNavToogle() {
                thumbNavToggleIcon = new PIXI.Container();
                thumbNavToggleIcon.interactive = true;
                thumbNavToggleIcon.buttonMode = true;
                thumbNavToggleIcon.pivot.x = iconSize.width * .5;
                thumbNavToggleIcon.pivot.y = iconSize.height * .5;
                thumbNavToggleIcon.visible = false;
                thumbNavToggleIcon.activated = false;
                thumbNavToggleIcon.alpha = 0;

                thumbNavToggleIcon.on('mouseup', onToggleThumbNav).on('touchend', onToggleThumbNav);

                var icon = new PIXI.Sprite.fromImage(jks.DataHandler.getAssetByID('thumb_nav_arrow').src);
                icon.scale.x = icon.scale.y = .5;
                icon.y = 10;
                icon.x = 5;

                var shape = new PIXI.Graphics();
                shape.beginFill(jks.Config.getColor('light_blue'));
                shape.drawRect(0, 0, iconSize.width, iconSize.height);
                shape.endFill;
                shape.alpha = 0;

                thumbNavToggleIcon.x = jks.View.getScreenWidth() * .5;
                thumbNavToggleIcon.y = jks.View.getScreenHeight() - thumbNavToggleIcon.height * .5;

                thumbNavToggleIcon.addChild(shape);
                thumbNavToggleIcon.addChild(icon);
                _scope.container.addChild(thumbNavToggleIcon);

            }

            function onToggleThumbNav() {
                TweenLite.set(thumbNavToggleIcon, {alpha: 0});
                TweenLite.to(thumbNavToggleIcon, .3, {delay: .3, alpha: 1});

                if (!thumbNavToggleIcon.activated) {
                    // top
                    thumbNavToggleIcon.activated = true;
                    thumbNavToggleIcon.rotation = Math.PI;
                    thumbNavToggleIcon.scale.x = thumbNavToggleIcon.scale.y = .9;
                    thumbNavToggleIcon.x = jks.View.getScreenWidth() * .5;
                    thumbNavToggleIcon.y = jks.View.getScreenHeight() - thumbNavToggleIcon.thumbNavHeight - thumbNavToggleIcon.height * .5;
                    //thumbNavToggleIcon.off('mouseup', onToggleThumbNav).off('touchend', onToggleThumbNav);
                    //thumbNavToggleIcon.on('mousedown', onToggleThumbNav).on('touchstart', onToggleThumbNav);
                } else {
                    // bottom
                    thumbNavToggleIcon.activated = false;
                    thumbNavToggleIcon.x = jks.View.getScreenWidth() * .5;
                    thumbNavToggleIcon.y = jks.View.getScreenHeight() - thumbNavToggleIcon.height * .5;
                    thumbNavToggleIcon.rotation = 0;
                    thumbNavToggleIcon.scale.x = thumbNavToggleIcon.scale.y = 1;
                    //thumbNavToggleIcon.on('mouseup', onToggleThumbNav).on('touchend', onToggleThumbNav);
                    //thumbNavToggleIcon.off('mousedown', onToggleThumbNav).off('touchstart', onToggleThumbNav);
                }

                _scope.s.onToggleThumbNav.dispatch(thumbNavToggleIcon.activated);
            }

            function showThumbNavToogle() {
                //console.log('step')
                thumbNavToggleIcon.activated = false;
                thumbNavToggleIcon.visible = true;
                thumbNavToggleIcon.x = jks.View.getScreenWidth() * .5;
                thumbNavToggleIcon.y = jks.View.getScreenHeight() - thumbNavToggleIcon.height * .5;
                thumbNavToggleIcon.rotation = 0;
                thumbNavToggleIcon.scale.x = thumbNavToggleIcon.scale.y = 1;
                thumbNavToggleIcon.alpha = 1;


                //thumbNavToggleIcon.on('mouseup', onToggleThumbNav).on('touchend', onToggleThumbNav);
                //thumbNavToggleIcon.off('mousedown', onToggleThumbNav).off('touchstart', onToggleThumbNav);

                //TweenLite.to(thumbNavToggleIcon, .5, {
                //    x: jks.View.getScreenWidth() * .5,
                //    y: jks.View.getScreenHeight() - thumbNavToggleIcon.height * .5,
                //    alpha: 1
                //})

                //thumbNavToggleIcon.x = jks.View.getScreenWidth() * .5;
                //thumbNavToggleIcon.y = jks.View.getScreenHeight() - thumbNavToggleIcon.height * .5;
            }

            function hideThumbNavToogle() {
                thumbNavToggleIcon.visible = false;
                thumbNavToggleIcon.alpha = 0;
                thumbNavToggleIcon.activated = false
            }



            /*--------------------------------------------
             ~ PUBLIC
             --------------------------------------------*/

            this.switchMobile = function () {

                hideNav();
                TweenLite.set(logo_text, {display: 'none'});

                var compHeight = 0;
                for (var i = 0; i < this.topNavButtons.length; i++) {
                    _scope.topNavButtons[i].switchMobile();
                    _scope.topNavButtons[i].container.x = 140;
                    _scope.topNavButtons[i].container.y = 50 + compHeight;
                    compHeight += _scope.topNavButtons[i].container.height;
                }

                selectNavigation.switchMobile();

                navSelectIcon.x = 180;
                navSelectIcon.y = 10;
                navToggleIcon.x = 235;

                isSwitching = false;
                isMobile = true;
            };


            this.switchDefault = function () {

                showNav();
                if (jks.Config.getDeviceType() != 'mobile') {
                    TweenLite.set(logo_text, {display: 'block'});
                }

                var compWidth = 0;
                for (var i = 0; i < this.topNavButtons.length; i++) {
                    _scope.topNavButtons[i].switchDefault();
                    _scope.topNavButtons[i].container.x = compWidth;
                    _scope.topNavButtons[i].container.y = 0;
                    compWidth += _scope.topNavButtons[i].container.width;
                }

                selectNavigation.switchDefault();

                navSelectIcon.x = -50;
                navSelectIcon.y = 3;
                navToggleIcon.x = navTopContainer.width + 100;

                isSwitching = false;
                isMobile = false;
            };


            this.switchMode = function (isMobile) {
                console.log('navigation - switchMode', isMobile);

                _scope.isMobile = isMobile;

                isSwitching = true;

                isMobile ? _scope.switchMobile() : _scope.switchDefault();
            };

            this.onOrientationChange = function () {
                console.log('navigation - onOrientationChange');

                if (jks.Config.getDeviceType() == 'mobile') {
                    if (currentSelectedPage != 'home') hideSelection(true);
                    TweenLite.delayedCall(.1, selectNavigation.onOrientationChange);

                    if (device.portrait()) {
                        hideThumbNavToogle();
                    }
                }
            };


            this.thumbNavigationShow = function (show, height) {
                thumbNavToggleIcon.thumbNavHeight = height;
                if (!show) {
                    showThumbNavToogle();
                }
            };


            this.hide = function () {
                //navSelectContainer.visible = false;
                hideSelection();

                if (thumbNavToggleIcon && jks.Config.getDeviceType() == 'mobile') {
                    thumbNavToggleIcon.visible = false;
                }

                //hideNav()
            };

            this.show = function () {
                //navSelectContainer.visible = true;
                showSelection();

            };


            /*--------------------------------------------
             ~UPDATE VIEW
             --------------------------------------------*/

            var w, s, o;
            var minOffset = 15;
            var maxOffset = 30;
            this.updateView = function () {
                //return
                w = jks.View.getScreenWidth();
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
                );


                if (jks.Config.getDeviceType() == 'mobile') {

                    navTopContainer.x = jks.View.getScreenWidth() - navTop.width - 10;
                    navTopContainer.y = 5;

                } else {

                    navTopContainer.x = jks.View.getScreenWidth() - navTop.width - 10;
                    navTopContainer.y = 5;

                }

                if (selectNavigation) {
                    selectNavigation.updateView(navTopContainer.x);
                }


            };


            function initKeyMode() {

                //console.log('::initKeyMode');

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


            generateTopNavigtion();
            generateSelectNavigation();
            hideSelection();
            if (jks.Config.getDeviceType() == 'mobile') {
                initThumbNavToogle();
            }


        }

        jks.Navigation = Navigation;


        jks.Navigation.getTopNavPosition = function () {
            return navTopContainer.position;
        };

        jks.Navigation.getCurrentSelectedPage = function () {
            return currentSelectedPage;
        }

        jks.Navigation.isMobile = function () {
            return isMobile;
        }

    }
    ()
);