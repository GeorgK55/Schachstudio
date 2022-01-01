// Das Kopieren aus der Zwischenablage als Einzelschritt ist nur wegen debug nötig.
// Wenn der Debugger hier schon gestartet ist, kommt eine Fehlermeldung (sinngemäß: not allowed) und die Zwischenablage wird nicht ausgelesen
// Ist auch so bei einer Internetrecherche zu finden
function DatenBereitstellen_Zwischenablage() {

	navigator.clipboard.readText().then(text => {	document.getElementById("ImportAreaText").innerHTML = text;	ImportText = text	})
												 .catch(err => {	document.getElementById("ImportAreaText").innerHTML = 'Failed to read clipboard contents: '+err;	})
	;
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

	ImportDaten.PGN 					= [];
	ImportDaten.ZugNummer				= 1;
	ImportDaten.ZugLevel				= 0,
	ImportDaten.ZugFarbe				= "";
	ImportDaten.PreFEN					= "";
	ImportDaten.FEN						= "";
	ImportDaten.PGN_Index				= 0;
	ImportDaten.Zug_Index				= '';
	ImportDaten.PreNodeId				= "";
	ImportDaten.CurNodeId				= "";
	ImportDaten.CurMoveId				= "";
	ImportDaten.VariantenStack		= [];

	Zugliste = [];

    // NotationstabelleAufgabe initiieren
	$('#TreeNotationslisteImport').empty()
								  .append('<ul></ul>')
								  .jstree({'core' : { 
									       'check_callback': 	true,
										   'open_parents':      true,
										   'load_open':         true,
								   		   'themes': 			{ 'icons': false }
	}});
    $('#TreeNotationslisteImport').jstree().create_node('#', {
		 "id": 		"N_0",
		 "text": 	"o"
	  }, "last", function() { /*alert("startnode created"); */
	});

	ImportDaten.CurNodeId	=  NodePräfix + '0';
	ImportDaten.PreNodeId	=  NodePräfix + '0';

	T_Zuege.CurMoveId 		= MovePräfix + '0';
	T_Zuege.PreMoveId 		= MovePräfix + '0';
	T_Zuege.CurMoveIndex	= 0,

	addNotationlineFlag		= true;

	scanMetaData(GlobalImportedPGN[GlobalImportedPGNIndex]);		
	
	StellungAufbauen("Brett_ImportAufgabe", T_Aufgabe.FEN, 'zugmarkerimport');
	
	prepareMoveValidation(GlobalImportedPGN[GlobalImportedPGNIndex]);
	
	GlobalActionContext 	= AC_GAMEIMPORT;

	ImportDaten.VariantenStack.push( { FEN: ImportDaten.FEN, PreFEN: ImportDaten.PreFEN, PreNode: ImportDaten.PreNodeId } );

	validateSingleMove();
}

// Aus den Importdaten werden die die Aufgabe beschreibenden Daten extrahiert und in die Oberfläche übertragen
function scanMetaData(Importtext) {

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
	ImportDaten.ZugFarbe	= T_Aufgabe.AmZug;
	ImportDaten.PreFEN 		= T_Aufgabe.FEN;
	ImportDaten.FEN 		= T_Aufgabe.FEN;
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

		var PunkteKorigiert 		= OhneZeilenschaltungen.replace(r_Punkte, "$1" + ". ... ");

		var KlammernAufKorrigiert 	= PunkteKorigiert.replace(r_KlammernAuf, "$1" + " ");
		var KlammernZuKorrigiert 	= KlammernAufKorrigiert.replace(r_KlammernZu, " " + "$1");

		var ZugnummerKorrigiert 	= KlammernZuKorrigiert.replace(r_Zugnummern, "$1" + " " + "$2");

		// Alle Einzelteile in eigene Arrayelemente. Die werden in das globale Objekt eingetragen
		ImportDaten.PGN		= ZugnummerKorrigiert.match(/[^ ]+/g);
		ImportDaten.PGN_Index		= 0; 
	}

}

