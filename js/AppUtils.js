
function ConfigureEngine() {

	// Grundsätzliche Initialisierung der Engine
	postit('setoption name UCI_AnalyseMode value true');
	postit('setoption name UCI_ShowWDL value true');

	// Initialisierung des Analyseverhaltens
	postit('setoption name Skill level value 20');
	postit('setoption name UCI_Elo value 1900');
	postit('setoption name Contempt value 0');
	postit('setoption name Threads value 1');
	postit('setoption name Ponder value true');
	postit('setoption name MultiPV value ' + MultiPV);
	postit('setoption name Move Overhead value 30');
	postit('setoption name Slow Mover value 80');
	//postit('setoption name UCI_Chess960 value False');
	postit('ucinewgame');
	postit('isready');
}

function showAid(aidmode) { // init, first, second

	const AidSet = new Set();
	let AidMoves, AidText = "";

	switch(aidmode) {
		case AIDMODE_INIT:
			$('#aidicon').html('<img src="Grafiken/pngegg.png" alt="" class="aidmarker" onclick="showAid(AIDMODE_FIRST)"></img>');
			$('#aidtext').empty();
			break;

		case AIDMODE_FIRST:
			$('#aidicon').html('<img src="Grafiken/secondaid.png" alt="" class="aidmarker" onclick="showAid(AIDMODE_SECOND)"></img>');

			AidMoves = $.grep(ChallengeMoves, function (CM, i) { return CM['PreMoveId'] == Stellungsdaten.CurMoveId &&	(CM['MoveState'] == MOVESTATE_READY || CM['MoveState'] == MOVESTATE_HIDDEN); });

			$.each(AidMoves, function (i, HK) {
				$('span[id$=' + HK.ZugVon + ']').removeClass('erstehilfe');
				$('span[id$=' + HK.ZugVon + ']').addClass('erstehilfe'); // Achtung: nach span darf kein Leerzeichen kommen
				AidSet.add(HK.ZugFigur + HK.ZugVon); // Es gibt kein Feld, in dem beide Werte enthalten sind
			});

			for (const entry of AidSet.values()) {
  			AidText += entry + " ";
			}

			$('#aidtext').html(AidText);

			break;

		case AIDMODE_SECOND:
			$('#aidicon').html('<img src="Grafiken/secondaid.png" alt="" class="aidmarker" onclick="showAid(AIDMODE_SECOND)"></img>');

			AidMoves = $.grep(ChallengeMoves, function (CM, i) { return CM['PreMoveId'] == Stellungsdaten.CurMoveId &&	(CM['MoveState'] == MOVESTATE_READY || CM['MoveState'] == MOVESTATE_HIDDEN); });

			$.each(AidMoves, function (i, HK) {
				$('span[id$=' + HK.ZugVon + ']').removeClass('erstehilfe');
				$('span[id$=' + HK.ZugVon + ']').addClass('erstehilfe'); // Achtung: nach span darf kein Leerzeichen kommen
				AidSet.add(HK.ZugLang);
			});

			for (const entry of AidSet.values()) {
  			AidText += entry + " ";
			}

			$('#aidtext').html(AidText);

		break;

	}
}

function resetmarker() {

	$('#VariantetextId').empty();
	// $('#VariantemarkerrejectId').empty();
	$('#VariantemarkerresolveId').empty();
	$('#ZugergebnismarkerId').empty();
	$('#VariantemarkerId').empty();

}

function showNotAcceptedMove() {

	$("#" + T_Zuege.ZugFigur + "_" + T_Zuege.ZugVon).effect("shake");
	$('#ZugergebnismarkerId').html("<img id='moveokId' src='Grafiken/fehler.png'/>");
}

function addBoardFunctions(BoardId) {

	addMouseBoardFunctions(BoardId);
	addTouchBoardFunctions(BoardId);
	addSVGBoardFunctions(); 

}

function addMouseBoardFunctions(BoardIdPraefix) {

	$('[id^=' + BoardIdPraefix + ']')
		.mousedown(function (evx) {

			if (evx.target.innerText != "") { // nur dann steht eine Figur auf dem Feld

				T_Zuege.ZugVon = evx.target.id.slice(-2);
				T_Zuege.ZugFigur = evx.target.id.slice(0, 1);

				MoveMouseDown = true;
			}
			evx.preventDefault();
		})
		.mouseup(function (evx) {

			if (MoveMouseDown) {

				if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('mouseup event.target.id: ' + evx.target.id);

				MoveMouseDown = false;
				T_Zuege.ZugNach = evx.target.id.slice(-2);
				evx.preventDefault();

				firePlayerMove();
			}

		});

}

