<?php

$DesiredFunction = $_POST['dataContext'];
//echo "Erkannt: ".$DesiredFunction;

include ('dbaccount.php');

try {
  $pdo = new PDO("mysql:host=$host_name; dbname=$database;", $user_name, $password);
} catch (PDOException $e) {
  echo "Fehler!: " . $e->getMessage() . "<br/>";
  die();
}

//===========================================================================
if($DesiredFunction == 'AufgabeSpeichern') {

  echo "Aufgabe erkannt\n";
  echo $_POST['Kurztext'];
  echo "Das war Kurztext";

  $Kurztext     = $_POST['Kurztext'];
  $Langtext     = $_POST['Langtext'];
  $Quelle       = $_POST['Quelle'];
  $Quelledetail = $_POST['Quelledetail'];
  $ImportQuelle = $_POST['ImportQuelle'];
  $Ab           = date();
  $AmZug        = $_POST['AmZug'];
  $FEN          = $_POST['FEN'];
  $Scope        = $_POST['Scope'];
  $Skill        = $_POST['Skill'];
  $studie       = $_POST['studie'];
  $kapitel      = $_POST['kapitel'];
  $pgn          = $_POST['pgn'];

  $sqlcmd_Aufgabe = $pdo->prepare("INSERT INTO T_Aufgaben (Kurztext, Langtext, Quelle, Quelledetail, ImportQuelle, Ab, AmZug, FEN, Scope, Skill, lichess_studie, lichess_kapitel, PGN) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )");
  if($sqlcmd_Aufgabe->execute(array($Kurztext, $Langtext, $Quelle, $Quelledetail, $ImportQuelle, $Ab, $AmZug, $FEN, $Scope, $Skill, $studie, $kapitel, $pgn))) {
 
    $neue_id = $pdo->lastInsertId();
    echo "Neue Aufgabe mit id $neue_id erfolgreich neu angelegt";

  } else {

    echo "\nEs ist ein Fehler aufgetreten\n";
    echo "\n";
    echo $sqlcmd_Aufgabe->queryString."<br />";
    echo "\n";
    echo $sqlcmd_Aufgabe->errorInfo()[0];
    echo "\n";
    echo $sqlcmd_Aufgabe->errorInfo()[1];
    echo "\n";
    echo $sqlcmd_Aufgabe->errorInfo()[2];
    echo "\n";
 
  }
}   
//===========================================================================
if($DesiredFunction == 'AufgabeEntfernen') {

  $aufgabeid     = $_POST['AufgabeID'];

  echo "Augabe entfernen erkannt mit " . $aufgabeid . "\n";

  $sqlcmd_Aufgabe = $pdo->prepare("DELETE FROM T_Aufgaben WHERE Id = ?");
  if($sqlcmd_Aufgabe->execute(array($aufgabeid))) {
    echo "Aufgabe mit " . $aufgabeid . " erfolgreich entfernt\n";
  } else {

    echo "\nEs ist ein Fehler aufgetreten\n";
    echo "\n";
    echo $sqlcmd_Aufgabe->queryString."<br />";
    echo "\n";
    echo $sqlcmd_Aufgabe->errorInfo()[0];
    echo "\n";
    echo $sqlcmd_Aufgabe->errorInfo()[1];
    echo "\n";
    echo $sqlcmd_Aufgabe->errorInfo()[2];
    echo "\n";
 
  }
}


