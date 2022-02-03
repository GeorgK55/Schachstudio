
function PlayChallengeGeorg() {

    ValidatePlayerMove().then( function() {

        // ValidatePlayerMove hat hier sicher einen AcceptedPlayerMove festgelegt

        //PerformPlayerMove();
        ZieheZug(AcceptedPlayerMove, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
        NotiereZug('TreeNotationslistePlayChallenge', AcceptedPlayerMove);
        LastGambler = SPIELER;

        // Findet alle Züge, die den aktuellen Zug als Vorgänger eingetragen haben
        var Folgezuege = $.grep(ChallengeMoves, function(PMI, i) { return PMI['PreMoveId'] == AcceptedPlayerMove.CurMoveId; });

        if(Folgezuege.length > 0) {

            // Findet in den Folgezügen den Hauptzug ( = nächster Zug auf gleicher Ebene)
            var Hauptzug = $.grep(Folgezuege, function(PMI, i) { return parseInt(PMI['ZugLevel']) == parseInt(AcceptedPlayerMove.ZugLevel); })[0];

            // Findet in den Folgezügen alle echten Varianten ( = genau eine Ebene tiefer)
            var Variantenzuege = $.grep(Folgezuege, function(PMI, i) { return parseInt(PMI['ZugLevel']) == parseInt(AcceptedPlayerMove.ZugLevel) + 1; });

            if(Variantenzuege.length > 0) { // die Varianten sollen zuerst angeboten werden
                offerChallengeVariationsStart(Variantenzuege, Hauptzug).then(function(decision) {

                    NextMove = $.grep(ChallengeMoves, function(CMI, i) { return CMI['CurMoveId'] == decision.zug; })[0];

                    prepareChallengeMove(NextMove); // Notation vervollständigen
                    processChallengeMove(NextMove);

                    LastGambler = AUFGABE;        
                    PossiblePlayerMoves = [];
        
                    CheckContinuance(NextMove);
    
                }, function(decision) { //Es wurden alle Varianten und der Hauptzug abgelehnt! Darf/soll das so möglich sein?
                    NextMove = EchterFolgezug;

                    prepareChallengeMove(NextMove); // Notation vervollständigen
                    processChallengeMove();

                    LastGambler = AUFGABE;        
                    PossiblePlayerMoves = [];
        
                    CheckContinuance(NextMove);
                    });
            } else { // Hier gibt es nur den Hauptzug
                NextMove = Hauptzug;

                prepareChallengeMove(NextMove); // Notation vervollständigen
                processChallengeMove();

                LastGambler = AUFGABE;    
                PossiblePlayerMoves = [];
    
                CheckContinuance(NextMove);    
            }

        } else { // Es wurde gar kein Folgezug (also weder Hauptzug noch Variante gefunden)
            // Hier muss entweder Variantenende oder Aufgabeende vorliegen
            CheckContinuance(AcceptedPlayerMove);
        }
    }, function() {
        showFirstAid();
    });
}

// Für den gespielten Zug wird zuerst geprüft, ob er in der Aufgabenstellung an der aktuellen Stelle überhaupt vorgesehen ist. 
// Ist das nicht der Fall, wird das promise mit reject zurückgewiesen
// Ist der gespielte Zug der einzig vorgesehene, werden die Daten des entsprechenden Zugs aus der Aufgabenstellung übernommen
// Ist der gespielte Zug mehrdeutig (= es gibt Varianten für den Spieler), wird der dem Spieler vorzuschlagende Zug im Variantenmanager des Spielers festgelegt
function ValidatePlayerMove() {

    var ValidatePlayerAnswer = $.Deferred();

    PossiblePlayerMoves = $.grep(ChallengeMoves, function(PMI, i) { return PMI['PreMoveId'] == Stellungsdaten.CurMoveId; });
    DrawnMove = $.grep(PossiblePlayerMoves, function(SF, i) { return SF['ZugStockfish'] == T_Zuege.ZugStockfish; });

    if(DrawnMove.length == 0) {
        ValidatePlayerAnswer.reject('Falscher Zug');
    } else if (PossiblePlayerMoves.length == 1) { // Das muss dann zwingend der Hauptzug sein
        TransferZugdaten(Stellungsdaten, DrawnMove[0]);
        AcceptedPlayerMove = DrawnMove[0];
        ValidatePlayerAnswer.resolve('Hauptzug fertig');
    } else {
        ManagePlayerVariations(PossiblePlayerMoves, DrawnMove[0], T_Zuege).then(function() { ValidatePlayerAnswer.resolve('Variation fertig'); });
    }
    return ValidatePlayerAnswer.promise();
}

// Hauptzug: ZugLevel in T_Zuege und in DrawnMove sind gleich
// Hauptzug gespielt: dann erst alle Varianten in beliebiger Reihenfolge
// Variantenzug gespielt: dann erst den Hauptzug und dann alle anderen Varianten in den Stack, den gewählten Variantenzug sofort spielen
function ManagePlayerVariations(V_Zuege, H_Zug, P_Zug) {

    var ManagePlayerAnswer = $.Deferred();

    TransferZugdaten(Stellungsdaten, H_Zug);
    NewTreeNode('TreeNotationslistePlayChallenge', 'sign', Stellungsdaten, H_Zug, false);

    // Den nächsten zu spielenden Zug festlegen.
    if(H_Zug.ZugLevel == P_Zug.ZugLevel) {
        // Dann hat der Spieler den Hauptzug gewählt. Es sollen zuerst die Varianten durchgespielt werden.
        NextToPlay = V_Zuege[V_Zuege.length-1].ZugStockfish;
    } else {
        // Der Spieler hat eine Variante gewählt. Diese soll ZUERST durchgespielt werden.
        NextToPlay = P_Zug.ZugStockfish;
    }

    $.each(V_Zuege, function(i, V) {
        if(V.ZugStockfish == NextToPlay) {
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

            ExecuteDialog_PlayerVariantestart(P_Zug, V).then( function(decision) { 
                console.log('done decision: ' + decision)
                AcceptedPlayerMove = V;
                StellungAufbauen("Brett_SpieleAufgabe", V.FEN, 'zugmarkerimport');
                Stellungsdaten.PreMoveId        = V.PreMoveId;
                Stellungsdaten.CurMoveId        = V.CurMoveId;
                Stellungsdaten.PreNodeId        = Stellungsdaten.CurNodeId;
                Stellungsdaten.CreateNewNode    = true; 
                ManagePlayerAnswer.resolve('erledigt'); 
            }, function(decision) {
                console.log('fail decision: ' + decision)
                AcceptedPlayerMove = H_Zug;
                StellungAufbauen("Brett_SpieleAufgabe", H_Zug.FEN, 'zugmarkerimport');
                Stellungsdaten.PreMoveId = H_Zug.PreMoveId;
                Stellungsdaten.CurMoveId = H_Zug.CurMoveId;
                Stellungsdaten.PreNodeId = Stellungsdaten.CurNodeId;
                ManagePlayerAnswer.reject('erledigt'); 
            });
            
        } else {
            // Die Situation VOR dem Variantenzug in den Stack
            Stellungsdaten.ZugStack.push( { 
                PreFEN: Stellungsdaten.PreFEN,
                FEN:        Stellungsdaten.FEN,
                PreNode:    Stellungsdaten.PreNodeId, 
                CurNode:    Stellungsdaten.CurNodeId, 
                PreMove:    H_Zug.PreMoveId, 
                CurMove:    H_Zug.CurMoveId, 
                MoveIndex:  H_Zug.CurMoveId,
                ChildMove:  V.CurMoveId 
            });
        }
    });
    return ManagePlayerAnswer.promise();
}

// Wird gerufen, wenn es mindestens einen Variantenzug gibt.
// Schreibt alle Variantenzüge (V_Zuege) in den Stack und bietet die Züge dann an.
// Die Funktion schreibt sicher genau einen Zug als NextMove.
// OmittedMove ist der Zug, der jetzt das Variantenzeichen in der Notation bekommt und in den Stack geschrieben wird.
function offerChallengeVariationsStart(V_Zuege, OmittedMove) {

    var OfferChallengeStartAnswer = $.Deferred();

    // Den übergangenen Zug in den Stack (ohne Kindzug!)
    Stellungsdaten.ZugStack.push( { 
        PreFEN: Stellungsdaten.PreFEN,
        FEN:        Stellungsdaten.FEN,
        PreNode:    Stellungsdaten.PreNodeId, 
        CurNode:    Stellungsdaten.CurNodeId, 
        PreMove:    OmittedMove.PreMoveId, 
        CurMove:    OmittedMove.CurMoveId, 
        MoveIndex:  OmittedMove.CurMoveId,
        ChildMove:  "" 
    });
    console.table(Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1]);

    $.each(V_Zuege, function(i, V) {

        // Die gleiche Situation jetzt mit dem Variantenzug in den Stack
        Stellungsdaten.ZugStack.push( { 
            PreFEN:     Stellungsdaten.PreFEN,
            FEN:        Stellungsdaten.FEN,
            PreNode:    Stellungsdaten.PreNodeId, 
            CurNode:    Stellungsdaten.CurNodeId, 
            PreMove:    OmittedMove.PreMoveId, 
            CurMove:    OmittedMove.CurMoveId, 
            MoveIndex:  OmittedMove.CurMoveId,
            ChildMove:  V.CurMoveId 
        });
        console.table(Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1]);
    });

    processSingleStartOfferAnswer = new $.Deferred();

    processSingleStartOffer(OmittedMove).then( function(decision) {
        console.log('processSingleStartOffer decision: ', decision);

        OfferChallengeStartAnswer.resolve(decision);
        return OfferChallengeStartAnswer.promise();

    }, function(decision) { // kann nie entstehen
        console.log('processSingleStartOffer desicion: ' + decision);

        OfferChallengeStartAnswer.reject(decision);
        return OfferChallengeStartAnswer.promise();

    });

    return OfferChallengeStartAnswer.promise();
}

