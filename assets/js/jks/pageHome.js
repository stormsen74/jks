/**
 * Created by STORMSEN on 12.08.2016.
 */

/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _scope;

    var _background;
    var _tresholdFilter;

    var $imageWidth;
    var $imageHeight;
    var $imageRatio;


    function PageHome(config, shader) {
        _scope = this;

        console.log('init - PageHome', jks.Config.getDeviceType());

        $imageWidth = config.backgroundImageSize.width;
        $imageHeight = config.backgroundImageSize.height;
        $imageRatio = $imageWidth / $imageHeight;


        this.container = new PIXI.Container();
        //this.container.interactive = true;
        //this.container.buttonMode = true;


        _background = new PIXI.Sprite.fromImage(jks.DataHandler.getAssetByID('bg_home').src);
        _background.visible = false;
        this.container.addChild(_background);


        TweenLite.delayedCall(.3, initTresholdFilter);
        //initTresholdFilter

        /*--------------------------------------------
         ~ TRANSITION / FILTERS
         --------------------------------------------*/


        function TresholdFilter(fragmentSource) {

            PIXI.Filter.call(this,
                // vertex shader
                null,
                // fragment shader
                fragmentSource
            );
        }

        TresholdFilter.prototype = Object.create(PIXI.Filter.prototype);
        TresholdFilter.prototype.constructor = TresholdFilter;

        function initTresholdFilter() {

            _tresholdFilter = new TresholdFilter(shader);
            _tresholdFilter.padding = 0;
            _tresholdFilter.uniforms.offset.x = 1;
            _background.filters = [_tresholdFilter];

            _scope.updateView();
        }

        function blendIn() {
            if (!_background.visible) _background.visible = true;
            _scope.container.visible = true;

            _scope.updateView();

            // smart delay to get correct resize!
            TweenLite.delayedCall(.1, function () {
                _scope.updateView();
                TweenLite.to(_tresholdFilter.uniforms.offset, 1.3, {
                    x: 0,
                    ease: Sine.easeIn
                })
            })

        }

        function blendOut() {
            TweenLite.to(_tresholdFilter.uniforms.offset, 1.5, {
                x: 1,
                ease: Circ.easeIn,
                onComplete: function () {
                    _scope.container.visible = false;
                }
            })

        }


        var _screenWidth, _screenHeight;
        var _scale = jks.View.getScreenWidth() / $imageWidth;
        _background.scale.x = _background.scale.y = _scale;


        this.updateView = function () {
            //_logo.x = jks.View.getScreenWidth();

            _screenWidth = jks.View.getScreenWidth();
            _screenHeight = jks.View.getScreenHeight();

            _scale = _screenWidth / $imageWidth;
            _background.scale.x = _background.scale.y = _scale;

            if (_background.height >= _screenHeight) {
                _scale = _screenWidth / $imageWidth;
                _background.scale.x = _background.scale.y = _scale;
                _background.x = 0;
                _background.y = -(_background.height - _screenHeight) * .5;
            } else if (_background.height <= _screenHeight) {
                _scale = _screenHeight / $imageHeight;
                _background.scale.x = _background.scale.y = _scale;
                _background.y = 0;
                _background.x = (_screenWidth - _background.width) * .2;
            }

        }

        this.show = function () {
            blendIn();
            //checkColors();
        }

        this.hide = function () {
            blendOut();
        }

        //init();


    }

    jks.PageHome = PageHome;

}());