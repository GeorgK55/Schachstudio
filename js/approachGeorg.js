
function PlayapproachGeorg() {

    inspectPlayerMove().then( function() {

        // inspectPlayerMove hat hier sicher einen AcceptedPlayerMove festgelegt

        ZieheZug(AcceptedPlayerMove, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
        NotiereZug('TreeNotationslistePlayChallenge', AcceptedPlayerMove);
        LastGambler = SPIELER;
        
        processNextMove();

    }, function() {
        showFirstAid();
    });
}

function processNextMove() {

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
                    offerEngineVariationsStart(Variantenzuege, Hauptzug).then(function(decision) {
    
                        NextMove = $.grep(ChallengeMoves, function(CMI, i) { return CMI['CurMoveId'] == decision.zug; })[0];
       
                        prepareEngineMove(NextMove); // Notation vervollständigen
                        processEngineMove();
            
                        LastGambler = AUFGABE;    
                        PossiblePlayerMoves = [];
                
                        checkNext(NextMove);    
            
                    }, function(decision) { //Es wurden alle Varianten abgelehnt.
                        
                        NextMove = Hauptzug;
    
                        prepareEngineMove(NextMove); // Notation vervollständigen
                        processEngineMove();
            
                        LastGambler = AUFGABE;    
                        PossiblePlayerMoves = [];
                
                        checkNext(NextMove);    
            
                    });
    
                } else { // Hier gibt es nur den Hauptzug
                                    
                    NextMove = Hauptzug;
                    prepareEngineMove(NextMove); // Notation vervollständigen
                    processEngineMove();
        
                    LastGambler = AUFGABE;    
                    PossiblePlayerMoves = [];
            
                    checkNext(NextMove);    
        
                }
    
            } else { // Es wurde gar kein Folgezug (also weder Hauptzug noch Variante gefunden)
                // Hier muss entweder Variantenende oder Aufgabeende vorliegen
                
                checkNext(AcceptedPlayerMove);
    
            }
    
}

// Wird nach JEDEM von der Aufgabe duchgeführten Zug aufgerufen.
// Gibt es einen Folgezug, geht es einfach weiter
// Gibt es keinen Folgezug aber noch gemerkte Züge, wird der Spieler gefragt
// Gibt es weder einen Folgezug noch gemerkte Züge ist die Aufgabe beendet
function checkNext(Zug) {

    console.log('Beginn in ' + getFuncName());
    console.log(Zug);

    // Achtung: leerer Stack ist nicht abgefangen
    //console.log('CurMove Zug: ' + Zug.CurMoveId + ', Last ZugStack: ' + Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1].CurMove);
    //console.log('ZugFarbe Zug: ' + Zug.ZugFarbe + ', Challenge: ' + Challenge[0].AmZug + ', Last Stack: ' + Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1].Farbe);

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

            // der "Verursacher" des Stackeintrags
            if(Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1].Farbe == Challenge[0].AmZug) {
                offerPlayerVariationsEnde().then( function(decision) {

                    console.log('offerPlayerVariationsEnde resolve decision: ', decision);

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

                    console.log('offerPlayerVariationsEnde reject decision: ', decision);

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

                    AcceptedPlayerMove = $.grep(ChallengeMoves, function(CMI, i) { return CMI['CurMoveId'] == decision.zug.CurMove; })[0];
                    processNextMove();

                });
            } else {
                offerEngineVariationsEnde().then( function(decision) { 

                console.log('offerEngineVariationsEnde resolve decision: ', decision);

                // Der Spieler hat das Variantenende zur Kenntnis genommen. 
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
                    console.log('offerEngineVariationsEnde reject decision: ', decision);

                    Stellungsdaten.PreNodeId      = decision.zug.PreNode;
                    Stellungsdaten.CurNodeId      = decision.zug.CurNode;

                    // Der Spieler hat das Variantenende zur Kenntnis genommen. 
                    // Jetzt muss zuerst der Platzhalter ersetzt werden und die Variante muss verborgen werden
                    // später noch als Konfiguration verbergen oder nicht

                    NextMove = $.grep(ChallengeMoves, function(CMI, i) { return CMI['CurMoveId'] == decision.zug.CurMove; })[0];
                    TransferZugdaten(Stellungsdaten, NextMove);
                    UpdateTreeNode('TreeNotationslistePlayChallenge', 'move', Stellungsdaten, NextMove, true);
                    $('#' + 'TreeNotationslistePlayChallenge').jstree().close_node(decision.zug.CurNode);
        
                    StellungAufbauen("Brett_SpieleAufgabe", NextMove.FEN, 'zugmarkerimport');
                    ZieheZug(NextMove, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
                    NotiereZug('TreeNotationslistePlayChallenge', NextMove);

                });
            }
        } else {
            finishChallenge();
        }

    }
}

function finishChallenge() {
    showChallengeTip('Aufgabe beendet');
}