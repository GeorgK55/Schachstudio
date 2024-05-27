
// Die beiden svg-Elemente in html an die richtige Stelle einbinden
function addSVGBoardFunctions() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	// svg mit id und Klasse (wichtig: position ist absolute) versehen und auch wichtig als erstes Kind des chessboards einhängen
	const svgbase = document.createElementNS('http://www.w3.org/2000/svg','svg');	
  svgbase.setAttribute('id', 'variantensvg');
	svgbase.setAttribute('class', 'svg_container');
	document.getElementById('challengechessboard').prepend(svgbase);

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

// Beim Start einer Variante wird der erste Zug der Variante (der ja auch gezogen wird) mit einem Pfeil gekennzeichnet
function addVariantePath(zugid) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	// svg möchte Längenangaben vorrangig in Pixel haben. em, rem, ... sind auch erlaubt aber vh und vw (noch) nicht
	// Hier wird die exakte Größe eines Feldes des Schachbretts berechnet. 10 weil ja die Koordinaten noch dazukommen.
	const currentFieldSize	= Math.round($( "#challengechessboard" ).width() / 10);
	const startmitte				= Math.round($( "#challengechessboard" ).width() / 20);

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

	if($( "#variantetextid" ).hasClass( "variantemain" )) {
		$("#variantepath_" + zugid).removeClass().addClass('svgcolormain');
		$("#goalarrowpath").removeClass().addClass('svgcolormain');
	} else if($( "#variantetextid" ).hasClass( "varianteodd" )) {
		$("#variantepath_" + zugid).removeClass().addClass('svgcolorodd');
		$("#goalarrowpath").removeClass().addClass('svgcolorodd');
		$("#goalarrow").removeClass().addClass('svgcolorodd');
	} else if($( "#variantetextid" ).hasClass( "varianteeven" )) {
		$("#variantepath_" + zugid).removeClass().addClass('svgcoloreven');
		$("#goalarrowpath").removeClass().addClass('svgcoloreven');
		$("#goalarrow").removeClass().addClass('svgcoloreven');
	}

}

function computeMoveAnimationCorner(boarddirection, stockfishmove) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	const currentFieldSize	= Math.round($( ".svgboard").width() / 10);
	const startmitte				= Math.round($( ".svgboard").width() / 20);

	let AC = new CAnimationCorner;

	let stockfishmoveparts = stockfishmove.split('');

	AC.fieldsize		= currentFieldSize;
	AC.fieldcenter	= startmitte;

	AC.startfile	= startmitte;
	AC.startrank	= startmitte;

	if(boarddirection == WEISSAMZUG) {
		AC.stopfile	= (FENFileFactor[stockfishmoveparts[2]] - FENFileFactor[stockfishmoveparts[0]]) * currentFieldSize;
		AC.stoprank	= (parseInt(stockfishmoveparts[3]) - parseInt(stockfishmoveparts[1])) * currentFieldSize * -1;
	} else {
		AC.stopfile	= (FENFileFactor[stockfishmoveparts[0]] - FENFileFactor[stockfishmoveparts[2]]) * currentFieldSize;
		AC.stoprank	= (parseInt(stockfishmoveparts[1]) - parseInt(stockfishmoveparts[3])) * currentFieldSize * -1;
	}
	return AC;
}

function addMoveAnimationStyle(boarddirection, stockfishmove, speed) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	let AC = computeMoveAnimationCorner(boarddirection, stockfishmove);

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
	document.styleSheets[5].insertRule(".svgmoveme { offset-path: path('" + animationpath + "'); offset-rotate: 0deg; offset-anchor: center; animation: moveDiv " + speed + "s 1 forwards; }", ruleindex);

}
