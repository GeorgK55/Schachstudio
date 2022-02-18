
function PlayapproachGeorg() {

    inspectPlayerMove().then( function() {

        // inspectPlayerMove hat hier sicher einen AcceptedPlayerMove festgelegt

        ZieheZug(AcceptedPlayerMove, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
        NotiereZug('TreeNotationslistePlayChallenge', AcceptedPlayerMove);
        LastGambler = SPIELER;

        // Findet alle Züge, die den aktuellen Zug als Vorgänger eingetragen haben
        var Folgezuege = $.grep(ChallengeMoves, function(PMI, i) { return PMI['PreMoveId'] == AcceptedPlayerMove.CurMoveId; });

        if(Folgezuege.length > 0) {

            // Findet in den Folgezügen den Hauptzug ( = einziger Zug auf gleicher Ebene)
            var Hauptzug = $.grep(Folgezuege, function(PMI, i) { return parseInt(PMI['ZugLevel']) == parseInt(AcceptedPlayerMove.ZugLevel); })[0];

            // Findet in den Folgezügen alle echten Varianten ( = genau eine Ebene tiefer)
            var Variantenzuege = $.grep(Folgezuege, function(PMI, i) { return parseInt(PMI['ZugLevel']) == parseInt(AcceptedPlayerMove.ZugLevel) + 1; });

            if(Variantenzuege.length > 0) { // die Varianten sollen zuerst angeboten werden
                
                // offer... ruft sich rekursiv selbst auf und gibt bei resolve die sich aus der gewählten Variante ergebende CurMoveId des ChallengeMoves zurück.
                // Der Zug ist weder ausgeführt noch geschrieben
                offerChallengeVariationsStart(Variantenzuege, Hauptzug).then(function(decision) {

                    NextMove = $.grep(ChallengeMoves, function(CMI, i) { return CMI['CurMoveId'] == decision.zug; })[0];
   
                    prepareChallengeMove(NextMove); // Notation vervollständigen
                    processChallengeMove();
        
                    LastGambler = AUFGABE;    
                    PossiblePlayerMoves = [];
            
                    CheckContinuance(NextMove);    
        
                }, function(decision) { //Es wurden alle Varianten abgelehnt.
                    
                    NextMove = Hauptzug;

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
            console.log(Stellungsdaten.CurMoveId + ' ' + Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1].CurMove);
            console.log(Stellungsdaten.ZugFarbe + ' ' + Challenge[0].AmZug);
            CheckContinuance(AcceptedPlayerMove);
            var i = 0;
            if(NextMove.ZugFarbe == Challenge[0].AmZug) {
                //TransferZugdaten(Stellungsdaten, NextMove);
                //CheckContinuance(NextMove);
            }
        }
    }, function() {
        showFirstAid();
    });
}

// Wird nach JEDEM von der Aufgabe duchgeführten Zug aufgerufen.
// Gibt es einen Folgezug, geht es einfach weiter
// Gibt es keinen Folgezug aber noch gemerkte Züge, wird der Spieler gefragt
// Gibt es weder einen Folgezug noch gemerkte Züge ist die Aufgabe beendet
function CheckContinuance(Zug) {

    console.log('Beginn in ' + getFuncName());
    console.log(Zug);
    // Wird das überhaupt gebraucht?
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

            offerChallengeVariationsEnde().then( function(decision) { 

                console.log('offerChallengeVariationsEnde resolve decision: ', decision);

                // Der Spieler das Variantenende zur Kenntnis genommen. 
                // Jetzt muss zuerst der Platzhalter ersetzt werden und die Variante muss verborgen werden
                // später noch als Konfiguration verbergen oder nicht
                //NotiereVariantenende();
    
                NextMove = $.grep(ChallengeMoves, function(CMI, i) { return CMI['CurMoveId'] == decision.zug.ChildMove; })[0];

                StellungAufbauen("Brett_SpieleAufgabe", NextMove.FEN, 'zugmarkerimport');
                ZieheZug(NextMove, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
                TransferZugdaten(Stellungsdaten, NextMove);
                // Passt bei einer Variante. Für mehrere noch prüfen
                //$('#' + 'TreeNotationslistePlayChallenge').jstree().close_node(decision.zug.CurNode); 
                 Stellungsdaten.CreateNewNode = true;
                NotiereZug('TreeNotationslistePlayChallenge', NextMove);

            }
            ,
            function(decision) {
                console.log('offerChallengeVariationsEnde reject decision: ', decision);

                Stellungsdaten.PreNodeId      = decision.zug.PreNode;
                Stellungsdaten.CurNodeId      = decision.zug.CurNode;

                // Der Spieler hat das Variantenende zur Kenntnis genommen. 
                // Jetzt muss zuerst der Platzhalter ersetzt werden und die Variante muss verborgen werden
                // später noch als Konfiguration verbergen oder nicht

                NextMove = $.grep(ChallengeMoves, function(CMI, i) { return CMI['CurMoveId'] == decision.zug.CurMove; })[0];
                TransferZugdaten(Stellungsdaten, NextMove);
                UpdateTreeNode('TreeNotationslistePlayChallenge', 'move', Stellungsdaten, NextMove, true);
                $('#' + 'TreeNotationslistePlayChallenge').jstree().close_node(decision.zug.CurNode);
                //NotiereVariantenende(); // Hier auch einsetzen?
    
                StellungAufbauen("Brett_SpieleAufgabe", NextMove.FEN, 'zugmarkerimport');
                ZieheZug(NextMove, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
                NotiereZug('TreeNotationslistePlayChallenge', NextMove);

            });

        } else {
            finishChallenge();
        }

    }
}

function finishChallenge() {
    showChallengeTip('Aufgabe beendet');
}

// function NotiereVariantenende() {

//     var Zug = $.grep(ChallengeMoves, function(CMI, i) { return CMI['CurMoveId'] == Stellungsdaten.CurMoveId; })[0];
//     TransferZugdaten(Stellungsdaten, Zug);
//     UpdateTreeNode('TreeNotationslistePlayChallenge', 'sign', Stellungsdaten, Zug, true);
//     $('#' + 'TreeNotationslistePlayChallenge').jstree().close_node(Stellungsdaten.CurNodeId);

// }


// function fetchStack(DatenObj, AnyPreMoveId) {

//     LastStackElement = DatenObj.ZugStack.pop();

//     console.log('DatenObj.PreFEN: ' + '      ' + DatenObj.PreFEN      + ' LastStackElement.PreFEN: ' + '   ' + LastStackElement.PreFEN);
//     console.log('DatenObj.FEN: ' + '         ' + DatenObj.FEN         + ' LastStackElement.FEN: ' + '      ' + LastStackElement.FEN);
//     console.log('DatenObj.PreNodeId: ' + '   ' + DatenObj.PreNodeId   + ' LastStackElement.PreNode: ' + '  ' + LastStackElement.PreNode);
//     console.log('DatenObj.CurNodeId: ' + '   ' + DatenObj.CurNodeId   + ' LastStackElement.CurNode: ' + '  ' + LastStackElement.CurNode);
//     console.log('DatenObj.PreMoveId: ' + '   ' + DatenObj.PreMoveId   + ' LastStackElement.PreMove: ' + '  ' + LastStackElement.PreMove);
//     console.log('DatenObj.CurMoveId: ' + '   ' + DatenObj.CurMoveId   + ' LastStackElement.CurMove: ' + '  ' + LastStackElement.CurMove);
//     console.log('DatenObj.ChildMoveId: ' + ' ' + DatenObj.ChildMoveId + ' LastStackElement.ChildMove: ' + '' + LastStackElement.ChildMove);
         
//     console.log(fetchStack.caller);
//     console.table(LastStackElement);

//     if(LastStackElement.PreMove == DatenObj.CurMoveId || AnyPreMoveId) {

//         DatenObj.PreFEN         = LastStackElement.PreFEN;
//         DatenObj.FEN            = LastStackElement.FEN;
//         DatenObj.PreNodeId      = LastStackElement.PreNode;
//         DatenObj.CurNodeId      = LastStackElement.CurNode;
//         DatenObj.PreMoveId      = LastStackElement.PreMove;
//         DatenObj.CurMoveId      = LastStackElement.CurMove;
//         DatenObj.ChildMoveId    = LastStackElement.ChildMove;
//         // MoveLevel ???
//         //NextMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['CurMoveId'] == LastStackElement.ChildMoveId; })[0];
//         return true;

//     } else {

//         Stellungsdaten.ZugStack.push( { 
//             PreFEN:     LastStackElement.PreFEN,
//             FEN:        LastStackElement.FEN,
//             PreNode:    LastStackElement.PreNode, 
//             CurNode:    LastStackElement.CurNode, 
//             PreMove:    LastStackElement.PreMove, 
//             CurMove:    LastStackElement.CurMove, 
//             MoveLevel:  LastStackElement.MoveLevel,
//             ChildMove:  LastStackElement.ChildMove 
//         });
//         console.trace('fetchStack');
//         console.table(Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1]);
//         return false;
//     }
// }

