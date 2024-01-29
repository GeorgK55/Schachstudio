
// Wird nach jedem Zug des Spielers aufgerufen.
//
function processChallengeMoveVarianten() { if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	ChallengeMoveVariantenResult = $.Deferred();

	let MC_challenge = determineChallengeMoveContext(Challenge.AmZug, Stellungsdaten.PreMoveId, Stellungsdaten.ZugLevel)
	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log(MC_challenge);

	switch(MC_challenge.result) {
		case MOVEEVALUATION_ERROR:
			if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('reject wegen "' + MOVEEVALUATION_ERROR + '" für: ', T_Zuege);
			ChallengeMoveVariantenResult.reject({ result: MOVEEVALUATION_ERROR, reason: "", moveid: Stellungsdaten.PreMoveId });
			break;
		case MOVEEVALUATION_UNKNOWNMOVE:
			if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('reject wegen "' + MOVEEVALUATION_UNKNOWNMOVE + '" für: ', T_Zuege);
			ChallengeMoveVariantenResult.reject({ result: MOVEEVALUATION_UNKNOWNMOVE, reason: "", moveid: Stellungsdaten.PreMoveId });
			break;
		case MOVEEVALUATION_NODESCENDENTS:

			showjstreeimportant('ChallengeTreeNotationId');

			ChallengeMoveVariantenResult.reject({ result: MC_challenge.result, reason: Stellungsdaten.ZugFarbe, moveid: Stellungsdaten.PreMoveId });

			break;
		case MOVEEVALUATION_NOPOSSIBLEMOVES:
			ChallengeMoveVariantenResult.reject({ result: MOVEEVALUATION_NOPOSSIBLEMOVES,  reason: "", moveid: Stellungsdaten.PreMoveId });
			break;
		case MOVEEVALUATION_MAINMOVEOHNE:

			// Ziehen
			TransferZugNachStellung(Stellungsdaten, MC_challenge.mainmove);
			ZieheZug(MC_challenge.mainmove, HTMLBRETTNAME_SPIELEN);

			NotiereZug('ChallengeTreeNotationId', Stellungsdaten, MC_challenge.mainmove, MOVEMODE_MOVE);

			// Verwalten
			Stellungsdaten.PreMoveId = MC_challenge.mainmove.CurMoveId;
			setMoveState(MC_challenge.mainmove.CurMoveId, MOVESTATE_MOVED);
			// Das sollte jetzt überflüssig sein
			setMoveNode(MC_challenge.mainmove.CurMoveId, Stellungsdaten.CurNodeId); // CurNodeId wurde in NewTreeNode eingetragen

			// Die Anzeige:
			$('#ZugergebnismarkerId').html("<img id='moveokId' src='Grafiken/moveok.png'/>");

			// Hier ist kein Interrupt nötig. resolve löst per then die Behandlung des Folgezugs aus.
			ChallengeMoveVariantenResult.resolve({ result: MOVEEVALUATION_MAINMOVEOHNE, reason: "Ohne Interrupt", zug: MC_challenge.mainmove.CurMoveId });

			break;
		case MOVEEVALUATION_VARIANTEMOVE:
		case MOVEEVALUATION_MAINMOVEMIT:
			if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log(MC_challenge.result + ' erkannt');

			// Hauptzug zuerst: Diesen nur Notieren, Verwalten und in den Stack
			TransferZugNachStellung(Stellungsdaten, MC_challenge.mainmove);

			// Wenn der Hauptzug schon in die Notation eingetragen ist, jetzt anzeigen. Sonst einfach gleich sichtbar anzeigen
			if(MC_challenge.mainmove.MoveNode == null) {
				NotiereZug('ChallengeTreeNotationId', Stellungsdaten, MC_challenge.mainmove, MOVEMODE_VARIANTE_MAINVISIBLE); 
			} else {
				Stellungsdaten.CurNodeId = MC_challenge.mainmove.MoveNode;
				UpdateTreeNodeName('ChallengeTreeNotationId', Stellungsdaten, MC_challenge.mainmove);
			}

			setMoveState(MC_challenge.mainmove.CurMoveId, MOVESTATE_VISIBLE);
			setMoveNode(MC_challenge.mainmove.CurMoveId, Stellungsdaten.CurNodeId); // CurNodeId wurde in NewTreeNode eingetragen

			MoveContextToStack(MC_challenge, CHALLENGE);

			// Der Variantenzug:
			TransferZugNachStellung(Stellungsdaten, MC_challenge.variantenmoves[0]); // Genau dieser wurde nicht in den Stack geschrieben
			ZieheZug(MC_challenge.variantenmoves[0], HTMLBRETTNAME_SPIELEN);
			Stellungsdaten.CreateNewNode = true;6
			Stellungsdaten.PreMoveId = MC_challenge.variantenmoves[0].CurMoveId;
			Stellungsdaten.PreNodeId = Stellungsdaten.CurNodeId;
			Stellungsdaten.VarianteCounter++;
			Stellungsdaten.VarianteColor[MC_challenge.variantenmoves[0].ZugLevel]++;
			NotiereZug('ChallengeTreeNotationId', Stellungsdaten, MC_challenge.variantenmoves[0], MOVEMODE_MOVE);
			setMoveNode(MC_challenge.variantenmoves[0].CurMoveId, Stellungsdaten.CurNodeId); // CurNodeId wurde in NewTreeNode eingetragen
			setMoveState(MC_challenge.variantenmoves[0].CurMoveId, MOVESTATE_MOVED);

			createInterrupt('CVS', MC_challenge.result, MC_challenge.variantenmoves[0].CurMoveId);

		break;
		default:
			ChallengeMoveVariantenResult.reject({ result: 'Fehler: Moveevaluation Aufgabe nicht erlaubt', reason: "", moveid: Stellungsdaten.PreMoveId });
			break;
	}

	return ChallengeMoveVariantenResult.promise().then(processChallengeMoveVarianten);
}
