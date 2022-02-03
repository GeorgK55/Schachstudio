// Es müssen diese Aktionen in jeder Funktion ausgeführt werden:
// Alle Sections schließen und die ausgewählte anzeigen
// Die zur Section gehörende stockfishEngine starten
// Alle Listener für die Schachevents ausschalten und die des ausgewählten Contextes einschalten

function showNeueAufgabe() {

    $( "[id^='s_']" ).hide();
    $('#s_NeueAufgabe').show();

    $('#ul_importaufgaben').empty();
    $('#ImportAreaText').empty();

    BrettLeeren('Brett_ImportAufgabe');

    $('#ScrollWrapperImport').empty()
        .append('<div id="TreeNotationslisteImport"></div>');

    console.clear();
    $('#logliste').empty();

    TheIndexGeorgFunction();
    //TheIndexExperimentFunction();
};

// Alternative zur eigenen Darstellung: hier wird lichess in einem frame eingeblendet
function showChallengelichess(ChallengeID, lichessdata) {

    $( "[id^='s_']" ).hide();
    $('#s_lichess').show();

//<iframe width=600 height=371 src="https://lichess.org/study/embed/xgTQJ6HF/04tEMyPj#0" frameborder=0></iframe>
//$("#iframeframe").empty().append("<iframe width=600 height=371 src='https://lichess.org/study/embed/" + lichessdata + "' frameborder=0></iframe>");
$("#iframeframe").empty().append("<iframe width=600 height=371 src='https://lichess.org/study/embed/xgTQJ6HF/04tEMyPj#0' frameborder=0></iframe>");

}

