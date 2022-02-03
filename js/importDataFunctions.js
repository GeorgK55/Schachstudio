// Das Kopieren aus der Zwischenablage als Einzelschritt ist nur wegen debug nötig.
// Wenn der Debugger hier schon gestartet ist, kommt eine Fehlermeldung (sinngemäß: not allowed) und die Zwischenablage wird nicht ausgelesen
// Ist auch so bei einer Internetrecherche zu finden
function DatenBereitstellen_Zwischenablage() {

	navigator.clipboard.readText().then(text => {	document.getElementById("ImportAreaText").innerHTML = text;	ImportText = text	})
												 .catch(err => {	document.getElementById("ImportAreaText").innerHTML = 'Failed to read clipboard contents: '+err;	})
	;
	prepareImportedData();
};

function DatenBereitstellen_Datei() {

	$('#file-input').click();
	$('#file-input').change(handleFileSelect);
	
}

function DatenBereitstellen_Lichess() {

	LichessImportDialog = $( "#dialog_LichessImport" ).dialog({
		title: "Daten aus lichess.org übernehmen",
		height: 500,
		width: 700,
		modal: true,
		open: function () {
		},
		buttons: {
			'Übernehmen': function() {
				kapitelimport($('#lichesskapitel').val());
				$(this).dialog('close');
			},
			'Abbrechen': function() {
				$(this).dialog('close');
			}
		}
	});

	
}
function AufgabeImportieren() {

	Importdaten.init();

	Zugliste = [];

    // NotationstabelleAufgabe initiieren
	$('#ScrollWrapperImport').empty()
		.append('<div id="TreeNotationslisteImport"></div>');
		
	$('#TreeNotationslisteImport').jstree({ 	'plugins': [ "themes" ],
		'core' : { 
			'check_callback':	true,
			'open_parents':		true,
			'load_open':		true,
			'themes':			{ 'icons': false }
	}});

	$('#TreeNotationslisteImport').jstree().create_node('#', {
			 "id": 		"N_0",
			 "text": 	"o"
	  	}, "last", function() { /*alert("PreNodeId created"); */
	});

	Importdaten.CreateNewNode = true;

	scanMetaData(GlobalImportedPGN[GlobalImportedPGNIndex]); // eine (oder die einzige) Partie aus einer Datei		
	
	StellungAufbauen("Brett_ImportAufgabe", T_Aufgabe.FEN, 'zugmarkerimport');
	
	prepareMoveValidation(GlobalImportedPGN[GlobalImportedPGNIndex]);
	
	GlobalActionContext 	= AC_GAMEIMPORT;

	Importdaten.ZugStack.push( { 	FEN:		Importdaten.FEN, 
										PreFEN:		Importdaten.PreFEN, 
										PreNode:	Importdaten.PreNodeId,
										CurNode: 	Importdaten.CurNodeId,
										PreMove:	Importdaten.PreMoveId,
										CurMove:	Importdaten.CurMoveId
								     } ); 

	validateSingleMove();
}

