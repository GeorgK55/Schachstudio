function getThemes() {

	$.get({
		url: "php/getDBData.php",
		data: { dataContext: "Themes" },
		dataType: "json"
		}).done(function (responseData) {

		$('#ScrollWrapperThemen').empty().append('<div id="ThemenlisteTree"></div>');

		// NotationstabelleAufgabe initiieren:
		// Baumeigenschaften festlegen
		// Handler für select und deselect aktivieren (das ist eine Funktion des tree)
		// Für jedes Them der DB einen Knoten im Baum anlegen 
		$('#ThemenlisteTree').empty()
			.jstree({
				'plugins': ["themes", "checkbox", "unique"],
				'core': {
					'check_callback':	true,	// erlaubt Änderungen am Baum
					'multiple':				true,
					'themes':					{ 'icons': false, 'dots':	true }
				},
				'checkbox': { 
					'three_state':	false, 
					'cascade':			'none' 
				}
			}).on("select_node.jstree", function (evt, nodedata) {
				$('#r_ZeigeAufgaben').prop('checked', true); // es ist ja mindestens ein Thema ausgewählt
				activateThemaButtons(nodedata); // die zu dieser Konstellation passen
				getChallenges($('#ThemenlisteTree').jstree(true).get_selected());

			}).on("deselect_node.jstree", function (evt, nodedata) {
				let selectedThemes = $('#ThemenlisteTree').jstree(true).get_selected();
				if (selectedThemes.length > 0) {
					$('#r_ZeigeAufgaben').prop('checked', true);
				} else {
					$('#r_ZeigeAlle').prop('checked', true);
				}
				activateThemaButtons(nodedata); // die zu dieser Konstellation passen
				getChallenges(selectedThemes);
			});

		// Die item der DB enthalten alle notwendigen Daten	
		responseData['ergebnisdaten'].forEach(function (item) {

			$('#ThemenlisteTree').jstree(true).create_node(
				item.Parent == null ? '#' : THEMAPRÄFIX + item.Parent, {
				"id":				THEMAPRÄFIX + item.Id,
				"text":			item.Thematext,
				"li_attr":	{ level: item.Level }
			},
				"last"
			);
		});
		}).fail(function (jqXHR, textStatus, errorThrown) { AjaxError(jqXHR, textStatus, errorThrown);
	});
}

function getChallenges(ThemaId) {

	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('getChallenges mit ThemaID: "' + ThemaId + '"');

	// In html werden die Themenid per Präfix eindeutig. In der DB ist das Präfix nicht enthalten
	ThemaId.forEach(function (part, index, ThemaId) {
		ThemaId[index] = ThemaId[index].split('_')[1];
	});

	$.get({
		url:			"php/getDBData.php",
		data:			{ dataContext: "Challenges", themaid: ThemaId },
		dataType:	"json"
	}).done(function (responseData) {

		$('#ul_Aufgabenliste').empty();

		responseData['ergebnisdaten'].forEach(function (item) {

			if (item.lichess_studie != null && item.lichess_kapitel != null) {
				quelleclass = item.lichess_studie + '/' + item.lichess_kapitel;
			} else {
				quelleclass = "georg";
			}

			let newitem = '<li id="' + item.Aufgaben_ID + '" data-lichess="' + quelleclass + '">' + item.Kurztext + '</li>';
			$(newitem).appendTo('#ul_Aufgabenliste');
		});

		$("#ul_Aufgabenliste").selectable({

			selected: function (event, ui) {
				manageChallengeSelection(ui.selected.id);
			}
		});
	}).fail(function (jqXHR, textStatus, errorThrown) {
		AjaxError(jqXHR, textStatus, errorThrown);
	});
}

function getChallengeData(ID) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	return $.get({
		url: "php/getDBData.php",
		data: { dataContext: "Aufgabedaten", AufgabeID: ID },
		dataType: "json"
	}).done(function (responseData) {

		Challenge = responseData['ergebnisdaten'][0];

		$('#kurztextspiel').val(Challenge.Kurztext == null ? "" : Challenge.Kurztext);
		$('#LangtextSpiel').val(Challenge.Langtext);
		$('#quellespiel').val(Challenge.Quelle);
		$('#QuelledetailSpiel').val(Challenge.Quelledetail);
		$('#Importquellespiel').val(Challenge.ImportQuelle);
		$('#ScopeSpiel').val(Challenge.Scope);
		$('#SkillSpielSpiel').val(Challenge.Skill);
		$('#AmZugSpiel').val(Challenge.AmZug);
		$('#FENSpiel').val(Challenge.FEN);
		$('#pgntextspiel').val(Challenge.PGN.split("\n\n")[1]);

	}).fail(function (jqXHR, textStatus, errorThrown) {
		AjaxError(jqXHR, textStatus, errorThrown);
	});

}