//===========================================================================
if($DesiredFunction == 'Zugliste') {

  $Zugliste			= $_POST["Zugliste"];

  $sqlcmd_Zugliste = $pdo->prepare("INSERT INTO T_Zuege (" . 
        "AufgabeID," .
        "FEN," .
        "NAG," .
        "CurMoveIndex," .
        "CurMoveId," .
        "PreMoveId," .
        "ZugNummer," .
        "ZugLevel," .
        "ZugFarbe," .
        "ZugOriginal," .
        "ZugFigur," .
        "ZugVon," .
        "ZugNach," .
        "ZugKurz," .
        "ZugLang," .
        "ZugStockfish," .
        "ZugAktion," .
        "ZugUmwandlung," .
        "ZugZeichen," .
        "Hinweistext," .
        "Hinweispfeil) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
 
  $ImportCounter = 0;

  for($i=0;$i<count($Zugliste); $i++) {

    if($sqlcmd_Zugliste->execute(array(
      $_POST['AufgabenID'],
      $Zugliste[$i]['FEN'],
      $Zugliste[$i]['NAG'],
      $Zugliste[$i]['CurMoveIndex'],
      $Zugliste[$i]['CurMoveId'],
      $Zugliste[$i]['PreMoveId'],
      $Zugliste[$i]['ZugNummer'],
      $Zugliste[$i]['ZugLevel'],
      $Zugliste[$i]['ZugFarbe'],
      $Zugliste[$i]['ZugOriginal'],
      $Zugliste[$i]['ZugFigur'],
      $Zugliste[$i]['ZugVon'],
      $Zugliste[$i]['ZugNach'],
      $Zugliste[$i]['ZugKurz'],
      $Zugliste[$i]['ZugLang'],
      $Zugliste[$i]['ZugStockfish'],
      $Zugliste[$i]['ZugAktion'],
      $Zugliste[$i]['ZugUmwandlung'],
      $Zugliste[$i]['ZugZeichen'],
      $Zugliste[$i]['Hinweistext'],
      $Zugliste[$i]['Hinweispfeil']))) {

      $ImportCounter = $ImportCounter + 1;

    } else {
      echo "\nEs ist ein Fehler aufgetreten\n";
      echo "\n";
      echo $sqlcmd->queryString."<br />";
      echo "\n";
      echo $sqlcmd->errorInfo()[0];
      echo "\n";
      echo $sqlcmd->errorInfo()[1];
      echo "\n";
      echo $sqlcmd->errorInfo()[2];
      echo "\n";
    }

  }
  echo "Zur neuen Aufgabe wurden " . $ImportCounter . " Züge erfolgreich neu kombiniert.";
}

//===========================================================================
if($DesiredFunction == 'ThemaSpeichern') {

  echo "Thema erkannt\n";

  $level      = $_POST['level'];
  $parentname = $_POST['parentname'];
  $neuername  = $_POST['neuername'];

  $neuerlevel = intval($level) + 1; // neue Themen werden immer unter den bisherigen Knoten einsortiert

  $sqlcmd_Thema = $pdo->prepare("INSERT INTO T_Themen (Level,  Father,  Thematext) VALUES (?, ?, ? )");
  if($sqlcmd_Thema->execute(array($neuerlevel, $parentname, $neuername))) {
    $neue_id = $pdo->lastInsertId();
    echo "Neues Thema mit id $neue_id erfolgreich neu angelegt";

  } else {

    echo "\nEs ist ein Fehler aufgetreten\n";
    echo "\n";
    echo $sqlcmd_Thema->queryString."<br />";
    echo "\n";
    echo $sqlcmd_Thema->errorInfo()[0];
    echo "\n";
    echo $sqlcmd_Thema->errorInfo()[1];
    echo "\n";
    echo $sqlcmd_Thema->errorInfo()[2];
    echo "\n";
 
  }
}

//===========================================================================
if($DesiredFunction == 'ThemaEntfernen') {

  $level     = $_POST['level'];
  $themaname = $_POST['themaname'];

  echo "Thema erkannt mit " . $level . " und " . $themaname . "\n";

  $sqlcmd_Thema = $pdo->prepare("DELETE FROM T_Themen WHERE Level = :l AND Thematext = :t");
  if($sqlcmd_Thema->execute(array('l' => intval($level), 't' =>  $themaname))) {
    echo "Thema mit " . $level . " und " . $themaname . " erfolgreich entfernt\n";
  } else {

    echo "\nEs ist ein Fehler aufgetreten\n";
    echo "\n";
    echo $sqlcmd_Thema->queryString."<br />";
    echo "\n";
    echo $sqlcmd_Thema->errorInfo()[0];
    echo "\n";
    echo $sqlcmd_Thema->errorInfo()[1];
    echo "\n";
    echo $sqlcmd_Thema->errorInfo()[2];
    echo "\n";
 
  }
}

//===========================================================================
if($DesiredFunction == 'ThemaUndAufgabeVerbinden') {

  $ThemaKennung     = $_POST['themakennung'];
  $AufgabeKennung   = $_POST['aufgabekennung'];
  
  $sqlcmd_ThemaUndAufgabe = $pdo->prepare("INSERT INTO T_ThemenAufgaben (ThemenID,  AufgabenID) VALUES (?, ? )");
  if($sqlcmd_ThemaUndAufgabe->execute(array($ThemaKennung, $AufgabeKennung))) {
    $neue_id = $pdo->lastInsertId();
    echo "Thema und Aufgabe mit id $neue_id erfolgreich neu angelegt";

  } else {

    echo "\nEs ist ein Fehler aufgetreten\n";
    echo "\n";
    echo $sqlcmd_ThemaUndAufgabe->queryString."<br />";
    echo "\n";
    echo $sqlcmd_ThemaUndAufgabe->errorInfo()[0];
    echo "\n";
    echo $sqlcmd_ThemaUndAufgabe->errorInfo()[1];
    echo "\n";
    echo $sqlcmd_ThemaUndAufgabe->errorInfo()[2];
    echo "\n";
 
  }

}

//===========================================================================
if($DesiredFunction == 'ThemaUndAufgabeTrennen') {

  $ThemaKennung     = $_POST['themakennung'];
  $AufgabeKennung   = $_POST['aufgabekennung'];
  
  $sqlcmd_ThemaUndAufgabe = $pdo->prepare("DELETE FROM T_ThemenAufgaben WHERE ThemenID = :themenid AND AufgabenID = :aufgabenid");
  if($sqlcmd_ThemaUndAufgabe->execute(array('themenid' => intval($ThemaKennung), 'aufgabenid' =>  intval($AufgabeKennung)))) {

    $neue_id = $pdo->lastInsertId();
    echo "Thema und Aufgabe mit id $neue_id erfolgreich getrennt";

  } else {

    echo "\nEs ist ein Fehler aufgetreten\n";
    echo "\n";
    echo $sqlcmd_ThemaUndAufgabe->queryString."<br />";
    echo "\n";
    echo $sqlcmd_ThemaUndAufgabe->errorInfo()[0];
    echo "\n";
    echo $sqlcmd_ThemaUndAufgabe->errorInfo()[1];
    echo "\n";
    echo $sqlcmd_ThemaUndAufgabe->errorInfo()[2];
    echo "\n";
 
  }
} 
?>