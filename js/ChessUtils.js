// Eine Stellung wird aufgebaut, indem die FEN-Zeilen in die div übertragen werden
function ErzeugeTooltip(Situation, BrettArray, TooltipId, Farbe) {

    var FEN_rows;
    if (Farbe == WEISSAMZUG) {
        FEN_rows = Situation.FEN_w.split(" ")[0].split("/");
        //console.log(Situation.FEN_w);
        //console.log(FEN_rows);
    } else {
        FEN_rows = Situation.FEN_b.split(" ")[0].split("/");
        //console.log(Situation.FEN_b);
        //console.log(FEN_rows);
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
                    // So soll es einmal aussehen
                    //{ $('#' + Feldname).html('<span class="inner" id="P_'+file+rank+'">' + FIGUREN.P + '</span>'); break; }
                    { $('#' + Feldname).html(FIGUREN.P).append('<span id="P_'+file+rank+'"></span>'); break; }
                    case 'p':
                    // So soll es einmal aussehen
                    //{ $('#' + Feldname).html('<span class="inner" id="p_'+file+rank+'">' + FIGUREN.p + '</span>'); break; }
                    { $('#' + Feldname).html(FIGUREN.p).append('<span id="p_'+file+rank+'"></span>'); break; }
                    case 'K': 
                    { $('#' + Feldname).html(FIGUREN.K).append('<span id="K_'+file+rank+'"></span>'); break; }
                     case 'k':
                    { $('#' + Feldname).html(FIGUREN.k).append('<span id="k_'+file+rank+'"></span>'); break; }
                    case 'Q': 
                    { $('#' + Feldname).html(FIGUREN.Q).append('<span id="Q_'+file+rank+'"></span>'); break; }
                     case 'q':
                    { $('#' + Feldname).html(FIGUREN.q).append('<span id="q_'+file+rank+'"></span>'); break; }
                    case 'R': 
                    { $('#' + Feldname).html(FIGUREN.R).append('<span id="R_'+file+rank+'"></span>'); break; }
                     case 'r':
                    { $('#' + Feldname).html(FIGUREN.r).append('<span id="r_'+file+rank+'"></span>'); break; }
                    case 'N': 
                    { $('#' + Feldname).html(FIGUREN.N).append('<span id="N_'+file+rank+'"></span>'); break; }
                     case 'n':
                    { $('#' + Feldname).html(FIGUREN.n).append('<span id="n_'+file+rank+'"></span>'); break; }
                    case 'B': 
                    { $('#' + Feldname).html(FIGUREN.B).append('<span id="B_'+file+rank+'"></span>'); break; }
                     case 'b':
                    { $('#' + Feldname).html(FIGUREN.b).append('<span id="b_'+file+rank+'"></span>'); break; }
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
    //console.log('ZieheZug: ' + BoardPräfix + ' ' + objZug.ZugVon + objZug.ZugNach);
    //console.log(JSON.stringify(objZug));
    if(objZug.ZugKurz.indexOf('0-0') == -1) {
        var Figur;
        var Figurname;
        if(objZug.ZugUmwandlung != "") {
            console.log('In objZug ungleich "": objZug.ZugUmwandlung = ' + objZug.ZugUmwandlung);
            Figur 		= eval('FIGUREN.' + objZug.ZugUmwandlung); // Figurzeichen der umgewandelten Figur
            Figurname 	= objZug.ZugUmwandlung;
        } else if(objZug.ZugFigur.toUpperCase() == 'P' && (objZug.ZugNach.slice(-1) == '1' || objZug.ZugNach.slice(-1) == '8')) {
            console.log('In ZieheZug toUpperCase "": objZug.ZugNach.slice(-1) = ' + objZug.ZugNach.slice(-1));
            if(objZug.ZugFarbe == WEISSAMZUG) {
                Figur                   = FIGUREN.Q;
                Figurname               = 'Q';
                objZug.ZugUmwandlung   = 'Q';
             } else {
                Figur                   = FIGUREN.q;
                Figurname               = 'q';
                objZug.ZugUmwandlung   = 'q';
           }
        } else {
            Figur 		= $('#' + BoardPräfix + objZug.ZugVon).html().substr(0, 1); // Figurzeichen retten
            Figurname 	= $('#' + BoardPräfix + objZug.ZugVon + ' > span')[0].id.substr(0, 1); // Gilt so für Bauern und Figuren
        }
        $('#' + BoardPräfix + objZug.ZugVon).html(''); // Entfernt sowohl das Figurzeichen als auch das span
        $('#' + BoardPräfix + objZug.ZugNach).html(Figur).append('<span id="' + Figurname + '_' + objZug.ZugNach + '"></span>');
    } else {
        if(objZug.ZugFarbe == WEISSAMZUG) {
            if (objZug.ZugOriginal.indexOf('0-0-0') == 0) {
                $('#' + BoardPräfix + 'e1').html(''); // Entfernt sowohl das Figurzeichen als auch das span
                $('#' + BoardPräfix + 'a1').html(''); // Entfernt sowohl das Figurzeichen als auch das span
                $('#' + BoardPräfix + 'c1').html(FIGUREN.K).append('<span id="K_c1"></span>');
                $('#' + BoardPräfix + 'd1').html(FIGUREN.R).append('<span id="R_d1"></span>');
            } else {
                $('#' + BoardPräfix + 'e1').html(''); // Entfernt sowohl das Figurzeichen als auch das span
                $('#' + BoardPräfix + 'h1').html(''); // Entfernt sowohl das Figurzeichen als auch das span
                $('#' + BoardPräfix + 'g1').html(FIGUREN.K).append('<span id="K_g1"></span>');
                $('#' + BoardPräfix + 'f1').html(FIGUREN.R).append('<span id="R_f1"></span>');
            }
        } else {
            if (objZug.ZugOriginal.indexOf('0-0-0') == 0) {
                $('#' + BoardPräfix + 'e8').html(''); // Entfernt sowohl das Figurzeichen als auch das span
                $('#' + BoardPräfix + 'a8').html(''); // Entfernt sowohl das Figurzeichen als auch das span
                $('#' + BoardPräfix + 'c8').html(FIGUREN.k).append('<span id="k_c8"></span>');
                $('#' + BoardPräfix + 'd8').html(FIGUREN.r).append('<span id="r_d8"></span>');
            } else {
                $('#' + BoardPräfix + 'e8').html(''); // Entfernt sowohl das Figurzeichen als auch das span
                $('#' + BoardPräfix + 'h8').html(''); // Entfernt sowohl das Figurzeichen als auch das span
                $('#' + BoardPräfix + 'g8').html(FIGUREN.k).append('<span id="k_g8"></span>');
                $('#' + BoardPräfix + 'f8').html(FIGUREN.r).append('<span id="r_f8"></span>');
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

// Deprecated. Noch in ChallengePlay enthalten weil der Teil noch nicht auf jsTree umgestgellt ist
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
                addNewNotationLine(Tabellenname, ImportDaten.ZugNummer);
                //$('#' + Tabellenname).append('<tr><td data-fen="' + ImportDaten.ZugNummer + '"></td></td><td data-fen="' + T_Zuege.FEN + '" onclick="jumpToPosition();">' + getMoveNotations(T_Zuege.FEN, T_Zuege.ZugStockfish, "kurz") + '</td><td onclick="jumpToPosition();"></td></tr>');
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

function jumpToPosition(FEN) {
window.open("",'x','width=200,height=200,toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=no,resizable=0');
}

function xjumpToPosition(FEN) {
    var ii = 0;
    //alert(FEN);

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

    //alert(event.target.getAttribute('data-fen'));
}  

function showPosition(FEN) {

    $('#' + event.srcElement.id).append('<span id="mini_' + event.srcElement.id + '">CH</span>');

}  

function addNewNotationLine(Tabellenname, Zugnummer, Level) {

    $('#' + Tabellenname).append('<tr><td data-fen="' + Zugnummer + '"></td></td><td data-fen="' + T_Zuege.FEN + '" onclick="jumpToPosition();">' + getMoveNotations(T_Zuege.FEN, T_Zuege.ZugStockfish, "kurz") + '</td><td onclick="jumpToPosition();"></td></tr>');

}  