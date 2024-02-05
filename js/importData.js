// Das Kopieren aus der Zwischenablage als Einzelschritt ist nur wegen debug nötig.
// Wenn der Debugger hier schon gestartet ist, kommt eine Fehlermeldung (sinngemäß: not allowed) und die Zwischenablage wird nicht ausgelesen
// Ist auch so bei einer Internetrecherche zu finden
function DatenBereitstellen_Zwischenablage() {

	navigator.clipboard.readText().then(text => { document.getElementById("importaufgabetext").innerHTML = text; ImportText = text })
		.catch(err => { document.getElementById("importaufgabetext").innerHTML = 'Failed to read clipboard contents: ' + err; })
		;
	prepareImportedData();
};

function DatenBereitstellen_Lichess() {

	LichessImportDialog = $("#dialog_LichessImport").dialog({
		title: "Daten aus lichess.org übernehmen",
		height: 500,
		width: 700,
		modal: true,
		open: function () {
		},
		buttons: {
			'Übernehmen': function () {
				kapitelimport($('#lichesskapitel').val());
				$(this).dialog('close');
			},
			'Abbrechen': function () {
				$(this).dialog('close');
			}
		}
	});

}

function DatenBereitstellen_Datei() {

	// Das inputElement wird hier immer neu angelegt. damit das changeevnet IMMER getriggert wird
	// remove in onFileLoadedend
	const pgninput = document.createElement('input');
	pgninput.type = 'file';
	pgninput.id = 'file-input';
	document.getElementById("fileimport").appendChild(pgninput);

	$('#file-input').trigger('click');
	$('#file-input').on('change', handleFileSelect);

}

// Das war eine Fundstelle im Netz
function handleFileSelect(e) {
	let files = e.target.files;
	if (files.length < 1) {
		alert('select a file...');
		return;
	}
	let file = files[0];
	let reader = new FileReader();
	reader.onloadend = onFileLoadedend;
	reader.readAsText(file);
	$('#filenametext').html(file.name);
}

// Stellt die eingelesenen Daten in einem array von Aufgaben zur Verfügung
// Anschließend werden die allgemeinen Vorbereitungen aufgerufen
function onFileLoadedend(e) {

	// Als globale Variable, da auf die Inhalte später noch per Klick zugegriffen werden soll
	GlobalImportedPGN = e.target.result.split("\n\n\n").filter(i => i); // .filter(i => i) entfernt leere Elemente
	document.getElementById("file-input").remove();
	prepareChallengeImport();
}

// Falls es mal mehrere Quellen gibt, gilt dies dann für alle Quellen
// Die Anzeige für die Aufgabenliste öffnen und die Selektion der Aufgaben bereitstellen
function prepareChallengeImport() {

	$('#ul_importaufgaben').removeClass( "hideMe" );
	$('#f_Aufgabedaten').addClass( "hideMe" );
	$('#importaufgabePGN').children().addClass( "hideMe" );
	$('#importchessboardId').addClass( "hideMe" );
	$('#importTreeNotationWrapperId').addClass( "hideMe" );
	$('#ImportButtons').addClass( "hideMe" );

	$('#ul_importaufgaben').empty();
	for (i = 0; i < GlobalImportedPGN.length; i++) {
		let aufgabetext = /Event "([^\"]*)/.exec(GlobalImportedPGN[i])[1];
		if (aufgabetext != null) {
			let newitem = '<li id="importedpgn_' + i + '">' + aufgabetext + '</li>';
			$(newitem).appendTo('#ul_importaufgaben');
		}
	}

	$("#ul_importaufgaben").selectable({
		selected: function (event, ui) {

			// Die Anzeige weiter öffnen und die jetzt neu angezeigten Teile zurücksetzen
			$('#f_Aufgabedaten').removeClass( "hideMe" );
			$('#importaufgabePGN').removeClass( "hideMe" );
			$('#importaufgabelabel').removeClass( "hideMe" );
			$('#importaufgabetext').removeClass( "hideMe" );
			$('#importchessboardId').removeClass( "hideMe" );
			$('#importTreeNotationWrapperId').removeClass( "hideMe" ).empty();
			$('#ImportButtons').removeClass( "hideMe" );

			// Die Namen der  Aufgaben haben hinter dem Unterstrich einen Zähler. Das ist der Index der gelesenen Aufgaben
			GlobalImportedPGNIndex = ui.selected.id.split("_")[1];

			// Die Daten der Aufgabe vorbereiten und die Datenstrukturen mit den Aufgabedaten versorgen
			document.getElementById("importaufgabetext").innerHTML = GlobalImportedPGN[GlobalImportedPGNIndex];
			scanChallengeMetaData(GlobalImportedPGN[GlobalImportedPGNIndex]);
			scanChallengePGNData(GlobalImportedPGN[GlobalImportedPGNIndex]);
			getImportBoard();

			StellungAufbauen(HTMLBRETTNAME_IMPORT, T_Aufgabe.FEN);
		}
	});
}

