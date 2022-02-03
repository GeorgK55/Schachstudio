function ExecuteDialog_PlayerVariantestart(P_Zug, Zug) {

    var PlayerStartAnswer = $.Deferred();

    PlayerVariantestartDialog = $( "#dialog_PlayerVarianteStart" ).dialog({
        title: "Varianten zuerst spielen",
        position: { my: "left top", at: "left top", of: "#h_AufgabenSpielen" },
        height: 220,
        width: 500,
        modal: true,
        open: function () {
            //$("#PlayerVarianteStartZug").html(V.ZugKurz);
            var IndividualStart11 = Text_PlayerVarianteStart11.replace('XXX', '<b>' + P_Zug.ZugKurz + '</b>');
            var IndividualStart12 = Text_PlayerVarianteStart12.replace('XXX', '<b>' + Zug.ZugKurz + '</b>');
            $('#PlayerVarianteStartText').html(IndividualStart11 + '<br>' + IndividualStart12);
        },
        buttons: [
            {
                id:     'VarianteSpielen',
                text:   'Spielen',
                click:  function() {
                            $( "#PlayerVarianteStartZug" ).empty();
                            PlayerVariantestartDialog.dialog('close');
                            PlayerStartAnswer.resolve('spielen');
                        }
            }
            ,
            {
                id:     'VarianteIgnorieren',
                text:   'Ignorieren',
                click:  function() { 
                            $( "#PlayerVarianteStartText" ).empty();
                            PlayerVariantestartDialog.dialog('close');
                            PlayerStartAnswer.reject('ignorieren');
                        }
            }
        ]
    });

    return PlayerStartAnswer.promise();
}

// function ExecuteDialog_ChallengeVariantestart(C_Zug, Zug) {

//     var ChallengeStartAnswer = new $.Deferred();

//     ChallengeVariantestartDialog = $( "#dialog_ChallengeVarianteStart" ).dialog({
//         title: "Variante zuerst spielen",
//         position: { my: "left top", at: "left top", of: "#h_AufgabenSpielen" },
//         height: 220,
//         width: 550,
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

function ExecuteDialog_PlayerVarianteende() {

    var PlayerEndeAnswer = $.Deferred();

    PlayerVarianteendeDialog = $( "#dialog_PlayerVarianteEnde" ).dialog({
        title: "Varianten beenden",
        position: { my: "left top", at: "left top", of: "#h_AufgabenSpielen" },
        height: 220,
        width: 500,
        modal: true,
        open: function () {
            //$("#PlayerVarianteStartZug").html(V.ZugKurz);
            var IndividualStart11 = Text_PlayerVarianteStart11.replace('XXX', '<b>' + P_Zug.ZugKurz + '</b>');
            var IndividualStart12 = Text_PlayerVarianteStart12.replace('XXX', '<b>' + Zug.ZugKurz + '</b>');
            $('#PlayerVarianteStartText').html(IndividualStart11 + '<br>' + IndividualStart12);
        },
        buttons: [
            {
                id:     'VarianteSpielen',
                text:   'Spielen',
                click:  function() {
                            $( "#PlayerVarianteStartZug" ).empty();
                            PlayerVariantestartDialog.dialog('close');
                            PlayerStartAnswer.resolve('spielen');
                        }
            }
            ,
            {
                id:     'VarianteIgnorieren',
                text:   'Ignorieren',
                click:  function() { 
                            $( "#PlayerVarianteStartText" ).empty();
                            PlayerVariantestartDialog.dialog('close');
                            PlayerStartAnswer.reject('ignorieren');
                        }
            }
        ]
    });

    return PlayerEndeAnswer.promise();

}

function ExecuteDialog_StopScriptTest(idx, Zug) {

    var StopScriptTestAnswer = new $.Deferred();

    StopScriptTestDialog = $( "#dialog_StopScriptTest" ).dialog({
        title: "Stop Srcipt Test",
        position: { my: "left top", at: "left top", of: "#h_AufgabenSpielen" },
        height: 220,
        width: 550,
        modal: true,
        open: function () {
            // var IndividualStart11 = Text_ChallengeVarianteStart11.replace('XXX', '<b>' + C_Zug.ZugKurz + '</b>');
            // var IndividualStart12 = Text_ChallengeVarianteStart12.replace('XXX', '<b>' + Zug.ZugKurz + '</b>');
            // $('#ChallengeVarianteStartText').html(IndividualStart11 + '<br>' + IndividualStart12);
        },
        buttons: [
            {
                id:     'VarianteSpielen',
                text:   'Spielen',
                click:  function() {
                            $( "#dialog_StopScriptTest" ).empty();
                            StopScriptTestDialog.dialog('close');
                            StopScriptTestAnswer.resolve('spielen');
                        }
            }
            ,
            {
                id:     'VarianteAbbrechen',
                text:   'Ignorieren',
                click:  function() {
                            $( "#dialog_StopScriptTest" ).empty();
                            StopScriptTestDialog.dialog('close');
                            StopScriptTestAnswer.reject('ignorieren');
                        }
            }
        ]
    });
    return StopScriptTestAnswer.promise();

}

