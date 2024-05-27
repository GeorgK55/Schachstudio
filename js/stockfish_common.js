
function postit(mess) {	if(logMe(LOGLEVEL_IMPORTANT, LOGTHEME_ENGINEDIALOG)) console.log('postit: ' + mess);
	$('<p class="LogEin">' + mess + '</p>').appendTo('#logliste');
	stockFish.postMessage(mess);
};

function postitdebug(mess) {	if(logMe(LOGLEVEL_IMPORTANT, LOGTHEME_ENGINEDIALOG)) console.log('postitdebug: ' + mess);
	$('<p class="LogEin">' + mess + '</p>').prependTo('#logliste');
	stockFish.postMessage(mess);
};

function compressline(line) {

	let line0 = line.replace("info depth", "id");
	let line1 = line0.replace("seldepth", "sd");
	let line2 = line1.replace("multipv 1 ", "");
	let line3 = line2.replace("score ", "");
	let line4 = line3.replace(/nodes \d* /, '');
	let line5 = line4.replace(/nps \d* /, '');
	let line6 = line5.replace(/time \d* /, '');

	return line6;
}

// Bei der Zugnotation für stockfish fehlt der Figurname.
// Der wird hier über FEN bestimmt: aus dem Feldname ergibt sich ein "Index" in FEN
function getMoveNotations(FEN, sfmove, result) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('FEN: ' + FEN + ' sfmove: ' + sfmove + ' result: ' + result);

	let FileVon = sfmove.substr(0, 1);
	let RankVon = sfmove.substr(1, 1);
	let FileNach = sfmove.substr(2, 1);
	let RankNach = sfmove.substr(3, 1);
	let PawnPromotion = sfmove.length == 5 ? FIGURNOTATION[sfmove.substr(4, 1)] : '';

	let FENohne = FEN.replaceAll('/', '');

	let IndexVon = FENFileFactor[FileVon] + FENFileFactor[RankVon] * 8;
	let idxVon = 0;
	let FENFigurVon = "";

	let ZugAktion = '';
	let returnresult = '';

	for (i = 0; i < FEN.length; i++) {

		if ($.isNumeric(FENohne[i]))
			idxVon += parseInt(FENohne[i]); // Bei Leerfeldern (=Zahlen) die Anzahl dazu
		else
			idxVon++; // Bei Figuren oder Bauern (ungleich Zahlen) inkrementieren

		if (idxVon == IndexVon) { // Muss echt gleich sein. > wäre fehlhaft, weil dann das Feld leer wäre
			FENFigurVon = FENohne[i];
			break;
		}
	}

	let IndexNach = FENFileFactor[FileNach] + FENFileFactor[RankNach] * 8;
	let idxNach = 0;
	let FENFigurNach = "";

	for (i = 0; i < FEN.length; i++) {


		if ($.isNumeric(FENohne[i]))
			idxNach += parseInt(FENohne[i]); // Bei Leerfeldern (=Zahlen) die Anzahl dazu
		else
			idxNach++; // Bei Figuren oder Bauern (ungleich Zahlen) inkrementieren

		if (idxNach >= IndexNach) { // muss nicht gleich sein. Durch Leerfelder kann der Index größer werden
			// Wenn an der Stelle eine Zahl steht, ist das Feld leer
			FENFigurNach = $.isNumeric(FENohne[i]) ? "" : FENohne[i];
			break;
		}

	}

	if (FENFigurVon.toUpperCase() == "P") { // Die Zeichenkette für einen Bauer zusammenbauen

		if (FENFigurNach == "") { // Dann hat ein Bauer nur gezogen und nicht geschlagen
			ZugErgebnis = FileNach + RankNach;
			ZugAktion = ZIEHTLANG;
		} else {
			ZugErgebnis = FileVon + SCHLÄGT + FileNach + RankNach;
			ZugAktion = SCHLÄGT;
		}
	} else { // Die Zeichenkette für eine Figur
		if (FENFigurNach == "") { // Dann hat die Figur nur gezogen und nicht geschlagen
			ZugErgebnis = FIGURNOTATION[FENFigurVon] + FileNach + RankNach;
			ZugAktion = ZIEHTLANG;
		} else {
			ZugErgebnis = FIGURNOTATION[FENFigurVon] + SCHLÄGT + FileNach + RankNach;
			ZugAktion = SCHLÄGT;
		}
	}

	switch (result) {
		case 'kurz':
			returnresult = ZugErgebnis + PawnPromotion;
			break;
		case 'FigurVon':
			returnresult = FENFigurVon;
			break;
		case 'ZugAktion':
			returnresult = ZugAktion;
			break;
		default:
			returnresult = '';
			break;
	}

	return returnresult;
}

