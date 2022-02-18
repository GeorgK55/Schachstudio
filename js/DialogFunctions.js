function processSinglePlayerStartOffer(HauptZugKurz) {

    var LastStackElement = Stellungsdaten.ZugStack.pop();

    if(LastStackElement.ChildMove != "") { // Nur dann wurde eine Variante (<>Hauptzug) aus dem Stack geholt

        var IndividualStart11 = Text_PlayerVarianteStart11.replace('XXX', '<b>' + HauptZugKurz + '</b>');
        NextMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['CurMoveId'] == LastStackElement.ChildMove; })[0];

        PlayerVariantestartDialog = $( "#dialog_PlayerVarianteStart" ).dialog({
            title: "Variante zuerst ziehen",
            modal: true,
            draggable: false,
            resizable: false,
            position: { my: "left top", at: "left top", of: "#h_AufgabenSpielen" },
            show: 'blind',
            hide: 'blind',
            height: 240,
            width: 600,
            open: function () {
                var IndividualStart12 = Text_PlayerVarianteStart12.replace('XXX', '<b>' + NextMove.ZugKurz + '</b>');
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
                //var IndividualStart12 = Text_PlayerVarianteStart12.replace('XXX', '<b>' + NextMove.ZugKurz + '</b>');
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
            title: "Variante zuerst spielen",
            modal: true,
            draggable: false,
            resizable: false,
            position: { my: "left top", at: "left top", of: "#h_AufgabenSpielen" },
            show: 'blind',
            hide: 'blind',
            height: 240,
            width: 600,
            open: function () {
                var IndividualStart12 = Text_ChallengeVarianteStart12.replace('XXX', '<b>' + NextMove.ZugKurz + '</b>');
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
                //var IndividualStart12 = Text_PlayerVarianteStart12.replace('XXX', '<b>' + NextMove.ZugKurz + '</b>');
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

}

// Bietet den jeweils letzten im Stack gespeicherten Zug im Dialog an
// Angebotene Züge sind danach nicht mehr im Stack
// Die Funktion gibt lediglich die vom Spieler gewählte ZugId zurück (ändert keine Daten)
function processSingleChallengeEndeOffer(LetzterZug) {

    console.log('Beginn in ' + getFuncName());
    var LastStackElement = Stellungsdaten.ZugStack.pop();

    if(LastStackElement.ChildMove != "") { // Nur dann wurde eine Variante aus dem Stack geholt

        var IndividualWechsel11 = Text_ChallengeVarianteWechsel11.replace('XXX', '<b>' + LetzterZug.ZugKurz + '</b>');
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
                var IndividualWechsel12 = Text_ChallengeVarianteWechsel12.replace('XXX', '<b>' + NextMove.ZugKurz + '</b>');
                $('#ChallengeVarianteWechselText').html(IndividualWechsel11 + '<br>' + IndividualWechsel12);
            },
            buttons: [
                {
                    id:     'VarianteSpielenWechsel',
                    text:   'Spielen',
                    click:  function() {
                            // Der Spieler hat sich für diese Variante entschieden
                            VariationsLevelCounter[NextMove.ZugLevel]++;
                            ChallengeVarianteWechselDialog.dialog('close');
                            processSingleChallengeEndeOfferAnswer.resolve({ weiter: ANSWERVARIANTE, zug: LastStackElement});
                            }
                }
                ,
                {
                    id:     'VarianteAbbrechenWechsel',
                    text:   'Ignorieren',
                    click:  function() {
                                ChallengeVarianteWechselDialog.dialog('close');
                                processSingleChallengeEndeOffer(LetzterZug);
                            }
                }
            ]                
        });

    } else {

        var IndividualEnde11 = Text_ChallengeVarianteEnde11.replace('XXX', '<b>' + LetzterZug.ZugKurz + '</b>');

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
                var IndividualEnde12 = Text_ChallengeVarianteEnde12.replace('XXX', '<b>' + EndeMove.ZugKurz + '</b>');
                $('#ChallengeVarianteEndeText').html(IndividualEnde11 + '<br>' + IndividualEnde12);
            },
            buttons: [
                {
                    id:     'VarianteSpielenEnde',
                    text:   'Spielen',
                    click:  function() {
                                // Der Spieler hat sich für diese Variante entschieden
                                VariationsLevelCounter[EndeMove.ZugLevel]--;
                                ChallengeVarianteEndeDialog.dialog('close');
                                // resolve oder reject? Was ist richtiger?
                                processSingleChallengeEndeOfferAnswer.reject({ weiter: ANSWERHAUPTZUG, zug: LastStackElement});
                            }
                }
                // ,
                // {
                //     id:     'VarianteAbbrechen',
                //     text:   'Ignorieren',
                //     click:  function() {
                //                 ChallengeVarianteWechselDialog.dialog('close');
                //                 processSingleChallengeEndeOffer(LetzterZug);
                //             }
                // }
            ]                
        });

        //processSingleChallengeEndeOfferAnswer.reject({ aktion: 'fertig', zug: LastStackElement.CurMove});
    }


    return processSingleChallengeEndeOfferAnswer.promise();
}


