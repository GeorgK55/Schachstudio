// Neue Zeile mit den Stellungsdaten in der Notationsliste anlegen
// TreeContainer: der tagname des html-elements
// Presentation: alle MOVEPRESENTATION_... berücksichtigen
// Situation: die Stellungsdaten. Nur CurNodeId wird geändert, Rest bleibt
function NewTreeNode(TreeContainer, Presentation, Situation, Zug, TooltipFlag, jumpToFlag) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	removeNotationMarker(TreeContainer);


	jumpTo = ''; // Diese Funktion wird erst mal einfach komplett ignoriert:
	//let jumpTo =" onclick='jumpToPosition(\"" + Situation.FEN + Postfix + "\");'";

	let tooltip = '';
	if(TooltipFlag) {
		let Postfix = Zug.ZugFarbe == WEISSAMZUG ? WHITEPOSTFIX : BLACKPOSTFIX;
		let Id_Tooltip = Situation.CurMoveId.replace(MOVEPRÄFIX, TOOLTIPPRÄFIX) + Postfix;
		let TooltipFEN = Situation.FEN;
		ErzeugeTooltip(TooltipFEN, Id_Tooltip, Challenge.AmZug);
		tooltip = " onmouseover='XBT(this, {id:\"" + Id_Tooltip + "\", x: -150});'";
	}

	let htmlText_Zugnr = "<span class='movenumber' style='background-color: " + getVarianteLevelColorVar(Situation, Zug.ZugLevel) + "'>" + Zug.ZugNummer + "</span>";

	let htmlKommentar = "";

	switch(Presentation) {
		case MOVEPRESENTATION_VARIANTE_MAINVISIBLE:	// Variantezeiger, Zug und Kommentar eintragen
			if (Zug.ZugFarbe == WEISSAMZUG) {
				htmlNodeText_b = "<span class='moveblack' id='" + Situation.CurMoveId + BLACKPOSTFIX + "'>" + Situation.Text_b + "</span>";
				htmlNodeText_w = "<span class='movewhite variantezeiger' id='" + Zug.CurMoveId + WHITEPOSTFIX + "'>" + VARIANTEZEIGER + Situation.Text_w + "</span>";
				if (Zug.Hinweistext != "") { htmlKommentar = '<div class="Comment' + WHITEPOSTFIX + '" id="C_' + Situation.CurMoveId + WHITEPOSTFIX + '">' + Zug.Hinweistext + '</div>'; }
		} else {
				htmlNodeText_w = "<span class='movewhite' id='" + Situation.CurMoveId + WHITEPOSTFIX + "'>" + Situation.Text_w + "</span>";
				htmlNodeText_b = "<span class='moveblack variantezeiger' id='" + Zug.CurMoveId + BLACKPOSTFIX + "'>" + VARIANTEZEIGER + Situation.Text_b + "</span>";
				if (Zug.Hinweistext != "") { htmlKommentar = '<div class="Comment' + BLACKPOSTFIX + '" id="C_' + Situation.CurMoveId + BLACKPOSTFIX + '">' + Zug.Hinweistext + '</div>'; }
				}
			break;
		case MOVEPRESENTATION_VARIANTE_MAINHIDDEN:	// Variantezeiger, Zugdefault und Kommentar verborgen eintragen
			if (Zug.ZugFarbe == WEISSAMZUG) {
				htmlNodeText_b = "<span class='moveblack' id='" + Situation.CurMoveId + BLACKPOSTFIX + "'>" + Situation.Text_b + "</span>";
				htmlNodeText_w = "<span class='movewhite variantezeiger' id='" + Zug.CurMoveId + WHITEPOSTFIX + "'>" + VARIANTEZEIGER + DEFAULTMOVE_W + "</span>";
				if (Zug.Hinweistext != "") { htmlKommentar = '<div class="Comment' + WHITEPOSTFIX + ' hideMe" id="C_' + Situation.CurMoveId + WHITEPOSTFIX + '">' + Zug.Hinweistext + '</div>'; }
			} else {
				htmlNodeText_w = "<span class='movewhite' id='" + Situation.CurMoveId + WHITEPOSTFIX + "'>" + Situation.Text_w + "</span>";
				htmlNodeText_b = "<span class='moveblack variantezeiger' id='" + Zug.CurMoveId + BLACKPOSTFIX + "'>" + VARIANTEZEIGER + DEFAULTMOVE_B + "</span>";
				if (Zug.Hinweistext != "") { htmlKommentar = '<div class="Comment' + BLACKPOSTFIX + ' hideMe" id="C_' + Situation.CurMoveId + BLACKPOSTFIX + '">' + Zug.Hinweistext + '</div>'; }
			}
			break;
		case MOVEPRESENTATION_MOVE:
			if (Zug.ZugFarbe == WEISSAMZUG) {
				htmlNodeText_w = "<span class='movewhite currentmovemarker' id='" + Situation.CurMoveId + WHITEPOSTFIX + "' " + tooltip + jumpTo +">" + Situation.Text_w + "</span>";
				htmlNodeText_b = "<span class='moveblack' id='" + Situation.CurMoveId + BLACKPOSTFIX + "'>" + Situation.Text_b + "</span>";
				if (Zug.Hinweistext != "") { htmlKommentar = '<div class="Comment' + WHITEPOSTFIX + '" id="C_' + Situation.CurMoveId + WHITEPOSTFIX + '">' + Zug.Hinweistext + '</div>'; }
			} else {
				htmlNodeText_b = "<span class='moveblack currentmovemarker' id='" + Situation.CurMoveId + BLACKPOSTFIX + "' " + tooltip + jumpTo + ">" + Situation.Text_b + "</span>";
				htmlNodeText_w = "<span class='movewhite' id='" + Situation.CurMoveId + WHITEPOSTFIX + "'>" + Situation.Text_w + "</span>";
				if (Zug.Hinweistext != "") { htmlKommentar = '<div class="Comment' + BLACKPOSTFIX + '" id="C_' + Situation.CurMoveId + BLACKPOSTFIX + '">' + Zug.Hinweistext + '</div>'; }
			}
			break;
	}

	// Der Name für den neuen Knoten wird aus dem Zugname abgeleitet
	Situation.CurNodeId = Situation.CurMoveId.replace(MOVEPRÄFIX, NODEPRÄFIX);

	// Jetzt wird der Knoten erzeugt
	NewNodeId = $('#' + TreeContainer).jstree().create_node(Situation.PreNodeId, {
		"id": Situation.CurNodeId,
		"text": "<div>" + htmlText_Zugnr + htmlNodeText_w + htmlNodeText_b + htmlKommentar + "</div>"
	}, "last", function () {
		$('#' + TreeContainer).jstree().open_node(Situation.PreNodeId);
	});
	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('NewNodeId: ' + NewNodeId);

	if (Zug.ZugFarbe == SCHWARZAMZUG) Situation.CreateNewNode = true;

}

