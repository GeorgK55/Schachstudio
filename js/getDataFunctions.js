
function getThemes() {

	$.ajax({
	  url: "php/getDBData.php",
	  data: { dataContext: "Themes" },
	  type: "GET"
	}).done(function(responseData) {

		var Themes = jQuery.parseJSON(responseData);

		var ThemesLevel0 = $.grep(Themes, function(theme, i) {
			return (theme['Level'] == 0);			
		});

		ThemesLevel0.forEach(function(item, idx) {
			AddTreeviewSubItems(Themes, item, 'ul_Themenliste');
		});

		$(function () { $('#div_Themenliste').on('changed.jstree', function (e, data) {

			var i, r = [];
			
    		for(i = 0; i < data.selected.length; i++) {
				r.push(data.instance.get_node(data.selected[i]).text); // wird erst später genutzt
				GlobalThemaId = data.instance.get_node(data.selected[i]).li_attr["data-themaid"];
    		}

			GlobalAufgabeId = 0; // entfernt eine eventuelle Markierung in der Aufgabenliste
			$('#s_AufgabenSpielen').hide(); // entfernt ein eventuell angezeigtes Brett zur Aufgabe

			//getChallenges($('#cb_Aufgabeauswahl').prop( "checked" ) ? ALLEAUFGABENANZEIGEN : GlobalThemaId);
			$('#btn_Aufgabeauswahl').removeClass('vanishMe').addClass('appearMe');
			getChallenges($('#btn_Aufgabeauswahl').html() == "Alle Aufgaben anzeigen" ? GlobalThemaId : ALLEAUFGABENANZEIGEN);
	
		}).jstree(
				{
					"core" : {
					"themes" : {
						"variant" : "large"
					}
					}
				}
			); 
		});
	});
}

function AddTreeviewSubItems(Themes, item, ul_parent) {

	var Aktuelle_li_ID = item['Level'] + '_' + item['Thematext'].replace(" ", "");
	
	// Findet alle Zeilen, in denen der aktuelle Thema als Father vorkommt und die Ebene um 1 höher ist
	var Subitems = $.grep(Themes, function(theme, i) { return (theme['Level'] == parseInt(item['Level']) + 1 && theme['Father'] == item['Thematext']); });
	
	// Wenn die aktuelle Zeile keine zugeordneten Zeilen hat, muss lediglich die Zeile als li-Tag eingefügt werden
	// Wenn nicht: Einen span-Tag für einen Marker und das Click-Event in den li-Tag einfügen
	// Eventlistener hat nicht funktioniert (jquery hat nur Tags erkannt, die schon  per php vorhanden waren).
	if(Subitems.length > 0) {
		
		//var newitem = '<li data-themaid="' + item['Id'] + '">' + item["Thematext"] + '</span></li>';
		var newitem = '<li id="' + Aktuelle_li_ID + '" data-themaid="' + item['Id'] + '">' + item["Thematext"] + '</span></li>';
		$(newitem).appendTo('#' + ul_parent); // ul_parent zeigt immer auf den aktuellen (Unter)listenanfang

		// Jetzt einen neuen (Unter)listenanfang setzen
		ul_parent = 'ul_' + item['Level'] + '_' + item['Thematext'].replace(" ", "");
		$('<ul id="' + ul_parent + '">').appendTo('#' + Aktuelle_li_ID); // An das grad erzeugte li-Element!!!
		
		Subitems.forEach(function(subitem, idx) {

			AddTreeviewSubItems(Themes, subitem, ul_parent); // Das ist die Rekursion !!!

		});
	} else {

		//var newitem = '<li data-themaid="' + item['Id'] + '">' + item["Thematext"] + '</li>';
		var newitem = '<li id="' + Aktuelle_li_ID + '" data-themaid="' + item['Id'] + '">' + item["Thematext"] + '</li>';
		$(newitem).appendTo('#' + ul_parent);

	}
}