// Mit der in ImportDaten aktuellen Situation startend, wird der nächste echte Zug gesucht.
// Eventuell wird ImportDaten aktualisiert (Zugnummer, Varianten, ...)
// Bei kurzer Notation wird für den gefundenen Zug das Startfeld ermittelt
// Alle Daten über den Zug werden in einem globalen Objekt (entsprechend der Datenbanktabelle) gespeichert
function validateSingleMove() {

	T_Zuege.AufgabeID		= 0;
	T_Zuege.FEN				= '';
	T_Zuege.ZugNummer		= 1;
	T_Zuege.ZugLevel		= 0;
	T_Zuege.ZugFarbe		= '';
	T_Zuege.ZugOriginal		= '';
	T_Zuege.ZugFigur		= '';
	T_Zuege.ZugVon			= '';
	T_Zuege.ZugNach			= '';
	T_Zuege.ZugKurz			= '';
	T_Zuege.ZugLang			= '';
	T_Zuege.ZugStockfish	= '';
	T_Zuege.ZugAktion		= '';
	T_Zuege.ZugUmwandlung	= '';
	T_Zuege.ZugZeichen		= '';
	T_Zuege.Hinweistext		= '';
	T_Zuege.Hinweispfeil	= '';
	
	GlobalActionStep = AS_IDENTIFYUNIQUEMOVE;

	// In dieser Schleife wird nach Zügen, Zugnummern und Klammern (=Varianten) differenziert
	// Die Schleife endet, wenn EIN echter Zug gefunden wurde oder wenn alle Daten betrachtet wurden
	// Die Zeiger auf die aktuelle Stelle in den Daten sind global
	// Der Anstoß für die nächste Iteration kommt aus dem Messagelistener
	do {

		var m_BauerKurzeNotation	= r_BauerKurzeNotation.exec(ImportDaten.PGN[ImportDaten.PGN_Index]);
		var m_FigurKurzeNotation	= r_FigurKurzeNotation.exec(ImportDaten.PGN[ImportDaten.PGN_Index]);
		var m_Rochaden				= r_Rochaden.exec(ImportDaten.PGN[ImportDaten.PGN_Index]);
		var m_Zugnummer				= r_Zugnummer.exec(ImportDaten.PGN[ImportDaten.PGN_Index]);

		if(m_BauerKurzeNotation != null || m_FigurKurzeNotation != null || m_Rochaden != null) {				

			// Das gilt immer, egal was für ein Zug
			T_Zuege.PreMoveId 		= T_Zuege.CurMoveId;
			T_Zuege.CurMoveId 		= MovePräfix + ImportDaten.PGN_Index;
			T_Zuege.CurMoveIndex	= ImportDaten.PGN_Index;
			T_Zuege.ZugNummer		= ImportDaten.ZugNummer;
			T_Zuege.ZugLevel		= ImportDaten.ZugLevel;
			T_Zuege.ZugFarbe		= ImportDaten.ZugFarbe;
			T_Zuege.FEN				= ImportDaten.FEN;

			if(m_BauerKurzeNotation != null) {

				T_Zuege.ZugOriginal		= m_BauerKurzeNotation[0];
				T_Zuege.ZugKurz			= m_BauerKurzeNotation[0];
				T_Zuege.ZugNach			= m_BauerKurzeNotation.groups.targetfile + m_BauerKurzeNotation.groups.targetrank;
				T_Zuege.ZugAktion 		= m_BauerKurzeNotation.groups.capture.length > 0 ? SCHLÄGT : ZIEHT;
				T_Zuege.ZugUmwandlung	= m_BauerKurzeNotation.groups.umwandlung;
				T_Zuege.ZugZeichen  	= m_BauerKurzeNotation.groups.schachodermatt;									
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
				T_Zuege.Hinweistext 	= getKommentar(1); // Kommentare gehören immer zu Zügen. 

				// Jetzt werden die Rochade exakt bestimmt und die Engine damit befragt
				// Die Auswertung und die Ausfühurng des Zugs geschieht im Messagelistener.
				executeRochade(m_Rochaden);
			}
		
		// wird nur in den ImportDaten protokolliert. Erst, nachdem wieder ein Zug erkannt wird, wird T_Zuege aktualisiert
		} else if (m_Zugnummer != null) {
			
			ImportDaten.ZugNummer = parseInt(ImportDaten.PGN[ImportDaten.PGN_Index]);
		
		// Dann folgt eine Variante.
		// Es muss:
		// - der Level inkrementiert werden
		// - der Übergang im Stack abgelegt werden
		// - die Situation auf dem Brett auf den Vorgängerzug zurückgesetzt werden, da ja der aktuelle Zug durch die Variante ersetzt wird
		// - der Zug vor der Variante als StartMove ausgewählt werden	
	} else if (ImportDaten.PGN[ImportDaten.PGN_Index].indexOf("(") == 0) {
			
				console.log("( an index " + ImportDaten.PGN_Index + " mit " + JSON.stringify(ImportDaten.VariantenStack));

				ImportDaten.ZugLevel++;
				ImportDaten.VariantenStack.push( { FEN: 		ImportDaten.FEN, 
													   PreFEN: 		ImportDaten.PreFEN, 
													   StartNode: 	ImportDaten.PreNodeId,
													   StartMove:	T_Zuege.CurMoveId 
														  } );

				ImportDaten.FEN 		= ImportDaten.PreFEN; // Damit bekommt der nächste Zug = erster in der Variante die FEN, die zum aktuellen Zug geführt hat
				ImportDaten.ZugFarbe 	= ImportDaten.FEN.includes("w") ? WEISSAMZUG : SCHWARZAMZUG; // Der aktuelle Zug bekommt die Farbe des wegen der Variante "zurückgenommenen" Zugs
				ImportDaten.PreNodeId 	= ImportDaten.CurNodeId;

				T_Zuege.CurMoveId 		= T_Zuege.PreMoveId; // Der aktuelle Zug wirkt nicht

				addNotationlineFlag		= true;

				StellungAufbauen("Brett_ImportAufgabe", ImportDaten.FEN, 'zugmarkerimport');

		// Dann ist eine Variante beendet 
		// Es muss:
		// - der Level dekrementiert werden
		// - der Übergang in diese Variante aus dem Stack geholt werden
		// - die Situation auf dem Brett hinter den letzten Zug vor der Variante gesetzt werden.
		} else if (ImportDaten.PGN[ImportDaten.PGN_Index].indexOf(")") == 0) {
			
				console.log(") an index " + ImportDaten.PGN_Index + " mit " + JSON.stringify(ImportDaten.VariantenStack));

				ImportDaten.ZugLevel--;
				ImportVarianten  = [];
				ImportVarianten 	= ImportDaten.VariantenStack.pop();
				ImportDaten.PreFEN 		= ImportVarianten.PreFEN;
				ImportDaten.FEN 		= ImportVarianten.FEN;
				ImportDaten.ZugFarbe 	= ImportDaten.FEN.includes("w") ? WEISSAMZUG : SCHWARZAMZUG;
				ImportDaten.PreNodeId 	= ImportVarianten.StartNode;
				T_Zuege.CurMoveId 		= ImportVarianten.StartMove; // Wird beim Erkennen des nächsten Zugs nach PreMoveid geschoben

				addNotationlineFlag = true;
				
				StellungAufbauen("Brett_ImportAufgabe", ImportDaten.FEN, 'zugmarkerimport');

			// Dann muss es sich um einen Kommentar vor dem ersten Zug handeln. Der wird jetzt einfach mal in die Aufgabe übernommen. Noch verbessern.
		} else if (ImportDaten.PGN[ImportDaten.PGN_Index].indexOf("{") == 0) {
			
			T_Aufgabe.Langtext = getKommentar(0);

		} else if (ImportDaten.PGN[ImportDaten.PGN_Index].indexOf("...") == 0) {
			// Wird das so gebraucht?
			//ImportDaten.ZugFarbe 	= ImportDaten.ZugFarbe == WEISSAMZUG ? SCHWARZAMZUG : WEISSAMZUG;
		} else {
			//alert();
		}
		ImportDaten.PGN_Index++;

	} while (m_BauerKurzeNotation == null && m_FigurKurzeNotation == null && m_Rochaden == null && ImportDaten.PGN_Index < ImportDaten.PGN.length);
}

