<?php

$DesiredFunction = $_POST['dataContext'];

include ('commonDBFunctions.php');

//===========================================================================
if($DesiredFunction == 'LogVisitor') {

	$Benutzer				= $_POST["Benutzer"];
	$Besuchszeit		= $_POST["Besuchszeit"];
	$Betriebssystem	= $_POST["Betriebssystem"];
	$BrowserName		= $_POST["BrowserName"];
	$BrowserDetails	= $_POST["BrowserDetails"];
	$Cookies				= $_POST["Cookies"];
	$Orientation		= $_POST["Orientation"];
	$Fensterhoehe		= $_POST["Fensterhoehe"];
	$Fensterbreite	= $_POST["Fensterbreite"];
	$PixelRatio			= $_POST["PixelRatio"];
	$PixelDepth			= $_POST["pixelDepth"];
	$ColorDepth			= $_POST["colorDepth"];
	$Aktion					= $_POST["Aktion"];

	$commandtext = "INSERT INTO T_NutzerLog (Benutzer, Besuchszeit, Betriebssystem, BrowserName, BrowserDetails, Cookies, Orientation, Fensterhoehe, Fensterbreite, PixelRatio, PixelDepth, ColorDepth, Aktion) VALUES (:Benutzer, :Besuchszeit, :Betriebssystem, :BrowserName, :BrowserDetails, :Cookies, :Orientation, :Fensterhoehe, :Fensterbreite, :PixelRatio, :PixelDepth, :ColorDepth, :Aktion)";

	$paramsarray = array(':Benutzer' => $Benutzer, ':Besuchszeit' => $Besuchszeit, ':Betriebssystem' => $Betriebssystem, ':BrowserName' => $BrowserName, ':BrowserDetails' => $BrowserDetails, ':Cookies' => $Cookies, ':Orientation' => $Orientation, ':Fensterhoehe' => $Fensterhoehe, ':Fensterbreite' => $Fensterbreite, ':PixelRatio' => $PixelRatio, ':PixelDepth' => $PixelDepth, ':ColorDepth' => $ColorDepth, ':Aktion' => $Aktion);

	processpdo($commandtext, $paramsarray, $responsearray);

	if($responsearray["ergebnisflag"]) {

		$responsearray["ergebnistext"]	= "Besucher eingetragen";

	}
	echo json_encode($responsearray);
}

//===========================================================================
if($DesiredFunction == 'ThemaSpeichern') {

  $level      = $_POST['level'];
  $parentid   = $_POST['parentid'];
  $neuername  = $_POST['neuername'];

  $neuerlevel = intval($level) + 1; // neue Themen werden immer unter den bisherigen Knoten einsortiert

  $commandtext = "INSERT INTO T_Themen (level, parent, thematext) VALUES (:neuerlevel, :parentid, :neuername)";
  $paramsarray = array(':neuerlevel' => $neuerlevel, ':parentid' => $parentid, ':neuername' => $neuername);

	processpdo($commandtext, $paramsarray, $responsearray);

  if($responsearray["ergebnisflag"])	{

		$responsearray["ergebnistext"]	= "Neues Thema erfolgreich eingetragen";
		$responsearray["ergebnisdaten"]	= $neuername;

	}
	echo json_encode($responsearray);
}

//===========================================================================
if($DesiredFunction == 'ThemaEntfernen') {

	$knotenid = $_POST['knotenid'];

  $commandtext = "DELETE FROM T_Themen WHERE Id = :knotenid";
	$paramsarray = array(':knotenid' => $knotenid);

	processpdo($commandtext, $paramsarray, $responsearray);

  if($responsearray["ergebnisflag"])	{

		$responsearray["ergebnistext"]	= "Thema erfolgreich entfernt";

  }
	echo json_encode($responsearray);
}

