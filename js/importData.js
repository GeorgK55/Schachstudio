// Das Kopieren aus der Zwischenablage als Einzelschritt ist nur wegen debug nötig.
// Wenn der Debugger hier schon gestartet ist, kommt eine Fehlermeldung (sinngemäß: not allowed) und die Zwischenablage wird nicht ausgelesen
// Ist auch so bei einer Internetrecherche zu finden
function DatenBereitstellen_Zwischenablage() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	navigator.clipboard.readText().then(text => { document.getElementById("importaufgabetext").innerHTML = text; ImportText = text })
		.catch(err => { document.getElementById("importaufgabetext").innerHTML = 'Failed to read clipboard contents: ' + err; })
		;
	prepareImportedData();
};

// Diese Funktion ruft - solange keine Fehler erkannt weden - zwingend die folgenden Funktionen auf:
// - handleFileSelect
// - onFileLoadedend
// - prepareChallengeImport
// Nach dieser Sequenz sind:
// - alle html-Elemente für eine Aufgabenauswal initialisiert ( = sichtbar und leer)
// - der Eventhandler "selectble" in der Aufgabenliste eingerichtet
function DatenBereitstellen_Datei() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());


	// Das inputElement wird hier immer neu angelegt. damit das changeevent IMMER getriggert wird
	// remove in onFileLoadedend
	const pgninput = document.createElement('input');
	pgninput.type = 'file';
	pgninput.id = 'file-input';
	//pgninput.setAttribute("multiple","");
	document.getElementById("fileimport").appendChild(pgninput);

	$('#file-input').trigger('click');
	$('#file-input').on('change', handleFileSelect);

}

// Das war eine Fundstelle im Netz
function handleFileSelect(e) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());
	let files = e.target.files;
	if (files.length < 1) {
		alert('select a file...');
		return;
	}
	let file = files[0];
	let reader = new FileReader();
	reader.onloadend = onFileLoadedend;
	reader.readAsText(file);
	$('#importselectfilename').html(file.name);
}

// Stellt die eingelesenen Daten in einem array von Aufgaben zur Verfügung
// Anschließend werden die allgemeinen Vorbereitungen aufgerufen
function onFileLoadedend(e) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	// Als globale Variable, da auf die Inhalte später noch per Klick zugegriffen werden soll
	GlobalImportedPGN = e.target.result.split("\n\n\n").filter(i => i); // .filter(i => i) entfernt leere Elemente
	document.getElementById("file-input").remove();
	prepareChallengeImport();
}

// Falls es mal mehrere Quellen gibt, gilt dies dann für alle Quellen
// Die Anzeige für die Aufgabenliste öffnen und die Selektion der Aufgaben bereitstellen
// Einzige Voraussetzung für diese Funktion ist: GlobalImportedPGN, also alle aktuellen Aufgaben in einem Array 
function prepareChallengeImport() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	$('#ul_importaufgaben').removeClass( "hideMe" );
	$('#f_importaufgabedaten').addClass( "hideMe" );
	$('#importaufgabePGN').children().addClass( "hideMe" );
	$('#importchessboard').addClass( "hideMe" );
	$('#importTreeNotationWrapperId').addClass( "hideMe" );
	$('#importactionbuttons').addClass( "hideMe" );

	$('#ul_importaufgaben').empty();
	for (i = 0; i < GlobalImportedPGN.length; i++) {
		let aufgabetext = GlobalImportedPGN[i].match(r_Event);
		//let aufgabetext = /Event "([^\"]*)/.exec(GlobalImportedPGN[i])[1];
		if (aufgabetext != null) {
			let newitem = '<li id="importedpgn_' + i + '">' + aufgabetext.groups.kapitel + '</li>';
			$(newitem).appendTo('#ul_importaufgaben');
		}
	}

	$("#ul_importaufgaben").selectable({
		selected: function (event, ui) {

			// Die Anzeige weiter öffnen und die jetzt neu angezeigten Teile zurücksetzen
			$('#f_importaufgabedaten').removeClass( "hideMe" );
			$('#importaufgabePGN').removeClass( "hideMe" );
			$('#importaufgabelabel').removeClass( "hideMe" );
			$('#importaufgabetext').removeClass( "hideMe" );
			$('#importchessboard').removeClass( "hideMe" );
			$('#importTreeNotationWrapperId').removeClass( "hideMe" ).empty();
			$('#importactionbuttons').removeClass( "hideMe" );

			// Die id der Aufgaben haben hinter dem Unterstrich einen Zähler. Das ist der Index der gelesenen Aufgaben
			GlobalImportedPGNIndex = ui.selected.id.split("_")[1];

			// Die Daten der Aufgabe vorbereiten und die Datenstrukturen mit den Aufgabedaten versorgen
			document.getElementById("importaufgabetext").innerHTML = GlobalImportedPGN[GlobalImportedPGNIndex];

			Importdaten			= new CImportdaten();
			Stellungsdaten	= new CStellungsdaten();
			Challenge				= new CChallenge();
		
					//scanChallengeMetaData0(GlobalImportedPGN[GlobalImportedPGNIndex]);
			scanPGN(GlobalImportedPGN[GlobalImportedPGNIndex]);
			notifyChallengeDetails(); 
			normalizePGNMoves(GlobalImportedPGN[GlobalImportedPGNIndex]);
			getImportBoard(); // schon in getImportBoard durchgeführt: .then(function() {	StellungAufbauen(T_Aufgabe.FEN)	}	);

			;
		}
	});

}