// Aus den Zugdaten und den Figuren auf dem Brett wird bestimmt, welche Figur gezogen ist.
// In der kurzen Notation werden ja nur die Zielfelder genannt. Stockfish braucht Züge aber zwingend in der Form filerankfilerank
// Es werden ALLE Figuren/Bauern der Farbe auf dem Brett gesucht und Stockfish zur Prüfung übergeben.
// Das Ergebnis sollte immer eineutig sein.
// Figuren sind in html mit diesem Muster enthalten: <span id="X_'+file+rank+'"></span> wobei X den Buchstaben der FEN entspricht
function executeMove(Zugdaten) { // Zugdaten ist der match des regulären Ausdrucks

	var KandidatenID;
	var Kandidaten;
	var  i = 0;

	if(Zugdaten.groups.figur == null) {
		// Bauernzug. Entscheidung weiss oder schwarz nur über die aktuelle ZugFarbe möglich
		KandidatenID = T_Zuege.FEN.includes("w") ? 'P_' + Zugdaten.groups.mitfile : 'p_' + Zugdaten.groups.mitfile;
		Kandidaten = $('[id^=' + KandidatenID + ']'); // Kandidaten sind ALLE Bauern der aktuellen Farbe
	} else {
		// Figurenzug. Der Name wird in der kurzen Notation immer gross geschrieben. Die Namen in den ID entsprecchen FEN, also gross/klein für weiss/schwarz
		KandidatenID = T_Zuege.FEN.includes("w") ? (Zugdaten.groups.figur).toUpperCase()  + "_" + Zugdaten.groups.mitfile : (Zugdaten.groups.figur + "_" + Zugdaten.groups.mitfile).toLowerCase();
		//  + Zugdaten.groups.mitfile + Zugdaten.groups.mitrank
		Kandidaten = $('[id^=' + KandidatenID + ']');
		if(Zugdaten.groups.mitrank != "") Kandidaten = $('[id^=' + KandidatenID + ']').add('[id$=' + Zugdaten.groups.mitrank + ']'); // wegen Eindeutgkeit
		//Kandidaten = $('[id^=' + KandidatenID + ']').add('[id$=' + Zugdaten.groups.mitrank + ']');
	}

	Kandidaten.each(function( i, K ) {
		$("#TriggerTag").trigger("SetFenPosition", [ T_Zuege.FEN ] );

		var EchteUmwandlung = (/[abcdefgh][27]/g).exec(K.id) != null ? Zugdaten.groups.umwandlung : "";
		$("#TriggerTag").trigger("isMoveCorrect", [ K.id.match('[abcdefgh][12345678]') + T_Zuege.ZugOriginal.match('[abcdefgh][12345678]') + EchteUmwandlung ] );
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
	if(ImportDaten.PGN_Index < ImportDaten.PGN.length && ImportDaten.PGN[ImportDaten.PGN_Index + Versatz].indexOf('{') == 0) {
		var fertig = false;
		do {
			Kommentar += ImportDaten.PGN[ImportDaten.PGN_Index + 1] // also ohne {
			ImportDaten.PGN_Index++;
			if(ImportDaten.PGN[ImportDaten.PGN_Index].indexOf('}') == 0) fertig = true; 
		} while (!fertig)
		//T_Zuege.Hinweistext = Kommentar;
	}
	return Kommentar;
}

