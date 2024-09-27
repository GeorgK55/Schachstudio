//
// Allgmeine Notizen zu svg:
//
// marker:
// refX: verschiebt den Pfeil auf der Linie zurück (Werte kleiner) oder vor (Werte größer)
// refY: verschiebt den Pfeil auf der Linie nach rechts (Werte kleiner) oder nach links (Werte größer)
//

// Die beiden svg-Elemente in html an die richtige Stelle einbinden
function addSVGBoardFunctions() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	// svg mit id und Klasse (wichtig: position ist absolute) versehen und auch wichtig als erstes Kind des chessboards einhängen
	const svgbase = document.createElementNS('http://www.w3.org/2000/svg','svg');	
  svgbase.setAttribute('id', 'svgvarianten');
	svgbase.setAttribute('class', 'svgvariantencontainer');
	document.getElementById('challengechessboard').prepend(svgbase);

	// Wiederkehrende Elemente in defs anlegen.defs bekommt nur einen id als Attribut
	const svgdefstag = document.createElementNS('http://www.w3.org/2000/svg','defs');
	svgdefstag.setAttribute('id', 'svgvariantendefs');
	document.getElementById('svgvarianten').append(svgdefstag);

	// In defs einen Marker (das ist nur ein Rahmen für das eigentliche Element) anlegen
	const arrowmarker = document.createElementNS('http://www.w3.org/2000/svg','marker');
	arrowmarker.setAttribute('id', 						'goalarrow');
	arrowmarker.setAttribute('orient',				'auto');
	arrowmarker.setAttribute('markerWidth',		'3');
	arrowmarker.setAttribute('markerHeight',	'4');
	arrowmarker.setAttribute('refX', 					'2');
	arrowmarker.setAttribute('refY',					'2');
	document.getElementById('svgvarianten').append(arrowmarker);

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
	path1.setAttribute("stroke-width", 8);
	path1.setAttribute("marker-end", "url(#goalarrow)");

  document.getElementById("svgvarianten").appendChild(path1); // ist damit ein sibling mit defs

	$("#variantepath_" + zugid).removeClass().addClass(getVarianteLevelColorClass(Stellungsdaten, getMoveLevel(zugid)));
	$("#goalarrowpath").removeClass().addClass(getVarianteLevelColorClass(Stellungsdaten, getMoveLevel(zugid)));
	$("#goalarrow").removeClass().addClass(getVarianteLevelColorClass(Stellungsdaten, getMoveLevel(zugid)));

}

function addAidPath(zug) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	// svg möchte Längenangaben vorrangig in Pixel haben. em, rem, ... sind auch erlaubt aber vh und vw (noch) nicht
	// Hier wird die exakte Größe eines Feldes des Schachbretts berechnet. 10 weil ja die Koordinaten noch dazukommen.
	const currentFieldSize	= Math.round($( "#challengechessboard" ).width() / 10);
	const startmitte				= Math.round($( "#challengechessboard" ).width() / 20);

	const aidpath1 = document.createElementNS('http://www.w3.org/2000/svg','path');

	// In ZugStockfish stehen genau die beiden Feldnamen des anzuzeigenden Zugs
	const zugstockfish = getMoveStockfish(zug.CurMoveId);
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

	aidpath1.setAttribute("id", "aidpath_" + zug.CurMoveId)
	aidpath1.setAttribute("d", "M " + startfile + "," + startrank + " L " + stopfile + "," + stoprank);
	aidpath1.setAttribute("stroke-width", 6);
	//aidpath1.setAttribute("stroke", "black");
	aidpath1.setAttribute("marker-end", "url(#aidgoalarrow)");
	aidpath1.setAttribute("class", "svgcoloraid");

	//$('[data-square="' + zug.ZugVon + '"]').append(aidpath1);
  document.getElementById("svghilfe").appendChild(aidpath1); // ist damit ein sibling mit defs

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

// Die 5 ergibt sich aus der Reihenfolge der css-links im html-header 
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

// // Beim Start einer Variante wird der erste Zug der Variante (der ja auch gezogen wird) mit einem Pfeil gekennzeichnet
// function addAidClass(zugid) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

