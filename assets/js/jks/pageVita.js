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


        function PageVita(config, shader) {
            _scope = this;

            console.log('init - PageVita', jks.Config.getDeviceType());

            $imageWidth = config.backgroundImageSize.width;
            $imageHeight = config.backgroundImageSize.height;
            $imageRatio = $imageWidth / $imageHeight;


            this.container = new PIXI.Container();
            //this.container.interactive = true;
            //this.container.buttonMode = true;


            _background = new PIXI.Sprite.fromImage(jks.DataHandler.getAssetByID('bg_vita').src);
            _background.visible = false;
            //_background.pivot.x = jks.Config.backgroundImageSize().width * .5;
            this.container.addChild(_background);


            this.isActive = false;


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

                _tresholdFilter = new TresholdFilter(shader);
                _tresholdFilter.padding = 0;
                _tresholdFilter.uniforms.offset.x = 1;
                _background.filters = [_tresholdFilter];

            }

            function blendIn() {
                if (!_background.visible) _background.visible = true;
                _scope.container.visible = true;
                // smart delay to get correct resize!
                TweenLite.delayedCall(.1, function () {
                    _scope.updateView();
                    TweenLite.to(_tresholdFilter.uniforms.offset, 1.3, {
                        x: 0,
                        ease: Sine.easeIn
                    })
                })

                //TweenLite.delayedCall(1.5, jks.View.showOverlay)
                TweenLite.set('#content_vita', {display: 'block', delay: 1.5})

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
                    _background.x = (_screenWidth - _background.width) * .5;
                }


                TweenLite.set('.content', {
                    //width: jks.View.getScreenWidth() - 50
                    //height: jks.View.getScreenHeight() - 100
                })


            }


            this.show = function () {
                blendIn();
                _scope.switchMode(jks.View.isMobile());
                _scope.showContent();
                _scope.isActive = true;

            }

            this.hide = function () {
                blendOut();
                _scope.hideContent();
                _scope.isActive = false;
            }

            this.showContent = function () {
                console.log('showContent')
                _scope.switchMode(jks.View.isMobile());
                TweenLite.set('.content', {
                    display: 'block',
                    opacity: 1
                })
            }

            this.hideContent = function () {
                console.log('hideContent')
                TweenLite.set('.content', {
                    display: 'none',
                    opacity: 0
                })
            }


            this.switchMobile = function () {
                TweenLite.set('.content', {
                    backgroundColor: 'rgba(255,255,255,0)',
                    left: 5,
                    width: '90%'
                })

                jks.View.showOverlay();
            }

            this.switchDefault = function () {
                TweenLite.set('.content', {
                    backgroundColor: 'rgba(255,255,255,.6)',
                    left: 'auto',
                    right: 0,
                    width: '315px',
                    height: 'auto'
                })
            }

            this.switchMode = function (isMobile) {
                console.log('pageVita - switchMode', isMobile);

                _scope.isMobile = isMobile;

                //isSwitching = true;

                isMobile ? _scope.switchMobile() : _scope.switchDefault();
            };

            this.onOrientationChange = function () {
                console.log('pageVita - onOrientationChange');

                if (device.landscape()) {
                    //TODO Mirror Shader ...
                    //_background.scale.x = -1;
                } else {
                    //_background.scale.x = 1;
                }

            };


            function init() {

            }

            init();


        }

        jks.PageVita = PageVita;

    }
    ()
)
;