function getChallenges(ThemaId) {

	//console.log('getChallenges mit ' + ThemaId);

	$.ajax({
		url: "php/getDBData.php",
		data: { dataContext: "Challenges", themaid: ThemaId },
		type: "GET"
	  }).done(function(responseData) {

		$('#ul_Aufgabenliste').empty();

		var Challenges = jQuery.parseJSON(responseData);
  
		Challenges.forEach(function(item, idx) {

			if(item.lichess_studie != null && item.lichess_kapitel != null) {
				quelleclass = item.lichess_studie + '/' + item.lichess_kapitel;
			} else {
				quelleclass = "georg";
			}

			quelleclass = "georg"; // mal zwecks debug

			var newitem = '<li id="' + item.Aufgaben_ID + '" data-lichess="' + quelleclass + '">' + item.Kurztext + '</li>';
			$(newitem).appendTo('#ul_Aufgabenliste'); 
		});

		$( "#ul_Aufgabenliste" ).selectable({
			selected: function( event, ui ) {
				GlobalAufgabeId = ui.selected.id;
				var AktuelleQuelleKlasse = $('#'+ui.selected.id).attr('data-lichess');
				if(AktuelleQuelleKlasse == 'georg') {
					//(ui.selected.id, AktuelleQuelleKlasse)
					showChallengegeorg(ui.selected.id);
				} else {
					showChallengelichess(ui.selected.id, AktuelleQuelleKlasse)
				}
			}
		});
	  });	  
}

function getChallenge(ID) {

	$.ajax({
		url: "php/getDBData.php",
		data: { dataContext: "Aufgabedaten", AufgabeID: ID },
		type: "GET"
	  }).done(function(responseData) {

		Challenge = jQuery.parseJSON(responseData); 

		$('#KurztextSpiel').val(Challenge[0].Kurztext == null ? "" : Challenge[0].Kurztext);
		$('#LangtextSpiel').val(Challenge[0].Langtext);
		$('#QuelleSpiel').val(Challenge[0].Quelle);
		$('#QuelledetailSpiel').val(Challenge[0].Quelledetail);
		$('#ScopeSpiel').val(Challenge[0].Scope);
		$('#AmZugSpiel').val(Challenge[0].AmZug);
		$('#SkillSpielSpiel').val(Challenge[0].Skill);
		$('#FENSpiel').val(Challenge[0].FEN);

		T_Zuege.FEN = Challenge[0].FEN; // das ist dann die jeweils aktuelle Situation
		T_Zuege.ZugFarbe = Challenge[0].FEN.indexOf('w') > 0 ? WEISSAMZUG : SCHWARZAMZUG;
		StellungAufbauen("Brett_SpieleAufgabe", Challenge[0].FEN, "zugmarkeraufgabe");

		$.ajax({
			url: "php/getDBData.php",
			data: { dataContext: "Zugdaten", AufgabeID: ID },
			type: "GET"
			}).done(function(responseData) {

				ChallengeMoves = jQuery.parseJSON(responseData); 
		});
	
	});


}

function isChallengeUsed(ID) {

	return new Promise(function(resolve, reject) {

		$.ajax({
			url: "php/getDBData.php",
			data: { dataContext: "Aufgabebenutzung", AufgabeID: ID },
			type: "GET",
			success: function(responseData) {

				i = parseInt(responseData);

				isChallengeUsedResult = i == 0 ? false : true;
				console.log("isChallengeUsedResult: " + isChallengeUsedResult);

				resolve(isChallengeUsedResult);
			},
			error: function(errdata) {
				reject(errdata);
			}
		});
	});
}

// Das Kopieren aus der Zwischenablage als Einzelschritt ist nur wegen debug nötig.
// Wenn der Debugger hier schon gestartet ist, kommt eine Fehlermeldung (sinngemäß: not allowed) und die Zwischenablage wird nicht ausgelesen
// Ist auch so bei einer Internetrecherche zu finden
function DatenBereitstellen_Zwischenablage() {

	var ImportText;
	navigator.clipboard.readText().then(text => {	document.getElementById("ImportAreaText").innerHTML = text;	ImportText = text	})
												 .catch(err => {	document.getElementById("ImportAreaText").innerHTML = 'Failed to read clipboard contents: '+err;	})
	;
};

function DatenBereitstellen_Datei() {

	$('#file-input').click();
	$('#file-input').change(handleFileSelect);
	
}