// Aus den Importdaten werden die die Aufgabe beschreibenden Daten extrahiert und in die Oberfläche übertragen
function scanMetaData(Importtext) {

	T_Aufgabe.init();

	T_Aufgabe.PGN = Importtext;

	// Maskieren, da sonst die Fehlermeldung "groups für null" kommt
	var m_Kurztext = (/(\[Event \")(?<event>.*)(?<![\"\]])/g).exec(Importtext);
	// safari: (?![\[Event "])(.*)(?![^\"\]])
	if (m_Kurztext == null) {
		T_Aufgabe.Kurztext = "Fehlt";
		$('#KurztextImport').val("Fehlt");
	} else {
		T_Aufgabe.Kurztext = m_Kurztext.groups.event;
		$('#KurztextImport').val(m_Kurztext.groups.event);
	}

	var m_Quelle = (/(\[Site \")(?<site>.*)(?<![\"\]])/g).exec(Importtext);
	if (m_Quelle != null) {
		T_Aufgabe.Quelle = m_Quelle.groups.site;
		$('#QuelleImport').val(m_Quelle.groups.site);
	}
	
	// Aufgabe.Langtext 		= "";

	//T_Aufgabe.Quelledetail 	= "";
	
	//T_Aufgabe.Scope 			= "";
	
	//T_Aufgabe.Skill 			= "";
	
	// Fritz exportiert bei Partieanfang kein FEN. Deshalb erst mal so prüfen
	var m_FEN_Exist = (/\[FEN/g).exec(Importtext);

	if(m_FEN_Exist == null) {
		T_Aufgabe.FEN 		= FEN_PARTIEANFANG;
		$('#FENImport').val(FEN_PARTIEANFANG);
		T_Aufgabe.AmZug 	= WEISSAMZUG;
		$("#AmZugImport").val(WEISSAMZUG);
	} else {
		var m_FEN = (/(\[FEN \")(?<fen>.*)(?<![\"\]])/g).exec(Importtext).groups.fen;
		$('#FENImport').val(m_FEN);
		T_Aufgabe.FEN = m_FEN;
		if(m_FEN.includes("w")) { // laut Spezifikation ist es in klein
			T_Aufgabe.AmZug = WEISSAMZUG;
			$("#AmZugImport").val(WEISSAMZUG);
		} else {
			T_Aufgabe.AmZug = SCHWARZAMZUG;
			$("#AmZugImport").val(SCHWARZAMZUG);
		}
	}

	// ZugFarbe und und FEN sind jetzt schon bekannt. In das globale Objekt eintragen
	Importdaten.ZugFarbe	= T_Aufgabe.AmZug;
	Importdaten.PreFEN 		= T_Aufgabe.FEN;
	Importdaten.FEN 		= T_Aufgabe.FEN;
	if (Importdaten.ZugFarbe == WEISSAMZUG) {
		Importdaten.FEN_w = T_Aufgabe.FEN;
		Importdaten.FEN_b = "";
	} else {
		Importdaten.FEN_w = "";
		Importdaten.FEN_b = T_Aufgabe.FEN;
	}
}

// Die Zugangaben sind für ein angenehmes Lesen optimiert (Zeilenumbrüche, mal mit mal ohne Leerzeichen usw.)
// Hier werden alle später mal relevanten Teile voneinander getrennt. Am Ende gibt es ein Array mit allen Einzelteilen
function prepareMoveValidation(Importtext) {

	var ImportMoves 	= Importtext.match(r_Match_Moves);

	if(ImportMoves.length > 0) {

		// Es liegen Züge vor. Die Engine vorbereiten
		$("#TriggerTag").trigger("start_ucinewgame");

		// Zeilenschaltungen werden komplett und ohne weitere Bedingungen durch Leerzeichen ersetzt (Zeilenschaltung wird im pgn als Trenner gesehen)
		var OhneZeilenschaltungen 	= ImportMoves[0].replace(/(\n)|(\r\n)|(\n\r)/g, " ");

		var PunkteKorrigiert 		= OhneZeilenschaltungen.replace(r_Punkte, "$1" + ". ... ");

		var KlammernZuAufKorrigiert = PunkteKorrigiert.replace(r_KlammernZuAuf, "$1" + " " + "$2");
		var KlammernAufKorrigiert 	= KlammernZuAufKorrigiert.replace(r_KlammernAuf, "$1" + " ");
		var KlammernZuKorrigiert 	= KlammernAufKorrigiert.replace(r_KlammernZu, " " + "$1");

		var ZugnummerKorrigiert 	= KlammernZuKorrigiert.replace(r_Zugnummern, "$1" + " " + "$2");

		// Alle Einzelteile in eigene Arrayelemente. Die werden in das globale Objekt eingetragen
		Importdaten.PGN		= ZugnummerKorrigiert.match(/[^ ]+/g);
		Importdaten.PGN_Index		= 0; 
	}

}

// Mit der in Importdaten aktuellen Situation startend, wird der nächste echte Zug gesucht.
// Eventuell wird Importdaten aktualisiert (Zugnummer, Varianten, ...)
// Bei kurzer Notation wird für den gefundenen Zug das Startfeld ermittelt
// Alle Daten über den Zug werden in einem globalen Objekt (entsprechend der Datenbanktabelle) gespeichert
function validateSingleMove() {

	T_Zuege.init(); // Komplett, also alle Variable
	
	GlobalActionStep = AS_IDENTIFYUNIQUEMOVE;	// In diesem Step des Listeners werden die Ausgaben der Engine erwartet

	// In dieser Schleife wird nach Zügen, Zugnummern und Klammern (=Varianten) differenziert
	// Die Schleife endet, wenn EIN echter Zug gefunden wurde oder wenn alle Daten betrachtet wurden
	// Die Zeiger auf die aktuelle Stelle in den Daten sind global
	// Der Anstoß für die nächste Iteration kommt aus dem Messagelistener
	do {

		var m_BauerKurzeNotation	= r_BauerKurzeNotation.exec(Importdaten.PGN[Importdaten.PGN_Index]);
		var m_FigurKurzeNotation	= r_FigurKurzeNotation.exec(Importdaten.PGN[Importdaten.PGN_Index]);
		var m_Rochaden				= r_Rochaden.exec(Importdaten.PGN[Importdaten.PGN_Index]);
		var m_Zugnummer				= r_Zugnummer.exec(Importdaten.PGN[Importdaten.PGN_Index]);

		if(m_BauerKurzeNotation != null || m_FigurKurzeNotation != null || m_Rochaden != null) {				

			// Das gilt immer, egal was für ein Zug
			T_Zuege.PreMoveId 		= Importdaten.CurMoveId;
			T_Zuege.CurMoveId 		= MovePräfix + Importdaten.PGN_Index;
			T_Zuege.CurMoveIndex	= Importdaten.PGN_Index;
			T_Zuege.ZugNummer		= Importdaten.ZugNummer;
			T_Zuege.ZugLevel		= Importdaten.ZugLevel;
			T_Zuege.ZugFarbe		= Importdaten.ZugFarbe;
			T_Zuege.FEN				= Importdaten.FEN;

			if(m_BauerKurzeNotation != null) {

				T_Zuege.ZugOriginal		= m_BauerKurzeNotation[0];
				T_Zuege.ZugKurz			= m_BauerKurzeNotation[0];
				T_Zuege.ZugNach			= m_BauerKurzeNotation.groups.targetfile + m_BauerKurzeNotation.groups.targetrank;
				T_Zuege.ZugAktion 		= m_BauerKurzeNotation.groups.capture.length > 0 ? SCHLÄGT : ZIEHT;
				T_Zuege.ZugUmwandlung	= m_BauerKurzeNotation.groups.umwandlung;
				T_Zuege.ZugZeichen  	= m_BauerKurzeNotation.groups.schachodermatt;
				T_Zuege.NAG 			= getNAG(1); // NAG stehen vor den Kommentaren									
				T_Zuege.Hinweistext 	= getKommentar(1); // Kommentare gehören immer zu Zügen. 
			
				// Jetzt werden die Kandidaten bestimmt und die Engine für alle Kandidaten befragt
				// Die Auswertung und die Ausfühurng des Zugs geschieht im Messagelistener.
				executeMove(m_BauerKurzeNotation);

			} else if (m_FigurKurzeNotation != null) {

				T_Zuege.ZugFigur 		= m_FigurKurzeNotation.groups.figur;
				T_Zuege.ZugOriginal		= m_FigurKurzeNotation[0];
				T_Zuege.ZugKurz			= m_FigurKurzeNotation[0];
				T_Zuege.ZugNach			= m_FigurKurzeNotation.groups.targetfile + m_FigurKurzeNotation.groups.targetrank;
				T_Zuege.ZugAktion 		= m_FigurKurzeNotation.groups.capture.length > 0 ? SCHLÄGT : ZIEHT;
				T_Zuege.ZugZeichen  	= m_FigurKurzeNotation.groups.schachodermatt;									
				T_Zuege.NAG 			= getNAG(1); // NAG stehen vor den Kommentaren									
				T_Zuege.Hinweistext 	= getKommentar(1); // Kommentare gehören immer zu Zügen. 
				
				// Jetzt werden die Kandidaten bestimmt und die Engine für alle Kandidaten befragt
				// Die Auswertung und die Ausfühurng des Zugs geschieht im Messagelistener.
				executeMove(m_FigurKurzeNotation);

			} else if (m_Rochaden != null) {

				T_Zuege.ZugFigur 		= "";
				T_Zuege.ZugOriginal		= m_Rochaden[0].replace(/O/g, '0');
				T_Zuege.ZugKurz			= m_Rochaden[0].replace(/O/g, '0');
				T_Zuege.ZugLang			= m_Rochaden[0].replace(/O/g, '0'); // nur für Rochaden schon hier
				//T_Zuege.ZugVon 			= ""; // Wird in executeRochade eingetragen
				//T_Zuege.ZugNach			= ; // Wird in executeRochade eingetragen
				T_Zuege.ZugAktion 		= "";
				T_Zuege.ZugUmwandlung	= "";
				T_Zuege.ZugZeichen  	= "";
				T_Zuege.NAG 			= getNAG(1); // NAG stehen vor den Kommentaren									
				T_Zuege.Hinweistext 	= getKommentar(1); // Kommentare gehören immer zu Zügen. 

				// Jetzt werden die Rochade exakt bestimmt und die Engine damit befragt
				// Die Auswertung und die Ausfühurng des Zugs geschieht im Messagelistener.
				executeRochade(m_Rochaden);
			}
		
		// wird nur in den Importdaten protokolliert. Erst, nachdem wieder ein Zug erkannt wird, wird T_Zuege aktualisiert
		} else if (m_Zugnummer != null) {
			
			Importdaten.ZugNummer = parseInt(Importdaten.PGN[Importdaten.PGN_Index]);
		
		// Dann folgt eine Variante.
		// Es muss:
		// - der Übergang im Stack abgelegt werden
		// - der Level inkrementiert werden
		// - die Situation auf dem Brett auf den Vorgängerzug zurückgesetzt werden, 
		//   da ja der aktuelle Zug durch die Variante ersetzt wird
		// - der Zug vor der Variante als CurMove ausgewählt werden	
		} else if (Importdaten.PGN[Importdaten.PGN_Index].indexOf("(") == 0) {
			
				console.log("( an index " + Importdaten.PGN_Index + " mit " + JSON.stringify(Importdaten.ZugStack));

				Importdaten.ZugStack.push( { 	FEN: 		Importdaten.FEN, 
													PreFEN: 	Importdaten.PreFEN, 
													PreNode: 	Importdaten.PreNodeId,
													CurNode: 	Importdaten.CurNodeId,
													PreMove:	Importdaten.PreMoveId,
													CurMove:	Importdaten.CurMoveId
												 } );

				Importdaten.ZugLevel++;
				Importdaten.FEN 		= Importdaten.PreFEN; // Damit bekommt der nächste Zug = erster in der Variante die FEN, die zum aktuellen Zug geführt hat
				Importdaten.ZugFarbe 	= Importdaten.FEN.includes("w") ? WEISSAMZUG : SCHWARZAMZUG; // Der aktuelle Zug bekommt die Farbe des wegen der Variante "zurückgenommenen" Zugs
				
				Importdaten.PreNodeId 	= Importdaten.CurNodeId; // Varianten werden immer in neue Notationszeilen geschrieben.

				Importdaten.CurMoveId 	= Importdaten.PreMoveId;
				T_Zuege.CurMoveId 		= Importdaten.PreMoveId; // Der aktuelle Zug soll nicht wirken

				Importdaten.CreateNewNode = true;

				StellungAufbauen("Brett_ImportAufgabe", Importdaten.FEN, 'zugmarkerimport');

		// Dann ist eine Variante beendet 
		// Es muss:
		// - der Level dekrementiert werden
		// - der Übergang in diese Variante aus dem Stack geholt werden
		// - die Situation auf dem Brett hinter den letzten Zug vor der Variante gesetzt werden.
		} else if (Importdaten.PGN[Importdaten.PGN_Index].indexOf(")") == 0) {
			
				console.log(") an index " + Importdaten.PGN_Index + " mit " + JSON.stringify(Importdaten.ZugStack));

				Importdaten.ZugLevel--;
				ZugStack  = [];
				ZugStack 	= Importdaten.ZugStack.pop();
				Importdaten.PreFEN 		= ZugStack.PreFEN;
				Importdaten.FEN 		= ZugStack.FEN;
				Importdaten.ZugFarbe 	= Importdaten.FEN.includes("w") ? WEISSAMZUG : SCHWARZAMZUG;
				Importdaten.PreNodeId 	= ZugStack.PreNode;
				Importdaten.CurNodeId 	= ZugStack.CurNode;
				Importdaten.CurMoveId 	= ZugStack.CurMove;
				Importdaten.PreMoveId 	= ZugStack.PreMove;
				T_Zuege.CurMoveId 		= ZugStack.CurMove; // Wird beim Erkennen des nächsten Zugs nach PreMoveid geschoben
				if (T_Zuege.ZugFarbe == WEISSAMZUG) {
					Importdaten.FEN_w = T_Aufgabe.FEN;
					Importdaten.FEN_b = "";
				} else {
					Importdaten.FEN_w = "";
					Importdaten.FEN_b = T_Aufgabe.FEN;
				}
			
				Importdaten.CreateNewNode = true;
				
				StellungAufbauen("Brett_ImportAufgabe", Importdaten.FEN, 'zugmarkerimport');

			// Dann muss es sich um einen Kommentar vor dem ersten Zug handeln. Der wird jetzt einfach mal in die Aufgabe übernommen. Noch verbessern.
		} else if (Importdaten.PGN[Importdaten.PGN_Index].indexOf("{") == 0) {
			
			T_Aufgabe.Langtext = getKommentar(0);

		} else if (Importdaten.PGN[Importdaten.PGN_Index].indexOf("$") == 0) {
			
			// NAG allein darf es nicht geben
			alert('NAG erkannt');

		} else if (Importdaten.PGN[Importdaten.PGN_Index].indexOf("...") == 0) {
			// Wird das so gebraucht?
			//Importdaten.ZugFarbe 	= Importdaten.ZugFarbe == WEISSAMZUG ? SCHWARZAMZUG : WEISSAMZUG;
		} else {
			//alert();
		}
		Importdaten.PGN_Index++;

	} while (m_BauerKurzeNotation == null && m_FigurKurzeNotation == null && m_Rochaden == null && Importdaten.PGN_Index < Importdaten.PGN.length);
}

// Aus den Zugdaten und den Figuren auf dem Brett wird bestimmt, welche Figur gezogen ist.
// In der kurzen Notation werden ja nur die Zielfelder genannt. Stockfish braucht Züge aber zwingend in der Form filerankfilerank
// Es werden ALLE Figuren/Bauern der Farbe auf dem Brett gesucht und Stockfish zur Prüfung übergeben.
// Das Ergebnis sollte immer eineutig sein.
function executeMove(Zugdaten) { // Zugdaten ist der match des regulären Ausdrucks

	var KandidatenID;
	var Kandidaten;
	var  i = 0;

	if(Zugdaten.groups.figur == null) {
		// Bauernzug. Entscheidung weiss oder schwarz nur über die aktuelle ZugFarbe möglich
		KandidatenID = T_Zuege.FEN.includes("w") ? 'P_' + Zugdaten.groups.mitfile : 'p_' + Zugdaten.groups.mitfile;
		Kandidaten = $('[id^=' + KandidatenID + ']'); // Kandidaten sind ALLE Bauern der aktuellen Farbe
	} else {
		// Figurenzug. Der Name wird in der kurzen Notation immer gross geschrieben. Die Namen in den ID entsprechen FEN, also gross/klein für weiss/schwarz
		KandidatenID = T_Zuege.FEN.includes("w") ? (Zugdaten.groups.figur).toUpperCase()  + "_" + Zugdaten.groups.mitfile : (Zugdaten.groups.figur + "_" + Zugdaten.groups.mitfile).toLowerCase();
		//  + Zugdaten.groups.mitfile + Zugdaten.groups.mitrank
		Kandidaten = $('[id^=' + KandidatenID + ']');
		if(Zugdaten.groups.mitrank != "") Kandidaten = $('[id^=' + KandidatenID + ']').add('[id$=' + Zugdaten.groups.mitrank + ']'); // wegen Eindeutgkeit
		//Kandidaten = $('[id^=' + KandidatenID + ']').add('[id$=' + Zugdaten.groups.mitrank + ']');
	}

	Kandidaten.each(function( i, K ) {
		$("#TriggerTag").trigger("SetFenPosition", [ T_Zuege.FEN ] );

		//var EchteUmwandlung = (/[abcdefgh][27]/g).exec(K.id) != null ? Zugdaten.groups.umwandlung : "";
		var EchteUmwandlung = Zugdaten.groups.umwandlung == "" ? "" : T_Zuege.FEN.includes("w") ? Zugdaten.groups.umwandlung.toLowerCase() : Zugdaten.groups.umwandlung.toLowerCase();
		$("#TriggerTag").trigger("isMoveCorrect", [ K.id.match('[abcdefgh][12345678]') + T_Zuege.ZugNach + EchteUmwandlung ] );
	});
}

// Die Situation kann eindeutig identifiziert werden. Diese ist zu prüfen.
function executeRochade(Zugdaten) {

	if(T_Zuege.FEN.includes("w")) {
		T_Zuege.ZugVon 	= "e1";
		T_Zuege.ZugNach 	= Zugdaten.indexOf('0-0-0') == 0 ? "c1" : "g1"; 
	} else {
		T_Zuege.ZugVon 	= "e8";
		T_Zuege.ZugNach 	= Zugdaten.indexOf('0-0-0') == 0 ? "c8" : "g8";
	}

	$("#TriggerTag").trigger("SetFenPosition", [ T_Zuege.FEN ] );
	$("#TriggerTag").trigger("isMoveCorrect", [ T_Zuege.ZugVon + T_Zuege.ZugNach ] );
}

function getKommentar(Versatz) {
	var Kommentar = "";
	if(Importdaten.PGN_Index < Importdaten.PGN.length && Importdaten.PGN[Importdaten.PGN_Index + Versatz].indexOf('{') == 0) {
		var fertig = false;
		do {
			Kommentar += Importdaten.PGN[Importdaten.PGN_Index + Versatz] + ' '; // also ohne {
			Importdaten.PGN_Index++;
			if(Importdaten.PGN[Importdaten.PGN_Index].indexOf('}') == 0) fertig = true; 
		} while (!fertig)
		//T_Zuege.Hinweistext = Kommentar;
	}
	return Kommentar.replace('{','').replace('}','').trim();
}

function getNAG(Versatz) {
	var NAG = "";
	if(Importdaten.PGN_Index < Importdaten.PGN.length && Importdaten.PGN[Importdaten.PGN_Index + Versatz].indexOf('$') == 0) {
		var fertig = false;
		do {
			NAG += Importdaten.PGN[Importdaten.PGN_Index + Versatz] + ' '; // also ohne {
			Importdaten.PGN_Index++;
			if(Importdaten.PGN[Importdaten.PGN_Index + Versatz].indexOf('$') == -1) fertig = true; 
		} while (!fertig)
		//T_Zuege.Hinweistext = Kommentar;
	}
	return NAG.trim();
}

