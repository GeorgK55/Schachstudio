// Parameter Interrupt:
// Erste Stelle: P für Spieler, C für Aufgabe
// Zweite Stelle: M für Hauptzug, V für Variantenzug
// Dritte Stelle: S für Start, E für Ende, C für Variantenwechsel
// Aufgaben
// - Event generieren
// - Symbol und Text anzeigen
// - Hintergrundfarbe für den Text festlegen
function createInterrupt(Interrupt, result, zugid) {

	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION))	console.log('Beginn in ' + getFuncName() + ' mit result: ' + result + ', reason: ' + Interrupt + ' und zugid: ' + zugid );

	$('#variantemarkerresolveid').on("click",	{ result: result, reason: Interrupt, moveid: zugid }, handleInterruptClick);
	// $('#variantemarkerrejectid').click(		{ reason: Interrupt, zug: zugid }, handleInterruptClick);

	$('#zugergebnismarkerid').html("<img id='moveokId' src='grafiken/questionmark.png'/>");

	switch(Interrupt) {
		case 'PMS':
			$('#variantemarkerresolveid').empty().html("<img id='variantestartspielerId' src='grafiken/VarianteStartSpieler.png' class='zugergebnismarker'/>");
			// $('#variantemarkerrejectid' ).empty().html("<img id='variantestartspielerId' src='grafiken/VarianteStartSpieler.png' class='zugergebnismarker'/>");
			break;
		case 'PVS':
			$('#variantemarkerresolveid').empty().html("<img id='variantestartspielerId' src='grafiken/VarianteStartSpieler.png' class='zugergebnismarker'/>");
			// $('#variantemarkerrejectid' ).empty().html("<img id='variantestartspielerId' src='grafiken/VarianteStartSpieler.png' class='zugergebnismarker'/>");
			break;
		case 'PVC':
			break;
		case 'PVE':
			$('#variantemarkerresolveid').empty().html("<img id='varianteendespielerid' src='grafiken/VarianteEndeSpieler.png' class='zugergebnismarker'/>");
			// $('#variantemarkerrejectid' ).empty().html("<img id='varianteendespielerid' src='grafiken/VarianteEndeSpieler.png' class='zugergebnismarker'/>");
			break;
		case 'CMS':
			$('#variantemarkerresolveid').empty().html("<img id='variantestartspielerId' src='grafiken/VarianteStartAufgabe.png' class='zugergebnismarker'/>");
			break;
		case 'CVS':
			$('#variantemarkerresolveid').empty().html("<img id='varianteendeaufgabeid' src='grafiken/VarianteStartAufgabe.png' class='zugergebnismarker'/>");
			// $('#variantemarkerrejectid' ).empty().html("<img id='varianteendeaufgabeid' src='grafiken/VarianteStartAufgabe.png' class='zugergebnismarker'/>");
			break;
		case 'CVC':
			break;
		case 'CVE':
			$('#variantemarkerresolveid').empty().html("<img id='varianteendeaufgabeid' src='grafiken/VarianteEndeAufgabe.png' class='zugergebnismarker'/>");
			// $('#variantemarkerrejectid' ).empty().html("<img id='varianteendeaufgabeid' src='grafiken/VarianteEndeAufgabe.png' class='zugergebnismarker'/>");
			break;
	}

	$('#variantetextid').empty().append('<span>' + Variantentexte[Interrupt] + '</span>');
	$('#variantetextid').removeClass().addClass('centertext').addClass(getVarianteLevelColorClass(Stellungsdaten, getMoveLevel(zugid)));

	if(Interrupt.endsWith('S')) addVariantePath(zugid)

	$('[id^=' + HTMLBRETTNAME_SPIELEN + ']').addClass('noClick');

	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('events generiert' );

}

