function TheIndexGeorgFunction() {

	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	Stockfish().then((sf) => {

		stockFish = sf; // stockFish ist global verfügbar

		// Der Listener:
		// Von außen wird ein Context, auf den der Listener aktuell reagieren soll vorgegeben
		// Ein Context kann aus mehreren Schritten bestehen, die NACHEINANDER ablaufen müssen.
		// Die letzte Massnahme in einem Schritt ist das Auslösen des Kommandos für den nächsten Schritt
		// Die Schrittfolge ergibt sich implizit durch das Setzen der Schrittkennungen
		sf.addMessageListener((line) => {

			// Immer:
			if(logMe(LOGLEVEL_IMPORTANT, LOGTHEME_ENGINEDIALOG)) console.log('==== Nachricht: "' + line + '" für "' + GlobalActionContext + '" mit "' + GlobalActionStep + '" erhalten ');

			// Pro GlobalActionContext:

			if (GlobalActionContext == AC_ENGINEDIALOG) {
				// GlobalActionStep ist hier nicht nötig und GlobalActionContext wird nicht geändert.
				// Also werden alle Antworten werden hier einfach erkannt und rausgeschrieben.
				$('<p class="LogAus LogAusMiddle">' + compressline(line) + '</p>').appendTo('#logliste');
			}

			if (GlobalActionContext == AC_CHALLENGEIMPORT) {

				// In executeMove wird die Kandidatenauswahl für die Bestimmung des Ausgangsfeldes eines Zugs angestoßen
				// Das Auswahlfeld eines Zuges wird für die Kommunikation mit der Engine zwingend benötigt.  Es wird für alle Kandidaten angefragt.
				// Nur für den einzig möglichen Zug wird 'bestmove .... ponder ....' zurückgegeben.
				// Für alle anderen Züge kommt 'bestmove (none)' als letzte Antwort der Engine zu diesem Zug. Ist damit also beendet.
				// VVor den Zeilen mit bestmove kommen noch Zeilen mit 'info depth .....'. Werden zur Zeit ignoriert. Vielleicht mal brauchbar?

				$('<p class="LogAus LogAusMiddle">' + compressline(line) + '</p>').appendTo('#logliste');

				if (GlobalActionStep == AS_IDENTIFYUNIQUEMOVE) {

					// Es gibt nur diese eine relevante Zeile. Diese Zeile identifiziert den einzig möglichen Zug.
					// Übernehmen und Umschalten in den nächsten Schritt.
					if (line.indexOf('bestmove') >= 0 && line.match(SingleMove.ZugNach)) {

						SingleMove.ZugVon = line.slice(9, 11); // gilt für Bauern- und für Figurenzüge
						SingleMove.ZugStockfish = line.slice(9).split(" ")[0]; // einschl. Umwandlung
						// Rochaden und nur Rochaden sind in ZugLang schon eingetragen. Soll wegen der Sonderschreibweise auch so bleiben
						if (SingleMove.ZugLang == '') {
							SingleMove.ZugLang = SingleMove.ZugFigur + SingleMove.ZugVon + SingleMove.ZugAktion + SingleMove.ZugNach + SingleMove.ZugUmwandlung + SingleMove.ZugZeichen;
						}

						GlobalActionStep = AS_EXECUTEUNIQUEMOVE;
						postit('isready'); // Das ist das Signal für den nächsten Step
					}
				}

				if (GlobalActionStep == AS_EXECUTEUNIQUEMOVE) {

					// Nur readyok ist relevant. Jetzt kann der Zug ausgeführt werden.
					// Der Zug wird ausgeführt, damit die neue FEN abgeholt werden kann.
					if (line.indexOf('readyok') >= 0) {

						GlobalActionStep = AS_INTERPRETELOCATEDMOVE;
						postit('position fen ' + SingleMove.FEN + " moves " + SingleMove.ZugStockfish);
						postit('d');
						postit('isready'); // Ist das isready wirklich notwendig?
					}
				}

				if (GlobalActionStep == AS_INTERPRETELOCATEDMOVE) {

					// Hier ist nur die Zeile mit FEN relevant.
					// Der in der Engine ausgeführte Zug wird jetzt
					// - auf dem Brett gezogen
					// - in der Liste notiert.
					// - in der Zugliste gespeichert
					// Abschließend werden die Zugdaten für den nächsten Zug verschoben und der nächste Zug wird ausgelöst

					if (line.indexOf('Fen') >= 0) {

						// Die Engine hat den Zug ausgeführt. Der Zug ist schon in SingleMove eingetragen. Jetzt den Zug auf dem Brett ausführen
						ZieheZug(SingleMove, ANIMATIONSPEED_ZERO).then(function() { 

							// Schon hier übertragen. In ...TreeNode werden die Daten aus den Importdaten gelesen (wegen Kompatibilität zu varianten)
							TransferZugNachStellung(Stellungsdaten, SingleMove)

							// Den Zug in die Notation eintragen, wenn notwendig eine neue Zeile generieren
							if (SingleMove.ZugFarbe == WEISSAMZUG || Stellungsdaten.CreateNewNode) {

								Stellungsdaten.CurNodeId = NODEPRÄFIX + SingleMove.CurMoveIndex;
								Stellungsdaten.CurMoveId = SingleMove.CurMoveId;

								if(GLOBALNOTATIONMODE == NOTATIONMODE_VISIBLE) NewTreeNode('importtreenotationid', 'move', Stellungsdaten, SingleMove, false, false);

								Stellungsdaten.CreateNewNode = false;
							} else {
								if(GLOBALNOTATIONMODE == NOTATIONMODE_VISIBLE) UpdateTreeNode('importtreenotationid', 'move', Stellungsdaten, SingleMove, false, false);
							}

							// Jetzt wird die neue Situation in das Objekt mit den Daten zur Überprüfung des Import eingetragen. 
							Importdaten.PreFEN				= SingleMove.FEN;
							Stellungsdaten.FEN				= line.substr(5);
							Stellungsdaten.ZugFarbe		= Stellungsdaten.FEN.includes("w") ? WEISSAMZUG : SCHWARZAMZUG;
							Stellungsdaten.CurMoveId	= SingleMove.CurMoveId;
							Stellungsdaten.PreMoveId	= SingleMove.PreMoveId;

							// Damit wird die aktuelle Situation und der Zug selbst für den insert in die Datenbank festgehalten
							ChallengeMoves.push(SingleMove);

							validateSingleMove(); // Die weitere Analyse wird außerhalb des Listeners durchgeführt

						}, function() {alert('reject');});

					}
				}
			}

			if (GlobalActionContext == AC_POSITION_PLAY) {

				switch (GlobalActionStep) {
					// Die Überprüfung des Spielerzuges wurde im mouseup ausgelöst. Hier wird ausgewertet und ggf ausgeführt
					case AS_CHECKPOSITIONPLAYERMOVE:
						{
							if (line.indexOf('bestmove') >= 0) {

								if (line.match(T_Zuege.ZugNach)) {

									// Dann ist das ein legaler Zug des Spielers.
									// Der Zug wird in der Oberfläche vollzogen und die Engine wird beauftragt zu ziehen
									$('<p class="LogAus LogAusMiddle">' + compressline(line) + '</p>').appendTo('#logliste');

									T_Zuege.ZugNummer += 1;
									T_Zuege.CurMoveIndex += 1;
									T_Zuege.PreMoveId = T_Zuege.CurMoveId;
									T_Zuege.CurMoveId = MOVEPRÄFIX + T_Zuege.CurMoveIndex;

									TransferZugNachStellung(Stellungsdaten, T_Zuege);
									ZieheZug(T_Zuege, ANIMATIONSPEED_ZERO);

									NotiereZug('challengenotation', Stellungsdaten, T_Zuege, MOVEPRESENTATION_MOVE);

									GlobalActionStep = AS_CHECKPOSITIONPLAYERMOVEFINISHED;
									postit('position fen ' + T_Zuege.FEN + " moves " + T_Zuege.ZugVon + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung);
									postit('isready'); // Das ist das Signal für den nächsten Step
								} else {
									$('<p class="LogAus LogAusMini">' + compressline(line) + '</p>').appendTo('#logliste');
									showNotAcceptedMove();
									GlobalActionStep = AS_MOVECYCLEABORTED;
								}
							}
							break;
						}
					// Der Spielerzug ist durchgeführt. Die neu entstandene Situation wird abgefragt
					case AS_CHECKPOSITIONPLAYERMOVEFINISHED:
						{
							if (line.indexOf('readyok') == 0) {
								$('<p class="LogAus LogAusMiddle">' + compressline(line) + '</p>').appendTo('#logliste');

								GlobalActionStep = AS_GETPOSITIONFEN;
								postit('d'); // Damit die neue FEN in T_Zuege übertragen werden kann.
							} else {
								$('<p class="LogAus LogAusMini">' + compressline(line) + '</p>').appendTo('#logliste');
							}
							break;
						}
					// Hier ist der Zwischenschritt mit isready nicht nötig
					// Die Abfrageergebnisse werden ausgewertet und im Zugobjekt festgehalten
					// Die Engine wird beauftragt, sich selbst einen besten Zug zu suchen
					case AS_GETPOSITIONFEN:
						{
							if (line.indexOf('Fen') == 0) {
								$('<p class="LogAus LogAusMiddle">' + compressline(line) + '</p>').appendTo('#logliste');

								T_Zuege.FEN = line.substr(5);
								T_Zuege.ZugFarbe = line.indexOf('w') > 0 ? WEISSAMZUG : SCHWARZAMZUG;
								//T_Zuege.ZugUmwandlung 	= '';

								GlobalActionStep = AS_DRAWPOSITIONENGINEMOVE;
								postit('go depth ' + Suchtiefe);
							} else {
								$('<p class="LogAus LogAusMini">' + compressline(line) + '</p>').appendTo('#logliste');
							}
							break;
						}
					// Die Engine hat einen Zug gefunden. Dieser Zug wird in der Oberfläche vollzogen.
					// Die Engine wird beauftragt zu ziehen und die neue Situation wird abgefragt
					case AS_DRAWPOSITIONENGINEMOVE:
						{

							if (line.indexOf('bestmove') == 0) {
								$('<p class="LogAus LogAusMiddle">' + compressline(line) + '</p>').appendTo('#logliste');

								if (line.substr(9, 6) != '(none)') {

									let m_EnginesBest = (r_bestmove).exec(line); // Hier ist der Zug ja nicht bekannt
									T_Zuege.ZugVon = m_EnginesBest.groups.movevon;
									T_Zuege.ZugNach = m_EnginesBest.groups.movenach;
									T_Zuege.ZugStockfish = m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach + m_EnginesBest.groups.umwandlung;
									T_Zuege.ZugUmwandlung = m_EnginesBest.groups.umwandlung;
									T_Zuege.ZugFigur = getMoveNotations(T_Zuege.FEN, m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach, 'FigurVon');
									T_Zuege.ZugAktion = getMoveNotations(T_Zuege.FEN, m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach, "ZugAktion");
									T_Zuege.ZugKurz = getMoveNotations(T_Zuege.FEN, m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach + m_EnginesBest.groups.umwandlung, "kurz");
									//T_Zuege.ZugZeichen =

									if (T_Zuege.ZugFarbe == WEISSAMZUG) {
										T_Zuege.ZugNummer += 1;
										T_Zuege.CurMoveIndex += 1;
										T_Zuege.PreMoveId = T_Zuege.CurMoveId;
										T_Zuege.CurMoveId = MOVEPRÄFIX + T_Zuege.CurMoveIndex;
									}

									TransferZugNachStellung(Stellungsdaten, T_Zuege);
									ZieheZug(T_Zuege, ANIMATIONSPEED_ZERO);
									NotiereZug('challengenotation', Stellungsdaten, T_Zuege, MOVEPRESENTATION_MOVE);

									Stellungsdaten.CurNodeId = NODEPRÄFIX + T_Zuege.CurMoveIndex;
									Stellungsdaten.CurMoveId = T_Zuege.CurMoveId;

									GlobalActionStep = AS_FINISHPOSITIONENGINEMOVE;
									postit('position fen ' + T_Zuege.FEN + " moves " + T_Zuege.ZugVon + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung);
									postit('d');

								} else { // == (none) kommt mindestens (wahrscheinlich aber nur) bei matt
									T_Zuege.ZugZeichen = MATT;
									T_Zuege.ZugFarbe = Stellungsdaten.ZugFarbe;
									UpdateTreeNode('challengenotation', MOVEPRESENTATION_MATTSIGN, Stellungsdaten, T_Zuege, false, false);
									GlobalActionStep = AS_MOVECYCLEABORTED;
									finishChallenge('Gut gemacht');
								}
							} else {
								$('<p class="LogAus LogAusMini">' + compressline(line) + '</p>').appendTo('#logliste');
							}
							break;
						}
					// Auswerten der jetzt entstandenen Situation
					case AS_FINISHPOSITIONENGINEMOVE:
						{

							if (line.indexOf('Fen') == 0) {
								$('<p class="LogAus LogAusMiddle">' + compressline(line) + '</p>').appendTo('#logliste');

								T_Zuege.FEN = line.substr(5);
								T_Zuege.ZugFarbe = line.indexOf('w') > 0 ? WEISSAMZUG : SCHWARZAMZUG;

								// Es wird kein neuer Zustand gesetzt, da jetzt der Spieler wieder neu zieht
								postit('isready');
							} else {
								$('<p class="LogAus LogAusMini">' + compressline(line) + '</p>').appendTo('#logliste');
							}
							break;
						}
				}
			}

			if (GlobalActionContext == AC_POSITION_RATING) {

				switch (GlobalActionStep) {
					// Die Aufträge dazu wurden in der GUI ausgelöst
					// Hier werden die Scores des Spielerzugs gesammelt
					// Wird ein bestmove mit ZugNach gefunden, war der Zug gültig. Dann weiter, sonst einfach fertig wegen ungültigem Zug
					case AS_PREPARERATINGPLAYERMOVE:
						{
							// Neu Mai 2021
							$('<p class="LogAus LogAusMini">' + compressline(line) + '</p>').appendTo('#logliste');

							//let m_depth 	= (/(depth )(?<depth>\d*)/g).exec(line);		// wird noch nicht genutzt
							//let m_seldepth 	= (/(seldepth )(?<seldepth>\d*)/g).exec(line);	// wird noch nicht genutzt
							let m_scorecp = (/(score cp )(?<scorecp>[-]{0,1}\d*)/g).exec(line);
							let m_wdl = (/(wdl) (?<wdl_w>\d*) (?<wdl_d>\d*) (?<wdl_l>\d*)/g).exec(line);

							if (m_scorecp != null) {
								PlayerScores.push(m_scorecp.groups.scorecp);
							}
							if (m_wdl != null) {
								if (m_wdl.length == 5) { // dann wurden alle Gruppen erkannt
									Playerwdl.push({ wdl_w: m_wdl.groups.wdl_w, wdl_d: m_wdl.groups.wdl_d, wdl_l: m_wdl.groups.wdl_l });
								}
							}

							// bestmove mit dem Spielerzug kommt nur und genau dann, wenn der Zug gültig ist.
							// wenn bestmove nicht kommt, ist hier schluss. Ist das so schon richtig und fertig?
							if (line.indexOf('bestmove') >= 0) {

								if (line.match(T_Zuege.ZugNach)) {
									GlobalActionStep = AS_PREPARERATINGPLAYERMOVEFINISHED;
									postit('isready');
								} else {
									$('<p class="LogAus LogAusMini">' + compressline(line) + '</p>').appendTo('#logliste');
									showNotAcceptedMove();
									GlobalActionStep = AS_MOVECYCLEABORTED;
								}
							}
							break;
						}
					// da kommt noch eine unerwartete Zeile mit bestmove. Deshalb der Zwischenschritt,
					// der die Zeile einfach überliest (damit der nächste Schritt die "richtige" bestmove-Zeile bekommt)
					case AS_PREPARERATINGPLAYERMOVEFINISHED:
						{
							$('<p class="LogAus LogAusMiddle">' + compressline(line) + '</p>').appendTo('#logliste');

							// wenn nie ein readyok kommt,ist hier Schluss. Richtig und fertig?
							if (line.indexOf('readyok') == 0) {

								T_Zuege.ZugNummer += 1;
								T_Zuege.CurMoveIndex += 1;
								T_Zuege.PreMoveId = T_Zuege.CurMoveId;
								T_Zuege.CurMoveId = MOVEPRÄFIX + T_Zuege.CurMoveIndex;

								GlobalActionStep = AS_SIMULATERATINGPLAYERMOVE;
								//postit('setoption name clear hash'); // Mai 2021 kommentiert
								postit('go depth ' + Suchtiefe);
							}
							break;
						}
					case AS_SIMULATERATINGPLAYERMOVE:
						{
							$('<p class="LogAus LogAusMini">' + compressline(line) + '</p>').appendTo('#logliste');

							// Sammeln der Zugergebnisse

							let m_scorecp = (/(score cp )(?<scorecp>[-]{0,1}\d*)/g).exec(line);
							let m_wdl = (/(wdl) (?<wdl_w>\d*) (?<wdl_d>\d*) (?<wdl_l>\d*)/g).exec(line);

							if (m_scorecp != null) {
								EngineScores.push(m_scorecp.groups.scorecp);
							}
							if (m_wdl != null) {
								if (m_wdl.length == 5) { // dann wurden alle Gruppen erkannt
									Enginewdl.push({ wdl_w: m_wdl.groups.wdl_w, wdl_d: m_wdl.groups.wdl_d, wdl_l: m_wdl.groups.wdl_l });
								}
							}

							let m_EnginesBest = (r_bestmove).exec(line); // Hier ist der Zug ja nicht bekannt, deshalb kein match auf den Zug

							if (m_EnginesBest != null) { // Dann hat die Engine diesen Zug abschließend untersucht

								if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log(PlayerScores.join() + '\n' + EngineScores.join() + '\n' + m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach + m_EnginesBest.groups.umwandlung);
								if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log(JSON.stringify(T_Zuege));

								// der score wird nicht mehr berücksichtigt, weil wdl neu dazugekommen ist
								let maxPlayerScore = Math.max.apply(null, PlayerScores);
								let maxEngineScore = Math.max.apply(null, EngineScores);
								let ScoreDiff = maxEngineScore - maxPlayerScore;
								//let BetterEngineMoveFlag = maxEngineScore > maxPlayerScore + CentiPawnsMoveDifference;


								let lastPlayerwdl = parseInt(Playerwdl.slice(-1)[0].wdl_w);
								let lastEnginewdl = parseInt(Enginewdl.slice(-1)[0].wdl_w);
								let BetterEngineMoveFlag = lastEnginewdl > lastPlayerwdl + wdlDifference;

								let RatingSpielerzug_vergleich = T_Zuege.ZugVon + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung.toLowerCase();
								let Enginezug_vergleich = m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach + m_EnginesBest.groups.umwandlung;

								if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('maxEngineScore: ' + maxEngineScore + ' CentiPawnsMoveDifference: ' + CentiPawnsMoveDifference + ' maxPlayerScore: ' + maxPlayerScore);
								if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('maxEnginewdl: ' + lastEnginewdl + ' wdlDifference: ' + wdlDifference + ' maxPlayerwdl: ' + lastPlayerwdl);
								if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('RatingSpielerzug_vergleich: ' + RatingSpielerzug_vergleich + 'Enginezug_vergleich: ' + Enginezug_vergleich);

								let DecisionText = 'maxEnginewdl: ' + lastEnginewdl + ' wdlDifference: ' + wdlDifference + ' maxPlayerwdl: ' + lastPlayerwdl;
								$('<p class="LogAus LogAusMiddle">' + DecisionText + '</p>').appendTo('#logliste');

								if (RatingSpielerzug_vergleich != Enginezug_vergleich && BetterEngineMoveFlag) {

									ZugdifferenzDialog = $("#dialog-zugdifferenz").dialog({
										title: "Zugdifferenz",
										height: 400,
										width: 600,
										modal: true,
										open: function () {
											$('#ratingspielerzug').html(getMoveNotations(T_Zuege.FEN, T_Zuege.ZugStockfish, 'kurz'));
											$('#zugvorschlag').empty();
											$('#zugbewertung').empty();
										},
										buttons: {
											'Den stärkeren Zug anzeigen': {
												click: function () {
													$('#zugvorschlag').empty().append('<span>' + getMoveNotations(T_Zuege.FEN, m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach, "kurz") + '</span>');
													$('#zugbewertung').empty().append('<span>(ist um ' + ScoreDiff + ' cp	stärker)</span>');

													// Anhand der Beschriftung des Knopfes wird entschieden
													if ($('.ui-button:contains(Den stärkeren Zug anzeigen)').length == 1) {
														$('.ui-button:contains(Den stärkeren Zug anzeigen)').html('Mit diesem Zug weiterspielen');
													} else {

														// T_Zuege mit der neuen Situation versorgen
														T_Zuege.ZugVon = m_EnginesBest.groups.movevon;
														T_Zuege.ZugNach = m_EnginesBest.groups.movenach;
														T_Zuege.ZugStockfish = m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach + m_EnginesBest.groups.umwandlung;
														T_Zuege.ZugUmwandlung = m_EnginesBest.groups.umwandlung;
														T_Zuege.ZugFigur = getMoveNotations(T_Zuege.FEN, m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach, 'FigurVon');
														T_Zuege.ZugAktion = getMoveNotations(T_Zuege.FEN, m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach, "ZugAktion");
														T_Zuege.ZugKurz = getMoveNotations(T_Zuege.FEN, m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach + m_EnginesBest.groups.umwandlung, "kurz");

														TransferZugNachStellung(Stellungsdaten, T_Zuege);
														ZieheZug(T_Zuege, ANIMATIONSPEED_ZERO);
														NotiereZug('challengenotation', Stellungsdaten, T_Zuege, MOVEPRESENTATION_MOVE);

														GlobalActionStep = AS_FINISHRATINGPLAYERMOVE;
														postit('position fen ' + T_Zuege.FEN + " moves " + m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach + m_EnginesBest.groups.umwandlung);
														postit('d');

														$(this).dialog('close');
													}
												},
												text: 'Den stärkeren Zug anzeigen',
												class: 'ImportantKomfortButton'
											},
											'Mit meinem Zug weiterspielen': {
												click: function () {

													TransferZugNachStellung(Stellungsdaten, T_Zuege);
													ZieheZug(T_Zuege, ANIMATIONSPEED_ZERO);
													NotiereZug('challengenotation', Stellungsdaten, T_Zuege, MOVEPRESENTATION_MOVE);

													GlobalActionStep = AS_FINISHRATINGPLAYERMOVE;
													postit('position fen ' + T_Zuege.FEN + " moves " + T_Zuege.ZugVon + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung);
													postit('d');

													$(this).dialog('close');
												},
												text: 'Mit meinem Zug weiterspielen',
												class: 'ImportantKomfortButton'
											},
											'Meinen Zug zurücknehmen': {
												click: function () {
													T_Zuege = { ...T_Zuege_undo };
													$(this).dialog('close');
												},
												text: 'Meinen Zug zurücknehmen',
												class: 'ImportantKomfortButton'
											}
										}
									});

								} else {
									// Spielerzug ist ausreichend gut

									TransferZugNachStellung(Stellungsdaten, T_Zuege);
									ZieheZug(T_Zuege, ANIMATIONSPEED_ZERO);
									NotiereZug('challengenotation', Stellungsdaten, T_Zuege, MOVEPRESENTATION_MOVE);

									GlobalActionStep = AS_FINISHRATINGPLAYERMOVE;
									postit('position fen ' + T_Zuege.FEN + " moves " + T_Zuege.ZugVon + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung);
									postit('d');

								}
							}
							break;
						}
					case AS_FINISHRATINGPLAYERMOVE:
						{
							if (line.indexOf('Fen') == 0) {
								$('<p class="LogAus LogAusMiddle">' + compressline(line) + '</p>').appendTo('#logliste');

								T_Zuege.FEN = line.substr(5);
								T_Zuege.ZugFarbe = line.indexOf('w') > 0 ? WEISSAMZUG : SCHWARZAMZUG;
								//T_Zuege.ZugUmwandlung 	= '';

								GlobalActionStep = AS_DRAWRATINGENGINEMOVE;
								postit('go depth ' + Suchtiefe);
							} else {
								$('<p class="LogAus LogAusMini">' + compressline(line) + '</p>').appendTo('#logliste');
							}
							break;
						}
					case AS_DRAWRATINGENGINEMOVE:
						{
							if (line.indexOf('bestmove') == 0) {
								$('<p class="LogAus LogAusMiddle">' + compressline(line) + '</p>').appendTo('#logliste');

								if (line.substr(9, 6) != '(none)') {

									let m_EnginesBest = (r_bestmove).exec(line); // Hier ist der Zug ja nicht bekannt
									T_Zuege.ZugVon = m_EnginesBest.groups.movevon;
									T_Zuege.ZugNach = m_EnginesBest.groups.movenach;
									T_Zuege.ZugStockfish = m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach + m_EnginesBest.groups.umwandlung;
									T_Zuege.ZugUmwandlung = m_EnginesBest.groups.umwandlung;
									T_Zuege.ZugFigur = getMoveNotations(T_Zuege.FEN, m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach, 'FigurVon');
									T_Zuege.ZugAktion = getMoveNotations(T_Zuege.FEN, m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach, "ZugAktion");
									T_Zuege.ZugKurz = getMoveNotations(T_Zuege.FEN, m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach + m_EnginesBest.groups.umwandlung, "kurz");
									//T_Zuege.ZugZeichen =

									if (T_Zuege.ZugFarbe == WEISSAMZUG) {
										T_Zuege.ZugNummer += 1;
										T_Zuege.CurMoveIndex += 1;
										T_Zuege.PreMoveId = T_Zuege.CurMoveId;
										T_Zuege.CurMoveId = MOVEPRÄFIX + T_Zuege.CurMoveIndex;
									}

									TransferZugNachStellung(Stellungsdaten, T_Zuege);
									ZieheZug(T_Zuege, ANIMATIONSPEED_ZERO);
									NotiereZug('challengenotation', Stellungsdaten, T_Zuege, MOVEPRESENTATION_MOVE);

									GlobalActionStep = AS_FINISHRATINGENGINEMOVE;
									postit('position fen ' + T_Zuege.FEN + " moves " + T_Zuege.ZugVon + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung);
									postit('d');

								} else { // == (none) kommt mindestens (wahrscheinlich aber nur) bei matt

									T_Zuege.ZugZeichen = MATT;
									TransferZugNachStellung(Stellungsdaten, T_Zuege);
									// ZieheZug fehlt noch ?
									NotiereZug('challengenotation', Stellungsdaten, T_Zuege, MOVEPRESENTATION_MOVE);
									finishChallenge('Gut gemacht');
								}
							} else {
								$('<p class="LogAus LogAusMini">' + compressline(line) + '</p>').appendTo('#logliste');
							}
							break;
						}
					case AS_FINISHRATINGENGINEMOVE:
						{
							if (line.indexOf('Fen') == 0) {
								$('<p class="LogAus LogAusMiddle">' + compressline(line) + '</p>').appendTo('#logliste');

								T_Zuege.FEN = line.substr(5);
								T_Zuege.ZugFarbe = line.indexOf('w') > 0 ? WEISSAMZUG : SCHWARZAMZUG;

								// Kein neuer Zustand. Fertig!
								postit('isready');
							} else {
								$('<p class="LogAus LogAusMini">' + compressline(line) + '</p>').appendTo('#logliste');
							}
							break;
						}
				}
			}

			// Dieser Zweig wird nicht mehr aktiv genutzt. Wird in ShowFunctions.js zu häufig aufgerufen.
			// AC_CHALLENGE_VARIANTENDIREKT ist (noch) die Voreinstellung, GlobalActionStep ist '', also passiert nichts.
			// Noch zu ändern!!!
			if (GlobalActionContext == AC_CHALLENGE_VARIANTENDIREKT) {

				switch (GlobalActionStep) {
					case AS_VERIFYMOVE:
						{
							$('<p class="LogAus LogAusMini">' + compressline(line) + '</p>').appendTo('#logliste');

							// bestmove mit dem Spielerzug kommt nur und genau dann, wenn der Zug gültig ist.
							// wenn bestmove nicht kommt, ist hier schluss. Ist das so schon richtig und fertig?
							if (line.indexOf('bestmove') >= 0 && line.match(CCM.ZugStockfish)) {

								GlobalActionStep = AS_VERIFYMOVEFINISHED;
								postit('isready');
							}
							break;
						}
					case AS_VERIFYMOVEFINISHED:
						{
							$('<p class="LogAus LogAusMiddle">' + compressline(line) + '</p>').appendTo('#logliste');

							// wenn nie ein readyok kommt,ist hier Schluss. Richtig und fertig?
							if (line.indexOf('readyok') == 0) {

								//CCM = 	$.grep(ChallengeMoves, function(PMI, i) { return PMI['PreMoveId'] == VariantenMoveId; });

								//if (getMoveNotations(T_Zuege.FEN, T_Zuege.ZugStockfish, 'kurz') != CCM.ZugKurz) {
								if (T_Zuege.ZugStockfish != CCM.ZugStockfish) {
									EnginezugDialog = $("#dialog-bessererzug").dialog({
										title: "Falscher Zug",
										height: 400,
										width: 600,
										modal: true,
										open: function () {
											$('#variantenspielerzug').html(getMoveNotations(T_Zuege.FEN, T_Zuege.ZugStockfish, 'kurz'));
											$('#variantenzugvorschlag').html(ChallengeMoves[VariantenMovecounter].ZugKurz);
											$('#zugbewertung').empty();
										},
										buttons: {
											Ok: function () {
												$(this).dialog('close');
											}
										}
									});
								} else {

									TransferZugNachStellung(Stellungsdaten, T_Zuege);
									ZieheZug(T_Zuege, ANIMATIONSPEED_ZERO);
									NotiereZug('challengenotation', Stellungsdaten, T_Zuege, MOVEPRESENTATION_MOVE);

									postit('position fen ' + T_Zuege.FEN + " moves " + T_Zuege.ZugVon + T_Zuege.ZugNach + T_Zuege.ZugUmwandlung);

									GlobalActionStep = AS_DRAWVARIANTENMOVE;

									//postit('setoption name clear hash'); // Mai 2021 kommentiert
									//postit('go depth ' + Suchtiefe);
									PlayChallengeVarianten();
								}
							}
							break;
						}
					case AS_DRAWVARIANTENMOVE:
						{

							$('<p class="LogAus LogAusMini">' + compressline(line) + '</p>').appendTo('#logliste');

							// Sammeln der Zugergebnisse

							let m_scorecp = (/(score cp )(?<scorecp>[-]{0,1}\d*)/g).exec(line);
							let m_wdl = (/(wdl) (?<wdl_w>\d*) (?<wdl_d>\d*) (?<wdl_l>\d*)/g).exec(line);

							if (m_scorecp != null) {
								EngineScores.push(m_scorecp.groups.scorecp);
							}
							if (m_wdl != null) {
								if (m_wdl.length == 5) { // dann wurden alle Gruppen erkannt
									Enginewdl.push({ wdl_w: m_wdl.groups.wdl_w, wdl_d: m_wdl.groups.wdl_d, wdl_l: m_wdl.groups.wdl_l });
								}
							}

							let m_EnginesBest = (r_bestmove).exec(line); // Hier ist der Zug ja nicht bekannt, deshalb kein match auf den Zug
							if (m_EnginesBest != null) { // Dann hat die Engine diesen Zug abschließend untersucht

								let EnginesBestMoveStockfish = line.substr(9, 4); // Die Engine antwortet immer in diesem Format
								// Findet alle Zeilen, in denen der aktuelle Thema als parent vorkommt und die Ebene um 1 höher ist
								let SucMoves = $.grep(ChallengeMoves, function (CurMove, i) { return (ChallengeMoves['PreMoveId'] == ''); });


								if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log(PlayerScores.join() + '\n' + EngineScores.join() + '\n' + m_EnginesBest.groups.movevon + m_EnginesBest.groups.movenach + m_EnginesBest.groups.umwandlung);
								if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log(JSON.stringify(T_Zuege));

							}
							break;
						}
				}
			}
		});

		// Diese Nachrichten können ausgelöst werden
		$("#triggertag").on("gocmd", function (event, EngineCommand) { postit(EngineCommand); });
		$("#triggertag").on("GetBoard", function () { postit('d'); });
		$("#triggertag").on("OK", function () { postit('isready'); });
		$("#triggertag").on("SetFenPosition", function (event, FEN_string) { postit('position fen ' + FEN_string); });
		$("#triggertag").on("UciNewGame", function () { postit('ucinewgame'); });
		$("#triggertag").on("go", function () { postit('go depth ' + Suchtiefe); });
		$("#triggertag").on("isMoveCorrect", function (event, Stockfishzug) { postit('go depth 1 searchmoves ' + Stockfishzug); });
		$("#triggertag").on("quit", function () { postit('quit'); });
		$("#triggertag").on("validateMove", function (event, Stockfishzug) { postit('go depth ' + Suchtiefe + ' searchmoves ' + Stockfishzug); });

		ConfigureEngine();

	});

}