// Ein Knoten kann nur einen Texttag enthalten. Also den Knoten holen, die schon vorhandenen Daten
// aufteilen und durch die neuen Teile ergänzen und dann wieder konkatnieren und wegschreiben
// Änderungen gibt es nur am Knotentext, sonst nirgendwo.
function UpdateTreeNode(TreeContainer, Presentation, Situation, Zug, TooltipFlag, jumpToFlag) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	removeNotationMarker(TreeContainer);


	jumpTo = ''; // Diese Funktion wird erst mal einfach komplett ignoriert:
	//let jumpTo =" onclick='jumpToPosition(\"" + Situation.FEN + Postfix + "\");'";

	let tooltip = '';
	if (TooltipFlag) {
		let Postfix = Zug.ZugFarbe == WEISSAMZUG ? WHITEPOSTFIX : BLACKPOSTFIX;
		Id_Tooltip = Situation.CurMoveId.replace(MOVEPRÄFIX, TOOLTIPPRÄFIX) + Postfix;
		let TooltipFEN = Situation.FEN;
		ErzeugeTooltip(TooltipFEN, Id_Tooltip, Challenge.AmZug);
		tooltip = ' onmouseover="XBT(this, {id:\'' + Id_Tooltip + '\', x: -150});\"';
	}

	// Den aktuellen Knoten holen, damit die schon ausgefüllten Teile übernommen werden können
	let changenode = $('#' + TreeContainer).jstree(true).get_node(Situation.CurNodeId);

	// In einen htmltag stecken, damit der Zugriff einfacher wird
	document.getElementById("nodetext").innerHTML = changenode.text;

	let htmlText_Zugnr 		= document.getElementById("nodetext").querySelector(".movenumber").outerHTML;
	let htmlText_MoveW		= document.getElementById("nodetext").querySelector(".movewhite").outerHTML;
	let htmlText_MoveB 		= document.getElementById("nodetext").querySelector(".moveblack").outerHTML;
	let htmlText_CommentW = document.getElementById("nodetext").querySelector(".Comment" + WHITEPOSTFIX) != null ? document.getElementById("nodetext").querySelector(".Comment" + WHITEPOSTFIX).outerHTML : "";
	let htmlText_CommentB = document.getElementById("nodetext").querySelector(".Comment" + BLACKPOSTFIX) != null ? document.getElementById("nodetext").querySelector(".Comment" + BLACKPOSTFIX).outerHTML : "";

	switch(Presentation) {
		case MOVEPRESENTATION_VARIANTE_MAINHIDDEN: // Variantezeiger und Kommentaar versteckt
			if (Zug.ZugFarbe == WEISSAMZUG) {
				htmlText_MoveW		= "<span class='movewhite variantezeiger' id='" + Zug.CurMoveId + WHITEPOSTFIX + "'>" + VARIANTEZEIGER + "</span>";
				htmlText_CommentW = Zug.Hinweistext != "" ? '<div class="Comment' + WHITEPOSTFIX + ' hideMe" id="C_' + Situation.CurMoveId + WHITEPOSTFIX + '">' + Zug.Hinweistext + '</div>' : "";
			} else {
				htmlText_MoveB		= "<span class='moveblack variantezeiger' id='" + Zug.CurMoveId + BLACKPOSTFIX + "'>" + VARIANTEZEIGER + "</span>";
				htmlText_CommentB	= Zug.Hinweistext != "" ? '<div class="Comment' + BLACKPOSTFIX + ' hideMe" id="C_' + Situation.CurMoveId + BLACKPOSTFIX + '">' + Zug.Hinweistext + '</div>' : "";
			}
			break;
		case MOVEPRESENTATION_VARIANTE_MAINVISIBLE:	// Variantezeiger und Kommentar anzeigen
			if (Zug.ZugFarbe == WEISSAMZUG) {
				htmlText_MoveW		= "<span class='movewhite variantezeiger' id='" + Zug.CurMoveId + WHITEPOSTFIX + "'>" + VARIANTEZEIGER + Zug.ZugKurz + "</span>";
				htmlText_CommentW	= Zug.Hinweistext != "" ? '<div class="Comment' + WHITEPOSTFIX + '" id="C_' + Situation.CurMoveId + WHITEPOSTFIX + '">' + Zug.Hinweistext + '</div>' : "";
			} else {
				htmlText_MoveB		= "<span class='moveblack variantezeiger' id='" + Zug.CurMoveId + BLACKPOSTFIX + "'>" + VARIANTEZEIGER + Zug.ZugKurz + "</span>";
				htmlText_CommentB	= Zug.Hinweistext != "" ? '<div class="Comment' + BLACKPOSTFIX + '" id="C_' + Situation.CurMoveId + BLACKPOSTFIX + '">' + Zug.Hinweistext + '</div>' : "";
				}
			break;
		case MOVEPRESENTATION_MATTSIGN:
			// Das Zeichen soll einfach an den zur Zugfarbe passenden Text angehängt werden
			// Grund: Das Signal wird in einer eigenen Antwort der Engine zurückgegeben
			if (Zug.ZugFarbe == WEISSAMZUG) {
				htmlText_MoveW		= htmlText_MoveW.replace("</span>", MATT + "</span>");
				htmlText_CommentW	= Zug.Hinweistext != "" ? '<div class="Comment' + WHITEPOSTFIX + '" id="C_' + Situation.CurMoveId + WHITEPOSTFIX + '">' + Zug.Hinweistext + '</div>' : "";
			} else {
				htmlText_MoveB		= htmlText_MoveB.replace("</span>", MATT + "</span>");
				htmlText_CommentB	= Zug.Hinweistext != "" ? '<div class="Comment' + Postfix + '" id="C_' + Situation.CurMoveId + BLACKPOSTFIX + '">' + Zug.Hinweistext + '</div>' : "";
			}
			break;
		case MOVEPRESENTATION_MOVE:	// Zug, Tooltip und Kommentar einfach komplett anzeigen
			if (Zug.ZugFarbe == WEISSAMZUG) {
				htmlText_MoveW = "<span class='movewhite currentmovemarker' id='" + Zug.CurMoveId + WHITEPOSTFIX + "' " +	tooltip + jumpTo + ">" + Situation.Text_w + "</span>";
				htmlText_CommentW = Zug.Hinweistext != "" ? '<div class="Comment' + WHITEPOSTFIX + '" id="C_' + Situation.CurMoveId + WHITEPOSTFIX + '">' + Zug.Hinweistext + '</div>' : "";
			} else {
				htmlText_MoveB = "<span class='moveblack currentmovemarker' id='" + Zug.CurMoveId + BLACKPOSTFIX + "' " +	tooltip + jumpTo + ">" + Situation.Text_b + "</span>";
				htmlText_CommentB = Zug.Hinweistext != "" ? '<div class="Comment' + BLACKPOSTFIX + '" id="C_' + Situation.CurMoveId + BLACKPOSTFIX + '">' + Zug.Hinweistext + '</div>' : "";
			}
			break;
		default:
			break;
	}

	// Die Teile konkatenieren und dann in dem Baum zurückschreiben
	let changetext = "<div>" + htmlText_Zugnr + htmlText_MoveW + htmlText_MoveB + htmlText_CommentW + htmlText_CommentB + "</div>";
	$('#' + TreeContainer).jstree().rename_node(changenode, changetext);

}

