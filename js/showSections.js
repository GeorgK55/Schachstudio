function showSpielerinfo() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	$("[id^='s_']").hide();
	$("[id^='s1_']").hide();
	$("[id^='s2_']").show();
	$('#s_spielerinfo').show();

	Benutzerrolle = BENUTZERROLLE_SPIELER;

	$.ajax({
		url: "html/spielerinfo.html",
		dataType: "text",
		success: function (data) { $(data).appendTo("#spielerinfo_div"); }
	});
}

function showTrainerinfo() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	$("[id^='s_']").hide();
	$("[id^='s1_']").hide();
	$("[id^='s2_']").show();
	$('#s_trainerinfo').show();

	$(".trainerfeatures").removeClass("hideMe");

	Benutzerrolle = BENUTZERROLLE_TRAINER;
	
	$.ajax({
		url: "html/spielerinfo.html",
		dataType: "text",
		success: function (data) {
			$("<div>Als Spieler:</div>").appendTo("#trainerinfo_div");
			$(data).appendTo("#trainerinfo_div");
		}
	})
		.then(() => {
			$.ajax({
				url: "html/trainerinfo.html",
				dataType: "text",
				success: function (data) {
					$("<div>Als Trainer:</div>").appendTo("#trainerinfo_div");
					$(data).appendTo("#trainerinfo_div");
				}
			});
		});
}

function showEntwicklerinfo() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	$("[id^='s_']").hide();
	$("[id^='s1_']").hide();
	$("[id^='s2_']").show();
	$('#s_entwicklerinfo').show();

	$(".trainerfeatures").removeClass("hideMe");
	$(".developerfeatures").removeClass("hideMe");

	Benutzerrolle = BENUTZERROLLE_ENTWICKLER;
	
	$.ajax({
		url: "html/spielerinfo.html",
		dataType: "text",
		success: function (data) {
			$("<div>Als Spieler:</div>").appendTo("#entwicklerinfo_div");
			$(data).appendTo("#entwicklerinfo_div");
		}
	})
		.then(() => {
			$.ajax({
				url: "html/trainerinfo.html",
				dataType: "text",
				success: function (data) {
					$("<div>Als Trainer:</div>").appendTo("#entwicklerinfo_div");
					$(data).appendTo("#entwicklerinfo_div");
				}
			});
		})
		.then(() => {
			$.ajax({
				url: "html/entwicklerinfo.html",
				dataType: "text",
				success: function (data) {
					$("<div>Als Entwickler:</div>").appendTo("#entwicklerinfo_div");
					$(data).appendTo("#entwicklerinfo_div");
				}
			});
		});
}

function showEnginedialog() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	GlobalActionContext = AC_ENGINEDIALOG;

	$('#usedcommands').click(function () {
		$('#kommandostart').val($("select option:selected")[0].value + ' ');
	});

	stockFish.postMessage('ucinewgame');

	console.clear();
	$('#logliste').empty();

	$("[id^='s_']").hide();
	$('#s_enginedialog').show();

}

// Anzeige des Enginelogs umschalten
function toggleEnginelog(CheckboxID) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	if ($('#' + CheckboxID).is(":checked")) {
		GlobalEnginelogActive = true;

		EnginelogDialog = $("#dialog-enginelog").dialog({
			title: "Enginelog",
			height: 800,
			width: 600,
			modal: false,
			position: { my: "left top", at: "left top", of: "#themenlistetree" },
			open: function () { if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('open Enginelog'); },
			close: function (event, ui) {
				if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('close in close');
				GlobalEnginelogActive = false;
				$("#" + CheckboxID).prop("checked", false);
			}
		});

	} else {
		if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('close per checkbox');
		GlobalEnginelogActive = false;
		$("#dialog-enginelog").dialog('close');
	}

}

// Logeinträge der Richtung 'zur Engine' umschalten
function toggleEnginelogEin() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());
	$('.LogEin').toggle();
}

// Logeinträge der Richtung 'von der Engine' umschalten
function toggleEnginelogAus() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());
	$('.LogAus').toggle();
}

function showMessageHistory() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	MessagelogDialog = $("#dialog-messagelog").dialog({
		title: "Messagelog",
		height: 800,
		width: 600,
		modal: false,
		position: { my: "left top", at: "left top", of: "#themenlistetree" },
		open: function () { if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('open Messagelog'); }
	});

}

// Es müssen diese Aktionen in jeder Funktion ausgeführt werden:
// Alle Sections schließen und die ausgewählte anzeigen
// Die zur Section gehörende stockfishEngine starten
// Alle Listener für die Schachevents ausschalten und die des ausgewählten Contextes einschalten

