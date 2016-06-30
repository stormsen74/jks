/**
 * Created by STORMSEN on 29.03.2016.
 */


this.GGHL = this.GGHL || {};


( function () {


    var _scope, _screen;
    var _m_1, _m_2, _m_3;
    var _w_1, _w_2, _w_3;
    var _styles = [
        {
            txt: 'WASSER LAUT',
            color: '#3268ae'
        },
        {
            txt: 'WASSER LEISE',
            color: '#b1d3ff'
        },
        {
            txt: 'CLUB MATE',
            color: '#1a325d'
        },
        {
            txt: 'COKE',
            color: '#d00110'
        },
        {
            txt: 'COKE LIGHT',
            color: '#bababb'
        },
        {
            txt: 'COKE ZERO',
            color: '#171516'
        },
        {
            txt: 'APFELSCHORLE',
            color: '#fee34c'
        },
        {
            txt: 'RHABARBERSCHORLE',
            color: '#feb986'
        },
        {
            txt: 'TUTTI',
            color: '#ff7e00'
        },
        {
            txt: 'OSA',
            color: '#ffc600'
        },
        {
            txt: 'BECKS',
            color: '#067c09'
        },
        {
            txt: 'BECKS LEMMON',
            color: '#93c214'
        },
        {
            txt: 'CARLSBERG',
            color: '#058b4b'
        },
        {
            txt: 'FANTA',
            color: '#feaa1c'
        },
        {
            txt: 'G‘SPRITZTER',
            color: '#c7b069'
        },
        {
            txt: 'NOT ENOUGH DATA ...',
            color: '#585858'
        }
    ]

    function View_Vs() {
        _scope = this;
        this.isActive = false;

        this.setOrder = function (json, _animate) {

            _animate = _animate || false;

            // console.log('setOrder', json[0][0].sort, json[0][1].sort,json[0][2].sort);

            if (json[0].length >= 3 && json[1].length >= 3) {

                var m = json[0];
                var w = json[1];

                update_M([m[0].sort - 1, m[1].sort - 1, m[2].sort - 1], _animate);
                update_W([w[0].sort - 1, w[1].sort - 1, w[2].sort - 1], _animate);

            } else {

                update_M([13, 13, 13], _animate);
                update_W([13, 13, 13], _animate);

            }

        };


        this.show = function () {
            //console.log('show');
            _scope.isActive = true;

            setInitialGFX();

            TweenLite.set(_screen, {display: 'block'});


            TweenLite.to(_w_3, .5, {delay: .0, scale: 1, ease: Back.easeOut});
            TweenLite.to(_m_3, .5, {delay: .2, scale: 1, ease: Back.easeOut});

            TweenLite.to(_w_2, .5, {delay: .4, scale: 1, ease: Back.easeOut});
            TweenLite.to(_m_2, .5, {delay: .6, scale: 1, ease: Back.easeOut});

            TweenLite.to(_w_1, .5, {delay: .8, scale: 1, ease: Back.easeOut});
            TweenLite.to(_m_1, .5, {delay: 1.0, scale: 1, ease: Back.easeOut})

        };

        this.hide = function () {
            _scope.isActive = false;
            TweenLite.set(_screen, {display: 'none'});
        };


        function setInitialGFX() {
            TweenLite.set([_m_1, _m_2, _m_3, _w_1, _w_2, _w_3], {
                scale: 0,
            })
        };

        function update_M(_order, _animate) {

            _animate = _animate || false;

            if (_animate) {

                TweenLite.to(_m_1, .5, {backgroundColor: _styles[_order[0]].color, ease: Cubic.easeInOut});
                TweenLite.to(_m_1.children[1], .5, {text: _styles[_order[0]].txt, ease: Cubic.easeInOut});

                TweenLite.to(_m_2, .5, {delay: .5, backgroundColor: _styles[_order[1]].color, ease: Cubic.easeInOut});
                TweenLite.to(_m_2.children[1], .5, {delay: .5, text: _styles[_order[1]].txt, ease: Cubic.easeInOut});

                TweenLite.to(_m_3, .5, {delay: 1, backgroundColor: _styles[_order[2]].color, ease: Cubic.easeInOut});
                TweenLite.to(_m_3.children[1], .5, {delay: 1, text: _styles[_order[2]].txt, ease: Cubic.easeInOut});

            } else {

                TweenLite.set(_m_1, {backgroundColor: _styles[_order[0]].color});
                TweenLite.set(_m_1.children[1], {text: _styles[_order[0]].txt});

                TweenLite.set(_m_2, {backgroundColor: _styles[_order[1]].color});
                TweenLite.set(_m_2.children[1], {text: _styles[_order[1]].txt});

                TweenLite.set(_m_3, {backgroundColor: _styles[_order[2]].color});
                TweenLite.set(_m_3.children[1], {text: _styles[_order[2]].txt});

            }

        }

        function update_W(_order, _animate) {

            _animate = _animate || false;

            if (_animate) {

                TweenLite.to(_w_1, .5, {backgroundColor: _styles[_order[0]].color, ease: Cubic.easeInOut});
                TweenLite.to(_w_1.children[1], .5, {text: _styles[_order[0]].txt, ease: Cubic.easeInOut});

                TweenLite.to(_w_2, .5, {delay: .5, backgroundColor: _styles[_order[1]].color, ease: Cubic.easeInOut});
                TweenLite.to(_w_2.children[1], .5, {delay: .5, text: _styles[_order[1]].txt, ease: Cubic.easeInOut});

                TweenLite.to(_w_3, .5, {delay: 1, backgroundColor: _styles[_order[2]].color, ease: Cubic.easeInOut});
                TweenLite.to(_w_3.children[1], .5, {delay: 1, text: _styles[_order[2]].txt, ease: Cubic.easeInOut});

            } else {

                TweenLite.set(_w_1, {backgroundColor: _styles[_order[0]].color});
                TweenLite.set(_w_1.children[1], {text: _styles[_order[0]].txt});

                TweenLite.set(_w_2, {backgroundColor: _styles[_order[1]].color});
                TweenLite.set(_w_2.children[1], {text: _styles[_order[1]].txt});

                TweenLite.set(_w_3, {backgroundColor: _styles[_order[2]].color});
                TweenLite.set(_w_3.children[1], {text: _styles[_order[2]].txt});

            }

        }


        function init() {

            console.log('init => STATS.View_Vs!');

            _screen = document.getElementById('screen_vs');

            _m_1 = document.getElementById('m_1');
            _m_2 = document.getElementById('m_2');
            _m_3 = document.getElementById('m_3');

            _w_1 = document.getElementById('w_1');
            _w_2 = document.getElementById('w_2');
            _w_3 = document.getElementById('w_3');

            //update_M([3, 7, 6])
            //update_W([0, 1, 2])


            //TweenLite.delayedCall(2, test);
            function test() {
                update_M([2, 9, 12], true)
                update_W([4, 6, 5], true)
            }


        }

        init();
    }

    GGHL.View_Vs = View_Vs;

}());