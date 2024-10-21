
function ConfigureEngine() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

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

 // init, first, second
function showAid(aidmode) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	const AidTextSet = new Set();

	let AidMoves, AidText = "";

	switch(aidmode) {
		case AIDMODE_INIT:
			$('#aidicon').html('<img src="grafiken/firstaid.png" alt="" class="aidmarker" onclick="showAid(AIDMODE_FIRST)"></img>');
			$('#aidtext').empty();
			$("[id^='aidpath_']").remove();

			break;

		case AIDMODE_FIRST:
			$('#aidicon').html('<img src="grafiken/secondaid.png" alt="" class="aidmarker" onclick="showAid(AIDMODE_SECOND)"></img>');

			AidMoves = $.grep(ChallengeMoves, function (CM, i) { return CM['PreMoveId'] == Stellungsdaten.CurMoveId &&	(CM['MoveState'] == MOVESTATE_READY || CM['MoveState'] == MOVESTATE_HIDDEN); });

			$.each(AidMoves, function (i, HK) {
				//$('[data-square="' + HK.ZugVon + '"]').removeClass('erstehilfe');
				$('[data-square="' + HK.ZugVon + '"]').addClass('erstehilfe');
				AidTextSet.add(HK.ZugFigur + HK.ZugVon); // Es gibt kein Feld, in dem beide Werte enthalten sind
			});

			for (const entry of AidTextSet.values()) {
  			AidText += entry + " ";
			}

			$('#aidtext').html(AidText);

			break;

		case AIDMODE_SECOND:
			$('#aidicon').html('<img src="grafiken/firstaid.png" alt="" class="aidmarker" onclick="showAid(AIDMODE_INIT)"></img>');
			$('.erstehilfe').removeClass('erstehilfe');

			AidMoves = $.grep(ChallengeMoves, function (CM, i) { return CM['PreMoveId'] == Stellungsdaten.CurMoveId &&	(CM['MoveState'] == MOVESTATE_READY || CM['MoveState'] == MOVESTATE_HIDDEN); });

			$.each(AidMoves, function (i, HK) {
				//$('[data-square="' + HK.ZugVon + '"]').removeClass('erstehilfe');
				//$('[data-square="' + HK.ZugVon + '"]').addClass('erstehilfe');
				AidTextSet.add(HK.ZugLang);

				addAidPath(HK);
			});

			for (const entry of AidTextSet.values()) {
  			AidText += entry + " ";
			}
			$('#aidtext').html(AidText);


		break;

	}
}

function showDraw(drawarray) { if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	// svg möchte Längenangaben vorrangig in Pixel haben. em, rem, ... sind auch erlaubt aber vh und vw (noch) nicht
	// Hier wird die exakte Größe eines Feldes des Schachbretts berechnet. 10 weil ja die Koordinaten noch dazukommen.
	const currentFieldSize	= Math.round($( "#challengechessboard" ).width() / 10);
	const startmitte				= Math.round($( "#challengechessboard" ).width() / 20);

	drawarray.forEach(function(svgitem) {

		let sd = new Csvgdata();
		let itemparts = svgitem.split('');

		sd.color			= itemparts[0].toLowerCase();

		if(Challenge.AmZug == WEISSAMZUG) {
			sd.startfile	= (FENFileFactor[itemparts[1]])			* currentFieldSize + startmitte;
			sd.startrank	= (8 - parseInt(itemparts[2]) + 1)	* currentFieldSize + startmitte;
			if(svgitem.length == 5) {
				sd.stopfile	= (FENFileFactor[itemparts[3]])			* currentFieldSize + startmitte;
				sd.stoprank	= (8 - parseInt(itemparts[4]) + 1)	* currentFieldSize + startmitte;					
			}


		} else {
			sd.startfile	= (8 - FENFileFactor[itemparts[1]] + 1)	* currentFieldSize + startmitte;
			sd.startrank	= (parseInt(itemparts[2]) - 1 + 1)			* currentFieldSize + startmitte;
			if(svgitem.length == 5) {
				sd.stopfile	= (8 - FENFileFactor[itemparts[3]] + 1)	* currentFieldSize + startmitte;
				sd.stoprank	= (parseInt(itemparts[4]) - 1 + 1)			* currentFieldSize + startmitte;
			}

		}

		if(svgitem.length == 5) {

			const markerpath = document.createElementNS('http://www.w3.org/2000/svg','path');

			markerpath.setAttribute("id", "annopath_" + svgitem)
			markerpath.setAttribute("d", "M " + sd.startfile + "," + sd.startrank + " L " + sd.stopfile + "," + sd.stoprank);
			markerpath.setAttribute("stroke-width", 6);
			markerpath.setAttribute("marker-end", "url(#svgannogoalarrow_" + sd.color + ")");
			markerpath.setAttribute("class", "svgcolorannoarrow_" + sd.color);
		
			document.getElementById("svganno").appendChild(markerpath); // ist damit ein sibling mit defs

		} else if(svgitem.length == 3) {

			const markercircle = document.createElementNS('http://www.w3.org/2000/svg','circle');

			markercircle.setAttribute("id", "annocircle_" + svgitem)
			markercircle.setAttribute("cx", sd.startfile);
			markercircle.setAttribute("cy", sd.startrank);
			markercircle.setAttribute("r", startmitte);
			markercircle.setAttribute("class", "svgcolorannocircle_" + sd.color);
		
			document.getElementById("svganno").appendChild(markercircle); // ist damit ein sibling mit defs

		}

	})

}

