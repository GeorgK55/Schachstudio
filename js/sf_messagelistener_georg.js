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
			console.log('====== ' + GlobalActionContext + ' mit ' + line.data);

			// Pro GlobalActionContext:
			// GlobalActionStep ist hier nicht nötig und GlobalActionContext wird nicht geändert. 
			// Also werden alle Antworten werden hier einfach erkannt und rausgeschrtieben.
			if(GlobalActionContext == AC_ENGINEDIALOG) {
				$('<p class="LogAus LogAusMiddle">' + line + '</p>').appendTo('#logliste');
			}
			
			if(GlobalActionContext == AC_GAMEIMPORT) {

				// In getDataFunctions wird die Kandidatenauswahl für die Bestimmung des Ausgangsfeldes eines Zugs angestoßen
				// Das Auswahlfeld eines Zuges wird für die Kommunikation mit der Engine zwingend benötigt
				
				if(GlobalActionStep == AS_EXPECTPOSSIBLEMOVES) {
					
					// Es gibt nur diese eine relevante Zeile.  Auswerten und Umschalten in den nächsten Schritt.
					if (line.indexOf('bestmove') >= 0 && line.match(T_Zuege.ZugNach)) {
						
						T_Zuege.ZugVon 			= line.slice(9, 11); // gilt für Bauern- und für Figurenzüge
						T_Zuege.ZugStockfish 	= T_Zuege.ZugVon + T_Zuege.ZugNach;
						T_Zuege.ZugLang 		= T_Zuege.ZugFigur + T_Zuege.ZugVon + T_Zuege.ZugAktion + T_Zuege.ZugNach + T_Zuege.ZugZeichen;					
						
						console.log('=== T_Zuege.ZugStockfish: '  + T_Zuege.ZugStockfish );
						$('<p>=== T_Zuege.ZugStockfish: '  + T_Zuege.ZugStockfish + '</p>').appendTo('#ImportTriggerTag');
						
						GlobalActionStep = AS_FINISHPOSSIBLEMOVES;
						postit('isready'); // Das ist das Signal für den nächsten Step
					}
				}
				
				if(GlobalActionStep == AS_FINISHPOSSIBLEMOVES) {
					
					// Nur readyok ist relevant. Jetzt kann der Zug ausgeführt werden.
					if(line.indexOf('readyok') >= 0)  {
						
							GlobalActionStep = AS_EXPECTMOVEFINISHED;
							postit('position fen ' + T_Zuege.FEN + " moves " + T_Zuege.ZugStockfish + T_Zuege.ZugUmwandlung);
							postit('d');
							postit('isready');
					}
				}
				
				if(GlobalActionStep == AS_EXPECTMOVEFINISHED) {
					
					if(line.indexOf('Fen') >= 0) {

						let ZuglisteZug = Object.assign({}, T_Zuege);
						Zugliste.push(ZuglisteZug);
						
						GlobalMovesData.PreFEN = T_Zuege.FEN;					
						T_Zuege.FEN = line.substr(5);
						T_Zuege.ZugFarbe = line.indexOf('w') > 0 ? WEISSAMZUG : SCHWARZAMZUG;
						GlobalMovesData.FEN = line.substr(5);
						GlobalMovesData.ZugFarbe = GlobalMovesData.ZugFarbe == WEISSAMZUG ? SCHWARZAMZUG : WEISSAMZUG;
												
						ZieheZug('Brett_ImportAufgabe_', 'zugmarkerimport');
						SchreibeZug('NotationslisteImport');

						console.log('GlobalMovesData.FEN: ' + GlobalMovesData.FEN);
						console.log('GlobalMovesData.idx: ' + GlobalMovesData.idx);

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

							ZieheZug('Brett_SpieleAufgabe_', "zugmarkeraufgabe");
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
		
								ZieheZug('Brett_SpieleAufgabe_', "zugmarkeraufgabe");
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

						if (m_EnginesBest != null) { 

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

							var Spielerzug_vergleich = T_Zuege.ZugVon + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung.toLowerCase();
							var Enginezug_vergleich  = m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach + m_EnginesBest.groups.umwandlung;

							console.log('maxEngineScore: ' + maxEngineScore + ' CentiPawnsMoveDifference: ' + CentiPawnsMoveDifference + ' maxPlayerScore: ' + maxPlayerScore);
							console.log('maxEnginewdl: ' + lastEnginewdl + ' wdlDifference: ' + wdlDifference + ' maxPlayerwdl: ' + lastPlayerwdl);
							console.log('Spielerzug_vergleich: ' + Spielerzug_vergleich + 'Enginezug_vergleich: ' + Enginezug_vergleich);

							var DecisionText = 'maxEnginewdl: ' + lastEnginewdl + ' wdlDifference: ' + wdlDifference + ' maxPlayerwdl: ' + lastPlayerwdl;
							$('<p class="LogAus LogAusMiddle">' + DecisionText + '</p>').appendTo('#logliste');

							if(Spielerzug_vergleich != Enginezug_vergleich && BetterEngineMoveFlag) {

								ZugdifferenzDialog = $( "#dialog_Zugdifferenz" ).dialog({
									title: "Zugdifferenz",
									height: 400,
									width: 600,
									modal: true,
									open: function () {
										$('#Spielerzug').html(getMoveNotations(T_Zuege.FEN, T_Zuege.ZugStockfish, 'kurz'));
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

													ZieheZug('Brett_SpieleAufgabe_', "zugmarkeraufgabe");
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

												ZieheZug('Brett_SpieleAufgabe_', "zugmarkeraufgabe");
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
								ZieheZug('Brett_SpieleAufgabe_', "zugmarkeraufgabe");
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

								ZieheZug('Brett_SpieleAufgabe_', "zugmarkeraufgabe");
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