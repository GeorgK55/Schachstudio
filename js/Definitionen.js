
// Alle für die Analyse der importierten aktuellen Daten notwendigen Merkposten
Importdaten = {
	PGN: 				[], // Alle Teile der Datei, an Leerzeichen aufgeteilt 
	PGN_Index: 			0,  // integer, der Zähler in der do while
	ZugNummer:			1,	// aus dem PGN-String
	ZugNummerFarbe:		"main",
	ZugLevel:			0,
	ZugFarbe:			"",
	CreateNewNode:		true,
	PreNodeId:			"",	// der Vorgängerknotenname im html-Tree, kann parent oder sibling sein
	CurNodeId:			"",	// der aktuelle Knotenname im html-Tree 
	PreMoveId:			"", // Id des Vorgängerzugs, kann gleiche Ebene oder kleinere Ebene sein
	CurMoveId:			"", // Movepräfix + PGN_Index; sind also nicht aufsteigend komplett
	PreFEN:				"",	// Die FEN, die zu diesem Zug geführt hat
	FEN:				"",	// Die FEN, nachdem dieser Zug ausgeführt wurde
	FEN_w:				"",
	FEN_b:				"",
	Text_w:				DefaultMove_w,
	Text_b:				DefaultMove_b,
	ZugStack:			[]
};
Importdaten.init = function () {
	this.PGN = 				[];
	this.PGN_Index = 		0;  // integer; der Zähler in der do while
	this.ZugNummer =		1;	// aus dem PGN-String
	this.ZugNummerFarbe =	"main",
	this.ZugLevel =			0;
	this.ZugFarbe =			"";
	this.CreateNewNode = 	true;
	this.PreNodeId =		NodePräfix + '0'; // der letzte Knotenname im html-Tree 
	this.CurNodeId =		NodePräfix + '0'; // der aktuelle Knotenname im html-Tree 
	this.PreMoveId =		MovePräfix + '0';
	this.CurMoveId =		MovePräfix + '0';
	this.PreFEN =			"";	// Die FEN; die zu diesem Zug geführt hat
	this.FEN =				"";	// Die FEN; mit der dieser Zug ausgeführt wird
	this.FEN_w =			"";
	this.FEN_b =			"";
	this.Text_w =			DefaultMove_w;
	this.Text_b =			DefaultMove_b;
	this.ZugStack =			[]
}

// Alle für das Nachspielen von Varianten notwendigen Merkposten
Stellungsdaten = {
	ZugNummer:			1,
	ZugNummerFarbe:		"main",
	ZugLevel:			0,
	ZugFarbe:			"",
	CreateNewNode:		true,
	CurNodeId:			NodePräfix + '0',
	PreNodeId:			NodePräfix + '0',
	CurMoveId:			MovePräfix + '0',
	PreMoveId:			MovePräfix + '0',
	PreFEN:				"",	// Die FEN, die zu diesem Zug geführt hat
	FEN:				"",	// Die FEN, nachdem dieser Zug ausgeführt wurde
	FEN_w:				"",
	FEN_b:				"",
	Text_w:				DefaultMove_w,
	Text_b:				DefaultMove_b,
	ZugStack:			[]
};
Stellungsdaten.init = function() {
	this.ZugNummer =		1;
	this.ZugNummerFarbe =	"main",
	this.ZugLevel =			0;
	this.ZugFarbe = 		"";
	this.CreateNewNode = 	true;
	this.CurNodeId =		NodePräfix + '0';
	this.PreNodeId =		NodePräfix + '0';
	this.CurMoveId =		MovePräfix + '0';
	this.PreMoveId =		MovePräfix + '0';
	this.PreFEN =			"";	// Die FEN; die zu diesem Zug geführt hat
	this.FEN =				"";	// Die FEN; mit der dieser Zug ausgeführt wird
	this.FEN_w =			"";
	this.FEN_b =			"";
	this.Text_w =			DefaultMove_w;
	this.Text_b =			DefaultMove_b;
	this.ZugStack =			[]
}
 
ZugStack = {
	PreFEN:		"",
	FEN:		"",
	Farbe:		"",
	PreNode:	"",
	CurNode:	"",
	PreMove:	"",
	CurMove:	"",
	MoveLevel:	0,
	ChildMove:	""
};

VariationsLevelCounter = [ 0, 0, 0, 0, 0, 0, 0, 0]; // Für Hintergrundfarben der Zugnummern

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
T_Aufgabe.init = function () {
	this.Kurztext = 		"";
	this.Langtext = 		"";
	this.Quelle =			"";	
	this.Quelledetail =		"";
	this.ImportQuelle =		"";
	this.AmZug =			"";
	this.FEN =				"";
	this.Scope =			"";
	this.Skill = 		 	"";
	this.lichess_studie =	"";
	this.lichess_kapitel =	"";
	this.PGN =				""
}

