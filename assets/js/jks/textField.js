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

    var textMaskWidth = 700;
    var currentDescription = '';


    function TextField() {
        _scope = this;

        console.log('init - TextField');

        this.s = {
            onKeyDownEvent: new signals.Signal()
        };


        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.buttonMode = true;


        this.fieldCategory = new PIXI.Text('', {
            fontFamily: 'Linotype Feltpen W01 Medium',
            fontSize: 24,
            fill: jks.Config.getColor('blue'),
            align: 'left'
        });


        //this.fieldCategory.x = 100;

        this.fieldType = new PIXI.Text('', {
            fontFamily: 'Linotype Feltpen W01 Medium',
            fontWeight: 'bold',
            fontSize: 17,
            fill: jks.Config.getColor('blue'),
            align: 'left'
        });


        this.fieldType.y = 30;

        this.fieldDescription = new PIXI.Text('', {
            fontFamily: 'Linotype Feltpen W01 Medium',
            fontSize: 16,
            fill: jks.Config.getColor('blue'),
            align: 'left'
        });


        this.fieldDescription.y = 50;

        this.text = new PIXI.Container();

        this.text.addChild(this.fieldCategory)
        this.text.addChild(this.fieldType)
        this.text.addChild(this.fieldDescription)


        var tfLocked = true;
        TweenLite.delayedCall(1, function () {
            tfLocked = false;
        })

        function posText() {
            TweenLite.to(_scope.text, .6, {
                x: jks.Navigation.getTopNavPosition().x - 45,
                ease: Cubic.easeOut
            })
        }


        var shadowDistance = 1.5;
        //var shadowColor = 0x75dada;
        var shadowColor = 0xffffff;
        var shadowBlur = 0;

        this.setShadow = function () {

            this.fieldCategory.style.dropShadow = true;
            this.fieldCategory.style.dropShadowDistance = shadowDistance;
            this.fieldCategory.style.dropShadowColor = shadowColor;
            this.fieldCategory.style.dropShadowBlur = shadowBlur;

            this.fieldType.style.dropShadow = true;
            this.fieldType.style.dropShadowDistance = shadowDistance;
            this.fieldType.style.dropShadowColor = shadowColor;
            this.fieldType.style.dropShadowBlur = shadowBlur;

            this.fieldDescription.style.dropShadow = true;
            this.fieldDescription.style.dropShadowDistance = shadowDistance;
            this.fieldDescription.style.dropShadowColor = shadowColor;
            this.fieldDescription.style.dropShadowBlur = shadowBlur;
        }


        //this.setShadow();


        this.updateView = function () {

            if (jks.Config.getDeviceType() == 'mobile' || jks.Navigation.isMobile()) {
                TweenLite.killTweensOf(_scope.text);
                _scope.text.x = 15;
                _scope.text.y = 50;
            } else {
                if (!tfLocked) {
                    TweenLite.killDelayedCallsTo(posText);
                    TweenLite.delayedCall(.05, posText);
                    //_scope.text.x = jks.Navigation.getTopNavPosition().x - 45;
                    _scope.text.y = 50;
                }
            }


        }


        textMaskWidth = 700;
        this.textMask = new PIXI.Sprite.fromImage(jks.DataHandler.getAssetByID('gradient_mask').src);
        this.textMask.x = 0;
        this.container.addChild(this.text);
        this.text.addChild(this.textMask)


        //this.text.mask = this.textMask;
        this.fieldType.mask = this.textMask;
        this.fieldDescription.mask = this.textMask;

        _scope.updateView();


        this.setCategory = function (text) {

            //console.log('setCategory', text)

            _scope.fieldCategory.setText(text)

            _scope.updateView();

        }

        this.setText = function (item) {

            console.log(':: setText')

            if (item.type == '') {
                _scope.fieldDescription.y = 30;
            } else {
                _scope.fieldDescription.y = 50;
            }

            if(item.description!=currentDescription) {
                TweenLite.to(_scope.textMask, .4, {
                    alpha: 1,
                    x: -textMaskWidth,
                    ease: Cubic.easeIn,
                    onComplete: setText
                })
            }




            function setText() {
                _scope.fieldType.setText(item.type)
                _scope.fieldDescription.setText(item.description);
                currentDescription = item.description;

                TweenLite.to(_scope.textMask, 1.5, {
                    delay: .3,
                    alpha: 1,
                    x: 0,
                    ease: Sine.easeOut,
                })

                //TweenLite.to(_scope.text, .5, {delay: .3, alpha: 1, ease: Cubic.easeOut})
            }

            _scope.updateView();

        }


        this.hide = function () {
            _scope.container.visible = false;
        }

        this.show = function () {
            _scope.container.visible = true;
        }

        //init();


    }

    jks.TextField = TextField;

}());