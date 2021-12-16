function PlayChallengeVarianten() { 

    console.log('PlayChallengeVarianten');

    ExpectedPlayerMove  = $.grep(ChallengeMoves, function(PMI, i) { return PMI['PreMoveId'] == SituationsDaten.CurMoveId; })[0];
 
    // Auslöser war ja ein manueller Zug auf dem Brett. Die stehen immer in T_Zuege
    // Hier erst mal eine vereinfachte Interpretation der Variantenanalyse: 
    // ein Zug, der nicht vorgesehen ist, ist falsch
    // da alle erlaubten Züge schon in der Datenbank stehen und damit verifiziert sind, wird die Engine gar nicht benötigt
    // der Vergleich in der stacokfish-Syntax ist besonders einfach 
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

        // Der manuelle Zug ist gültig und wird auf dem Brett ausgeführt
        ZieheZug(T_Zuege, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");

        // Der Zug wird für die Notation in die Situtionsdaten geschrieben
        SituationsDaten.ZugNummer = ExpectedPlayerMove.ZugNummer
        if (ExpectedPlayerMove.ZugFarbe == WEISSAMZUG) { 
            SituationsDaten.Text_w = ExpectedPlayerMove.ZugKurz;
            SituationsDaten.Text_b = DefaultMove_b;
        } else {
            SituationsDaten.Text_b = ExpectedPlayerMove.ZugKurz;
            SituationsDaten.Text_w = DefaultMove_w;
        }

        // Wenn eine neue Zeile in der Notationsliste nötig ist, wird diese hier mit den Situationsdaten generiert
        // Sonst wird die Notationszeile aktualisiert
        if (T_Zuege.ZugFarbe == WEISSAMZUG || addNotationlineFlag) {
            SituationsDaten.CurNodeId = NodePräfix + ExpectedPlayerMove.CurMoveIndex; // Die Kennung für die Notationszeile in html wird hier festgelegt
            SituationsDaten.CurMoveId = ExpectedPlayerMove.CurMoveId; // Die Kennungen für die Züge stehen schon so in der Datenbank	
            NewTreeNode(SituationsDaten, ExpectedPlayerMove);
        } else {
            UpdateTreeNode(SituationsDaten, ExpectedPlayerMove);
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
            } else {
                SituationsDaten.Text_b = VariantenCandidates[0].ZugKurz;
                SituationsDaten.Text_w = DefaultMove_w;
            }

            // Der Zug der Variante wird auf dem Brett ausgeführt
            ZieheZug(VariantenCandidates[0], 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");

            // Beim Beginn einer Variante wird immer eine neue Zeile generiert
            NewTreeNode(SituationsDaten, VariantenCandidates[0]);

        // else heißt hier: es ist ein Zug ohne Varianten oder es ist eine Variante zu Ende
        } else {

            Fertig  = false;
            counter = 0; // Nur zur Vermeidung einer Endlsoschleife

            do {
                NextMove = $.grep(ChallengeMoves, function(PMI, i) { 
                return PMI['PreMoveId'] == ExpectedPlayerMove.CurMoveId && parseInt(PMI['ZugLevel']) == parseInt(ExpectedPlayerMove.ZugLevel); 
                }); // Kann es nur einen oder keinen geben

                if (NextMove.length == 1) { Fertig = true; } // dann ist die einzige Fortsetzung gefunden

                if (NextMove.length == 0) { // Varianten- oder Aufgabeende

                    alert("Mit diesem Zug ist die Variante beendet");

                    // Zurück vor die eben beendete Variante
                    PreMove = SituationsDaten.SituationsStack.pop();
                    SituationsDaten.PreNodeId   = PreMove.PreNodeId;
                    SituationsDaten.CurNodeId   = PreMove.CurNodeId;
                    SituationsDaten.CurMoveId   = PreMove.MoveId;

                    // Statt SituationsDaten.SituationsStack.length eine Variable einbauen ?!
                    NextMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['PreMoveId'] == SituationsDaten.CurMoveId && parseInt(PMI['ZugLevel']) == SituationsDaten.SituationsStack.length; });

                    StellungAufbauen("Brett_SpieleAufgabe", NextMove[0].FEN, 'zugmarkerimport');
                    //ZieheZug nicht hier. 

                    Fertig = true; // Stimmt das immer ? Nur bei schwarz oder nur bei weiß ?
                }
                counter++;

            } while (NextMove.length != 1 && !Fertig && counter < 10); 

            if(NextMove.length != 1) { // Wird nur bei Aufgabeende oder bei falscher PGN erreicht!
                alert('Mehrere oder keine Folgezüge gefunden');
                return;
            } else {

                ZieheZug(NextMove[0], 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");

                // Der Zug wird für die Notation in die Situationsdaten geschrieben
                SituationsDaten.ZugNummer = NextMove.ZugNummer
                if (NextMove[0].ZugFarbe == WEISSAMZUG) { 
                    SituationsDaten.Text_w = NextMove[0].ZugKurz;
                } else {
                    SituationsDaten.Text_b = NextMove[0].ZugKurz;
                }

                UpdateTreeNode(SituationsDaten, ExpectedPlayerMove);

                // Auf den nächsten Zug einstellen
                 SituationsDaten.CurMoveId = NextMove[0].CurMoveId;
            }
        } 
    }
}

// Neue Zeile mit den Situationsdaten in der Notationsliste anlegen
function NewTreeNode(Situation, Zug) {

    htmlText_Zugnr  = "<span class='movenumber'>"    + Situation.ZugNummer + "</span>";
    htmlNodeText_w  = "<span class='movewhite' id='" + Situation.CurMoveId + WhitePostfix + "'>" + Situation.Text_w + "</span>";
    htmlNodeText_b  = "<span class='moveblack' id='" + Situation.CurMoveId + BlackPostfix + "'>" + Situation.Text_b + "</span>";

    $('#TreeNotationslistePlayChallenge').jstree().create_node(Situation.PreNodeId, {
        "id": Situation.CurNodeId,
        "text": "<div>" + htmlText_Zugnr + htmlNodeText_w + htmlNodeText_b + "</div>"
    }, "last", function() {
        //alert("startnode created");
        $('#TreeNotationslistePlayChallenge').jstree().open_all();
    });    
}

function UpdateTreeNode(Situation, Zug) {

    htmlText_Zugnr  = "<span class='movenumber'>"    + ExpectedPlayerMove.ZugNummer + "</span>";
    htmlNodeText_w  = "<span class='movewhite' id='" + ExpectedPlayerMove.CurMoveId + WhitePostfix + "'>" + SituationsDaten.Text_w + "</span>";
    htmlNodeText_b  = "<span class='moveblack' id='" + ExpectedPlayerMove.CurMoveId + BlackPostfix + "'>" + SituationsDaten.Text_b + "</span>";

    var changenode = $('#TreeNotationslistePlayChallenge').jstree(true).get_node(Situation.CurNodeId);
    $('#TreeNotationslistePlayChallenge').jstree().rename_node(changenode, "<div>" + htmlText_Zugnr + htmlNodeText_w + htmlNodeText_b + "</div>");

}