// Den aktuellen Knoten holen und wenn der Zug noch nicht enthalten ist, diesen eintragen
function UpdateTreeNodeName(TreeContainer, Situation, Zug) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

		let changenode = $('#' + TreeContainer).jstree(true).get_node(Situation.CurNodeId);

		if(changenode.text.indexOf(Zug.ZugKurz) == -1) {
			let changetext = changenode.text.replace('&#9759;&nbsp;', '&#9759;&nbsp;' + Zug.ZugKurz);
			$('#' + TreeContainer).jstree().rename_node(changenode, changetext);
		}
}

function NotiereZug(TreeContainer, Stellung, objZug, movemode) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	// Wenn eine neue Zeile in der Notationsliste nötig ist, wird diese hier mit den Stellungsdaten generiert
	// Sonst wird die Notationszeile aktualisiert
	if (objZug.MoveNode === null && (objZug.ZugFarbe == WEISSAMZUG || Stellung.CreateNewNode)) {
		NewTreeNode(TreeContainer, movemode, Stellung, objZug, true, true);
		Stellung.CreateNewNode = false;
	} else {
		UpdateTreeNode(TreeContainer, movemode, Stellung, objZug, true, true);
	}
}

// Ein NotationMarker (Diamantsymbol) steht immer einmalig irgendwo im Text (=Name) eines Knotens im jsTree
// Das Zeichen wird durch die Pseudoklasse ::after von currentmovemarker erzeugt.
// Hier wird einfach die Klasse aus dem Name des Knotens entfernt
function removeNotationMarker(TreeContainer) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	let nodesarray = $('#' + TreeContainer).jstree(true).get_json('#', { flat: true })

	nodesarray.forEach(function (item, idx) {
		if (item.text.includes("currentmovemarker")) {
			if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log(item.id);

			let changenode = $('#' + TreeContainer).jstree(true).get_node(item.id);

			let changetext = changenode.text.replace(' currentmovemarker', '');
			$('#' + TreeContainer).jstree().rename_node(changenode, changetext);

		}
	});

}

function addNotationMarker(TreeContainer, Farbe, KnotenId) {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_FUNCTIONBEGINN)) console.log('Beginn in ' + getFuncName());

	let changenode = $('#' + TreeContainer).jstree(true).get_node(KnotenId);
	let changetext = "";

	if (Farbe == WEISSAMZUG) {
		changetext = changenode.text.replace('movewhite', 'movewhite currentmovemarker');
	} else {
		changetext = changenode.text.replace('moveblack', 'moveblack currentmovemarker');
	}

	$('#' + TreeContainer).jstree().rename_node(changenode, changetext);
}