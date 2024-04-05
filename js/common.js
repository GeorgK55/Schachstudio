// Ist nur aktiv, wewnn genau ein Thema ausgewählt ist
function NeuesThema() {

	KnotenObj = $('#ThemenlisteTree').jstree().get_selected(true)[0];

	NeuesThemaDialog = $("#dialog_neuesthema").dialog({
		title:		"Neues Thema",
		position:	{ my: "left top", at: "left top", of: "#sx_aufgabensection" },
		width:		DialogWidth,
		modal:		true,
		open:			function () {
								$('#NeuesThemaParent').html(KnotenObj.text); // Ist sicher ungleich null
								$('#Themaname').val('').focus();
		},
		buttons: [{
			id: 'NeuesThemaOK',
			text: 'Ok',
			click: function () {
				if ($('#Themaname').val() != "") {
					ThemaSpeichern(KnotenObj, $('#Themaname').val());
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

function EntferneThema() {

	KnotenObj = $('#ThemenlisteTree').jstree(true).get_selected(true);

	if (KnotenObj.length == 0) { // Darf nicht mehr vorkommen (button disabled)
		alert("Bitte vorher ein Thema auswählen und Programmfehler");
		return;
	} else if (parseInt(KnotenObj[0].li_attr.level) == 0) {
		alert("Dieses Thema darf nicht entfernt werden");
		return;
	} else if (!$('#ThemenlisteTree').jstree(true).is_leaf(KnotenObj[0])) { // Man beachte das Ausrufezeichen. Darf nicht mehr vorkommen (button disabled)
		alert('Zur Zeit dürfen nur Themen ohne nachgeordnete Themen entfernt werden und Programmfehler');
		return;
	}

	ThemaEntfernenDialog = $("#dialog_themaentfernen").dialog({
		title: "Thema entfernen",
		position:	{ my: "left top", at: "left top", of: "#sx_aufgabensection" },
		width: DialogWidth,
		modal: true,
		open: function () {
			$('#Themanodename').html(KnotenObj[0].text);
		},
		buttons: {
			Ok: function () {
				ThemaEntfernen(KnotenObj[0].id.split('_')[1]);
				$(this).dialog('close');
				$("#btn_ThemaNeu").button("disable");
				$("#btn_ThemaEntfernen").button("disable");
			},
			Abbrechen: function () {
				$(this).dialog('close');
			}
		}
	});
}

function VerbindeAufgabe() {

	let ThemaKnotenObj = $('#ThemenlisteTree').jstree().get_checked(true);
	let Aufgabetext = $("#ul_Aufgabenliste li.ui-selected");

	if (ThemaKnotenObj.length != 1 || Aufgabetext.length == 0) {
		alert('Bitte vorher genau ein Thema und genau eine Aufgabe auswählen');
		return;
	}

	AufgabeVerbindenDialog = $("#dialog_AufgabeVerbinden").dialog({
		title: "Aufgabe und Thema kombinieren",
		position:	{ my: "left top", at: "left top", of: "#AufgabelisteButtons" },
		width: DialogWidth,
		modal: true,
		open: function () {
			$('#VerbindeAufgabe').html(Aufgabetext[0].innerText);
			$('#VerbindeThema').html(ThemaKnotenObj[0].text);
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

function TrenneAufgabe() {

	ThemaKnotenObj = $('#ThemenlisteTree').jstree().get_selected(true);
	Aufgabetext = $("#ul_Aufgabenliste li.ui-selected");

	if (ThemaKnotenObj.length != 1 || Aufgabetext.length != 1) {
		alert('Bitte vorher genau ein Thema und genau eine Aufgabe auswählen');
		return;
	}

	AufgabeTrennenDialog = $("#dialog_AufgabeTrennen").dialog({
		title: "Aufgabe und Thema trennen",
		position:	{ my: "left top", at: "left top", of: "#AufgabelisteButtons" },
		width: DialogWidth,
		modal: true,
		open: function () {
			$('#TrenneAufgabe').html(Aufgabetext[0].innerText);
			$('#TrenneThema').html(ThemaKnotenObj[0].text);
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

function EntferneAufgabe() {

	if ($("#ul_Aufgabenliste li.ui-selected").length == 0) {
		alert("Bitte vorher eine Aufgabe auswählen");
		return;
	}

	isChallengeUsed($("#ul_Aufgabenliste li.ui-selected")[0].id).then(function (isChallengeUsedResult) {
		if(logMe(LOGLEVEL_IMPORTANT, LOGTHEME_SITUATION)) console.log('resolve isChallengeUsedResult: ' + isChallengeUsedResult);

		if (isChallengeUsedResult == true) {
			alert("Bitte vorher die Verbindungen zu den Themen entfernen");
			return;
		} else {
			AufgabeID = $("#ul_Aufgabenliste li.ui-selected")[0].id;
			AugabeEntfernenDialog = $("#dialog_AufgabeEntfernen").dialog({
				title: "Thema entfernen",
				position:	{ my: "left top", at: "left top", of: "#AufgabelisteButtons" },
				width: DialogWidth,
				modal: true,
				open: function () {
					$('#Aufgabenodename').html($("#ul_Aufgabenliste li.ui-selected")[0].innerText);
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

function Aufgabeauswahl() {

	if ($('#btn_Aufgabeauswahl').html() == "Alle Aufgaben anzeigen") {
		GlobalThemaId = [];
		$('#btn_Aufgabeauswahl').html("Aufgaben nur zur Auswahl anzeigen")
	} else {
		if ($('#ThemenlisteTree').jstree().get_selected(true).length > 0) {
			GlobalThemaId = $('#ThemenlisteTree').jstree(true).get_selected();
		} else {
			GlobalThemaId = [];
		}
		$('#btn_Aufgabeauswahl').html("Alle Aufgaben anzeigen")
	}
	getChallenges(GlobalThemaId);
}

