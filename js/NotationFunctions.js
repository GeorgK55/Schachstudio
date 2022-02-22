// Neue Zeile mit den Stellungsdaten in der Notationsliste anlegen
function NewTreeNode(TreeContainer, Mode, Situation, Zug, TooltipFlag) {

    var Id_Tooltip;
    var Id_Postfix;
    var Classname_Comment;
    var NewTreeNodeId;

    if(Zug.ZugFarbe == WEISSAMZUG) {
        Id_Postfix          = 'w';
        Classname_Comment   = 'Comment_w';
    } else {
        Id_Postfix          = 's';
        Classname_Comment   = 'Comment_b';
        Situation.CreateNewNode = true; 
    }

    Id_Tooltip          = Situation.CurMoveId.replace(MovePräfix, TooltipPräfix) + Id_Postfix;
    Situation.CurNodeId = Situation.CurMoveId.replace(MovePräfix, NodePräfix);

    var ZugNummerFarbe = Situation.ZugLevel == 0 ? 'main' : VariationsLevelCounter[Situation.ZugLevel] % 2 == 0 ? 'even' : 'odd';
    htmlText_Zugnr  = "<span class='movenumber" + ZugNummerFarbe + "'>" + Situation.ZugNummer + "</span>";

    var htmlKommentar = "";
    if(Zug.Hinweistext != "") {
        htmlKommentar = '<div class="' + Classname_Comment + '">' + Zug.Hinweistext + '</div>';
     } 

    if (Mode == 'sign') { 
        // In T_Zuege steht die Farbe des verursachenden Zugs. Hier wird das Zeichen zum Zug eingetragen!
        if (Zug.ZugFarbe == WEISSAMZUG) {
            htmlNodeText_b  = "<span class='moveblack' id='" + Situation.CurMoveId + BlackPostfix + "'>" + Situation.Text_b + "</span>"; 
            htmlNodeText_w  = "<span class='movewhite variantezeiger' id='" 
                            + Zug.CurMoveId + WhitePostfix 
                            + "'>" + VarianteZeiger + "</span>";
         } else {
            htmlNodeText_w  = "<span class='movewhite' id='" + Situation.CurMoveId + WhitePostfix + "'>" + Situation.Text_w + "</span>"; 
            htmlNodeText_b  = "<span class='moveblack variantezeiger' id='" 
                            + Zug.CurMoveId + BlackPostfix 
                            + "'>" + VarianteZeiger + "</span>";
        }
    } else if (Mode == 'move') {
        if(Zug.ZugFarbe == WEISSAMZUG) {
            htmlNodeText_w  = "<span class='movewhite' id='" + Situation.CurMoveId + WhitePostfix
                            + "' data-fen='" + Situation.FEN_w 
                            + "' onmouseover='XBT(this, {id:\"" + Id_Tooltip + "\", x: -150});"
                            + "' onclick='jumpToPosition(\"" + Stellungsdaten.FEN_w + "\");'>" 
                            + Situation.Text_w + "</span>";
            htmlNodeText_b  = "<span class='moveblack' id='" + Situation.CurMoveId + BlackPostfix 
                            + "' data-fen='" 
                            //+ "' onmouseover='XBT(this, {id:\"\", x: -150});"
                            + "' onclick='jumpToPosition();'>" 
                            + Situation.Text_b + "</span>";
        } else {
            htmlNodeText_w  = "<span class='movewhite' id='" + Situation.CurMoveId + WhitePostfix
                            + "' data-fen='"
                            //+ "' onmouseover='XBT(this, {id:\"\", x: -150});"
                            + "' onclick='jumpToPosition(\"\");'>" 
                            + Situation.Text_w + "</span>";
            htmlNodeText_b  = "<span class='moveblack' id='" + Situation.CurMoveId + BlackPostfix 
                            + "' data-fen='" + Situation.FEN_b 
                            + "' onmouseover='XBT(this, {id:\"" + Id_Tooltip + "\", x: -150});"
                            + "' onclick='jumpToPosition(\"" + Stellungsdaten.FEN_b + "\");'>" 
                            + Situation.Text_b + "</span>";
        }
    }

    var TooltipFEN = Zug.ZugFarbe == WEISSAMZUG ? Situation.FEN_w : Situation.FEN_b;
    if(TooltipFlag) ErzeugeTooltip(TooltipFEN, MiniBoardArray, Id_Tooltip);

    NewNodeId = $('#' + TreeContainer).jstree().create_node(Situation.PreNodeId, {
        "id": Situation.CurNodeId,
        "text": "<div>" + htmlText_Zugnr + htmlNodeText_w + htmlNodeText_b + htmlKommentar + "</div>"
    }, "last", function() {
        $('#' + TreeContainer).jstree().open_node(Situation.PreNodeId);  
    });
}

