// Neue Zeile mit den Stellungsdaten in der Notationsliste anlegen
// TreeContainer: der tagname des html-elements
// Mode: alle MOVEMODE_... berücksichtigen
// Situation: die Import- bzw Stellungsdaten. Nur CurNodeId wird geändert, Rest bleibt
function NewTreeNode(TreeContainer, Mode, Situation, Zug, TooltipFlag, jumpToFlag) {

	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	removeNotationMarker(TreeContainer);

	let Postfix = Zug.ZugFarbe == WEISSAMZUG ? WHITEPOSTFIX : BLACKPOSTFIX;

	jumpTo = ''; // Diese Funktion wird erst mal einfach komplett ignoriert:
	//let jumpTo =" onclick='jumpToPosition(\"" + Situation.FEN + Postfix + "\");'";

	let tooltip = '';
	if(TooltipFlag) {
		let Id_Tooltip = Situation.CurMoveId.replace(MOVEPRÄFIX, TOOLTIPPRÄFIX) + Postfix;
		let TooltipFEN = Situation.FEN;
		ErzeugeTooltip(TooltipFEN, MiniBoardArray, Id_Tooltip, Challenge.AmZug);
		tooltip = " onmouseover='XBT(this, {id:\"" + Id_Tooltip + "\", x: -150});'";
	}

	//let ZugNummerFarbe = Zug.ZugLevel == 0 ? 'main' : Situation.VarianteColor % 2 == 0 ? 'even' : 'odd';
	htmlText_Zugnr = "<span class='movenumber " + getVarianteLevelColorClass(Situation, Zug.CurMoveId
		) + "'>" + Zug.ZugNummer + "</span>";

	let htmlKommentar = "";
	if (Zug.Hinweistext != "") {
		htmlKommentar = '<div class="Comment' + Postfix + '">' + Zug.Hinweistext + '</div>';
	}

	if (Mode == MOVEMODE_VARIANTE_MAINVISIBLE) {
		// In T_Zuege steht die Farbe des verursachenden Zugs. Hier wird das Zeichen zum Zug eingetragen!
		if (Zug.ZugFarbe == WEISSAMZUG) {
			htmlNodeText_b = "<span class='moveblack' id='" + Situation.CurMoveId + BLACKPOSTFIX + "'>" + Situation.Text_b + "</span>";
			htmlNodeText_w = "<span class='movewhite variantezeiger' id='" +
				Zug.CurMoveId + WHITEPOSTFIX +
				"'>" + VARIANTEZEIGER + Situation.Text_w + "</span>";
		} else {
			htmlNodeText_w = "<span class='movewhite' id='" + Situation.CurMoveId + WHITEPOSTFIX + "'>" + Situation.Text_w + "</span>";
			htmlNodeText_b = "<span class='moveblack variantezeiger' id='" +
				Zug.CurMoveId + BLACKPOSTFIX +
				"'>" + VARIANTEZEIGER + Situation.Text_b + "</span>";
		}
	} else if (Mode == MOVEMODE_VARIANTE_MAINHIDDEN) {
		// In T_Zuege steht die Farbe des verursachenden Zugs. Hier wird das Zeichen zum Zug eingetragen!
		if (Zug.ZugFarbe == WEISSAMZUG) {
			htmlNodeText_b = "<span class='moveblack' id='" + Situation.CurMoveId + BLACKPOSTFIX + "'>" + Situation.Text_b + "</span>";
			htmlNodeText_w = "<span class='movewhite variantezeiger' id='" +
				Zug.CurMoveId + WHITEPOSTFIX +
				"'>" + VARIANTEZEIGER + DEFAULTMOVE_W + "</span>";
		} else {
			htmlNodeText_w = "<span class='movewhite' id='" + Situation.CurMoveId + WHITEPOSTFIX + "'>" + Situation.Text_w + "</span>";
			htmlNodeText_b = "<span class='moveblack variantezeiger' id='" +
				Zug.CurMoveId + BLACKPOSTFIX +
				"'>" + VARIANTEZEIGER + DEFAULTMOVE_B + "</span>";
		}
	} else if (Mode == MOVEMODE_MOVE) {
		if (Zug.ZugFarbe == WEISSAMZUG) {
			htmlNodeText_w = "<span class='movewhite currentmovemarker' id='" + Situation.CurMoveId + WHITEPOSTFIX + "' " +
				tooltip + jumpTo +">" + Situation.Text_w + "</span>";
			htmlNodeText_b = "<span class='moveblack' id='" + Situation.CurMoveId + BLACKPOSTFIX + "'>" + Situation.Text_b + "</span>";
		} else {
			htmlNodeText_b = "<span class='moveblack currentmovemarker' id='" + Situation.CurMoveId + BLACKPOSTFIX + "' " +
				tooltip + jumpTo + ">" + Situation.Text_b + "</span>";
			htmlNodeText_w = "<span class='movewhite' id='" + Situation.CurMoveId + WHITEPOSTFIX + "'>" + Situation.Text_w + "</span>";
		}
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

// Ein Knoten kann nur einen Text enthalten. Also den Knoten holen, die schon vorhandenen Daten
// merken und durch die neuen Teile ergänzen und dann komplett wegschreiben
// Änderungen gibt es nur am Knotentext, sonst nirgendwo.
function UpdateTreeNode(TreeContainer, Mode, Situation, Zug, TooltipFlag, jumpToFlag) {

	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	removeNotationMarker(TreeContainer);

	let Postfix = Zug.ZugFarbe == WEISSAMZUG ? WHITEPOSTFIX : BLACKPOSTFIX;

	jumpTo = ''; // Diese Funktion wird erst mal einfach komplett ignoriert:
	//let jumpTo =" onclick='jumpToPosition(\"" + Situation.FEN + Postfix + "\");'";

	let tooltip = '';
	if (TooltipFlag) {
		Id_Tooltip = Situation.CurMoveId.replace(MOVEPRÄFIX, TOOLTIPPRÄFIX) + Postfix;
		let TooltipFEN = Situation.FEN;
		ErzeugeTooltip(TooltipFEN, MiniBoardArray, Id_Tooltip, Challenge.AmZug);
		tooltip = " onmouseover='XBT(this, {id:\"" + Id_Tooltip + "\", x: -150});'";
	}

	// Den aktuellen Knoten holen, damit die schon ausgefüllten Teile übernommen werden können
	let changenode = $('#' + TreeContainer).jstree(true).get_node(Situation.CurNodeId);

	Nodetext.innerHTML = changenode.text;
	let NodeElements = Nodetext.getElementsByTagName("*");

	htmlText_Zugnr = NodeElements[1].outerHTML;

	let SchonDaKommentar = NodeElements.length == 5 ? NodeElements[4].outerHTML : "";
	let NeuKommentar = Zug.Hinweistext != "" ? '<div class="Comment' + Postfix + '">' + Zug.Hinweistext + '</div>' : "";

	if (Mode == MOVEMODE_DEFAULT) {
		// Stimmt nicht mehr: In T_Zuege steht die Farbe des verursachenden Zugs. Das Zeichen also bei der anderen Farbe eintragen.
		if (Zug.ZugFarbe == WEISSAMZUG) {
			htmlNodeText_b = NodeElements[3].outerHTML;
			htmlNodeText_w = "<span class='movewhite' id='" + Zug.CurMoveId + WHITEPOSTFIX + "'>" + DEFAULTMOVE_W + "</span>";
		} else {
			htmlNodeText_w = NodeElements[2].outerHTML;
			htmlNodeText_b = "<span class='moveblack' id='" + Zug.CurMoveId + BLACKPOSTFIX + "'>" + DEFAULTMOVE_B + "</span>";
		}
	} else if (Mode == MOVEMODE_VARIANTE_MAINVISIBLE) {
		// Stimmt nicht mehr: In T_Zuege steht die Farbe des verursachenden Zugs. Das Zeichen also bei der anderen Farbe eintragen.
		if (Zug.ZugFarbe == WEISSAMZUG) {
			htmlNodeText_b = NodeElements[3].outerHTML;
			htmlNodeText_w = "<span class='movewhite variantezeiger' id='" + Zug.CurMoveId + WHITEPOSTFIX + "'>" + VARIANTEZEIGER + Zug.ZugKurz + "</span>";
		} else {
			htmlNodeText_w = NodeElements[2].outerHTML;
			htmlNodeText_b = "<span class='moveblack variantezeiger' id='" + Zug.CurMoveId + BLACKPOSTFIX + "'>" + VARIANTEZEIGER + Zug.ZugKurz + "</span>";
		}
		// Das Zeichen soll einfach an den zur Zugfarbe passenden Text angehängt werden
		// Grund: Das Signal wird in einer eigenen Antwort der Engine zurückgegeben
	} else if (Mode == MOVEMODE_MATTSIGN) {
		htmlNodeText_w = NodeElements[2].outerHTML;
		htmlNodeText_b = NodeElements[3].outerHTML;
		if (Zug.ZugFarbe == WEISSAMZUG) {
			htmlNodeText_w = htmlNodeText_w.replace("</span>", MATT + "</span>");
		} else {
			htmlNodeText_b = htmlNodeText_b.replace("</span>", MATT + "</span>");
		}
	} else if (Mode == MOVEMODE_MOVE) {
		if (Zug.ZugFarbe == WEISSAMZUG) {
			htmlNodeText_w = "<span class='movewhite currentmovemarker' id='" + Zug.CurMoveId + WHITEPOSTFIX + "' " +
				tooltip + jumpTo + ">" + Situation.Text_w + "</span>";
			htmlNodeText_b = NodeElements[3].outerHTML;
		} else {
			htmlNodeText_b = "<span class='moveblack currentmovemarker' id='" + Zug.CurMoveId + BLACKPOSTFIX + "' " +
				tooltip + jumpTo + ">" + Situation.Text_b + "</span>";
			htmlNodeText_w = NodeElements[2].outerHTML;
		}
	}

	let changetext = "<div>" + htmlText_Zugnr + htmlNodeText_w + htmlNodeText_b + SchonDaKommentar + NeuKommentar + "</div>";
	$('#' + TreeContainer).jstree().rename_node(changenode, changetext);

}

// Den aktuellen Knoten holen und wenn der Zug noch nicht enthalten ist, diesen eintragen
function UpdateTreeNodeName(TreeContainer, Situation, Zug) {

		let changenode = $('#' + TreeContainer).jstree(true).get_node(Situation.CurNodeId);

		if(changenode.text.indexOf(Zug.ZugKurz) == -1) {
			let changetext = changenode.text.replace('&#9759;&nbsp;', '&#9759;&nbsp;' + Zug.ZugKurz);
			$('#' + TreeContainer).jstree().rename_node(changenode, changetext);
		}
}

function NotiereZug(TreeContainer, Stellung, objZug, movemode) {

	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

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
function removeNotationMarker(TreeContainer) {

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

function addNotationMarker(TreeContainer, Farbe, KnotenId) {

	let changenode = $('#' + TreeContainer).jstree(true).get_node(KnotenId);
	let changetext = "";

	if (Farbe == WEISSAMZUG) {
		changetext = changenode.text.replace('movewhite', 'movewhite currentmovemarker');
	} else {
		changetext = changenode.text.replace('moveblack', 'moveblack currentmovemarker');
	}

	$('#' + TreeContainer).jstree().rename_node(changenode, changetext);
}