//const NEWLINE_REPRESENTATIONS	 = "(\n)|(\r\n)|(\n\r)";

const FEN_PARTIEANFANG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

// Diese Spielmöglichkeiten kennt das Programm:
const SPIELINTERAKTION_STELLUNGOHNE	= "StellungOhne";
const SPIELINTERAKTION_STELLUNGMIT	= "StellungMit";
const SPIELINTERAKTION_AUFGABEOHNE	= "AufgabeOhne";
const SPIELINTERAKTION_AUFGABEMIT		= "AufgabeMit";

// Diese ActionContext gibt es:
const AC_CHALLENGEIMPORT						= "ChallengeImport";
const AC_POSITION_PLAY							= "PositionPlay";
const AC_POSITION_RATING						= "PositionRating";
const AC_CHALLENGE_VARIANTENDIREKT	= "ChallengeVariantendirekt";
const AC_CHALLENGE_VARIANTENDANACH	= "ChallengeVariantendanach";
const AC_ENGINEDIALOG								= "EngineDialog";

// ActionSteps für AC_CHALLENGEIMPORT
const AS_IDENTIFYUNIQUEMOVE			= "IdentifyUniqueMove";
const AS_INTERPRETELOCATEDMOVE	= "InterpretLocatedMove";
const AS_EXECUTEUNIQUEMOVE			= "ExecuteUniqueMove";

// ActionSteps für AC_POSITION_PLAY
const AS_CHECKPOSITIONPLAYERMOVE					= "CheckPositionPlayerMove";
const AS_CHECKPOSITIONPLAYERMOVEFINISHED	= "CheckPositionPlayerMoveFinished";
const AS_GETPOSITIONFEN										= "GetPositionFEN";
const AS_DRAWPOSITIONENGINEMOVE						= "DrawPositionEngineMove";
const AS_FINISHPOSITIONENGINEMOVE					= "FinishPositionEngineMove";

// ActionSteps für AC_POSITION_RATING
const AS_PREPARERATINGPLAYERMOVE					= "PrepareRatingPlayerMove";
const AS_PREPARERATINGPLAYERMOVEFINISHED	= "PrepareRatingPlayerMoveFinished";
const AS_SIMULATERATINGPLAYERMOVE					= "SimulateRatingPlayerMove";
const AS_FINISHRATINGPLAYERMOVE						= "FinishRatingPlayerMove";
const AS_DRAWRATINGENGINEMOVE							= "DrawRatingEngineMove";
const AS_FINISHRATINGENGINEMOVE						= "FinishRatingEngineMove";

// ActionSteps für AC_CHALLENGE_VARIANTENDIREKT
const AS_VERIFYMOVE					= "VerifyMove";
const AS_VERIFYMOVEFINISHED	= "VerifyMoveFinished";
const AS_DRAWVARIANTENMOVE	= "DrawVariantenMove";

// Allgemeiner ActionStep
const AS_MOVECYCLEABORTED = "movecycleaborted";

const MOVESTATE_READY		= "R"; 
const MOVESTATE_MOVED		= "M";
const MOVESTATE_STACKED	= "S";
const MOVESTATE_VISIBLE	= "V";
const MOVESTATE_HIDDEN	= "H";
const MOVESTATE_IGNORED	= "I";

const MOVEMODE_DEFAULT							= 'default';
const MOVEMODE_MOVE									= 'move';
const MOVEMODE_VARIANTE_MAINHIDDEN	= 'VarianteSignMainHidden';
const MOVEMODE_VARIANTE_MAINVISIBLE	= 'VarianteSignMainvisible';
const MOVEMODE_MATTSIGN							= 'MattSign';

const MOVERESULT_ERROR						= 'Situations- oder Datenfehler';
const MOVERESULT_UNKNOWNMOVE			= 'UnknownMove';
const MOVERESULT_NODESCENDENTS		= 'NoDescendents'; // ==> Aufgabeende oder Variantenende
const MOVERESULT_NOPOSSIBLEMOVES	= 'NoPossibleMoves'; // ==> das ist der "normale" Zustand
const MOVERESULT_MAINMOVEMIT			= 'MainMoveMit';
const MOVERESULT_MAINMOVEOHNE			= 'MainMoveOhne';
const MOVERESULT_VARIANTEMOVE			= 'VarianteMove';

const AIDMODE_INIT 		= 'init';
const AIDMODE_FIRST 	= 'first';
const AIDMODE_SECOND 	= 'second';

const LOGLEVEL_SLIGHT			= '0';
const LOGLEVEL_NICE				= '10';
const LOGLEVEL_IMPORTANT	= '100';

const LOGTHEME_NOTHING		= '';
const LOGTHEME_DATA				= 'data';
const LOGTHEME_SITUATION	= 'situation';

const PLAYER		= "spieler";
const CHALLENGE	= "challenge";

const WEISSAMZUG		= "weiß";
const SCHWARZAMZUG	= "schwarz";