// 	// svg möchte Längenangaben vorrangig in Pixel haben. em, rem, ... sind auch erlaubt aber vh und vw (noch) nicht
// 	// Hier wird die exakte Größe eines Feldes des Schachbretts berechnet. 10 weil ja die Koordinaten noch dazukommen.
// 	const currentFieldSize	= Math.round($( "#challengechessboard" ).width() / 10);
// 	const startmitte				= Math.round($( "#challengechessboard" ).width() / 20);

// 	const aidpath1 = document.createElementNS('http://www.w3.org/2000/svg','path');

// 	// In ZugStockfish stehen genau die beiden Feldnames des anzuzeigenden Zugs
// 	const zugstockfish = getMoveStockfish(zugid);
// 	let pathdataparts = zugstockfish.split('');

// 	let startfile, startrank, stopfile, stoprank;

// 	// Das Brett wird ja immer für die Sichtweise des Spielers gedreht
// 	// Aus dem zugstockfish werden die exakten Längen in Pixel berechnet
// 	if(Challenge.AmZug == WEISSAMZUG) {
// 		startfile	= (FENFileFactor[pathdataparts[0]])			* currentFieldSize + startmitte;
// 		startrank	= (8 - parseInt(pathdataparts[1]) + 1)	* currentFieldSize + startmitte;
// 		stopfile	= (FENFileFactor[pathdataparts[2]])			* currentFieldSize + startmitte;
// 		stoprank	= (8 - parseInt(pathdataparts[3]) + 1)	* currentFieldSize + startmitte;	
// 	} else {
// 		startfile	= (8 - FENFileFactor[pathdataparts[0]] + 1)	* currentFieldSize + startmitte;
// 		startrank	= (parseInt(pathdataparts[1]) - 1 + 1)			* currentFieldSize + startmitte;
// 		stopfile	= (8 - FENFileFactor[pathdataparts[2]] + 1)	* currentFieldSize + startmitte;
// 		stoprank	= (parseInt(pathdataparts[3]) - 1 + 1)			* currentFieldSize + startmitte;
	
// 	}

// 	aidpath1.setAttribute("id", "aidpath_" + zugid)
// 	aidpath1.setAttribute("d", "M " + startfile + "," + startrank + " L " + stopfile + "," + stoprank);
// 	aidpath1.setAttribute("stroke-width", 5);
// 	aidpath1.setAttribute("marker-end", "url(#aidgoalarrow)");
// 	//aidpath1.setAttribute("class", "svgcoloraid");

//   document.getElementById("svghilfe").appendChild(aidpath1); // ist damit ein sibling mit defs

// }

// // Die 5 ergibt sich aus der Reihenfolge der css-links im html-header 
// // Das styleSheet-Objekt unterstützt nur den Zugriff durch den Index
// function addAidAnimationStyle(boarddirection, stockfishmove) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

// 	let cssRulesList = document.styleSheets[5].cssRules;
// 	//let cssRulesList2 = $(document.styleSheets[5].cssRules).attr( "selectorText" );
// 	//let cssRulesListlength = $(document.styleSheets[5].cssRules).attr( "selectorText" ).length;

// 	let ruleindex = 0;
// 	for (i=0; i<cssRulesList.length; i++) {
// 		if(cssRulesList[i].selectorText != null) {
// 			if(cssRulesList[i].selectorText.startsWith('.svgaid')) {
// 				document.styleSheets[5].deleteRule(i);
// 				ruleindex = i;
// 				break;
// 			}  
// 		}
// 	} 

// 	let AC = computeMoveAnimationCorner(boarddirection, stockfishmove);

// 	let animationpath = "M " + AC.fieldcenter + "," + AC.fieldcenter + " l " + AC.stopfile + "," + AC.stoprank;
// 	document.styleSheets[5].insertRule(".svgaid_" + stockfishmove +  "{ offset-path: path('" + animationpath + "'); offset-rotate: 0deg; offset-anchor: center; animation: moveDiv " + ANIMATIONSPEED_SLOW + "s 1 forwards; }", ruleindex);

// }