// Wird nach Beendigung einer Aufgabe aufgerufen
function removeMouseBoardFunctions(BoardIdPraef) {

	// .off ohne weitere Parameter deaktiviert ALLE handler
	$('[id^=' + BoardIdPraef + ']').off();

}

function addTouchBoardFunctions(BoardIdPraefix) {

	$('[id^=' + BoardIdPraefix + ']')
		.on('touchstart', function (evx) {
			if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('touchstart' + evx.originalEvent.srcElement);

			T_Zuege.ZugVon = evx.target.id.slice(-2);
			T_Zuege.ZugFigur = evx.target.id.slice(0, 1);

			MoveMouseDown = true;
			evx.preventDefault();
		})
		.on('touchmove', function (evx) {
			evx.preventDefault();
		})
		.on('touchend', function (evx) {
			if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('touchend	' + evx.originalEvent.srcElement);
			if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('x und y	' + evx.changedTouches[0].pageX + ' ' + evx.changedTouches[0].pageY);

			let endTarget = document.elementFromPoint(
				evx.changedTouches[0].pageX,
				evx.changedTouches[0].pageY - window.scrollY
			).id.slice(-2);

			T_Zuege.ZugNach = endTarget;
			evx.preventDefault();

			firePlayerMove();
		})
		;

}

// Die beiden svg-Elemente in html an die richtige Stelle einbinden
function addSVGBoardFunctions() {

	// svg mit id und Klasse (wichtig: position ist absolute) versehen und auch wichtig als erstes Kind des chessboards einhängen
	const svgbase = document.createElementNS('http://www.w3.org/2000/svg','svg');	
  svgbase.setAttribute('id', 'variantensvg');
	svgbase.setAttribute('class', 'svg_container');
	document.getElementById('ChallengechessboardId').prepend(svgbase);

	// Wiederkehrende Elemente in defs anlegen.defs bekommt nur einen id als Attribut
	const svgdefstag = document.createElementNS('http://www.w3.org/2000/svg','defs');
	svgdefstag.setAttribute('id', 'svgdefs');
	document.getElementById('variantensvg').append(svgdefstag);

	// In defs einen Marker (das ist nur ein Rahmen für das eigentliche Element) anlegen
	const arrowmarker = document.createElementNS('http://www.w3.org/2000/svg','marker');
	arrowmarker.setAttribute('id', 						'goalarrow');
	arrowmarker.setAttribute('orient',				'auto');
	arrowmarker.setAttribute('markerWidth',		'3');
	arrowmarker.setAttribute('markerHeight',	'4');
	arrowmarker.setAttribute('refX', 					'2'); // verschiebt den Pfeil auf der Linie zurück oder vor
	arrowmarker.setAttribute('refY',					'2');
	document.getElementById('variantensvg').append(arrowmarker);

	// Das Element für den Marker
	const svgmarkerpath = document.createElementNS('http://www.w3.org/2000/svg','path');
	svgmarkerpath.setAttribute('id',	'goalarrowpath');
	svgmarkerpath.setAttribute('d',		'M0,0 V4 L2,2 Z');
	document.getElementById('goalarrow').append(svgmarkerpath);

}
	
function getMoveState(MoveId) {

	let index = ChallengeMoves.findIndex(m => m.CurMoveId === MoveId);
	return ChallengeMoves[index].MoveState;

}

function setMoveState(MoveId, NewState) {

	let index = ChallengeMoves.findIndex(m => m.CurMoveId === MoveId);
	ChallengeMoves[index].MoveState = NewState;

}

// MoveNode ist in der DB null.
// Bei zeigen oder notieren wird die KnotenID der Notation hier eingetragen
function setMoveNode(MoveId, Nodeid) {

	let index = ChallengeMoves.findIndex(m => m.CurMoveId === MoveId);
	ChallengeMoves[index].MoveNode = Nodeid;

}

function getMoveLevel(MoveId) {

	let index = ChallengeMoves.findIndex(m => m.CurMoveId === MoveId);
	return ChallengeMoves[index].ZugLevel;

}

