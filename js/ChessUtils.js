// Eine Stellung wird aufgebaut, indem die FEN-Zeilen in die div übertragen werden
function ErzeugeTooltip(Situation, BrettArray, TooltipId, Farbe) {

    var FEN_rows;
    if (Farbe == WEISSAMZUG) {
        FEN_rows = Situation.FEN_w.split(" ")[0].split("/");
    } else {
        FEN_rows = Situation.FEN_b.split(" ")[0].split("/");
    }

    var i, k;
    var Brett_idx = 0;
    var returnstring = '';

    for (i = 0; i < 8; i++) {
        var FEN_row = FEN_rows[i]; // Zeile extrahieren
        FileCounter = 0; // Zeigt auf die aktuelle Stelle in der Reihe
        var j; // die Stellen in der FEN-Zeile
        for (j = 0; j < FEN_row.length; j++) {
            // Bei einer Zahl in der FEN-Zeile einfach hochzählen (das sind Felder ohne Figuren)
            if($.isNumeric(FEN_row[j])) {
                FileCounter = parseInt(FEN_row[j]);
                for (k = 0; k < FileCounter; k++) {
                    returnstring += BrettArray[Brett_idx];
                    //console.log('Brett_idx: ' + Brett_idx + ' k:' + k);
                    Brett_idx++;
                }                
            } else {
                //console.log('Brett_idx: ' + Brett_idx + ' i:' + i + ' j: ' + j);
                switch (FEN_row[j])
                {
                    case 'P': 
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.P + '<'); break; }
                    case 'p':
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.p + '<'); break; }
                    case 'K': 
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.K + '<'); break; }
                     case 'k':
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.k + '<'); break; }
                    case 'Q': 
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.Q + '<'); break; }
                     case 'q':
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.q + '<'); break; }
                    case 'R': 
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.R + '<'); break; }
                     case 'r':
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.r + '<'); break; }
                    case 'N': 
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.N + '<'); break; }
                     case 'n':
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.n + '<'); break; }
                    case 'B': 
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.B + '<'); break; }
                     case 'b':
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.b + '<'); break; }
                 }
                 Brett_idx++;
            }
        } 
    } 
    $('#tooltips').append( "<div class='chessboardMini' id='" + TooltipId + "'>"+ returnstring + "</div>");
}

// Eine Stellung wird aufgebaut, indem die FEN-Zeilen in die div übertragen werden
function MiniStellungAufbauen(BrettArray, FEN) {

    var FEN_rows = FEN.split("/"); // Jede Zeile wird getrennt übertragen
    var files = ("abcdefgh").split(''); // das wird dann Teil des jquery-Identifikators. Für die Zahlen ist das ja nicht nötig

    var i, k;
    var Brett_idx = 0;
    var returnstring = '';

    for (i = 0; i < 8; i++) {
        var FEN_row = FEN_rows[i]; // Zeile extrahieren
        FileCounter = 0; // Zeigt auf die aktuelle Stelle in der Reihe
        var j; // die Stellen in der FEN-Zeile
        for (j = 0; j < FEN_row.length; j++) {
            // Bei einer Zahl in der FEN-Zeile einfach hochzählen (das sind Felder ohne Figuren)
            if($.isNumeric(FEN_row[j])) {
                FileCounter += parseInt(FEN_row[j]);
                for (k = 0; k < FileCounter; k++) {
                    returnstring += BrettArray[Brett_idx];
                }                
            } else {

                // Zusammenbauen des Feldnamens
                var rank = 8 - i; // FEN beginnt bei der achten Reihe
                var file = files[FileCounter];
                var Feldname = '_' + file + rank;

                // das Figursymbol in das div (=Feld) eintragen und dann gleich noch das span einfügen
                switch (FEN_row[j])
                {
                    case 'P': 
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.P + '<'); break; }
                    case 'p':
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.p + '<'); break; }
                    case 'K': 
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.K + '<'); break; }
                     case 'k':
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.k + '<'); break; }
                    case 'Q': 
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.Q + '<'); break; }
                     case 'q':
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.q + '<'); break; }
                    case 'R': 
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.R + '<'); break; }
                     case 'r':
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.r + '<'); break; }
                    case 'N': 
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.N + '<'); break; }
                     case 'n':
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.n + '<'); break; }
                    case 'B': 
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.B + '<'); break; }
                     case 'b':
                        { returnstring += BrettArray[Brett_idx].replace('><', '>' + FIGUREN.b + '<'); break; }
                 }
                FileCounter++;
            }
        } 
    } 
    return returnstring;
}

