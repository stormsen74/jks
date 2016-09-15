/**
 * Created by STORMSEN on 12.08.2016.
 */

/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _scope;



    function Navigation() {
        _scope = this;

        this.s = {
            onKeyDownEvent: new signals.Signal()
        };

        console.log('init - Navigation');


        document.onkeydown = function(e) {
            switch (e.keyCode) {
                case 39:
                    _scope.s.onKeyDownEvent.dispatch('next');
                    //alert('right');
                    break;
                case 37:
                    _scope.s.onKeyDownEvent.dispatch('prev');
                    //alert('left');
                    break;
                case 38:
                    //alert('up');
                    break;
                case 40:
                    //alert('down');
                    break;
            }
        };



        function init() {
        }




        init();


    }

    jks.Navigation = Navigation;

}());