function getMoveStockfish(MoveId) {

	let index = ChallengeMoves.findIndex(m => m.CurMoveId === MoveId);
	return ChallengeMoves[index].ZugStockfish;

}

function isMoveUsed(MoveId) {

	let index = ChallengeMoves.findIndex(m => m.CurMoveId === MoveId);
	return ChallengeMoves[index].MoveNode == null ? false : true;

}

// Es werden in Abhängigkeit der Themenselektion genau die Button aktiviert oder deaktiviert, deren Funktion möglich ist
// btn_ThemaNeu: enable, wenn genau ein Thema selektiert ist, egal ob Blatt oder Ast
// btn_ThemaEntfernen: enable nur, wenn denau ein Thema selektiert ist und das ist ein Blatt
function activateThemaButtons(nodedata) {

	if (nodedata.selected.length == 1) {
		$("#btn_ThemaNeu").button("enable");
		//
		if ($('#ThemenlisteTree').jstree(true).get_selected(true)[0].children.length == 0) {
			$("#btn_ThemaEntfernen").button("enable");
		} else {
			$("#btn_ThemaEntfernen").button("disable");
		}
	} else {
		$("#btn_ThemaNeu").button("disable");
		$("#btn_ThemaEntfernen").button("disable");
	}

}

function getVarianteColorClass(situation) {

	let VariantetextFarbeClass;

	if(situation.ZugLevel == 0) {
	VariantetextFarbeClass =	'variantemain';
	} else  {
	VariantetextFarbeClass =	situation.VarianteCounter % 2 == 0 ? 'varianteeven' : 'varianteodd';
	}

	return VariantetextFarbeClass
}

function getVarianteLevelColorClass(situation, zuglevel) {

	let VariantetextFarbeClass;

	if(zuglevel == 0) {
	VariantetextFarbeClass =	'variantemain';
	} else  {
	VariantetextFarbeClass =	situation.VarianteColor[zuglevel] % 2 == 0 ? 'varianteeven' : 'varianteodd';
	}

	return VariantetextFarbeClass
}

// Beim Start einer Vaiante wird der erste Zug der Variante (der ja auch gezogen wird) mit einem Pfeil gekennzeichnet
function addVariantePath(zugid) {

	// svg möchte Längenangaben vorrangig in Pixel haben. em, rem, ... sind auch erlaubt aber vh und vw (noch) nicht
	// Hier wird die exakte Größe eines Feldes des Schachbretts berechnet. 10 weil ja die Koordinaten noch dazukommen.
	const currentFieldSize	= Math.round($( "#ChallengechessboardId" ).width() / 10);
	const startmitte				= Math.round($( "#ChallengechessboardId" ).width() / 20);

	const path1 = document.createElementNS('http://www.w3.org/2000/svg','path');

	// In ZugStockfish stehen genau die beiden Feldnames des anzuzeigenden Zugs
	const zugstockfish = getMoveStockfish(zugid);
	let pathdataparts = zugstockfish.split('');

	let startfile, startrank, stopfile, stoprank;

	// Das Brett wird ja immer für die Sichtweise des Spielers gedreht
	// Aus dem zugstockfish werden die exakten Längen in Pixel berechnet
	if(Challenge.AmZug == WEISSAMZUG) {
		startfile	= (FENFileFactor[pathdataparts[0]])			* currentFieldSize + startmitte;
		startrank	= (8 - parseInt(pathdataparts[1]) + 1)	* currentFieldSize + startmitte;
		stopfile	= (FENFileFactor[pathdataparts[2]])			* currentFieldSize + startmitte;
		stoprank	= (8 - parseInt(pathdataparts[3]) + 1)	* currentFieldSize + startmitte;	
	} else {
		startfile	= (8 - FENFileFactor[pathdataparts[0]] + 1)	* currentFieldSize + startmitte;
		startrank	= (parseInt(pathdataparts[1]) - 1 + 1)			* currentFieldSize + startmitte;
		stopfile	= (8 - FENFileFactor[pathdataparts[2]] + 1)	* currentFieldSize + startmitte;
		stoprank	= (parseInt(pathdataparts[3]) - 1 + 1)			* currentFieldSize + startmitte;
	
	}

	path1.setAttribute("id", "variantepath_" + zugid)
	path1.setAttribute("d", "M " + startfile + "," + startrank + " L " + stopfile + "," + stoprank);
	path1.setAttribute("stroke-width", 10);
	path1.setAttribute("marker-end", "url(#goalarrow)");

  document.getElementById("variantensvg").appendChild(path1); // ist damit ein sibling mit defs

	if($( "#VariantetextId" ).hasClass( "variantemain" )) {
		$("#variantepath_" + zugid).removeClass().addClass('svgcolormain');
		$("#goalarrowpath").removeClass().addClass('svgcolormain');
	} else if($( "#VariantetextId" ).hasClass( "varianteodd" )) {
		$("#variantepath_" + zugid).removeClass().addClass('svgcolorodd');
		$("#goalarrowpath").removeClass().addClass('svgcolorodd');
	} else if($( "#VariantetextId" ).hasClass( "varianteeven" )) {
		$("#variantepath_" + zugid).removeClass().addClass('svgcoloreven');
		$("#goalarrowpath").removeClass().addClass('svgcoloreven');
	}

}