// Eine Stellung wird aufgebaut, indem die FEN-Zeilen in die div übertragen werden
function StellungAufbauen(div_Brett, FEN, ZugmarkerPräfix) {

    var FEN_rows = FEN.split("/"); // Jede Zeile wird getrennt übertragen
    var files = ("abcdefgh").split(''); // das wird dann Teil des jquery-Identifikators. Für die Zahlen ist das ja nicht nötig

	$('[id^=' + div_Brett + '_]').html('');

    var i;
    for (i = 0; i < 8; i++) {
        var FEN_row = FEN_rows[i]; // Zeile extrahieren
        FileCounter = 0; // Zeigt auf die aktuelle Stelle in der Reihe
        var j; // die Stellen in der FEN-Zeile
        for (j = 0; j < FEN_row.length; j++) {
            // Bei einer Zahl in der FEN-Zeile einfach hochzählen (das sind Felder ohne Figuren)
            if($.isNumeric(FEN_row[j])) 
                FileCounter += parseInt(FEN_row[j]);
            else {

                // Zusammenbauen des Feldnamens
                var rank = 8 - i; // FEN beginnt bei der achten Reihe
                var file = files[FileCounter];
                var Feldname = div_Brett + '_' + file + rank;

                // das Figursymbol in das div (=Feld) eintragen und dann gleich noch das span einfügen
                switch (FEN_row[j])
                {
                    case 'P': 
                        { $('#' + Feldname).html('<span id="P_'+file+rank+'">' + FIGUREN.P + '</span>'); break; }
                    case 'p':
                        { $('#' + Feldname).html('<span id="p_'+file+rank+'">' + FIGUREN.p + '</span>'); break; }
                    case 'K': 
                        { $('#' + Feldname).html('<span id="K_'+file+rank+'">' + FIGUREN.K + '</span>'); break; }
                     case 'k':
                        { $('#' + Feldname).html('<span id="k_'+file+rank+'">' + FIGUREN.k + '</span>'); break; }
                    case 'Q': 
                        { $('#' + Feldname).html('<span id="Q_'+file+rank+'">' + FIGUREN.Q + '</span>'); break; }
                     case 'q':
                        { $('#' + Feldname).html('<span id="q_'+file+rank+'">' + FIGUREN.q + '</span>'); break; }
                    case 'R': 
                        { $('#' + Feldname).html('<span id="R_'+file+rank+'">' + FIGUREN.R + '</span>'); break; }
                     case 'r':
                        { $('#' + Feldname).html('<span id="r_'+file+rank+'">' + FIGUREN.r + '</span>'); break; }
                    case 'N': 
                        { $('#' + Feldname).html('<span id="N_'+file+rank+'">' + FIGUREN.N + '</span>'); break; }
                     case 'n':
                        { $('#' + Feldname).html('<span id="n_'+file+rank+'">' + FIGUREN.n + '</span>'); break; }
                    case 'B': 
                        { $('#' + Feldname).html('<span id="B_'+file+rank+'">' + FIGUREN.B + '</span>'); break; }
                     case 'b':
                        { $('#' + Feldname).html('<span id="b_'+file+rank+'">' + FIGUREN.b + '</span>'); break; }
                }
                FileCounter++;
            }
        } 
    } 

    if(FEN.indexOf('w') > 0) {
        $('[id^=' + ZugmarkerPräfix + 'weiss]').show();
        $('[id^=' + ZugmarkerPräfix + 'schwarz]').hide();
    } else {
        $('[id^=' + ZugmarkerPräfix + 'weiss]').hide();
        $('[id^=' + ZugmarkerPräfix + 'schwarz]').show();
    }
}

