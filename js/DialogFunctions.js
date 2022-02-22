function processSinglePlayerStartOffer(HauptZugKurz) {

    var LastStackElement = Stellungsdaten.ZugStack.pop();

    if(LastStackElement.ChildMove != "") { // Nur dann wurde eine Variante (<>Hauptzug) aus dem Stack geholt

        var IndividualStart11 = Text_PlayerVarianteStart11.replace('XXX', '<b>' + HauptZugKurz + '</b>');
        NextMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['CurMoveId'] == LastStackElement.ChildMove; })[0];

        PlayerVariantestartDialog = $( "#dialog_PlayerVarianteStart" ).dialog({
            title: "Spielervariante zuerst ziehen",
            modal: true,
            draggable: false,
            resizable: false,
            position: { my: "left top", at: "left top", of: "#h_AufgabenSpielen" },
            show: 'blind',
            hide: 'blind',
            height: 240,
            width: 600,
            open: function () {
                var IndividualStart12 = Text_PlayerVarianteStart12.replace('XXX', '<b>' + Zugtext(NextMove.ZugKurz) + '</b>');
                $('#PlayerVarianteStartText').html(IndividualStart11 + '<br>' + IndividualStart12);
            },
            buttons: [
                {
                    id:     'VarianteSpielenStart',
                    text:   'Spielen',
                    click:  function() {
                                // Der Spieler hat sich für diese Variante entschieden
                                VariationsLevelCounter[NextMove.ZugLevel]++;
                                PlayerVariantestartDialog.dialog('close');
                                processSinglePlayerStartOfferAnswer.resolve({ weiter: ANSWERVARIANTE, zug: NextMove.CurMoveId});
                            }
                }
                ,
                {
                    id:     'VarianteAbbrechenStart',
                    text:   'Ignorieren',
                    click:  function() {
                                PlayerVariantestartDialog.dialog('close');
                                processSinglePlayerStartOffer(HauptZugKurz);
                            }
                }
            ]                
        });

    } else {
        
        PlayerHauptzugDialog = $( "#dialog_PlayerHauptzug" ).dialog({
            title: "Hauptzug spielen",
            modal: true,
            draggable: false,
            resizable: false,
            position: { my: "left top", at: "left top", of: "#h_AufgabenSpielen" },
            show: 'blind',
            hide: 'blind',
            height: 200,
            width: 600,
            open: function () {
                //var IndividualStart12 = Text_PlayerVarianteStart12.replace('XXX', '<b>' + Zugtext(NextMove.ZugKurz) + '</b>');
                //$('#PlayerVarianteStartText').html(IndividualStart11 + '<br>' + IndividualStart12);
            },
            buttons: [
                {
                    id:     'Hauptzugspielen',
                    text:   'Weiter',
                    click:  function() {                        // 
                        NextMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['CurMoveId'] == LastStackElement.CurMove; })[0];
                        PlayerHauptzugDialog.dialog('close');
                        processSinglePlayerStartOfferAnswer.resolve({ weiter: ANSWERHAUPTZUG, zug: LastStackElement.CurMove});
                    }
                }
            ]                
        });
    }
    return processSinglePlayerStartOfferAnswer.promise();
}

// Wird nur dann aufgerufen, wenn mindestens eine Variante vorliegt
// Bietet den jeweils letzten im Stack gespeicherten Zug im Dialog an
// Angebotene Züge sind danach nicht mehr im Stack
// Die Funktion gibt lediglich die vom Spieler gewählte ZugId zurück (ändert keine Daten außer pop des stack)
function processSingleChallengeStartOffer(HauptZugKurz) {

    var LastStackElement = Stellungsdaten.ZugStack.pop();

    if(LastStackElement.ChildMove != "") { // Nur dann wurde eine Variante (<>Hauptzug) aus dem Stack geholt

        var IndividualStart11 = Text_ChallengeVarianteStart11.replace('XXX', '<b>' + HauptZugKurz + '</b>');
        NextMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['CurMoveId'] == LastStackElement.ChildMove; })[0];

        ChallengeVariantestartDialog = $( "#dialog_ChallengeVarianteStart" ).dialog({
            title: "Aufgabenvariante zuerst spielen",
            modal: true,
            draggable: false,
            resizable: false,
            position: { my: "left top", at: "left top", of: "#h_AufgabenSpielen" },
            show: 'blind',
            hide: 'blind',
            height: 240,
            width: 600,
            open: function () {
                var IndividualStart12 = Text_ChallengeVarianteStart12.replace('XXX', '<b>' + Zugtext(NextMove.ZugKurz) + '</b>');
                $('#ChallengeVarianteStartText').html(IndividualStart11 + '<br>' + IndividualStart12);
            },
            buttons: [
                {
                    id:     'VarianteSpielenStart',
                    text:   'Spielen',
                    click:  function() {
                                // Der Spieler hat sich für diese Variante entschieden
                                VariationsLevelCounter[NextMove.ZugLevel]++;
                                ChallengeVariantestartDialog.dialog('close');
                                processSingleChallengeStartOfferAnswer.resolve({ weiter: ANSWERVARIANTE, zug: NextMove.CurMoveId});
                            }
                }
                ,
                {
                    id:     'VarianteAbbrechenStart',
                    text:   'Ignorieren',
                    click:  function() {
                                ChallengeVariantestartDialog.dialog('close');
                                processSingleChallengeStartOffer(HauptZugKurz); // Rekursion, kein resolve oder reject
                            }
                }
            ]                
        });

    } else {
        ChallengeHauptzugDialog = $( "#dialog_ChallengeHauptzug" ).dialog({
            title: "Hauptzug spielen",
            modal: true,
            draggable: false,
            resizable: false,
            position: { my: "left top", at: "left top", of: "#h_AufgabenSpielen" },
            show: 'blind',
            hide: 'blind',
            height: 200,
            width: 600,
            open: function () {
                //var IndividualStart12 = Text_PlayerVarianteStart12.replace('XXX', '<b>' + Zugtext(NextMove.ZugKurz) + '</b>');
                //$('#PlayerVarianteStartText').html(IndividualStart11 + '<br>' + IndividualStart12);
            },
            buttons: [
                {
                    id:     'Hauptzugspielen',
                    text:   'Weiter',
                    click:  function() {                        // 
                        NextMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['CurMoveId'] == LastStackElement.CurMove; })[0];
                        ChallengeHauptzugDialog.dialog('close');
                        processSingleChallengeStartOfferAnswer.resolve({ weiter: ANSWERHAUPTZUG, zug: LastStackElement.CurMove});
                    }
                }
            ]                
        });
    }
    return processSingleChallengeStartOfferAnswer.promise();
}

