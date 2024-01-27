function ThemaSpeichern(KnotenObj, NeuerName) {

	$.post({
		url: 			"php/putDBData.php",
		dataType: "json",
		data: {
						dataContext:	"ThemaSpeichern",
						level: 				$('#' + KnotenObj.id).attr('level'),
						parentid: 		KnotenObj.id.split('_')[1],
						neuername: 		NeuerName
					}
		}).done(function (responseData) { ThemaSpeichernErfolg(responseData);
		}).fail(function (jqXHR, textStatus, errorThrown) { AjaxError(jqXHR, textStatus, errorThrown);
	});
}

function AufgabeSpeichern() {

	if ($('#QuelleImport').val().includes("https://lichess.org/study/")) {
		let quelledetails	= $('#QuelleImport').val().split("/");
		lichess_studie		= quelledetails[4];
		lichess_kapitel		= quelledetails[5];
	} else {
		lichess_studie	= "";
		lichess_kapitel	= "";
	}

	$.post({
		url: 			"php/putDBData.php",
		dataType: "json",
		data: {
						dataContext: 	"AufgabeSpeichern",
						Kurztext: 		$('#KurztextImport').val(),
						Langtext: 		$('#LangtextImport').val(),
						Quelle: 			$('#QuelleImport').val(),
						Quelledetail:	$('#QuelledetailImport').val(),
						ImportQuelle: $('#ImportQuelleImport').val(),
						Annotator:		$('#AnnotatortextImport').val(),
						WeissName:		$('#WeissNameImport').val(),
						SchwarzName:	$('#SchwarzNameImport').val(),
						Datum:				$('#DatumImport').val(),
						AmZug: 				$('#AmZugImport').val(),
						FEN: 					$('#FENImport').val(),
						Scope: 				$('#ScopeImport').val(),
						Skill: 				$('#SkillImport').val(),
						studieId: 		lichess_studie,
						kapitelId: 		lichess_kapitel,
						pgn: 					T_Aufgabe.PGN
					}
		}).done(function (responseData) { AufgabeSpeichernErfolg(responseData);
		}).fail(function (jqXHR, textStatus, errorThrown) { AjaxError(jqXHR, textStatus, errorThrown);
	});

};

function ThemaUndAufgabeVerbinden(T_id, A_id) {

	$.post({
		url: 			"php/putDBData.php",
		dataType: "json",
		data: {
						dataContext: 		"ThemaUndAufgabeVerbinden",
						themakennung: 	T_id,
						aufgabekennung:	A_id
		}
	}).done(function (responseData) { ThemaUndAufgabeErfolg(responseData);
	}).fail(function (jqXHR, textStatus, errorThrown) { AjaxError(jqXHR, textStatus, errorThrown);
	});
}

function ThemaUndAufgabeTrennen(T_id, A_id) {

	$.post({
		url: 			"php/putDBData.php",
		dataType: "json",
		data: {
						dataContext: 		"ThemaUndAufgabeTrennen",
						themakennung: 	T_id,
						aufgabekennung: A_id
					}
		}).done(function (responseData) { ThemaUndAufgabeErfolg(responseData);
		}).fail(function (jqXHR, textStatus, errorThrown) { AjaxError(jqXHR, textStatus, errorThrown);
	});
}

function ThemaEntfernen(KnotenId) {

	$.post({
		url: 			"php/putDBData.php",
		dataType: "json",
		data: {
						dataContext:	"ThemaEntfernen",
						knotenid:			KnotenId
					}
		}).done(function (responseData) { ThemaEntfernenErfolg(responseData);
		}).fail(function (jqXHR, textStatus, errorThrown) { AjaxError(jqXHR, textStatus, errorThrown);
	});
}

function AufgabeEntfernen(id) {

	$.post({
		url: 			"php/putDBData.php",
		dataType: "json",
		data: {
						dataContext:	"AufgabeEntfernen",
						AufgabeID:		id
					}
		}).done(function (responseData) { AufgabeEntfernenErfolg(responseData);
		}).fail(function (jqXHR, textStatus, errorThrown) { AjaxError(jqXHR, textStatus, errorThrown);
	});
}

function ThemaSpeichernErfolg(responseData) {

	if (responseData.ergebnisflag) {

		$('#ThemenlisteTree').jstree(true).create_node(
			KnotenObj.id, {
				"id":				THEMAPRÄFIX + parseInt(responseData['neueid']),
				"text":			responseData['ergebnisdaten'],
				"li_attr":	{ "level": parseInt(KnotenObj.id.split('_')[0]) + 1 }
			},
			"last",
			function () { $('#ThemenlisteTree').jstree(true).open_node(KnotenObj.id) }
		);

	} else {
		showDBErrorMessagesDialog(responseData);
	}
}

function AufgabeSpeichernErfolg(responseData) {

	NeueAufgabeID = parseInt(responseData['neueid']);

	getChallenges([]);

	if (NeueAufgabeID > 0) {

		console.table(Zugliste);
		if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log(JSON.stringify(Zugliste));

		$.post({
			url: 			"php/putDBData.php",
			dataType: "json",
			data: {
							dataContext:	"Zugliste",
							AufgabenID:		NeueAufgabeID,
							Zugliste:			Zugliste
						}
			}).done(function (responseData) { ZuglisteErfolg(responseData);
			}).fail(function (jqXHR, textStatus, errorThrown) { AjaxError(jqXHR, textStatus, errorThrown);
		});
	}
};

function ThemaEntfernenErfolg(responseData) {

	if (responseData.ergebnisflag) {
		$('#ThemenlisteTree').jstree(true).delete_node(KnotenObj);
	} else {
		showDBErrorMessagesDialog(responseData);
	}
}

function AufgabeEntfernenErfolg(responseData) {

	if (responseData.ergebnisflag) {
		getChallenges([]);
	} else {
		showDBErrorMessagesDialog(responseData);
	}
};

function ThemaUndAufgabeErfolg(responseData) {

	if (responseData.ergebnisflag) {
		alert("Thema und Aufgabe erledigt");
	} else {
		showDBErrorMessagesDialog(responseData);
	}
}

function ZuglisteErfolg(responseData) {

	if (responseData.ergebnisflag) {
		alert("Die neue Aufgabe wurde mit " + responseData.zeilenanzahl + " Zügen übernommen");
	} else {
		showDBErrorMessagesDialog(responseData);
	}
}

// errorThrown hat keinen hier interssanten Inhalt
function AjaxError(jqXHR, textStatus, errorThrown) {
	alert(textStatus + '\n\n' + jqXHR.status + '\n\n' + jqXHR.responseText);
}