
// Für den gespielten Zug wird zuerst geprüft, ob er in der Aufgabenstellung an der aktuellen Stelle überhaupt vorgesehen ist. 
// Ist das nicht der Fall, wird das promise mit reject zurückgewiesen
// Ist der gespielte Zug der einzig vorgesehene, werden die Daten des entsprechenden Zugs aus der Aufgabenstellung übernommen
// Ist der gespielte Zug mehrdeutig (= es gibt Varianten für den Spieler), werden dem Spieler Züge vorgeschlagen.
function inspectPlayerMove() {

    console.log('Beginn in ' + getFuncName());
    var ValidatePlayerAnswer = $.Deferred();

    // DrawnMove und MainMove sind immer eindeutig 
    PossibleMoves   = $.grep(ChallengeMoves, function(CM, i) { return CM['PreMoveId'] == Stellungsdaten.CurMoveId; });
    DrawnMove       = $.grep(PossibleMoves,  function(PM, i) { return PM['ZugStockfish'] == T_Zuege.ZugStockfish; });
    MainMove        = $.grep(PossibleMoves,  function(PM, i) { return parseInt(PM['ZugLevel']) == parseInt(Stellungsdaten.ZugLevel); });

    if(DrawnMove.length == 0) {

        ValidatePlayerAnswer.reject('Falscher Zug');

    } else if (PossibleMoves.length == 1) { // Das muss dann zwingend der Hauptzug sein, sonst wäre die PGN falsch

        TransferZugdaten(Stellungsdaten, DrawnMove[0]);
        AcceptedPlayerMove = DrawnMove[0];
        ValidatePlayerAnswer.resolve({ weiter: ANSWERHAUPTZUG, zug: DrawnMove[0].CurMoveId});

    } else {

        PlayerMovesToStack(PossibleMoves, MainMove[0], DrawnMove[0]);

        offerPlayerVariationsStart(MainMove[0].ZugKurz).then( function(decision) 
        {
            console.log('offerPlayerVariationsStart resolve decision: ', decision);
            AcceptedPlayerMove = $.grep(ChallengeMoves, function(CMI, i) { return CMI['CurMoveId'] == decision.zug; })[0];
            console.log(Stellungsdaten);
            console.table(Stellungsdaten.ZugStack);
            TransferZugdaten(Stellungsdaten, MainMove[0]);
            if(decision.weiter == 'Variante') {
                NewTreeNode('TreeNotationslistePlayChallenge', 'sign', Stellungsdaten, MainMove[0], false);
                //Stellungsdaten.PreNodeId = MainMove[0].CurMoveId.replace('M_', 'N_');
                Stellungsdaten.PreNodeId = Stellungsdaten.CurNodeId;
            }
            TransferZugdaten(Stellungsdaten, AcceptedPlayerMove);
            ValidatePlayerAnswer.resolve(decision);

        }, function(decision) 
        {
            console.log('offerPlayerVariationsStart reject decision: ', decision);
            ValidatePlayerAnswer.reject(decision);
        });

    }
    return ValidatePlayerAnswer.promise();
}

function offerPlayerVariationsStart(Hauptzugkurz) {

    console.log('Beginn in ' + getFuncName());
    var OfferPlayerVariationsStartAnswer = $.Deferred();

    processSinglePlayerStartOfferAnswer = new $.Deferred(); // Hier, da die Funktion sich rekursiv aufruft

    processSinglePlayerStartOffer(Hauptzugkurz).then(function(decision) 
    {
        console.log('processSinglePlayerStartOffer decision: ', decision);

        // Es gab die Entscheidung für eine Variante. Der gewählte Variantenzug ist Teil des Rückgabestrings decision
        OfferPlayerVariationsStartAnswer.resolve(decision);

    } , function(decision) 
    {
        console.log('processSinglePlayerStartOffer decision: ', decision);            
        OfferPlayerVariationsStartAnswer.reject(decision);

    });

    return OfferPlayerVariationsStartAnswer.promise();
}

