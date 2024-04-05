
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

function addBoardFunctions(BoardId) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

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

function getVarianteLevelColorClass(situation, zuglevel) {

	let VariantetextFarbeClass;

	if(zuglevel == 0) {
	VariantetextFarbeClass =	'variantemain';
	} else  {
	VariantetextFarbeClass =	situation.VarianteColor[zuglevel] % 2 == 0 ? 'varianteeven' : 'varianteodd';
	}

	return VariantetextFarbeClass
}
