function PlayChallengeVarianten() { 

    console.log('PlayChallengeVarianten'); // Anfang

    ExpectedPlayerMove  = $.grep(ChallengeMoves, function(PMI, i) { return PMI['PreMoveId'] == SituationsDaten.CurMoveId; })[0];
 
    // Auslöser war ja ein manueller Zug auf dem Brett. Die stehen immer in T_Zuege
    // Hier erst mal eine vereinfachte Interpretation der Variantenanalyse: 
    // ein Zug, der nicht vorgesehen ist, ist falsch
    // da alle erlaubten Züge schon in der Datenbank stehen und damit verifiziert sind, wird die Engine gar nicht benötigt
    // der Vergleich in der stockfish-Syntax ist besonders einfach 
    if (T_Zuege.ZugStockfish != ExpectedPlayerMove.ZugStockfish) { // wirkt wie return, da der gesamte Rest im else steckt
        EnginezugDialog = $( "#dialog_Variantenzug" ).dialog({
            title: "Falscher Zug",
            height: 400,
            width: 600,
            modal: true,
            open: function () {
                $('#VariantenSpielerzug').html(getMoveNotations(T_Zuege.FEN, T_Zuege.ZugStockfish, 'kurz'));
                $('#VariantenZugvorschlag').html(ChallengeMoves[VariantenMovecounter].ZugKurz);
                $('#Zugbewertung').empty();
            },
            buttons: {
                Ok: function() {
                    $(this).dialog('close');
                }
            }
        });
    } else {

        // Der manuelle Zug ist der erwartete Zug und wird auf dem Brett ausgeführt
        ZieheZug(T_Zuege, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");

        // Der Zug wird als Vorbereitung für die Notation in die Situtionsdaten geschrieben
        SituationsDaten.ZugNummer = ExpectedPlayerMove.ZugNummer
        if (ExpectedPlayerMove.ZugFarbe == WEISSAMZUG) { 
            SituationsDaten.Text_w = ExpectedPlayerMove.ZugKurz;
            SituationsDaten.Text_b = DefaultMove_b;
            SituationsDaten.FEN_w  = ExpectedPlayerMove.FEN;
            SituationsDaten.FEN_b  = "&nbsp;";
        } else {
            SituationsDaten.Text_b = ExpectedPlayerMove.ZugKurz;
            SituationsDaten.Text_w = DefaultMove_w;
            SituationsDaten.FEN_b  = ExpectedPlayerMove.FEN;
            SituationsDaten.FEN_w  = "&nbsp;";
        }

        // Wenn eine neue Zeile in der Notationsliste nötig ist, wird diese hier mit den Situationsdaten generiert
        // Sonst wird die Notationszeile aktualisiert
        if (T_Zuege.ZugFarbe == WEISSAMZUG || addNotationlineFlag) {
            SituationsDaten.CurNodeId = NodePräfix + ExpectedPlayerMove.CurMoveIndex; // Die Kennung für die Notationszeile in html wird hier festgelegt
            SituationsDaten.CurMoveId = ExpectedPlayerMove.CurMoveId; // Die Kennungen für die Züge stehen schon so in der Datenbank	
            NewTreeNode(SituationsDaten, ExpectedPlayerMove);
        } else {
            UpdateTreeNode('move', SituationsDaten, ExpectedPlayerMove);
        }

        // Suchen nach Varianten: die müssen als Vorgänger diesen Zug enthalten und eine Zugebene tiefer stehen
        VariantenCandidates = $.grep(ChallengeMoves, function(PMI, i) { 
            return PMI['PreMoveId'] == ExpectedPlayerMove.CurMoveId && parseInt(PMI['ZugLevel']) == parseInt(ExpectedPlayerMove.ZugLevel) + 1; 
        });

        // Wenn Varianten gefunden wurden
        // Jetzt erst mal die Einschränkung auf eine Variante als Zwischenlösung
        if(VariantenCandidates.length > 0) {

            console.log('Varianten gefunden für ' + ExpectedPlayerMove.CurMoveId);
            alert('Dein Gegner hatte einen anderen Zug geplant. Dieser wird zuerst gespielt');
            VariantenId = VariantenCandidates[0].Id; // Um mehrere Varianten gegeneinander abzugrenzen. Kommt eventuell später oder vielleicht auch gar nicht.

            // Den verursachenden Zug markieren. Der verursachende Zug ist sicher schon in der Notation enthalten
            UpdateTreeNode('sign', SituationsDaten, ExpectedPlayerMove);

            // Die Situation VOR der Variante in den Stack
            SituationsDaten.SituationsStack.push( { PreNodeId:  SituationsDaten.PreNodeId, 
                                                    CurNodeId:  SituationsDaten.CurNodeId, 
                                                    MoveId:     SituationsDaten.CurMoveId, 
                                                    MoveIndex:  ExpectedPlayerMove.CurMoveIndex 
            });
            
            // Die neue Situation als aktuelle Situation merken
            SituationsDaten.PreNodeId = SituationsDaten.CurNodeId;
            SituationsDaten.CurNodeId = NodePräfix + VariantenCandidates[0].CurMoveIndex; // Die Kennung für die Notationszeile in html wird hier festgelegt
            SituationsDaten.CurMoveId = VariantenCandidates[0].CurMoveId;

            if (VariantenCandidates[0].ZugFarbe == WEISSAMZUG) { 
                SituationsDaten.Text_w = VariantenCandidates[0].ZugKurz;
                SituationsDaten.Text_b = DefaultMove_b;
                SituationsDaten.FEN_w  = ExpectedPlayerMove.FEN;
                SituationsDaten.FEN_b  = "&nbsp;";
            } else {
                SituationsDaten.Text_b = VariantenCandidates[0].ZugKurz;
                SituationsDaten.Text_w = DefaultMove_w;
                SituationsDaten.FEN_b  = ExpectedPlayerMove.FEN;
                SituationsDaten.FEN_w  = "&nbsp;";
            }

            // Der Zug der Variante wird auf dem Brett ausgeführt
            ZieheZug(VariantenCandidates[0], 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");

            // Beim Beginn einer Variante wird immer eine neue Zeile generiert
            NewTreeNode(SituationsDaten, VariantenCandidates[0]);

        // else heißt hier: es ist ein Zug ohne Varianten oder es ist eine Variante zu Ende
        } else {

            NextMove = $.grep(ChallengeMoves, function(PMI, i) { 
            return PMI['PreMoveId'] == ExpectedPlayerMove.CurMoveId && parseInt(PMI['ZugLevel']) == parseInt(ExpectedPlayerMove.ZugLevel); 
            }); //  Sucht einen Zug auf der gleichen Ebene. Es kann nur einen oder keinen geben

            Fertig  = false;
            counter = 0; // Nur zur Vermeidung einer Endlosschleife

            while (NextMove.length != 1 && !Fertig && counter < 10) {

                // Zurück vor die eben beendete Variante
                PreMove = SituationsDaten.SituationsStack.pop();
                SituationsDaten.PreNodeId   = PreMove.PreNodeId;
                SituationsDaten.CurNodeId   = PreMove.CurNodeId;
                SituationsDaten.CurMoveId   = PreMove.MoveId;

                // Statt SituationsDaten.SituationsStack.length eine Variable einbauen ?!
                NextMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['PreMoveId'] == SituationsDaten.CurMoveId && parseInt(PMI['ZugLevel']) == SituationsDaten.SituationsStack.length; });

                if (NextMove.length == 1) { // Ein Passender Zug gefunden?
                    
                    alert('Mit diesem Zug ist die Variante beendet. Dein Gegner spielt jetzt den Zug ' + NextMove[0].ZugKurz);

                    StellungAufbauen("Brett_SpieleAufgabe", NextMove[0].FEN, 'zugmarkerimport');
                    //ZieheZug nicht hier. 

                    Fertig = true; // Stimmt das immer ? Nur bei schwarz oder nur bei weiß ?
                }
                counter++;
            } 

            if(NextMove.length != 1) { // Wird nur bei Aufgabeende oder bei falscher PGN erreicht!
                alert('Mehrere oder keine Folgezüge gefunden');
                return;
            } else {

                ZieheZug(NextMove[0], 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");

                // Der Zug wird für die Notation in die Situationsdaten geschrieben
                SituationsDaten.ZugNummer   = NextMove.ZugNummer
                if (NextMove[0].ZugFarbe == WEISSAMZUG) { 
                    SituationsDaten.Text_w  = NextMove[0].ZugKurz;
                    SituationsDaten.FEN_w   = NextMove[0].FEN;
                } else {
                    SituationsDaten.Text_b  = NextMove[0].ZugKurz;
                    SituationsDaten.FEN_b   = NextMove[0].FEN;
                }

                UpdateTreeNode('move', SituationsDaten, NextMove[0]);

                // Auf den nächsten Zug einstellen
                 SituationsDaten.CurMoveId = NextMove[0].CurMoveId;
            }
        } 
    }
}

// Neue Zeile mit den Situationsdaten in der Notationsliste anlegen
function NewTreeNode(Situation, Zug) {

    var Id_Tooltip;
    var Id_Postfix;
    Id_Postfix = Zug.ZugFarbe == WEISSAMZUG ? 'w' : 's';
    Id_Tooltip = Situation.CurMoveId.replace('M_', 'T_') + '_' + Id_Postfix;

    htmlText_Zugnr  = "<span class='movenumber'>"    + Situation.ZugNummer + "</span>";

    if(Zug.ZugFarbe == WEISSAMZUG) {
        htmlNodeText_w  = "<span class='movewhite' id='" + Situation.CurMoveId + WhitePostfix
                        + "' data-fen='" + SituationsDaten.FEN_w 
                        + "' onclick='jumpToPosition(\"" + SituationsDaten.FEN_w + "\");" 
                        + "' onmouseover='XBT(this, {id:\"" + Id_Tooltip + "\", x: -150});'>"
                        + Situation.Text_w + "</span>";
        htmlNodeText_b  = "<span class='moveblack' id='" + Situation.CurMoveId + BlackPostfix 
                        + "' data-fen='" 
                        + "' onclick='jumpToPosition();" 
                        + "' onmouseover='XBT(this, {id:\"\", x: -150});'>"
                        + Situation.Text_b + "</span>";
        Id_Postfix = 'w';
    } else {
        htmlNodeText_w  = "<span class='movewhite' id='" + Situation.CurMoveId + WhitePostfix
                        + "' data-fen='"
                        + "' onclick='jumpToPosition(\"\");" 
                        + "' onmouseover='XBT(this, {id:\"\", x: -150});'>"
                        + Situation.Text_w + "</span>";
        htmlNodeText_b  = "<span class='moveblack' id='" + Situation.CurMoveId + BlackPostfix 
                        + "' data-fen='" + SituationsDaten.FEN_b 
                        + "' onclick='jumpToPosition(\"" + SituationsDaten.FEN_b + "\");" 
                        + "' onmouseover='XBT(this, {id:\"" + Id_Tooltip + "\", x: -150});'>"
                        + Situation.Text_b + "</span>";
        Id_Postfix = 's';
    }

    var Id_Tooltip = Situation.CurMoveId.replace('M_', 'T_') + '_' + Id_Postfix;

    ErzeugeTooltip(SituationsDaten, MiniBoardArray, Id_Tooltip, Zug.ZugFarbe);

    $('#TreeNotationslistePlayChallenge').jstree().create_node(Situation.PreNodeId, {
        "id": Situation.CurNodeId,
        "text": "<div>" + htmlText_Zugnr + htmlNodeText_w + htmlNodeText_b + "</div>"
    }, "last", function() {
        $('#TreeNotationslistePlayChallenge').jstree().open_all();
    });    
}

// Ein Knoten kann nur einen Text enthalten. Also den Knoten holen,
// die schon vorhendenen Daten merken und duchr die neuen Teile ergänzen und dann komplett wegschreiben
function UpdateTreeNode(Mode, Situation, Zug) {

    var Id_Tooltip;
    var Id_Postfix;
    Id_Postfix = Zug.ZugFarbe == WEISSAMZUG ? 'w' : 's';
    Id_Tooltip = Situation.CurMoveId.replace('M_', 'T_') + '_' + Id_Postfix;

    ErzeugeTooltip(SituationsDaten, MiniBoardArray, Id_Tooltip, Zug.ZugFarbe);

    // Den aktuellen Knoten holen, damit die schon ausgefüllten Teile übernommen werden können
    var changenode = $('#TreeNotationslistePlayChallenge').jstree(true).get_node(Situation.CurNodeId); 

    Nodetext.innerHTML = changenode.text;
    
    var NodeElements = Nodetext.getElementsByTagName("*");

    htmlText_Zugnr  = NodeElements[1].outerHTML;

    if (Mode == 'sign') {
        // In T_Zuege steht die Farbe des verursachenden Zugs. Das Zeichen also bei der anderen Farbe eintragen.
        if (Zug.ZugFarbe == WEISSAMZUG) {
            NewText_w = SituationsDaten.Text_w;
            NewText_b = VarianteZeiger;
        } else {
            NewText_w = VarianteZeiger;
            NewText_b = SituationsDaten.Text_b;
        }
    } else if (Mode == 'move') {
        if (Zug.ZugFarbe == WEISSAMZUG) {
            htmlNodeText_w  = "<span class='movewhite' id='" 
                            + ExpectedPlayerMove.CurMoveId + WhitePostfix 
                            + "' data-fen='" + SituationsDaten.FEN_w
                            + "' onclick='jumpToPosition(\"" + SituationsDaten.FEN_w + "\");"
                            + "' onmouseover='XBT(this, {id:\"" + Id_Tooltip + "\", x: -150});'>"
                             + SituationsDaten.Text_w + "</span>";
            htmlNodeText_b  = NodeElements[3].outerHTML;
        } else {
            htmlNodeText_b  = "<span class='moveblack' id='" 
                            + ExpectedPlayerMove.CurMoveId + BlackPostfix 
                            + "' data-fen='" + SituationsDaten.FEN_b 
                            + "' onclick='jumpToPosition(\"" + SituationsDaten.FEN_b + "\");>" 
                            + "' onmouseover='XBT(this, {id:\"" + Id_Tooltip + "\", x: -150});'>"
                            + SituationsDaten.Text_b + "</span>";
            htmlNodeText_w  = NodeElements[2].outerHTML;
        }
    }

    var changetext = "<div>" + htmlText_Zugnr + htmlNodeText_w + htmlNodeText_b + "</div>";
    $('#TreeNotationslistePlayChallenge').jstree().rename_node(changenode, changetext);

}