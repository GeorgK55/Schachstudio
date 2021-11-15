<?php

header("Cross-Origin-Opener-Policy: same-origin");
header("Cross-Origin-Embedder-Policy: require-corp");

$DesiredFunction = $_GET['dataContext'];

include ('dbaccount.php');

try {
  $pdo = new PDO("mysql:host=$host_name; dbname=$database;", $user_name, $password);
} catch (PDOException $e) {
  echo "Fehler!: " . $e->getMessage() . "<br/>";
  die();
}

//===========================================================================
if($DesiredFunction == 'Themes') {

  $sqlcmd_Themes = $pdo->prepare("SELECT * FROM T_Themen order by Level");
  $sqlcmd_Themes->execute();

  $result = $sqlcmd_Themes->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($result);

}

//===========================================================================
if($DesiredFunction == 'XXXChallenges') {

  $sqlcmd_Challenges = $pdo->prepare("SELECT * FROM T_Aufgaben order by Kurztext");
  $sqlcmd_Challenges->execute();

  $result = $sqlcmd_Challenges->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($result);  

}

//===========================================================================
if($DesiredFunction == 'Challenges') {

  $ThemaId = $_GET['themaid'];

  //echo $ThemaId;
  //$sqlcmd_Challenges = $pdo->prepare("SELECT Id as DT_RowId, Kurztext FROM T_Aufgaben order by Kurztext");
  if(intval($ThemaId) == -1) {
    //echo "ThemaId negativ";
    $sqlcmd_Challenges = $pdo->prepare("SELECT distinct Aufgaben_ID, Kurztext, lichess_studie, lichess_kapitel FROM V_ThemenAufgaben order by Kurztext");
    $sqlcmd_Challenges->execute();
  } else {
    //echo "ThemaId sonst";
    $sqlcmd_Challenges = $pdo->prepare("SELECT * FROM V_ThemenAufgaben where Themen_ID = ".$ThemaId." order by Kurztext");
    $sqlcmd_Challenges->execute();
  }

  $result = $sqlcmd_Challenges->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($result);  

}

//===========================================================================
if($DesiredFunction == 'AufgabeundZug') { // wird nicht benutzt. Aufgabe und Züge werden getrennt abgeholt

  $AufgabeID = $_GET['AufgabeID'];

  $sqlcmd_AufgabeundZug = $pdo->prepare("SELECT * FROM V_Aufgaben_Zuege where AufgabeID = " . $AufgabeID . " order by Kurztext");
  $sqlcmd_AufgabeundZug->execute();

  $result = $sqlcmd_AufgabeundZug->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($result);  

}

//===========================================================================
if($DesiredFunction == 'Aufgabedaten') {

  $AufgabeID = $_GET['AufgabeID'];

  $sqlcmd_Aufgabedaten = $pdo->prepare("SELECT * FROM T_Aufgaben where Id = " . $AufgabeID . " order by Kurztext");
  $sqlcmd_Aufgabedaten->execute();

  $result = $sqlcmd_Aufgabedaten->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($result);  

}

//===========================================================================
if($DesiredFunction == 'Aufgabebenutzung') {

  $AufgabeID = $_GET['AufgabeID'];

  $sqlcmd_Aufgabedaten = $pdo->prepare("SELECT COUNT(*) AS anzahl FROM V_ThemenAufgaben where Aufgaben_ID = " . intval($AufgabeID) . " AND Themen_ID IS NOT NULL");
  $sqlcmd_Aufgabedaten->execute();

  $result = $sqlcmd_Aufgabedaten->fetch();

  echo $result['anzahl'] . " mal mit Themen verbunden";

}

//===========================================================================
if($DesiredFunction == 'Zugdaten') {

  $AufgabeID = $_GET['AufgabeID'];

  $sqlcmd_Zugdaten = $pdo->prepare("SELECT * FROM T_Zuege where AufgabeId = " . $AufgabeID . " order by Id");
  $sqlcmd_Zugdaten->execute();

  $result = $sqlcmd_Zugdaten->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($result);  
}

?>