// function ExecuteDialog_PlayerVariantestart(P_Zug, Zug) {

//     var PlayerStartAnswer = $.Deferred();

//     PlayerVariantestartDialog = $( "#dialog_PlayerVarianteStart" ).dialog({
//         title: "Varianten zuerst spielen",
//         position: { my: "left top", at: "left top", of: "#h_AufgabenSpielen" },
//         height: 240,
//         width: 500,
//         modal: true,
//         open: function () {
//             //$("#PlayerVarianteStartZug").html(V.ZugKurz);
//             var IndividualStart11 = Text_PlayerVarianteStart11.replace('XXX', '<b>' + P_Zug.ZugKurz + '</b>');
//             var IndividualStart12 = Text_PlayerVarianteStart12.replace('XXX', '<b>' + Zug.ZugKurz + '</b>');
//             $('#PlayerVarianteStartText').html(IndividualStart11 + '<br>' + IndividualStart12);
//         },
//         buttons: [
//             {
//                 id:     'VarianteSpielen',
//                 text:   'Spielen',
//                 click:  function() {
//                             $( "#PlayerVarianteStartZug" ).empty();
//                             PlayerVariantestartDialog.dialog('close');
//                             PlayerStartAnswer.resolve('spielen');
//                         }
//             }
//             ,
//             {
//                 id:     'VarianteIgnorieren',
//                 text:   'Ignorieren',
//                 click:  function() { 
//                             $( "#PlayerVarianteStartText" ).empty();
//                             PlayerVariantestartDialog.dialog('close');
//                             PlayerStartAnswer.reject('ignorieren');
//                         }
//             }
//         ]
//     });

//     return PlayerStartAnswer.promise();
// }

// function ExecuteDialog_PlayerVarianteende() {

//     var PlayerEndeAnswer = $.Deferred();

//     PlayerVarianteendeDialog = $( "#dialog_PlayerVarianteEnde" ).dialog({
//         title: "Varianten beenden",
//         position: { my: "left top", at: "left top", of: "#h_AufgabenSpielen" },
//         height: 240,
//         width: 500,
//         modal: true,
//         open: function () {
//             //$("#PlayerVarianteStartZug").html(V.ZugKurz);
//             var IndividualStart11 = Text_PlayerVarianteStart11.replace('XXX', '<b>' + P_Zug.ZugKurz + '</b>');
//             var IndividualStart12 = Text_PlayerVarianteStart12.replace('XXX', '<b>' + Zug.ZugKurz + '</b>');
//             $('#PlayerVarianteStartText').html(IndividualStart11 + '<br>' + IndividualStart12);
//         },
//         buttons: [
//             {
//                 id:     'VarianteSpielen',
//                 text:   'Spielen',
//                 click:  function() {
//                             $( "#PlayerVarianteStartZug" ).empty();
//                             PlayerVariantestartDialog.dialog('close');
//                             PlayerStartAnswer.resolve('spielen');
//                         }
//             }
//             ,
//             {
//                 id:     'VarianteIgnorieren',
//                 text:   'Ignorieren',
//                 click:  function() { 
//                             $( "#PlayerVarianteStartText" ).empty();
//                             PlayerVariantestartDialog.dialog('close');
//                             PlayerStartAnswer.reject('ignorieren');
//                         }
//             }
//         ]
//     });

