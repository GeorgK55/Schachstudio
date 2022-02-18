
// Wird gerufen, wenn es mindestens einen Variantenzug gibt.
// Schreibt zuerst den Hauptzug (OmittedMove) und dann alle Variantenzüge (V_Zuege) in den Stack
// Dann wird ein Startangebot an den Spieler erstellt
// Als Ergebnis des Startangebots kommt lediglich die CurMoveId des vom Gegner (=Challenge) auszuführenden Zugs zurück
function offerChallengeVariationsStart(V_Zuege, OmittedMove) {

    console.log('Beginn in ' + getFuncName());
    var OfferChallengeVariationsStartAnswer = $.Deferred();

    ChallengeMovesToStack(V_Zuege, OmittedMove);

    processSingleChallengeStartOfferAnswer = new $.Deferred(); // Hier, da die Funktion sich rekursiv aufruft

    // Der übergangene Zug wird mitgegeben, damit dessen Daten angezeigt werden können.
    // Die Auswahl der angebotenen Züge passiert in der Funktion
    processSingleChallengeStartOffer(OmittedMove.ZugKurz).then( function(decision) {
        console.log('processSingleChallengeStartOffer decision: ', decision);

        // Es gab die Entscheidung für eine Variante. Der gewählte Variantenzug ist Teil des Rückgabestrings decision
        OfferChallengeVariationsStartAnswer.resolve(decision);
        return OfferChallengeVariationsStartAnswer.promise();

    }, function(decision) { // Alle Varianten ignoriert
        console.log('processSingleChallengeStartOffer decision: ' + decision);

        OfferChallengeVariationsStartAnswer.reject(decision);
        return OfferChallengeVariationsStartAnswer.promise();

    });

    return OfferChallengeVariationsStartAnswer.promise();
}

function offerChallengeVariationsEnde() {

    console.log('Beginn in ' + getFuncName());
    var OfferChallengeVariationsEndeAnswer = $.Deferred();

    var EndMove = $.grep(ChallengeMoves, function(EM, i) { return EM['CurMoveId'] == Stellungsdaten.CurMoveId; })[0];   // soll konstant im Dialog angezeigt werden

    processSingleChallengeEndeOfferAnswer = new $.Deferred();

    processSingleChallengeEndeOffer(EndMove).then( function(decision) {
        console.log('processSingleChallengeEndeOffer decision: ', decision);

        OfferChallengeVariationsEndeAnswer.resolve(decision);
        return OfferChallengeVariationsEndeAnswer.promise();

    }, function(decision) {
        console.log('processSingleChallengeEndeOffer decision: ', decision);

        OfferChallengeVariationsEndeAnswer.reject(decision);
        return OfferChallengeVariationsEndeAnswer.promise();

    });

    return OfferChallengeVariationsEndeAnswer.promise();
}

// Überträgt alle Kandidatenzüge in den Stack. Reihenfolge entsprechend PGN
function ChallengeMovesToStack(Variantenzuege, Hauptzug) {

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

    $.each(Variantenzuege, function(i, V) {

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
            ChildMove:  V.CurMoveId 
        });
        console.table(Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1]);
    });
    
    
}

// Zug vorbereiten (Notation und Stellungsdaten aktualisieren)
function prepareChallengeMove(Zug) {

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
function processChallengeMove() {

    console.log('Beginn in ' + getFuncName());
    // NextMove ist global
    ZieheZug(NextMove, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
    NotiereZug('TreeNotationslistePlayChallenge', NextMove);

}

