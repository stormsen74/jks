/**
 * Created by STORMSEN on 29.03.2016.
 */


this.GGHL = this.GGHL || {};


( function () {

    var _scope;

    var _requestHandler = new GGHL.RequestHandler();

    var _view_verbrauch = new GGHL.View_Verbrauch();
    var _view_vs = new GGHL.View_Vs();
    var _view_masterbrain = new GGHL.View_MasterBrain();
    var _view_idee = new GGHL.View_Idee();

    var UPDATE_REQUEST_TIME = 10;
    var NUM_VIEWS = 4;

    var _select_1, _select_2, _select_3, _select_4;
    var _currentSelectedViewID;
    var _currentSelectedView;
    var _selectas;

    function Stats_Controller() {
        _scope = this;


        /*---------------------------------------------------------
         PAGINATION / SWITCH VIEWS
         ---------------------------------------------------------*/

        function initPagination() {

            _select_1 = document.getElementById('select_1');
            _select_2 = document.getElementById('select_2');
            _select_3 = document.getElementById('select_3');
            _select_4 = document.getElementById('select_4');
            _select_1.id = 0;
            _select_2.id = 1;
            _select_3.id = 2;
            _select_4.id = 3;
            _selectas = [_select_1, _select_2, _select_3, _select_4];


            // listener
            for (var i = 0; i < _selectas.length; i++) {
                TweenLite.to(_selectas[i], .3, {opacity: .3});
                $(_selectas[i]).on('click', function (e) {
                    var id = e.target.id;
                    if (id != _currentSelectedViewID) {
                        select(id);
                    }
                })
            }

            select(0);

        }

        this.next = function () {
            console.log('Stats_Controller: next')
            if (_currentSelectedViewID + 1 < NUM_VIEWS) {
                select(_currentSelectedViewID + 1)
            } else {
                select(0)
            }
        };

        this.prev = function () {
            console.log('Stats_Controller: prev')
            if (_currentSelectedViewID + 1 > 1) {
                select(_currentSelectedViewID - 1)
            } else {
                select(NUM_VIEWS - 1)
            }
        };


        function select(id) {
            console.log('select', id);

            for (var i = 0; i < _selectas.length; i++) {
                TweenLite.to(_selectas[i], .3, {opacity: .3});
            }

            TweenLite.to(_selectas[id], .5, {opacity: 1, ease: Sine.easeOut});

            _currentSelectedViewID = id;

            /*---------------------------------------------------------
             SWITCH VIEWS
             ---------------------------------------------------------*/

            if (_currentSelectedView) _currentSelectedView.hide();

            resetRequestCalls();

            if (_currentSelectedViewID == 0) {
                _requestHandler.getLiterPerWeek();
                TweenLite.delayedCall(UPDATE_REQUEST_TIME, updateRequest_getLiterPerWeek);
                _currentSelectedView = _view_verbrauch;
            }

            if (_currentSelectedViewID == 1) {
                _requestHandler.getStatsForWeekAndGender();
                TweenLite.delayedCall(UPDATE_REQUEST_TIME, updateRequest_getStatsForWeekAndGender);
                _currentSelectedView = _view_vs;
            }

            if (_currentSelectedViewID == 2) {
                _requestHandler.getAllFromToday();
                _currentSelectedView = _view_masterbrain;
            }

            if (_currentSelectedViewID == 3) {
                _view_idee.show();
                _currentSelectedView = _view_idee;
            }


        }

        function resetRequestCalls() {
            TweenLite.killDelayedCallsTo(updateRequest_getStatsForWeekAndGender);
            TweenLite.killDelayedCallsTo(updateRequest_getLiterPerWeek);
        }


        function updateRequest_getLiterPerWeek() {
            //console.log('updateRequest_getLiterPerWeek');
            _requestHandler.getLiterPerWeek();
            TweenLite.delayedCall(UPDATE_REQUEST_TIME, updateRequest_getLiterPerWeek);
        }

        function updateRequest_getStatsForWeekAndGender() {
            //console.log('updateRequest_getStatsForWeekAndGender');
            _requestHandler.getStatsForWeekAndGender();
            TweenLite.delayedCall(UPDATE_REQUEST_TIME, updateRequest_getStatsForWeekAndGender);
        }

        /*---------------------------------------------------------
         RESPONSE
         ---------------------------------------------------------*/

        // view 0 / verbrauch
        function onResponse_LiterPerWeek(json) {
            //console.log('onResponse_LiterPerWeek', _view_verbrauch.isActive);

            var _a = ['', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (var i = 0, len = json.length; i < len; i++) {
                //console.log(json[i].sort, i)
                _a[json[i].sort] = parseInt(json[i].anzahl);
            }

            // set count
            _view_verbrauch.setCount(_a);

            if (!_view_verbrauch.isActive) {
                _view_verbrauch.show();
            } else {
                _view_verbrauch.updateCount();
            }
        }

        // view 1 / vs
        function onResponse_getStatsForWeekAndGender(json) {
            //console.log('onResponse_getStatsForWeekAndGender', json);


            if (!_view_vs.isActive) {
                _view_vs.setOrder(json);
                _view_vs.show();
            } else {
                _view_vs.setOrder(json, true);
            }
        }

        // view 2 / masterbrain
        function onResponse_getAllFromToday(json) {
            _view_masterbrain.show(json);

        }


        this.pushDrink = function (_drink) {
            if(_view_masterbrain.isActive) {
                _view_masterbrain.pushDrink(_drink)
            }
            // console.log('pushDrink', _drink);
        }


        /*---------------------------------------------------------
         DAT / GUI / UI
         ---------------------------------------------------------*/

        //TODO https://craig.is/killing/mice

        function requestFullScreen() {

            var el = document.body;

            // Supports most browsers and their versions.
            var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen
                || el.mozRequestFullScreen || el.msRequestFullScreen;

            if (requestMethod) {

                // Native full screen.
                requestMethod.call(el);

            } else if (typeof window.ActiveXObject !== "undefined") {

                // Older IE.
                var wscript = new ActiveXObject("WScript.Shell");

                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                }
            }
        }

        function initShortCuts() {
            console.log('initShortCuts');

            Mousetrap.bind('shift+f', function (e) {
                console.log('fullscreen!');
                requestFullScreen();
                return false;
            });

            Mousetrap.bind('1', function (e) {
                var _id = 0;
                if (_id != _currentSelectedViewID) {
                    select(_id);
                }
                return false;
            });
            Mousetrap.bind('2', function (e) {
                var _id = 1;
                if (_id != _currentSelectedViewID) {
                    select(_id);
                }
                return false;
            });
            Mousetrap.bind('3', function (e) {
                var _id = 2;
                if (_id != _currentSelectedViewID) {
                    select(_id);
                }
                return false;
            });
            Mousetrap.bind('4', function (e) {
                var _id = 3;
                if (_id != _currentSelectedViewID) {
                    select(_id);
                }
                return false;
            });

        }


        /*---------------------------------------------------------
         INIT
         ---------------------------------------------------------*/

        function init() {

            console.log('init => STATS.Controller!');


            _requestHandler.s.onResponse_LiterPerWeek.add(onResponse_LiterPerWeek);
            _requestHandler.s.onResponse_getStatsForWeekAndGender.add(onResponse_getStatsForWeekAndGender);
            _requestHandler.s.onResponse_getAllFromToday.add(onResponse_getAllFromToday);


            initPagination();
            initShortCuts();

            // test calls!!!
            //_requestHandler.getLiterPerWeek();
            //TweenLite.delayedCall(4, _requestHandler.getLiterPerWeek_TEST);

            //TODO -> updateInterval if seleceted View!

        }


        init();
    }

    GGHL.Stats_Controller = Stats_Controller;

}());