//     return PlayerEndeAnswer.promise();

// }


// function ExecuteDialog_ChallengeVariantestart(C_Zug, Zug) {

//     var ChallengeStartAnswer = new $.Deferred();

//     ChallengeVariantestartDialog = $( "#dialog_ChallengeVarianteStart" ).dialog({
//         title: "Variante zuerst spielen",
//         position: { my: "left top", at: "left top", of: "#h_AufgabenSpielen" },
//         height: 240,
//         width: 600,
//         modal: true,
//         open: function () {
//             var IndividualStart11 = Text_ChallengeVarianteStart11.replace('XXX', '<b>' + C_Zug.ZugKurz + '</b>');
//             var IndividualStart12 = Text_ChallengeVarianteStart12.replace('XXX', '<b>' + Zug.ZugKurz + '</b>');
//             $('#ChallengeVarianteStartText').html(IndividualStart11 + '<br>' + IndividualStart12);
//         },
//         buttons: [
//             {
//                 id:     'VarianteSpielen',
//                 text:   'Spielen',
//                 click:  function() {
//                             ChallengeVariantestartDialog.dialog('close');
//                             ChallengeStartAnswer.resolve('spielen');
//                         }
//             }
//             ,
//             {
//                 id:     'VarianteAbbrechen',
//                 text:   'Ignorieren',
//                 click:  function() {
//                             ChallengeVariantestartDialog.dialog('close');
//                             ChallengeStartAnswer.reject('ignorieren');
//                         }
//             }
//         ]
//     });
//     return ChallengeStartAnswer.promise();
// }
// function ExecuteDialog_StopScriptTest(idx, Zug) {

//     var StopScriptTestAnswer = new $.Deferred();

//     StopScriptTestDialog = $( "#dialog_StopScriptTest" ).dialog({
//         title: "Stop Srcipt Test",
//         position: { my: "left top", at: "left top", of: "#h_AufgabenSpielen" },
//         height: 240,
//         width: 600,
//         modal: true,
//         open: function () {
//             // var IndividualStart11 = Text_ChallengeVarianteStart11.replace('XXX', '<b>' + C_Zug.ZugKurz + '</b>');
//             // var IndividualStart12 = Text_ChallengeVarianteStart12.replace('XXX', '<b>' + Zug.ZugKurz + '</b>');
//             // $('#ChallengeVarianteStartText').html(IndividualStart11 + '<br>' + IndividualStart12);
//         },
//         buttons: [
//             {
//                 id:     'VarianteSpielen',
//                 text:   'Spielen',
//                 click:  function() {
//                             $( "#dialog_StopScriptTest" ).empty();
//                             StopScriptTestDialog.dialog('close');
//                             StopScriptTestAnswer.resolve('spielen');
//                         }
//             }
//             ,
//             {
//                 id:     'VarianteAbbrechen',
//                 text:   'Ignorieren',
//                 click:  function() {
//                             $( "#dialog_StopScriptTest" ).empty();
//                             StopScriptTestDialog.dialog('close');
//                             StopScriptTestAnswer.reject('ignorieren');
//                         }
//             }
//         ]
//     });
//     return StopScriptTestAnswer.promise();

// }