function showChallengegeorg(ChallengeID) {

    $( "[id^='s_']" ).hide();
    $('#s_AufgabenSpielen').show();

    if($._data($("#TriggerTag")[0], "events") != undefined) {
        stockFish.postMessage('quit');
    }

    // hier, obwohl nicht in allen Spielinteraktionen nötig
    TheIndexGeorgFunction();
    //TheIndexExperimentFunction();
		
    console.clear();
    $('#logliste').empty();

    $( "#cb_Enginelog" ).prop( "checked", false );
    $( "#cb_EngineEin" ).prop( "checked", true );
    $( "#cb_EngineAus" ).prop( "checked", true );

    Stellungsdaten.init();

    $('#ScrollWrapperPlay').empty()
    .append('<div id="TreeNotationslistePlayChallenge"></div>');

    // NotationstabelleAufgabe initiieren
    $('#TreeNotationslistePlayChallenge').empty()
        .append('<ul></ul>')
        .jstree({   'plugins':  [ "themes" ],
                    'core' :    { 
                                    'check_callback':   true,
                                    'open_parents':     true,
                                    'load_open':        true,
                                    'themes':           { 'icons': false }
    }});
    $('#TreeNotationslistePlayChallenge').jstree().create_node('#', {
        "id": Stellungsdaten.PreNodeId,
        "text": "o"
    }, "last", function() {
        //alert("PreNodeId created");
    });

    switch ($('input[name="Spielinteraktion"]:checked').val()) {
        case "Spiel":
            GlobalActionContext = AC_CHALLENGE_PLAY;
            break;
        case "Hinweise":
            GlobalActionContext = AC_CHALLENGE_RATING;
            break;
        case "Varianten":
            GlobalActionContext = AC_CHALLENGE_Varianten;
            Stellungsdaten.CreateNewNode = true;
            break;
        default:
            GlobalActionContext = AC_CHALLENGE_Varianten;
            Stellungsdaten.CreateNewNode = true;
            break;                                
    }


    $('[id^=Brett_SpieleAufgabe_]')
    .mousedown(function(evx) {

        if(evx.target.innerText != "") { // nur dann steht eine Figur auf dem Feld

            T_Zuege.ZugVon      = evx.target.id.slice(-2);
            T_Zuege.ZugFigur    = evx.target.id.slice(0, 1);

            MoveMouseDown = true;
        }
        evx.preventDefault();
    })
    .mouseup(function(evx) {

        if(MoveMouseDown) {

            console.log('mouseup event.target.id: ' + evx.target.id);

            MoveMouseDown   = false;
            T_Zuege.ZugNach = evx.target.id.slice(-2);
            evx.preventDefault();

            firePlayerMove();
        }
 
    });

    MoveMouseDown   = false;

    $('[id^=Brett_SpieleAufgabe_]')
    .on('touchstart',function(evx) {
        console.log('touchstart' + evx.originalEvent.srcElement);

        T_Zuege.ZugVon      = evx.target.id.slice(-2);
        T_Zuege.ZugFigur    = evx.target.id.slice(0, 1);

        MoveMouseDown = true;
        evx.preventDefault();
    })
    .on('touchmove',function(evx) {
        //console.log(evx.changedTouches[0]);
        //console.log(evx.targetTouches.length);
        //console.log(evx.changedTouches.length);
        evx.preventDefault();
    })
    .on('touchend',function(evx) {
        console.log('touchend  ' + evx.originalEvent.srcElement);
        console.log('x und y  ' + evx.changedTouches[0].pageX + ' ' + evx.changedTouches[0].pageY);

        var endTarget = document.elementFromPoint(
            evx.changedTouches[0].pageX,
            evx.changedTouches[0].pageY - window.scrollY
        ).id.slice(-2);
      
        T_Zuege.ZugNach = endTarget;
        evx.preventDefault();

        firePlayerMove();
    })
    ;

    var a8 = document.getElementById('Brett_SpieleAufgabe_a8').getBoundingClientRect();
    //var h8 = document.getElementById('Brett_SpieleAufgabe_h8').getBoundingClientRect();

    var filebase = a8.left;
    var rankbase = a8.top;
    var fieldsize = a8.height; // Es müssen Quadrate sein
    filebounds = [];
    rankbounds = [];
    for (i = 0; i < 8; i++) {
        filebounds.push(filebase + fieldsize * i);
        rankbounds.push(rankbase + fieldsize * i);
    }

    Felder = [];
    var dummy = $('[id^=Brett_SpieleAufgabe_]').each(function(idx, elem) {
        var i = 0;
        Felder.push(elem.getBoundingClientRect());
        //document.getElementById(elem.id).addEventListener("touchstart", touchstartfunction);
        //document.getElementById(elem.id).addEventListener("touchmove", touchmovefunction);
        //document.getElementById(elem.id).addEventListener("touchend", touchendfunction);

    });
    //
    var k = 0;

    function touchstartfunction(evx) {
        var j = 0; 
    }
    function touchmovefunction(evx) {
        var j = 0; 
    }
    function touchendfunction(evx) {
         var endTarget = document.elementFromPoint(
            evx.changedTouches[0].pageX,
            evx.changedTouches[0].pageY
        );

        var dummy = evx.target.getBoundingClientRect();
        var dummy2 = evx.changedTouches[0];

       var j = 0; 
    }
	//$('#ThemaId').addEventListener('touchstart',jumpToPosition);

    getChallenge(ChallengeID); 

}

function showPartieSpielen() {

    $( "[id^='s_']" ).hide();
    $('#s_PartieSpielen').show();

    $("#PlayTriggerTag").trigger("quit");

    TheOriginalIndexFunction();
    //TheOriginalIndexWithLogFunction();
}

function showEnginedialog() {

    GlobalActionContext = AC_ENGINEDIALOG;

    //stockFish.postMessage('quit');
    TheIndexGeorgFunction();
    //TheIndexExperimentFunction();

    console.clear();
    $('#logliste').empty();

    $( "[id^='s_']" ).hide();
    $('#s_EngineDialog').show();

    /*
    $.ajax({
        url : "kommandos.txt",
        dataType: "text",
        success : function (data) {

            jQuery.each( data.split("\n"), function( i, val ) {
                $('<p>' + val + '</p>').appendTo("#Kommandoarchiv");
              
            });

            $('#Kommandoarchiv p').click(function() {
                $('#Kommandostart').val(event.srcElement.innerText);		
            });            
        }
    });
    */

}

function showSpielerinfo() {

    $( "[id^='s_']" ).hide();
    $('#s_Spielerinfo').show();

    $.ajax({
        url :       "spielerinfo.html",
        dataType:   "text",
        success :   function (data) { $(data).appendTo("#Spielerinfo_div"); }
    });

}

function showTrainerinfo() {

    //$( "[id^='s_']" ).hide();
    //$('#s_Trainerinfo').show();

}