// Aus den Importdaten werden die die Aufgabe beschreibenden Daten extrahiert und in die Oberfläche übertragen
function scanChallengeMetaData(Importtext) {

	$('#ImportAufgabedetails input').val('');

	Importdaten = new CImportdaten();
	T_Aufgabe		= new CAufgabe();

	T_Aufgabe.PGN = Importtext;

	// Alle regex maskieren, da sonst die Fehlermeldung "groups für null" kommt

	// Dieser Ausdruck erkennt Standardlichesstexte (": " zwischen Studie und Kapitel)
	let m_Aufgabetext		= Importtext.match(r_Event);

	if (m_Aufgabetext == null) {
		T_Aufgabe.Kurztext = "Fehlt";
		$('#KurztextImport').val("Fehlt");
		// Langtext ist optional und nullable
	} else {
		// Wenn der "lichess-Doppelpunkt" fehlt, steht der Kurztext in der Gruppe event, sonst in den Gruppen Studie und Kapitel
		if(m_Aufgabetext.groups.event == null) {
			T_Aufgabe.Kurztext = m_Aufgabetext.groups.kapitel;
			$('#KurztextImport').val(m_Aufgabetext.groups.kapitel);
			T_Aufgabe.Langtext = m_Aufgabetext.groups.studie;
			$('#LangtextImport').val(m_Aufgabetext.groups.studie);
		} else {
			T_Aufgabe.Kurztext = m_Aufgabetext.groups.event;
			$('#KurztextImport').val(m_Aufgabetext.groups.event);
		}
	}

	let m_Quelle = (/(\[Site \")(?<site>.*)(\"\])/).exec(Importtext);
	if (m_Quelle != null) {
		T_Aufgabe.Quelle = m_Quelle.groups.site;
		$('#QuelleImport').val(m_Quelle.groups.site);
	}

	let m_Annotatortext	= Importtext.match(r_Annotator);
	if (m_Annotatortext != null) {
		T_Aufgabe.Annotator = m_Annotatortext.groups.annotatortext;
		$('#AnnotatortextImport').val(m_Annotatortext.groups.annotatortext);
	}

	let m_Weiss = (/(\[White \")(?<weissname>.*)(\"\])/).exec(Importtext);
	if (m_Weiss != null) {
		T_Aufgabe.WeissName = m_Weiss.groups.weissname;
		$('#WeissNameImport').val(m_Weiss.groups.weissname);
	}

	let m_Schwarz = (/(\[Black \")(?<schwarzname>.*)(\"\])/).exec(Importtext);
	if (m_Schwarz != null) {
		T_Aufgabe.SchwarzName = m_Schwarz.groups.schwarzname;
		$('#SchwarzNameImport').val(m_Schwarz.groups.schwarzname);
	}

	let m_Datum = (/(\[UTCDate \")(?<datum>.*)(\"\])/).exec(Importtext);
	if (m_Datum != null) {
		T_Aufgabe.Datum = m_Datum.groups.datum;
		$('#DatumImport').val(m_Datum.groups.datum);
	}

	T_Aufgabe.Quelledetail	= "";
	T_Aufgabe.Scope					= "";
	T_Aufgabe.Skill					= "";

	// Fritz exportiert bei Partieanfang kein FEN. Deshalb erst mal so prüfen

	let m_FEN_Exist = (/\[FEN/g).exec(Importtext);

	if (m_FEN_Exist == null) {

		T_Aufgabe.FEN = FEN_PARTIEANFANG;
		$('#FENImport').val(FEN_PARTIEANFANG);
		T_Aufgabe.AmZug = WEISSAMZUG;
		$("#AmZugImport").val(WEISSAMZUG);

	} else {

		let m_FEN = (/(\[FEN \")(?<fen>.*)(\"\])/).exec(Importtext);
		T_Aufgabe.FEN = m_FEN.groups.fen;
		$('#FENImport').val(m_FEN.groups.fen);
			$("#AmZugImport").val(WEISSAMZUG);
		if (m_FEN.groups.fen.includes("w")) { // laut Spezifikation ist es in klein
			T_Aufgabe.AmZug = WEISSAMZUG;
			$("#AmZugImport").val(WEISSAMZUG);
		} else {
			T_Aufgabe.AmZug = SCHWARZAMZUG;
			$("#AmZugImport").val(SCHWARZAMZUG);
		}

	}

	// ZugFarbe und und FEN sind jetzt schon bekannt. In das globale Objekt eintragen
	Importdaten.ZugFarbe	= T_Aufgabe.AmZug;
	Importdaten.PreFEN		= T_Aufgabe.FEN;
	Importdaten.FEN 			= T_Aufgabe.FEN;
}

// Die Zugangaben sind für ein angenehmes Lesen optimiert (Zeilenumbrüche, mal mit mal ohne Leerzeichen usw.)
// Hier werden alle später mal relevanten Teile voneinander getrennt. Am Ende gibt es ein Array mit allen Einzelteilen
function scanChallengePGNData(Importtext) {

	let ImportMoves = Importtext.match(r_Match_Moves);

	if (ImportMoves.length > 0) {

		// Es liegen Züge vor. Die Engine vorbereiten
		$("#TriggerTag").trigger("start_ucinewgame");

		// Zeilenschaltungen werden komplett und ohne weitere Bedingungen durch Leerzeichen ersetzt (Zeilenschaltung wird im pgn als Trenner gesehen)
		let OhneZeilenschaltungen = ImportMoves[0].replace(/(\n)|(\r\n)|(\n\r)/g, " ");

		let PunkteKorrigiert = OhneZeilenschaltungen.replace(r_Punkte, "$1" + ". ... ");

		let KlammernZuAufKorrigiert = PunkteKorrigiert.replace(r_KlammernZuAuf, "$1" + " " + "$2");
		let KlammernAufKorrigiert = KlammernZuAufKorrigiert.replace(r_KlammernAuf, "$1" + " ");
		let KlammernZuKorrigiert = KlammernAufKorrigiert.replace(r_KlammernZu, " " + "$1");

		let ZugnummerKorrigiert = KlammernZuKorrigiert.replace(r_Zugnummern, "$1" + " " + "$2");

		// Alle Einzelteile in eigene Arrayelemente. Die werden in das globale Objekt eingetragen
		Importdaten.PGN = ZugnummerKorrigiert.match(/[^ ]+/g);
	}

}

function ZuegePruefen() {

	Importdaten.ZugFarbe	=	T_Aufgabe.AmZug;
	Importdaten.PreFEN		=	T_Aufgabe.FEN;	// Die FEN; die zu diesem Zug geführt hat
	Importdaten.FEN				=	T_Aufgabe.FEN;	// Die FEN; mit der dieser Zug ausgeführt wird

	Zugliste = [];

	// NotationstabelleAufgabe initiieren
	// In diesen tag wird die Notation eingetragen (könnte auch per jstree reinitialisiert werden?)
	$('#importTreeNotationWrapperId').empty()
		.append('<div id="ImportTreeNotationId"></div>');

	$('#ImportTreeNotationId').jstree({
		'plugins': ["themes"],
		'core': {
			'check_callback': true,
			'open_parents': true,
			'load_open': true,
			'themes': { 'icons': false },
			'hover_node':false // wirkt anscheinend nicht. Maus bleibt die Hand
		}
	});

	$('#ImportTreeNotationId').jstree().create_node('#', {
		"id": "N_0",
		"text": "o"
	}, "last", function () { /*alert("PreNodeId created"); */
	});

	Importdaten.CreateNewNode = true;

	StellungAufbauen(HTMLBRETTNAME_IMPORT, T_Aufgabe.FEN);
	validateSingleMove(); // Wird von hier aus einmalig am Beginn der Prüfung aufgerufen. Dann wiederholt im stockfishmodul

}

// Mit der in Importdaten aktuellen Situation startend, wird der nächste echte Zug gesucht.
// Eventuell wird Importdaten aktualisiert (Zugnummer, Varianten, ...)
// Bei kurzer Notation wird für den gefundenen Zug das Startfeld ermittelt
// Alle Daten über den Zug werden in einem globalen Objekt (entsprechend der Datenbanktabelle) gespeichert
function validateSingleMove() {

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
			SingleMove.PreMoveId		= Importdaten.CurMoveId;
			SingleMove.CurMoveId		= MOVEPRÄFIX + Importdaten.PGN_Index;
			SingleMove.CurMoveIndex	= Importdaten.PGN_Index;
			SingleMove.ZugNummer		= Importdaten.ZugNummer;
			SingleMove.ZugLevel			= Importdaten.ZugLevel;
			SingleMove.ZugFarbe			= Importdaten.ZugFarbe;
			SingleMove.FEN					= Importdaten.FEN;


			if (m_BauerKurzeNotation != null) {

				SingleMove.ZugUmwandlung	= m_BauerKurzeNotation.groups.umwandlung;
				SingleMove.ZugOriginal		= m_BauerKurzeNotation[0];
				SingleMove.ZugAktion			= m_BauerKurzeNotation.groups.capture.length > 0 ? SCHLÄGT : ZIEHTKURZ;
				SingleMove.ZugZeichen		= m_BauerKurzeNotation.groups.schachodermatt;
				SingleMove.ZugKurz				= m_BauerKurzeNotation.groups.mitfile + SingleMove.ZugAktion + m_BauerKurzeNotation.groups.targetfile + m_BauerKurzeNotation.groups.targetrank;
				SingleMove.ZugNach				= m_BauerKurzeNotation.groups.targetfile + m_BauerKurzeNotation.groups.targetrank;
				SingleMove.NAGMove				= m_BauerKurzeNotation.groups.nagmove;
				SingleMove.NAGSingle			= getNAGSingle(1); // NAGSingle stehen vor den Kommentaren
				SingleMove.NAGNotation		= joinNAG();
				SingleMove.Hinweistext		= getKommentar(1); // Kommentare gehören immer zu Zügen.

				// Jetzt werden die Kandidaten bestimmt und die Engine für alle Kandidaten befragt
				// Die Auswertung und die Ausfühurng des Zugs geschieht im Messagelistener.
				executeMove(m_BauerKurzeNotation);

			} else if (m_FigurKurzeNotation != null) {

				SingleMove.ZugFigur		= m_FigurKurzeNotation.groups.figur;
				SingleMove.ZugOriginal	= m_FigurKurzeNotation[0];
				SingleMove.ZugAktion		= m_FigurKurzeNotation.groups.capture.length > 0 ? SCHLÄGT : ZIEHTKURZ;
				SingleMove.ZugZeichen	= m_FigurKurzeNotation.groups.schachodermatt;
				SingleMove.ZugKurz			= m_FigurKurzeNotation.groups.figur + SingleMove.ZugAktion + m_FigurKurzeNotation.groups.targetfile + m_FigurKurzeNotation.groups.targetrank;
				SingleMove.ZugNach			= m_FigurKurzeNotation.groups.targetfile + m_FigurKurzeNotation.groups.targetrank;
				SingleMove.NAGMove			= m_FigurKurzeNotation.groups.nagmove;
				SingleMove.NAGSingle		= getNAGSingle(1); // NAGSingle stehen vor den Kommentaren
				SingleMove.NAGNotation = joinNAG();
				SingleMove.Hinweistext = getKommentar(1); // Kommentare gehören immer zu Zügen.

				// Jetzt werden die Kandidaten bestimmt und die Engine für alle Kandidaten befragt
				// Die Auswertung und die Ausfühurng des Zugs geschieht im Messagelistener.
				executeMove(m_FigurKurzeNotation);

			} else if (m_Rochaden != null) {

				if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log(m_Rochaden);

				SingleMove.ZugFigur			= "";
				SingleMove.ZugOriginal		= m_Rochaden[0].replace(/O/g, '0');
				SingleMove.ZugKurz				= m_Rochaden.groups.rochade.replace(/O/g, '0');
				SingleMove.ZugLang				= m_Rochaden.groups.rochade.replace(/O/g, '0'); // nur für Rochaden schon hier
				//SingleMove.ZugVon 				= ""; // Wird in executeRochade eingetragen
				//SingleMove.ZugNach				= ; // Wird in executeRochade eingetragen
				SingleMove.ZugAktion			= "";
				SingleMove.ZugUmwandlung	= "";
				SingleMove.ZugZeichen		= "";
				SingleMove.NAGMove				= m_Rochaden.groups.nagmove;
				SingleMove.NAGSingle			= getNAGSingle(1); // NAGSingle stehen vor den Kommentaren
				SingleMove.NAGNotation		= joinNAG();
				SingleMove.Hinweistext		= getKommentar(1); // Kommentare gehören immer zu Zügen.

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
				FEN:			Importdaten.FEN,
				PreFEN:		Importdaten.PreFEN,
				PreNode:	Importdaten.PreNodeId,
				CurNode:	Importdaten.CurNodeId,
				PreMove:	Importdaten.PreMoveId,
				CurMove:	Importdaten.CurMoveId
			});

			Importdaten.VarianteCounter++;
			Importdaten.ZugLevel++;
			Importdaten.VarianteColor[Importdaten.ZugLevel]++;
			Importdaten.FEN = Importdaten.PreFEN; // Damit bekommt der nächste Zug = erster in der Variante die FEN, die zum aktuellen Zug geführt hat
			Importdaten.ZugFarbe = Importdaten.FEN.includes("w") ? WEISSAMZUG : SCHWARZAMZUG; // Der aktuelle Zug bekommt die Farbe des wegen der Variante "zurückgenommenen" Zugs

			Importdaten.PreNodeId = Importdaten.CurNodeId; // Varianten werden immer in neue Notationszeilen geschrieben.

			Importdaten.CurMoveId = Importdaten.PreMoveId;
			SingleMove.CurMoveId = Importdaten.PreMoveId; // Der aktuelle Zug soll nicht wirken

			Importdaten.CreateNewNode = true;

			StellungAufbauen(HTMLBRETTNAME_IMPORT, Importdaten.FEN);

			// Dann ist eine Variante beendet
			// Es muss:
			// - der Level dekrementiert werden
			// - der Übergang in diese Variante aus dem Stack geholt werden
			// - die Situation auf dem Brett hinter den letzten Zug vor der Variante gesetzt werden.
		} else if (Importdaten.PGN[Importdaten.PGN_Index].indexOf(")") == 0) {

			if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log(") an index " + Importdaten.PGN_Index + " mit " + JSON.stringify(Importdaten.ZugStack));

			Importdaten.VarianteCounter++; // damit es in der Farbe VOR dieser Variante weitergeht
			Importdaten.ZugLevel--;
			Importdaten.VarianteColor[Importdaten.ZugLevel]++;
			ZugStack							= [];
			ZugStack							= Importdaten.ZugStack.pop();
			Importdaten.PreFEN		= ZugStack.PreFEN;
			Importdaten.FEN				= ZugStack.FEN;
			Importdaten.ZugFarbe	= Importdaten.FEN.includes("w") ? WEISSAMZUG : SCHWARZAMZUG;
			Importdaten.PreNodeId = ZugStack.PreNode;
			Importdaten.CurNodeId = ZugStack.CurNode;
			Importdaten.CurMoveId = ZugStack.CurMove;
			Importdaten.PreMoveId	= ZugStack.PreMove;
			SingleMove.CurMoveId			= ZugStack.CurMove; // Wird beim Erkennen des nächsten Zugs nach PreMoveid geschoben

			Importdaten.CreateNewNode = true;

			StellungAufbauen(HTMLBRETTNAME_IMPORT, Importdaten.FEN);

			// Dann muss es sich um einen Kommentar vor dem ersten Zug handeln. Der wird jetzt einfach mal in die Aufgabe übernommen. Noch verbessern.
		} else if (Importdaten.PGN[Importdaten.PGN_Index].indexOf("{") == 0) {

			T_Aufgabe.Langtext = getKommentar(0);

		} else if (Importdaten.PGN[Importdaten.PGN_Index].indexOf("$") == 0) {

			// NAGSingle allein darf es nicht geben
			alert('NAGSingle erkannt. Laut Spezifikation nicht erlaubt');

		} else if (Importdaten.PGN[Importdaten.PGN_Index].indexOf("...") == 0) {
			// Wird das so gebraucht?
			//Importdaten.ZugFarbe 	= Importdaten.ZugFarbe == WEISSAMZUG ? SCHWARZAMZUG : WEISSAMZUG;
		} else {
			//alert(Importdaten.PGN[Importdaten.PGN_Index]);
		}
		Importdaten.PGN_Index++;

	} while (m_BauerKurzeNotation == null && m_FigurKurzeNotation == null && m_Rochaden == null && Importdaten.PGN_Index < Importdaten.PGN.length);
}

// Aus den Zugdaten und den Figuren auf dem Brett wird bestimmt, welche Figur gezogen ist.
// In der kurzen Notation werden ja nur die Zielfelder genannt. Stockfish braucht Züge aber zwingend in der Form filerankfilerank
// Es werden ALLE Figuren/Bauern der Farbe auf dem Brett gesucht und Stockfish zur Prüfung übergeben.
// Das Ergebnis sollte immer eineutig sein.
function executeMove(Zugdaten) { // Zugdaten ist der match des regulären Ausdrucks

	let KandidatenID;
	let Kandidaten;
	let i = 0;

	if (Zugdaten.groups.figur == null) {
		// Bauernzug. Entscheidung weiss oder schwarz nur über die aktuelle ZugFarbe möglich
		KandidatenID = SingleMove.FEN.includes("w") ? 'P_' + Zugdaten.groups.mitfile : 'p_' + Zugdaten.groups.mitfile;
		Kandidaten = $('[id^=' + KandidatenID + ']'); // Kandidaten sind ALLE Bauern der aktuellen Farbe
	} else {
		// Figurenzug. Der Name wird in der kurzen Notation immer gross geschrieben. Die Namen in den ID entsprechen FEN, also gross/klein für weiss/schwarz
		KandidatenID = SingleMove.FEN.includes("w") ? (Zugdaten.groups.figur).toUpperCase() + "_" + Zugdaten.groups.mitfile : (Zugdaten.groups.figur + "_" + Zugdaten.groups.mitfile).toLowerCase();
		//	+ Zugdaten.groups.mitfile + Zugdaten.groups.mitrank
		Kandidaten = $('[id^=' + KandidatenID + ']');
		if (Zugdaten.groups.mitrank != "") Kandidaten = $('[id^=' + KandidatenID + ']').add('[id$=' + Zugdaten.groups.mitrank + ']'); // wegen Eindeutgkeit
		//Kandidaten = $('[id^=' + KandidatenID + ']').add('[id$=' + Zugdaten.groups.mitrank + ']');
	}

	Kandidaten.each(function (i, K) {
		$("#TriggerTag").trigger("SetFenPosition", [SingleMove.FEN]);

		//let EchteUmwandlung = (/[abcdefgh][27]/g).exec(K.id) != null ? Zugdaten.groups.umwandlung : "";
		let EchteUmwandlung = Zugdaten.groups.umwandlung == "" ? "" : SingleMove.FEN.includes("w") ? Zugdaten.groups.umwandlung.toLowerCase() : Zugdaten.groups.umwandlung.toLowerCase();
		$("#TriggerTag").trigger("isMoveCorrect", [K.id.match('[abcdefgh][12345678]') + SingleMove.ZugNach + EchteUmwandlung]);
	});
}

// Die Situation kann eindeutig identifiziert werden. Diese ist zu prüfen.
function executeRochade(Zugdaten) {

	if (SingleMove.FEN.includes("w")) {
		SingleMove.ZugVon = "e1";
		SingleMove.ZugNach = Zugdaten.indexOf('0-0-0') == 0 ? "c1" : "g1";
	} else {
		SingleMove.ZugVon = "e8";
		SingleMove.ZugNach = Zugdaten.indexOf('0-0-0') == 0 ? "c8" : "g8";
	}

	$("#TriggerTag").trigger("SetFenPosition", [SingleMove.FEN]);
	$("#TriggerTag").trigger("isMoveCorrect", [SingleMove.ZugVon + SingleMove.ZugNach]);
}

function getKommentar(Versatz) {
	let Kommentar = "";
	if (Importdaten.PGN_Index < Importdaten.PGN.length && Importdaten.PGN[Importdaten.PGN_Index + Versatz].indexOf('{') == 0) {
		let fertig = false;
		do {
			Kommentar += Importdaten.PGN[Importdaten.PGN_Index + Versatz] + ' '; // also ohne {
			Importdaten.PGN_Index++;
			if (Importdaten.PGN[Importdaten.PGN_Index].indexOf('}') == 0) fertig = true;
		} while (!fertig)
		//SingleMove.Hinweistext = Kommentar;
	}
	return Kommentar.replace('{', '').replace('}', '').trim();
}

function getNAGSingle(Versatz) {
	let NAGSingle = "";
	if (Importdaten.PGN_Index < Importdaten.PGN.length && Importdaten.PGN[Importdaten.PGN_Index + Versatz].indexOf('$') == 0) {
		let fertig = false;
		do {
			NAGSingle += Importdaten.PGN[Importdaten.PGN_Index + Versatz] + ' '; // also ohne {
			Importdaten.PGN_Index++;
			if (Importdaten.PGN[Importdaten.PGN_Index + Versatz].indexOf('$') == -1) fertig = true;
		} while (!fertig)
		//SingleMove.Hinweistext = Kommentar;
	}
	return NAGSingle.trim();
}

function joinNAG() {

	let NotationNAG = '';

	if(SingleMove.NAGSingle != '') {
		let NAGSingleArray = SingleMove.NAGSingle.split(" ");

		NAGSingleArray.forEach(function(item) {
			NotationNAG += $.grep(NAGresult, function (NN, i) { return NN['DollarIndex'] == item; })[0].html;
		});
	}

	return SingleMove.NAGMove + NotationNAG;
}
