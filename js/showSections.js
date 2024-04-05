function showSpielerinfo() {

	$("[id^='s_']").hide();
	$("[id^='s1_']").hide();
	$("[id^='s2_']").show();
	$('#s_Spielerinfo').show();

	$.ajax({
		url: "html/spielerinfo.html",
		dataType: "text",
		success: function (data) { $(data).appendTo("#Spielerinfo_div"); }
	});
}

function showTrainerinfo() {

	$("[id^='s_']").hide();
	$("[id^='s1_']").hide();
	$("[id^='s2_']").show();
	$('#s_Trainerinfo').show();

	$(".trainerfeatures").removeClass("hideMe");

	$.ajax({
		url: "html/spielerinfo.html",
		dataType: "text",
		success: function (data) {
			$("<div>Als Spieler:</div>").appendTo("#Trainerinfo_div");
			$(data).appendTo("#Trainerinfo_div");
		}
	})
		.then(() => {
			$.ajax({
				url: "html/trainerinfo.html",
				dataType: "text",
				success: function (data) {
					$("<div>Als Trainer:</div>").appendTo("#Trainerinfo_div");
					$(data).appendTo("#Trainerinfo_div");
				}
			});
		});
}

function showEntwicklerinfo() {

	$("[id^='s_']").hide();
	$("[id^='s1_']").hide();
	$("[id^='s2_']").show();
	$('#s_Entwicklerinfo').show();

	$(".trainerfeatures").removeClass("hideMe");
	$(".developerfeatures").removeClass("hideMe");

	$.ajax({
		url: "html/spielerinfo.html",
		dataType: "text",
		success: function (data) {
			$("<div>Als Spieler:</div>").appendTo("#Entwicklerinfo_div");
			$(data).appendTo("#Entwicklerinfo_div");
		}
	})
		.then(() => {
			$.ajax({
				url: "html/trainerinfo.html",
				dataType: "text",
				success: function (data) {
					$("<div>Als Trainer:</div>").appendTo("#Entwicklerinfo_div");
					$(data).appendTo("#Entwicklerinfo_div");
				}
			});
		})
		.then(() => {
			$.ajax({
				url: "html/entwicklerinfo.html",
				dataType: "text",
				success: function (data) {
					$("<div>Als Entwickler:</div>").appendTo("#Entwicklerinfo_div");
					$(data).appendTo("#Entwicklerinfo_div");
				}
			});
		});
}

function showEnginedialog() {

	GlobalActionContext = AC_ENGINEDIALOG;

	$('#usedcommands').click(function () {
		$('#Kommandostart').val($("select option:selected")[0].value + ' ');
	});

	stockFish.postMessage('ucinewgame');

	console.clear();
	$('#logliste').empty();

	$("[id^='s_']").hide();
	$('#s_EngineDialog').show();

}

// Anzeige des Enginelogs umschalten
function toggleEnginelog(CheckboxID) {
	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('toggleEnginelog');

	if ($('#' + CheckboxID).is(":checked")) {
		GlobalEnginelogActive = true;

		EnginelogDialog = $("#dialog_Enginelog").dialog({
			title: "Enginelog",
			height: 800,
			width: 600,
			modal: false,
			position: { my: "left top", at: "left top", of: "#ThemenlisteTree" },
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
		$("#dialog_Enginelog").dialog('close');
	}

}

// Logeinträge der Richtung 'zur Engine' umschalten
function toggleEnginelogEin() {
	$('.LogEin').toggle();
}

// Logeinträge der Richtung 'von der Engine' umschalten
function toggleEnginelogAus() {
	$('.LogAus').toggle();
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
function showImport() {

	$("[id^='s_']").hide();
	$('#s_import').show();

	$('#importselectarea').removeClass( "hideMe" );
	$('#ul_importaufgaben').addClass( "hideMe" );
	$('#f_importaufgabedaten').addClass( "hideMe" );
	$('#importaufgabePGN').children().addClass( "hideMe" );
	$('#importchessboardId').addClass( "hideMe" );
	$('#importTreeNotationWrapperId').addClass( "hideMe" );
	$('#importactionbuttons').addClass( "hideMe" );

	$('#importselectfilename').empty();
	$('#logliste').empty();

	getNAGList();
	
	stockFish.postMessage('ucinewgame');

}

function stageChallenge(ChallengeID) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	// Schon hier, da die beiden Objekte mit Daten versorgt werden
	T_Zuege					= new CZuege();
	Stellungsdaten	= new CStellungsdaten();

	getChallengeData(ChallengeID)
		.then(function () { getChallengeBoard(); })
		.then(function () { if(GlobalSpielinteraktion == SPIELINTERAKTION_AUFGABEOHNE || GlobalSpielinteraktion == SPIELINTERAKTION_AUFGABEMIT) { getChallengeMoves(ChallengeID, MitVarianten); } })
		.then(function () {	initializeSelectionEnvironment(); })
		.then(function () { initializeNotationtree(); });

}

function initializeSelectionEnvironment() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	$("[id^='s_']").hide();
	$('#s_spielen').show();

	$('#logliste').empty();
	$('#challengetips').empty();

	$("#cb_Enginelog").prop("checked", false);
	$("#cb_EngineEin").prop("checked", true);
	$("#cb_EngineAus").prop("checked", true);

	Stellungsdaten.ZugFarbe	=	Challenge.AmZug;
	Stellungsdaten.FEN			=	Challenge.FEN;	

	MoveMouseDown = false;

	showAid(AIDMODE_INIT);

	$('#VariantetextId').removeClass().addClass('centertext');

	resetmarker();
}

function initializeNotationtree() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());


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

