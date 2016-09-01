/**
 * Created by STORMSEN on 12.08.2016.
 */

/**
 * Created by STORMSEN on 12.08.2016.
 */




this.jks = this.jks || {};


( function () {


    function Router() {


        console.log('init - Router');


// http://www.codesandnotes.be/2014/09/07/low-footprint-client-side-routing-using-crossroads-js/

        // Define the routes
        crossroads.addRoute('/', function () {
            //console.log('index')
        });
        crossroads.addRoute('/user/{userId}', function (userId) {
            console.log('user', userId);
        });
        crossroads.addRoute('/schmuck/zeitlos', function () {
            console.log('/schmuck/zeitlos');
        });
        crossroads.addRoute('/page/imprint', function (userId) {
            console.log('imprint');
        });
        crossroads.bypassed.add(function (request) {
            console.error(request + ' seems to be a dead end...');
        });

        //Listen to hash changes
        window.addEventListener("hashchange", function () {
            var route = '/';
            var hash = window.location.hash;
            if (hash.length > 0) {
                route = hash.split('#').pop();
            }
            crossroads.parse(route);
        });

        // trigger hashchange on first page load
        // window.dispatchEvent(new CustomEvent("hashchange"));


        //#hasher
        //setup hasher
        function parseHash(newHash, oldHash) {
            crossroads.parse(newHash);
        }

        hasher.initialized.add(parseHash); //parse initial hash
        //    hasher.changed.add(parseHash); //parse hash changes
        hasher.init(); //start listening for history change


        document.body.addEventListener('click', function () {
            //update URL fragment generating new history record
            hasher.setHash('user/23');
        })


        //this.do = function () {
        //    console.log(config.getParam())
        //}


    }

    jks.Router = Router;

}());