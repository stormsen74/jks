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

        _scope.container.addChild(this.text);
        _scope.updateView();


        this.setCategory = function (text) {

            //console.log('setCategory', text)

            _scope.fieldCategory.setText(text)

            _scope.updateView();

        }

        this.setText = function (item) {

            //console.log(item.description)

            _scope.fieldType.setText(item.type)
            _scope.fieldDescription.setText(item.description);

            // align right
            //this.fieldDescription.style.align = 'right'
            //this.fieldType.x = this.fieldCategory.width - this.fieldType.width;
            //this.fieldDescription.x = this.fieldCategory.width - this.fieldDescription.width;

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