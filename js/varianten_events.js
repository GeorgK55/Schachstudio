// Parameter Interrupt:
// Erste Stelle: P für Spieler, C für Aufgabe
// Zweite Stelle: M für Hauptzug, V für Variantenzug
// Dritte Stelle: S für Start, E für Ende, C für Variantenwechsel
// Aufgaben
// - Event generieren
// - Symbol und Text anzeigen
// - Hintergrundfarbe für den Text festlegen
function createInterrupt(Interrupt, evaluation, zugid) {

	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION))	console.log('Beginn in ' + getFuncName() + ' mit evaluation: ' + evaluation + ', reason: ' + Interrupt + ' und zugid: ' + zugid );

	$('#VariantemarkerresolveId').on("click",	{ result: evaluation, reason: Interrupt, moveid: zugid }, handleInterruptClick);
	// $('#VariantemarkerrejectId').click(		{ reason: Interrupt, zug: zugid }, handleInterruptClick);

	$('#ZugergebnismarkerId').html("<img id='moveokId' src='Grafiken/questionmark.png'/>");

	switch(Interrupt) {
		case 'PMS':
			$('#VariantemarkerresolveId').empty().html("<img id='VarianteStartSpielerId' src='Grafiken/VarianteStartSpieler.png' class='zugergebnismarker'/>");
			// $('#VariantemarkerrejectId' ).empty().html("<img id='VarianteStartSpielerId' src='Grafiken/VarianteStartSpieler.png' class='zugergebnismarker'/>");
			break;
		case 'PVS':
			$('#VariantemarkerresolveId').empty().html("<img id='VarianteStartSpielerId' src='Grafiken/VarianteStartSpieler.png' class='zugergebnismarker'/>");
			// $('#VariantemarkerrejectId' ).empty().html("<img id='VarianteStartSpielerId' src='Grafiken/VarianteStartSpieler.png' class='zugergebnismarker'/>");
			break;
		case 'PVC':
			break;
		case 'PVE':
			$('#VariantemarkerresolveId').empty().html("<img id='VarianteEndeSpielerId' src='Grafiken/VarianteEndeSpieler.png' class='zugergebnismarker'/>");
			// $('#VariantemarkerrejectId' ).empty().html("<img id='VarianteEndeSpielerId' src='Grafiken/VarianteEndeSpieler.png' class='zugergebnismarker'/>");
			break;
		case 'CMS':
			$('#VariantemarkerresolveId').empty().html("<img id='VarianteStartSpielerId' src='Grafiken/VarianteStartAufgabe.png' class='zugergebnismarker'/>");
			break;
		case 'CVS':
			$('#VariantemarkerresolveId').empty().html("<img id='VarianteEndeAufgabeId' src='Grafiken/VarianteStartAufgabe.png' class='zugergebnismarker'/>");
			// $('#VariantemarkerrejectId' ).empty().html("<img id='VarianteEndeAufgabeId' src='Grafiken/VarianteStartAufgabe.png' class='zugergebnismarker'/>");
			break;
		case 'CVC':
			break;
		case 'CVE':
			$('#VariantemarkerresolveId').empty().html("<img id='VarianteEndeAufgabeId' src='Grafiken/VarianteEndeAufgabe.png' class='zugergebnismarker'/>");
			// $('#VariantemarkerrejectId' ).empty().html("<img id='VarianteEndeAufgabeId' src='Grafiken/VarianteEndeAufgabe.png' class='zugergebnismarker'/>");
			break;
	}

	$('#VariantetextId').append('<span>' + Variantentexte[Interrupt] + '</span>');
	$('#VariantetextId').removeClass().addClass(getVarianteColorClass(Stellungsdaten));

	$('[id^=' + HTMLBRETTNAME_SPIELEN + ']').addClass('noClick');

	if(logMe(LOGLEVEL_SLIGHT, LOGTHEME_SITUATION)) console.log('events generiert' );

}

// Wichtigste Funktion ist, die Promises der einzelnen reason auf resolve oder reject einzustellen
// Außerdem:
// - der Anzeigetext des Interrupts entfernen
// - die eventhandler entfernen
// - das Brett wieder für clicks freigeben
function handleInterruptClick(clickevent) {

	if(logMe(LOGLEVEL_IMPORTANT, LOGTHEME_SITUATION)) console.log('Beginn in ' + getFuncName() + ' mit evaluation: ' + clickevent.data.result + ', reason: ' + clickevent.data.reason + ' und zugid: ' + clickevent.data.moveid );

	switch (clickevent.data.reason) {
		case 'PMS':
			PlayerMoveVariantenResult.resolve( clickevent.data );
			$('#VariantetextId').html("<span>&nbsp</span>");
			break;
		case 'PVS':
			PlayerMoveVariantenResult.resolve( clickevent.data );
			$('#VariantetextId').html("<span>&nbsp</span>");
			break;
		case 'PVC':
			PlayerMoveVariantenResult.resolve( clickevent.data );
			$('#VariantetextId').html("<span>&nbsp</span>");
			break;
			case 'CVE':
			case 'PVE':

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
					$('#ChallengeTreeNotationId').jstree().close_node(Stellungsdaten.CurNodeId);

					if(PreStackMove[0].ZugFarbe == Challenge.AmZug) {
						firePlayerMove();
					} else {
						ZieheZug(T_Zuege, HTMLBRETTNAME_SPIELEN);
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
	
						firePlayerMove();
					}

				}
			} else {

			}

			//PlayerMoveVariantenResult.resolve( clickevent.data );
			$('#VariantetextId').html("<span>&nbsp</span>");
			break;
		case 'CMS':
			ChallengeMoveVariantenResult.reject( clickevent.data ); 
			$('#VariantetextId').html("<span>&nbsp</span>");
			break;
		case 'CVS':
			ChallengeMoveVariantenResult.reject( clickevent.data ); 
			$('#VariantetextId').html("<span>&nbsp</span>");
			break;
		case 'CVC':
			ChallengeMoveVariantenResult.reject( clickevent.data ); 
			$('#VariantetextId').html("<span>&nbsp</span>");
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
					$('#ChallengeTreeNotationId').jstree().close_node(Stellungsdaten.CurNodeId);

					if(PreStackMove[0].ZugFarbe == Challenge.AmZug) {
						firePlayerMove();
					} else {
						ZieheZug(T_Zuege, HTMLBRETTNAME_SPIELEN);
					}

				}
			} else {

			}

			$('#VariantetextId').html("<span>&nbsp</span>");
			break;
	}
	$('#VariantemarkerresolveId').off();
	//$('#VariantemarkerrejectId').off();

	$('[id^=' + HTMLBRETTNAME_SPIELEN + ']').removeClass('noClick');
}

// Nur, damit dann was paasiert
function handleZugergebnisClick() {
	alert('handleZugergebnisClick');
}
