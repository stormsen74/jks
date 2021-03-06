/**
 * Created by STORMSEN on 12.08.2016.
 */



this.jks = this.jks || {};


( function () {

    var _scope;
    var _compWidth = 0;
    var _compHeight = 0;


    function SelectNavigation(config) {
        _scope = this;

        console.log('init - SelectNavigation');

        this.s = {
            onTap: new signals.Signal()
        };


        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.buttonMode = true

        this.buttons = [];


        for (var i = 0; i < config.numPages; i++) {

            var select_btn = new jks.SelectNavButton(jks.DataHandler.getAssetByID(config.pages[i].category).src, config.pages[i].categoryText, i)
            //console.log('create Button!-', i, config.pages[i].categoryText)

            select_btn.container.alpha = 0;
            select_btn.s.onTapSelect.add(onTap);

            select_btn.container.x -= select_btn.getRealImgWidth();
            select_btn.container.y = i * (select_btn.getRealImgWidth() + 10);

            _scope.container.addChild(select_btn.container);
            _scope.buttons.push(select_btn);

        }


        function onTap(selectionID) {
            _scope.s.onTap.dispatch(selectionID);
            for (var i = 0; i < _scope.buttons.length; i++) {
                _scope.buttons[i].unselect();
            }
            _scope.buttons[selectionID].select();
        }


        this.setButtonColors = function (type) {
            for (var i = 0; i < _scope.buttons.length; i++) {
                _scope.buttons[i].setTextColor(type);
            }
        }

        if (jks.Config.getDeviceType() == 'mobile') {
            device.portrait() ? _scope.setButtonColors('home_portrait') : _scope.setButtonColors('home_landscape')
        } else {
            _scope.setButtonColors('home_portrait');
        }

        //_scope.setButtonColors('mobile_portrait');


        this.reset = function () {
            for (var i = 0; i < _scope.buttons.length; i++) {
                _scope.buttons[i].unselect();
            }
        }


        this.updateView = function (navTopContainerX) {

            if (jks.Config.getDeviceType() == 'mobile') {

                if (device.portrait()) {
                    _scope.container.x = jks.View.getScreenWidth() * .6;
                    _scope.container.y = jks.View.getScreenHeight() * .15;
                } else {
                    _scope.container.x = (jks.View.getScreenWidth() * .5 - _compWidth * .5) + 25;
                    _scope.container.y = jks.View.getScreenHeight() * .5 - _compHeight * .5;
                }

            } else {

                if (jks.View.getScreenWidth() < jks.Config.mobileSwitchWidth()) {
                    _scope.container.x = jks.View.getScreenWidth() * .6;
                    _scope.container.y = jks.View.getScreenHeight() * .15;
                } else {
                    _scope.container.x = navTopContainerX - 45;
                    _scope.container.y = jks.View.getScreenHeight() * .15;
                }


            }

        }

        _scope.updateView();


        this.switchMobile = function () {
            for (var i = 0; i < _scope.buttons.length; i++) {
                _scope.buttons[i].switchMobile();
            }
            if (jks.Config.getDeviceType() == 'mobile') {
                device.portrait() ? portraitMode() : landscapeMode();
            }
        }

        this.switchDefault = function () {
            for (var i = 0; i < _scope.buttons.length; i++) {
                _scope.buttons[i].switchDefault();
                _scope.buttons[i].container.x = 0;
                _scope.buttons[i].container.y = i * (_scope.buttons[i].getRealImgWidth() + 10);
            }
        }

        function portraitMode() {
            for (var i = 0; i < _scope.buttons.length; i++) {
                _scope.buttons[i].portraitMode();
                _scope.buttons[i].container.x = 0;
                _scope.buttons[i].container.y = i * (_scope.buttons[i].getRealImgWidth() + 10);
            }

            _scope.updateView();
        }

        function landscapeMode() {
            _compWidth = 0;
            _compHeight = 0;
            console.log('landscapeMode');
            for (var i = 0; i < _scope.buttons.length; i++) {
                _scope.buttons[i].landscapeMode();
                _scope.buttons[i].container.x = _compWidth;
                if (i == 1) {
                    _scope.buttons[i].container.x -= 10;
                }
                _scope.buttons[i].container.y = 0;
                _compWidth += _scope.buttons[i].container.width * .95 + 15;
                //compWidth += 10;
            }
            _compHeight = _scope.buttons[0].getHeight();


            _scope.updateView();
        }

        this.onOrientationChange = function () {
            device.portrait() ? portraitMode() : landscapeMode();

        }


        this.lock = function () {
            _scope.container.buttonMode = false;
            _scope.container.interactive = false;
            _scope.container.visible = false;
        }

        this.unlock = function () {
            _scope.container.buttonMode = true;
            _scope.container.interactive = true;
            _scope.container.visible = true;
        }


        this.hide = function (_fast) {
            _fast = _fast || false;
            //_scope.container.visible = false;

            console.log('SelectNavigation - hide', _fast)

            var t = _fast ? t = 0 : t = .03;
            //var t = .03;
            var l = (_scope.buttons.length - 1) * t;
            for (var i = 0; i < _scope.buttons.length; i++) {
                TweenLite.to(_scope.buttons[i].container, .2, {
                    delay: (l - i) * t,
                    alpha: 0,
                    ease: Expo.easeIn
                })
            }

            if (!_fast) {
                TweenLite.killDelayedCallsTo(_scope.lock);
                TweenLite.delayedCall(.3, _scope.lock)
            } else {
                _scope.lock()
            }

        }

        var pos = [];
        this.show = function () {
            //_scope.container.visible = true;
            for (var i = 0; i < _scope.buttons.length; i++) {
                //pos.push(_scope.buttons[i].container.position)
                //_scope.buttons[i].container.x = 100;
                //selectButtons[i].reactivate();
                TweenLite.set(_scope.buttons[i].container, {visible: true, alpha: 0})
                TweenLite.to(_scope.buttons[i].container, .3, {delay: i * .1, alpha: 1, ease: Sine.easeOut})
                //TweenLite.to(_scope.buttons[i].container.position, .2, {delay: i * .1, x: 0, ease: Circ.easeOut})
            }

            console.log(pos);

            TweenLite.killDelayedCallsTo(_scope.lock);
            _scope.unlock();

        }

        if (jks.Config.getDeviceType() == 'mobile') {
            _scope.switchMobile();
            device.portrait() ? portraitMode() : landscapeMode();
        } else {
            _scope.switchDefault();
        }


        function init() {

        }

        init();


    }

    jks.SelectNavigation = SelectNavigation;

    jks.SelectNavigation.setButtonColors = function (type) {
        _scope.setButtonColors(type);
    }

}());