function resetmarker() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	$('#movenotestext').empty();
	// $('#movenotesrejectid').empty();
	$('#movenotesresolveid').empty();
	$('#movenotesresultmarkerid').empty();
	$('#movenotesmarkerid').empty();

}

function showNotAcceptedMove() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	$("[data-square=" + T_Zuege.ZugVon + "]").children().effect("shake");
	$('#movenotesresultmarkerid').html("<img id='moveokId' src='grafiken/fehler.png'/>");
}

function addBoardFunctions(BoardId) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	addMouseBoardFunctions();
	addTouchBoardFunctions();
	addSVGBoardFunctions(); 

}

function addMouseBoardFunctions() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	$('[data-square]')
		.mousedown(function (evx) {

			if (evx.target.childNodes.length > 0) { // nur dann steht eine Figur auf dem Feld

				T_Zuege.ZugVon		= evx.target.parentNode.getAttribute('data-square');
				T_Zuege.ZugFigur	= evx.target.getAttribute("data-piece");

				InputDeviceStart = true;
			}
			evx.preventDefault();
		})
		.mouseup(function (evx) {

			if (InputDeviceStart) {

				InputDeviceStart = false;

				if(evx.target.childNodes.length > 0) { // dann wird eine Figur geschlagen
					if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('mouseup evx.target.parentNode.getAttribute("data-square"): ' + evx.target.parentNode.getAttribute("data-square"));
					T_Zuege.ZugNach = evx.target.parentNode.getAttribute('data-square');
				} else {
					if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('mouseup evx.target.getAttribute("data-square"): ' + evx.target.getAttribute("data-square"));
					T_Zuege.ZugNach = evx.target.getAttribute("data-square");
				}

				evx.preventDefault();

				firePlayerMove();
			}

		});

}

// Wird nach Beendigung einer Aufgabe aufgerufen
function removeMouseBoardFunctions(BoardIdPraef) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	// .off ohne weitere Parameter deaktiviert ALLE handler
	$('[id^=' + BoardIdPraef + ']').off();

}

function addTouchBoardFunctions() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	$('[data-square]')
		.on('touchstart', function (evx) {
			if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('touchstart' + evx.originalEvent.srcElement);

			if (evx.target.childNodes.length > 0) { // nur dann steht eine Figur auf dem Feld

				T_Zuege.ZugVon = evx.target.parentNode.getAttribute('data-square');
				T_Zuege.ZugFigur = evx.target.getAttribute("data-piece");

				InputDeviceStart = true;
			}

			evx.preventDefault();
		})
		.on('touchmove', function (evx) {
			evx.preventDefault();
		})
		.on('touchend', function (evx) {

			if (InputDeviceStart) {	

				InputDeviceStart = false;

				if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('touchend	' + evx.originalEvent.srcElement);
				if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('x und y	' + evx.changedTouches[0].pageX + ' ' + evx.changedTouches[0].pageY);

				let endTarget = document.elementFromPoint(
					evx.changedTouches[0].pageX,
					evx.changedTouches[0].pageY - window.scrollY
				);
				
				if(endTarget.childNodes.length > 0) {
					T_Zuege.ZugNach = endTarget.parentNode.getAttribute('data-square');
				} else {
					T_Zuege.ZugNach = endTarget.getAttribute("data-square");
				}

				firePlayerMove();
			}
		})
		;

}
	
