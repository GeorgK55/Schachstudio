// Es müssen diese Aktionen in jeder Funktion ausgeführt werden:
// Alle Sections schließen und die ausgewählte anzeigen
// Die zur Section gehörende stockfishEngine starten
// Alle Listener für die Schachevents ausschalten und die des ausgewählten Contextes einschalten

function showNeueAufgabe() {

    $( "[id^='s_']" ).hide();
    $('#s_NeueAufgabe').show();

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
        //stockFish.postMessage('quit');
        sf.postMessage('quit');
    }

    TheIndexGeorgFunction();
    //TheIndexExperimentFunction();
		
    console.clear();
    $('#logliste').empty();

    $( "#cb_Enginelog" ).prop( "checked", false );
    $( "#cb_EngineEin" ).prop( "checked", true );
    $( "#cb_EngineAus" ).prop( "checked", true );
    
    // NotationstabelleAufgabe initiieren
    $('#NotationstabelleAufgabe').empty().append('<tr><th data-fen="unbenutzt"></th><th data-fen="unbenutzt">weiß</th><th data-fen="unbenutzt">schwarz</th></tr>');

    switch ($('input[name="Spielinteraktion"]:checked').val()) {
        case "Spiel":
            GlobalActionContext = AC_CHALLENGE_PLAY;
            break;
        case "Hinweise":
            GlobalActionContext = AC_CHALLENGE_RATING;
            break;
        case "Varianten":
            GlobalActionContext = AC_CHALLENGE_VARIATIONS;
            break;
        default:
            GlobalActionContext = AC_CHALLENGE_VARIATIONS;
            break;                                
    }


    $('[id^=Brett_SpieleAufgabe_]')
    .mousedown(function() {

        if(event.target.children.length > 0) { // nur dann steht eine Figur auf dem Feld

            T_Zuege.ZugVon      = event.target.id.substr(event.target.id.length - 2, 2);
            //T_Zuege.ZugFarbe    = $(event.target).hasClass('Brett_w') ? WEISSAMZUG : SCHWARZAMZUG; // ??? das ist einfach falsch
            T_Zuege.ZugFigur    = event.target.lastChild.id.substr(0, 1);

            MoveMouseDown = true;
            event.preventDefault();
        }
    })
    .mouseup(function() {

        if(MoveMouseDown) {

            MoveMouseDown = false;

            console.log('event.target.id' + event.target.id);

            T_Zuege.ZugNach = event.target.id.substr(event.target.id.length - 2, 2);

            firePlayerMove();
        }
 
    });

    MoveMouseDown   = false;
    MoveMouseUp     = false;
	
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

    $( "[id^='s_']" ).hide();
    $('#s_Trainerinfo').show();

}