//===========================================================================
if($DesiredFunction == 'AufgabeSpeichern') {

  $Kurztext     = $_POST['Kurztext'];
  $Langtext     = $_POST['Langtext'];
  $Quelle       = $_POST['Quelle'];
  $Quelledetail = $_POST['Quelledetail'];
  $ImportQuelle = $_POST['ImportQuelle'];
	$Annotator		= $_POST['Annotator'];
	$WeissName		= $_POST['WeissName'];
	$SchwarzName	= $_POST['SchwarzName'];
  $Ab           = date('Y-m-d H:i:s');
	$Datum				= $_POST['Datum'];
  $AmZug        = $_POST['AmZug'];
  $FEN          = $_POST['FEN'];
  $Scope        = $_POST['Scope'];
  $Skill        = $_POST['Skill'];
  $studieid     = $_POST['studieId'];
  $kapitelid    = $_POST['kapitelId'];
  $pgn          = $_POST['pgn'];

  $commandtext = "INSERT INTO T_Aufgaben (Kurztext, Langtext, Quelle, Quelledetail, ImportQuelle, Annotator, WeissName, SchwarzName, Ab, Datum, AmZug, FEN, Scope, Skill, lichess_studie_id, lichess_kapitel_id, PGN) VALUES (:Kurztext, :Langtext, :Quelle, :Quelledetail, :ImportQuelle, :Annotator, :WeissName, :SchwarzName, :Ab, :Datum, :AmZug, :FEN, :Scope, :Skill, :lichess_studie_id, :lichess_kapitel_id, :PGN)";

  $paramsarray = array(':Kurztext' => $Kurztext, ':Langtext' => $Langtext, ':Quelle' => $Quelle, ':Quelledetail' => $Quelledetail, ':ImportQuelle' => $ImportQuelle, ':Annotator' => $Annotator, ':WeissName' => $WeissName, ':SchwarzName' => $SchwarzName, ':Ab' => $Ab, ':Datum' => $Datum, ':AmZug' => $AmZug, ':FEN' => $FEN, ':Scope' => $Scope, ':Skill' => $Skill, ':lichess_studie_id' => $studieid, ':lichess_kapitel_id' => $kapitelid, ':PGN' => $pgn);

	processpdo($commandtext, $paramsarray, $responsearray);

	if($responsearray["ergebnisflag"]) 	{

		$responsearray["ergebnistext"]	= "Neue Aufgabe erfolgreich eingetragen";

  }
	echo json_encode($responsearray);
}

//===========================================================================
if($DesiredFunction == 'AufgabeEntfernen') {

	$aufgabeid = $_POST['AufgabeID'];

  $commandtext = "DELETE FROM T_Aufgaben WHERE Id = :aufgabeid";
	$paramsarray = array(':aufgabeid' => $aufgabeid);

	processpdo($commandtext, $paramsarray, $responsearray);

  if($responsearray["ergebnisflag"]) {

		$responsearray["ergebnistext"]	= "Aufgabe erfolgreich entfernt";

  }
	echo json_encode($responsearray);
}

//===========================================================================
if($DesiredFunction == 'ThemaUndAufgabeVerbinden') {

  $ThemaKennung     = $_POST['themakennung'];
  $AufgabeKennung   = $_POST['aufgabekennung'];

  $commandtext = "INSERT INTO T_ThemenAufgaben (ThemenID,  AufgabenID) VALUES ( :thema, :aufgabe )";
  $paramsarray = array(':thema' => $ThemaKennung, ':aufgabe' => $AufgabeKennung);

	processpdo($commandtext, $paramsarray, $responsearray);

	if($responsearray["ergebnisflag"])	{

		$responsearray["ergebnistext"]	= "Thema und Aufgabe erfolgreich kombiniert";

  } else {

		$responsearray["ergebnisflag"]	= false;
		$responsearray["ergebnistext"]	= "Es ist ein Fehler aufgetreten";
  }
	echo json_encode($responsearray);
}

//===========================================================================
if($DesiredFunction == 'ThemaUndAufgabeTrennen') {

  $ThemaKennung     = $_POST['themakennung'];
  $AufgabeKennung   = $_POST['aufgabekennung'];

  $commandtext = "DELETE FROM T_ThemenAufgaben WHERE ThemenID = :themenid AND AufgabenID = :aufgabenid";
  $paramsarray = array('themenid' => intval($ThemaKennung), 'aufgabenid' =>  intval($AufgabeKennung));

	processpdo($commandtext, $paramsarray, $responsearray);

	if($responsearray["ergebnisflag"])		{

		$responsearray["ergebnistext"]	= "Thema und Aufgabe erfolgreich getrennt";

  }
	echo json_encode($responsearray);
}

//===========================================================================
if($DesiredFunction == 'Zugliste') {

  $Zugliste			= $_POST["Zugliste"];

  $commandtext = "INSERT INTO T_Zuege (AufgabeID, FEN, NAGNotation, NAGMove, NAGSingle, CurMoveIndex, CurMoveId, PreMoveId, ZugNummer, ZugLevel, ZugFarbe, ZugOriginal, ZugFigur, ZugVon, ZugNach, ZugKurz, ZugLang, ZugStockfish, ZugAktion, ZugStart, ZugUmwandlung, ZugZeichen, Hinweistext, Hinweispfeil) VALUES (:AufgabeID, :FEN, :NAGNotation, :NAGMove, :NAGSingle, :CurMoveIndex, :CurMoveId, :PreMoveId, :ZugNummer, :ZugLevel, :ZugFarbe, :ZugOriginal, :ZugFigur, :ZugVon, :ZugNach, :ZugKurz, :ZugLang, :ZugStockfish, :ZugAktion, :ZugStart, :ZugUmwandlung, :ZugZeichen, :Hinweistext, :Hinweispfeil)";
	$paramscompact = $Zugliste;

	processpdo_Zugliste($commandtext, $paramscompact, $responsearray);

	if($responsearray["ergebnisflag"])		{

		$responsearray["ergebnistext"]	= "Zugliste zur Aufgabe erfolgreich eingetragen";

  }
	echo json_encode($responsearray);
}

?>