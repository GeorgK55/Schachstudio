
// Alle für die Analyse der importierten aktuellen Daten notwendigen Merkposten
class CImportdaten {
	constructor() {
		this.PGN 							=	[]; // Alle Teile der Datei; an Leerzeichen aufgeteilt
		this.PGN_Index 				=	0;	// integer; der Zähler in der do while
		this.ZugNummer				=	0;	// aus dem PGN-String
		this.ZugLevel					=	0;
		this.ZugFarbe					=	"";
		this.CreateNewNode		=	true;
		this.PreNodeId				=	NODEPRÄFIX + '0';	// der Vorgängerknotenname im html-Tree; kann parent oder sibling sein
		this.CurNodeId				=	NODEPRÄFIX + '0';	// der aktuelle Knotenname im html-Tree
		this.PreMoveId				=	MOVEPRÄFIX + '0'; // Id des Vorgängerzugs; kann gleiche Ebene oder kleinere Ebene sein
		this.CurMoveId				=	MOVEPRÄFIX + '0'; // MOVEPRÄFIX + PGN_Index; sind also nicht aufsteigend komplett
		this.PreFEN						=	"";	// Die FEN, die zu diesem Zug geführt hat
		this.FEN							=	"";	// Die FEN nachdem dieser Zug ausgeführt wurde
		this.Text_w						=	DEFAULTMOVE_W;
		this.Text_b						=	DEFAULTMOVE_B;
		this.VarianteCounter	=	0;
		this.VarianteColor		= [0, 0, 0, 0, 0, 0, 0, 0]
		this.ZugStack					=	[];
	}
};

// Alle für das Nachspielen von Varianten notwendigen Merkposten
class CStellungsdaten  {
	constructor() {
		this.ZugLevel					=	0;
		this.ZugFarbe					=	"";
		this.CreateNewNode		=	true;
		this.CurNodeId				=	NODEPRÄFIX + '0';
		this.PreNodeId				=	NODEPRÄFIX + '0';
		this.CurMoveId				=	MOVEPRÄFIX + '0';
		this.PreMoveId				=	MOVEPRÄFIX + '0';
		this.FEN							=	"";	// Die FEN nachdem ein Zug ausgeführt wurde
		this.Text_w						=	DEFAULTMOVE_W;
		this.Text_b						=	DEFAULTMOVE_B;
		this.VarianteCounter	=	0; // wird nur hochgezählt und für die Entscheidung Variantenfarbe genutzt
		this.VarianteColor		= [0, 0, 0, 0, 0, 0, 0, 0]
		this.ZugStack					=	[];
		this.VarianteStack		=	[];
	}
};

ZugStack = {
	PreFEN:			"",
	FEN:				"",
	Farbe:			"",
	PreNode:		"",
	CurNode:		"",
	PreMove:		"",
	CurMove:		"",
	MoveLevel:	0,
	ChildMove:	"",
	ZeigeZug:		true
};

VarianteStack = {
	Counter:		0,
	Trigger:		'',
	CurMove:		'',
	PreMove:		'',
	CurNode:		'',
	PreNode:		'',
	MainMove:		'',
	MoveLevel:	0
}

// Die Aufgabe selbst. Entspricht der Datenbanktabelle T_Aufgabe
class CAufgabe  {
	constructor() {
		this.Kurztext 						=	"";
		this.Langtext 						=	"";
		this.Quelle								=	"";
		this.Quelledetail					=	"";
		this.ImportQuelle					=	"";
		this.Annotator						=	"";
		this.WeissName						=	"";
		this.SchwarzName					=	"";
		this.Ab										=	"";
		this.Datum								=	"";
		this.AmZug								=	"";
		this.FEN									=	"";
		this.Scope								=	"";
		this.Skill 		 						=	"";
		this.lichess_studie_id		=	"";
		this.lichess_kapitel_id		=	"";
		this.lichess_studie_name	=	"";
		this.lichess_kapitel_name	=	"";
		this.PGN									=	"";
	}	
};

