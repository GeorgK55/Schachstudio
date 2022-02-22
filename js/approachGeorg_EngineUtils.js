
// Wird gerufen, wenn es mindestens einen Variantenzug gibt.
// Schreibt zuerst den Hauptzug (OmittedMove) und dann alle Variantenzüge (V_Zuege) in den Stack
// Dann wird ein Startangebot an den Spieler erstellt
// Als Ergebnis des Startangebots kommt lediglich die CurMoveId des vom Gegner (=Challenge) auszuführenden Zugs zurück
function offerEngineVariationsStart(V_Zuege, OmittedMove) {

    console.log('Beginn in ' + getFuncName());
    var offerEngineVariationsStartAnswer = $.Deferred();

    EngineMovesToStack(V_Zuege, OmittedMove);

    processSingleChallengeStartOfferAnswer = new $.Deferred(); // Hier, da die Funktion sich rekursiv aufruft

    // Der übergangene Zug wird mitgegeben, damit dessen Daten angezeigt werden können.
    // Die Auswahl der angebotenen Züge passiert in der Funktion
    processSingleChallengeStartOffer(Zugtext(OmittedMove.ZugKurz)).then( function(decision) {
        console.log('processSingleChallengeStartOffer decision: ', decision);

        // Es gab die Entscheidung für eine Variante. Der gewählte Variantenzug ist Teil des Rückgabestrings decision
        offerEngineVariationsStartAnswer.resolve(decision);
        return offerEngineVariationsStartAnswer.promise();

    }, function(decision) { // Alle Varianten ignoriert
        console.log('processSingleChallengeStartOffer decision: ' + decision);

        offerEngineVariationsStartAnswer.reject(decision);
        return offerEngineVariationsStartAnswer.promise();

    });

    return offerEngineVariationsStartAnswer.promise();
}

function offerEngineVariationsEnde() {

    console.log('Beginn in ' + getFuncName());
    var offerEngineVariationsEndeAnswer = $.Deferred();

    var EndMove = $.grep(ChallengeMoves, function(EM, i) { return EM['CurMoveId'] == Stellungsdaten.CurMoveId; })[0];   // soll konstant im Dialog angezeigt werden

    processSingleEngineEndeOfferAnswer = new $.Deferred();

    processSingleEngineEndeOffer(EndMove).then( function(decision) {
        console.log('processSingleEngineEndeOffer decision: ', decision);

        offerEngineVariationsEndeAnswer.resolve(decision);
        return offerEngineVariationsEndeAnswer.promise();

    }, function(decision) {
        console.log('processSingleEngineEndeOffer decision: ', decision);

        offerEngineVariationsEndeAnswer.reject(decision);
        return offerEngineVariationsEndeAnswer.promise();

    });

    return offerEngineVariationsEndeAnswer.promise();
}

// Überträgt alle Kandidatenzüge in den Stack. Reihenfolge entsprechend PGN
function EngineMovesToStack(Variantenzuege, Hauptzug) {

    console.log('Beginn in ' + getFuncName());
    // Den übergangenen Zug in den Stack (ohne Kindzug!)
    Stellungsdaten.ZugStack.push( { 
        PreFEN:     Stellungsdaten.PreFEN,
        FEN:        Stellungsdaten.FEN,
        Farbe:      Hauptzug.ZugFarbe,
        PreNode:    Stellungsdaten.PreNodeId, 
        CurNode:    Stellungsdaten.CurNodeId, 
        PreMove:    Hauptzug.PreMoveId, 
        CurMove:    Hauptzug.CurMoveId, 
        MoveIndex:  Hauptzug.CurMoveIndex,
        MoveLevel:  Hauptzug.ZugLevel,
        ChildMove:  "" 
    });
    console.table(Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1]);

    for (let i = Variantenzuege.length-1; i >= 0; i--) {

        // Die gleiche Situation jetzt mit dem Variantenzug in den Stack
        Stellungsdaten.ZugStack.push( { 
            PreFEN:     Stellungsdaten.PreFEN,
            FEN:        Stellungsdaten.FEN,
            Farbe:      Hauptzug.ZugFarbe,
            PreNode:    Stellungsdaten.PreNodeId, 
            CurNode:    Stellungsdaten.CurNodeId, 
            PreMove:    Hauptzug.PreMoveId, 
            CurMove:    Hauptzug.CurMoveId, 
            MoveIndex:  Hauptzug.CurMoveIndex,
            MoveLevel:  Hauptzug.ZugLevel,
            ChildMove:  Variantenzuege[i].CurMoveId 
        });
        console.table(Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1]);
    }  
    
}

// Zug vorbereiten (Notation und Stellungsdaten aktualisieren)
function prepareEngineMove(Zug) {

    console.log('Beginn in ' + getFuncName());
    if (Stellungsdaten.ZugLevel < Zug.ZugLevel) { // Dann wurde eine Variante gewählt
        // Den "übergangenen" Zug markieren. Der verursachende Zug ist sicher schon in der Notation enthalten
        UpdateTreeNode('TreeNotationslistePlayChallenge', 'sign', Stellungsdaten, Zug, false);
        TransferZugdaten(Stellungsdaten, Zug);
        Stellungsdaten.CreateNewNode = true;
        Stellungsdaten.PreNodeId = Stellungsdaten.CurNodeId;
    } else {
        // Keinen neue Notationszeile
        TransferZugdaten(Stellungsdaten, Zug);
        // Stellungsdaten beiben so
    }

}

// Die eigenliche Ausführung auf dem Brett und in der Notation
function processEngineMove() {

    console.log('Beginn in ' + getFuncName());
    // NextMove ist global
    ZieheZug(NextMove, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
    NotiereZug('TreeNotationslistePlayChallenge', NextMove);

}