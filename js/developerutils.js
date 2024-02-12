
// Nur als Muster. Liefert alle Knoten!!!
//$('#ChallengeTreeNotationId').jstree(true).get_json('#', { flat: true })
//$('#ImportTreeNotationId').jstree(true).get_json('#', { flat: true })


// Nur zur besseren Lesbarkeit beim debuggen
function showChallengeMovesShort() {

	let ChallengeMoveShort = [];

	for(i = 0; i < ChallengeMoves.length; i++) {
		ChallengeMoveShort.push({
			Id:						ChallengeMoves[i].Id,
			CurMoveId:		ChallengeMoves[i].CurMoveId,
			PreMoveId:		ChallengeMoves[i].PreMoveId,
			ZugOriginal:	ChallengeMoves[i].ZugOriginal,
			ZugLevel:			ChallengeMoves[i].ZugLevel,
			MoveState: 		ChallengeMoves[i].MoveState,
			MoveNode:			ChallengeMoves[i].MoveNode
		});
	}
	if(logMe(LOGLEVEL_IMPORTANT, LOGTHEME_SITUATION)) console.table(ChallengeMoveShort);
}

function showMoveContext(MoveC) {

	let ReturnMoveC = [];

	ReturnMoveC.push(MoveC.result);
	ReturnMoveC.push(MoveC.mainmovestatus);
	ReturnMoveC.push(MoveC.varmovescounter);
	ReturnMoveC.push(MoveC.drawnmoveindex);
	ReturnMoveC.push(MoveC.mainmove);
	ReturnMoveC.push(MoveC.drawnmove);
	for(i = 0; i < MoveC.variantenmoves.length - 1; i++) {
		ReturnMoveC.push(MoveC.variantenmoves[i]);
	}
	console.table(ReturnMoveC);
}

// Weil der debugger nicht auf Mausklick im Schachbrett reagiert
function startMouseUp() {

	T_Zuege.ZugVon = $('#Mausersatz').val().slice(0, 2);
	T_Zuege.ZugFigur = $("span[id$='" + $('#Mausersatz').val().slice(0, 2) + "']")[0].id.slice(0, 1);

	T_Zuege.ZugNach = $('#Mausersatz').val().slice(-2);

	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('firePlayerMove1');
	firePlayerMove();
	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('firePlayerMove2');
}

function getFuncName() {
	return getFuncName.caller.name
}

function KommandoAbschicken() {

	$("#TriggerTag").trigger("gocmd", Kommandostart.value);

}

function RegexAbschicken() {


	let m_depth = (/(depth )(?<depth>\d)/g).exec(Regexstart.value);
	let m_seldepth = (/(seldepth )(?<seldepth>\d)/g).exec(Regexstart.value);

	let m_scorecp = (/(score cp )(?<scorecp>\d)/g).exec(Regexstart.value);

	let i = 0;

}

// showjstreeimportant('ChallengeTreeNotationId')
// showjstreeimportant('ImportTreeNotationId')
// $('#ChallengeTreeNotationId').jstree(true).get_json('#', { flat: true })
// $('#ImportTreeNotationId').jstree(true).get_json('#', { flat: true })
function showjstreeimportant(TreeContainer) {

	let nodesarray = $('#' + TreeContainer).jstree(true).get_json('#', { flat: true })
	let nodearrayshort = [];

	nodesarray.forEach(function (item, idx) {

		let shorttext = item.text //.replace('movenumber', 'mn')
															//.replace('currentmovemarker', 'cmm')
															//.replace('movewhite', 'mw')
															//.replace('moveblack', 'mb')
															.replace('variantezeiger', 'vz')
															//.replace(/^<div>|<\/div>$| +onmouseover=['"]{0,1}.*;['"]{0,1}/g, '')
															.replace(/^<div>|<\/div>$| +onmouseover=['"]{0,1}.*\);['"]{0,1}| +class=['"][a-z ]*['"]/g, '')
															.replace(/span/g, 's');
		if(logMe(LOGLEVEL_IMPORTANT, LOGTHEME_SITUATION)) console.log(item.id + ' ' + item.parent + ' ' + shorttext);

		let shorttextparts = shorttext.split('><');
		nodearrayshort.push({
			parent:		item.parent,
			id:				item.id,
			nummber:	shorttextparts[0] + '>',
			white:		'<' + shorttextparts[1] + '>',
			black:		'<' + shorttextparts[2]
		});
	});

	if(logMe(LOGLEVEL_IMPORTANT, LOGTHEME_SITUATION)) console.table(nodearrayshort);

}

function logMe(level, theme) {

	// if(level >= curLoglevel && $.inArray(theme, curLogthemes) >= 0) {
	// 	return true;
	// } else {
	// 	return false;
	// }

	return result = level >= curLoglevel && $.inArray(theme, curLogthemes) >= 0 ? true : false;

}

function logVisitor(Role) {
	let Orientation						= screen.orientation.type; /*screen.orientation.type*/ // safari kann das nicht
	let myWidth								= window.innerWidth;
	let myHeight							= window.innerHeight;
	let devicePixelRatio			= window.devicePixelRatio;
	let pixelDepth						= screen.pixelDepth;
	let colorDepth						= screen.colorDepth;

	console.log('orientation: ' + Orientation);

}