// Überträgt alle Kandidatenzüge in den Stack. Reihenfolge siehe Kommentare im Code
function PlayerMovesToStack(Variantenzuege, Hauptzug, Spielerzug) {

    console.log('Beginn in ' + getFuncName());

    // Den Hauptzug in den Stack. Gilt immer, auch wenn der Spieler diesen ausgeführt hatte
    Stellungsdaten.ZugStack.push( { 
        PreFEN:     Stellungsdaten.PreFEN,
        FEN:        Stellungsdaten.FEN,
        Farbe:      Hauptzug.ZugFarbe,
        PreNode:    Stellungsdaten.PreNodeId, 
        //CurNode:    Stellungsdaten.CurNodeId, 
        CurNode:    NodePräfix + Hauptzug.CurMoveIndex, 
        PreMove:    Hauptzug.PreMoveId, 
        CurMove:    Hauptzug.CurMoveId, 
        MoveIndex:  Hauptzug.CurMoveIndex,
        MoveLevel:  Hauptzug.ZugLevel,
        ChildMove:  "" 
    });
    //console.table(Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1]);
    //console.log(Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1].CurMove);
    NextIdToPlay = Hauptzug.CurMoveId; // wird überschrieben, wenn der Spieler einen Variantenzug ausgeführt hatte

    // Jetzt alle Züge bis auf den eventuell ausgeführten in den Stack
    $.each(Variantenzuege, function(i, V) {
        if(V.ZugStockfish != Hauptzug.ZugStockfish) { // Der Hauptzug steht schon im Stack
            if(V.ZugStockfish == Spielerzug.ZugStockfish) { // Der gespielte Zug soll noch nicht in den Stack
                NextIdToPlay = V.CurMoveId;
            } else {
                // Die Situation VOR dem Variantenzug in den Stack
                Stellungsdaten.ZugStack.push( { 
                    PreFEN:     Stellungsdaten.PreFEN,
                    FEN:        Stellungsdaten.FEN,
                    Farbe:      Hauptzug.ZugFarbe,
                    PreNode:    Stellungsdaten.PreNodeId, 
                    //CurNode:    Stellungsdaten.CurNodeId, 
                    CurNode:    NodePräfix + Hauptzug.CurMoveIndex, 
                    PreMove:    Hauptzug.PreMoveId, 
                    CurMove:    Hauptzug.CurMoveId, 
                    MoveIndex:  Hauptzug.CurMoveIndex,
                    MoveLevel:  Hauptzug.ZugLevel, 
                    ChildMove:  V.CurMoveId 
                });
                //console.table(Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1]);
                //console.log(Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1].ChildMove);
            }
        }
    });

    // Jetzt noch einen eventuell ausgeführten Variantenzug in den Stack, damit er zuerst angeboten wird
    if(NextIdToPlay != Hauptzug.CurMoveId) {
        Stellungsdaten.ZugStack.push( { 
            PreFEN: Stellungsdaten.PreFEN,
            FEN:        Stellungsdaten.FEN,
            Farbe:      Hauptzug.ZugFarbe,
            PreNode:    Stellungsdaten.PreNodeId, 
            //CurNode:    Stellungsdaten.CurNodeId, 
            CurNode:    NodePräfix + Hauptzug.CurMoveIndex, 
            PreMove:    Hauptzug.PreMoveId, 
            CurMove:    Hauptzug.CurMoveId, 
            MoveIndex:  Hauptzug.CurMoveIndex,
            MoveLevel:  Hauptzug.ZugLevel, 
            ChildMove:  MoveIdToPlay 
        });
        //console.table(Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1]);
        //console.log(Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1].ChildMove);
    }
      
}

// function PerformPlayerMove() {
  
//     // Der manuelle Zug ist also der erwartete Zug.
//     // PossiblePlayerMove enthält alle Daten, um den Zug auf dem Brett auszuführen
//     ZieheZug(AcceptedPlayerMove, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");

//     // Wenn eine neue Zeile in der Notationsliste nötig ist, wird diese hier mit den Stellungsdaten generiert
//     // Sonst wird die Notationszeile aktualisiert
//     if (AcceptedPlayerMove.ZugFarbe == WEISSAMZUG || Stellungsdaten.CreateNewNode) {
//         Stellungsdaten.CurNodeId = NodePräfix + AcceptedPlayerMove.CurMoveIndex; // Die Kennung für die Notationszeile in html wird hier festgelegt
//         Stellungsdaten.CurMoveId = AcceptedPlayerMove.CurMoveId; // Die Kennungen für die Züge stehen schon so in der Datenbank	
//         NewTreeNode('TreeNotationslistePlayChallenge', 'move', Stellungsdaten, AcceptedPlayerMove, true);
//         Stellungsdaten.CreateNewNode = false;
//     } else {
//         UpdateTreeNode('TreeNotationslistePlayChallenge', 'move', Stellungsdaten, AcceptedPlayerMove, true);
//     }
//     return true;
// }

            // if (V.ZugFarbe == WEISSAMZUG) { 
            //     Stellungsdaten.Text_w = V.ZugKurz;
            //     Stellungsdaten.Text_b = DefaultMove_b;
            //     Stellungsdaten.FEN_w  = V.FEN;
            //     Stellungsdaten.FEN_b  = "&nbsp;";
            // } else {
            //     Stellungsdaten.Text_b = V.ZugKurz;
            //     Stellungsdaten.Text_w = DefaultMove_w;
            //     Stellungsdaten.FEN_b  = V.FEN;
            //     Stellungsdaten.FEN_w  = "&nbsp;";
            // }
            
            // ExecuteDialog_PlayerVariantestart(P_Zug, V).then( function(decision) { 
            //     console.log('done decision: ' + decision)
            //     AcceptedPlayerMove = V;
            //     StellungAufbauen("Brett_SpieleAufgabe", V.FEN, 'zugmarkerimport');
            //     Stellungsdaten.PreMoveId        = V.PreMoveId;
            //     Stellungsdaten.CurMoveId        = V.CurMoveId;
            //     Stellungsdaten.PreNodeId        = Stellungsdaten.CurNodeId;
            //     Stellungsdaten.CreateNewNode    = true; 
            //     OfferPlayerVariationsStartAnswer.resolve('erledigt'); 
            // }, function(decision) {
            //     console.log('fail decision: ' + decision)
            //     AcceptedPlayerMove = H_Zug;
            //     StellungAufbauen("Brett_SpieleAufgabe", H_Zug.FEN, 'zugmarkerimport');
            //     Stellungsdaten.PreMoveId = H_Zug.PreMoveId;
            //     Stellungsdaten.CurMoveId = H_Zug.CurMoveId;
            //     Stellungsdaten.PreNodeId = Stellungsdaten.CurNodeId;
            //     OfferPlayerVariationsStartAnswer.reject('erledigt'); 
            // });

