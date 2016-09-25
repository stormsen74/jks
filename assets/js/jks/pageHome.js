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


    function PageHome(config) {
        _scope = this;

        console.log('init - PageHome', jks.Config.getDeviceType());

        $imageWidth = config.backgroundImageSize.width;
        $imageHeight = config.backgroundImageSize.height;
        $imageRatio = $imageWidth / $imageHeight;

        this.s = {
            //onKeyDownEvent: new signals.Signal()
        };


        this.container = new PIXI.Container();
        //this.container.interactive = true;
        //this.container.buttonMode = true;


        _background = new PIXI.Sprite.fromImage(jks.View.getAssetByID('bg_home').src);
        _background.visible = false;
        this.container.addChild(_background);


        TweenLite.delayedCall(.3, initTresholdFilter);

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

            //console.log(jks.Config.shaders()['treshold'])

            _tresholdFilter = new TresholdFilter(jks.Config.shaders()['treshold']);
            _tresholdFilter.padding = 0;
            _tresholdFilter.uniforms.offset.x = 1;
            _background.filters = [_tresholdFilter];

        }

        function blendIn() {
            if( !_background.visible ) _background.visible = true;
            _scope.container.visible = true;
            TweenLite.to(_tresholdFilter.uniforms.offset, 1, {
                x: 0,
                ease: Sine.easeOut
            })

            //_tresholdFilter.uniforms.offset.x =1;
        }

        function blendOut() {
            TweenLite.to(_tresholdFilter.uniforms.offset, 1, {
                x: 1,
                ease: Sine.easeInOut,
                onComplete: function () {
                    _scope.container.visible = false;
                }
            })

            //_tresholdFilter.uniforms.offset.x =1;
        }


        var _screenWidth, _screenHeight;
        var _scalePoint = new PIXI.Point(0, 0);

        this.updateView = function () {
            //_logo.x = jks.View.getScreenWidth();

            _screenWidth = jks.View.getScreenWidth();
            _screenHeight = jks.View.getScreenHeight();

            _scalePoint.set(_screenWidth / $imageWidth);
            _background.scale = _scalePoint;

            if (_background.height >= _screenHeight) {
                _scalePoint.set(_screenWidth / $imageWidth);
                _background.scale = _scalePoint;
                _background.x = 0;
                _background.y = -(_background.height - _screenHeight) * .5;
            } else if (_background.height <= _screenHeight) {
                _scalePoint.set(_screenHeight / $imageHeight);
                _background.scale = _scalePoint;
                _background.y = 0;
                _background.x = (_screenWidth - _background.width) * .2;
            }

        }


        this.show = function () {
            console.log('show')
            blendIn();
        }

        this.hide = function () {
            blendOut();
        }

        //init();


    }

    jks.PageHome = PageHome;

}());