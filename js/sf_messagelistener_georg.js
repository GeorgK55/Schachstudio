function TheIndexGeorgFunction() {

	Stockfish().then((sf) => {

		stockFish = sf; // stockFish ist global verfügbar

		// Der Listener:
		// Von außen wird ein Context, auf den der Listener aktuell reagieren soll vorgegeben
		// Ein Context kann aus mehreren Schritten bestehen, die NACHEINANDER ablaufen müssen.
		// Die letzte Massnahme in einem Schritt ist das Auslösen des Kommandos für den nächsten Schritt 
		// Die Schrittfolge ergibt sich implizit durch das Setzen der Schrittkennungen
		sf.addMessageListener((line) => {

			// Immer:
			console.log('==== ' + GlobalActionContext + ' mit ' + line);

			// Pro GlobalActionContext:

			if(GlobalActionContext == AC_ENGINEDIALOG) {
				// GlobalActionStep ist hier nicht nötig und GlobalActionContext wird nicht geändert. 
				// Also werden alle Antworten werden hier einfach erkannt und rausgeschrieben.
				$('<p class="LogAus LogAusMiddle">' + line + '</p>').appendTo('#logliste');
			}
			
			if(GlobalActionContext == AC_GAMEIMPORT) {

				// In getDataFunctions wird die Kandidatenauswahl für die Bestimmung des Ausgangsfeldes eines Zugs angestoßen
				// Das Auswahlfeld eines Zuges wird für die Kommunikation mit der Engine zwingend benötigt
				// Nur für den einzig möglichen Zug wird 'bestmove' zurückgegeben

				if(GlobalActionStep == AS_IDENTIFYUNIQUEMOVE) {
					
					// Es gibt nur diese eine relevante Zeile. Auswerten und Umschalten in den nächsten Schritt.
					if (line.indexOf('bestmove') >= 0 && line.match(T_Zuege.ZugNach)) {
						
						T_Zuege.ZugVon 			= line.slice(9, 11); // gilt für Bauern- und für Figurenzüge
						T_Zuege.ZugStockfish 	= T_Zuege.ZugVon + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung.toLowerCase();
						// Rochaden und nur sind in ZugLang schon eingetragen
						if(T_Zuege.ZugLang == '') {
							T_Zuege.ZugLang = T_Zuege.ZugFigur + T_Zuege.ZugVon + T_Zuege.ZugAktion + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung + T_Zuege.ZugZeichen;
						}					
						console.log('=== T_Zuege.ZugStockfish: '  + T_Zuege.ZugStockfish );
						//$('<p>=== T_Zuege.ZugStockfish: '  + T_Zuege.ZugStockfish + '</p>').appendTo('#ImportTriggerTag');
						
						GlobalActionStep = AS_FINISHPOSSIBLEMOVESIDENTIFICATION;
						postit('isready'); // Das ist das Signal für den nächsten Step
					}
				}
				
				if(GlobalActionStep == AS_FINISHPOSSIBLEMOVESIDENTIFICATION) {
					
					// Nur readyok ist relevant. Jetzt kann der Zug ausgeführt werden.
					// Der Zug wird ausgeführt, damit die neue FEN abgeholt werden kann.
					if(line.indexOf('readyok') >= 0)  {
						
							GlobalActionStep = AS_INTERPRETELOCATEDMOVE;
							postit('position fen ' + T_Zuege.FEN + " moves " + T_Zuege.ZugStockfish + T_Zuege.ZugUmwandlung.toLowerCase());
							postit('d');
							postit('isready');
					}
				}
				
				if(GlobalActionStep == AS_INTERPRETELOCATEDMOVE) {
					
					// Hier ist nur die Zeile mit FEN relevant
					if(line.indexOf('Fen') >= 0) {

						// Einfügen der Struktur einer neuen Zeile, wenn notwendig
						if (T_Zuege.ZugFarbe == WEISSAMZUG || addNotationlineFlag) {

							ImportDaten.CurNodeId = NodePräfix + T_Zuege.CurMoveIndex;
							ImportDaten.CurMoveId = T_Zuege.CurMoveId;			

							// Das html-Gerüst für den Zug wird in die html-Notationsliste eingetragen
							// Die Zugdaten werden später nachgetragen, da ja in einer Zeile sowohl weiß als auch schwarz enthalten sein soll
							$('#TreeNotationslisteImport').jstree().create_node(ImportDaten.PreNodeId, {
								"id": ImportDaten.CurNodeId,
								"text": "<div><span class='movenumber'>" + ImportDaten.ZugNummer + "</span>"
										+ "<span class='movewhite' id='"
										+ ImportDaten.CurMoveId + WhitePostfix + "'>" + DefaultMove_w 
										+ "</span><span class='moveblack' id='"
										+ ImportDaten.CurMoveId + BlackPostfix + "'>" + DefaultMove_b
										+ "</span></div>"
						  	}, "last", function() {
							//alert("startnode created");
							});
							Move_w = DefaultMove_w;
							Move_b = DefaultMove_b;
						}
						addNotationlineFlag = false;
						$('#TreeNotationslisteImport').jstree().open_all();

						// Nachtragen der eigentlichen Zugdaten. In CurrentMove_X steht der eventuell schon vom letzten Zug bekannte Teil
						if (T_Zuege.ZugFarbe == WEISSAMZUG) { 
							Move_w = T_Zuege.ZugKurz;
						} else {
							Move_b = T_Zuege.ZugKurz;
						}
						SituationsDaten.ZugNummer = "<span class='movenumber'>" + ImportDaten.ZugNummer + "</span>";
						SituationsDaten.Text_w = "<span class='movewhite' id='" + ImportDaten.CurMoveId + "_w'>" + Move_w + "</span>";
						SituationsDaten.Text_b = "<span class='moveblack' id='" + ImportDaten.CurMoveId + "_b'>" + Move_b + "</span>";

						sel = $('#TreeNotationslisteImport').jstree().get_node(ImportDaten.CurNodeId);
						$('#TreeNotationslisteImport').jstree().rename_node(sel, "<div>" + SituationsDaten.ZugNummer + SituationsDaten.Text_w + SituationsDaten.Text_b + "</div>");

						// Damit wird die aktuelle Situation und der Zug selbst für den insert in die Datenbank festgehalten
						let ZuglisteZug = Object.assign({}, T_Zuege);
						Zugliste.push(ZuglisteZug);
						
						// Jetzt wird die neue Situation in das Objekt mit den Daten zum Analysevergleich eingetragen. T_Zuege nicht notwendig, wird neu initialisiert
						ImportDaten.PreFEN		= T_Zuege.FEN;					
						ImportDaten.FEN			= line.substr(5);
						ImportDaten.ZugFarbe	= ImportDaten.FEN.includes("w") ? WEISSAMZUG : SCHWARZAMZUG;
						ImportDaten.CurMoveId	= T_Zuege.CurMoveId;			

						// Der Zug wird auf dem Brett ausgeführt, damit in validateSingleMove die richtige aktuelle Situation zur Verfügung steht
						ZieheZug(T_Zuege, 'Brett_ImportAufgabe_', 'zugmarkerimport'); // Hier, weil die Zugdaten zum Ziehen benötigt werden

						// Die weitere Analyse wird außerhalb des Listeners durchgeführt
						validateSingleMove();
					}					
				}
			}

			if(GlobalActionContext == AC_CHALLENGE_PLAY) {
				switch (GlobalActionStep)
				{
					// Die Überprüfung des Spielerzuges wurde im mouseup ausgelöst. Hier wird ausgewertet und ggf ausgeführt
					case AS_CHECKCHALLENGEMOVE:
					{
						if (line.indexOf('bestmove') >= 0 && line.match(T_Zuege.ZugNach)) {
							// Dann ist das ein legaler Zug des Spielers. Der Zug wird in der Oberfläche vollzogen und die Engine wird beauftragt
							$('<p class="LogAus LogAusMiddle">' + line + '</p>').appendTo('#logliste');

							ZieheZug(T_Zuege, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
							SchreibeZug('NotationstabelleAufgabe');

							GlobalActionStep = AS_CHECKCHALLENGEMOVEFINISHED;
							postit('position fen ' + T_Zuege.FEN + " moves " + T_Zuege.ZugVon + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung);
							postit('isready'); // Das ist das Signal für den nächsten Step
						} else {
							$('<p class="LogAus LogAusMini">' + line + '</p>').appendTo('#logliste');
						}
						break;
					}
					// Der Spielerzug ist durchgeführt. Die neu entstandene Situation wird abgefragt
					case AS_CHECKCHALLENGEMOVEFINISHED:
					{
						if(line.indexOf('readyok') == 0) {
							$('<p class="LogAus LogAusMiddle">' + line + '</p>').appendTo('#logliste');
		
							GlobalActionStep = AS_GETCHALLENGEFEN;
							postit('d'); // Damit die neue FEN in T_Zuege übertragen werden kann.
						} else {
							$('<p class="LogAus LogAusMini">' + line + '</p>').appendTo('#logliste');
						}
						break;
					}
					// Hier ist der Zwischenschritt mit isready nicht nötig
					// Die Abfrageergebnisse werden ausgewertet und im Zugobjekt festgehalten
					// Die Engine wird beauftragt, sich selbst einen besten Zug zu suchen
					case AS_GETCHALLENGEFEN:
					{
						if(line.indexOf('Fen') == 0) {
							$('<p class="LogAus LogAusMiddle">' + line + '</p>').appendTo('#logliste');
		
							T_Zuege.FEN 			= line.substr(5);
							T_Zuege.ZugFarbe 		= line.indexOf('w') > 0 ? WEISSAMZUG : SCHWARZAMZUG;
							T_Zuege.ZugUmwandlung 	= '';
		
							GlobalActionStep = AS_DRAWCHALLENGEENGINEMOVE;
							postit('go depth ' + Suchtiefe);
						} else {
							$('<p class="LogAus LogAusMini">' + line + '</p>').appendTo('#logliste');
						}
						break;
					}
					// Die Engine hat einen Zug gefunden. Dieser Zug wird in der Oberfläche vollzogen.
					// Die Engine wird beauftragt zu ziehen und die neue Situation wird abgefragt
					case AS_DRAWCHALLENGEENGINEMOVE:
					{

						if (line.indexOf('bestmove') == 0) {
							$('<p class="LogAus LogAusMiddle">' + line + '</p>').appendTo('#logliste');
		
							if(line.substr(9, 6) != '(none)') {
		
								var m_EnginesBest = (r_bestmove).exec(line); // Hier ist der Zug ja nicht bekannt
								T_Zuege.ZugVon 			= m_EnginesBest.groups.movevon;
								T_Zuege.ZugNach 		= m_EnginesBest.groups.movenach;
								T_Zuege.ZugStockfish 	= m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach + m_EnginesBest.groups.umwandlung;
								T_Zuege.ZugUmwandlung	= m_EnginesBest.groups.umwandlung;
		
								ZieheZug(T_Zuege, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
								SchreibeZug('NotationstabelleAufgabe');
		
								GlobalActionStep = AS_FINISHCHALLENGEENGINEMOVE;
								postit('position fen ' + T_Zuege.FEN + " moves " + T_Zuege.ZugVon + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung);
								postit('d'); 
		
							} else { // == (none) kommt mindestens (wahrscheinlich aber nur) bei matt
								alert("Wann bin ich hier? Bei matt?");
								T_Zuege.ZugZeichen = MATT;
								SchreibeZug('NotationstabelleAufgabe');
								// ZieheZug fehlt noch
							}
						} else {
							$('<p class="LogAus LogAusMini">' + line + '</p>').appendTo('#logliste');
						}
						break;
					}
					// Auswerten der jetzt entstandenen Situation
					case AS_FINISHCHALLENGEENGINEMOVE:
					{

						if(line.indexOf('Fen') == 0) {
							$('<p class="LogAus LogAusMiddle">' + line + '</p>').appendTo('#logliste');
		
							T_Zuege.FEN 		= line.substr(5);
							T_Zuege.ZugFarbe 	= line.indexOf('w') > 0 ? WEISSAMZUG : SCHWARZAMZUG;
		
							// Es wird kein neuer Zustand gesetzt, da jetzt der Spieler wieder neu zieht
							postit('isready');
						} else {
							$('<p class="LogAus LogAusMini">' + line + '</p>').appendTo('#logliste');
						}
						break;
					}
				}
			}

			if(GlobalActionContext == AC_CHALLENGE_RATING) {

				switch (GlobalActionStep)
				{
					// Die Aufträge dazu wurden in der GUI ausgelöst
					// Hier werden die Scores des Spielerzugs gesammelt
					// Wird ein bestmove mit ZugNach gefunden, war der Zug gültig. Dann weiter, sonst einfach fertig wegen ungültigem Zug
					case AS_PREPAREMOVE:
					{
						// Neu Mai 2021
						$('<p class="LogAus LogAusMini">' + compressline(line) + '</p>').appendTo('#logliste');

						//var m_depth 	= (/(depth )(?<depth>\d*)/g).exec(line);		// wird noch nicht genutzt
						//var m_seldepth 	= (/(seldepth )(?<seldepth>\d*)/g).exec(line);	// wird noch nicht genutzt
						var m_scorecp 	= (/(score cp )(?<scorecp>[-]{0,1}\d*)/g).exec(line);		
						var m_wdl 		= (/(wdl) (?<wdl_w>\d*) (?<wdl_d>\d*) (?<wdl_l>\d*)/g).exec(line);

						if(m_scorecp != null) {
							PlayerScores.push(m_scorecp.groups.scorecp);
						}
						if(m_wdl != null) {
							if(m_wdl.length == 5) { // dann wurden alle Gruppen erkannt
								Playerwdl.push( { wdl_w: m_wdl.groups.wdl_w, wdl_d: m_wdl.groups.wdl_d, wdl_l: m_wdl.groups.wdl_l } );
							}
						}

						// bestmove mit dem Spielerzug kommt nur und genau dann, wenn der Zug gültig ist.
						// wenn bestmove nicht kommt, ist hier schluss. Ist das so schon richtig und fertig?
						if (line.indexOf('bestmove') >= 0 && line.match(T_Zuege.ZugNach)) {
		
							GlobalActionStep = AS_PREPAREMOVEFINISHED;
							postit('isready');
						}				
						break;
					}
					// da kommt noch eine unerwartete Zeile mit bestmove. Deshalb der Zwischenschritt, 
					// der die Zeile einfach überliest (damit der nächste Schritt die "richtige" bestmove-Zeile bekommt)
					case AS_PREPAREMOVEFINISHED:
					{
						$('<p class="LogAus LogAusMiddle">' + compressline(line) + '</p>').appendTo('#logliste');

						// wenn nie ein readyok kommt,ist hier Schluss. Richtig und fertig?
						if(line.indexOf('readyok') == 0) {
							GlobalActionStep = AS_SIMULATEPLAYERMOVE;
							//postit('setoption name clear hash'); // Mai 2021 kommentiert
							postit('go depth ' + Suchtiefe);
						}
						break;
					}
					case AS_SIMULATEPLAYERMOVE:
					{
						$('<p class="LogAus LogAusMini">' + compressline(line) + '</p>').appendTo('#logliste');

						// Sammeln der Zugergebnisse

						var m_scorecp 	= (/(score cp )(?<scorecp>[-]{0,1}\d*)/g).exec(line);
						var m_wdl 		= (/(wdl) (?<wdl_w>\d*) (?<wdl_d>\d*) (?<wdl_l>\d*)/g).exec(line);

						if(m_scorecp != null) {
							EngineScores.push(m_scorecp.groups.scorecp);
						}
						if(m_wdl != null) {
							if(m_wdl.length == 5) { // dann wurden alle Gruppen erkannt
								Enginewdl.push( { wdl_w: m_wdl.groups.wdl_w, wdl_d: m_wdl.groups.wdl_d, wdl_l: m_wdl.groups.wdl_l } );
							}
						}

						var m_EnginesBest = (r_bestmove).exec(line); // Hier ist der Zug ja nicht bekannt, deshalb kein match auf den Zug

						if (m_EnginesBest != null) { // Dann hat die Engine diesen Zug abschließend untersucht 

							console.log(PlayerScores.join() + '\n' + EngineScores.join() + '\n' + m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach + m_EnginesBest.groups.umwandlung);
							console.log(JSON.stringify(T_Zuege));

							var maxPlayerScore 	= Math.max.apply(null, PlayerScores);
							var maxEngineScore 	= Math.max.apply(null, EngineScores);
							var ScoreDiff 		= maxEngineScore - maxPlayerScore; 
							var BetterEngineMoveFlag = ScoreDiff > CentiPawnsMoveDifference ? true : false;

							var lastPlayerwdl 	= parseInt(Playerwdl.slice(-1)[0].wdl_w);
							var lastEnginewdl 	= parseInt(Enginewdl.slice(-1)[0].wdl_w);
							var wdlDiff 		= lastEnginewdl - lastPlayerwdl; 
							var BetterEngineMoveFlag = wdlDiff > wdlDifference ? true : false;

							var RatingSpielerzug_vergleich = T_Zuege.ZugVon + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung.toLowerCase();
							var Enginezug_vergleich  = m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach + m_EnginesBest.groups.umwandlung;

							console.log('maxEngineScore: ' + maxEngineScore + ' CentiPawnsMoveDifference: ' + CentiPawnsMoveDifference + ' maxPlayerScore: ' + maxPlayerScore);
							console.log('maxEnginewdl: ' + lastEnginewdl + ' wdlDifference: ' + wdlDifference + ' maxPlayerwdl: ' + lastPlayerwdl);
							console.log('RatingSpielerzug_vergleich: ' + RatingSpielerzug_vergleich + 'Enginezug_vergleich: ' + Enginezug_vergleich);

							var DecisionText = 'maxEnginewdl: ' + lastEnginewdl + ' wdlDifference: ' + wdlDifference + ' maxPlayerwdl: ' + lastPlayerwdl;
							$('<p class="LogAus LogAusMiddle">' + DecisionText + '</p>').appendTo('#logliste');

							if(RatingSpielerzug_vergleich != Enginezug_vergleich && BetterEngineMoveFlag) {

								ZugdifferenzDialog = $( "#dialog_Zugdifferenz" ).dialog({
									title: "Zugdifferenz",
									height: 400,
									width: 600,
									modal: true,
									open: function () {
										$('#RatingSpielerzug').html(getMoveNotations(T_Zuege.FEN, T_Zuege.ZugStockfish, 'kurz'));
										$('#Zugvorschlag').empty();
										$('#Zugbewertung').empty();
									},
									buttons: {
										'Den stärkeren Zug anzeigen': {
											click: function() {
												$('#Zugvorschlag').empty().append('<span>' + getMoveNotations(T_Zuege.FEN, m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach, "kurz") + '</span>');
												$('#Zugbewertung').empty().append('<span>(ist um ' + diff + ' cp  stärker)</span>');

												// Anhand der Beschriftung des Knopfes wird entschieden
												if($('.ui-button:contains(Den stärkeren Zug anzeigen)').length == 1) {
													$('.ui-button:contains(Den stärkeren Zug anzeigen)').html('Mit diesem Zug weiterspielen');
												} else {
													
													// T_Zuege mit der neuen Situation versorgen
													T_Zuege.ZugVon 			= m_EnginesBest.groups.movevon;
													T_Zuege.ZugNach 		= m_EnginesBest.groups.movenach;
													T_Zuege.ZugKurz			= getMoveNotations(T_Zuege.FEN, m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach, "kurz");
													T_Zuege.ZugUmwandlung 	= m_EnginesBest.groups.umwandlung;

													ZieheZug(T_Zuege, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
													SchreibeZug('NotationstabelleAufgabe');
								
													GlobalActionStep = AS_FINISHPLAYERMOVE;
													postit('position fen ' + T_Zuege.FEN + " moves " + m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach + m_EnginesBest.groups.umwandlung);
													postit('d'); 
				
													$(this).dialog('close');
												}
											},
											text: 'Den stärkeren Zug anzeigen',
											class: 'ImportantKomfortButton'
										},												
										'Mit meinem Zug weiterspielen': {
											click: function() {

												// T_Zuege ist ja schon versorgt

												ZieheZug(T_Zuege, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
												SchreibeZug('NotationstabelleAufgabe');
							
												GlobalActionStep = AS_FINISHPLAYERMOVE;
												postit('position fen ' + T_Zuege.FEN + " moves " + T_Zuege.ZugVon + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung);
												postit('d'); 

												$(this).dialog('close');
											},
											text: 'Mit meinem Zug weiterspielen',
											class: 'ImportantKomfortButton'
										},
										'Meinen Zug zurücknehmen': {
											click: function() {
												T_Zuege = Object.assign({}, T_Zuege_undo);
												$(this).dialog('close');
											},
											text: 'Meinen Zug zurücknehmen',
											class: 'ImportantKomfortButton'
										}
									}
								});

							} else {
								// Spielerzug ist ausreichend gut
								ZieheZug(T_Zuege, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
								SchreibeZug('NotationstabelleAufgabe');
			
								GlobalActionStep = AS_FINISHPLAYERMOVE;
								postit('position fen ' + T_Zuege.FEN + " moves " + T_Zuege.ZugVon + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung);
								postit('d'); 
			
							}
						}
						break;
					}
					case AS_FINISHPLAYERMOVE:
					{
						if(line.indexOf('Fen') == 0) {
							$('<p class="LogAus LogAusMiddle">' + compressline(line) + '</p>').appendTo('#logliste');

							T_Zuege.FEN 			= line.substr(5);
							T_Zuege.ZugFarbe 		= line.indexOf('w') > 0 ? WEISSAMZUG : SCHWARZAMZUG;
							T_Zuege.ZugUmwandlung 	= '';

							GlobalActionStep = AS_DRAWRATINGENGINEMOVE;
							postit('go depth ' + Suchtiefe);
						} else {
							$('<p class="LogAus LogAusMini">' + line + '</p>').appendTo('#logliste');
						}
						break;
					}
					case AS_DRAWRATINGENGINEMOVE:
					{
						if (line.indexOf('bestmove') == 0) {
							$('<p class="LogAus LogAusMiddle">' + compressline(line) + '</p>').appendTo('#logliste');

							if(line.substr(9, 6) != '(none)') {

								var m_EnginesBest = (r_bestmove).exec(line); // Hier ist der Zug ja nicht bekannt
								T_Zuege.ZugVon 			= m_EnginesBest.groups.movevon;
								T_Zuege.ZugNach 		= m_EnginesBest.groups.movenach;
								T_Zuege.ZugStockfish 	= m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach + m_EnginesBest.groups.umwandlung;
								T_Zuege.ZugUmwandlung	= m_EnginesBest.groups.umwandlung;
								T_Zuege.ZugFigur		= getMoveNotations(T_Zuege.FEN, m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach, 'FigurVon');

								ZieheZug(T_Zuege, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
								SchreibeZug('NotationstabelleAufgabe');

								GlobalActionStep = AS_FINISHRATINGENGINEMOVE;
								postit('position fen ' + T_Zuege.FEN + " moves " + T_Zuege.ZugVon + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung);
								postit('d'); 

							} else { // == (none) kommt mindestens (wahrscheinlich aber nur) bei matt

								T_Zuege.ZugZeichen = MATT;
								SchreibeZug('NotationstabelleAufgabe');
							}
						} else {
							$('<p class="LogAus LogAusMini">' + compressline(line) + '</p>').appendTo('#logliste');
						}
						break;
					}
					case AS_FINISHRATINGENGINEMOVE:
					{
						if(line.indexOf('Fen') == 0) {
							$('<p class="LogAus LogAusMiddle">' + compressline(line) + '</p>').appendTo('#logliste');

							T_Zuege.FEN 		= line.substr(5);
							T_Zuege.ZugFarbe 	= line.indexOf('w') > 0 ? WEISSAMZUG : SCHWARZAMZUG;

							// Kein neuer Zustand. Fertig!
							postit('isready');
						} else {
							$('<p class="LogAus LogAusMini">' + compressline(line) + '</p>').appendTo('#logliste');
						}
						break;
					}
				}
			}

			if(GlobalActionContext == AC_CHALLENGE_Varianten) {

				switch (GlobalActionStep)
				{
					case AS_CV_VERIFYMOVE:
						{
							$('<p class="LogAus LogAusMini">' + compressline(line) + '</p>').appendTo('#logliste');

							// bestmove mit dem Spielerzug kommt nur und genau dann, wenn der Zug gültig ist.
							// wenn bestmove nicht kommt, ist hier schluss. Ist das so schon richtig und fertig?
							if (line.indexOf('bestmove') >= 0 && line.match(CCM.ZugStockfish)  ) {
			
								GlobalActionStep = AS_CV_VERIFYMOVEFINISHED;
								postit('isready');
							}				
							break;
					}
					case AS_CV_VERIFYMOVEFINISHED:
					{
						$('<p class="LogAus LogAusMiddle">' + compressline(line) + '</p>').appendTo('#logliste');

						// wenn nie ein readyok kommt,ist hier Schluss. Richtig und fertig?
						if(line.indexOf('readyok') == 0) {

							//CCM = 	$.grep(ChallengeMoves, function(PMI, i) { return PMI['PreMoveId'] == VariantenMoveId; });

							//if (getMoveNotations(T_Zuege.FEN, T_Zuege.ZugStockfish, 'kurz') != CCM.ZugKurz) {
							if (T_Zuege.ZugStockfish != CCM.ZugStockfish) {
								EnginezugDialog = $( "#dialog_Variantenzug" ).dialog({
									title: "Falscher Zug",
									height: 400,
									width: 600,
									modal: true,
									open: function () {
										$('#VariantenSpielerzug').html(getMoveNotations(T_Zuege.FEN, T_Zuege.ZugStockfish, 'kurz'));
										$('#VariantenZugvorschlag').html(ChallengeMoves[VariantenMovecounter].ZugKurz);
										$('#Zugbewertung').empty();
									},
									buttons: {
										Ok: function() {
											$(this).dialog('close');
										}
									}
								});
							} else {

								ZieheZug(T_Zuege, 'Brett_SpieleAufgabe_', "zugmarkeraufgabe");
								SchreibeZug('NotationstabelleAufgabe');

								postit('position fen ' + T_Zuege.FEN + " moves " + T_Zuege.ZugVon + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung);

								GlobalActionStep = AS_CV_DRAWVariantenMOVE;

								//postit('setoption name clear hash'); // Mai 2021 kommentiert
								//postit('go depth ' + Suchtiefe);
								PlayChallengeVarianten();
							}
						}
						break;
					}
					case AS_CV_DRAWVariantenMOVE:
					{

						$('<p class="LogAus LogAusMini">' + compressline(line) + '</p>').appendTo('#logliste');

						// Sammeln der Zugergebnisse

						var m_scorecp 	= (/(score cp )(?<scorecp>[-]{0,1}\d*)/g).exec(line);
						var m_wdl 		= (/(wdl) (?<wdl_w>\d*) (?<wdl_d>\d*) (?<wdl_l>\d*)/g).exec(line);

						if(m_scorecp != null) {
							EngineScores.push(m_scorecp.groups.scorecp);
						}
						if(m_wdl != null) {
							if(m_wdl.length == 5) { // dann wurden alle Gruppen erkannt
								Enginewdl.push( { wdl_w: m_wdl.groups.wdl_w, wdl_d: m_wdl.groups.wdl_d, wdl_l: m_wdl.groups.wdl_l } );
							}
						}

						var m_EnginesBest = (r_bestmove).exec(line); // Hier ist der Zug ja nicht bekannt, deshalb kein match auf den Zug
						if (m_EnginesBest != null) { // Dann hat die Engine diesen Zug abschließend untersucht 

							var EnginesBestMoveStockfish = line.substr(9, 4); // Die Engine antwortet immer in diesem Format
							// Findet alle Zeilen, in denen der aktuelle Thema als Father vorkommt und die Ebene um 1 höher ist
							var SucMoves = $.grep(ChallengeMoves, function(CurMove, i) { return (ChallengeMoves['PreMoveId'] == ''); });
	

							console.log(PlayerScores.join() + '\n' + EngineScores.join() + '\n' + m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach + m_EnginesBest.groups.umwandlung);
							console.log(JSON.stringify(T_Zuege));

						}
						break;
					}
				}
			}
		});

		$("#TriggerTag").on("gocmd",			function(event, EngineCommand)	{	postit(EngineCommand);												});
		$("#TriggerTag").on("GetBoard",			function() 						{	postit('d');														});
		$("#TriggerTag").on("OK",				function() 						{	postit('isready');													});
		$("#TriggerTag").on("SetFenPosition",	function(event, FEN_string) 	{	postit('position fen ' + FEN_string);								});
		$("#TriggerTag").on("UciNewGame",		function() 						{	postit('ucinewgame');												});
		$("#TriggerTag").on("go",				function() 						{	postit('go depth ' + Suchtiefe);									});
		$("#TriggerTag").on("isMoveCorrect",	function(event, Stockfishzug) 	{	postit('go depth 1 searchmoves ' + Stockfishzug);					});
		$("#TriggerTag").on("quit",				function() 						{	postit('quit');														});
		$("#TriggerTag").on("validateMove",		function(event, Stockfishzug) 	{	postit('go depth ' + Suchtiefe + ' searchmoves ' + Stockfishzug);	});
	
		ConfigureEngine(); // Parameter context wird noch nicht genutzt

	});

}