// Bietet den jeweils letzten im Stack gespeicherten Zug im Dialog an
// Angebotene Züge sind danach nicht mehr im Stack
// Die Funktion gibt lediglich die vom Spieler gewählte ZugId zurück (ändert keine Daten)
function processSingleStartOffer(HauptZug) {

    var IndividualStart11 = Text_ChallengeVarianteStart11.replace('XXX', '<b>' + HauptZug.ZugKurz + '</b>');

    if(fetchStack(Stellungsdaten, false)) { 
    NextMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['CurMoveId'] == Stellungsdaten.ChildMoveId; })[0];

        ChallengeVariantestartDialog = $( "#dialog_ChallengeVarianteStart" ).dialog({
            title: "Variante zuerst spielen",
            modal: true,
            draggable: false,
            resizable: false,
            position: { my: "left top", at: "left top", of: "#h_AufgabenSpielen" },
            show: 'blind',
            hide: 'blind',
            height: 220,
            width: 550,
            open: function () {
                var IndividualStart12 = Text_ChallengeVarianteStart12.replace('XXX', '<b>' + NextMove.ZugKurz + '</b>');
                $('#ChallengeVarianteStartText').html(IndividualStart11 + '<br>' + IndividualStart12);
            },
            buttons: [
                {
                    id:     'VarianteSpielen',
                    text:   'Spielen',
                    click:  function() {
                                // Der Spieler hat sich für diese Variante entschieden
                                ChallengeVariantestartDialog.dialog('close');
                                processSingleStartOfferAnswer.resolve({ aktion: 'spielen', zug: NextMove.CurMoveId});
                            }
                }
                ,
                {
                    id:     'VarianteAbbrechen',
                    text:   'Ignorieren',
                    click:  function() {
                                ChallengeVariantestartDialog.dialog('close');
                                processSingleStartOffer(Zug);
                            }
                }
            ]                
        });

    } else {
        processSingleStartOfferAnswer.reject('Kein Zug im Stack');
    }


    return processSingleStartOfferAnswer.promise();
}

// Bietet den jeweils letzten im Stack gespeicherten Zug im Dialog an
// Angebotene Züge sind danach nicht mehr im Stack
// Die Funktion gibt lediglich die vom Spieler gewählte ZugId zurück (ändert keine Daten)
function processSingleEndeOffer(LetzterZug) {

    var IndividualEnde11 = Text_ChallengeVarianteEnde11.replace('XXX', '<b>' + LetzterZug.ZugKurz + '</b>');

    if(fetchStack(Stellungsdaten, true)) { 

        Stellungsdaten.ZugLevel--; // fetchStack kennt den ZugLevel nicht

        NextMove = $.grep(ChallengeMoves, function(PMI, i) { return PMI['PreMoveId'] == Stellungsdaten.PreMoveId && parseInt(PMI['ZugLevel']) == parseInt(Stellungsdaten.ZugLevel); })[0];

        ChallengeVarianteendeDialog = $( "#dialog_ChallengeVarianteEnde" ).dialog({
            title: "Variante zuerst spielen",
            modal: true,
            draggable: false,
            resizable: false,
            position: { my: "left top", at: "left top", of: "#h_AufgabenSpielen" },
            show: 'blind',
            hide: 'blind',
            height: 220,
            width: 550,
            open: function () {
                var IndividualEnde12 = Text_ChallengeVarianteEnde12.replace('XXX', '<b>' + NextMove.ZugKurz + '</b>');
                $('#ChallengeVarianteEndeText').html(IndividualEnde11 + '<br>' + IndividualEnde12);
            },
            buttons: [
                {
                    id:     'VarianteSpielen',
                    text:   'Spielen',
                    click:  function() {
                                // Der Spieler hat sich für diese Variante entschieden
                            ChallengeVarianteendeDialog.dialog('close');
                            processSingleEndeOfferAnswer.resolve({ aktion: 'spielen', zug: NextMove.CurMoveId});
                            }
                }
                ,
                {
                    id:     'VarianteAbbrechen',
                    text:   'Ignorieren',
                    click:  function() {
                                ChallengeVarianteendeDialog.dialog('close');
                                processSingleEndeOffer(Zug);
                            }
                }
            ]                
        });

    } else {
        processSingleEndeOfferAnswer.reject('Kein Zug im Stack');
    }


    return processSingleEndeOfferAnswer.promise();
}