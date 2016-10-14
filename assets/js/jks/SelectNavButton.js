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
            fill: jks.Config.getColor('light_blue'),
            align: 'left'
        });
        // this.textField.x = getRealImgWidth() + _paddingSide;
        // this.textField.y = getRealImgWidth() * .5 - this.textField.height * .5;


        var sprite = new PIXI.Sprite.fromImage(imgSrc);
        // sprite.scale.x = sprite.scale.y = _scale;


        this.shape = new PIXI.Graphics();
        //this.shape.lineStyle(1, 0xcc0000, 1);
        this.shape.beginFill(0x834198);
        this.shape.drawRect(0, 0, getRealImgWidth() + this.textField.width + _paddingSide * 2, getRealImgWidth());
        this.shape.endFill;
        this.shape.alpha = .1;
        this.shape.x = 0;


        this.container.addChild(sprite);
        this.container.addChild(this.shape);
        this.container.addChild(this.textField);


        // this.container.x -= getRealImgWidth();
        // this.container.y = selectionID * (getRealImgWidth() + _paddingTop);


        // this.centerText = function () {
        //     this.textField.x = this.shape.width * .5 - this.textField.width * .5;
        //     this.textField.y = this.shape.height * .5 - this.textField.height * .5;
        // }
        //
        // this.setText = function () {
        //     this.textField.x = this.shape.width - this.textField.width;
        //     this.textField.y = this.shape.height * .5 - this.textField.height * .5;
        // }

        this.setLeft = function () {
            console.log('setLeft')
            this.textField.x = -this.textField.width - _paddingSide;
            this.textField.y = this.shape.height * .5 - this.textField.height * .5;
            this.shape.width = getRealImgWidth() + this.textField.width + _paddingSide;
            this.shape.height = getRealImgWidth();
            this.shape.x = -this.textField.width - _paddingSide;
            //this.textField.style.fill = jks.Config.getColor('light_blue');
        }


        this.setRight = function () {
            this.textField.x = getRealImgWidth() + _paddingSide;
            this.textField.y = getRealImgWidth() * .5 - this.textField.height * .5;
            //this.textField.style.fill = jks.Config.getColor('light_blue');
        }

        this.setBottom = function () {
            _scope.textField.x = getRealImgWidth() * .5 - _scope.textField.width * .5;
            _scope.textField.y = getRealImgWidth();
            _scope.shape.width = _scope.textField.width;
            _scope.shape.height = getRealImgWidth() + _scope.textField.height;
            _scope.shape.x = _scope.textField.x;
            console.log('setBottom', _scope.textField.y);
            //this.textField.style.fill = jks.Config.getColor('light_blue');
        }

        //this.setLeft();


        this.switchMobile = function () {
            console.log('switchMobile')
            _scale = .37;
            sprite.scale.x = sprite.scale.y = _scale;
            // this.container.y = selectionID * .8 * (getRealImgWidth() + _paddingTop);
            //this.textField.style.fontSize = _textSizeMobile;
            //this.container.y -= 15;
            //this.textField.style.align = 'left';
            //this.shape.width = 120;
            //this.shape.x = _paddingSide;
            //this.shape.height = this.textField.height + _paddingTop * 2;
            //this.setText();
            // device.portrait() ? _scope.portraitMode() : _scope.landscapeMode();

        }


        this.switchDefault = function () {
            console.log('switchDefault')
            _scale = .45;
            sprite.scale.x = sprite.scale.y = _scale;
            // this.container.y = selectionID * (getRealImgWidth() + _paddingTop);
            //this.textField.style.fontSize = _textSizeDefault;
            //this.shape.width = this.textField.width + _paddingSide * 2;
            //this.shape.height = this.textField.height + _paddingTop * 2;
            //this.shape.x = 0;
            //this.centerText();
            // device.portrait() ? _scope.portraitMode() : _scope.landscapeMode();
        }


        this.portraitMode = function () {
            // jks.Config.getDeviceType() == 'mobile' ? _scope.setLeft() : _scope.setRight();

            if(jks.Config.getDeviceType() == 'mobile') {
                this.textField.x = -this.textField.width - _paddingSide;
                this.textField.y = this.shape.height * .5 - this.textField.height * .5;
                this.shape.width = getRealImgWidth() + this.textField.width + _paddingSide;
                this.shape.height = getRealImgWidth();
                this.shape.x = -this.textField.width - _paddingSide;
            }

            // this.textField.x = getRealImgWidth() + _paddingSide;
            // this.textField.y = getRealImgWidth() * .5 - this.textField.height * .5;
            // this.shape.width = getRealImgWidth() + this.textField.width;
            // this.shape.height = getRealImgWidth();
            // this.shape.x = 0;
        }

        this.landscapeMode = function () {
            TweenLite.delayedCall(1, _scope.setBottom )
            // _scope.setBottom();

            // TODO funzt ...
            // this.textField.x = getRealImgWidth() * .5 - this.textField.width * .5;
            // this.textField.y = getRealImgWidth();
            // this.shape.width = this.textField.width;
            // this.shape.height = getRealImgWidth() + this.textField.height;
            // this.shape.x = this.textField.x;

        }


        this.update = function (_s) {
            sprite.scale.x = sprite.scale.y = _s * _scale;
            //sprite.scale.y = Math.min(_s, _scale);
        }

        // jks.Config.getDeviceType() == 'mobile' ? _scope.switchMobile() : _scope.switchDefault();
        // device.portrait() ? _scope.portraitMode() : _scope.landscapeMode();


        this.getRealImgWidth = function () {
            return getRealImgWidth();
        }

        this.getWidth = function () {
            return _scope.shape.width;
        }

        this.getHeight = function () {
            return _scope.shape.height;
        }


    }

    jks.SelectNavButton = SelectNavButton;


}());