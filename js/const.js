
//const NEWLINE_REPRESENTATIONS   = "(\n)|(\r\n)|(\n\r)";

const FEN_PARTIEANFANG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

// Diese ActionContext gibt es:
const AC_GAMEIMPORT				= "GameImport";
const AC_CHALLENGE_PLAY			= "SolveChallengePlay";
const AC_CHALLENGE_RATING		= "SolveChallengeRating";
const AC_CHALLENGE_VARIATIONS	= "SolveChallengeVariations";
const AC_ENGINEDIALOG			= "EngineDialog";

const AS_EXPECTPOSSIBLEMOVES 	= "ExpectPossibleMoves";
const AS_EXPECTMOVEFINISHED		= "ExpectMoveFinished";
const AS_FINISHPOSSIBLEMOVES	= "FinishPossibleMoves";

const AS_CHECKCHALLENGEMOVE				= "CheckMove";
const AS_CHECKCHALLENGEMOVEFINISHED		= "CheckMoveFinished";
const AS_GETCHALLENGEFEN				= "GetFEN";
const AS_DRAWCHALLENGEENGINEMOVE		= "GetEngineMove";
const AS_FINISHCHALLENGEENGINEMOVE		= "FinishEngineMove";

const AS_PREPAREMOVE			= "PrepareMove";
const AS_PREPAREMOVEFINISHED	= "PrepareMoveFinished";
const AS_SIMULATEPLAYERMOVE		= "SimulatePlayerMove";
const AS_FINISHPLAYERMOVE		= "FinishPlayerMove";
const AS_DRAWRATINGENGINEMOVE	= "DrawRatingEngineMove";
const AS_FINISHRATINGENGINEMOVE	= "FINISHRatingEngineMove";

const WEISSAMZUG		= "weiß";
const SCHWARZAMZUG		= "schwarz";
const ZIEHT				= "-";
const SCHLÄGT			= "x";
const MATT				= "#";

const ALLEAUFGABENANZEIGEN 	= -1;
const THEMA0AUFGABENANZEIGEN = 0;

const MATCH_MOVES       = "(\n\n[\\s\\S]*)|(\r\n\r\n[\\s\\S]*)|(\n\r\n\r[\\s\\S]*)";
const r_Match_Moves     = new RegExp(MATCH_MOVES, "mg");

// Bei einer mit schwarz beginnenden Variante werden die drei Punkte für weiss eventuell direkt angehängt. Werden hier getrennt
const r_Punkte 				= new RegExp("(\\d{1,2})(\\.{3})", "g");

// Hinter öffnende und vor schließende Klammern ein Blank einfügen damit die Klammern sicher ein eigenes Splitelement werden.
const r_KlammernAuf 			= new RegExp("([\\[\\{\\(])", "g");
const r_KlammernZu  			= new RegExp("([\\]\\}\\)])", "g");

// Je nach Exporteinstellungen kann es sein, dass die weißen Züge direkt hinter den Zugnummern stehen, Trennen.
const r_Zugnummern 			= new RegExp("(\\d{1,2}\\.{1})([abcdefgh]{1}|[KDTSL]{1})|(\\d{1,2}\\.{1})(0{1})", "g");

// Alle unterschiedlichen Darstellungen für Züge
const r_BauerKurzeNotation =   new RegExp("^(?<mitfile>[abcdefgh]{0,1})"						+
												"(?<capture>[x]{0,1})"						+
												"(?<targetfile>[abcdefgh]{1})"				+
												"(?<targetrank>[12345678]{1})"				+
												"(?<umwandlung0>[=]{0,1})"					+
												"(?<umwandlung>[DTSLQRNBdtslqrnb]{0,1})"	+
												"(?<schachodermatt>[+#]{0,1})");

const r_FigurKurzeNotation =	 new RegExp("^(?<figur>[KDTSLQRNB]{1})"						+ 
												"(?<mitfile>[abcdefgh]{0,1})"				+
												"(?<mitrank>[12345678]{0,1})"				+ 
												"(?<capture>[x]{0,1})"						+ 
												"(?<targetfile>[abcdefgh]{1})"				+
												"(?<targetrank>[12345678]{1})"				+
												"(?<umwandlung0>[=]{0,1})"					+
												"(?<umwandlung>[DTSLQRNBdtslqrnb]{0,1})"	+
												"(?<schachodermatt>[+#]{0,1})");

//const r_Ei0 = new RegExp("^(?<depth> depth \\d)|^(?<seldepth>seldepth \\d)", "g");
//const r_Engineinfo = new RegExp("^(?<depth> depth \\d)" + 
//								"|^(?<seldepth>seldepth \\d)" + 
//								"|^(?<score>score cp \\d)", "g");
												
// Die Darstellungen der Rochaden
const r_Rochaden = new RegExp("^(O-O-O)|(O-O)");

// Zugnummern
const r_Zugnummer = new RegExp("^\\d{1,2}\\.{1}$");

const r_bestmove = new RegExp("bestmove (?<movevon>[abcdefgh]{1}[12345678]{1})(?<movenach>[abcdefgh]{1}[12345678]{1})(?<umwandlung>[QqRrBbNn]{0,1})");
