
// Für den gespielten Zug wird zuerst geprüft, ob er in der Aufgabenstellung an der aktuellen Stelle überhaupt vorgesehen ist.
// Bei Fehler oder nicht vorgesehen, wird das promise mit reject zurückgewiesen.
// Keine Nachfolgezüge ist eine sinnvolle Situation, es wird resolve eingestellt.
// Ist der gespielte Zug der einzig vorgesehene, werden alle Daten des entsprechenden Zugs aus der Aufgabenstellung übernommen und resolve eingestellt
// Ist der gespielte Zug mehrdeutig (= es gibt Varianten für den Spieler), werden ALLE Züge in den Stack übertragen.
// Dann wird ein Interrupt generiert. Resolve wird erst im Interrupt eingestellt.
function processPlayerMoveVarianten() {	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	PlayerMoveVariantenResult = $.Deferred();

	let MC_player = determinePlayerMoveContext(Challenge.AmZug, Stellungsdaten.PreMoveId, Stellungsdaten.ZugLevel, T_Zuege.ZugStockfish);
	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log(MC_player);
	//showMoveContext(MC_player)

	switch (MC_player.result) {
		case MOVEEVALUATION_ERROR:
			if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('PlayerMoveVariantenResult.reject wegen "' + MOVEEVALUATION_ERROR + '" für: ' + T_Zuege.ZugStockfish);
			PlayerMoveVariantenResult.reject({ result: MOVEEVALUATION_ERROR, reason: "", moveid: T_Zuege.CurMoveId});
			break;
		case MOVEEVALUATION_UNKNOWNMOVE:
			if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('PlayerMoveVariantenResult.reject wegen "' + MOVEEVALUATION_UNKNOWNMOVE + '" für: ', T_Zuege.ZugStockfish);
			PlayerMoveVariantenResult.reject({ result: MOVEEVALUATION_UNKNOWNMOVE, reason: "", moveid: T_Zuege.CurMoveId});
			break;
		case MOVEEVALUATION_NODESCENDENTS:
			if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('PlayerMoveVariantenResult.reject wegen "' + MOVEEVALUATION_NODESCENDENTS + '" für: ', T_Zuege.ZugStockfish);
			PlayerMoveVariantenResult.resolve({	evaluation: MOVEEVALUATION_NODESCENDENTS, reason: "", moveid: T_Zuege.CurMoveId	});
			break;
		case MOVEEVALUATION_MAINMOVEOHNE:

			// Ziehen
			TransferZugNachStellung(Stellungsdaten, MC_player.drawnmove);
			ZieheZug(MC_player.drawnmove, HTMLBRETTNAME_SPIELEN);

			// Notieren, wenn es kein aus dem Stack geholter Zug ist
			if(getMoveState(MC_player.drawnmove.CurMoveId) != MOVESTATE_STACKED) {
				NotiereZug('ChallengeTreeNotationId', Stellungsdaten, MC_player.drawnmove, MOVEMODE_MOVE);
			}

			// Verwalten
			Stellungsdaten.PreMoveId = MC_player.drawnmove.CurMoveId;
			setMoveState(MC_player.drawnmove.CurMoveId, MOVESTATE_MOVED);
			setMoveNode(MC_player.drawnmove.CurMoveId, Stellungsdaten.CurNodeId); // CurNodeId wurde in NewTreeNode eingetragen

			// Die Anzeige:
			$('#ZugergebnismarkerId').html("<img id='moveokId' src='Grafiken/moveok.png'/>");

			// Hier ist kein Interrupt nötig. resolve löst per then die Behandlung des Folgezugs aus.
			PlayerMoveVariantenResult.resolve({ result: MC_player.result, reason: "Ohne Interrupt", moveid: MC_player.drawnmove.CurMoveId });

			break;
		case MOVEEVALUATION_MAINMOVEMIT:

			// Hauptzug zuerst: Diesen nur Notieren, Verwalten und in den Stack
			TransferZugNachStellung(Stellungsdaten, MC_player.mainmove);
			NotiereZug('ChallengeTreeNotationId', Stellungsdaten, MC_player.mainmove, MOVEMODE_VARIANTE_MAINVISIBLE); 

			setMoveState(MC_player.mainmove.CurMoveId, MOVESTATE_VISIBLE);
			setMoveNode(MC_player.mainmove.CurMoveId, Stellungsdaten.CurNodeId); // CurNodeId wurde in NewTreeNode eingetragen

			MoveContextToStack(MC_player, PLAYER);

			// Der Variantenzug:
			TransferZugNachStellung(Stellungsdaten, MC_player.variantenmoves[0]); // Genau dieser wurde nicht in den Stack geschrieben
			ZieheZug(MC_player.variantenmoves[0], HTMLBRETTNAME_SPIELEN);
			Stellungsdaten.CreateNewNode = true;
			Stellungsdaten.PreMoveId = MC_player.variantenmoves[0].CurMoveId;
			Stellungsdaten.PreNodeId = Stellungsdaten.CurNodeId;
			Stellungsdaten.VarianteCounter++;
			Stellungsdaten.VarianteColor[MC_player.variantenmoves[0].ZugLevel]++;
			NotiereZug('ChallengeTreeNotationId', Stellungsdaten, MC_player.variantenmoves[0], MOVEMODE_MOVE);
			setMoveNode(MC_player.variantenmoves[0].CurMoveId, Stellungsdaten.CurNodeId); // CurNodeId wurde in NewTreeNode eingetragen
			setMoveState(MC_player.variantenmoves[0].CurMoveId, MOVESTATE_MOVED);

			createInterrupt('PMS', MC_player.result, MC_player.variantenmoves[0].CurMoveId);

			break;
		case MOVEEVALUATION_VARIANTEMOVE:
			if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log(MOVEEVALUATION_VARIANTEMOVE + ' erkannt');

			// Hauptzug zuerst: Diesen nur Notieren, Verwalten und in den Stack
			TransferZugNachStellung(Stellungsdaten, MC_player.mainmove);

			NotiereZug('ChallengeTreeNotationId', Stellungsdaten, MC_player.mainmove, MOVEMODE_VARIANTE_MAINHIDDEN); 

			setMoveState(MC_player.mainmove.CurMoveId, MOVESTATE_VISIBLE);
			setMoveNode(MC_player.mainmove.CurMoveId, Stellungsdaten.CurNodeId); // CurNodeId wurde in NewTreeNode eingetragen

			MoveContextToStack(MC_player, PLAYER);

			createInterrupt('PVS', MC_player.evalution, MC_player.variantenmoves[0].CurMoveId);

			break;
		default:
			break;
	}

	return PlayerMoveVariantenResult.promise();
}
