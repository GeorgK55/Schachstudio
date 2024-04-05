
// Wird nach jedem Zug des Spielers aufgerufen.
//
function processChallengeMoveVarianten() { if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	ChallengeMoveVariantenResult = $.Deferred();

	let MC_challenge = determineChallengeMoveContext(Challenge.AmZug, Stellungsdaten.PreMoveId, Stellungsdaten.ZugLevel)
	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log(MC_challenge.result + ' erkannt');

	// ERROR, UNKNOWNMOVE, NODESCENDENTS und NOCOLORMOVES werden hier einfach weitergegeben
	// In MAINMOVEMIT werden die nur die für Variantensituationen nötigen Funktionen ausgeführt.
	// Weiter ohne break, damit die restlichen Funktionen in MAINMOVEOHNE verarbeitet werden.
	switch(MC_challenge.result) {
		case MOVERESULT_ERROR:
		// case MOVERESULT_UNKNOWNMOVE: kann es hier nicht geben
		case MOVERESULT_NODESCENDENTS:
		case MOVERESULT_NOCOLORMOVES:
			showjstreeimportant('challengenotation');
			ChallengeMoveVariantenResult.reject({ result: MC_challenge.result, reason: Stellungsdaten.ZugFarbe, moveid: Stellungsdaten.PreMoveId });
			break;
		// case MOVERESULT_VARIANTEMOVE: // kann es hier nicht geben
		case MOVERESULT_MAINMOVEMIT:

			// Hauptzug zuerst: Diesen nur Notieren, Verwalten und in den Stack

			// Notieren
			TransferZugNachStellung(Stellungsdaten, MC_challenge.mainmove);
			// Wenn der Hauptzug schon in die Notation eingetragen ist, jetzt anzeigen. Sonst einfach gleich sichtbar anzeigen
			if(MC_challenge.mainmove.MoveNode == null) {
				NotiereZug('challengenotation', Stellungsdaten, MC_challenge.mainmove, MOVEMODE_VARIANTE_MAINHIDDEN); 
			} else {
				Stellungsdaten.CurNodeId = MC_challenge.mainmove.MoveNode;
				UpdateTreeNodeName('challengenotation', Stellungsdaten, MC_challenge.mainmove);
			}

			// Verwalten
			setMoveState(MC_challenge.mainmove.CurMoveId, MOVESTATE_HIDDEN);
			setMoveNode(MC_challenge.mainmove.CurMoveId, Stellungsdaten.CurNodeId); // CurNodeId wurde in NewTreeNode eingetragen

			// In den Stack
			TriggerMoveToStack(MC_challenge, CHALLENGE);

			// Der Variantenzug:
			// Stellungsdaten.CreateNewNode = true;
			// Stellungsdaten.PreMoveId = MC_challenge.variantenmoves[MC_challenge.drawnmoveindex].CurMoveId;
			// Stellungsdaten.PreNodeId = Stellungsdaten.CurNodeId;
			// NotiereZug('challengenotation', Stellungsdaten, MC_challenge.variantenmoves[MC_challenge.drawnmoveindex], MOVEMODE_MOVE);
			// setMoveNode(MC_challenge.variantenmoves[MC_challenge.drawnmoveindex].CurMoveId, Stellungsdaten.CurNodeId); 
			// setMoveState(MC_challenge.variantenmoves[MC_challenge.drawnmoveindex].CurMoveId, MOVESTATE_MOVED);

			Stellungsdaten.CreateNewNode = true;
			Stellungsdaten.PreNodeId = Stellungsdaten.CurNodeId;

			Stellungsdaten.VarianteCounter++;
			Stellungsdaten.VarianteColor[MC_challenge.selectedmove.ZugLevel]++;

		case MOVERESULT_MAINMOVEOHNE:
 
			// Gilt für MAINMOVEMIT und für MAINMOVEOHNE. Der auszuführende Zug steht in beiden Fällen in selectedmove.
			
			TransferZugNachStellung(Stellungsdaten, MC_challenge.selectedmove);

			// Ziehen
			ZieheZug(MC_challenge.selectedmove, HTMLBRETTNAME_SPIELEN, ANIMATIONSPEED_FAST).then(function() {

				// Notieren
				NotiereZug('challengenotation', Stellungsdaten, MC_challenge.selectedmove, MOVEMODE_MOVE);
				// Hier noch die Farbanzeige in VariantetextId aktualisieren?

				// Verwalten
				setMoveState(MC_challenge.selectedmove.CurMoveId, MOVESTATE_MOVED);
				// Das sollte jetzt überflüssig sein
				setMoveNode(MC_challenge.selectedmove.CurMoveId, Stellungsdaten.CurNodeId); // CurNodeId wurde in NewTreeNode eingetragen

				Stellungsdaten.PreMoveId = MC_challenge.selectedmove.CurMoveId;

				// Die Abschlußbehandlung ist doch wieder unterschiedlich
				if(MC_challenge.result == MOVERESULT_MAINMOVEMIT) {

					createInterrupt('CVS', MC_challenge.result, MC_challenge.selectedmove.CurMoveId);

				} else {
					// Die Anzeige:
					$('#ZugergebnismarkerId').html("<img id='moveokId' src='Grafiken/moveok.png'/>");
					// Hier ist kein Interrupt nötig. resolve löst per then die Behandlung des Folgezugs aus.
					ChallengeMoveVariantenResult.resolve({ result: MOVERESULT_MAINMOVEOHNE, reason: "Ohne Interrupt", zug: MC_challenge.selectedmove.CurMoveId });

				}

			});

			break;
		default:
			ChallengeMoveVariantenResult.reject({ result: 'Fehler: Moveresult Aufgabe nicht erlaubt', reason: "", moveid: Stellungsdaten.PreMoveId });
			break;
	}

	return ChallengeMoveVariantenResult.promise().then(processChallengeMoveVarianten);
}