function processSinglePlayerEndeOffer(LetzterZug) { 

    console.log('Beginn in ' + getFuncName());
    var LastStackElement = Stellungsdaten.ZugStack.pop();

    if(LastStackElement.ChildMove != "") { // Nur dann wurde eine Variante aus dem Stack geholt

        var IndividualWechsel11 = Text_PlayerVarianteWechsel11.replace('XXX', '<b>' + Zugtext(LetzterZug.ZugKurz) + '</b>');
        NextMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['CurMoveId'] == LastStackElement.ChildMove; })[0];

        PlayerVarianteWechselDialog = $( "#dialog_PlayerVarianteWechsel" ).dialog({
            title: "Spielervariante wechseln",
            modal: true,
            draggable: false,
            resizable: false,
            position: { my: "left top", at: "left top", of: "#h_AufgabenSpielen" },
            show: 'blind',
            hide: 'blind',
            height: 240,
            width: 600,
            open: function () {
                var IndividualWechsel12 = Text_PlayerVarianteWechsel12.replace('XXX', '<b>' + Zugtext(NextMove.ZugKurz) + '</b>');
                $('#PlayerVarianteWechselText').html(IndividualWechsel11 + '<br>' + IndividualWechsel12);
            },
            buttons: [
                {
                    id:     'VarianteSpielenWechsel',
                    text:   'Spielen',
                    click:  function() {
                            // Der Spieler hat sich für diese Variante entschieden
                            VariationsLevelCounter[NextMove.ZugLevel]++;

                            PlayerVarianteWechselDialog.dialog('close');
                            processSinglePlayerEndeOfferAnswer.resolve({ weiter: ANSWERVARIANTE, zug: LastStackElement});
                            }
                }
                ,
                {
                    id:     'VarianteAbbrechenWechsel',
                    text:   'Ignorieren',
                    click:  function() {
                        PlayerVarianteWechselDialog.dialog('close');
                                processSinglePlayerEndeOffer(LetzterZug);
                            }
                }
            ]                
        });

    } else {

        var IndividualEnde11 = Text_PlayerVarianteEnde11.replace('XXX', '<b>' + Zugtext(LetzterZug.ZugKurz) + '</b>');
        EndeMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['CurMoveId'] == LastStackElement.CurMove; })[0];

        PlayerVarianteEndeDialog = $( "#dialog_PlayerVarianteEnde" ).dialog({
            title: "Spielervariante beenden",
            modal: true,
            draggable: false,
            resizable: false,
            position: { my: "left top", at: "left top", of: "#h_AufgabenSpielen" },
            show: 'blind',
            hide: 'blind',
            height: 240,
            width: 600,
            open: function () {
                var IndividualEnde12 = Text_PlayerVarianteEnde12.replace('XXX', '<b>' + Zugtext(EndeMove.ZugKurz) + '</b>');
                $('#PlayerVarianteEndeText').html(IndividualEnde11 + '<br>' + IndividualEnde12);
            },
            buttons: [
                {
                    id:     'VarianteSpielenEnde',
                    text:   'Spielen',
                    click:  function() {
                                // Der Spieler hat sich für diese Variante entschieden
                                VariationsLevelCounter[EndeMove.ZugLevel]--;
    
                                PlayerVarianteEndeDialog.dialog('close');
                                // resolve oder reject? Was ist richtiger?
                                processSinglePlayerEndeOfferAnswer.reject({ weiter: ANSWERHAUPTZUG, zug: LastStackElement});
                            }
                }
                // ,
                // {
                //     id:     'VarianteAbbrechen',
                //     text:   'Ignorieren',
                //     click:  function() {
                //                 ChallengeVarianteWechselDialog.dialog('close');
                //                 processSingleEndeOffer(LetzterZug);
                //             }
                // }
            ]                
        });

    }
    return processSinglePlayerEndeOfferAnswer.promise();
}

