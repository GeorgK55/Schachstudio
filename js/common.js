// Ist nur aktiv, wewnn genau ein Thema ausgewählt ist
function NeuesThema() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	KnotenObj = $('#themenlistetree').jstree().get_selected(true)[0];

	NeuesThemaDialog = $("#dialog_neuesthema").dialog({
		title:		"Neues Thema",
		position:	{ my: "left top", at: "left top", of: "#sx_aufgabensection" },
		width:		DialogWidth,
		modal:		true,
		open:			function () {
								$('#neuesthemaparent').html(KnotenObj.text); // Ist sicher ungleich null
								$('#themaname').val('').focus();
		},
		buttons: [{
			id: 'NeuesThemaOK',
			text: 'Ok',
			click: function () {
				if ($('#themaname').val() != "") {
					ThemaSpeichern(KnotenObj, $('#themaname').val());
					$(this).dialog('close');
				} else {
					alert("Neues Thema ohne Name nicht möglich");
				}
			}
		},
		{
			id: 'NeuesThemaAbbrechen',
			text: 'Abbrechen',
			click: function () {
				$(this).dialog('close');
			}
		}
		]
	});
}

function EntferneThema() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	KnotenObj = $('#themenlistetree').jstree(true).get_selected(true);

	if (KnotenObj.length == 0) { // Darf nicht mehr vorkommen (button disabled)
		alert("Bitte vorher ein Thema auswählen und Programmfehler");
		return;
	} else if (parseInt(KnotenObj[0].li_attr.level) == 0) {
		alert("Dieses Thema darf nicht entfernt werden");
		return;
	} else if (!$('#themenlistetree').jstree(true).is_leaf(KnotenObj[0])) { // Man beachte das Ausrufezeichen. Darf nicht mehr vorkommen (button disabled)
		alert('Zur Zeit dürfen nur Themen ohne nachgeordnete Themen entfernt werden und Programmfehler');
		return;
	}

	ThemaEntfernenDialog = $("#dialog_themaentfernen").dialog({
		title: "Thema entfernen",
		position:	{ my: "left top", at: "left top", of: "#sx_aufgabensection" },
		width: DialogWidth,
		modal: true,
		open: function () {
			$('#themanodename').html(KnotenObj[0].text);
		},
		buttons: {
			Ok: function () {
				ThemaEntfernen(KnotenObj[0].id.split('_')[1]);
				$(this).dialog('close');
				$("#btn-themaneu").button("disable");
				$("#btn-themaentfernen").button("disable");
			},
			Abbrechen: function () {
				$(this).dialog('close');
			}
		}
	});
}

function VerbindeAufgabe() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	let ThemaKnotenObj = $('#themenlistetree').jstree().get_checked(true);
	let Aufgabetext = $("#ul_aufgabenliste li.ui-selected");

	if (ThemaKnotenObj.length != 1 || Aufgabetext.length == 0) {
		alert('Bitte vorher genau ein Thema und genau eine Aufgabe auswählen');
		return;
	}

	AufgabeVerbindenDialog = $("#dialog-aufgabeverbinden").dialog({
		title: "Aufgabe und Thema kombinieren",
		position:	{ my: "left top", at: "left top", of: "#aufgabelistebuttons" },
		width: DialogWidth,
		modal: true,
		open: function () {
			$('#verbindeaufgabe').html(Aufgabetext[0].innerText);
			$('#verbindethema').html(ThemaKnotenObj[0].text);
		},
		buttons: [{
			id: 'VerbindeAufgabeOK',
			text: 'Ok',
			click: function () {
				ThemaUndAufgabeVerbinden(ThemaKnotenObj[0].id.split('_')[1], Aufgabetext[0].id);
				$(this).dialog('close');
			}
		},
		{
			id: 'VerbindeAufgabeAbbrechen',
			text: 'Abbrechen',
			click: function () {
				$(this).dialog('close');
			}
		}
		]
	});
}

function TrenneAufgabe() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	ThemaKnotenObj = $('#themenlistetree').jstree().get_selected(true);
	Aufgabetext = $("#ul_aufgabenliste li.ui-selected");

	if (ThemaKnotenObj.length != 1 || Aufgabetext.length != 1) {
		alert('Bitte vorher genau ein Thema und genau eine Aufgabe auswählen');
		return;
	}

	AufgabeTrennenDialog = $("#dialog-aufgabetrennen").dialog({
		title: "Aufgabe und Thema trennen",
		position:	{ my: "left top", at: "left top", of: "#aufgabelistebuttons" },
		width: DialogWidth,
		modal: true,
		open: function () {
			$('#trenneaufgabe').html(Aufgabetext[0].innerText);
			$('#trennethema').html(ThemaKnotenObj[0].text);
		},
		buttons: {
			Ok: function () {
				ThemaUndAufgabeTrennen(ThemaKnotenObj[0].id.split('_')[1], Aufgabetext[0].id);
				$(this).dialog('close');
			},
			Abbrechen: function () {
				$(this).dialog('close');
			}
		}
	});
}

function EntferneAufgabe() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	if ($("#ul_aufgabenliste li.ui-selected").length == 0) {
		alert("Bitte vorher eine Aufgabe auswählen");
		return;
	}

	isChallengeUsed($("#ul_aufgabenliste li.ui-selected")[0].id).then(function (isChallengeUsedResult) {
		if(logMe(LOGLEVEL_IMPORTANT, LOGTHEME_SITUATION)) console.log('resolve isChallengeUsedResult: ' + isChallengeUsedResult);

		if (isChallengeUsedResult == true) {
			alert("Bitte vorher die Verbindungen zu den Themen entfernen");
			return;
		} else {
			AufgabeID = $("#ul_aufgabenliste li.ui-selected")[0].id;
			AugabeEntfernenDialog = $("#dialog-aufgabeentfernen").dialog({
				title: "Thema entfernen",
				position:	{ my: "left top", at: "left top", of: "#aufgabelistebuttons" },
				width: DialogWidth,
				modal: true,
				open: function () {
					$('#aufgabenodename').html($("#ul_aufgabenliste li.ui-selected")[0].innerText);
				},
				buttons: {
					Ok: function () {
						AufgabeEntfernen(AufgabeID);
						$(this).dialog('close');
					},
					Abbrechen: function () {
						$(this).dialog('close');
					}
				}
			});
		}

	}).catch(function (errdata) {
		if(logMe(LOGLEVEL_IMPORTANT, LOGTHEME_SITUATION)) console.log('reject isChallengeUsedResult: ' + isChallengeUsedResult);

	});

}

// So war das mal. Noch nicht aktiviert
function Aufgabeauswahl() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	if ($('#btn_Aufgabeauswahl').html() == "Alle Aufgaben anzeigen") {
		GlobalThemaId = [];
		$('#btn_Aufgabeauswahl').html("Aufgaben nur zur Auswahl anzeigen")
	} else {
		if ($('#themenlistetree').jstree().get_selected(true).length > 0) {
			GlobalThemaId = $('#themenlistetree').jstree(true).get_selected();
		} else {
			GlobalThemaId = [];
		}
		$('#btn_Aufgabeauswahl').html("Alle Aufgaben anzeigen")
	}
	getChallenges(GlobalThemaId);
}