Zugliste = []; // Die gesammelten Züge (T_Zuege), die dann per json im ajax-call verschickt werden.

// Die während der Analyse eines Zuges in getDataFunctions und im sf_messagelistener_georg erkannten Werte.
// Das Objekt wird nach vollständigem Erkennen kopiert und das kopierte Objekt dann in der Zugliste angehängt
// Entspricht der Datenbanktabelle T_Zuege
T_Zuege = {
	AufgabeID:					0,	// Wird erst vor dem Speichern per ajax ergänzt
	FEN:						'',	// Wird für jeden neuen Zug von Importdaten geholt 
	CurMoveIndex:				0,
	CurMoveId:					MovePräfix + '0',
	PreMoveId:					MovePräfix + '0',
	ZugNummer:					1,	// Wird für jeden neuen Zug von Importdaten geholt 
	ZugLevel:					0,	// Wird für jeden neuen Zug von Importdaten geholt 
	ZugFarbe:					'',	// Wird für jeden neuen Zug von Importdaten geholt 
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
	NAG:						'',	// Numeric Annotation Glyphs. Siehe Liste im WEB
	Hinweistext:				'',	// Beliebiger Text
	Hinweispfeil:				'',	// Pfeilkodierung gemäß scid
};
T_Zuege.init = function() {
	this.AufgabeID =					0;	// Wird erst vor dem Speichern per ajax ergänzt
	this.FEN =							'';	// Wird für jeden neuen Zug von Importdaten geholt 
	this.CurMoveIndex =					0;
	this.CurMoveId =					MovePräfix + '0';
	this.PreMoveId =					MovePräfix + '0';
	this.ZugNummer =					1;	// Wird für jeden neuen Zug von Importdaten geholt 
	this.ZugLevel =						0;	// Wird für jeden neuen Zug von Importdaten geholt 
	this.ZugFarbe =						'';	// Wird für jeden neuen Zug von Importdaten geholt 
	this.ZugOriginal =					'';	// Der Zug direkt aus der Notation
	this.ZugFigur =						'';	// '' für Bauern und sonst den Figurbuchstaben aus der Notation
	this.ZugVon = /*Listener*/			'';	// Reihe (rank) und Spalte (file) des Ausgangsfeldes eines Zugs
	this.ZugNach =						'';	// Reihe (rank) und Spalte (file) des Zielfeldes eines Zugs
	this.ZugKurz =						'';	// Der Zug in echter kurzer Notation
	this.ZugLang =						'';	// Der Zug in echter langer Notation
	this.ZugStockfish = /*Listener*/	'';	// Der Zug in stockfish-Syntax als filerankfilerank und ohne Figurkennung
	this.ZugAktion =					'';	// Zieht (-) oder schlägt (x)
	this.ZugUmwandlung =				'';	// Der Buchstabe der neuen Figur in FEN-Terminologie
	this.ZugZeichen =					'';	// Schach (+) oder matt (#)
	this.NAG =							'';	// Numeric Annotation Glyphs. Siehe Liste im WEB
	this.Hinweistext =					'';	// Beliebiger Text
	this.Hinweispfeil =					'';	// Pfeilkodierung gemäß scid}
}

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

FENFileFactor 	= {a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8, 1:7, 2:6, 3:5, 4:4, 5:3, 6:2, 7:1, 8:0};
FIGURNOTATION 	= { K :"K", Q :"D", R :"T", B :"L", N :"S", P :"", k :"K", q :"D", r :"T", b :"L", n :"S", p :""};
ZUGNOTATION 	= { K :"K", Q :"D", R :"T", B :"L", N :"S", P :"", k :"K", q :"D", r :"T", b :"L", n :"S", p :"",
					a :"a", b :"b", c :"c", d :"d", e :"e", f :"f", g :"g", h :"h", 
					1 :"1", 2 :"2", 3 :"3", 4 :"4", 5 :"5", 6 :"6", 7 :"7", 8 :"8", 
					"x": "x", "=" :"=", "+": "+", "#": "#"
				  };

PlayerScores = [];
EngineScores = [];

wdlDifference				= 100; 	// wird in Promille gerechnet
CentiPawnsMoveDifference 	= 60;
Suchtiefe 					= 10;
MultiPV 					= 1;

GlobalImportedPGN 		= [];
GlobalImportedPGNIndex 	= 0;

TouchDaten = { 
	id: 		"",
	clientX: 	"",
	clientY: 	"",
	pageX: 		"",
	pageY: 		"",
	screenX: 	"",
	screenY: 	"",
	radiusX: 	"",
	radiusY: 	"",
}
