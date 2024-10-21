function ThemaSpeichern(KnotenObj, NeuerName) {

	$.post({
		url: 			"php/put_dbdata.php",
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

function AufgabeSpeichern() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	$.post({
		url: 			"php/put_dbdata.php",
		dataType: "json",
		data: {
						dataContext: 				"AufgabeSpeichern",
						Kurztext: 					$('#kurztextimport').val(),
						Langtext: 					$('#langtextimport').val(),
						Hinweistext: 				Challenge.Hinweistext,
						Hinweiskreis: 			Challenge.Hinweiskreis,
						Hinweispfeil: 			Challenge.Hinweispfeil,
						Quelle: 						Challenge.Quelle,
						Quelledetail:				$('#quelledetailimport').val(),
						Youtubename:				$('#youtubeimportname').val(),
						Youtubelink:				$('#youtubeimportlink').val(),
						Annotator:					Challenge.Annotator,
						WeissName:					$('#weissnameimport').val(),
						SchwarzName:				$('#schwarznameimport').val(),
						Datum:							Challenge.Datum,
						AmZug: 							Challenge.AmZug,
						FEN: 								Challenge.FEN,
						Scope: 							$('#scopeimport').val(),
						Skill: 							$('#skillimport').val(),
						lichess_studie_id:	Challenge.lichess_studie_id,
						lichess_kapitel_id:	Challenge.lichess_kapitel_id,
						pgn: 								Challenge.PGN
					}
		}).done(function (responseData) { AufgabeSpeichernErfolg(responseData);
		}).fail(function (jqXHR, textStatus, errorThrown) { AjaxError(jqXHR, textStatus, errorThrown);
	});

};

function ThemaUndAufgabeVerbinden(T_id, A_id) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	$.post({
		url: 			"php/put_dbdata.php",
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

function ThemaUndAufgabeTrennen(T_id, A_id) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	$.post({
		url: 			"php/put_dbdata.php",
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

function ThemaEntfernen(KnotenId) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	$.post({
		url: 			"php/put_dbdata.php",
		dataType: "json",
		data: {
						dataContext:	"ThemaEntfernen",
						knotenid:			KnotenId
					}
		}).done(function (responseData) { ThemaEntfernenErfolg(responseData);
		}).fail(function (jqXHR, textStatus, errorThrown) { AjaxError(jqXHR, textStatus, errorThrown);
	});
}

function AufgabeEntfernen(id) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	$.post({
		url: 			"php/put_dbdata.php",
		dataType: "json",
		data: {
						dataContext:	"AufgabeEntfernen",
						AufgabeID:		id
					}
		}).done(function (responseData) { AufgabeEntfernenErfolg(responseData);
		}).fail(function (jqXHR, textStatus, errorThrown) { AjaxError(jqXHR, textStatus, errorThrown);
	});
}

function ThemaSpeichernErfolg(responseData) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	if (responseData.ergebnisflag) {

		$('#themenlistetree').jstree(true).create_node(
			KnotenObj.id, {
				"id":				THEMAPRÄFIX + parseInt(responseData['neueid']),
				"text":			responseData['ergebnisdaten'],
				"li_attr":	{ "level": parseInt(KnotenObj.id.split('_')[0]) + 1 }
			},
			"last",
			function () { $('#themenlistetree').jstree(true).open_node(KnotenObj.id) }
		);

	} else {
		showDBErrorMessagesDialog(responseData);
	}
}

function AufgabeSpeichernErfolg(responseData) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	NeueAufgabeID = parseInt(responseData['neueid']);

	getChallenges([]);

	if (NeueAufgabeID > 0) {

		console.table(ChallengeMoves);
		if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log(JSON.stringify(ChallengeMoves));

		$.post({
			url: 			"php/put_dbdata.php",
			dataType: "json",
			data: {
							dataContext:	"Zugliste",
							AufgabenID:		NeueAufgabeID,
							Zugliste:			ChallengeMoves
						}
			}).done(function (responseData) { ZuglisteErfolg(responseData);
			}).fail(function (jqXHR, textStatus, errorThrown) { AjaxError(jqXHR, textStatus, errorThrown);
		});
	}
};

function ThemaEntfernenErfolg(responseData) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	if (responseData.ergebnisflag) {
		$('#themenlistetree').jstree(true).delete_node(KnotenObj);
	} else {
		showDBErrorMessagesDialog(responseData);
	}
}

function AufgabeEntfernenErfolg(responseData) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	if (responseData.ergebnisflag) {
		getChallenges([]);
	} else {
		showDBErrorMessagesDialog(responseData);
	}
};

function ThemaUndAufgabeErfolg(responseData) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	if (responseData.ergebnisflag) {
		alert("Thema und Aufgabe erledigt");
	} else {
		showDBErrorMessagesDialog(responseData);
	}
}

function ZuglisteErfolg(responseData) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	if (responseData.ergebnisflag) {
		alert("Die neue Aufgabe wurde mit " + responseData.zeilenanzahl + " Zügen übernommen");
	} else {
		showDBErrorMessagesDialog(responseData);
	}
}

// errorThrown hat keinen hier interssanten Inhalt
function AjaxError(jqXHR, textStatus, errorThrown) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());
	alert(textStatus + '\n\n' + jqXHR.status + '\n\n' + jqXHR.responseText);
}