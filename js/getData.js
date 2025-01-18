function getThemes() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	$.get({
		url: "php/get_dbdata.php",
		data: { dataContext: "Themes" },
		dataType: "json"
		}).done(function (responseData) {

		// NotationstabelleAufgabe initiieren:
		// Baumeigenschaften festlegen
		// Handler für select und deselect aktivieren (das ist eine Funktion des tree)
		// Für jedes Them der DB einen Knoten im Baum anlegen 
		$('#themenlistetree').empty()
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
				$('#r-zeigeaufgaben').prop('checked', true); // es ist ja mindestens ein Thema ausgewählt
				activateThemaButtons(nodedata); // die zu dieser Konstellation passen
				getChallenges($('#themenlistetree').jstree(true).get_selected());

			}).on("deselect_node.jstree", function (evt, nodedata) {
				let selectedThemes = $('#themenlistetree').jstree(true).get_selected();
				if (selectedThemes.length > 0) {
					$('#r-zeigeaufgaben').prop('checked', true);
				} else {
					$('#r-zeigealle').prop('checked', true);
				}
				activateThemaButtons(nodedata); // die zu dieser Konstellation passen
				getChallenges(selectedThemes);
			});

		// Die item der DB enthalten alle notwendigen Daten	
		responseData['ergebnisdaten'].forEach(function (item) {

			$('#themenlistetree').jstree(true).create_node(
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

// ThemaId ist ein array mit den Id der ausgwählten Themen. Bei [] werden alle Aufgaben zurückgegeben
function getChallenges(ThemaId) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('getChallenges mit ThemaID: "' + ThemaId + '"');

	// In html werden die Themenid per Präfix eindeutig. In der DB ist das Präfix nicht enthalten
	ThemaId.forEach(function (part, index, ThemaId) {
		ThemaId[index] = ThemaId[index].split('_')[1];
	});

	$.get({
		url:			"php/get_dbdata.php",
		data:			{ dataContext: "Challenges", themaid: ThemaId },
		dataType:	"json"
	}).done(function (responseData) {

		$('#ul_aufgabenliste').empty();

		responseData['ergebnisdaten'].forEach(function (item) {

			if (item.lichess_studie != null && item.lichess_kapitel != null) {
				quelleclass = item.lichess_studie + '/' + item.lichess_kapitel;
			} else {
				quelleclass = "georg";
			}

			let newitem = '<li id="' + item.Aufgaben_ID + '" data-lichess="' + quelleclass + '">' + item.Kurztext + '</li>';
			$(newitem).appendTo('#ul_aufgabenliste');
		});

		$("#ul_aufgabenliste").selectable({

			selected: function (event, ui) {
				manageChallengeSelection(ui.selected.id);
			}
		});
	}).fail(function (jqXHR, textStatus, errorThrown) {
		AjaxError(jqXHR, textStatus, errorThrown);
	});
}

function getChallengeData(ID) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	return $.get({
		url: "php/get_dbdata.php",
		data: { dataContext: "Aufgabedaten", AufgabeID: ID },
		dataType: "json"
	}).done(function (responseData) {

		Challenge = responseData['ergebnisdaten'][0]; // Ist ja ein einfaches Objekt

		document.getElementById('l_spielendetails').innerHTML = (Challenge.Kurztext);
		$('#lichessowner').val(Challenge.lichess_owner); 
		$('#langtextspiel').val(Challenge.Langtext);
		$('#youtubespielkanal').val(Challenge.Youtubekanalname);
		$('#youtubespielanchorid').text(Challenge.Youtubevideoname);
		$("#youtubespielanchorid").attr("href", Challenge.Youtubevideolink);
		// $('#quellespiel').val(Challenge.Quelle);
		// $('#quelledetailspiel').val(Challenge.Quelledetail);
		// $('#scopespiel').val(Challenge.Scope);
		// $('#skillspiel').val(Challenge.Skill);
		// $('#amzugspiel').val(Challenge.AmZug);
		// $('#fenspiel').val(Challenge.FEN);
		$('#pgntextspiel').val(Challenge.PGN.split("\n\n")[1]);
		showChallengeTip(Challenge.Hinweistext, 'dialogtext');

		Stellungsdaten.ZugFarbe	=	Challenge.AmZug;
		Stellungsdaten.FEN			=	Challenge.FEN;		

	}).fail(function (jqXHR, textStatus, errorThrown) {
		AjaxError(jqXHR, textStatus, errorThrown);
	});

}

// Alle Züge einer Aufgabe holen und im globalen array zur Verfügung stellen
// In den erhaltenen Zügen gleich in die richtigen Datenformate (hier nur int) übertragen
function getChallengeMoves(ID, MitVarianten) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	return $.get({
		url: "php/get_dbdata.php",
		data: { dataContext: "Zugdaten", AufgabeID: ID, Varianten: MitVarianten },
		dataType: "json"
	}).done(function (responseData) {

		ChallengeMoves = responseData['ergebnisdaten'];

		completeMoves(T_Zuege, ChallengeMoves);

	}).fail(function (jqXHR, textStatus, errorThrown) {
		AjaxError(jqXHR, textStatus, errorThrown);
	});
}