function computeMoveAnimationCorner(boardid, boarddirection, stockfishmove) {

	const currentFieldSize	= Math.round($( "#" + boardid).width() / 10);
	const startmitte				= Math.round($( "#" + boardid).width() / 20);

	let AC = new CAnimationCorner;

	let stockfishmoveparts = stockfishmove.split('');

	AC.fieldsize		= currentFieldSize;
	AC.fieldcenter	= startmitte;

	if(boarddirection == WEISSAMZUG) {
		// AC.startfile	= (FENFileFactor[stockfishmoveparts[0]])		* currentFieldSize + startmitte;
		// AC.startrank	= (8 - parseInt(stockfishmoveparts[1]) + 1)	* currentFieldSize + startmitte;
		// AC.stopfile	= (FENFileFactor[stockfishmoveparts[2]])		* currentFieldSize + startmitte;
		// AC.stoprank	= (8 - parseInt(stockfishmoveparts[3]) + 1)	* currentFieldSize + startmitte;	
		AC.startfile	= startmitte;
		AC.startrank	= startmitte;
		AC.stopfile	= (FENFileFactor[stockfishmoveparts[2]] - FENFileFactor[stockfishmoveparts[0]]) * currentFieldSize;
		AC.stoprank	= (parseInt(stockfishmoveparts[3]) - parseInt(stockfishmoveparts[1])) * currentFieldSize * -1;
	} else {
		AC.startfile	= (8 - FENFileFactor[stockfishmoveparts[0]] + 1)	* currentFieldSize + startmitte;
		AC.startrank	= (parseInt(stockfishmoveparts[1]) - 1 + 1)				* currentFieldSize + startmitte;
		AC.stopfile	= (8 - FENFileFactor[stockfishmoveparts[2]] + 1)	* currentFieldSize + startmitte;
		AC.stoprank	= (parseInt(stockfishmoveparts[3]) - 1 + 1)				* currentFieldSize + startmitte;
	}
	return AC;
}

function addMoveAnimationStyle(boardid, pieceid, boarddirection, stockfishmove) {

	let AC = computeMoveAnimationCorner(boardid, boarddirection, stockfishmove);

	// AC.stopfile = AC.startfile - AC.fieldsize;
	// AC.stoprank = AC.startrank - AC.fieldsize;
	// AC.startfile = 0;
	// AC.startrank = 0;

	let cssRulesList = document.styleSheets[5].cssRules;

	let ruleindex = 0;
	for (i=0; i<cssRulesList.length; i++) {
		if(cssRulesList[i].selectorText == '.svgmoveme') {
			document.styleSheets[5].deleteRule(i);
			ruleindex = i;
			break;
		}  
	}

	let animationpath = "M " + AC.fieldcenter + "," + AC.fieldcenter + " l " + AC.stopfile + "," + AC.stoprank;
	document.styleSheets[5].insertRule(".svgmoveme { offset-path: path('" + animationpath + "'); offset-rotate: 0deg; offset-anchor: center; animation: moveDiv 3s 1; }", ruleindex);

}

function terminateAnimation(cleardata) {

	$('#' +  cleardata.data.figur + '_' + cleardata.data.von).removeClass('svgmoveme');
	$('#' + cleardata.data.brett + cleardata.data.von).empty();
	//$('#' + BoardPräfix + objZug.ZugNach).empty().append('<span id="' + Figurname + '_' + objZug.ZugNach + '">' + Figursymbol + '</span>');

}