// Wichtigste Funktion ist, die Promises der einzelnen reason auf resolve oder reject einzustellen
// Außerdem:
// - der Anzeigetext des Interrupts entfernen
// - die eventhandler entfernen
// - das Brett wieder für clicks freigeben
function handleInterruptClick(clickevent) {

	if(logMe(LOGLEVEL_IMPORTANT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName() + ' mit result: ' + clickevent.data.result + ', reason: ' + clickevent.data.reason + ' und zugid: ' + clickevent.data.moveid );

	$("[id^='variantepath']").remove();

	switch (clickevent.data.reason) {
		case 'PMS':
			PlayerMoveVariantenResult.resolve( clickevent.data );
			$('#variantetextid').html("<span>&nbsp</span>");
			break;
		case 'PVS':
			PlayerMoveVariantenResult.resolve( clickevent.data );
			$('#variantetextid').html("<span>&nbsp</span>");
			break;
		case 'PVC':
			PlayerMoveVariantenResult.resolve( clickevent.data );
			$('#variantetextid').html("<span>&nbsp</span>");
			break;
			case 'CVE':
			case 'PVE':

			if(Stellungsdaten.VarianteStack.length > 0) {

				let LastStack = Stellungsdaten.VarianteStack.pop();
				let PreStackMove = $.grep(ChallengeMoves,	function (PSM)	{ return	PSM['CurMoveId'] == LastStack.PreMove; });

				if(PreStackMove.length > 0) {

					T_Zuege = { ...PreStackMove[0] };
					TransferZugNachStellung(Stellungsdaten, T_Zuege);

					Stellungsdaten.ZugLevel			= PreStackMove[0].ZugLevel;
					Stellungsdaten.ZugFarbe			= PreStackMove[0].ZugFarbe;
					Stellungsdaten.CurMoveId		= PreStackMove[0].CurMoveId;
					Stellungsdaten.MoveNode			= PreStackMove[0].MoveNode;
					Stellungsdaten.MoveState		= PreStackMove[0].MoveState;
					Stellungsdaten.PreMoveId		= PreStackMove[0].PreMoveId;
					Stellungsdaten.ZugStockfish	=	PreStackMove[0].ZugStockfish;

					Stellungsdaten.CurNodeId		= LastStack.CurNode;
					Stellungsdaten.PreNodeId		= LastStack.PreNode;

					Stellungsdaten.CreateNewNode = false;

					StellungAufbauen(HTMLBRETTNAME_SPIELEN, PreStackMove[0].FEN);
					$('#challengenotation').jstree().close_node(Stellungsdaten.CurNodeId);

					//if(PreStackMove[0].ZugFarbe == Challenge.AmZug) {
					if(LastStack.Trigger == CHALLENGE) {
						firePlayerMove();
					} else {

						ZieheZug(T_Zuege, HTMLBRETTNAME_SPIELEN, ANIMATIONSPEED_ZERO);
						let LastPlayerMove = $.grep(ChallengeMoves,	function (LSM)	{ return	LSM['CurMoveId'] == LastStack.CurMove; });
 
						T_Zuege = { ...LastPlayerMove[0] };
						TransferZugNachStellung(Stellungsdaten, T_Zuege);

						Stellungsdaten.ZugLevel			= LastPlayerMove[0].ZugLevel;
						Stellungsdaten.ZugFarbe			= LastPlayerMove[0].ZugFarbe;
						Stellungsdaten.CurMoveId		= LastPlayerMove[0].CurMoveId;
						Stellungsdaten.MoveNode			= LastPlayerMove[0].MoveNode;
						Stellungsdaten.MoveState		= LastPlayerMove[0].MoveState;
						Stellungsdaten.PreMoveId		= LastPlayerMove[0].PreMoveId;
						Stellungsdaten.ZugStockfish	=	LastPlayerMove[0].ZugStockfish;
	
						Stellungsdaten.CurNodeId		= LastStack.CurNode;
						Stellungsdaten.PreNodeId		= LastStack.PreNode;
	
						Stellungsdaten.CreateNewNode = false;
	
						// Wenn der Zug des Stack HIDDEN ist, muss der Spieler den Zug noch selbst finden. Sonst wird jetzt der Spielerzug hier ausgelöst
						let CurStackMove = $.grep(ChallengeMoves,	function (CSM)	{ return	CSM['CurMoveId'] == LastStack.CurMove; });
						if(CurStackMove[0].MoveState != MOVESTATE_HIDDEN) {	firePlayerMove();	}
					}

				}
			} else {

			}

			//PlayerMoveVariantenResult.resolve( clickevent.data );
			$('#variantetextid').html("<span>&nbsp</span>");
			break;
		case 'CMS':
			ChallengeMoveVariantenResult.reject( clickevent.data ); 
			$('#variantetextid').html("<span>&nbsp</span>");
			break;
		case 'CVS':
			ChallengeMoveVariantenResult.reject( clickevent.data ); 
			$('#variantetextid').html("<span>&nbsp</span>");
			break;
		case 'CVC':
			ChallengeMoveVariantenResult.reject( clickevent.data ); 
			$('#variantetextid').html("<span>&nbsp</span>");
			break;
		case 'XXX':
			// Das deferred ist hier schon gelaufen.
			// Mit dem Stack als Grundlage weiterspielen

			if(Stellungsdaten.VarianteStack.length > 0) {

				let LastStack = Stellungsdaten.VarianteStack.pop();
				let PreStackMove = $.grep(ChallengeMoves,	function (LSM)	{ return	LSM['CurMoveId'] == LastStack.PreMove; });

				if(PreStackMove.length > 0) {

					T_Zuege = { ...PreStackMove[0] };
					TransferZugNachStellung(Stellungsdaten, T_Zuege);

					Stellungsdaten.ZugLevel			= PreStackMove[0].ZugLevel;
					Stellungsdaten.ZugFarbe			= PreStackMove[0].ZugFarbe;
					Stellungsdaten.CurMoveId		= PreStackMove[0].CurMoveId;
					Stellungsdaten.MoveNode			= PreStackMove[0].MoveNode;
					Stellungsdaten.MoveState		= PreStackMove[0].MoveState;
					Stellungsdaten.PreMoveId		= PreStackMove[0].PreMoveId;
					Stellungsdaten.ZugStockfish	=	PreStackMove[0].ZugStockfish;

					Stellungsdaten.CurNodeId		= LastStack.CurNode;
					Stellungsdaten.PreNodeId		= LastStack.PreNode;

					Stellungsdaten.CreateNewNode = false;

					StellungAufbauen(HTMLBRETTNAME_SPIELEN, PreStackMove[0].FEN);
					$('#challengenotation').jstree().close_node(Stellungsdaten.CurNodeId);

					if(PreStackMove[0].ZugFarbe == Challenge.AmZug) {
						firePlayerMove();
					} else {
						ZieheZug(T_Zuege, HTMLBRETTNAME_SPIELEN, ANIMATIONSPEED_ZERO);
					}

				}
			} else {

			}

			$('#variantetextid').html("<span>&nbsp</span>");
			break;
	}
	$('#variantemarkerresolveid').off();
	//$('#variantemarkerrejectid').off();

	$('[id^=' + HTMLBRETTNAME_SPIELEN + ']').removeClass('noClick');
}

// Nur, damit dann was passiert
function handleZugergebnisClick() {
	alert('handleZugergebnisClick');
}
