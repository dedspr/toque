
function myEventHandler() {
    "use strict" ;

    var ua = navigator.userAgent ;
    var str ;

    if( window.Cordova && dev.isDeviceReady.c_cordova_ready__ ) {
            str = "It worked! Cordova device ready detected at " + dev.isDeviceReady.c_cordova_ready__ + " milliseconds!" ;
    }
    else if( window.intel && intel.xdk && dev.isDeviceReady.d_xdk_ready______ ) {
            str = "It worked! Intel XDK device ready detected at " + dev.isDeviceReady.d_xdk_ready______ + " milliseconds!" ;
    }
    else {
        str = "Bad device ready, or none available because we're running in a browser." ;
    }

    alert(str) ;
}


$(function () {

    $("#menu").html('<ul class="navbar-nav">\
                        <li class="nav-item">\
                            <a class="nav-link" href="index.html">\
                                <i class="now-ui-icons education_paper"></i>\
                                <p>Início</p>\
                            </a>\
                        </li>\
                        <li class="nav-item">\
                            <a class="nav-link" href="agenda.html">\
                                <i class="now-ui-icons ui-1_calendar-60"></i>\
                                <p>Agenda</p>\
                            </a>\
                        </li>\
                        <li class="nav-item">\
                            <a class="nav-link" href="mapa.html">\
                                <i class="now-ui-icons location_world"></i>\
                                <p>Mapa</p>\
                            </a>\
                        </li>\
                        <li class="nav-item">\
                            <a class="nav-link" href="afinador.html">\
                                <i class="now-ui-icons media-2_sound-wave"></i>\
                                <p>Afinador</p>\
                            </a>\
                        </li>\
                        <li class="nav-item">\
                            <a class="nav-link" href="metronomo.html">\
                                <i class="now-ui-icons tech_headphones"></i>\
                                <p>Metrônomo</p>\
                            </a>\
                        </li>\
                        <li class="nav-item">\
                            <a class="nav-link btn btn-neutral" href="cursos.html">\
                                <i class="now-ui-icons business_bulb-63"></i>\
                                <p>Cursos</p>\
                            </a>\
                        </li>\
                        <li class="nav-item">\
                            <a class="nav-link" href="convide.html">\
                                <i class="now-ui-icons users_circle-08"></i>\
                                <p>Convide um amigo</p>\
                            </a>\
                        </li>\
                    </ul>');

});