//span verschieben, dabei Umwandlungen berücksichtigen und Rochaden separat behandeln
// Für Rochaden gibt es kein Flag, also den Zug direkt als Zeichenkette abfragen
function ZieheZug(objZug, BoardPräfix, ZugmarkerPräfix) {

    // Erkennt beide Rochaden, die werden im else behandelt
    if(objZug.ZugKurz.indexOf('0-0') == -1) {

        var Figursymbol, Figurname;

        if(objZug.ZugUmwandlung != "") {
            console.log('In objZug ungleich "": objZug.ZugUmwandlung = ' + objZug.ZugUmwandlung);
            FigursymbolIndex = objZug.ZugFarbe == WEISSAMZUG ? objZug.ZugUmwandlung : objZug.ZugUmwandlung.toLowerCase();
            Figursymbol = eval('FIGUREN.' + FigursymbolIndex);
            Figurname 	= objZug.ZugUmwandlung;
        } else if(objZug.ZugFigur.toUpperCase() == 'P' && (objZug.ZugNach.slice(-1) == '1' || objZug.ZugNach.slice(-1) == '8')) {
            console.log('In ZieheZug toUpperCase "": objZug.ZugNach.slice(-1) = ' + objZug.ZugNach.slice(-1));
            if(objZug.ZugFarbe == WEISSAMZUG) {
                Figursymbol             = FIGUREN.Q;
                Figurname               = 'Q';
                objZug.ZugUmwandlung    = 'Q';
             } else {
                Figursymbol             = FIGUREN.q;
                Figurname               = 'q';
                objZug.ZugUmwandlung    = 'q';
           }
        } else {
            Figursymbol = $('#' + BoardPräfix + objZug.ZugVon + ' :first-child').text(); // Figurzeichen retten
            Figurname 	= $('#' + BoardPräfix + objZug.ZugVon + ' :first-child')[0].id.slice(0, 1); // Gilt so für Bauern und Figuren            
        }
        $('#' + BoardPräfix + objZug.ZugVon).empty(); // Entfernt sowohl das Figurzeichen als auch das span
        $('#' + BoardPräfix + objZug.ZugNach).empty().append('<span id="' + Figurname + '_' + objZug.ZugNach + '">' + Figursymbol + '</span>');
    } else {
        if(objZug.ZugFarbe == WEISSAMZUG) {
            if (objZug.ZugOriginal.indexOf('0-0-0') == 0) {
                $('#' + BoardPräfix + 'e1').html(''); // Entfernt sowohl das Figurzeichen als auch das span
                $('#' + BoardPräfix + 'a1').html(''); // Entfernt sowohl das Figurzeichen als auch das span
                $('#' + BoardPräfix + 'c1').append('<span id="K_c1">' + FIGUREN.K + '</span>');
                $('#' + BoardPräfix + 'd1').append('<span id="R_d1">' + FIGUREN.R + '</span>');
            } else {
                $('#' + BoardPräfix + 'e1').html(''); // Entfernt sowohl das Figurzeichen als auch das span
                $('#' + BoardPräfix + 'h1').html(''); // Entfernt sowohl das Figurzeichen als auch das span
                $('#' + BoardPräfix + 'g1').append('<span id="K_g1">' + FIGUREN.K + '</span>');
                $('#' + BoardPräfix + 'f1').append('<span id="R_f1">' + FIGUREN.R + '</span>');
            }
        } else {
            if (objZug.ZugOriginal.indexOf('0-0-0') == 0) {
                $('#' + BoardPräfix + 'e8').html(''); // Entfernt sowohl das Figurzeichen als auch das span
                $('#' + BoardPräfix + 'a8').html(''); // Entfernt sowohl das Figurzeichen als auch das span
                $('#' + BoardPräfix + 'c8').append('<span id="k_c8">' + FIGUREN.k + '</span>');
                $('#' + BoardPräfix + 'd8').append('<span id="r_d8">' + FIGUREN.r + '</span>');
            } else {
                $('#' + BoardPräfix + 'e8').html(''); // Entfernt sowohl das Figurzeichen als auch das span
                $('#' + BoardPräfix + 'h8').html(''); // Entfernt sowohl das Figurzeichen als auch das span
                $('#' + BoardPräfix + 'g8').append('<span id="k_g8">' + FIGUREN.k + '</span>');
                $('#' + BoardPräfix + 'f8').append('<span id="r_f8">' + FIGUREN.r + '</span>');
            }
        }
    }

    if(objZug.ZugFarbe == WEISSAMZUG) {
        $('[id^=' + ZugmarkerPräfix + 'weiss]').hide();
        $('[id^=' + ZugmarkerPräfix + 'schwarz]').show();
    } else {
        $('[id^=' + ZugmarkerPräfix + 'weiss]').show();
        $('[id^=' + ZugmarkerPräfix + 'schwarz]').hide();
    }
}