const ZIEHTKURZ	= "";
const ZIEHTLANG	= "-";
const SCHLÄGT		= "x";
const MATT			= "#";

const DEFAULTMOVE_W = "...";
const DEFAULTMOVE_B = "&nbsp;";
const NODEPRÄFIX		= "N_";
const MOVEPRÄFIX		= "M_";
const TOOLTIPPRÄFIX	= "TT_";
const THEMAPRÄFIX		= "TH_";
const WHITEPOSTFIX	= "_w";
const BLACKPOSTFIX	= "_b";

const VARIANTEZEIGER 		= "&#9759;&nbsp;";
const ZUGMARKERWEISS 		= "&#11036;";
const ZUGMARKERSCHWARZ 	= "&#11035;";

const SPIELERZUG_VARIANTE	= 'Variante';
const SPIELERZUG_HAUPTZUG	= 'Hauptzug';
const SPIELERZUG_NOTFOUND	= 'Zug nicht gefunden';

const HTMLBRETTNAME_SPIELEN = 'BrettSpielen';
const HTMLBRETTNAME_IMPORT  = 'BrettImport';

const PHPTRUE = 1;
const PHPFALSE = 0;

// Eventangaben im pgn. Lichess-Standard berücksichtigt
//const r_Event = new RegExp("(\[Event \")(?<event1>.*)(: ?)(?<event2>.*)?([\"])", "mg");
const r_Event = new RegExp("(\\[Event \")(?<studie>.*)(: ?)(?<kapitel>.*)?([\"])|(\\[Event \")(?<event>.*)([\"])", "m");

const r_Annotator = new RegExp("(\\[Annotator \")(?<annotatortext>.*)(\")", "m");

// Alle durch Blanks getrennte Zeichenketten erkennen
const MATCH_MOVES = "(\n\n[\\s\\S]*)|(\r\n\r\n[\\s\\S]*)|(\n\r\n\r[\\s\\S]*)";
const r_Match_Moves = new RegExp(MATCH_MOVES, "mg");

// Bei einer mit schwarz beginnenden Variante werden die drei Punkte für weiss eventuell direkt angehängt. Werden so erkannt
const r_Punkte = new RegExp("(\\d{1,2})(\\.{3})", "g");

// Hinter öffnende und vor schließende Klammern ein Blank einfügen damit die Klammern sicher ein eigenes Splitelement werden.
const r_KlammernAuf	= new RegExp("([\\[\\{\\(])", "g");
const r_KlammernZu	= new RegExp("([\\]\\}\\)])", "g");
// Aufeindanderfolgende Klammern zusätzlich trennen
const r_KlammernZuAuf = new RegExp("([\\)])([\\(])", "g");

// Je nach Exporteinstellungen kann es sein, dass die weißen Züge direkt hinter den Zugnummern stehen, Trennen.
const r_Zugnummern = new RegExp("(\\d{1,2}\\.{1})([abcdefgh]{1}|[KDTSL]{1})|(\\d{1,2}\\.{1})(0{1})", "g");

// Alle unterschiedlichen Darstellungen für Züge
const r_BauerKurzeNotation = new RegExp("^(?<mitfile>[abcdefgh]{0,1})" +
		"(?<capture>[x]{0,1})" +
		"(?<targetfile>[abcdefgh]{1})" +
		"(?<targetrank>[12345678]{1})" +
		"(?<umwandlung0>[=]{0,1})" +
		"(?<umwandlung>[DTSLQRNBdtslqrnb]{0,1})" +
		"(?<schachodermatt>[+#]{0,1})" +
		"(?<nagmove>[!?]{0,2})");

const r_FigurKurzeNotation = new RegExp("^(?<figur>[KDTSLQRNB]{1})" +
		"(?<mitfile>[abcdefgh]{0,1})" +
		"(?<mitrank>[12345678]{0,1})" +
		"(?<capture>[x]{0,1})" +
		"(?<targetfile>[abcdefgh]{1})" +
		"(?<targetrank>[12345678]{1})" +
		"(?<umwandlung0>[=]{0,1})" +
		"(?<umwandlung>[DTSLQRNBdtslqrnb]{0,1})" +
		"(?<schachodermatt>[+#]{0,1})" +
		"(?<nagmove>[!?]{0,2})");

// Die Darstellungen der Rochaden
const r_Rochaden = new RegExp("^(?<rochade>(O-O-O)|^(O-O))(?<nagmove>[!?]{0,2})");

// Zugnummern
const r_Zugnummer = new RegExp("^\\d{1,2}\\.{1}$");

const r_bestmove = new RegExp("bestmove (?<movevon>[abcdefgh]{1}[12345678]{1})(?<movenach>[abcdefgh]{1}[12345678]{1})(?<umwandlung>[QqRrBbNn]{0,1})");

const MiniBoardArray = [
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"<div class='f_tooltip_s'></div>",
	"<div class='f_tooltip_w'></div>",
	"</div>"
];