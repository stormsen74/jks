/**
 * Created by STORMSEN on 12.08.2016.
 */


this.jks = this.jks || {};


( function () {

    var _scope;
    var _textSizeDefault = 16;
    var _textSizeMobile = 23;
    var _paddingSide = 10;
    var _paddingTop = 10;

    function TopNavButton(navPoint) {
        _scope = this;

        this.s = {
            onNavSelect: new signals.Signal()
        };

        this.id = navPoint;


        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.buttonMode = true;

        this.textField = new PIXI.Text(navPoint.title, {
            fontFamily: 'Linotype Feltpen W01 Medium',
            fontSize: _textSizeDefault,
            fill: jks.Config.getColor('blue'),
            align: 'left'
        });


        this.shape = new PIXI.Graphics();
        //this.shape.lineStyle(1, 0xcc0000, 1);
        this.shape.beginFill(0x00dd00);
        this.shape.drawRect(0, 0, this.textField.width + _paddingSide * 2, this.textField.height + _paddingTop * 2);
        this.shape.endFill;
        this.shape.alpha = 0;


        this.container.addChild(this.shape);
        this.container.addChild(this.textField);

        this.centerText = function () {
            this.textField.x = this.shape.width * .5 - this.textField.width * .5;
            this.textField.y = this.shape.height * .5 - this.textField.height * .5;
        }

        this.setText = function () {
            this.textField.x = this.shape.width - this.textField.width;
            this.textField.y = this.shape.height * .5 - this.textField.height * .5;
        }


        this.centerText();


        this.switchMobile = function () {
            this.textField.style.fontSize = _textSizeMobile;
            this.textField.style.align = 'left';
            this.shape.width = 120;
            this.shape.x = _paddingSide;
            this.shape.height = this.textField.height + _paddingTop * 2;
            this.setText();
        }

        this.switchDefault = function () {
            this.textField.style.fontSize = _textSizeDefault;
            this.shape.width = this.textField.width + _paddingSide * 2;
            this.shape.height = this.textField.height + _paddingTop * 2;
            this.shape.x = 0;
            this.centerText();
        }


        this.getWidth = function () {
            return _scope.shape.width;
        }


    }

    jks.TopNavButton = TopNavButton;


}());