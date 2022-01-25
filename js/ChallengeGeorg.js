
function PlayChallengeGeorg() {

    if(ValidatePlayerMove()) {

        //PerformPlayerMove();
        ZieheZug(AcceptedPlayerMove, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
        NotiereZug('TreeNotationslistePlayChallenge', AcceptedPlayerMove);
        LastGambler = SPIELER;

        // Findet alle Züge, die den aktuellen Zug als Vorgänger eingetragen haben
        var Folgezuege = $.grep(ChallengeMoves, function(PMI, i) { 
            return PMI['PreMoveId'] == AcceptedPlayerMove.CurMoveId;
        });

        if(Folgezuege.length > 0) {

            // Findet in den Folgezügen alle echten Folgezug
            var EchterFolgezug = $.grep(Folgezuege, function(PMI, i) { return parseInt(PMI['ZugLevel']) == parseInt(AcceptedPlayerMove.ZugLevel); })[0];

            // Findet in den Folgezügen alle echten Varianten
            var Variantenzuege = $.grep(Folgezuege, function(PMI, i) { return parseInt(PMI['ZugLevel']) == parseInt(AcceptedPlayerMove.ZugLevel) + 1; });

            if(Variantenzuege.length > 0) {
                ManageChallengeVariations(Variantenzuege, EchterFolgezug);
            } else {
                NextMove = EchterFolgezug;
            }

            PerformChallengeMove();
            LastGambler = AUFGABE;

            PossiblePlayerMoves = [];

            CheckContinuance(NextMove);

        } else {
            CheckContinuance(AcceptedPlayerMove);
        }
    }
}

// Der gespielte Zug muss zuerst semantisch geprüft werden. 
// Erst danach werden Daten aus T_Zuege nach Stellungsdaten übernommen
function ValidatePlayerMove() {

    // Aus den aktuellen Stellungsdaten alle passenden Züge ermitteln
    // CurMoveId ist eigentlich eindeutig. Level und Nummer könnte eventuell wieder weggelassen werden. 
    //PossiblePlayerMoves  = $.grep(ChallengeMoves, function(PMI, i) { return PMI['PreMoveId'] == Stellungsdaten.CurMoveId && parseInt(PMI['ZugNummer']) == Stellungsdaten.ZugNummer && parseInt(PMI['ZugLevel']) == Stellungsdaten.ZugLevel; });

    PossiblePlayerMoves  = $.grep(ChallengeMoves, function(PMI, i) { return PMI['PreMoveId'] == Stellungsdaten.CurMoveId; });

    if(PossiblePlayerMoves.length > 1) {

        // Findet in den Hauptzug
        var Hauptzug = $.grep(PossiblePlayerMoves, function(PMI, i) { return parseInt(PMI['ZugLevel']) == parseInt(Stellungsdaten.ZugLevel); })[0];
        
        // Findet in den möglichen Zügen alle echten Varianten
        var Variantenzuege = $.grep(PossiblePlayerMoves, function(PMI, i) { return parseInt(PMI['ZugLevel']) == parseInt(Stellungsdaten.ZugLevel) + 1; });

        ManagePlayerVariations(Variantenzuege, Hauptzug);
        return true;
    } else {

        if (T_Zuege.ZugStockfish != PossiblePlayerMoves[0].ZugStockfish) { 
            EnginezugDialog = $( "#dialog_BessererZug" ).dialog({
                title: "Falscher Zug",
                height: 200,
                width: 700,
                modal: true,
                open: function () {
                    $('#VariantenSpielerzug').html(T_Zuege.ZugFigur + T_Zuege.ZugNach);
                    $('#VariantenZugvorschlag').empty();
                    $('#Zugbewertung').empty();
                },
                buttons: {
                    Ok: function() {
                        $(this).dialog('close');
                    }
                }
            });
            return false;
        } else {
            TransferZugdaten(Stellungsdaten, PossiblePlayerMoves[0]);
            AcceptedPlayerMove = PossiblePlayerMoves[0];
            return true;
        }

    }
}

function ManagePlayerVariations(V_Zuege, H_Zug) {

    NewTreeNode('TreeNotationslistePlayChallenge', 'sign', Stellungsdaten, H_Zug, false);

    $.each(V_Zuege, function(i, V) {
        // Die Situation VOR dem Variantenzug in den Stack
        Stellungsdaten.StellungsStack.push( { 
            PreNode:        Stellungsdaten.PreNodeId, 
            CurNode:        Stellungsdaten.CurNodeId, 
            PreMove:        H_Zug.PreMoveId, 
            CurMove:        H_Zug.CurMoveId, 
            MoveIndex:      H_Zug.CurMoveId,
            ChildMoveId:    V.CurMoveId 
        });
        if(i == 0) { // der erste Zug soll gleich benutzt werden
            if (V.ZugFarbe == WEISSAMZUG) { 
                Stellungsdaten.Text_w = V.ZugKurz;
                Stellungsdaten.Text_b = DefaultMove_b;
                Stellungsdaten.FEN_w  = V.FEN;
                Stellungsdaten.FEN_b  = "&nbsp;";
            } else {
                Stellungsdaten.Text_b = V.ZugKurz;
                Stellungsdaten.Text_w = DefaultMove_w;
                Stellungsdaten.FEN_b  = V.FEN;
                Stellungsdaten.FEN_w  = "&nbsp;";
            }

            PlayerVariantestartDialog = $( "#dialog_PlayerVarianteStart" ).dialog({
                title: "Variante spielen",
                height: 250,
                width: 400,
                modal: true,
                open: function () {
                    $("#PlayerVarianteStartZug").html(V.ZugKurz);
                },
                buttons: [
                    {
                        id:     'VarianteSpielen',
                        text:   'Spielen',
                        click:  function() {
                                    $( "#PlayerVarianteStartZug" ).empty();
                                    PlayerVariantestartDialog.dialog('close');
                                }
                    }
                    // ,
                    // {
                    //     id:     'VarianteAbbrechen',
                    //     text:   'Abbrechen',
                    //     click:  function() {
                    //                 $( "#PlayerVarianteStartZug" ).empty();
                    //                 ChallengeVariantestartDialog.dialog('close');
                    //             }
                    // }
                ]
            });

            AcceptedPlayerMove = V;
            StellungAufbauen("Brett_SpieleAufgabe", V.FEN, 'zugmarkerimport');
            Stellungsdaten.PreMoveId = V.PreMoveId;
            Stellungsdaten.CurMoveId = V.CurMoveId;
            Stellungsdaten.PreNodeId = Stellungsdaten.CurNodeId;
            addNotationlineFlag = true; 
        }
    });
}

// Wird gerufen, wenn es mindesten einen Variantenzug gibt.
// Schreibt alle Variantenzüge (V_Zuege) bis auf einen in den Stack.
// Die Funktion schreibt sicher genau einen Zug als NextMove.
// ommittedMove ist der Zug, der jetzt das Variantenzeichen in der Notation bekommt und in den Stack geschrieben wird.
function ManageChallengeVariations(V_Zuege, ommittedMove) {

    // Den "übergangenen" Zug markieren. Der verursachende Zug ist sicher schon in der Notation enthalten
    UpdateTreeNode('TreeNotationslistePlayChallenge', 'sign', Stellungsdaten, AcceptedPlayerMove, true);

    $.each(V_Zuege, function(i, V) {
        // Die Situation VOR dem Variantenzug in den Stack
        Stellungsdaten.StellungsStack.push( { 
            PreNode:        Stellungsdaten.PreNodeId, 
            CurNode:        Stellungsdaten.CurNodeId, 
            PreMove:        ommittedMove.PreMoveId, 
            CurMove:        ommittedMove.CurMoveId, 
            MoveIndex:      ommittedMove.CurMoveId,
            ChildMoveId:    V.CurMoveId 
        });
        if(i == 0) { // der erste Zug soll gleich benutzt werden
            if (V.ZugFarbe == WEISSAMZUG) { 
                Stellungsdaten.Text_w = V.ZugKurz;
                Stellungsdaten.Text_b = DefaultMove_b;
                Stellungsdaten.FEN_w  = V.FEN;
                Stellungsdaten.FEN_b  = "&nbsp;";
            } else {
                Stellungsdaten.Text_b = V.ZugKurz;
                Stellungsdaten.Text_w = DefaultMove_w;
                Stellungsdaten.FEN_b  = V.FEN;
                Stellungsdaten.FEN_w  = "&nbsp;";
            }

            ChallengeVariantestartDialog = $( "#dialog_ChallengeVarianteStart" ).dialog({
                title: "Variante spielen",
                height: 250,
                width: 400,
                modal: true,
                open: function () {
                    $("#ChallengeVarianteStartZug").html(V.ZugKurz);
                },
                buttons: [
                    {
                        id:     'VarianteSpielen',
                        text:   'Spielen',
                        click:  function() {
                                    $( "#ChallengeVarianteStartZug" ).empty();
                                    ChallengeVariantestartDialog.dialog('close');
                                }
                    }
                    // ,
                    // {
                    //     id:     'VarianteAbbrechen',
                    //     text:   'Abbrechen',
                    //     click:  function() {
                    //                 $( "#ChallengeVarianteStartZug" ).empty();
                    //                 ChallengeVariantestartDialog.dialog('close');
                    //             }
                    // }
                ]
            });

            NextMove = V;
            StellungAufbauen("Brett_SpieleAufgabe", V.FEN, 'zugmarkerimport');
            Stellungsdaten.PreMoveId = V.PreMoveId;
            Stellungsdaten.CurMoveId = V.CurMoveId;
            Stellungsdaten.PreNodeId = Stellungsdaten.CurNodeId;
            addNotationlineFlag = true; 
        }
    });

}

function PerformPlayerMove() {
  
    // Der manuelle Zug ist also der erwartete Zug.
    // PossiblePlayerMove enthält alle Daten, um den Zug auf dem Brett auszuführen
    ZieheZug(AcceptedPlayerMove, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");

    // Wenn eine neue Zeile in der Notationsliste nötig ist, wird diese hier mit den Stellungsdaten generiert
    // Sonst wird die Notationszeile aktualisiert
    if (AcceptedPlayerMove.ZugFarbe == WEISSAMZUG || addNotationlineFlag) {
        Stellungsdaten.CurNodeId = NodePräfix + AcceptedPlayerMove.CurMoveIndex; // Die Kennung für die Notationszeile in html wird hier festgelegt
        Stellungsdaten.CurMoveId = AcceptedPlayerMove.CurMoveId; // Die Kennungen für die Züge stehen schon so in der Datenbank	
        NewTreeNode('TreeNotationslistePlayChallenge', 'move', Stellungsdaten, AcceptedPlayerMove, true);
        addNotationlineFlag = false;
    } else {
        UpdateTreeNode('TreeNotationslistePlayChallenge', 'move', Stellungsdaten, AcceptedPlayerMove, true);
    }
    return true;
}

function PerformChallengeMove() {

    ZieheZug(NextMove, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
    TransferZugdaten(Stellungsdaten, NextMove);
    // Ohne ==> Spieler ist weiß funktioniert, mit ==> Spieler ist schwarz funktioniert
    //Stellungsdaten.CurNodeId = NodePräfix + MoveToContinue.CurMoveIndex; // Die Kennung für die Notationszeile in html wird hier festgelegt
    NotiereZug('TreeNotationslistePlayChallenge', NextMove);
}

function GetStackMove() {

    LastStackElement = Stellungsdaten.StellungsStack.pop();
    
    Stellungsdaten.PreNodeId = LastStackElement.PreNode;
    Stellungsdaten.CurNodeId = LastStackElement.CurNode;
    Stellungsdaten.PreMoveId = LastStackElement.PreMove;
    Stellungsdaten.CurMoveId = LastStackElement.CurMove;

    NextMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['PreMoveId'] == LastStackElement.CurMove; })[0];
}

function CheckContinuance(Zug) {

    if (LastGambler == SPIELER) {
        i = 0;
    } else if (LastGambler == AUFGABE) {
        i = 1;
    } else {
        alert("Fehler in der Aufgabe");
    }

    // Findet alle Züge, die den aktuellen Zug als Vorgänger eingetragen haben
    var Kandidaten = $.grep(ChallengeMoves, function(PMI, i) { 
        return PMI['PreMoveId'] == Zug.CurMoveId && parseInt(PMI['ZugLevel']) == parseInt(Zug.ZugLevel);
    });

    if (Kandidaten.length == 0) {

        if(Stellungsdaten.StellungsStack.length > 0) {
            alert('Variante beendet. Wir spielen meinen Plan');
            GetStackMove();
            var LeapedMove = $.grep(ChallengeMoves, function(LM, i) { 
                return LM['CurMoveId'] == Stellungsdaten.CurMoveId; })[0];
            TransferZugdaten(Stellungsdaten, LeapedMove);    
            StellungAufbauen("Brett_SpieleAufgabe", LeapedMove.FEN, 'zugmarkerimport');
            ZieheZug(LeapedMove, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
            NotiereZug('TreeNotationslistePlayChallenge', LeapedMove);
            $('#' + 'TreeNotationslistePlayChallenge').jstree().close_node(Stellungsdaten.CurNodeId);

        } else {
            finishChallenge();
        }

    }
}

function finishChallenge() {
    showChallengeTip('Aufgabe beendet');
}