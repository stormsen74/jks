/**
 * Created by STORMSEN on 12.08.2016.
 */

/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _scope;


    function SelectNavigation(config) {
        _scope = this;

        console.log('init - SelectNavigation');

        this.s = {
            onTap: new signals.Signal()
        };


        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.buttonMode = true

        this.buttons = []


        for (var i = 0; i < config.numPages; i++) {
            console.log('create Button!', i, config.pages[i].categoryText)

            var select_btn = new jks.SelectNavButton(jks.DataHandler.getAssetByID(config.pages[i].category).src, config.pages[i].categoryText, i)

            select_btn.container.alpha = 1;
            select_btn.s.onTapSelect.add(onTap);

            _scope.container.addChild(select_btn.container);
            _scope.buttons.push(select_btn);

        }


        function onTap(selectionID) {
            _scope.s.onTap.dispatch(selectionID);
        }


        this.updateView = function (navTopContainerX) {

            if (jks.Config.getDeviceType() == 'mobile') {

                _scope.container.x = jks.View.getScreenWidth() * .5;
                _scope.container.y = jks.View.getScreenHeight() * .15;

            } else {

                _scope.container.x = navTopContainerX;
                _scope.container.y = jks.View.getScreenHeight() * .15;

            }

        }

        _scope.updateView();


        this.switchMobile = function () {
            for (var i = 0; i < _scope.buttons.length; i++) {
                _scope.buttons[i].switchMobile();
            }
        }

        this.switchDefault = function () {
            for (var i = 0; i < _scope.buttons.length; i++) {
                _scope.buttons[i].switchDefault();
            }
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


        this.hide = function () {
            //_scope.container.visible = false;

            console.log('SelectNavigation - hide')

            var t = .03;
            var l = (_scope.buttons.length - 1) * t;
            for (var i = 0; i < _scope.buttons.length; i++) {
                TweenLite.to(_scope.buttons[i].container, .2, {
                    delay: (l - i) * t,
                    alpha: 0,
                    ease: Expo.easeIn
                })
            }

            TweenLite.killDelayedCallsTo(_scope.lock);
            TweenLite.delayedCall(.3, _scope.lock)

        }

        this.show = function () {
            //_scope.container.visible = true;
            for (var i = 0; i < _scope.buttons.length; i++) {
                //selectButtons[i].reactivate();
                TweenLite.set(_scope.buttons[i].container, {visible: true})
                TweenLite.to(_scope.buttons[i].container, .2, {delay: i * .07, alpha: 1, ease: Expo.easeOut})
            }

            TweenLite.killDelayedCallsTo(_scope.lock);
            _scope.unlock();

        }

        //init();


    }

    jks.SelectNavigation = SelectNavigation;

}());