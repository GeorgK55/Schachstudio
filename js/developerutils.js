
// Nur als Muster. Liefert alle Knoten!!!
//$('#challengenotation').jstree(true).get_json('#', { flat: true })
//$('#importtreenotationid').jstree(true).get_json('#', { flat: true })
//$('#themenlistetree').jstree(true).get_json('#', { flat: true })

// Nur zur besseren Lesbarkeit beim debuggen
function showChallengeMovesShort() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

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

function showMoveContext(MoveC) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

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
function startMouseUp() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	T_Zuege.ZugVon = $('#mausersatz').val().slice(0, 2);
	T_Zuege.ZugFigur = $("span[id$='" + $('#mausersatz').val().slice(0, 2) + "']")[0].id.slice(0, 1);

	T_Zuege.ZugNach = $('#mausersatz').val().slice(-2);

	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('firePlayerMove1');
	firePlayerMove();
	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('firePlayerMove2');
}

function getFuncName() {
	return getFuncName.caller.name
}

function KommandoAbschicken() {
	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());
	$("#triggertag").trigger("gocmd", kommandostart.value);

}

function RegexAbschicken() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());


	let m_depth = (/(depth )(?<depth>\d)/g).exec(regexstart.value);
	let m_seldepth = (/(seldepth )(?<seldepth>\d)/g).exec(regexstart.value);

	let m_scorecp = (/(score cp )(?<scorecp>\d)/g).exec(regexstart.value);

	let i = 0;

}

// showjstreeimportant('challengenotation')
// showjstreeimportant('importtreenotationid')
// $('#challengenotation').jstree(true).get_json('#', { flat: true })
// $('#importtreenotationid').jstree(true).get_json('#', { flat: true })
function showjstreeimportant(TreeContainer) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	let nodesarray = $('#' + TreeContainer).jstree(true).get_json('#', { flat: true })
	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log(nodesarray);
	let nodearrayshort = [];

	nodesarray.forEach(function (item, idx) {

		let shorttext = item.text //.replace('movenumber', 'mn')
															//.replace('currentmovemarker', 'cmm')
															//.replace('movewhite', 'mw')
															//.replace('moveblack', 'mb')
															.replace('variantezeiger', 'vz')
															//.replace(/^<div>|<\/div>$| +onmouseover=['"]{0,1}.*;['"]{0,1}/g, '')
															.replace(/^<div>|<\/div>$| +onmouseover=['"]{0,1}.*?\);['"]{0,1}| +class=['"][a-z ]*['"]/g, '')
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

function logVisitor(Role) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	let Orientation						= screen.orientation.type; /*screen.orientation.type*/ // safari kann das nicht
	let myWidth								= window.innerWidth;
	let myHeight							= window.innerHeight;
	let devicePixelRatio			= window.devicePixelRatio;
	let pixelDepth						= screen.pixelDepth;
	let colorDepth						= screen.colorDepth;

}

function Aufgabenstatistik() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	const headers = {
		'Content-Type': 'text/plain',
		'credentials': 'include',
		'Authorization': 'GeorgK ' + 'lip_dXasEGgvxmJGdYQPZXVM' //process.env.lichessToken,
	};

	fetch('https://lichess.org/api/account', { headers })
  .then(res => res.json())
  .then(alert('then') );

	iii = 0;
	jjj = 0;

	Aufgabenstatistik = [];

	const dirinput = document.createElement('input');
	dirinput.type = 'file';
	dirinput.id = 'multiplefile-input';
	dirinput.setAttribute("multiple","");
	document.getElementById("fileimport").appendChild(dirinput);

	$('#multiplefile-input').trigger('click');
	$('#multiplefile-input').on('change', handleDirectoryFiles);

}

function handleDirectoryFiles(e) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	let files = e.target.files;

	for (var i = 0; i < files.length; i++) {

		fname = files[i].name;

		let reader = new FileReader();
		reader.studiename = files[i].name;
		reader.onloadend = function() {
			onStudieLoadedend(this.studiename);
		}
		reader.readAsText(files[i]);

	}
	
}

function onStudieLoadedend(sn) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	FilePGN = event.target.result.split("\n\n\n").filter(i => i); // .filter(i => i) entfernt leere Elemente

	for (var i = 0; i < FilePGN.length; i++) {

		iii++;

		let aufgabetext	= /Event "([^\"]*)/.exec(FilePGN[i])[1];
		let aufgabeFEN	= 'Ohne FEN';

		try {
			aufgabeFEN	= /FEN "([^\"]*)/.exec(FilePGN[i])[1];
		} catch(e) {
			aufgabeFEN = 'FEN fehlt für ' + aufgabetext + ' in ' + sn;
			jjj++;
			console.log(e);
		}

		if(aufgabeFEN	== 'Ohne FEN') {
			aufgabeFEN = 'Ohne FEN für ' + aufgabetext + ' in ' + sn;
		}
		Aufgabenstatistik.push(iii + ' --- ' + sn + ' --- ' + aufgabetext + ' --- ' + aufgabeFEN);

		console.log(iii + ' --- ' + sn + ' --- ' + aufgabetext + ' --- ' + aufgabeFEN);

	}
}

function getlichess() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	const headers = {
		'Content-Type': 'text/plain',
		'credentials': 'include',
		'Authorization': 'GeorgK ' + 'lip_dXasEGgvxmJGdYQPZXVM' //process.env.lichessToken,
	};

	fetch('https://lichess.org/api/account', { headers })
  .then(res => res.json())
  .then(console.log);
}