// Alle Züge einer Aufgabe holen und im globalen array zur Verfügung stellen
// In den erhaltenen Zügen gleich in die richtigen Datenformate (hier nur int) übertragen
function getChallengeMoves(ID, MitVarianten) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	return $.get({
		url: "php/getDBData.php",
		data: { dataContext: "Zugdaten", AufgabeID: ID, Varianten: MitVarianten },
		dataType: "json"
	}).done(function (responseData) {

		ChallengeMoves = responseData['ergebnisdaten'];

		// Die Felder werden wirklich benötigt
		T_Zuege.FEN				= Challenge.FEN; 
		T_Zuege.ZugFarbe	= Challenge.AmZug;

		// Diese beiden Felder werden grad mal zweckentfremdet
		T_Zuege.ZugVon	= ChallengeMoves[0].ZugVon;
		T_Zuege.ZugNach	= ChallengeMoves[0].ZugNach;

		const Nullzug			= { ...T_Zuege }; // spread syntax

		ChallengeMoves.splice(0, 0, Nullzug);
		setMoveState('M_0', MOVESTATE_MOVED);

		// Diese Werte sollen als int verwendet werden
		ChallengeMoves.forEach(function(item) {
			item.AufgabeID		= parseInt(item.AufgabeID);
			item.CurMoveIndex	= parseInt(item.CurMoveIndex);
			item.ZugNummer		= parseInt(item.ZugNummer);
			item.ZugLevel			= parseInt(item.ZugLevel);
		})
	}).fail(function (jqXHR, textStatus, errorThrown) {
		AjaxError(jqXHR, textStatus, errorThrown);
	});
}

function getChallengeBoard() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	let BrettName = Challenge.AmZug == WEISSAMZUG ? HTMLBRETTNAME_SPIELEN + "w.html" : HTMLBRETTNAME_SPIELEN + "b.html";

	return $.get("html/" + BrettName)
		.done(function (data) {
			$("#challengechessboard").html(data);
			addBoardFunctions(HTMLBRETTNAME_SPIELEN);
			StellungAufbauen(HTMLBRETTNAME_SPIELEN, Challenge.FEN);
			if(Challenge.AmZug == WEISSAMZUG) $('#ChallengezugmarkerId').html(ZUGMARKERWEISS);
			else $('#ChallengezugmarkerId').html(ZUGMARKERSCHWARZ);

		}).fail(function (jqXHR, textStatus, errorThrown) {
			AjaxError(jqXHR, textStatus, errorThrown);
		});
}

function getImportBoard() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	let BrettName = T_Aufgabe.AmZug == WEISSAMZUG ? HTMLBRETTNAME_IMPORT + "w.html" : HTMLBRETTNAME_IMPORT + "b.html";

	return $.get("html/" + BrettName)
		.done(function (data) {
			$("#importchessboardId").html(data);
			StellungAufbauen(HTMLBRETTNAME_IMPORT, T_Aufgabe.FEN);

			GlobalActionContext = AC_CHALLENGEIMPORT;

			Importdaten.ZugStack.push({
				FEN: Importdaten.FEN,
				PreFEN: Importdaten.PreFEN,
				PreNode: Importdaten.PreNodeId,
				CurNode: Importdaten.CurNodeId,
				PreMove: Importdaten.PreMoveId,
				MoveLevel: Importdaten.ZugLevel,
				CurMove: Importdaten.CurMoveId
			});


		}).fail(function (jqXHR, textStatus, errorThrown) {
			AjaxError(jqXHR, textStatus, errorThrown);
		});

}

function isChallengeUsed(ID) {

	return new Promise(function (resolve, reject) {

		$.get({
			url: "php/getDBData.php",
			data: { dataContext: "Aufgabebenutzung", AufgabeID: ID },
			dataType: "json"
		}).done(function (responseData) {

			i = parseInt(responseData['ergebnisdaten'][0].anzahl);

			isChallengeUsedResult = i == 0 ? false : true;
			if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log("isChallengeUsedResult: " + isChallengeUsedResult);

			resolve(isChallengeUsedResult);
		})
			.fail(function (errdata) {
				reject(errdata);
			});

	});

}

function getNAGList() {

	$.get({
		url: "php/getDBData.php",
		data: { dataContext: "NAGdaten" },
		dataType: "json"
	}).done(function (responseData) {

		NAGresult = responseData['ergebnisdaten'];
		if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log(NAGresult);

	}).fail(function (jqXHR, textStatus, errorThrown) {
		AjaxError(jqXHR, textStatus, errorThrown);
	});

}