// Allgemeine Einstellungen für diese Funktion:
// - die entsprechende section anzeigen und alle anderen ausblenden
// - in der section alle Teile bis auf die Dateiauswahl ausblenden
// - html-tags und logliste zurücksetzen
// - die engine starten (könnte auch in ZuegePruefen enthalten sein)
function showImport() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	$("[id^='s_']").hide();
	$('#s_import').show();

	$('#importselectarea').removeClass( "hideMe" );
	$('#ul_importaufgaben').addClass( "hideMe" );
	$('#f_importaufgabedaten').addClass( "hideMe" );
	$('#importaufgabePGN').children().addClass( "hideMe" );
	$('#importboard').addClass( "hideMe" );
	$('#importTreeNotationWrapperId').addClass( "hideMe" );
	$('#importactionbuttons').addClass( "hideMe" );

	$('#importselectfilename').empty();
	$('#logliste').empty();

	stockFish.postMessage('ucinewgame');

}

function initializeSelectionEnvironment() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	$("[id^='s_']").hide();
	$('#s_spielen').show();

	$('#importboard').empty().removeClass('noClick');
	$('#squareschallengeboard').empty();
	$('#challengeboard').css('background-color', 'var(--color_movecolormain)');
	$('#challengeboard').removeClass('noClick');

	$('#svghilfe > path').remove();
	$('#svgvarianten > path').remove();
	$('#svganno > path').remove();
	$('#svganno > circle').remove();

	$('#logliste').empty();
	$('#challengetips').empty();

	$("#cb_Enginelog").prop("checked", false);
	$("#cb_EngineEin").prop("checked", true);
	$("#cb_EngineAus").prop("checked", true);

	InputDeviceStart = false; 

	showAid(AIDMODE_INIT);

	$('#movenotestext').removeClass().addClass('centertext');

	resetmarker();
	
}

function initializeNotationtree() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());


	$('#challengenotationwrapper').empty().append('<div id="challengenotation"></div>');
	$('[id^=' + TOOLTIPPRÄFIX + ']').remove();
	
	// NotationstabelleAufgabe initiieren
	$('#challengenotation')
		.jstree({
			'plugins':	["themes", "unique"],
			'core': 		{
										'check_callback':	true,
										'themes':					{ 'icons': false, 'dots':	false }
									}
		}); 
	dummy = $('#challengenotation').jstree().create_node(
		'#', 
		{	"id": Stellungsdaten.PreNodeId, "text": "Gespielte Züge" },
		"last",	
		function (nn) { if(logMe(LOGLEVEL_IMPORTANT, LOGTHEME_SITUATION)) console.log("Node # created:"); if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log(nn); }
	);

}

function SpielinteraktionEinstellen() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	switch ($('input[name="Spielinteraktion"]:checked').val()) {
		case SPIELINTERAKTION_STELLUNGOHNE:
			GlobalActionContext			= AC_POSITION_PLAY;
			GlobalSpielinteraktion	= SPIELINTERAKTION_STELLUNGOHNE;
			postit('ucinewgame');
			break;
		case SPIELINTERAKTION_STELLUNGMIT:
			GlobalActionContext			= AC_POSITION_RATING;
			GlobalSpielinteraktion	= SPIELINTERAKTION_STELLUNGMIT;
			postit('ucinewgame');
			break;
		case SPIELINTERAKTION_AUFGABEMIT:
			GlobalActionContext			= AC_CHALLENGE_VARIANTENDIREKT;
			GlobalSpielinteraktion	= SPIELINTERAKTION_AUFGABEMIT;
			Stellungsdaten.CreateNewNode = true;
			MitVarianten = PHPTRUE;
			break;
		case SPIELINTERAKTION_AUFGABEOHNE:
			GlobalActionContext			= AC_CHALLENGE_VARIANTENDANACH;
			GlobalSpielinteraktion	= SPIELINTERAKTION_AUFGABEOHNE;
			Stellungsdaten.CreateNewNode = true;
			MitVarianten = PHPFALSE;
			break;
		default:
			GlobalActionContext			= AC_CHALLENGE_VARIANTENDIREKT;
			GlobalSpielinteraktion	= SPIELINTERAKTION_AUFGABEMIT;
			Stellungsdaten.CreateNewNode = true;
			MitVarianten = PHPTRUE;
			break;
	}

}

function manageSpielinteraktionSelection() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	SpielinteraktionEinstellen();

	if($('#ul_aufgabenliste')[0].querySelector('.ui-selected') != null) {
		stageChallenge($('#ul_aufgabenliste')[0].querySelector('.ui-selected').id);
	}

}

// Diese Funktion reagiert auf die Auswhl einer Aufgabe aus der Datenbank. Hier ist lediglich der Name und der ID der Aufgabe in der Datenbank bekannt
function manageChallengeSelection(ChallengeID) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	SpielinteraktionEinstellen();
	initializeSelectionEnvironment();
	stageChallenge(ChallengeID);

}