function getMoveState(MoveId) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	let index = ChallengeMoves.findIndex(m => m.CurMoveId === MoveId);
	return ChallengeMoves[index].MoveState;

}

function setMoveState(MoveId, NewState) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	let index = ChallengeMoves.findIndex(m => m.CurMoveId === MoveId);
	ChallengeMoves[index].MoveState = NewState;

}

// MoveNode ist in der DB null.
// Bei zeigen oder notieren wird die KnotenID der Notation hier eingetragen
function setMoveNode(MoveId, Nodeid) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	let index = ChallengeMoves.findIndex(m => m.CurMoveId === MoveId);
	ChallengeMoves[index].MoveNode = Nodeid;

}

function getMoveLevel(MoveId) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	let index = ChallengeMoves.findIndex(m => m.CurMoveId === MoveId);
	return ChallengeMoves[index].ZugLevel;

}

function getMoveStockfish(MoveId) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	let index = ChallengeMoves.findIndex(m => m.CurMoveId === MoveId);
	return ChallengeMoves[index].ZugStockfish;

}

function isMoveUsed(MoveId) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	let index = ChallengeMoves.findIndex(m => m.CurMoveId === MoveId);
	return ChallengeMoves[index].MoveNode == null ? false : true;

}

// Es werden in Abhängigkeit der Themenselektion genau die Button aktiviert oder deaktiviert, deren Funktion möglich ist
// btn-themaneu: enable, wenn genau ein Thema selektiert ist, egal ob Blatt oder Ast
// btn-themaentfernen: enable nur, wenn denau ein Thema selektiert ist und das ist ein Blatt
function activateThemaButtons(nodedata) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	if (nodedata.selected.length == 1) {
		$("#btn-themaneu").button("enable");
		//
		if ($('#themenlistetree').jstree(true).get_selected(true)[0].children.length == 0) {
			$("#btn-themaentfernen").button("enable");
		} else {
			$("#btn-themaentfernen").button("disable");
		}
	} else {
		$("#btn-themaneu").button("disable");
		$("#btn-themaentfernen").button("disable");
	}

}

function getVarianteLevelColorClass(situation, zuglevel) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	let VariantetextFarbeClass;

	if(zuglevel == 0) {
	VariantetextFarbeClass =	'svgcolormain';
	} else  {
	VariantetextFarbeClass =	situation.VarianteColor[zuglevel] % 2 == 0 ? 'svgcoloreven_' + zuglevel : 'svgcolorodd_' + zuglevel;
	}

	return VariantetextFarbeClass
}

function getVarianteLevelColorVar(situation, zuglevel) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	let VariantetextFarbeVar;

	if(zuglevel == 0) {
		VariantetextFarbeVar =	'var(--color_movecolormain)';
	} else  {
		VariantetextFarbeVar =	situation.VarianteColor[zuglevel] % 2 == 0 ? 'var(--color_movecoloreven_' + zuglevel + ')' : 'var(--color_movecolorodd_' + zuglevel + ')';
	}

	return VariantetextFarbeVar
}

function completeMoves(Zug, Moves) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

			// Die Felder werden wirklich benötigt
			Zug.FEN				= Challenge.FEN; 
			Zug.ZugFarbe	= Challenge.AmZug;
	
			// Diese beiden Felder werden grad mal zweckentfremdet
			Zug.ZugVon	= ChallengeMoves[0].ZugVon;
			Zug.ZugNach	= ChallengeMoves[0].ZugNach;
	
			const Nullzug			= { ...Zug }; // spread syntax
	
			Moves.splice(0, 0, Nullzug);
			setMoveState('M_0', MOVESTATE_MOVED);
	
			// Diese Werte sollen als int verwendet werden
			Moves.forEach(function(item) {
				item.AufgabeID		= parseInt(item.AufgabeID);
				item.CurMoveIndex	= parseInt(item.CurMoveIndex);
				item.ZugNummer		= parseInt(item.ZugNummer);
				item.ZugLevel			= parseInt(item.ZugLevel);
			})
			
	
}