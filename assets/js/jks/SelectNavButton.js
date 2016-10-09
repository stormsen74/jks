/**
 * Created by STORMSEN on 12.08.2016.
 */


this.jks = this.jks || {};


( function () {

    var _scope;
    var _textSizeDefault = 23;
    var _textSizeMobile = 23;
    var _paddingSide = 10;
    var _paddingTop = 10;
    var _scale = .45; //[.37]

    function SelectNavButton(imgSrc, category, selectionID) {

        _scope = this;

        this.s = {
            onTapSelect: new signals.Signal()
        };

        this.id = selectionID;

        function getRealImgWidth() {
            return _scale * 90 / .5;
        }


        //console.log(selectionID);


        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.buttonMode = true;



        this.container.on('mousedown', onTapSelect).on('touchstart', onTapSelect);


        function onTapSelect() {
            _scope.s.onTapSelect.dispatch(selectionID);
        }


        this.textField = new PIXI.Text(category, {
            fontFamily: 'Linotype Feltpen W01 Medium',
            fontSize: _textSizeDefault,
            fill: jks.Config.getColor('blue'),
            align: 'left'
        });
        this.textField.x = getRealImgWidth() + _paddingSide;
        this.textField.y = getRealImgWidth() * .5 - this.textField.height * .5;
        console.log('°', getRealImgWidth())


        var sprite = new PIXI.Sprite.fromImage(imgSrc)
        sprite.scale.x = sprite.scale.y = _scale;


        this.shape = new PIXI.Graphics();
        //this.shape.lineStyle(1, 0xcc0000, 1);
        this.shape.beginFill(0x00dd00);
        this.shape.drawRect(0, 0, this.textField.width + _paddingSide * 2, this.textField.height + _paddingTop * 2);
        this.shape.endFill;
        this.shape.alpha = 0;
        this.shape.x = 0;


        this.container.addChild(sprite);
        this.container.addChild(this.shape);
        this.container.addChild(this.textField);


        this.container.x -= getRealImgWidth() ;
        this.container.y = selectionID * (getRealImgWidth() + _paddingTop);


        this.centerText = function () {
            this.textField.x = this.shape.width * .5 - this.textField.width * .5;
            this.textField.y = this.shape.height * .5 - this.textField.height * .5;
        }

        this.setText = function () {
            this.textField.x = this.shape.width - this.textField.width;
            this.textField.y = this.shape.height * .5 - this.textField.height * .5;
        }


        //this.centerText();


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

    jks.SelectNavButton = SelectNavButton;


}());