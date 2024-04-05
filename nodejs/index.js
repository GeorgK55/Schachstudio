
function getlichessUserdata() {
  
  require('dotenv').config();

  const headers = { Authorization: 'Bearer ' + process.env.lichessToken };

  fetch('https://lichess.org/api/account', { headers })
    .then(res => res.json())
    .then(console.log);

}

function getlichessUserdata2() {

	require('dotenv').config();

	const headers = { Authorization: 'Bearer ' + process.env.lichessToken };

	fetch('https://lichess.org/api/account', { headers })
  .then(res => res.json())
	.then(function(res) {
		console.log(res);
	});

}

function getlichessUserstudies() {

	require('dotenv').config();

	const headers = { 'Authorization': 'Bearer ' + process.env.lichessToken, };

	fetch('https://lichess.org/api/study/by/GeorgK', { headers })
    .then(res => res.text())
    .then(function(res) {
      //console.log(res);
      studienliste = res.split('\n').filter(i => i);
      console.log(studienliste);
      studylisttofile(studienliste);
      getstudydata(studienliste, studienliste.length);
    })
	;

}

function studylisttofile(studien){

  const fs = require('node:fs');

  for(let i = 0; i < studien.length; i++) {
    fs.appendFile('/Volumes/Web/Schach22/PGN/per_node/kapitelliste.txt', studien[i] + '\n', (err) => {
    if (err) throw err;
    //console.log(studien[i] + ' was appended to file!');
  }); 

 }

}

function studydatatofile(name, studie){

  const fs = require('node:fs');

  fs.writeFile('/Volumes/Web/Schach22/PGN/per_node/' + name + '.pgn', studie, (err) => {
  if (err) throw err;
  console.log(name + ' was filled with data!')});

}

function chapterdatatofile(chapter){

  const fs = require('node:fs');

  fs.writeFile('/Volumes/Web/Schach22/PGN/per_node/AlleKapitel.pgn', chapter, (err) => {
  if (err) throw err;
  console.log('AlleKapitel was filled with data!')});

}

function getstudydata() {

  const headers = { 'Authorization': 'Bearer ' + process.env.lichessToken, };

  if(studienliste.length > 0) {
    curstudy = JSON.parse(studienliste.pop());

    console.log(curstudy);

    fetch('https://lichess.org/api/study/' + curstudy.id + '.pgn', { headers })
    .then(res => res.text())
    .then(function(res) {      
      console.log(res);
      studydatatofile(curstudy.name, res);
      getstudydata()
    });

  } else {

  }


}

function getlichessUserchapters() {

	require('dotenv').config();

	const headers = { 'Authorization': 'Bearer ' + process.env.lichessToken, };

	fetch('https://lichess.org/study/by/GeorgK/export.pgn', { headers }) // https://lichess.org/study/by/{username}/export.pgn
    .then(res => res.text())
    .then(function(res) {
      //console.log(res);
      //kapitelliste = res.split('\n').filter(i => i);
      //console.log(studienliste);
      chapterdatatofile(res);
      //getstudydata(studienliste, studienliste.length);
    })
	;

}


//getlichessUserdata();
//getlichessUserdata2();
//getlichessUserstudies();
getlichessUserchapters();