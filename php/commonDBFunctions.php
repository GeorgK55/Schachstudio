<?php

// prepare und execute für dbocommand
// command und Parameterarray müssen passen, wird nicht geprüft
// Ergebnisse werden einfach universell mit fetchAll geholt und so zurückgegeben
// rowCount und lastInsertedId werden immer abgefragt, auch wenn sie irrelevant sind

function processpdo( $pdocommand, $pdoexecutearray, & $pdoresponsearray) {

	include ('dbaccount.php');

	$errorresponsearray = [
		"ergebnisflag"	=> "",
		"ergebnistext"	=> "",
		"ergebnisdaten"	=> "",
		"neueid"				=> "",
		"zeilenanzahl"	=> "",
		"sql"						=> "",
		"errorinfo0"		=> "",
		"errorinfo1"		=> "",
		"errorinfo2"		=> ""
	];

	try {
		$pdo = new PDO("mysql:host=$host_name; dbname=$database;", $user_name, $password);
	} catch (PDOException $e) {

		$errorresponsearray["ergebnisflag"]	= false;
		$errorresponsearray["ergebnistext"]	= "Es ist ein Fehler aufgetreten";

		$errorresponsearray["errorinfo0"]	= $e->getCode();
		$errorresponsearray["errorinfo1"]	= "CauseLine: " . $e->getLine();
		$errorresponsearray["errorinfo2"]	= $e->getMessage();

		exit();
	}

	$commonsqlcommand = $pdo->prepare( $pdocommand);

	if($commonsqlcommand->execute( $pdoexecutearray)) {

		 $pdoresponsearray["ergebnisflag"]		= true;
		 $pdoresponsearray["ergebnisdaten"]		= $commonsqlcommand->fetchAll();
		 $pdoresponsearray["zeilenanzahl"]		= $commonsqlcommand->rowCount();
		 $pdoresponsearray["neueid"]					= $pdo->lastInsertId();

	} else {

		 $pdoresponsearray["ergebnisflag"]	= false;
		 $pdoresponsearray["ergebnistext"]	= "Es ist ein Fehler aufgetreten";

		 $pdoresponsearray["errorinfo0"]	= $commonsqlcommand->errorInfo()[0];
		 $pdoresponsearray["errorinfo1"]	= $commonsqlcommand->errorInfo()[1];
		 $pdoresponsearray["errorinfo2"]	= $commonsqlcommand->errorInfo()[2];

	}
	 $pdoresponsearray["sql"]	= $commonsqlcommand->queryString;

	$commonsqlcommand = null;
	$pdo = null;
}

// Es wird eine Transaktion gestartet und beendet
// Die Daten werden als Objekt übergeben und erst hier getrennt

function processpdo_Zugliste( $pdocommand,  $pdoparams, & $pdoresponsearray) {

	include ('dbaccount.php');

	try {
		$pdo = new PDO("mysql:host=$host_name; dbname=$database;", $user_name, $password);
	} catch (PDOException $e) {

		$errorresponsearray = [
			"ergebnisflag"	=> "",
			"ergebnistext"	=> "",
			"ergebnisdaten"	=> "",
			"neueid"				=> "",
			"zeilenanzahl"	=> "",
			"sql"						=> "",
			"errorinfo0"		=> "",
			"errorinfo1"		=> "",
			"errorinfo2"		=> ""
		];

		$errorresponsearray["ergebnisflag"]	= false;
		$errorresponsearray["ergebnistext"]	= "Es ist ein Fehler aufgetreten";

		$errorresponsearray["errorinfo0"]	= $e->getCode();
		$errorresponsearray["errorinfo1"]	= "CauseLine: " . $e->getLine();
		$errorresponsearray["errorinfo2"]	= $e->getMessage();

		exit();
	}

	$ZugCounter = 0;

	$pdo->beginTransaction();

	$commonsqlcommand = $pdo->prepare( $pdocommand);

	foreach( $pdoparams as $paramrow) {

		$pdoexecutearray = array();

		$pdoexecutearray = array(
			':AufgabeID'			=> $_POST['AufgabenID'],
			':FEN'						=> $paramrow['FEN'],
			':NAGNotation'		=> $paramrow['NAGNotation'],
			':NAGMove'				=> $paramrow['NAGMove'],
			':NAGSingle'			=> $paramrow['NAGSingle'],
			':CurMoveIndex'		=> $paramrow['CurMoveIndex'],
			':CurMoveId'			=> $paramrow['CurMoveId'],
			':PreMoveId'			=> $paramrow['PreMoveId'],
			':ZugNummer'			=> $paramrow['ZugNummer'],
			':ZugLevel'				=> $paramrow['ZugLevel'],
			':ZugFarbe'				=> $paramrow['ZugFarbe'],
			':ZugOriginal'		=> $paramrow['ZugOriginal'],
			':ZugFigur'				=> $paramrow['ZugFigur'],
			':ZugVon'					=> $paramrow['ZugVon'],
			':ZugNach'				=> $paramrow['ZugNach'],
			':ZugKurz'				=> $paramrow['ZugKurz'],
			':ZugLang'				=> $paramrow['ZugLang'],
			':ZugStockfish'		=> $paramrow['ZugStockfish'],
			':ZugAktion'			=> $paramrow['ZugAktion'],
			':ZugStart'				=> $paramrow['ZugStart'],
			':ZugUmwandlung'	=> $paramrow['ZugUmwandlung'],
			':ZugZeichen'			=> $paramrow['ZugZeichen'],
			':Hinweistext'		=> $paramrow['Hinweistext'],
			':Hinweispfeil'		=> $paramrow['Hinweispfeil']
		);

		if(!($commonsqlcommand->execute( $pdoexecutearray))) {

			$pdoresponsearray["ergebnisflag"]	= false;
			$pdoresponsearray["ergebnistext"]	= "Es ist ein Fehler aufgetreten";

			$pdoresponsearray["errorinfo0"]	= $commonsqlcommand->errorInfo()[0];
			$pdoresponsearray["errorinfo1"]	= $commonsqlcommand->errorInfo()[1];
			$pdoresponsearray["errorinfo2"]	= $commonsqlcommand->errorInfo()[2];

			exit;
		} else {
			$ZugCounter++;
		}

 	}

	$pdo->commit();

	$pdoresponsearray["ergebnisflag"]		= true;
	$pdoresponsearray["zeilenanzahl"]		= $ZugCounter;

	$commonsqlcommand = null;
	$pdo = null;

}

?>