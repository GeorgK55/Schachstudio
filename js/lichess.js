
function getlichessUserdata() {

	const headers = { Authorization: 'Bearer ' + 'lip_dXasEGgvxmJGdYQPZXVM' };

	fetch('https://lichess.org/api/account', { headers })
  .then(res => res.json())
	.then(function(res) {
		console.log(res);
	});

}

function getlichessUserstudies() {

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

function getstudydata(studien, counter) {

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

//getlichessUserdata();
//getlichessUserstudies();

// Wird in zwei Situationen benutzt:
// - Zum echten Import von Kapiteln aus einer Studie
// - ZUm direkten Spiel eines Kapitels einer Studie ohne Übernahme
// Diese Funktion ruft - solange keine Fehler erkannt weden - zwingend die folgenden Funktionen auf:
// - studieauswahl
// - showstudylist
// - getLichessStudy
// Die Funktionssequenz ist in den beiden Situationen gleich, in getLichessStudy wird dann unterschieden 
function DatenBereitstellen_Lichess(context) {

	LichessUserDialog = $("#dialog-lichessuser").dialog({
		title: "Studien aus lichess.org übernehmen",
		width: DialogWidth,
		modal: true,
		open: function () {
		},
		buttons: {
			'Übernehmen': function () {
				studieauswahl($('#lichessuser').val(), context);
			},
			'Abbrechen': function () {
				$(this).dialog('close');
			}
		}
	});

}

function studieauswahl(username, context) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	console.log(username);

	fetch('https://lichess.org/api/study/by/' + username, { headers })
	.then(res => res.text())
	.then(function(res) {
		//console.log(res);
		studienliste = res.split('\n').filter(i => i);

		//console.log(studienliste);
		showstudylist(studienliste, context);
		// studylisttofile(studienliste);
		// getstudydata(studienliste, studienliste.length);
	});

}

function showstudylist(studylist, context) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	sl = document.getElementById("studienliste");

	studylist.forEach( study => {
		let li = document.createElement('li');
		li.id = JSON.parse(study).id;
		li.innerHTML = JSON.parse(study).name;
		sl.appendChild(li);
	});

	// Quelle: https://stackoverflow.com/questions/42722754/sorting-li-elements-alphabetically
  Array.from(sl.getElementsByTagName("LI"))
		.sort((a, b) => a.innerText.localeCompare(b.innerText))
		.forEach(li => sl.appendChild(li));

	$("#studienliste").removeClass('hideMe'); 

	$("#studienliste").selectable({

		selected: function (event, ui) {
			getLichessStudy(ui.selected.id, ui.selected.innerText, context);
		}
	});

}

function getLichessStudy(studyid, studyname, context) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	fetch('https://lichess.org/api/study/' + studyid + '.pgn', { headers })
	.then(res => res.text())
	.then(function(res) {
		//console.log(res);

		$('#importselectfilename').html(studyname);

		// Als globale Variable, da auf die Inhalte später noch per Klick zugegriffen werden soll
		GlobalImportedPGN = res.split("\n\n\n").filter(i => i); // .filter(i => i) entfernt leere Elemente

		LichessUserDialog.dialog('close');

		if(context == 'import') {
			prepareChallengeImport();
		} else {
			prepareLichessKapitel();
		}

	})

}

// Einzige Voraussetzung für diese Funktion ist: GlobalImportedPGN, also alle aktuellen Aufgaben in einem Array 
function prepareLichessKapitel() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	$('#aufgabenliste').addClass( "hideMe" );
	$('#kapitelliste').removeClass( "hideMe" );
	
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