// Diese Funktion reagiert auf die Auswahl eines direkt zu spielenden Kapitels in der Kapitelliste. Hier ist lediglich der Name und der Index der Aufgabe in der Studienliste bekannt
function manageKapitelSelection(ChallengeID) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	SpielinteraktionEinstellen();
	initializeSelectionEnvironment();
	stageKapitel(ChallengeID);

}

// Danach ist das Brett spielbereit
function stageChallenge(ChallengeID) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	// Schon hier, da die Objekte mit Daten versorgt werden
	Challenge				= new CChallenge();
	T_Zuege					= new CZuege();
	Stellungsdaten	= new CStellungsdaten();

	getChallengeData(ChallengeID)	// holt die eine Zeile aus T_Aufgaben und versorgt T_Aufgabe und Stellungsdaten
		.then(function () { getChallengeBoard(); })
		.then(function () { if(GlobalSpielinteraktion == SPIELINTERAKTION_AUFGABEOHNE || GlobalSpielinteraktion == SPIELINTERAKTION_AUFGABEMIT) {
													getChallengeMoves(ChallengeID, MitVarianten); 
												} else {
													T_Zuege.FEN				= Challenge.FEN; 
													T_Zuege.ZugFarbe	= Challenge.AmZug;
												}
											})
		.then(function () { 
			initializeNotationtree(); 
			let drawarray		= [];
			determineannotations(Challenge.Hinweiskreis, Challenge.Hinweispfeil, drawarray);
			showDraw(drawarray);
			$('<p>' + Challenge.Kurztext + ' ausgewählt' + '</p>').appendTo('#messageliste');
		});

}

// Danach ist das Brett spielbereit
function stageKapitel(KapitelID) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	// Schon hier, da die Objekte mit Daten versorgt werden
	Challenge				= new CChallenge();
	T_Zuege					= new CZuege();
	Stellungsdaten	= new CStellungsdaten();

	// Nachholen der Schritte, die sonst beim Import durchgeführt wurden:
	Importdaten			= new CImportdaten();

	Kapitel = GlobalImportedPGN[KapitelID.split("_")[1]]; //responseData['ergebnisdaten'][0];

	scanPGN(Kapitel);
	notifyChallengeDetails();
	normalizePGNMoves(Kapitel);

	let kapitelkurztext = Challenge.Kurztext == null ? "" : Challenge.Kurztext;
	document.getElementById('l_spielendetails').innerHTML = kapitelkurztext;

	$('#lichessowner').val(Challenge.lichess_owner); 
	$('#langtextspiel').val(Challenge.Langtext);
	$('#lichesskapitelanchorid').text(Challenge.Langtext);
	$("#lichesskapitelanchorid").attr("href", "https://lichess.org/study/" + Challenge.lichess_studie_id + "/" + Challenge.lichess_kapitel_id);
//$('#youtubespielanchorid').text(Challenge.Youtubevideoname);
	//$("#youtubespielanchorid").attr("href", "http://www.google.com/");
	// $('#quellespiel').val(Challenge.Quelle);
	// $('#quelledetailspiel').val(Challenge.Quelledetail);
	// $('#scopespiel').val(Challenge.Scope); 

	// $('#skillspiel').val(Challenge.Skill);
	// $('#amzugspiel').val(Challenge.AmZug);
	// $('#fenspiel').val(Challenge.FEN);
	$('#pgntextspiel').val(Challenge.PGN.split("\n\n")[1]);

	$('<p>' + Challenge.Kurztext + ' ausgewählt' + '</p>').appendTo('#messageliste');

	getImportBoard()
		.then(function () { ZuegePruefen(NOTATIONMODE_HIDDEN)
													.then(function () { getChallengeBoard(); })
													.then(function () { 
														initializeNotationtree(); 
														T_Zuege = new CZuege();	// Es kann das Original genutzt werden
														Stellungsdaten = new CStellungsdaten();
														Stellungsdaten.CreateNewNode = true;
														Stellungsdaten.FEN = Challenge.FEN;
														let drawarray		= [];
														determineannotations(Challenge.Hinweiskreis, Challenge.Hinweispfeil, drawarray);
														showDraw(drawarray);
													})
													.then(function () { completeMoves(T_Zuege, ChallengeMoves); }); 
		})

}

function AufgabenAnzeigen() {

	$("[id^='s_']").hide();
	$("[id^='s1_']").hide();
	$("[id^='s2_']").show();

	$('#kapiteldetails').hide();
	$('#aufgabendetails').show();

	$('#squareschallengeboard').removeClass('noClick');

	switch (Benutzerrolle) {
		case BENUTZERROLLE_SPIELER:
			//showSpielerinfo();
			$('#s_spielerinfo').show();
			break;
		case BENUTZERROLLE_TRAINER:
			//showTrainerinfo();
			$('#s_trainerinfo').show();
			break;
		case BENUTZERROLLE_ENTWICKLER:
			//showEntwicklerinfo();
			$('#s_entwicklerinfo').show();
			break;	
		default:
			break;
	}
}