// Beim Import wird für jeden Zug eine neue Instnz angelegt und die Instanzen in die ZUgliste eingefügt
// Entspricht der Datenbanktabelle T_Zuege
class CZuege {
	constructor() {
		this.AufgabeID			= 0;	// Wird erst vor dem Speichern per ajax ergänzt
		this.CurMoveIndex		= 0;
		this.CurMoveId			= MOVEPRÄFIX + '0';
		this.PreMoveId			= MOVEPRÄFIX + '0';
		this.ZugNummer			= 0;	
		this.ZugLevel				= 0;
		this.ZugFarbe				= '';	
		this.ZugOriginal		= '';	// Der Zug direkt aus der Notation
		this.ZugFigur				= '';	// '' für Bauern und sonst den Figurbuchstaben aus der Notation
		this.ZugVon					= '';	// Reihe (rank) und Spalte (file) des Ausgangsfeldes eines Zugs
		this.ZugNach				= '';	// Reihe (rank) und Spalte (file) des Zielfeldes eines Zugs
		this.ZugKurz				= '';	// Der Zug in echter kurzer Notation
		this.ZugLang				= '';	// Der Zug in echter langer Notation
		this.ZugStockfish		= '';	// Der Zug in stockfish-Syntax als filerankfilerank und ohne Figurkennung
		this.ZugAktion			= '';	// Zieht (-) oder schlägt (x)
		this.ZugZeichen			= '';	// Schach (+) oder matt (#)
		this.ZugUmwandlung	= '';	// Der Buchstabe der neuen Figur in FEN-Terminologie
		this.FEN						= '';	
		this.NAGMove				= '';	// Die Sonderzeichen; die direkt an den Zug angehängt wrden
		this.NAGSingle			= '';	// Die Dollarwerte; die eigenstaändig hinter dem Zug stehen
		this.NAGNotation		= '';	// Die in der Notation angezeigten Zeichen
		this.Hinweistext		= '';	// Beliebiger Text
		this.Hinweispfeil		= '';	// Pfeilkodierung gemäß scid
		this.MoveState			= '';
		this.MoveNode				= '';
	}
};

Zugliste = []; // Die gesammelten Züge (T_Zuege), die dann per json im ajax-call verschickt werden.

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
FIGURNOTATION 	= { K :"K", Q :"D", D :"D", R :"T", T :"T", B :"L", L :"L", N :"S", S :"S", P :"", k :"K", q :"D", r :"T", b :"L", n :"S", p :"", '' :''}; // deutsch und englisch
ZUGNOTATION 		= { K :"K", Q :"D", D :"D", R :"T", T :"T", B :"L", L :"L", N :"S", S :"S", P :"", k :"K", q :"D", r :"T", b :"L", n :"S", p :"", '' :'',
					a :"a", b :"b", c :"c", d :"d", e :"e", f :"f", g :"g", h :"h",
					1 :"1", 2 :"2", 3 :"3", 4 :"4", 5 :"5", 6 :"6", 7 :"7", 8 :"8",
					"x": "x", "=" :"=", "+": "+", "#": "#", "?": "?", "!": "!"
					};

PlayerScores = [];
EngineScores = [];

wdlDifference							= 100; 	// wird in Promille gerechnet
CentiPawnsMoveDifference	= 60;
Suchtiefe									= 10;
MultiPV										= 1;

// Werden während der gesamten Laufzet für selekt in der Aufgabenliste benötigt
GlobalImportedPGN				= [];
GlobalImportedPGNIndex	= 0;

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

class CMoveContext {
	constructor() {
		this.result						= "",	// Texte mit der Bewertung der Situation. Beginnen mit MOVERESULT_
		this.mainmovestatus		= "",	// MoveState des Hauptzugs
		this.varmovescounter	= -1,	// Anzahl der gefundenen Variantenzüge
		this.drawnmoveindex		= -1,	// Index des gezogenen Zugs im Array variantenmoves
		this.mainmove					= "",	// Der identifizierte Hauptzug selbst, nicht die Id und wegen length ohne [0]
		this.drawnmove				= "",	// Der gezogene Zug selbst, nicht die Id und wegen length ohne [0]
		this.selectedmove			= "",	// Der gezogene Zug selbst, nicht die Id und wegen length ohne [0]
		this.variantenmoves		= [];	// Alle Variantenzüge selbst, einschl gezogener Zug ohne Hauptzug
	}
}

class CAnimationCorner {
	constructor() {
		this.duration			= 0,
		this.startfile		= 0,
		this.startrank		= 0,
		this.stopfile			= 0,
		this.stoprank			= 0,
		this.fieldsize		= 0,
		this.fieldcenter	= 0
	}
}