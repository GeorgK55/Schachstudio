<?php

header("Cross-Origin-Opener-Policy: same-origin");
header("Cross-Origin-Embedder-Policy: require-corp");

$DesiredFunction = $_GET['dataContext'];

include ('dbfunctions.php');

//===========================================================================
if($DesiredFunction == 'VisitorCounter') {

	// Den aktuellen Wert VisitorCounter holen.
	// Wenn Inkrement angefordert ist: inkrementieren und zurückschreiben
	// Den gelesenen oder den inkrementierten Wert zurückgeben

	$commandtext = "SELECT SystemValue FROM T_SystemValues WHERE SystemKey = 'VisitorCounter'";
	$paramsarray = array();

	processpdo($commandtext, $paramsarray, $responsearray);

	if($responsearray["ergebnisflag"]) {

		$responsearray["ergebnistext"]	= "VisitorCounter fehlerfrei gelesen";
		$responsearray["ergebnisdaten"]	= $responsearray["ergebnisdaten"][0]["SystemValue"];
	
		$CounterAction = $_GET['CounterAction'];

		if($CounterAction == 'increment') {

			$commandtext = "UPDATE T_SystemValues SET SystemValue = :newcountervalue WHERE SystemKey = 'VisitorCounter'";
			$NewCounterValue = intval($responsearray["ergebnisdaten"]) + 1;
			$paramsarray = array("newcountervalue" => $NewCounterValue);

			processpdo($commandtext, $paramsarray, $responsearray);

			if($responsearray["ergebnisflag"]) {

				$responsearray["ergebnistext"]	= "VisitorCounter fehlerfrei inkrementiert";
				$responsearray["ergebnisdaten"]	= $NewCounterValue;

			}
		}
	}
	echo json_encode($responsearray);
}

//===========================================================================
if($DesiredFunction == 'Themes') {

	$commandtext = "SELECT * FROM T_Themen";
	$paramsarray = array();

	processpdo($commandtext, $paramsarray, $responsearray);

	if($responsearray["ergebnisflag"]) {

		$responsearray["ergebnistext"]	= $responsearray["zeilenanzahl"] . " Themen erkannt";

	}
  echo json_encode($responsearray);
}

//===========================================================================
if($DesiredFunction == 'Challenges') {

  if(empty($_GET['themaid'])) {

		$commandtext = "SELECT distinct Aufgaben_ID, Kurztext, lichess_studie_id, lichess_kapitel_id FROM V_ThemenAufgaben order by Kurztext";
  } else {

		// Bei select in () scheint es nur so zu funktionieren
		$sqlThemaId = join(',', $_GET['themaid']);
		$commandtext = "SELECT distinct Aufgaben_ID, Kurztext, lichess_studie_id, lichess_kapitel_id FROM V_ThemenAufgaben where Themen_ID in ( " . $sqlThemaId . " ) order by Kurztext";

  }

	$paramsarray = array();
	processpdo($commandtext, $paramsarray, $responsearray);

	if($responsearray["ergebnisflag"]) {

		$responsearray["ergebnistext"]	= $responsearray["zeilenanzahl"] . " Aufgaben gefunden";

	}
  echo json_encode($responsearray);
}

//===========================================================================
if($DesiredFunction == 'ThemeIds') {

	$AufgabeId = $_GET['challengeid'];
	
	$commandtext = "SELECT distinct Themen_ID FROM V_ThemenAufgaben where Aufgaben_ID = " . $AufgabeId;
 	$paramsarray = array();

	processpdo($commandtext, $paramsarray, $responsearray);

	if($responsearray["ergebnisflag"]) {

		$responsearray["ergebnistext"]	= $responsearray["zeilenanzahl"] . " Themen gefunden";

	}
  echo json_encode($responsearray);
}

//===========================================================================
if($DesiredFunction == 'Aufgabedaten') {

  $AufgabeID = $_GET['AufgabeID'];

  $commandtext = "SELECT * FROM T_Aufgaben where Id = " . $AufgabeID . " order by Kurztext";
	$paramsarray = array();

	processpdo($commandtext, $paramsarray, $responsearray);

	if($responsearray["ergebnisflag"]) {

		$responsearray["ergebnistext"]	= "Aufgabe gefunden";

	}
  echo json_encode($responsearray);
}

//===========================================================================
if($DesiredFunction == 'Aufgabebenutzung') {

  $AufgabeID = $_GET['AufgabeID'];

  $commandtext = "SELECT COUNT(*) AS anzahl FROM V_ThemenAufgaben where Aufgaben_ID = " . intval($AufgabeID) . " AND Themen_ID IS NOT NULL";
	$paramsarray = array();

	processpdo($commandtext, $paramsarray, $responsearray);

	if($responsearray["ergebnisflag"]) {

		$responsearray["ergebnistext"]	= $responsearray["zeilenanzahl"] . " mal mit Themen verbunden";

	}
	echo json_encode($responsearray);
}

//===========================================================================
if($DesiredFunction == 'Zugdaten') {

  $AufgabeID = $_GET['AufgabeID'];
	$MitVarianten = '';
	if (!($_GET['Varianten'])) $MitVarianten = ' and ZugLevel = 0 ';

  $commandtext = "SELECT * FROM T_Zuege where AufgabeId = " . $AufgabeID . $MitVarianten . " order by Id";
	$paramsarray = array();

	processpdo($commandtext, $paramsarray, $responsearray);

	if($responsearray["ergebnisflag"]) {

		$responsearray["ergebnistext"]	= $responsearray["zeilenanzahl"] . " Züge gefunden";

	}
	echo json_encode($responsearray);
}

//===========================================================================
if($DesiredFunction == 'NAGdaten') {

  $commandtext = "SELECT * FROM T_NAG order by DollarIndex";
	$paramsarray = array();

	processpdo($commandtext, $paramsarray, $responsearray);

	if($responsearray["ergebnisflag"]) {

		$responsearray["ergebnistext"]	= $responsearray["zeilenanzahl"] . " NAG gefunden";

	}
	echo json_encode($responsearray);
}

?>
