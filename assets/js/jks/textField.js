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

        console.log('init - Navigation');

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


        this.updateView = function () {
            //_logo.x = jks.View.getScreenWidth();
            _scope.text.x = jks.View.getScreenWidth() - this.text.width - 20;
            _scope.text.y = 30;
        }
        //this.text.x = 200;
        //this.text.y = 200;
        _scope.container.addChild(this.text);
        _scope.updateView();

        //jks.View.addNavigationContainer(_scope.container);


        this.setCategory = function (text) {

            //console.log('setCategory', text)

            _scope.fieldCategory.setText(text)
            //_scope.fieldDescription.setText(item.description);

            _scope.updateView();

            //initKeyMode();
            //TweenLite.delayedCall(2, initGFX)
        }

        this.setText = function (item) {

            //console.log(item.description)

            _scope.fieldType.setText(item.type)
            _scope.fieldDescription.setText(item.description);

            _scope.updateView();

            //initKeyMode();
            //TweenLite.delayedCall(2, initGFX)
        }

        //init();


    }

    jks.TextField = TextField;

}());