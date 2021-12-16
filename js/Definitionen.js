
// Alle für die Analyse der importierten aktuellen Daten notwendigen Merkposten
ImportDaten = {
	PGN: 					[],
	ZugNummer:				1,	// aus dem PGN-String
	ZugLevel:				0,
	ZugFarbe:				"",
	PreFEN:					"",	// Die FEN, die zu diesem Zug geführt hat
	FEN:					"",	// Die FEN, mit der dieser Zug ausgeführt wird
	PGN_Index: 				0,  // integer, der Zähler in der do while
	Zug_Index:				0,  // integer, wegen des asynchronen Verhaltens getDataFunctions und messagelistener
	PreNodeId:				"",	// der letzte Knotenname im html-Tree 
	CurNodeId:				"",	// der aktuelle Knotenname im html-Tree 
	CurMoveId:				"", // mit stringpräfix, wird im listener eingetragen
	VariantenStack:			[]	// Inhalt siehe ImportVarianten
};

// Alle für das Nachspielen von Varianten notwendigen Merkposten
SituationsDaten = {
	CurNodeId:			"",
	PreNodeId:			"N_0",
	CurMoveId:			"M_0",
	ZugNummer:			"",
	Text_w:				DefaultMove_w,
	Text_b:				DefaultMove_b,
	SituationsStack:	[]
};

ImportVarianten = {
	PreFEN: 	"",
	FEN: 		"",
	StartNode:	"",
	StartMove:	""
};
// Die Aufgabe selbst. Entspricht der Datenbanktabelle T_Aufgabe
T_Aufgabe = {
	Kurztext: 			"",
	Langtext: 			"",
	Quelle:				"",	
	Quelledetail:		"",
	ImportQuelle:		"",
	AmZug:				"",
	FEN:				"",
	Scope:				"",
	Skill: 		 		"",
	lichess_studie:		"",
	lichess_kapitel:	"",
	PGN:				""
};

Zugliste = []; // Die gesammelten Züge (T_Zuege), die dann per json im ajax-call verschickt werden.

// Die während der Analyse eines Zuges in getDataFunctions und im sf_messagelistener_georg erkannten Werte.
// Das Objekt wird nach vollständigem Erkennen kopiert und das kopierte Objekt dann in der Zugliste angehängt
// Entspricht der Datenbanktabelle T_Zuege
T_Zuege = {
	AufgabeID:					0,	// Wird erst vor dem Speichern per ajax ergänzt
	FEN:						'',	// Wird für jeden neuen Zug von ImportDaten geholt 
	CurMoveIndex:				0,
	CurMoveId:					"",
	PreMoveId:					"",
	ZugNummer:					1,	// Wird für jeden neuen Zug von ImportDaten geholt 
	ZugLevel:					0,	// Wird für jeden neuen Zug von ImportDaten geholt 
	ZugFarbe:					'',	// Wird für jeden neuen Zug von ImportDaten geholt 
	ZugOriginal:				'',	// Der Zug direkt aus der Notation
	ZugFigur:					'',	// '' für Bauern und sonst den Figurbuchstaben aus der Notation
	ZugVon: /*Listener*/		'',	// Reihe (rank) und Spalte (file) des Ausgangsfeldes eines Zugs
	ZugNach:					'',	// Reihe (rank) und Spalte (file) des Zielfeldes eines Zugs
	ZugKurz:					'',	// Der Zug in echter kurzer Notation
	ZugLang:					'',	// Der Zug in echter langer Notation
	ZugStockfish: /*Listener*/	'',	// Der Zug in stockfish-Syntax als filerankfilerank und ohne Figurkennung
	ZugAktion:					'',	// Zieht (-) oder schlägt (x)
	ZugUmwandlung:				'',	// Der Buchstabe der neuen Figur in FEN-Terminologie
	ZugZeichen:					'',	// Schach (+) oder matt (#)
	Hinweistext:				'',	// Beliebiger Text
	Hinweispfeil:				'',	// Pfeilkodierung gemäß scid
};

FIGUREN = {
	K: "&#9812;",
	Q: "&#9813;",
	R: "&#9814;",
	B: "&#9815;",
	N: "&#9816;",
	P: "&#9817;",
	k: "&#9818;",
	q: "&#9819;",
	r: "&#9820;",
	b: "&#9821;",
	n: "&#9822;",
	p: "&#9823;",
};

FIGURNOTATION = { K :"K", Q :"D", R :"T", B :"L", N :"S", P :"", k :"K", q :"D", r :"T", b :"L", n :"S", p :""};
FENFileFactor = {a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8, 1:7, 2:6, 3:5, 4:4, 5:3, 6:2, 7:1, 8:0};

PlayerScores = [];
EngineScores = [];

wdlDifference				= 100; 	// wird in Promille gerechnet
CentiPawnsMoveDifference 	= 60;
Suchtiefe 					= 10;
MultiPV 					= 1;

GlobalImportedPGN 		= [];
GlobalImportedPGNIndex 	= 0;


