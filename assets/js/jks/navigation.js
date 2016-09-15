/**
 * Created by STORMSEN on 12.08.2016.
 */

/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {

    var _scope;

    this.s = {
        onKeyDownEvent: new signals.Signal()
    };


    function Navigation() {
        _scope = this;


        console.log('init - Navigation');
        //init();

        document.onkeydown = checkKey;

        function checkKey(e) {

            e = e || window.event;

            if (e.keyCode == '38') {
                // up arrow
            }
            else if (e.keyCode == '40') {
                // down arrow
            }
            else if (e.keyCode == '37') {
                // left arrow
                _scope.s.onKeyDownEvent.dispatch('prev');
            }
            else if (e.keyCode == '39') {
                // right arrow
                _scope.s.onKeyDownEvent.dispatch('next');
            }

        }


    }

    jks.Navigation = Navigation;

}());