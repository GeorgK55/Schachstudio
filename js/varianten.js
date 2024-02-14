// Wird nur in FirePlayerMove aufgerufen
// Zuerst wird der Spielerzug verarbeitet. 
// Wenn der Zug gültig war, wird die Bearbeitung des Folgezugs durchgeführt.
// Diese Funktion ist rekursiv und endet erst, wenn der Folgezug fertig verarbeitet bzw die Situation analysiert ist
function spieleVarianten() {

	if(logMe(LOGLEVEL_IMPORTANT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());
	if(logMe(LOGLEVEL_IMPORTANT, LOGTHEME_DATA)) console.log(Stellungsdaten);

	showChallengeMovesShort();

	processPlayerMoveVarianten().then(function (PlayerMoveResolveResult) {

		if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) {
			console.log('PlayerMoveVariantenResult.then mit result: ' + PlayerMoveResolveResult.result + ', reason: ' + PlayerMoveResolveResult.reason + ' und moveid: ' + PlayerMoveResolveResult.moveid);
			showChallengeMovesShort();
		}

		// catch tritt ein, wenn der Zustand reject erreicht wird. Das ist erst und nur bei Abschluss der Variantenberechung der Fall
		// In Abhängigkeit des Ergebnisses ist die Verarbeitung hier beendet und der Spieler löst durch seinen Zug wieder FirePlayerMove aus.
		// Wenn der nächste Zug schon bekannt ist (im Stack) werden hier die Daten für FirePlayerMove erzeugt und dann die Funktion aufgerufen.
		processChallengeMoveVarianten().catch(function(ChallengeMoveRejectResult) {

			if(logMe(LOGLEVEL_IMPORTANT, LOGTHEME_SITUATION)) console.log('processChallengeMoveVarianten().catch mit result: ' + ChallengeMoveRejectResult.result + ', reason: ' + ChallengeMoveRejectResult.reason + ' und moveid: ' + ChallengeMoveRejectResult.moveid );
			
			switch(ChallengeMoveRejectResult.result) {
				case MOVERESULT_NODESCENDENTS:

					if(Stellungsdaten.VarianteStack.length > 0) {
						let InterruptType = ChallengeMoveRejectResult.reason == Challenge.AmZug ? 'PVE' : 'CVE';
						createInterrupt(InterruptType, ChallengeMoveRejectResult.result, ChallengeMoveRejectResult.moveid);
					} else {
						finishChallenge('Gut gemacht');
					}

					Stellungsdaten.VarianteCounter++;

					break;
				case MOVERESULT_NOCOLORMOVES:

					if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Es gibt noch Spielerzüge');

					break;
				default:
					break;
			}

		});

	}, function (PlayerMoveRejectResult) {
		showNotAcceptedMove();
	});
}

