
function AufgabeSpeichern() {

  if($('#QuelleImport').val().includes("https://lichess.org/study/")) {
    var quelledetails = $('#QuelleImport').val().split("/");
    lichess_studie    = quelledetails[4];
    lichess_kapitel   = quelledetails[5];
  } else {
    lichess_studie    = "";
    lichess_kapitel   = "";
  }

  $.ajax({
      url:        "php/putDBData.php",
      type:       "POST",
      dataType:   "text",
      data:       { dataContext: "AufgabeSpeichern",             
                    Kurztext:       $('#KurztextImport').val(),
                    Langtext:       $('#LangtextImport').val(),
                    Quelle:         $('#QuelleImport').val(),
                    Quelledetail:   $('#QuelledetailImport').val(),
                    ImportQuelle:   $('#ImportQuelleImport').val(),
                    AmZug:          $('#AmZugImport').val(),
                    FEN:            $('#FENImport').val(),
                    Scope:          $('#ScopeImport').val(),
                    Skill:          $('#SkillImport').val(),
                    studie:         lichess_studie,
                    kapitel:        lichess_kapitel
                  },  
      success:    AufgabeSpeichernErfolg
    })
    .done(function(responseData)    { /*responseDatadone("Aufgabe" + responseData);*/  })
    .fail(function(responseData)    { /*responseDatafail("Aufgabe" + responseData);*/  })
    .always(function(responseData)  { /*responseDataalways("Aufgabe" + responseData);*/  });

};

function ThemaSpeichern(Knoten, NeuerName) {

  $.ajax({
    url:        "php/putDBData.php",
    type:       "POST",
    dataType:   "text",
    data:       { dataContext: "ThemaSpeichern",             
                    level:      Knoten[0],
                    parentname: Knoten[1],
                    neuername:  NeuerName
                  },
    success:    ThemaSpeichernErfolg
  })
  .done(function(responseData)    { /*responseDatadone("Aufgabe" + responseData);*/  })
  .fail(function(responseData)    { /*responseDatafail("Aufgabe" + responseData);*/  })
  .always(function(responseData)  { /*responseDataalways("Aufgabe" + responseData);*/  });

}

function ThemaUndAufgabeVerbinden(T_id, A_id) {

  $.ajax({
    url:        "php/putDBData.php",
    type:       "POST",
    dataType:   "text",
    data:       { dataContext: "ThemaUndAufgabeVerbinden",             
                    themakennung:   T_id,
                    aufgabekennung: A_id
                  },
    success:    ThemaUndAufgabeErfolg
  })
  .done(function(responseData)    { /*responseDatadone("Aufgabe" + responseData);*/  })
  .fail(function(responseData)    { /*responseDatafail("Aufgabe" + responseData);*/  })
  .always(function(responseData)  { /*responseDataalways("Aufgabe" + responseData);*/  });

}
function ThemaUndAufgabeTrennen(T_id, A_id) {

  $.ajax({
    url:        "php/putDBData.php",
    type:       "POST",
    dataType:   "text",
    data:       { dataContext: "ThemaUndAufgabeTrennen",             
                    themakennung:   T_id,
                    aufgabekennung: A_id
                  },
    success:    ThemaUndAufgabeErfolg
  })
  .done(function(responseData)    { /*responseDatadone("Aufgabe" + responseData);*/  })
  .fail(function(responseData)    { /*responseDatafail("Aufgabe" + responseData);*/  })
  .always(function(responseData)  { /*responseDataalways("Aufgabe" + responseData);*/  });

}

function ThemaEntfernen(Knoten) {

  $.ajax({
    url:        "php/putDBData.php",
    type:       "POST",
    dataType:   "text",
    data:       { dataContext: "ThemaEntfernen",             
                    level:      Knoten[0],
                    themaname:  Knoten[1]
                  },
    success:    ThemaEntfernenErfolg
  })
  .done(function(responseData)    { /*responseDatadone("Aufgabe" + responseData);*/  })
  .fail(function(responseData)    { /*responseDatafail("Aufgabe" + responseData);*/  })
  .always(function(responseData)  { /*responseDataalways("Aufgabe" + responseData);*/  });
}
function AufgabeEntfernen(id) {
  
  $.ajax({
    url:        "php/putDBData.php",
    type:       "POST",
    dataType:   "text",
    data:       { dataContext: "AufgabeEntfernen",             
                    AufgabeID:      id
                  },
    success:    AufgabeEntfernenErfolg
  })
  .done(function(responseData)    { /*responseDatadone("Aufgabe" + responseData);*/  })
  .fail(function(responseData)    { /*responseDatafail("Aufgabe" + responseData);*/  })
  .always(function(responseData)  { /*responseDataalways("Aufgabe" + responseData);*/  });
}
function AufgabeSpeichernErfolg(responseData) {   
  
  NeueAufgabeID = parseInt((/\d+ erfolgreich neu angelegt/g).exec(responseData));
  //alert(NeuerAufgabenID);

  $('#cb_Aufgabeauswahl').prop( "checked", true );
  getChallenges(ALLEAUFGABENANZEIGEN);

  if(NeueAufgabeID > 0) {

    var i = 0;
    console.log(JSON.stringify(Zugliste));

    $.ajax({
      url:      "php/putDBData.php",
      type:     "POST",
      dataType: "text",
      data:     { dataContext: "Zugliste", AufgabenID: NeueAufgabeID, Zugliste: Zugliste },
      success:  ZuglisteErfolg
    })
    .done(function(responseData)    { /*responseDatadone("Zugliste" + responseData);*/    })
    .fail(function(responseData)    { /*responseDatafail("Zugliste" + responseData); */   })
    .always(function(responseData)  { /*responseDataalways("Zugliste" + responseData);*/  });


  }

};
function AufgabeEntfernenErfolg(responseData) {   
  
  // Die korrekte Behalung der Fehlersituationen kommt noch!!!

  $('#cb_Aufgabeauswahl').prop( "checked", true );
  getChallenges(ALLEAUFGABENANZEIGEN);
  
};

function ZuglisteErfolg(responseData) {

  var Zuganzahl = parseInt((/\d+ Züge erfolgreich neu kombiniert./g).exec(responseData));

  alert("Die neue Aufgabe " + NeueAufgabeID + " wurde mit " + Zuganzahl + " Zügen übernommen");

}

function ThemaSpeichernErfolg(responseData) {
  alert("Das neue Thema wurde übernommen");
}

function ThemaSpeichernErfolg(responseData) {
 alert(responseData);
}

function ThemaUndAufgabeErfolg(responseData) {

  //var Zuganzahl = parseInt((/\d+ Züge erfolgreich neu kombiniert./g).exec(responseData));

  alert("Thema und Aufgabe wurden verbunden");

}


function responseDatadone(responseData)   {   alert('responseDatadone mit ' + responseData);  };
function responseDatafail(responseData)   {   alert('responseDatafail mit ' + responseData);  };
function responseDataalways(responseData) {   alert('responseDataalways mit ' + responseData);  };

