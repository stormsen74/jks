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


        this.textField.style.fill = 0xffcc33

        var light_blue = jks.Config.getColor('light_blue');
        var blue = jks.Config.getColor('blue');
        var white = 0x75dada

        var colors = {
            'home_portrait': [blue, light_blue, light_blue, white, white],
            'home_landscape': [white, white, white, white, white],
            'default': [blue, blue, blue, blue, blue]
        }


        this.setTextColor = function (type) {
            this.textField.style.fill = colors[type][selectionID];
        }

        var sprite = new PIXI.Container();
        var selectImage = new PIXI.Sprite.fromImage(imgSrc);
        var selectShape = new PIXI.Sprite.fromImage(jks.DataHandler.getAssetByID('navSelectBackground').src);
        selectShape.visible = false;
        sprite.addChild(selectShape);
        sprite.addChild(selectImage);


        this.shape = new PIXI.Graphics();
        this.shape.beginFill(0x834198);
        this.shape.drawRect(0, 0, getRealImgWidth() + this.textField.width + _paddingSide * 2, getRealImgWidth());
        this.shape.endFill;
        this.shape.alpha = 0;
        this.shape.x = 0;


        this.container.addChild(sprite);
        this.container.addChild(this.shape);
        this.container.addChild(this.textField);


        this.switchMobile = function () {
            _scale = .37;
            sprite.scale.x = sprite.scale.y = _scale;

            //left
            this.textField.x = -this.textField.width - _paddingSide;
            this.textField.y = this.shape.height * .5 - this.textField.height * .5;
            this.shape.width = getRealImgWidth() + this.textField.width + _paddingSide;
            this.shape.height = getRealImgWidth();
            this.shape.x = -this.textField.width - _paddingSide;


        }


        this.switchDefault = function () {
            //console.log('switchDefault')
            jks.Config.getDeviceType() == 'mobile' ? _scale = .37 : _scale = .45;
            sprite.scale.x = sprite.scale.y = _scale;


            //right
            this.textField.x = getRealImgWidth() + _paddingSide;
            this.textField.y = getRealImgWidth() * .5 - this.textField.height * .5;
            this.shape.width = getRealImgWidth() + this.textField.width + _paddingSide;
            this.shape.height = getRealImgWidth();
            this.shape.x = 0;
        }

        this.portraitMode = function () {

            if (jks.Config.getDeviceType() == 'mobile') {
                //center bottom
                this.textField.x = -this.textField.width - _paddingSide;
                this.textField.y = this.shape.height * .5 - this.textField.height * .5;
                this.shape.width = getRealImgWidth() + this.textField.width + _paddingSide;
                this.shape.height = getRealImgWidth();
                this.shape.x = -this.textField.width - _paddingSide;

                //this.textField.style.fill = jks.Config.getColor('blue');
            }

        }

        this.landscapeMode = function () {

            // set Bottom
            this.textField.x = getRealImgWidth() * .5 - this.textField.width * .5;
            this.textField.y = getRealImgWidth();
            this.shape.width = this.textField.width;
            this.shape.height = getRealImgWidth() + this.textField.height;
            this.shape.x = this.textField.x;


            if (jks.Config.getDeviceType() == 'mobile') {
                //this.textField.style.fill = jks.Config.getColor('lighter_blue');
            }


        }

        this.select = function () {
            selectShape.visible = true;
            selectImage.alpha = .5;
        }

        this.unselect = function () {
            selectShape.visible = false;
            selectImage.alpha = 1;
        }

        this.setColor = function (clr) {
            console.log('set', clr)
            _scope.textField.style.fill = clr;
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