// Ein Knoten kann nur einen Text enthalten. Also den Knoten holen,
// die schon vorhendenen Daten merken und durch die neuen Teile ergänzen und dann komplett wegschreiben
function UpdateTreeNode(TreeContainer, Mode, Situation, Zug, TooltipFlag) {

    var Id_Tooltip;
    var Id_Postfix;
    var Classname_Comment;

    if(Zug.ZugFarbe == WEISSAMZUG) {
        Id_Postfix = 'w';
        Classname_Comment = 'Comment_w';
    } else {
        Id_Postfix = 's';
        Classname_Comment = 'Comment_b';
    }
    
    Id_Tooltip = Situation.CurMoveId.replace('M_', 'T_') + '_' + Id_Postfix;

    var TooltipFEN = Zug.ZugFarbe == WEISSAMZUG ? Situation.FEN_w : Situation.FEN_b;
    if(TooltipFlag) ErzeugeTooltip(TooltipFEN, MiniBoardArray, Id_Tooltip);

    // Den aktuellen Knoten holen, damit die schon ausgefüllten Teile übernommen werden können
    var changenode = $('#' + TreeContainer).jstree(true).get_node(Situation.CurNodeId); 

    Nodetext.innerHTML = changenode.text;
    var NodeElements = Nodetext.getElementsByTagName("*"); 

    htmlText_Zugnr  = NodeElements[1].outerHTML;

    var SchonDaKommentar    = NodeElements.length == 5  ? NodeElements[4].outerHTML :  "";
    var NeuKommentar        = Zug.Hinweistext != "" ? '<div class="' + Classname_Comment + '">' + Zug.Hinweistext + '</div>' : "";

    if (Mode == 'sign') {
        // Stimmt nicht mehr: In T_Zuege steht die Farbe des verursachenden Zugs. Das Zeichen also bei der anderen Farbe eintragen.
        if (Zug.ZugFarbe == WEISSAMZUG) {
            htmlNodeText_b  = NodeElements[3].outerHTML;
            htmlNodeText_w  = "<span class='movewhite variantezeiger' id='" 
                            + Zug.CurMoveId + WhitePostfix 
                            + "'>" + VarianteZeiger + "</span>";
         } else {
            htmlNodeText_w  = NodeElements[2].outerHTML;
            htmlNodeText_b  = "<span class='moveblack variantezeiger' id='" 
                            + Zug.CurMoveId + BlackPostfix 
                            + "'>" + VarianteZeiger + "</span>";
        }
    } else if (Mode == 'move') {
        if (Zug.ZugFarbe == WEISSAMZUG) {
            htmlNodeText_w  = "<span class='movewhite' id='" 
                            + Zug.CurMoveId + WhitePostfix 
                            + "' data-fen='" + Situation.FEN_w
                            + "' onclick='jumpToPosition(\"" + Situation.FEN_w + "\");"
                            + "' onmouseover='XBT(this, {id:\"" + Id_Tooltip + "\", x: -150});'>"
                             + Situation.Text_w + "</span>";
            htmlNodeText_b  = NodeElements[3].outerHTML;
        } else {
            htmlNodeText_b  = "<span class='moveblack' id='" 
                            + Zug.CurMoveId + BlackPostfix 
                            + "' data-fen='" + Situation.FEN_b 
                            + "' onclick='jumpToPosition(\"" + Situation.FEN_b + "\");>" 
                            + "' onmouseover='XBT(this, {id:\"" + Id_Tooltip + "\", x: -150});'>"
                            + Situation.Text_b + "</span>";
            htmlNodeText_w  = NodeElements[2].outerHTML;
        }
    }

    var changetext = "<div>" + htmlText_Zugnr + htmlNodeText_w + htmlNodeText_b + SchonDaKommentar + NeuKommentar + "</div>";
    $('#' + TreeContainer).jstree().rename_node(changenode, changetext);

}

function NotiereZug(TreeContainer, objZug) {

    // Wenn eine neue Zeile in der Notationsliste nötig ist, wird diese hier mit den Stellungsdaten generiert
    // Sonst wird die Notationszeile aktualisiert
    if (objZug.ZugFarbe == WEISSAMZUG || Stellungsdaten.CreateNewNode) {
        NewTreeNode(TreeContainer, 'move', Stellungsdaten, objZug, true);
        Stellungsdaten.CreateNewNode = false;
    } else {
        UpdateTreeNode(TreeContainer, 'move', Stellungsdaten, objZug, true);
    }
}