function getChallengeBoard() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	let BrettName = Challenge.AmZug == WEISSAMZUG ? HTMLBRETTNAME_SPIELEN + "w.html" : HTMLBRETTNAME_SPIELEN + "b.html";

	return $.get({
			url:	"html/" + BrettName
		}).done(function (data) {
			$("#importboard").empty(); // ############################ noch ändern
			$("#squareschallengeboard").html(data);
			addBoardFunctions(HTMLBRETTNAME_SPIELEN);
			StellungAufbauen(Challenge.FEN);
			if(Challenge.AmZug == WEISSAMZUG) $('#challengezugmarkerid').html(ZUGMARKERWEISS);
			else $('#challengezugmarkerid').html(ZUGMARKERSCHWARZ);

		}).fail(function (jqXHR, textStatus, errorThrown) {
			AjaxError(jqXHR, textStatus, errorThrown);
		});
}

function getImportBoard() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	ImportboardFinished = $.Deferred(); 

	let BrettName = Challenge.AmZug == WEISSAMZUG ? HTMLBRETTNAME_IMPORT + "w.html" : HTMLBRETTNAME_IMPORT + "b.html";

	return $.get("html/" + BrettName)
		.done(function (data) {
			$("#squareschallengeboard").empty();
			$("#importboard").html(data);
			StellungAufbauen(Challenge.FEN);

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

			if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_PROMISES)) console.log('ImportboardFinished.resolve');
			ImportboardFinished.resolve();
			ImportboardFinished.promise();

		}).fail(function (jqXHR, textStatus, errorThrown) {
			AjaxError(jqXHR, textStatus, errorThrown);
		});

}

function isChallengeUsed(ID) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	return new Promise(function (resolve, reject) {

		$.get({
			url: "php/get_dbdata.php",
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

function getNAGList() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	$.get({
		url: "php/get_dbdata.php",
		data: { dataContext: "NAGdaten" },
		dataType: "json"
	}).done(function (responseData) {

		NAGresult = responseData['ergebnisdaten'];
		if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_DATA)) console.log(NAGresult);

	}).fail(function (jqXHR, textStatus, errorThrown) {
		AjaxError(jqXHR, textStatus, errorThrown);
	});

}

// Alle ThemenId zu einer ChallengeId holen
function getChallengeThemes(ChallengeId) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	$.get({
		url:			"php/get_dbdata.php",
		data:			{ dataContext: "ThemeIds", challengeid: ChallengeId },
		dataType:	"json"
	}).done(function (responseData) {

		responseData['ergebnisdaten'].forEach(function (item) {
			console.log(item.Themen_ID);

			// $('#themenlistetree').jstree(true).get_json('#', { flat: true })

			// TH_1_anchor addclass

			let themenode = $('#themenlistetree').jstree(true).get_node('TH_' + item.Themen_ID);
			let themenodetext = themenode.text;
			//$('#themenlistetree').jstree().rename_node('TH_' + item.Themen_ID, themenodetext + ' XXXXX');
			$('#themenlistetree').jstree().select_node('TH_' + item.Themen_ID);
			//$('#TH_' + item.Themen_ID + '_anchor').addClass('kursivbold');
		});

	}).fail(function (jqXHR, textStatus, errorThrown) {
		AjaxError(jqXHR, textStatus, errorThrown);
	});

}