
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
		case MOVERESULT_ERROR:
		case MOVERESULT_UNKNOWNMOVE:
		// case MOVERESULT_NOCOLORMOVES: kann es das hier geben??? Im determine.... ist ein alert
		case MOVERESULT_NODESCENDENTS:
			showjstreeimportant('ChallengeTreeNotationId');
			PlayerMoveVariantenResult.resolve({	result: MC_player.result, reason: "", moveid: T_Zuege.CurMoveId	});
			break;
		case MOVERESULT_VARIANTEMOVE:
		case MOVERESULT_MAINMOVEMIT:

			// Hauptzug zuerst: Diesen nur Notieren, Verwalten und in den Stack

			// Notieren
			TransferZugNachStellung(Stellungsdaten, MC_player.mainmove);
			let movemode = MC_player.result == MOVERESULT_MAINMOVEMIT ? MOVEMODE_VARIANTE_MAINVISIBLE : MOVEMODE_VARIANTE_MAINHIDDEN;
			NotiereZug('ChallengeTreeNotationId', Stellungsdaten, MC_player.mainmove, movemode); 

			// Verwalten
			setMoveState(MC_player.mainmove.CurMoveId, MOVESTATE_VISIBLE);
			setMoveNode(MC_player.mainmove.CurMoveId, Stellungsdaten.CurNodeId); // CurNodeId wurde in NewTreeNode eingetragen

			// In den Stack
			TriggerMoveToStack(MC_player, PLAYER);

			// Der Variantenzug:
			//TransferZugNachStellung(Stellungsdaten, MC_player.variantenmoves[0]); // Genau dieser wurde nicht in den Stack geschrieben
			//ZieheZug(MC_player.variantenmoves[0], HTMLBRETTNAME_SPIELEN);

			Stellungsdaten.CreateNewNode = true;
			//Stellungsdaten.PreMoveId = MC_player.selectedmove.CurMoveId;
			Stellungsdaten.PreNodeId = Stellungsdaten.CurNodeId;

			Stellungsdaten.VarianteCounter++;
			Stellungsdaten.VarianteColor[MC_player.selectedmove.ZugLevel]++;
			//NotiereZug('ChallengeTreeNotationId', Stellungsdaten, MC_player.selectedmove, MOVEMODE_MOVE);
			//setMoveNode(MC_player.selectedmove.CurMoveId, Stellungsdaten.CurNodeId); // CurNodeId wurde in NewTreeNode eingetragen
			//setMoveState(MC_player.selectedmove.CurMoveId, MOVESTATE_MOVED);

			//let InterruptType =  MC_player.result == MOVERESULT_MAINMOVEMIT ? 'PMS' : 'PVS';
			//createInterrupt(InterruptType, MC_player.result, MC_player.variantenmoves[0].CurMoveId);

		case MOVERESULT_MAINMOVEOHNE:

			TransferZugNachStellung(Stellungsdaten, MC_player.selectedmove);

			// Notieren, wenn es kein aus dem Stack geholter Zug ist
			if(getMoveState(MC_player.drawnmove.CurMoveId) != MOVESTATE_STACKED) {
				NotiereZug('ChallengeTreeNotationId', Stellungsdaten, MC_player.selectedmove, MOVEMODE_MOVE);
			} else {
				$('#VariantetextId').removeClass().addClass('centertext').addClass(getVarianteLevelColorClass(Stellungsdaten, MC_player.selectedmove.ZugLevel));
			}

			// Ziehen
			ZieheZug(MC_player.drawnmove, HTMLBRETTNAME_SPIELEN);

			// Verwalten
			setMoveState(MC_player.selectedmove.CurMoveId, MOVESTATE_MOVED);
			setMoveNode(MC_player.selectedmove.CurMoveId, Stellungsdaten.CurNodeId); // CurNodeId wurde in NewTreeNode eingetragen

			Stellungsdaten.PreMoveId = MC_player.selectedmove.CurMoveId;

			// Die Abschlußbehandlung ist doch wieder unterschiedlich
			if(MC_player.result == MOVERESULT_MAINMOVEMIT) {

				let InterruptType =  MC_player.result == MOVERESULT_MAINMOVEMIT ? 'PMS' : 'PVS';
				createInterrupt(InterruptType, MC_player.result, MC_player.selectedmove.CurMoveId);

			} else {

				// Die Anzeige:
				$('#ZugergebnismarkerId').html("<img id='moveokId' src='Grafiken/moveok.png'/>");

				// Hier ist kein Interrupt nötig. resolve löst per then die Behandlung des Folgezugs aus.
				PlayerMoveVariantenResult.resolve({ result: MC_player.result, reason: "Ohne Interrupt", moveid: MC_player.selectedmove.CurMoveId });

			}

			break;
		case XYXYXY:
			if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log(MOVERESULT_VARIANTEMOVE + ' erkannt');

			// Hauptzug zuerst: Diesen nur Notieren, Verwalten und in den Stack
			TransferZugNachStellung(Stellungsdaten, MC_player.mainmove);
			NotiereZug('ChallengeTreeNotationId', Stellungsdaten, MC_player.mainmove, MOVEMODE_VARIANTE_MAINHIDDEN); 

			setMoveState(MC_player.mainmove.CurMoveId, MOVESTATE_VISIBLE);
			setMoveNode(MC_player.mainmove.CurMoveId, Stellungsdaten.CurNodeId); // CurNodeId wurde in NewTreeNode eingetragen

			TriggerMoveToStack(MC_player, PLAYER);

			createInterrupt('PVS', MC_player.result, MC_player.variantenmoves[0].CurMoveId);

			break;
		default:
			PlayerMoveVariantenResult.reject({ result: 'Fehler: Moveresult Spieler nicht erlaubt', reason: "", moveid: Stellungsdaten.PreMoveId });
			break;
	}

	return PlayerMoveVariantenResult.promise();
}
