/**
 * Created by STORMSEN on 12.08.2016.
 */


this.jks = this.jks || {};


( function () {

    var _scope;
    var _textSizeDefault = 18;
    var _textSizeMobile = 23;
    var _paddingSide = 10;
    var _paddingTop = 10;

    function TopNavButton(navPoint, id) {
        _scope = this;

        this.s = {
            onTap: new signals.Signal()
        };

        //console.log('topNav', id)

        //this.id = navPoint.selectionID;

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
        this.shape.beginFill(0x00dd00);
        this.shape.drawRect(0, 0, this.textField.width + _paddingSide * 2, this.textField.height + _paddingTop * 2);
        this.shape.endFill;
        this.shape.alpha = 0;

        this.line = new PIXI.Graphics();
        this.line.lineStyle(1, 0x408080, 1);
        this.line.moveTo(0, this.textField.height + _paddingTop);
        this.line.lineTo(this.textField.width + _paddingSide * 2, this.textField.height + _paddingTop);
        this.line.alpha = 0;


        this.container.addChild(this.shape);
        this.container.addChild(this.textField);
        this.container.addChild(this.line);

        this.centerText = function () {
            this.textField.x = this.shape.width * .5 - this.textField.width * .5;
            this.textField.y = this.shape.height * .5 - this.textField.height * .5;

            this.line.clear();
            this.line.lineStyle(1, 0x408080, 1);
            this.line.moveTo(0, this.textField.height + _paddingTop);
            this.line.lineTo(this.textField.width + _paddingSide * 2, this.textField.height + _paddingTop);
        }

        this.setText = function () {
            this.textField.x = this.shape.width - this.textField.width;
            this.textField.y = this.shape.height * .5 - this.textField.height * .5;

            this.line.clear();
            this.line.lineStyle(1, 0x408080, 1);
            this.line.moveTo(this.shape.width, this.textField.height + _paddingTop);
            this.line.lineTo(this.shape.width - this.textField.width, this.textField.height + _paddingTop);
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


        this.container.on('mousedown', onTap).on('touchstart', onTap);

        function onTap() {
            _scope.s.onTap.dispatch(navPoint.selectionID, id);
        }


    }

    jks.TopNavButton = TopNavButton;


}());