// Identifizieren des Spielerzugs
function determinePlayerMoveContext(amzug, startmoveid, startmovelevel, gezogen) {

	if(logMe(LOGLEVEL_IMPORTANT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName() + ' mit amzug: ' + amzug + ' startmoveid: ' + startmoveid + ' startmovelevel: ' + startmovelevel + ' gezogen: ' + gezogen);
	
	MoveContext = new CMoveContext();

	// Hat der Vorgängerzug überhaupt noch Folgezüge (die müssen mal dagewesen sein, können jetzt aber schon gespielt sein)
	let DescendantMoves	= $.grep(ChallengeMoves,	function (CM)	{ return	CM['PreMoveId'] == startmoveid 
	&&	(CM['MoveState'] == MOVESTATE_READY 
				|| CM['MoveState'] == MOVESTATE_HIDDEN
				|| CM['MoveState'] == MOVESTATE_VISIBLE
				|| CM['MoveState'] == MOVESTATE_STACKED); });

	if(DescendantMoves.length == 0) {
		MoveContext.result = MOVERESULT_NODESCENDENTS;
	} else {

		// Kann der Spieler mindestens einen noch nicht gespielten Zug selber ziehen?
		let ColorMoves	= $.grep(DescendantMoves, function (PM) { return PM['ZugFarbe'] == amzug;	}); 	
		if(ColorMoves.length == 0) {
			MoveContext.result = MOVERESULT_NOCOLORMOVES; // Kann es das hier überhaupt geben???
			alert('Player: ' + MOVERESULT_NOCOLORMOVES + ' found');
		} else {

			// Ist der gespielte Zug des Spielers überhaupt möglich?
			let DrawnMove	= $.grep(ColorMoves, function (PM, i) { return PM['ZugStockfish']	== gezogen; }); 
			if (DrawnMove.length == 0) {
				MoveContext.result = MOVERESULT_UNKNOWNMOVE;
			} else {

				// Der mögliche Zug mit der gleichen Ebene (es kann nur einen geben und der ist sicher noch nicht gespielt)
				let MainMove	= $.grep(ColorMoves,	function (PM, i) { return PM['ZugLevel']	== startmovelevel; });

				if(MainMove.length == 0) {
					MoveContext.result = MOVERESULT_ERROR; // Dann ist die PGN korrupt
				} else {

					// Der Zustand des gefundenen Hauptzugs wird zurückgegeben
					MoveContext.mainmove				= MainMove[0];
					MoveContext.mainmovestatus	= MainMove[0].MoveState;

					MoveContext.drawnmove				= DrawnMove[0];

					let VarMoves	= $.grep(ColorMoves,	function (PM, i) { return PM['ZugLevel']	>  startmovelevel; });
					MoveContext.varmovescounter	= VarMoves.length;

					if(VarMoves.length == 0) {// Dann gibt es nur den Hauptzug

						MoveContext.selectedmove		= MainMove[0];
						MoveContext.result					= MOVERESULT_MAINMOVEOHNE;
						
					} else { // Hauptzug mit Varianten
					
						// Jetzt wird angenommen, dass der Hauptzug gespielt wurde.  Beide werden überschrieben, wenn eine Variante gezogen wurde
						MoveContext.result				= MOVERESULT_MAINMOVEMIT;
						MoveContext.selectedmove	= VarMoves[0];

						for(let i = 0; i <= VarMoves.length - 1; i++) {
							MoveContext.variantenmoves.push(VarMoves[i])
							if(VarMoves[i].ZugStockfish == gezogen) {
								MoveContext.drawnmoveindex	= i;
								MoveContext.selectedmove		= VarMoves[i];
								MoveContext.result					= MOVERESULT_VARIANTEMOVE;
							}
						}
					}
				}
			}
		}
	}
	return MoveContext;
}

// Festlegen des Zugs, den der Gegner ausführen muss. Es kann hier keinen gezogenen Zug geben.
// In MoveContext bleiben die Angaben zu drawnmove unberücksichtigt und MOVERESULT_VARIANTEMOVE kann es auch nicht geben
function determineChallengeMoveContext(challengecolor, startmoveid, startmovelevel) {

	if(logMe(LOGLEVEL_IMPORTANT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName() + ' mit challengecolor: ' + challengecolor + ' startmoveid: ' + startmoveid + ' startmovelevel: ' + startmovelevel);
	
	MoveContext = new CMoveContext(); // obwohl es drawnmode hier gar nicht geben kann

	let DescendantMoves	= $.grep(ChallengeMoves,	function (CM)	{ return	CM['PreMoveId'] == startmoveid 
	&&	(CM['MoveState'] == MOVESTATE_READY 
				|| CM['MoveState'] == MOVESTATE_HIDDEN
				|| CM['MoveState'] == MOVESTATE_VISIBLE
				|| CM['MoveState'] == MOVESTATE_STACKED); });

	if(DescendantMoves.length == 0) {
		MoveContext.result = MOVERESULT_NODESCENDENTS;
	} else {

		let ColorMoves	= $.grep(DescendantMoves, function (PM) { return PM['ZugFarbe'] != challengecolor;	}); 	
		if(ColorMoves.length == 0) {
			MoveContext.result = MOVERESULT_NOCOLORMOVES;
		} else {

				// Der mögliche Zug mit der gleichen Ebene (es kann nur einen geben und der ist sicher noch nicht gespielt)
				let MainMove	= $.grep(ColorMoves,	function (PM, i) { return PM['ZugLevel']	== startmovelevel; });

			if(MainMove.length == 0) {
				MoveContext.result = MOVERESULT_ERROR; // Dann ist die PGN korrupt
			} else {

				// Der Zustand des gefundenen Hauptzugs wird zurückgegeben
				MoveContext.mainmove				= MainMove[0];
				MoveContext.mainmovestatus	= MainMove[0].MoveState;

				let VarMoves	= $.grep(ColorMoves,	function (PM, i) { return PM['ZugLevel']	>  startmovelevel; });
				MoveContext.varmovescounter	= VarMoves.length;

				if(VarMoves.length == 0) { // Dann gibt es nur den Hauptzug
					
					MoveContext.selectedmove		= MainMove[0];
					MoveContext.result					= MOVERESULT_MAINMOVEOHNE;
					
				} else { // Hauptzug mit Varianten

					for(let i = 0; i <= VarMoves.length - 1; i++) { // Alle Züge übernehmen, es kann ja keinen gezogenen Zug geben
						MoveContext.variantenmoves.push(VarMoves[i])
					}

					// Es gibt ja keinen gezogenen Spielerzug. Also einfach den ersten Variantenzug auswählen:
					MoveContext.selectedmove		= VarMoves[0];
					MoveContext.result					= MOVERESULT_MAINMOVEMIT;

				}
			}
		} 
	}
	return MoveContext;
}

// Überträgt die Daten des auslösenden Zugs in den Stack.
function TriggerMoveToStack(MC, trigger) { if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName());

	TriggerMoveToStackCounter++;

		// Den übergangenen Zug ( = Hauptzug)  in den Stack
		Stellungsdaten.VarianteStack.push( {
			Counter:		TriggerMoveToStackCounter,
			Trigger:		trigger,
			CurMove:		Stellungsdaten.CurMoveId,
			PreMove:		Stellungsdaten.PreMoveId,
			CurNode:		Stellungsdaten.CurNodeId,
			PreNode:		Stellungsdaten.PreNodeId,
			Move:				MC.mainmove.CurMoveId,
			MoveLevel:	Stellungsdaten.ZugLevel
	});

	setMoveState(Stellungsdaten.PreMoveId, MOVESTATE_STACKED);

	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.table(Stellungsdaten.VarianteStack);
}