function offerChallengeVariationsEnde() {

    var OfferChallengeEndeAnswer = $.Deferred();

    var EndMove = $.grep(ChallengeMoves, function(EM, i) { return EM['CurMoveId'] == Stellungsdaten.CurMoveId; })[0];   // soll konstant im Dialog angezeigt werden

    processSingleEndeOfferAnswer = new $.Deferred();

    processSingleEndeOffer(EndMove).then( function(decision) {
        console.log('processSingleEndeOffer decision: ', decision);

        OfferChallengeEndeAnswer.resolve(decision);
        return OfferChallengeEndeAnswer.promise();

    }, function(decision) {
        console.log('processSingleEndeOffer decision: ', decision);

        OfferChallengeEndeAnswer.reject(decision);
        return OfferChallengeEndeAnswer.promise();

    });

    return OfferChallengeEndeAnswer.promise();

}

function PerformPlayerMove() {
  
    // Der manuelle Zug ist also der erwartete Zug.
    // PossiblePlayerMove enthält alle Daten, um den Zug auf dem Brett auszuführen
    ZieheZug(AcceptedPlayerMove, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");

    // Wenn eine neue Zeile in der Notationsliste nötig ist, wird diese hier mit den Stellungsdaten generiert
    // Sonst wird die Notationszeile aktualisiert
    if (AcceptedPlayerMove.ZugFarbe == WEISSAMZUG || Stellungsdaten.CreateNewNode) {
        Stellungsdaten.CurNodeId = NodePräfix + AcceptedPlayerMove.CurMoveIndex; // Die Kennung für die Notationszeile in html wird hier festgelegt
        Stellungsdaten.CurMoveId = AcceptedPlayerMove.CurMoveId; // Die Kennungen für die Züge stehen schon so in der Datenbank	
        NewTreeNode('TreeNotationslistePlayChallenge', 'move', Stellungsdaten, AcceptedPlayerMove, true);
        Stellungsdaten.CreateNewNode = false;
    } else {
        UpdateTreeNode('TreeNotationslistePlayChallenge', 'move', Stellungsdaten, AcceptedPlayerMove, true);
    }
    return true;
}

// Zug vorbereiten (Notation und Stellungsdaten aktualisieren)
function prepareChallengeMove(Zug) {

    if (Stellungsdaten.ZugLevel < Zug.ZugLevel) { // Dann wurde eine Variante gewählt
        // Den "übergangenen" Zug markieren. Der verursachende Zug ist sicher schon in der Notation enthalten
        UpdateTreeNode('TreeNotationslistePlayChallenge', 'sign', Stellungsdaten, Zug, false);
        TransferZugdaten(Stellungsdaten, Zug);
        Stellungsdaten.CreateNewNode = true;
        Stellungsdaten.PreNodeId = Stellungsdaten.CurNodeId;
    } else {
        TransferZugdaten(Stellungsdaten, Zug);
    }

}

// Die eigenliche Ausführung auf dem Brett und in der Notation
function processChallengeMove(Zug) {

    //NextMove = $.grep(ChallengeMoves, function(CMI, i) { return CMI['CurMoveId'] == Zug.CurMoveId; })[0];

    ZieheZug(NextMove, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
    // Ohne ==> Spieler ist weiß funktioniert, mit ==> Spieler ist schwarz funktioniert
    //Stellungsdaten.CurNodeId = NodePräfix + MoveToContinue.CurMoveIndex; // Die Kennung für die Notationszeile in html wird hier festgelegt
    NotiereZug('TreeNotationslistePlayChallenge', NextMove);
}

function fetchStack(DatenObj, AnyPreMoveId) {

    LastStackElement = DatenObj.ZugStack.pop();
    console.log(fetchStack.caller);
    console.table(LastStackElement);

    if(LastStackElement.PreMove == DatenObj.CurMoveId || AnyPreMoveId) {

        DatenObj.PreFEN         = LastStackElement.PreFEN;
        DatenObj.FEN            = LastStackElement.FEN;
        DatenObj.PreNodeId      = LastStackElement.PreNode;
        DatenObj.CurNodeId      = LastStackElement.CurNode;
        DatenObj.PreMoveId      = LastStackElement.PreMove;
        DatenObj.CurMoveId      = LastStackElement.CurMove;
        DatenObj.ChildMoveId    = LastStackElement.ChildMove;

        //NextMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['CurMoveId'] == LastStackElement.ChildMoveId; })[0];
        return true;

    } else {

        Stellungsdaten.ZugStack.push( { 
            PreFEN:     LastStackElement.PreFEN,
            FEN:        LastStackElement.FEN,
            PreNode:    LastStackElement.PreNode, 
            CurNode:    LastStackElement.CurNode, 
            PreMove:    LastStackElement.PreMove, 
            CurMove:    LastStackElement.CurMove, 
            //MoveIndex:LastStackElement.CurMove,
            ChildMove:  LastStackElement.ChildMove 
        });
        console.trace('fetchStack');
        console.table(Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1]);
        return false;
    }
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

        if(Stellungsdaten.ZugStack.length > 0) {

            //fetchStack(Stellungsdaten, true);
            //var LeapedMove = $.grep(ChallengeMoves, function(LM, i) { return LM['PreMoveId'] == Stellungsdaten.CurMoveId; })[0];

            offerChallengeVariationsEnde().then( function(decision) { 

                NextMove = $.grep(ChallengeMoves, function(CMI, i) { return CMI['CurMoveId'] == decision.zug; })[0];

                StellungAufbauen("Brett_SpieleAufgabe", NextMove.FEN, 'zugmarkerimport');
                ZieheZug(NextMove, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
                NotiereZug('TreeNotationslistePlayChallenge', NextMove);

                //prepareChallengeMove(NextMove); // Notation vervollständigen
                //processChallengeMove(NextMove);
 
                // //alert('Variante beendet. Wir spielen meinen Plan');
                // TransferZugdaten(Stellungsdaten, LeapedMove);    
                // StellungAufbauen("Brett_SpieleAufgabe", LeapedMove.FEN, 'zugmarkerimport');
                // ZieheZug(LeapedMove, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
                // NotiereZug('TreeNotationslistePlayChallenge', LeapedMove);
                // $('#' + 'TreeNotationslistePlayChallenge').jstree().close_node(Stellungsdaten.CurNodeId);

            });

        } else {
            finishChallenge();
        }

    }
}

function finishChallenge() {
    showChallengeTip('Aufgabe beendet');
}