function DatenBereitstellen_Lichess() {

	LichessImportDialog = $( "#dialog_LichessImport" ).dialog({
		title: "Daten aus lichess.org übernehmen",
		height: 500,
		width: 700,
		modal: true,
		open: function () {
		},
		buttons: {
			'Übernehmen': function() {
				kapitelimport($('#lichesskapitel').val());
				$(this).dialog('close');
			},
			'Abbrechen': function() {
				$(this).dialog('close');
			}
		}
	});

	
}
function AufgabeImportieren() {

	GlobalMovesData.Moves 				= [];
	GlobalMovesData.idx					= 0;
	GlobalMovesData.ZugId				= '';
	GlobalMovesData.ZugNummer			= 1;
	GlobalMovesData.ZugLevel			= 0,
	GlobalMovesData.ZugFarbe			= "";
	GlobalMovesData.PreFEN				= "";
	GlobalMovesData.FEN					= "";
	GlobalMovesData.FEN_VariantenStack	= [];

	Zugliste = [];

    // NotationstabelleAufgabe initiieren
	$('#NotationslisteImport').empty().append('<ul></ul>').jstree();

	//scanMetaData(document.getElementById("ImportAreaText").innerHTML);	
	scanMetaData(GlobalImportedPGN[GlobalImportedPGNIndex]);		
	
	StellungAufbauen("Brett_ImportAufgabe", T_Aufgabe.FEN, 'zugmarkerimport');
	
	//prepareMoveValidation(document.getElementById("ImportAreaText").innerHTML);
	prepareMoveValidation(GlobalImportedPGN[GlobalImportedPGNIndex]);
	
	GlobalActionContext 	= AC_GAMEIMPORT;

	validateSingleMove();
}

