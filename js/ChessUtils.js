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
                    { $('#' + Feldname).html(FIGUREN.P).append('<span id="P_'+file+rank+'"></span>'); break; }
                    case 'p':
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
function ZieheZug(BoardPräfix, ZugmarkerPräfix) {
    //console.log('ZieheZug: ' + BoardPräfix + ' ' + T_Zuege.ZugVon + T_Zuege.ZugNach);
    console.log(JSON.stringify(T_Zuege));
    if(T_Zuege.ZugKurz.indexOf('0-0') == -1) {
        var Figur;
        var Figurname;
        if(T_Zuege.ZugUmwandlung != "") {
            console.log('In ZieheZug ungleich "": T_Zuege.ZugUmwandlung = ' + T_Zuege.ZugUmwandlung);
            Figur 		= eval('FIGUREN.' + T_Zuege.ZugUmwandlung); // Figurzeichen der umgewandelten Figur
            Figurname 	= T_Zuege.ZugUmwandlung;
        } else if(T_Zuege.ZugFigur.toUpperCase() == 'P' && (T_Zuege.ZugNach.slice(-1) == '1' || T_Zuege.ZugNach.slice(-1) == '8')) {
            console.log('In ZieheZug toUpperCase "": T_Zuege.ZugNach.slice(-1) = ' + T_Zuege.ZugNach.slice(-1));
            if(T_Zuege.ZugFarbe == WEISSAMZUG) {
                Figur                   = FIGUREN.Q;
                Figurname               = 'Q';
                T_Zuege.ZugUmwandlung   = 'Q';
             } else {
                Figur                   = FIGUREN.q;
                Figurname               = 'q';
                T_Zuege.ZugUmwandlung   = 'q';
           }
        } else {
            Figur 		= $('#' + BoardPräfix + T_Zuege.ZugVon).html().substr(0, 1); // Figurzeichen retten
            Figurname 	= $('#' + BoardPräfix + T_Zuege.ZugVon + ' > span')[0].id.substr(0, 1); // Gilt so für Bauern und Figuren
        }
        $('#' + BoardPräfix + T_Zuege.ZugVon).html(''); // Entfernt sowohl das Figurzeichen als auch das span
        $('#' + BoardPräfix + T_Zuege.ZugNach).html(Figur).append('<span id="' + Figurname + '_' + T_Zuege.ZugNach + '"></span>');
    } else {
        if(T_Zuege.ZugFarbe == WEISSAMZUG) {
            if (T_Zuege.ZugOriginal.indexOf('0-0-0') == 0) {
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
            if (T_Zuege.ZugOriginal.indexOf('0-0-0') == 0) {
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

    if(T_Zuege.ZugFarbe == WEISSAMZUG) {
        $('[id^=' + ZugmarkerPräfix + 'weiss]').show();
        $('[id^=' + ZugmarkerPräfix + 'schwarz]').hide();
    } else {
        $('[id^=' + ZugmarkerPräfix + 'weiss]').hide();
        $('[id^=' + ZugmarkerPräfix + 'schwarz]').show();
    }
}

// Das Zeichen für matt kommt in einem eigenen Aufruf (die Engine stellt das matt erst bei der Suche nach dem nächsten Zug fest)
function SchreibeZug(Tabellenname) {

    console.log('SchreibeZug für: ' + T_Zuege.ZugFarbe);
    console.log(JSON.stringify(T_Zuege));

    if(Tabellenname == 'NotationstabelleAufgabe') {

        console.log($("#" + Tabellenname + " td:not([data-fen])").length);

        if(T_Zuege.ZugFarbe == WEISSAMZUG) {

            if(T_Zuege.ZugZeichen == MATT) {
                $('<span>' + MATT + '</span>').appendTo($('#' + Tabellenname + ' td:nth-last-child(2)').last());
                console.log('matt mit: ');
            } else {
                addNewNotationLine(Tabellenname, GlobalMovesData.ZugNummer);
                //$('#' + Tabellenname).append('<tr><td data-fen="' + GlobalMovesData.ZugNummer + '"></td></td><td data-fen="' + T_Zuege.FEN + '" onclick="jumpToPosition();">' + getMoveNotations(T_Zuege.FEN, T_Zuege.ZugStockfish, "kurz") + '</td><td onclick="jumpToPosition();"></td></tr>');
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
    if(Tabellenname == 'NotationslisteImport') {

        var newitem = '<li>' + T_Zuege.ZugNummer + '</li>';
		$(newitem).appendTo('#' + Tabellenname); 

    }   
}

function jumpToPosition() {
    var ii = 0;

    alert(event.target.getAttribute('data-fen'));
}  

function addNewNotationLine(Tabellenname, Zugnummer, Level) {

    $('#' + Tabellenname).append('<tr><td data-fen="' + Zugnummer + '"></td></td><td data-fen="' + T_Zuege.FEN + '" onclick="jumpToPosition();">' + getMoveNotations(T_Zuege.FEN, T_Zuege.ZugStockfish, "kurz") + '</td><td onclick="jumpToPosition();"></td></tr>');

}  