function SpielinteraktionEinstellen() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	switch ($('input[name="Spielinteraktion"]:checked').val()) {
		case "StellungOhne":
			GlobalActionContext			= AC_POSITION_PLAY;
			GlobalSpielinteraktion	= SPIELINTERAKTION_STELLUNGOHNE;
			postit('ucinewgame');
			break;
		case "StellungMit":
			GlobalActionContext			= AC_POSITION_RATING;
			GlobalSpielinteraktion	= SPIELINTERAKTION_STELLUNGMIT;
			postit('ucinewgame');
			break;
		case "AufgabeMit":
			GlobalActionContext			= AC_CHALLENGE_VARIANTENDIREKT;
			GlobalSpielinteraktion	= SPIELINTERAKTION_AUFGABEMIT;
			Stellungsdaten.CreateNewNode = true;
			MitVarianten = PHPTRUE;
			break;
		case "AufgabeOhne":
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

function manageSpielinteraktionSelection() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	SpielinteraktionEinstellen();

	if($('#ul_Aufgabenliste')[0].querySelector('.ui-selected') != null) {
		stageChallenge($('#ul_Aufgabenliste')[0].querySelector('.ui-selected').id);
	}

}

function manageChallengeSelection(ChallengeID) {

	SpielinteraktionEinstellen();

	stageChallenge(ChallengeID);

}

function stageKapitel(KapitelID) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	// Schon hier, da die beiden Objekte mit Daten versorgt werden
	T_Zuege					= new CZuege();
	Stellungsdaten	= new CStellungsdaten();

	Kapitel = GlobalImportedPGN[KapitelID.split("_")[1]]; //responseData['ergebnisdaten'][0];

	scanPGN(Kapitel);
	scanChallengePGNData(GlobalImportedPGN[KapitelID.split("_")[1]]);
	Challenge = { ...Importdaten };
	Challenge.FEN = T_Aufgabe.FEN;
	getImportBoard()
		.then(function () { ZuegePruefen(); })
		.then(function () { initializeSelectionEnvironment(); })
		.then(function () { initializeNotationtree(); });	

	console.log(Kapitel);

	// $('#KurztextSpiel').val(Challenge.Kurztext == null ? "" : Challenge.Kurztext);
	// $('#LangtextSpiel').val(Challenge.Langtext);
	// $('#QuellquellespieleSpiel').val(Challenge.Quelle);
	// $('#QuelledetailSpiel').val(Challenge.Quelledetail);
	// $('#Importquellespiel').val(Challenge.ImportQuelle);
	// $('#ScopeSpiel').val(Challenge.Scope);
	// $('#SkillSpielSpiel').val(Challenge.Skill);
	// $('#AmZugSpiel').val(Challenge.AmZug);
	// $('#FENSpiel').val(Challenge.FEN);
	// $('#pgntextspiel').val(Challenge.PGN.split("\n\n")[1]);

	// getChallengeData(ChallengeID)
	// 	.then(function () { getChallengeBoard(); })
	// 	.then(function () { if(GlobalSpielinteraktion == SPIELINTERAKTION_AUFGABEOHNE || GlobalSpielinteraktion == SPIELINTERAKTION_AUFGABEMIT) { getChallengeMoves(ChallengeID, MitVarianten); } })
	// 	.then(function () {	initializeSelectionEnvironment(); })
	// 	.then(function () { initializeNotationtree(); });

}

// Diese Funktion reagiert auf die Auswahl eines direkt zu spielenden Kapitels einer lichess-Studie
// Die Daten, die zum selektierten Kapitel vorliegen, reichen für ein Spiel noch nicht aus, da ja nur die Studiendatei ...???
function manageKapitelSelection(ChallengeID) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	SpielinteraktionEinstellen();

	stageKapitel(ChallengeID);

}

// // Alternative zur eigenen Darstellung: hier wird lichess in einem frame eingeblendet
// function showlichess(ChallengeID, lichessdata) {

// 	$("[id^='s_']").hide();
// 	$('#s_lichess').show();

// 	//<iframe width=600 height=371 src="https://lichess.org/study/embed/xgTQJ6HF/04tEMyPj#0" frameborder=0></iframe>
// 	//$("#iframeframe").empty().append("<iframe width=600 height=371 src='https://lichess.org/study/embed/" + lichessdata + "' frameborder=0></iframe>");
// 	$("#iframeframe").empty().append("<iframe width=600 height=371 src='https://lichess.org/study/embed/E06MI1XV/Cv4blOr1' allowtransparency='true' frameborder=0></iframe>");

// }