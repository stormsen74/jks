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

        var $content;


        function PageManager(config, shader) {
            _scope = this;

            console.log('init - PageManager', jks.Config.getDeviceType());

            $imageWidth = config.backgroundImageSize.width;
            $imageHeight = config.backgroundImageSize.height;
            $imageRatio = $imageWidth / $imageHeight;


            this.container = new PIXI.Container();

            _background = new PIXI.Sprite.fromImage(jks.DataHandler.getAssetByID('bg_vita').src);
            _background.visible = false;
            this.container.addChild(_background);

            this.isActive = false;
            this.mobileSwitch = false;


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

            this.blendIn = function () {
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

                TweenLite.delayedCall(1.5, jks.View.hideOverlay)
                //TweenLite.set('#content_vita', {display: 'block', delay: 1.5})

            }

            this.blendOut = function () {
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

                if (jks.Config.getDeviceType() != 'desktop') {
                    if (device.portrait()) {
                        if (jks.Config.getDeviceType() == 'mobile') {
                            TweenLite.set($content, {top: jks.View.getScreenHeight() * .15});
                            $content.style.width = _screenWidth - 100 + 'px';
                        } else if (jks.Config.getDeviceType() == 'tablet') {
                            TweenLite.set($content, {top: jks.View.getScreenHeight() * .3});
                            $content.style.width = _screenWidth * .7 + 'px';
                        }
                    } else {
                        TweenLite.set($content, {top: jks.View.getScreenHeight() * .2});
                        $content.style.width = _screenWidth * .5 + 'px';
                    }

                    $content.style.height = _screenHeight - parseInt($content.style.top) - 45 + 'px'
                } else {
                    if (_scope.mobileSwitch) {
                        TweenLite.set($content, {top: jks.View.getScreenHeight() * .2});
                        $content.style.width = _screenWidth * .65 + 'px';
                        //$content.style.height = parseInt($content.style.height) - parseInt($content.style.top) - 45 + 'px'
                    } else {
                        if (jks.Controller.getCurrentActivePageID() == 'vita') {
                            TweenLite.set($content, {top: jks.View.getScreenHeight() * .45});
                            $content.style.maxWidth = 400 + 'px';
                        } else if (jks.Controller.getCurrentActivePageID() == 'kontakt') {
                            TweenLite.set($content, {top: jks.View.getScreenHeight() * .35});
                            $content.style.maxWidth = 300 + 'px';
                        } else if (jks.Controller.getCurrentActivePageID() == 'aktuelles') {
                            TweenLite.set($content, {top: jks.View.getScreenHeight() * .35});
                            $content.style.maxWidth = 300 + 'px';
                        } else {
                            TweenLite.set($content, {top: jks.View.getScreenHeight() * .25});
                            $content.style.maxWidth = 450 + 'px';
                        }

                        $content.style.width = _screenWidth * .45 + 'px';
                        //$content.style.height = parseInt($content.style.height) - parseInt($content.style.top) - 45 + 'px'
                    }

                    $content.style.height = _screenHeight - parseInt($content.style.top) - 45 + 'px'
                    console.log('>', _screenHeight, $content.style.top, $content.style.height)
                }

                //console.log(_screenHeight, $content.style.height, $content.style.top)

            }

            /*--------------------------------------------
             ~ SHOW / HIDE - PAGE
             --------------------------------------------*/

            this.show = function (id) {
                _scope.switchMode(jks.View.isMobile());
                _scope.showContent();
                _scope.isActive = true;
            }

            this.hide = function () {
                _scope.hideContent();
                _scope.isActive = false;
            }

            /*--------------------------------------------
             ~ SHOW / HIDE - CONTENT
             --------------------------------------------*/

            this.showContent = function () {
                console.log('showContent')
                _scope.switchMode(jks.View.isMobile());
                _scope.updateView();

                TweenLite.to($content, 0, {
                    opacity: 0,
                    display: 'block',
                })

                onSwitchMobileOrientation();
                contentFadeIn();

            }

            function contentFadeIn() {

                TweenLite.to($content, 1, {
                    delay: .5,
                    opacity: 1,
                    ease: Sine.easeOut
                })
            }

            this.hideContent = function () {
                console.log('hideContent')
                TweenLite.to($content, .5, {
                    display: 'none',
                    opacity: 0
                })

            }


            this.switchMobile = function () {

                if (jks.Config.getDeviceType() == 'mobile' || jks.Config.getDeviceType() == 'tablet') {

                    //TweenLite.set($content, {top: 70});

                    TweenLite.set('.text', {
                        fontSize: '17px',
                        lineHeight: '20px'
                    })

                }
            }


            this.switchDefault = function () {
                TweenLite.set($content, {
                    backgroundColor: 'rgba(255,255,255,.6)',
                    height: 'auto'
                })
            }

            this.switchMode = function (isMobile) {
                console.log('pageManager - switchMode', isMobile);

                _scope.mobileSwitch = isMobile;

                isMobile ? _scope.switchMobile() : _scope.switchDefault();
            };

            this.onOrientationChange = function () {
                console.log('pageVita - onOrientationChange');

                onSwitchMobileOrientation();

            };


            function onSwitchMobileOrientation() {
                //if (jks.Config.getDeviceType() == 'mobile') {
                //if (device.landscape()) {} else {}
                //}
            }


            function init() {
                $content = document.getElementById('content');


                onSwitchMobileOrientation();
                if (jks.Config.getDeviceType() == 'mobile' || jks.Config.getDeviceType() == 'tablet') {
                    TweenLite.set('.text', {
                        fontSize: '17px',
                        lineHeight: '23px'
                    })
                }

                //if(jks.Config.getDeviceType()=='mobile') {
                Draggable.create(".content", {type: "scrollTop", edgeResistance: 0.5, throwProps: true});
                //}

            }

            init();


        }

        jks.PageManager = PageManager;

    }
    ()
)
;