// Aus den Importdaten werden die die Aufgabe beschreibenden Daten extrahiert und in die Oberfläche übertragen
function scanMetaData(Importtext) {

	// Maskieren, da sonst die Fehlermeldung "groups für null" kommt
	var m_Kurztext = (/(\[Event \")(?<event>.*)(?<![\"\]])/g).exec(Importtext);
	if (m_Kurztext == null) {
		T_Aufgabe.Kurztext = "Fehlt";
		$('#KurztextImport').val("Fehlt");
	} else {
		T_Aufgabe.Kurztext = m_Kurztext.groups.event;
		$('#KurztextImport').val(m_Kurztext.groups.event);
	}

	// Aufgabe.Langtext 		= "";

	var m_Quelle = (/(\[Site \")(?<site>.*)(?<![\"\]])/g).exec(Importtext);
	if (m_Quelle != null) {
		T_Aufgabe.Quelle = m_Quelle.groups.site;
		$('#QuelleImport').val(m_Quelle.groups.site);
	}
	
	//T_Aufgabe.Quelledetail 	= "";
	
	//T_Aufgabe.Scope 			= "";
	
	//T_Aufgabe.Skill 			= "";
	
	// Fritz exportiert bei Partieanfang kein FEN. Deshalb erst mal so prüfen
	var m_FEN_Exist = (/\[FEN/g).exec(Importtext);

	if(m_FEN_Exist == null) {
		T_Aufgabe.FEN 		= FEN_PARTIEANFANG;
		$('#FENImport').val(FEN_PARTIEANFANG);
		T_Aufgabe.AmZug 	= WEISSAMZUG;
		$("#AmZugImport").val(WEISSAMZUG);
	} else {
		var m_FEN = (/(\[FEN \")(?<fen>.*)(?<![\"\]])/g).exec(Importtext).groups.fen;
		$('#FENImport').val(m_FEN);
		T_Aufgabe.FEN = m_FEN;
		if(m_FEN.includes("w")) { // laut Spezifikation ist es in klein
			T_Aufgabe.AmZug = WEISSAMZUG;
			$("#AmZugImport").val(WEISSAMZUG);
		} else {
			T_Aufgabe.AmZug = SCHWARZAMZUG;
			$("#AmZugImport").val(SCHWARZAMZUG);
		}
	}

	// ZugFarbe und und FEN sind jetzt schon bekannt. In das globale Objekt eintragen
	GlobalMovesData.ZugFarbe	= T_Aufgabe.AmZug;
	GlobalMovesData.PreFEN 		= T_Aufgabe.FEN;
	GlobalMovesData.FEN 		= T_Aufgabe.FEN;
}

// Die Zugangaben sind für ein angenehmes Lesen optimiert (Zeilenumbrüche, mal mit mal ohne Leerzeichen usw.)
// Hier werden alle später mal relevanten Teile voneinander getrennt. Am Ende gibt es ein Array mit allen Einzelteilen
function prepareMoveValidation(Importtext) {

	var ImportMoves 	= Importtext.match(r_Match_Moves);

	if(ImportMoves.length > 0) {

		// Es liegen Züge vor. Die Engine vorbereiten
		$("#TriggerTag").trigger("start_ucinewgame");

		// Zeilenschaltungen werden komplett und ohne weitere Bedingungen durch Leerzeichen ersetzt (Zeilenschaltung wird im pgn als Trenner gesehen)
		var OhneZeilenschaltungen 	= ImportMoves[0].replace(/(\n)|(\r\n)|(\n\r)/g, " ");

		var PunkteKorigiert 		= OhneZeilenschaltungen.replace(r_Punkte, "$1" + ". ... ");

		var KlammernAufKorrigiert 	= PunkteKorigiert.replace(r_KlammernAuf, "$1" + " ");
		var KlammernZuKorrigiert 	= KlammernAufKorrigiert.replace(r_KlammernZu, " " + "$1");

		var ZugnummerKorrigiert 	= KlammernZuKorrigiert.replace(r_Zugnummern, "$1" + " " + "$2");

		// Alle Einzelteile in eigenen Arrayelementen. die werden in das globale Objekt eingetragen
		GlobalMovesData.Moves		= ZugnummerKorrigiert.match(/[^ ]+/g);
		GlobalMovesData.idx			= 0; 
	}

}

// Mit der in GlobalMovesData aktuellen Situation startend, wird der nächste echte Zug gesucht.
// Eventuell wird GlobalMovesData aktualisiert (Zugnummer, Varianten, ...)
// Bei kurzer Notation wird für den gefundenen Zug das Startfeld ermittelt
// Alle Daten über den Zug werden in einem globalen Objekt (entsprechend der Datenbanktabelle) gespeichert
function validateSingleMove() {

	T_Zuege.AufgabeID		= 0;
	T_Zuege.FEN				= '';
	T_Zuege.ZugId			= '';
	T_Zuege.ZugNummer		= 1;
	T_Zuege.ZugLevel		= 0;
	T_Zuege.ZugFarbe		= '';
	T_Zuege.ZugOriginal		= '';
	T_Zuege.ZugFigur		= '';
	T_Zuege.ZugVon			= '';
	T_Zuege.ZugNach			= '';
	T_Zuege.ZugKurz			= '';
	T_Zuege.ZugLang			= '';
	T_Zuege.ZugStockfish	= '';
	T_Zuege.ZugAktion		= '';
	T_Zuege.ZugUmwandlung	= '';
	T_Zuege.ZugZeichen		= '';
	T_Zuege.Hinweistext		= '';
	T_Zuege.Hinweispfeil	= '';
	
	GlobalActionStep = AS_EXPECTPOSSIBLEMOVES;

	// In dieser Schleife wird nach Zügen, Zugnummern und Klammern (=Varianten) differenziert
	do {

		var m_BauerKurzeNotation	= r_BauerKurzeNotation.exec(GlobalMovesData.Moves[GlobalMovesData.idx]);
		var m_FigurKurzeNotation	= r_FigurKurzeNotation.exec(GlobalMovesData.Moves[GlobalMovesData.idx]);
		var m_Rochaden				= r_Rochaden.exec(GlobalMovesData.Moves[GlobalMovesData.idx]);
		var m_Zugnummer				= r_Zugnummer.exec(GlobalMovesData.Moves[GlobalMovesData.idx]);

		if(m_BauerKurzeNotation != null || m_FigurKurzeNotation != null || m_Rochaden != null) {				

			// Das gilt immer, egal was für ein Zug
			T_Zuege.ZugId		= GlobalMovesData.ZugId;
			T_Zuege.ZugNummer	= GlobalMovesData.ZugNummer;
			T_Zuege.ZugLevel	= GlobalMovesData.ZugLevel;
			T_Zuege.ZugFarbe	= GlobalMovesData.ZugFarbe;
			T_Zuege.PreFEN		= T_Zuege.FEN;
			T_Zuege.FEN			= GlobalMovesData.FEN;

			if(m_BauerKurzeNotation != null) {

				T_Zuege.ZugFigur 		= "";
				T_Zuege.ZugOriginal		= m_BauerKurzeNotation[0];
				T_Zuege.ZugKurz			= m_BauerKurzeNotation[0];
				T_Zuege.ZugNach			= m_BauerKurzeNotation.groups.targetfile + m_BauerKurzeNotation.groups.targetrank;
				T_Zuege.ZugAktion 		= m_BauerKurzeNotation.groups.capture.length > 0 ? SCHLÄGT : ZIEHT;
				T_Zuege.ZugUmwandlung	= m_BauerKurzeNotation.groups.umwandlung;
				T_Zuege.ZugZeichen  	= m_BauerKurzeNotation.groups.schachodermatt;
									
				T_Zuege.Hinweistext = getKommentar(1); // Kommentare gehören immer zu Zügen. 
			
				// Jetzt werden die Kandidaten bestimmt und die Engine für alle Kandidaten befragt
				// Die Auswertung geschieht im Messagelistener.
				getStartFeld(m_BauerKurzeNotation);

			} else if (m_FigurKurzeNotation != null) {

				T_Zuege.ZugFigur 	= m_FigurKurzeNotation.groups.figur;
				T_Zuege.ZugOriginal	= m_FigurKurzeNotation[0];
				T_Zuege.ZugKurz		= m_FigurKurzeNotation[0];
				T_Zuege.ZugNach		= m_FigurKurzeNotation.groups.targetfile + m_FigurKurzeNotation.groups.targetrank;
				T_Zuege.ZugAktion 	= m_FigurKurzeNotation.groups.capture.length > 0 ? SCHLÄGT : ZIEHT;
				T_Zuege.ZugZeichen  = m_FigurKurzeNotation.groups.schachodermatt;
									
				T_Zuege.Hinweistext = getKommentar(1); // Kommentare gehören immer zu Zügen. 
				
				// Jetzt werden die Kandidaten bestimmt und die Engine für alle Kandidaten befragt
				// Die Auswertung geschieht im Messagelistener.
				getStartFeld(m_FigurKurzeNotation);

			} else if (m_Rochaden != null) {

				T_Zuege.ZugFigur 		= "";
				T_Zuege.ZugOriginal		= m_Rochaden[0].replace(/O/g, '0');
				T_Zuege.ZugKurz			= m_Rochaden[0].replace(/O/g, '0');
				//T_Zuege.ZugVon 			= ""; // Wird in getRochadeFelder eingetragen
				// T_Zuege.ZugNach			= ; // Wird in getRochadeFelder eingetragen
				T_Zuege.ZugAktion 		= "";
				T_Zuege.ZugUmwandlung	= "";
				T_Zuege.ZugZeichen  	= "";
									
				T_Zuege.Hinweistext = getKommentar(1); // Kommentare gehören immer zu Zügen. 

				getRochadeFelder(m_Rochaden);
			}
			
		} else if (m_Zugnummer != null) {
			
			GlobalMovesData.ZugNummer = parseInt(GlobalMovesData.Moves[GlobalMovesData.idx]);
			
		} else if (GlobalMovesData.Moves[GlobalMovesData.idx].indexOf("(") == 0) {
			
				GlobalMovesData.ZugLevel++;
				GlobalMovesData.FEN_VariantenStack.push( { FEN: GlobalMovesData.FEN, PreFEN: GlobalMovesData.PreFEN } );
				GlobalMovesData.FEN = GlobalMovesData.PreFEN; // Damit bekommt der nächste Zug = erster in der Variante die FEN, die zum aktuellen Zug geführt hat

				console.log("( an index " + GlobalMovesData.idx);
				console.log(JSON.stringify(GlobalMovesData.FEN_VariantenStack));

				GlobalMovesData.ZugFarbe = GlobalMovesData.FEN.includes("w") ? WEISSAMZUG : SCHWARZAMZUG;
				StellungAufbauen("Brett_ImportAufgabe", GlobalMovesData.FEN, 'zugmarkerimport');
				
		} else if (GlobalMovesData.Moves[GlobalMovesData.idx].indexOf(")") == 0) {
			
				console.log(") an index " + GlobalMovesData.idx);
				console.log(JSON.stringify(GlobalMovesData.FEN_VariantenStack));

				GlobalMovesData.ZugLevel--;
				GlobalFEN_VariantenAktuell = GlobalMovesData.FEN_VariantenStack.pop();
				GlobalMovesData.PreFEN = GlobalFEN_VariantenAktuell.PreFEN;
				GlobalMovesData.FEN = GlobalFEN_VariantenAktuell.FEN;

				GlobalMovesData.ZugFarbe = GlobalMovesData.FEN.includes("w") ? WEISSAMZUG : SCHWARZAMZUG;
				StellungAufbauen("Brett_ImportAufgabe", GlobalMovesData.FEN, 'zugmarkerimport');
				
			// Dann muss es sich um einen Kommentar vor dem ersten Zug handeln. Der wird jetzt einfach mal in die Aufgabe übernommen. Noch verbessern.
			} else if (GlobalMovesData.Moves[GlobalMovesData.idx].indexOf("{") == 0) {
				
				T_Aufgabe.Langtext = getKommentar(0);

			} else if (GlobalMovesData.Moves[GlobalMovesData.idx] == "..." == 0) {
			// Wird das so gebraucht?
		} else {
			//alert();
		}
		GlobalMovesData.idx++;

	} while (m_BauerKurzeNotation == null && m_FigurKurzeNotation == null && m_Rochaden == null && GlobalMovesData.idx < GlobalMovesData.Moves.length);
}

function zeigeImportdaten() {
	
	alert(document.getElementById("ImportAreaText").innerHTML);
	
}

// Aus den Zugdaten wird bestimmt, welche Figur gezogen ist.
// Figuren sind in html mit diesem Muster enthalten: <span id="X_'+file+rank+'"></span> wobei X den Buchstaben der FEN entspricht
function getStartFeld(Zugdaten) {

	var KandidatenID;
	var Kandidaten;
	var  i = 0;

	if(Zugdaten.groups.figur == null) {
		// Bauernzug. Entscheidung weiss oder schwarz nur über die aktuelle ZugFarbe möglich
		KandidatenID = T_Zuege.ZugFarbe == WEISSAMZUG ? 'P_' + Zugdaten.groups.mitfile : 'p_' + Zugdaten.groups.mitfile;
		Kandidaten = $('[id^=' + KandidatenID + ']');
	} else {
		// Figurenzug. Der Name wird in der kurzen Notation immer gross geschrieben. Die Namen in den ID entsprecchen FEN, also gross/klein für weiss/schwarz
		KandidatenID = T_Zuege.ZugFarbe == WEISSAMZUG ? (Zugdaten.groups.figur).toUpperCase()  + "_" + Zugdaten.groups.mitfile : (Zugdaten.groups.figur + "_" + Zugdaten.groups.mitfile).toLowerCase();
		//  + Zugdaten.groups.mitfile + Zugdaten.groups.mitrank
		Kandidaten = $('[id^=' + KandidatenID + ']');
		if(Zugdaten.groups.mitrank != "") Kandidaten = $('[id^=' + KandidatenID + ']').add('[id$=' + Zugdaten.groups.mitrank + ']');
		//Kandidaten = $('[id^=' + KandidatenID + ']').add('[id$=' + Zugdaten.groups.mitrank + ']');
	}

	Kandidaten.each(function( i, K ) {
		$("#TriggerTag").trigger("SetFenPosition", [ T_Zuege.FEN ] );

		var EchteUmwandlung = (/[abcdefgh][27]/g).exec(K.id) != null ? Zugdaten.groups.umwandlung : "";
		$("#TriggerTag").trigger("isMoveCorrect", [ K.id.match('[abcdefgh][12345678]') + T_Zuege.ZugOriginal.match('[abcdefgh][12345678]') + EchteUmwandlung ] );
	});
	//$("#ImportTriggerTag").trigger('OK'); // Nicht auslösen. Das kommt erst nach bestmove im Messagelistener

}

// Die Situation kann eindeutig identifiziert werden. Diese ist zu prüfen.
function getRochadeFelder(Zugdaten) {

	if(T_Zuege.ZugFarbe == WEISSAMZUG) {
		T_Zuege.ZugVon 	= "e1";
		T_Zuege.ZugNach 	= Zugdaten.indexOf('0-0-0') == 0 ? "c1" : "g1"; 
	} else {
		T_Zuege.ZugVon 	= "e8";
		T_Zuege.ZugNach 	= Zugdaten.indexOf('0-0-0') == 0 ? "c8" : "g8";
	}

	$("#TriggerTag").trigger("SetFenPosition", [ T_Zuege.FEN ] );
	$("#TriggerTag").trigger("isMoveCorrect", [ T_Zuege.ZugVon + T_Zuege.ZugNach ] );
}

function getKommentar(Versatz) {
	var Kommentar = "";
	if(GlobalMovesData.idx < GlobalMovesData.Moves.length && GlobalMovesData.Moves[GlobalMovesData.idx + Versatz].indexOf('{') == 0) {
		var fertig = false;
		do {
			Kommentar += GlobalMovesData.Moves[GlobalMovesData.idx + 1] // also ohne {
			GlobalMovesData.idx++;
			if(GlobalMovesData.Moves[GlobalMovesData.idx].indexOf('}') == 0) fertig = true; 
		} while (!fertig)
		//T_Zuege.Hinweistext = Kommentar;
	}
	return Kommentar;
}