// Das Zeichen für matt kommt in einem eigenen Aufruf (die Engine stellt das matt erst bei der Suche nach dem nächsten Zug fest)
function SchreibeZug(Tabellenname) {

    console.log('SchreibeZug für: ' + T_Zuege.ZugFarbe);
    console.log(JSON.stringify(T_Zuege));

    if(Tabellenname == 'NotationstabelleAufgabe' || Tabellenname == 'NotationslisteImport') {

        console.log($("#" + Tabellenname + " td:not([data-fen])").length);

        if(T_Zuege.ZugFarbe == WEISSAMZUG) {

            if(T_Zuege.ZugZeichen == MATT) {
                $('<span>' + MATT + '</span>').appendTo($('#' + Tabellenname + ' td:nth-last-child(2)').last());
                console.log('matt mit: ');
            } else {
                addNewNotationLine(Tabellenname, Importdaten.ZugNummer);
                //$('#' + Tabellenname).append('<tr><td data-fen="' + Importdaten.ZugNummer + '"></td></td><td data-fen="' + T_Zuege.FEN + '" onclick="jumpToPosition();">' + getMoveNotations(T_Zuege.FEN, T_Zuege.ZugStockfish, "kurz") + '</td><td onclick="jumpToPosition();"></td></tr>');
                // Wenn mal per Klick eine gespielte Stellung angesprungen werden soll
                // Ist hier nur der Anfang und nur für weiß. Die Rekonstruktion ist noch nicht vollständig
                //var tdstring = '<tr><td data-fen="' + T_Zuege.FEN + '" onclick="StellungAufbauen(\'Brett_SpieleAufgabe\', \'' + T_Zuege.FEN + '\');">' + getMoveNotations(T_Zuege.FEN, T_Zuege.ZugStockfish, "kurz") + '</td><td></td></tr>'
                //$('#' + Tabellenname).append(tdstring); oder andersrum?
            }
         } else {
            if(T_Zuege.ZugZeichen == MATT) { 
                $('<span>' + MATT + '</span>').appendTo($('#' + Tabellenname + ' td:nth-last-child(3)').last());
            } else {
                $("#" + Tabellenname + " td:not([data-fen])").html(getMoveNotations(T_Zuege.FEN, T_Zuege.ZugStockfish, "kurz")).attr("data-fen", T_Zuege.FEN);
            }

        }
    } 
}

function BrettLeeren(div_Brett) {

    $('[id^=' + div_Brett + '_]').html('');
    
}

function jumpToPosition(FEN) {
window.open("",'x','width=200,height=200,toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=no,resizable=0');
}

function xjumpToPosition(FEN) {
    var ii = 0;

    MiniPosition = $( "#dialog_Miniboard" ).dialog({
        title: "Falscher Zug",
        height: 200,
        width: 200,
        modal: false,
        open: function () {
            //alert('dialog_Miniboard open');
        }
        /*,
        buttons: {
            Ok: function() {
                $(this).dialog('close');
            }
        }*/
    });

}  

function addNewNotationLine(Tabellenname, Zugnummer, Level) {

    $('#' + Tabellenname).append('<tr><td data-fen="' + Zugnummer + '"></td></td><td data-fen="' + T_Zuege.FEN + '" onclick="jumpToPosition();">' + getMoveNotations(T_Zuege.FEN, T_Zuege.ZugStockfish, "kurz") + '</td><td onclick="jumpToPosition();"></td></tr>');

}  

function TransferZugdaten(Stellung, Zug) {

    Stellung.ZugNummer  = Zug.ZugNummer;
    Stellung.ZugLevel   = Zug.ZugLevel;
    Stellung.ZugFarbe   = Zug.ZugFarbe;
    Stellung.PreMoveId  = Zug.PreMoveId;
    Stellung.CurMoveId  = Zug.CurMoveId;
    Stellung.FEN        = Zug.FEN;

    if (Zug.ZugFarbe == WEISSAMZUG) { 
        Stellung.Text_w = Zug.ZugKurz;
        Stellung.FEN_w  = Zug.FEN;
        Stellung.Text_b = DefaultMove_b;
        Stellung.FEN_b  = DefaultFEN;
    } else {
        Stellung.Text_b = Zug.ZugKurz;
        Stellung.FEN_b  = Zug.FEN;
        Stellung.Text_w = DefaultMove_w;
        Stellung.FEN_w  = DefaultFEN;
    }

}