// Bietet den jeweils letzten im Stack gespeicherten Zug im Dialog an
// Angebotene Züge sind danach nicht mehr im Stack
// Die Funktion gibt lediglich die vom Spieler gewählte ZugId zurück (ändert keine Daten)
function processSingleEngineEndeOffer(LetzterZug) {

    console.log('Beginn in ' + getFuncName());
    var LastStackElement = Stellungsdaten.ZugStack.pop();

    if(LastStackElement.ChildMove != "") { // Nur dann wurde eine Variante aus dem Stack geholt

        var IndividualWechsel11 = Text_ChallengeVarianteWechsel11.replace('XXX', '<b>' + Zugtext(LetzterZug.ZugKurz) + '</b>');
        NextMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['CurMoveId'] == LastStackElement.ChildMove; })[0];

        ChallengeVarianteWechselDialog = $( "#dialog_ChallengeVarianteWechsel" ).dialog({
            title: "Variante wechseln",
            modal: true,
            draggable: false,
            resizable: false,
            position: { my: "left top", at: "left top", of: "#h_AufgabenSpielen" },
            show: 'blind',
            hide: 'blind',
            height: 240,
            width: 600,
            open: function () {
                var IndividualWechsel12 = Text_ChallengeVarianteWechsel12.replace('XXX', '<b>' + Zugtext(NextMove.ZugKurz) + '</b>');
                $('#ChallengeVarianteWechselText').html(IndividualWechsel11 + '<br>' + IndividualWechsel12);
            },
            buttons: [
                {
                    id:     'VarianteSpielenWechsel',
                    text:   'Spielen',
                    click:  function() {
                            // Der Spieler hat sich für diese Variante entschieden
                            VariationsLevelCounter[NextMove.ZugLevel]++;

                            // TransferZugdaten(Stellungsdaten, NextMove);
                            // UpdateTreeNode('TreeNotationslistePlayChallenge', 'move', Stellungsdaten, NextMove, true);
                            // TransferZugdaten(Stellungsdaten, LetzterZug);

                            ChallengeVarianteWechselDialog.dialog('close');
                            processSingleEngineEndeOfferAnswer.resolve({ weiter: ANSWERVARIANTE, zug: LastStackElement});
                            }
                }
                ,
                {
                    id:     'VarianteAbbrechenWechsel',
                    text:   'Ignorieren',
                    click:  function() {
                                ChallengeVarianteWechselDialog.dialog('close');
                                processSingleEngineEndeOffer(LetzterZug);
                            }
                }
            ]                
        });

    } else {

        var IndividualEnde11 = Text_ChallengeVarianteEnde11.replace('XXX', '<b>' + Zugtext(LetzterZug.ZugKurz) + '</b>');
        EndeMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['CurMoveId'] == LastStackElement.CurMove; })[0];

        ChallengeVarianteEndeDialog = $( "#dialog_ChallengeVarianteEnde" ).dialog({
            title: "Variante beenden",
            modal: true,
            draggable: false,
            resizable: false,
            position: { my: "left top", at: "left top", of: "#h_AufgabenSpielen" },
            show: 'blind',
            hide: 'blind',
            height: 240,
            width: 600,
            open: function () {
                var IndividualEnde12 = Text_ChallengeVarianteEnde12.replace('XXX', '<b>' + Zugtext(EndeMove.ZugKurz) + '</b>');
                $('#ChallengeVarianteEndeText').html(IndividualEnde11 + '<br>' + IndividualEnde12);
            },
            buttons: [
                {
                    id:     'VarianteSpielenEnde',
                    text:   'Spielen',
                    click:  function() {
                                // Der Spieler hat sich für diese Variante entschieden
                                VariationsLevelCounter[EndeMove.ZugLevel]--;

                                // TransferZugdaten(Stellungsdaten, EndeMove);
                                // //var Update_Stellungsdaten = Object.assign({}, Stellungsdaten);
                                // Stellungsdaten.CurNodeId = LastStackElement.CurNode;
                                // UpdateTreeNode('TreeNotationslistePlayChallenge', 'move', Stellungsdaten, EndeMove, true);
                                // TransferZugdaten(Stellungsdaten, LetzterZug);
    
                                ChallengeVarianteEndeDialog.dialog('close');
                                // resolve oder reject? Was ist richtiger?
                                processSingleEngineEndeOfferAnswer.reject({ weiter: ANSWERHAUPTZUG, zug: LastStackElement});
                            }
                }
                // ,
                // {
                //     id:     'VarianteAbbrechen',
                //     text:   'Ignorieren',
                //     click:  function() {
                //                 ChallengeVarianteWechselDialog.dialog('close');
                //                 processSingleEndeOffer(LetzterZug);
                //             }
                // }
            ]                
        });
    }


    return processSingleEngineEndeOfferAnswer.promise();
}