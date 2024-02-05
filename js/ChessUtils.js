// Der Spieler hat gezogen.
// Zuerst eine eventuelle Umwandlung prüfen, da der Zug ja sonst nicht abgeschlossen ist. 
// In T_Zuege werden hier nur die drei Felder ZugKurz, ZugStockfish und ZugUmwandlung versorgt. 
// Abschließend wird die Kontrolle an den aktiven ActionContext übergeben.
function firePlayerMove() {

	if(logMe(LOGLEVEL_IMPORTANT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName() + ' mit T_Zuege.ZugNach: ', T_Zuege.ZugNach);

	checkPromotion().then(function () {

		// Sondernotation für Rochaden in ZugKurz eintragen
		if (T_Zuege.ZugFigur.toUpperCase() == 'K' && (T_Zuege.ZugVon.substr(0, 1) == 'e' && T_Zuege.ZugNach.substr(0, 1) == 'g')) {
			T_Zuege.ZugKurz = '0-0';
		} else if (T_Zuege.ZugFigur.toUpperCase() == 'K' && (T_Zuege.ZugVon.substr(0, 1) == 'e' && T_Zuege.ZugNach.substr(0, 1) == 'c')) {
			T_Zuege.ZugKurz = '0-0-0';
		} else { // oder den Zug entsprechend der Notation übernehmen
			T_Zuege.ZugKurz = FIGURNOTATION[T_Zuege.ZugFigur] + T_Zuege.ZugNach + FIGURNOTATION[T_Zuege.ZugUmwandlung];
		}

		T_Zuege.ZugStockfish = T_Zuege.ZugVon + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung.toLowerCase();

		switch (GlobalActionContext) {
			case AC_POSITION_PLAY:
				GlobalActionStep = AS_CHECKPOSITIONPLAYERMOVE;
				$("#TriggerTag").trigger("SetFenPosition", [T_Zuege.FEN]);
				$("#TriggerTag").trigger("isMoveCorrect", [T_Zuege.ZugStockfish]);
				break;
			case AC_POSITION_RATING:
				GlobalActionStep = AS_PREPARERATINGPLAYERMOVE;

				PlayerScores = [];
				EngineScores = [];
				Playerwdl = [];
				Enginewdl = [];

				T_Zuege_undo = { ...T_Zuege }; // T_Zuege enthält nur einfache Datentypen

				$("#TriggerTag").trigger("UciNewGame");
				$("#TriggerTag").trigger("SetFenPosition", [T_Zuege.FEN]);
				$("#TriggerTag").trigger("validateMove", [T_Zuege.ZugStockfish]);
				break;
			case AC_CHALLENGE_VARIANTENDIREKT:
				spieleVarianten();
				break;
			case AC_CHALLENGE_VARIANTENDANACH:				
				spieleVarianten(); // Algorithmus identisch, die Daten enthalten keine Varianten
				break;
			default:
				GlobalActionContext = AC_CHALLENGE_VARIANTENDIREKT;
				spieleVarianten();
				break;
		}
	});
}

function reactivateMove_obsolet(moveid) {

	let MoveToReact	= $.grep(ChallengeMoves,	function (MTR, i) { return MTR['CurMoveId']	== moveid; })[0];

	T_Zuege.ZugVon		= MoveToReact.ZugVon;
	T_Zuege.ZugFigur	= MoveToReact.ZugFigur;
	T_Zuege.ZugNach		= MoveToReact.ZugNach;

	TransferZugNachStellung(Stellungsdaten, MoveToReact);
	StellungAufbauen(HTMLBRETTNAME_SPIELEN, MoveToReact.FEN);
	firePlayerMove();

}

// Entweder die Umwandlung vollziehen oder einfach resolve zurückgeben
function checkPromotion() {

	PromotionAnswer = $.Deferred();

	if (T_Zuege.ZugFigur.toUpperCase() == 'P' && (T_Zuege.ZugNach.slice(-1) == '1' || T_Zuege.ZugNach.slice(-1) == '8')) {

		PromotionDialog = $("#dialog_promotion").dialog({
			title: "Auswahl",
			modal: true,
			draggable: false,
			resizable: false,
			position: { my: "left top", at: "left top", of: "#h_Spielen" },
			show: 'blind',
			hide: 'blind',
			height: 500,
			width: 100,
			open: function () {

				if (T_Zuege.ZugFarbe == WEISSAMZUG) {
					$("#dialog_promotion").append('<button id="btn_dame" type="button" onclick="setPromotionPiece(\'Q\');" 	class="PromotionButton">&#9813;</button><br>');
					$("#dialog_promotion").append('<button id="btn_turm" type="button" onclick="setPromotionPiece(\'R\');" 	class="PromotionButton">&#9814;</button><br>');
					$("#dialog_promotion").append('<button id="btn_bishop" type="button" onclick="setPromotionPiece(\'B\');" 	class="PromotionButton">&#9815;</button><br>');
					$("#dialog_promotion").append('<button id="btn_knight" type="button" onclick="setPromotionPiece(\'N\');" 	class="PromotionButton">&#9816</button>');
				} else {
					$("#dialog_promotion").append('<button id="btn_dame" type="button" onclick="setPromotionPiece(\'q\');" 	class="PromotionButton">&#9819;</button><br>');
					$("#dialog_promotion").append('<button id="btn_turm" type="button" onclick="setPromotionPiece(\'r\');" 	class="PromotionButton">&#9820;</button><br>');
					$("#dialog_promotion").append('<button id="btn_bishop" type="button" onclick="setPromotionPiece(\'b\');" 	class="PromotionButton">&#9821;</button><br>');
					$("#dialog_promotion").append('<button id="btn_knight" type="button" onclick="setPromotionPiece(\'n\');" 	class="PromotionButton">&#9822</button>');
				}
			},
			close: function () {
				$("#dialog_promotion").empty();
			}
		});
	} else {
		T_Zuege.ZugUmwandlung = "";
		PromotionAnswer.resolve();
	}

	return PromotionAnswer.promise();
}

function setPromotionPiece(Piece) {

	T_Zuege.ZugUmwandlung = Piece;
	PromotionAnswer.resolve();
	PromotionDialog.dialog('close');
}

function showChallengeTip(text, darstellung) {

	$('#ChallengeTips').empty().append('<p class="' + darstellung + '">' + text + '</p>');

}

// Hier gibt es die html noch nicht. In einer Javascriptkonstante (= 64 leere div
// ohne id mit Klassen für schwarz und weiß) werden die Figuren ergänzt, indem die
// FEN-Zeilen in die div übertragen werden. Abschließend wird der string als html mit
// eigener Id an ein unsichtbares htmltag angehängt
function ErzeugeTooltip(FEN, Felderarray, TooltipId, Orientierung) {

	let FEN_split = FEN.split(" ")[0].split("/"); // Hier entstehen IMMER 8 Elemente
	let FEN_rows = Orientierung == WEISSAMZUG ? FEN_split : FEN_split.reverse();

	let i, k;
	let idx = 0;
	let Felderstring = '';

	for (i = 0; i < 8; i++) {
		let FEN_row = FEN_rows[i]; // Zeile (= Reihe des Schachbretts) extrahieren
		SquareCounter = 0; // Zeigt auf die aktuelle Stelle in der Reihe
		let j; // die Stellen in der FEN-Zeile
		for (j = 0; j < FEN_row.length; j++) {
			// Bei einer Zahl in der FEN-Zeile einfach hochzählen (das sind Felder ohne Figuren)
			if ($.isNumeric(FEN_row[j])) {
				SquareCounter = parseInt(FEN_row[j]);
				for (k = 0; k < SquareCounter; k++) {
					Felderstring += Felderarray[idx];
					idx++;
				}
			} else { // sonst die Figur einfach in das div des array eintragen
				switch (FEN_row[j]) {
					case 'P':
						{ Felderstring += Felderarray[idx].replace('><', '>' + FIGUREN.P + '<'); break; }
					case 'p':
						{ Felderstring += Felderarray[idx].replace('><', '>' + FIGUREN.p + '<'); break; }
					case 'K':
						{ Felderstring += Felderarray[idx].replace('><', '>' + FIGUREN.K + '<'); break; }
					case 'k':
						{ Felderstring += Felderarray[idx].replace('><', '>' + FIGUREN.k + '<'); break; }
					case 'Q':
						{ Felderstring += Felderarray[idx].replace('><', '>' + FIGUREN.Q + '<'); break; }
					case 'q':
						{ Felderstring += Felderarray[idx].replace('><', '>' + FIGUREN.q + '<'); break; }
					case 'R':
						{ Felderstring += Felderarray[idx].replace('><', '>' + FIGUREN.R + '<'); break; }
					case 'r':
						{ Felderstring += Felderarray[idx].replace('><', '>' + FIGUREN.r + '<'); break; }
					case 'N':
						{ Felderstring += Felderarray[idx].replace('><', '>' + FIGUREN.N + '<'); break; }
					case 'n':
						{ Felderstring += Felderarray[idx].replace('><', '>' + FIGUREN.n + '<'); break; }
					case 'B':
						{ Felderstring += Felderarray[idx].replace('><', '>' + FIGUREN.B + '<'); break; }
					case 'b':
						{ Felderstring += Felderarray[idx].replace('><', '>' + FIGUREN.b + '<'); break; }
				}
				idx++;
			}
		}
	}
	// Damit wird das fertige Board an das unsichtbare tag angehängt. Zugriff über id
	$('#tooltips').append("<div class='cb_tooltip' id='" + TooltipId + "'>" + Felderstring + "</div>");
}

// Eine Stellung wird aufgebaut, indem die FEN-Zeilen in die div übertragen werden
function StellungAufbauen(div_Brett, FEN) {

	let FEN_rows = FEN.split("/"); // Jede Zeile wird getrennt übertragen
	let files = ("abcdefgh").split(''); // das wird dann Teil des jquery-Identifikators. Für die Zahlen ist das ja nicht nötig

	BrettLeeren(div_Brett); // Entfernt nur die Inhalte, keine tags, keine Id

	let i;
	for (i = 0; i < 8; i++) {
		let FEN_row = FEN_rows[i]; // Zeile extrahieren
		FileCounter = 0; // Zeigt auf die aktuelle Stelle in der Reihe
		let j; // die Stellen in der FEN-Zeile
		for (j = 0; j < FEN_row.length; j++) {
			// Bei einer Zahl in der FEN-Zeile einfach hochzählen (das sind Felder ohne Figuren)
			if ($.isNumeric(FEN_row[j]))
				FileCounter += parseInt(FEN_row[j]);
			else {

				// Zusammenbauen des Feldnamens
				let rank = 8 - i; // FEN beginnt bei der achten Reihe
				let file = files[FileCounter];
				let Feldname = div_Brett + '_' + file + rank;

				// das Figursymbol in das div (=Feld) eintragen und dann gleich noch das span einfügen
				switch (FEN_row[j]) {
					case 'P':
						{ $('#' + Feldname).html('<span id="P_' + file + rank + '">' + FIGUREN.P + '</span>'); break; }
					case 'p':
						{ $('#' + Feldname).html('<span id="p_' + file + rank + '">' + FIGUREN.p + '</span>'); break; }
					case 'K':
						{ $('#' + Feldname).html('<span id="K_' + file + rank + '">' + FIGUREN.K + '</span>'); break; }
					case 'k':
						{ $('#' + Feldname).html('<span id="k_' + file + rank + '">' + FIGUREN.k + '</span>'); break; }
					case 'Q':
						{ $('#' + Feldname).html('<span id="Q_' + file + rank + '">' + FIGUREN.Q + '</span>'); break; }
					case 'q':
						{ $('#' + Feldname).html('<span id="q_' + file + rank + '">' + FIGUREN.q + '</span>'); break; }
					case 'R':
						{ $('#' + Feldname).html('<span id="R_' + file + rank + '">' + FIGUREN.R + '</span>'); break; }
					case 'r':
						{ $('#' + Feldname).html('<span id="r_' + file + rank + '">' + FIGUREN.r + '</span>'); break; }
					case 'N':
						{ $('#' + Feldname).html('<span id="N_' + file + rank + '">' + FIGUREN.N + '</span>'); break; }
					case 'n':
						{ $('#' + Feldname).html('<span id="n_' + file + rank + '">' + FIGUREN.n + '</span>'); break; }
					case 'B':
						{ $('#' + Feldname).html('<span id="B_' + file + rank + '">' + FIGUREN.B + '</span>'); break; }
					case 'b':
						{ $('#' + Feldname).html('<span id="b_' + file + rank + '">' + FIGUREN.b + '</span>'); break; }
				}
				FileCounter++;
			}
		}
	}

}

//span verschieben, dabei Umwandlungen berücksichtigen und Rochaden separat behandeln
// Für Rochaden gibt es kein Flag, also den Zug direkt als Zeichenkette abfragen
function ZieheZug(objZug, BoardPräfix) {

	// Der Zug M_0 ist kein echter Zug und wird nie gezogen. 
	if(objZug.CurMoveId == 'M_0') return;

	BoardPräfix += '_';

	// Erkennt beide Rochaden, die werden im else behandelt
	if (objZug.ZugKurz.indexOf('0-0') == -1) {

		let Figursymbol, Figurname;

		if (objZug.ZugUmwandlung != "") {
			if(logMe(LOGLEVEL_IMPORTANT, LOGTHEME_SITUATION)) console.log('In objZug ungleich "": objZug.ZugUmwandlung = ' + objZug.ZugUmwandlung);
			FigursymbolIndex = objZug.ZugFarbe == WEISSAMZUG ? objZug.ZugUmwandlung.toUpperCase() : objZug.ZugUmwandlung.toLowerCase();
			Figursymbol = eval('FIGUREN.' + FigursymbolIndex);
			Figurname = objZug.ZugUmwandlung;
		} else {
			Figursymbol	= $('#' + BoardPräfix + objZug.ZugVon + ' :first-child').text(); // Figurzeichen retten
			Figurname		= $('#' + BoardPräfix + objZug.ZugVon + ' :first-child')[0].id.slice(0, 1); // Gilt so für Bauern und Figuren
		}

		$('#' + BoardPräfix + objZug.ZugVon).empty(); // Entfernt sowohl das Figurzeichen als auch das span
		$('#' + BoardPräfix + objZug.ZugNach).empty().append('<span id="' + Figurname + '_' + objZug.ZugNach + '">' + Figursymbol + '</span>');
		// En Passant. Funktioniert für weiss und für schwarz
		if(Figurname.toUpperCase() == 'P' && objZug.ZugAktion == SCHLÄGT && $('#' + BoardPräfix + objZug.ZugNach).children().length == 0) {
			$('#' + BoardPräfix + objZug.ZugNach.slice(0, 1) + objZug.ZugVon.slice(1) ).empty();
		}

	} else { // Rochaden

		if (objZug.ZugFarbe == WEISSAMZUG) {
			if (objZug.ZugOriginal.indexOf('0-0-0') == 0) {
				$('#' + BoardPräfix + 'e1').html(''); // Entfernt sowohl das Figurzeichen als auch das span
				$('#' + BoardPräfix + 'a1').html(''); // Entfernt sowohl das Figurzeichen als auch das span
				$('#' + BoardPräfix + 'c1').append('<span id="K_c1">' + FIGUREN.K + '</span>');
				$('#' + BoardPräfix + 'd1').append('<span id="R_d1">' + FIGUREN.R + '</span>');
			} else {
				$('#' + BoardPräfix + 'e1').html(''); // Entfernt sowohl das Figurzeichen als auch das span
				$('#' + BoardPräfix + 'h1').html(''); // Entfernt sowohl das Figurzeichen als auch das span
				$('#' + BoardPräfix + 'g1').append('<span id="K_g1">' + FIGUREN.K + '</span>');
				$('#' + BoardPräfix + 'f1').append('<span id="R_f1">' + FIGUREN.R + '</span>');
			}
		} else {
			if (objZug.ZugOriginal.indexOf('0-0-0') == 0) {
				$('#' + BoardPräfix + 'e8').html(''); // Entfernt sowohl das Figurzeichen als auch das span
				$('#' + BoardPräfix + 'a8').html(''); // Entfernt sowohl das Figurzeichen als auch das span
				$('#' + BoardPräfix + 'c8').append('<span id="k_c8">' + FIGUREN.k + '</span>');
				$('#' + BoardPräfix + 'd8').append('<span id="r_d8">' + FIGUREN.r + '</span>');
			} else {
				$('#' + BoardPräfix + 'e8').html(''); // Entfernt sowohl das Figurzeichen als auch das span
				$('#' + BoardPräfix + 'h8').html(''); // Entfernt sowohl das Figurzeichen als auch das span
				$('#' + BoardPräfix + 'g8').append('<span id="k_g8">' + FIGUREN.k + '</span>');
				$('#' + BoardPräfix + 'f8').append('<span id="r_f8">' + FIGUREN.r + '</span>');
			}
		}
	}

	showAid(AIDMODE_INIT);

}

// In allen htmltags, die mit diesem Präfix anfangen (das sind alle 64 Felder und nur diese) die Inhalte entfernen
function BrettLeeren(div_Brett) {

	$('[id^=' + div_Brett + '_]').html('');

}

// wird zwar in die Notation mit eingetragen, funktioniert aber noch nicht
function jumpToPosition(Brett, FEN, Notationtree, Farbe, NotationszeileId) {

	removeNotationMarker(Notationtree);
	addNotationMarker(Notationtree, Farbe, NotationszeileId);

	StellungAufbauen(Brett, FEN);
}

// Übertrag der aktuellen Zugdaten in das Objekt Stellung
function TransferZugNachStellung(Stellung, Zug) {

	Stellung.ZugLevel		= Zug.ZugLevel;
	Stellung.ZugFarbe		= Zug.ZugFarbe;
	Stellung.PreMoveId	= Zug.PreMoveId;
	Stellung.CurMoveId	= Zug.CurMoveId;
	Stellung.FEN				= Zug.FEN;

	if (Zug.ZugFarbe == WEISSAMZUG) {
		Stellung.Text_w	= Zugtext(Zug.ZugKurz) + Zugtext(Zug.ZugUmwandlung) + Zug.NAGNotation + Zug.ZugZeichen;
		Stellung.Text_b	= DEFAULTMOVE_B;
	} else {
		Stellung.Text_w	= DEFAULTMOVE_W;
		Stellung.Text_b	= Zugtext(Zug.ZugKurz) + Zugtext(Zug.ZugUmwandlung) + Zug.NAGNotation + Zug.ZugZeichen;
	}

}

// Übersetzung verschiedener Notationssprachen (zur Zeit nur englisch) in deutsche Notation
// Für jede mögliche Zahl oder Buchstabe gibt es eine Entsprechung
function Zugtext(zugtext) {

	let returntext = '';

	if (zugtext.startsWith("0")) { // Rochaden
		returntext = zug;
	} else {
		for (let i = 0; i < zugtext.length; i++) {
			returntext += ZUGNOTATION[zugtext[i]];
		}
	}
	return returntext;
}

function finishChallenge(Endetext) {
	showChallengeTip('Bravo. ' + Endetext, 'VeryImportantText');
	removeMouseBoardFunctions(HTMLBRETTNAME_SPIELEN);
	removeNotationMarker('ChallengeTreeNotationId');
	$('#VariantetextId').removeClass().addClass('centertext');
}