// Aus den Importdaten werden die die Aufgabe beschreibenden Daten extrahiert und in die Oberfläche übertragen
function scanPGN(PGNText) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	Challenge.PGN = PGNText;

	// Alle regex maskieren, da sonst die Fehlermeldung "groups für null" kommt

	// Dieser Ausdruck erkennt Standardlichesstexte (": " zwischen Studie und Kapitel)
	let m_Aufgabetext		= PGNText.match(r_Event);

	if (m_Aufgabetext == null) {
		Challenge.Kurztext = "Fehlt";
	} else {
		// Wenn der "lichess-Doppelpunkt" fehlt, steht der Kurztext in der Gruppe event, sonst in den Gruppen Studie und Kapitel
		if(m_Aufgabetext.groups.event == null) {
			Challenge.Kurztext = m_Aufgabetext.groups.kapitel;
			Challenge.Langtext = m_Aufgabetext.groups.studie;
		} else {
			Challenge.Kurztext = m_Aufgabetext.groups.event;
		}
	}

	let m_Quelle = (/(\[Site \")(?<site>.*)(\"\])/).exec(PGNText);
	if (m_Quelle != null) {
		Challenge.Quelle = m_Quelle.groups.site;
		if(m_Quelle.groups.site.includes('lichess')) {
			Challenge.lichess_studie_id = m_Quelle.groups.site.split('/').slice(-2)[0];
			Challenge.lichess_kapitel_id = m_Quelle.groups.site.split('/').slice(-1)[0];
		}
	}

	let m_Annotatortext	= PGNText.match(r_Annotator);
	if (m_Annotatortext != null) {
		Challenge.Annotator = m_Annotatortext.groups.annotatortext.includes('lichess') ? m_Annotatortext.groups.annotatortext.split('/').slice(-1)[0]:  m_Annotatortext.groups.annotatortext;
	}

	let m_Weiss = (/(\[White \")(?<weissname>.*)(\"\])/).exec(PGNText);
	if (m_Weiss != null) {
		Challenge.WeissName = m_Weiss.groups.weissname;
	}

	let m_Schwarz = (/(\[Black \")(?<schwarzname>.*)(\"\])/).exec(PGNText);
	if (m_Schwarz != null) {
		Challenge.SchwarzName = m_Schwarz.groups.schwarzname;
	}

	let m_Datum = (/(\[(UTC){0,1}Date \")(?<datum>.*)(\"\])/).exec(PGNText);
	if (m_Datum != null) {
		 let receiveddate= m_Datum.groups.datum.split('.');
		 Challenge.Datum = receiveddate[2] + '.' + receiveddate[1] + '.' + receiveddate[0];
	}

	// Weder Fritz noch lichess exportieren bei Partieanfang eine FEN. 

	let m_FEN_Exist = (/\[FEN/g).exec(PGNText);

	if (m_FEN_Exist == null) {

		Challenge.FEN = FEN_PARTIEANFANG;
		$('#fenimport').val(FEN_PARTIEANFANG);
		Challenge.AmZug = WEISSAMZUG;
		$("#amzugimport").val(WEISSAMZUG);

	} else {

		let m_FEN = (/(\[FEN \")(?<fen>.*)(\"\])/).exec(PGNText);
		Challenge.FEN = m_FEN.groups.fen;
		$('#fenimport').val(m_FEN.groups.fen);
			$("#amzugimport").val(WEISSAMZUG);
		if (m_FEN.groups.fen.includes("w")) { // laut Spezifikation ist es in klein
			Challenge.AmZug = WEISSAMZUG;
			$("#amzugimport").val(WEISSAMZUG);
		} else {
			Challenge.AmZug = SCHWARZAMZUG;
			$("#amzugimport").val(SCHWARZAMZUG);
		}

	}

}

function notifyChallengeDetails() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	//$('#ul_importaufgabedetails input').val('');

	$('#kurztextimport').val(Challenge.Kurztext);
	$('#langtextimport').val(Challenge.Langtext);
	$('#quelleimport').val(Challenge.Quelle);
	$('#annotatortextimport').val(Challenge.Annotator);
	$('#weissnameimport').val(Challenge.WeissName);
	$('#schwarznameimport').val(Challenge.SchwarzName);
	$('#datumimport').val(Challenge.Datum);
	$('#fenimport').val(Challenge.FEN);
	$("#amzugimport").val(Challenge.AmZug);

}

// Aus den Importdaten werden die die Aufgabe beschreibenden Daten extrahiert und in die Oberfläche übertragen
// function scanChallengeMetaData0(Importtext) {

// 	$('#ul_importaufgabedetails input').val('');

// 	Importdaten = new CImportdaten();
// 	T_Aufgabe		= new CAufgabe();

// 	T_Aufgabe.PGN = Importtext;

// 	// Alle regex maskieren, da sonst die Fehlermeldung "groups für null" kommt

// 	// Dieser Ausdruck erkennt Standardlichesstexte (": " zwischen Studie und Kapitel)
// 	let m_Aufgabetext		= Importtext.match(r_Event);

// 	if (m_Aufgabetext == null) {
// 		T_Aufgabe.Kurztext = "Fehlt";
// 		$('#kurztextimport').val("Fehlt");
// 		// Langtext ist optional und nullable
// 	} else {
// 		// Wenn der "lichess-Doppelpunkt" fehlt, steht der Kurztext in der Gruppe event, sonst in den Gruppen Studie und Kapitel
// 		if(m_Aufgabetext.groups.event == null) {
// 			T_Aufgabe.Kurztext = m_Aufgabetext.groups.kapitel;
// 			$('#kurztextimport').val(m_Aufgabetext.groups.kapitel);
// 			T_Aufgabe.Langtext = m_Aufgabetext.groups.studie;
// 			$('#langtextimport').val(m_Aufgabetext.groups.studie);
// 		} else {
// 			T_Aufgabe.Kurztext = m_Aufgabetext.groups.event;
// 			$('#kurztextimport').val(m_Aufgabetext.groups.event);
// 		}
// 	}

// 	let m_Quelle = (/(\[Site \")(?<site>.*)(\"\])/).exec(Importtext);
// 	if (m_Quelle != null) {
// 		T_Aufgabe.Quelle = m_Quelle.groups.site;
// 		$('#quelleimport').val(m_Quelle.groups.site);
// 	}

// 	let m_Annotatortext	= Importtext.match(r_Annotator);
// 	if (m_Annotatortext != null) {
// 		T_Aufgabe.Annotator = m_Annotatortext.groups.annotatortext;
// 		$('#annotatortextimport').val(m_Annotatortext.groups.annotatortext);
// 	}

// 	let m_Weiss = (/(\[White \")(?<weissname>.*)(\"\])/).exec(Importtext);
// 	if (m_Weiss != null) {
// 		T_Aufgabe.WeissName = m_Weiss.groups.weissname;
// 		$('#weissnameimport').val(m_Weiss.groups.weissname);
// 	}

// 	let m_Schwarz = (/(\[Black \")(?<schwarzname>.*)(\"\])/).exec(Importtext);
// 	if (m_Schwarz != null) {
// 		T_Aufgabe.SchwarzName = m_Schwarz.groups.schwarzname;
// 		$('#schwarznameimport').val(m_Schwarz.groups.schwarzname);
// 	}

// 	let m_Datum = (/(\[UTCDate \")(?<datum>.*)(\"\])/).exec(Importtext);
// 	if (m_Datum != null) {
// 		T_Aufgabe.Datum = m_Datum.groups.datum;
// 		$('#datumimport').val(m_Datum.groups.datum);
// 	}

// 	T_Aufgabe.Quelledetail	= "";
// 	T_Aufgabe.Scope					= "";
// 	T_Aufgabe.Skill					= "";

// 	// Fritz exportiert bei Partieanfang kein FEN. Deshalb erst mal so prüfen

// 	let m_FEN_Exist = (/\[FEN/g).exec(Importtext);

// 	if (m_FEN_Exist == null) {

// 		T_Aufgabe.FEN = FEN_PARTIEANFANG;
// 		$('#fenimport').val(FEN_PARTIEANFANG);
// 		T_Aufgabe.AmZug = WEISSAMZUG;
// 		$("#amzugimport").val(WEISSAMZUG);

// 	} else {

// 		let m_FEN = (/(\[FEN \")(?<fen>.*)(\"\])/).exec(Importtext);
// 		T_Aufgabe.FEN = m_FEN.groups.fen;
// 		$('#fenimport').val(m_FEN.groups.fen);
// 			$("#amzugimport").val(WEISSAMZUG);
// 		if (m_FEN.groups.fen.includes("w")) { // laut Spezifikation ist es in klein
// 			T_Aufgabe.AmZug = WEISSAMZUG;
// 			$("#amzugimport").val(WEISSAMZUG);
// 		} else {
// 			T_Aufgabe.AmZug = SCHWARZAMZUG;
// 			$("#amzugimport").val(SCHWARZAMZUG);
// 		}

// 	}

// }

// Die Zugangaben sind für ein angenehmes Lesen optimiert (Zeilenumbrüche, mal mit mal ohne Leerzeichen usw.)
// Hier werden alle später mal relevanten Teile voneinander getrennt und die optischen Optimierungen entfernt. 
// Nach jeder Korrektur gibt es eine neue Zeichenkette.
// Am Ende gibt es ein Array mit allen Einzelteilen
function normalizePGNMoves(Importtext) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	let ImportMoves = Importtext.match(r_Match_Moves);

	if (ImportMoves.length > 0) {

		// Es liegen Züge vor. Die Engine vorbereiten
		$("#triggertag").trigger("start_ucinewgame");

		// Zeilenschaltungen werden komplett und ohne weitere Bedingungen durch Leerzeichen ersetzt (Zeilenschaltung wird im pgn als Trenner gesehen)
		let OhneZeilenschaltungen		= ImportMoves[0].replace(/(\n)|(\r\n)|(\n\r)/g, " ");

		let PunkteKorrigiert				= OhneZeilenschaltungen.replace(r_Punkte, "$1" + ". ... ");

		let RundeKlammernZuAufKorrigiert	= PunkteKorrigiert.replace(r_RundeKlammernZuAuf, "$1" + " " + "$2");
		let EckigeKlammernZuAufKorrigiert	= RundeKlammernZuAufKorrigiert.replace(r_EckigeKlammernZuAuf, "$1" + " " + "$2");
		let RundeKlammernAufKorrigiert		= EckigeKlammernZuAufKorrigiert.replace(r_KlammernAuf, "$1" + " ");
		let RundeKlammernZuKorrigiert			= RundeKlammernAufKorrigiert.replace(r_KlammernZu, " " + "$1");

		let ZugnummerKorrigiert	= RundeKlammernZuKorrigiert.replace(r_Zugnummern, "$1" + " " + "$2");

		// Alle Einzelteile in eigene Arrayelemente. Die werden in das globale Objekt eingetragen
		Importdaten.PGN = ZugnummerKorrigiert.match(/[^ ]+/g);
	}

}

function ZuegePruefen(notationmode) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	GlobalActionContext = AC_CHALLENGEIMPORT;

	GLOBALNOTATIONMODE = notationmode == NOTATIONMODE_HIDDEN ? NOTATIONMODE_HIDDEN : NOTATIONMODE_VISIBLE;

	Zugpruefung = $.Deferred();

	Importdaten.PGN_Index		= 0;
	Importdaten.PreFEN			=	Challenge.FEN;	// Die FEN; die zu diesem Zug geführt hat
	Stellungsdaten.FEN			=	Challenge.FEN;	// Die FEN; mit der dieser Zug ausgeführt wird
	Stellungsdaten.ZugFarbe	=	Challenge.AmZug;

	Zugliste				= [];
	ChallengeMoves	= [];
	
	if(GLOBALNOTATIONMODE == NOTATIONMODE_VISIBLE) {

		// NotationstabelleAufgabe initiieren
		// In diesen tag wird die Notation eingetragen (könnte auch per jstree reinitialisiert werden?)
		$('#importTreeNotationWrapperId').empty()
			.append('<div id="importtreenotationid"></div>');

		$('#importtreenotationid').jstree({
			'plugins': ["themes"],
			'core': {
				'check_callback': true,
				'open_parents': true,
				'load_open': true,
				'themes': { 'icons': false },
				'hover_node':false // wirkt anscheinend nicht. Maus bleibt die Hand
			}
		});

		$('#importtreenotationid').jstree().create_node('#', {
			"id": "N_0",
			"text": "o"
		}, "last", function () { /*alert("PreNodeId created"); */
		});

		Stellungsdaten.CreateNewNode = true;
		
	}

	//StellungAufbauen(HTMLBRETTNAME_IMPORT, T_Aufgabe.FEN); // Hier auch noch ??? Ist das im select nicht schon ausreichend?
	validateSingleMove(); // Wird von hier aus einmalig am Beginn der Prüfung aufgerufen. Dann wiederholt im stockfishmodul

	return Zugpruefung.promise();

}

// Mit der in Importdaten aktuellen Situation startend, wird der nächste echte Zug gesucht.
// Eventuell wird Importdaten aktualisiert (Zugnummer, Varianten, ...)
// Bei kurzer Notation wird für den gefundenen Zug das Startfeld ermittelt
// Alle Daten über den Zug werden in einem globalen Objekt (entsprechend der Datenbanktabelle) gespeichert
function validateSingleMove() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	SingleMove = new CZuege();

	GlobalActionStep = AS_IDENTIFYUNIQUEMOVE;	// In diesem Step des Listeners werden die Ausgaben der Engine erwartet

	let m_BauerKurzeNotation;
	let m_FigurKurzeNotation;
	let m_Rochaden;
	let m_Zugnummer;

	// In dieser Schleife wird nach Zügen, Zugnummern und Klammern (=Varianten) differenziert
	// Die Schleife endet, wenn EIN echter Zug gefunden wurde oder wenn alle Daten betrachtet wurden
	// Die Zeiger auf die aktuelle Stelle in den Daten sind global
	// Der Anstoß für die nächste Iteration kommt aus dem Messagelistener
	do {

		m_BauerKurzeNotation	= r_BauerKurzeNotation.exec(Importdaten.PGN[Importdaten.PGN_Index]);
		m_FigurKurzeNotation	= r_FigurKurzeNotation.exec(Importdaten.PGN[Importdaten.PGN_Index]);
		m_Rochaden						= r_Rochaden.exec(Importdaten.PGN[Importdaten.PGN_Index]);
		m_Zugnummer						= r_Zugnummer.exec(Importdaten.PGN[Importdaten.PGN_Index]);

		// Das und nur das sind Züge
		if (m_BauerKurzeNotation != null || m_FigurKurzeNotation != null || m_Rochaden != null) {

			// Das gilt immer, egal was für ein Zug
			SingleMove.PreMoveId		= Stellungsdaten.CurMoveId;
			SingleMove.CurMoveId		= MOVEPRÄFIX + Importdaten.PGN_Index;
			SingleMove.CurMoveIndex	= Importdaten.PGN_Index;
			SingleMove.ZugNummer		= Importdaten.ZugNummer; // Gibt es die hier wirklich schon ???
			SingleMove.ZugLevel			= Stellungsdaten.ZugLevel;
			SingleMove.ZugFarbe			= Stellungsdaten.ZugFarbe;
			SingleMove.FEN					= Stellungsdaten.FEN;


			if (m_BauerKurzeNotation != null) {

				SingleMove.ZugUmwandlung	= m_BauerKurzeNotation.groups.umwandlung;
				SingleMove.ZugOriginal		= m_BauerKurzeNotation[0];
				SingleMove.ZugAktion			= m_BauerKurzeNotation.groups.capture.length > 0 ? SCHLÄGT : ZIEHTKURZ;
				SingleMove.ZugStart				= m_BauerKurzeNotation.groups.mitrank + m_BauerKurzeNotation.groups.mitfile; // Es kann ja nur eins davon geben
				SingleMove.ZugZeichen			= m_BauerKurzeNotation.groups.schachodermatt;
				SingleMove.ZugKurz				= m_BauerKurzeNotation.groups.mitfile + SingleMove.ZugAktion + m_BauerKurzeNotation.groups.targetfile + m_BauerKurzeNotation.groups.targetrank;
				SingleMove.ZugNach				= m_BauerKurzeNotation.groups.targetfile + m_BauerKurzeNotation.groups.targetrank;
				SingleMove.NAGMove				= m_BauerKurzeNotation.groups.nagmove;
				SingleMove.NAGSingle			= getNAGSingle(); // NAGSingle stehen vor den Kommentaren
				SingleMove.NAGNotation		= joinNAG();
				getKommentar(SingleMove, 1); // Kommentare gehören immer zu Zügen.

				// Jetzt werden die Kandidaten bestimmt und die Engine für alle Kandidaten befragt
				// Die Auswertung und die Ausfühurng des Zugs geschieht im Messagelistener.
				executeMove(m_BauerKurzeNotation);

			} else if (m_FigurKurzeNotation != null) {

				SingleMove.ZugFigur			= m_FigurKurzeNotation.groups.figur;
				SingleMove.ZugOriginal	= m_FigurKurzeNotation[0];
				SingleMove.ZugAktion		= m_FigurKurzeNotation.groups.capture.length > 0 ? SCHLÄGT : ZIEHTKURZ;
				SingleMove.ZugStart			= m_FigurKurzeNotation.groups.mitrank + m_FigurKurzeNotation.groups.mitfile; // Es kann ja nur eins davon geben
				SingleMove.ZugZeichen		= m_FigurKurzeNotation.groups.schachodermatt;
				SingleMove.ZugKurz			= m_FigurKurzeNotation.groups.figur + SingleMove.ZugStart + SingleMove.ZugAktion + m_FigurKurzeNotation.groups.targetfile + m_FigurKurzeNotation.groups.targetrank;
				SingleMove.ZugNach			= m_FigurKurzeNotation.groups.targetfile + m_FigurKurzeNotation.groups.targetrank;
				SingleMove.NAGMove			= m_FigurKurzeNotation.groups.nagmove;
				SingleMove.NAGSingle		= getNAGSingle(); // NAGSingle stehen vor den Kommentaren
				SingleMove.NAGNotation	= joinNAG();
				getKommentar(SingleMove, 1); // Kommentare gehören immer zu Zügen.

				// Jetzt werden die Kandidaten bestimmt und die Engine für alle Kandidaten befragt
				// Die Auswertung und die Ausfühurng des Zugs geschieht im Messagelistener.
				executeMove(m_FigurKurzeNotation);

			} else if (m_Rochaden != null) {

				if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log(m_Rochaden);

				SingleMove.ZugFigur				= "";
				SingleMove.ZugOriginal		= m_Rochaden[0].replace(/O/g, '0');
				SingleMove.ZugKurz				= m_Rochaden.groups.rochade.replace(/O/g, '0');
				SingleMove.ZugLang				= m_Rochaden.groups.rochade.replace(/O/g, '0'); // nur für Rochaden schon hier
				//SingleMove.ZugVon 				= ""; // Wird in executeRochade eingetragen
				//SingleMove.ZugNach				= ; // Wird in executeRochade eingetragen
				SingleMove.ZugAktion			= "";
				SingleMove.ZugUmwandlung	= "";
				SingleMove.ZugZeichen			= "";
				SingleMove.NAGMove				= m_Rochaden.groups.nagmove;
				SingleMove.NAGSingle			= getNAGSingle(); // NAGSingle stehen vor den Kommentaren
				SingleMove.NAGNotation		= joinNAG();
				getKommentar(SingleMove, 1); // Kommentare gehören immer zu Zügen.

				// Jetzt werden die Rochade exakt bestimmt und die Engine damit befragt
				// Die Auswertung und die Ausfühurng des Zugs geschieht im Messagelistener.
				executeRochade(m_Rochaden);
			}

			// wird nur in den Importdaten protokolliert. Erst, nachdem wieder ein Zug erkannt wird, wird SingleMove aktualisiert
		} else if (m_Zugnummer != null) {

			Importdaten.ZugNummer = parseInt(Importdaten.PGN[Importdaten.PGN_Index]);

			// Dann folgt eine Variante.
			// Es muss:
			// - der Übergang im Stack abgelegt werden
			// - der Level inkrementiert werden
			// - die Situation auf dem Brett auf den Vorgängerzug zurückgesetzt werden,
			//	 da ja der aktuelle Zug durch die Variante ersetzt wird
			// - der Zug vor der Variante als CurMove ausgewählt werden
		} else if (Importdaten.PGN[Importdaten.PGN_Index].indexOf("(") == 0) {

			if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log("( an index " + Importdaten.PGN_Index + " mit " + JSON.stringify(Importdaten.ZugStack));

			Importdaten.ZugStack.push({
				FEN:			Stellungsdaten.FEN,
				PreFEN:		Importdaten.PreFEN,
				PreNode:	Stellungsdaten.PreNodeId,
				CurNode:	Stellungsdaten.CurNodeId,
				PreMove:	Stellungsdaten.PreMoveId,
				CurMove:	Stellungsdaten.CurMoveId
			});

			Stellungsdaten.VarianteCounter++;
			Stellungsdaten.ZugLevel++;
			Stellungsdaten.VarianteColor[Stellungsdaten.ZugLevel]++;
			Stellungsdaten.FEN = Importdaten.PreFEN; // Damit bekommt der nächste Zug = erster in der Variante die FEN, die zum aktuellen Zug geführt hat
			Stellungsdaten.ZugFarbe = Stellungsdaten.FEN.includes("w") ? WEISSAMZUG : SCHWARZAMZUG; // Der aktuelle Zug bekommt die Farbe des wegen der Variante "zurückgenommenen" Zugs

			Stellungsdaten.PreNodeId = Stellungsdaten.CurNodeId; // Varianten werden immer in neue Notationszeilen geschrieben.

			Stellungsdaten.CurMoveId = Stellungsdaten.PreMoveId;
			SingleMove.CurMoveId = Stellungsdaten.PreMoveId; // Der aktuelle Zug soll nicht wirken

			Stellungsdaten.CreateNewNode = true;

			StellungAufbauen(Stellungsdaten.FEN);

			// Dann ist eine Variante beendet
			// Es muss:
			// - der Level dekrementiert werden
			// - der Übergang in diese Variante aus dem Stack geholt werden
			// - die Situation auf dem Brett hinter den letzten Zug vor der Variante gesetzt werden.
		} else if (Importdaten.PGN[Importdaten.PGN_Index].indexOf(")") == 0) {

			if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log(") an index " + Importdaten.PGN_Index + " mit " + JSON.stringify(Importdaten.ZugStack));

			Stellungsdaten.VarianteCounter++; // damit es in der Farbe VOR dieser Variante weitergeht
			Stellungsdaten.ZugLevel--;
			Stellungsdaten.VarianteColor[Stellungsdaten.ZugLevel]++;
			ZugStack							= [];
			ZugStack							= Importdaten.ZugStack.pop();
			Importdaten.PreFEN		= ZugStack.PreFEN;
			Stellungsdaten.FEN				= ZugStack.FEN;
			Stellungsdaten.ZugFarbe	= Stellungsdaten.FEN.includes("w") ? WEISSAMZUG : SCHWARZAMZUG;
			Stellungsdaten.PreNodeId = ZugStack.PreNode;
			Stellungsdaten.CurNodeId = ZugStack.CurNode;
			Stellungsdaten.CurMoveId = ZugStack.CurMove;
			Stellungsdaten.PreMoveId	= ZugStack.PreMove;
			SingleMove.CurMoveId			= ZugStack.CurMove; // Wird beim Erkennen des nächsten Zugs nach PreMoveid geschoben

			Stellungsdaten.CreateNewNode = true;

			StellungAufbauen(Stellungsdaten.FEN);

			// Dann muss es sich um einen Kommentar vor dem ersten Zug handeln. Der wird in die Aufgabe übernommen.
		} else if (Importdaten.PGN[Importdaten.PGN_Index].indexOf("{") == 0) {

			getKommentar(Challenge, 0);
			
			Importdaten.PGN_Index--; // zum nächsten Kommentar

		} else if (Importdaten.PGN[Importdaten.PGN_Index].indexOf("$") == 0) {

			// NAGSingle allein darf es nicht geben
			alert('NAGSingle erkannt. Laut Spezifikation nicht erlaubt');

		} else if (Importdaten.PGN[Importdaten.PGN_Index].indexOf("...") == 0) {
			// Wird das so gebraucht?
			//Importdaten.ZugFarbe 	= Importdaten.ZugFarbe == WEISSAMZUG ? SCHWARZAMZUG : WEISSAMZUG;
		} else {
			// Hier kommt das Ende eines Kommentars oder ?
			//alert(Importdaten.PGN[Importdaten.PGN_Index]);
		}
		Importdaten.PGN_Index++;

	} while (m_BauerKurzeNotation == null && m_FigurKurzeNotation == null && m_Rochaden == null && Importdaten.PGN_Index < Importdaten.PGN.length);

	if(Importdaten.PGN_Index >= Importdaten.PGN.length) {
		//alert('fertig');
		$( "#messagetext" ).fadeIn("fast")
			.html('fertig')
			.delay(10000)
			.fadeOut( "slow", function() {
				$('<p>fertig</p>').appendTo('#messageliste');
				$('#messagetext').empty();
		});

		//$( "#messageline" ).hide( "fade", 10000,  );
		Zugpruefung.resolve();
		//return Zugpruefung.promise();
	}
}

// Aus den Zugdaten und den Figuren auf dem Brett wird bestimmt, welche Figur gezogen ist.
// In der kurzen Notation werden ja nur die Zielfelder genannt. Stockfish braucht Züge aber zwingend in der Form filerankfilerank
// Es werden ALLE Figuren/Bauern der Farbe auf dem Brett gesucht und Stockfish zur Prüfung übergeben.
// Das Ergebnis sollte immer eineutig sein.
// Zugdaten ist der match des regulären Ausdrucks
function executeMove(Zugdaten) { 	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	let KandidatenID;
	let Kandidaten;
	let CurFigur;

	if (Zugdaten.groups.figur == null) {
		// Bauernzug. Entscheidung weiss oder schwarz nur über die aktuelle ZugFarbe möglich.
		// Bei Bauernzügen braucht nur über file weiter eingeschränkt werden. rank kann es ja nicht geben
		CurFigur = SingleMove.FEN.includes("w") ? 'P' : 'p';
		if (Zugdaten.groups.capture == '') {
			Kandidaten = $("[data-piece=" + CurFigur + "]");
		} else {
			Kandidaten = $("[data-square^='" + Zugdaten.groups.mitfile + "']").find('[data-piece="' + CurFigur + '"]');
		}

	} else {
		// Figurenzug. Der Name wird in der kurzen Notation immer gross geschrieben. Die Namen in den ID entsprechen FEN, also gross/klein für weiss/schwarz

		CurFigur = SingleMove.FEN.includes("w") ? (Zugdaten.groups.figur).toUpperCase() : Zugdaten.groups.figur.toLowerCase();

		if(SingleMove.ZugStart == "") { // ohne Startangeben
			Kandidaten = $("[data-piece=" + CurFigur + "]");
		} else if($.isNumeric(SingleMove.ZugStart)) { // dann ist es rank als Startangabe
			//Kandidaten = document.getElementById("importchessboard").querySelectorAll('[data-square$="' + SingleMove.ZugStart + '"]').querySelectorAll('[data-piece="' + CurFigur + '"]');
			Kandidaten = $("[data-square$='" + Zugdaten.groups.mitrank + "']").find('[data-piece="' + CurFigur + '"]');
		} else { // dann ist es file ls Startangabe
			//Kandidaten = document.getElementById("importchessboard").querySelectorAll('[data-square^="' + SingleMove.ZugStart + '"]').querySelectorAll('[data-piece="' + CurFigur + '"]');
			Kandidaten = $("[data-square^='" + Zugdaten.groups.mitfile + "']").find('[data-piece="' + CurFigur + '"]');
		}
	}

	for (const Kandidat of Kandidaten) {

		$("#triggertag").trigger("SetFenPosition", [SingleMove.FEN]);
		let EchteUmwandlung = Zugdaten.groups.umwandlung == "" ? "" : SingleMove.FEN.includes("w") ? Zugdaten.groups.umwandlung.toLowerCase() : Zugdaten.groups.umwandlung.toLowerCase();
		let von = Kandidat.parentNode.getAttribute('data-square');
		$("#triggertag").trigger("isMoveCorrect", [von + Zugdaten.groups.targetfile + Zugdaten.groups.targetrank + EchteUmwandlung]);
		
	}
}

// Die Situation kann eindeutig identifiziert werden. Diese ist zu prüfen.
function executeRochade(Zugdaten) { 	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	if (SingleMove.FEN.includes("w")) {
		SingleMove.ZugVon = "e1";
		SingleMove.ZugNach = Zugdaten.indexOf('0-0-0') == 0 ? "c1" : "g1";
	} else {
		SingleMove.ZugVon = "e8";
		SingleMove.ZugNach = Zugdaten.indexOf('0-0-0') == 0 ? "c8" : "g8";
	}

	$("#triggertag").trigger("SetFenPosition", [SingleMove.FEN]);
	$("#triggertag").trigger("isMoveCorrect", [SingleMove.ZugVon + SingleMove.ZugNach]);
}

// Für jeden Kommentar
function getKommentar(callingclass, offset) { 	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	// Es können mehrere Kommentare hintereinander vorkommen, deshalb while
	while (Importdaten.PGN_Index < Importdaten.PGN.length && Importdaten.PGN[Importdaten.PGN_Index + offset] == '{') {

		// Textkommentar oder Markierungskommentar
		Importdaten.PGN_Index++; // die öffnende geschweifte Klammer ist jetzt schon verarbeitet

		if (Importdaten.PGN_Index < Importdaten.PGN.length && Importdaten.PGN[Importdaten.PGN_Index + offset] == '[') { // Markierungskommentar

			while (Importdaten.PGN_Index < Importdaten.PGN.length && Importdaten.PGN[Importdaten.PGN_Index + offset] == '[') {
				Importdaten.PGN_Index++; // hinter die öffende eckige Klammer

				if (Importdaten.PGN_Index < Importdaten.PGN.length && Importdaten.PGN[Importdaten.PGN_Index + offset] == '%csl') {

					Importdaten.PGN_Index++; // hinter %csl

					while (Importdaten.PGN_Index < Importdaten.PGN.length && Importdaten.PGN[Importdaten.PGN_Index + offset] != ']') {
						callingclass.Hinweiskreis +=  Importdaten.PGN[Importdaten.PGN_Index + offset] + ' ';
						Importdaten.PGN_Index++; // auf den nächsten Kreis
					}
					callingclass.Hinweiskreis =  callingclass.Hinweiskreis.trim();

				} else if(Importdaten.PGN_Index < Importdaten.PGN.length && Importdaten.PGN[Importdaten.PGN_Index + offset] == '%cal') {

					Importdaten.PGN_Index++; // hinter %cal

					while (Importdaten.PGN_Index < Importdaten.PGN.length && Importdaten.PGN[Importdaten.PGN_Index + offset] != ']') {
						callingclass.Hinweispfeil +=  Importdaten.PGN[Importdaten.PGN_Index + offset] + ' ';
						Importdaten.PGN_Index++; // auf den nächsten Pfeil
					}
					callingclass.Hinweispfeil =  callingclass.Hinweispfeil.trim();

				} else {
					i = 0;
				}

				Importdaten.PGN_Index++; // hinter die schließende eckige Klammer
				//Importdaten.PGN_Index++; // hinter die schließende geschweifte Klammer

			}

		} else { // Textkommentar

			do {
				callingclass.Hinweistext +=  Importdaten.PGN[Importdaten.PGN_Index + offset] + ' ';
				Importdaten.PGN_Index++;
			} while (Importdaten.PGN[Importdaten.PGN_Index + offset].indexOf('}') < 0)
			callingclass.Hinweistext = callingclass.Hinweistext.trim();

		}

		Importdaten.PGN_Index++; // zum nächsten Kommentar

	}

}

// Sammelt alle mit $ startenden folgenden Elemente in einem String
function getNAGSingle() { 	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());
	let NAGSingle = "";
	if (Importdaten.PGN_Index < Importdaten.PGN.length && Importdaten.PGN[Importdaten.PGN_Index + 1].indexOf('$') == 0) {
		let fertig = false;
		do {
			NAGSingle += Importdaten.PGN[Importdaten.PGN_Index + 1] + ' '; // also ohne {
			Importdaten.PGN_Index++;
			if (Importdaten.PGN[Importdaten.PGN_Index + 1].indexOf('$') == -1) fertig = true;
		} while (!fertig)
	}
	return NAGSingle.trim();
}

// Teilt im aktuellen Zug einen NAG-String auf und ersetzt die $-Werte durch die anzuzeigenden Zeichen
function joinNAG() { 	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	let NotationNAG = '';

	if(SingleMove.NAGSingle != '') {
		let NAGSingleArray = SingleMove.NAGSingle.split(" ");

		NAGSingleArray.forEach(function(item) {
			try {
				NotationNAG += $.grep(NAGresult, function (NN, i) { return NN['DollarIndex'] == item; })[0].html;
			} catch(e) {
				console.log(e);
				alert('Undefined NAG: ' + item);
			}
		});
	}

	return SingleMove.NAGMove + NotationNAG;
}
