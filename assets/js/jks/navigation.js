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


    function Navigation() {
        _scope = this;

        console.log('init - Navigation');

        this.s = {
            onKeyDownEvent: new signals.Signal()
        };


        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.buttonMode = true;

        function initGFX() {

            _logo = new PIXI.Sprite.fromImage(jks.View.getAssetByID('logo').src);
            _logo.anchor.x = .5;
            _logo.anchor.y = 0;
            _logo.scale.x = _logo.scale.y = .3;

            //_logo.texture.baseTexture.width

            _logo.x = jks.View.getScreenWidth();
            _logo.y = 0;


            _scope.container.addChild(_logo);

            jks.View.addNavigationContainer(_scope.container);
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


        this.init = function () {

            console.log('navigation init!')
            console.log(jks.View.getAssetByID('logo'))
            //initKeyMode();
            //TweenLite.delayedCall(2, initGFX)
            initGFX();
        }

        //init();


    }

    jks.Navigation = Navigation;

}());