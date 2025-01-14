
function getlichessUserdata() { 	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	const headers = { Authorization: 'Bearer ' + 'lip_dXasEGgvxmJGdYQPZXVM' };

	fetch('https://lichess.org/api/account', { headers })
  .then(res => res.json())
	.then(function(res) {
		console.log(res);
	});

}

function getlichessUserstudies() { 	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	const headers = { 'Authorization': 'Bearer ' + 'lip_dXasEGgvxmJGdYQPZXVM' };

	fetch('https://lichess.org/api/study/by/GeorgK', { headers })
   .then(res => res.text())
	 .then(function(res) {
	 		console.log(res);
			studienliste = res.split('\n');
			console.log(studienliste);
			getstudydata(studienliste, studienliste.length);
 		})
	;

}

function getstudydata(studien, counter) { 	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	const headers = { 'Authorization': 'Bearer ' + 'lip_dXasEGgvxmJGdYQPZXVM' };

  for(i = 0; i < counter; i++) {
    console.log(studien[i]);

	fetch('https://lichess.org/api/study/' + JSON.parse(studien[i]).id + '.pgn', { headers })
		.then(res => res.text())
		.then(function(res) {
			console.log(res);
		})
	}

}

function KapitelAnzeigen() {

	$("[id^='s_']").hide();
	$('#s_kapitel').show();

	$('#kapiteldetails').show();
	$('#aufgabendetails').hide();

	$('#squareschallengeboard').removeClass('noClick');

}

//getlichessUserdata();
//getlichessUserstudies();

// Wird in zwei Situationen benutzt:
// - Zum echten Import von Kapiteln aus einer Studie
// - ZUm direkten Spiel eines Kapitels einer Studie ohne Übernahme
// Diese Funktion ruft - solange keine Fehler erkannt werden - die folgenden Funktionen auf:
// - studieauswahl
// - showstudylist
// - getLichessStudy
// Die Funktionssequenz ist in den beiden Situationen gleich, in getLichessStudy wird dann unterschieden 
function DatenBereitstellen_Lichess(context) { 	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	LichessUserDialog = $("#dialog-lichessuser").dialog({
		title: "Studien aus lichess.org übernehmen",
		width: DialogWidth,
		modal: true,
		position: { my: "left+80% top+20%", at: "left top", of: "#h_situationenanzeige" },
		open: function () {
		},
		buttons: {
			'Studien anzeigen': function () {

				if($('#lichessdialoguser').val() != '') {

					//studieauswahl($('#lichessuser').val(), context);
					studieauswahl(context);

				} else {

					$(this).dialog('close');
				}

			},
			'Auswahl beenden': function () {
				$(this).dialog('close');
			}
		}
	});

}

function studieauswahl(context) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName() + ' mit user ' + $('#lichessuser').val());

	let currentuser = context == 'kapitel' ? $('#lichessuser').val() : $('#lichessdialoguser').val();
	fetch('https://lichess.org/api/study/by/' + currentuser, { headers })
	// .then(
	// 	
	// )
	.then(
		function(response) {

			if(!response.ok) {
				if(context == 'kapitel') {
					$("#studienliste").empty();
					$('#ul_kapitelliste').empty();
				} else {
					$("#dialogstudienliste").empty(); 
				}
				showCommonMessagesDialog(MESSAGESEVERITY_FEHLER, 'Benutzer bei lichess nicht bekannt', 'Rückgabestatus: ' + response.status);
			} else {

				response.text().then(function(r) {
					if(r.length > 0) {
						lichessliste = r.split('\n').filter(i => i);
						showstudylist(lichessliste, context);
						$('<p>In lichess gefundene Studien: ' + lichessliste.length + '</p>').appendTo('#messageliste'); 
					} else {
						if(context == 'kapitel') {
							$("#studienliste").empty(); 
							$('#ul_kapitelliste').empty();
						} else {
							$("#dialogstudienliste").empty(); 
						}
						showCommonMessagesDialog(MESSAGESEVERITY_INFORMATION, 'Hinweis', 'Der Benutzer hat keine öffentichen Studien');
					}
				}
				)

			}

	})
	.catch(err => {
		console.log(err);
		showCommonMessagesDialog(MESSAGESEVERITY_FEHLER, 'Fehler erkannt', err.toString());
	});

}

function showstudylist(lichessitems, context) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	if(context == 'kapitel') {
		$("#studienliste").empty().removeClass('hideMe'); 
		//$('#ul_kapitelliste').removeClass('hideMe'); 
		//$('#ul_aufgabenliste').addClass('hideMe'); 		
		sl = document.getElementById("studienliste");
	} else {
		$("#dialogstudienliste").empty().removeClass('hideMe'); 
		sl = document.getElementById("dialogstudienliste");
	}

	lichessitems.forEach( study => {
		let li = document.createElement('li');
		li.id = JSON.parse(study).id;
		li.innerHTML = JSON.parse(study).name;
		sl.appendChild(li);
	});

	// Quelle: https://stackoverflow.com/questions/42722754/sorting-li-elements-alphabetically
  Array.from(sl.getElementsByTagName("LI"))
		.sort((a, b) => a.innerText.localeCompare(b.innerText))
		.forEach(li => sl.appendChild(li));

	if(context == 'kapitel') {

		$("#studienliste").selectable({

			selected: function (event, ui) {
				getLichessStudy(ui.selected.id, ui.selected.innerText, context);
			}
		});

		$('#kapiteldetails').removeClass( "hideMe" );
		$('#aufgabendetails').addClass( "hideMe" );

	} else {

		$("#dialogstudienliste").selectable({

			selected: function (event, ui) {
				getLichessStudy(ui.selected.id, ui.selected.innerText, context);
			}
		});

	}

}

function getLichessStudy(studyid, studyname, context) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	fetch('https://lichess.org/api/study/' + studyid + '.pgn', { headers })
	.then(res => res.text())
	.then(function(res) {
		//console.log(res);

		$('#importselectfilename').html(studyname);

		// Als globale Variable, da auf die Inhalte später noch per Klick zugegriffen werden soll
		GlobalImportedPGN = res.split("\n\n\n").filter(i => i); // .filter(i => i) entfernt leere Elemente

		//LichessUserDialog.dialog('close');

		if(context == 'import') {
			prepareChallengeImport();
		} else {
			prepareLichessKapitel();
		}

	})

}

// Einzige Voraussetzung für diese Funktion ist: GlobalImportedPGN, also alle aktuellen Aufgaben in einem Array 
function prepareLichessKapitel() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	// $('#aufgabenliste').addClass( "hideMe" );
	// $('#kapitelliste').removeClass( "hideMe" );

	// Und hier noch den Themenbereich deaktivieren
	
	$('#ul_kapitelliste').empty();
	for (i = 0; i < GlobalImportedPGN.length; i++) {
		let aufgabetext = GlobalImportedPGN[i].match(r_Event);
		//let aufgabetext = /Event "([^\"]*)/.exec(GlobalImportedPGN[i])[1];
		if (aufgabetext != null) {
			let newitem = '<li id="importedpgn_' + i + '">' + aufgabetext.groups.kapitel + '</li>';
			$(newitem).appendTo('#ul_kapitelliste');
		}
	}
	$("#ul_kapitelliste").selectable({

		selected: function (event, ui) {

			manageKapitelSelection(ui.selected.id);
		}
	});

}