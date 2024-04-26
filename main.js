import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

var redirect_uri = "https://github.com/git-Angel06/Smiles.git";

var client_id = "7c775fb3a5b04fe388364f9aafb354e2";
var client_secret = "e56ba040c5c24509b13880a960c85ca3";

const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const clientId = "7c775fb3a5b04fe388364f9aafb354e2";
const clientSecret = "e56ba040c5c24509b13880a960c85ca3";
app.get('/callback', async (req, res) => {
    const code = req.query.code;
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    
  res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
    response_type: 'code', client_id: clientId, scope: scope, redirect_uri: redirectUri, state: state
  }));
});
    const data = {
        grant_type: 'authorization_code', code: code, redirect_uri: redirect_uri, client_id: clientId, client_secret: clientSecret};
        try { const response = await axios.post(tokenUrl, data);
        const accessToken = response.data.access_token;

        res.send('access token:' + accessToken);
}  
catch (error) { res.status(500).send('Error exchanging authorization code for access token');
};

app.listen(port, () => {
    console.log('server is running on https://localhost:${port}');
})


const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
var access_token = null;
var refresh_token = null;

function onPageLoad(){
    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");
    handleRedirect();
        access_token = localStorage.getItem("access_token");
        if ( access_token == null ){
            // we don't have an access token so present token section
            document.getElementById("tokenSection").style.display = 'block';  
       
        }
    }
function handleRedirect(){
    let code = getCode();
    fetchAccessToken(code);
    window.history.pushState("", "", redirect_uri);
}
function handleApiResponse(){
    if ( this.status == 200){
        console.log(this.responseText);
        setTimeout(currentlyPlaying, 2000);
    }
    else if ( this.status == 204 ){
        setTimeout(currentlyPlaying, 2000);
    }
    else if ( this.status == 401 ){
        refreshAccessToken();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }    
}
function getCode(){
    let code = null;
    const queryString = window.location.search;
    if(queryString.length > 0 ){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
    }
    return code;
}

function requestAuthorization(){
    client_id = document.getElementById("clientId").value;
    client_secret = document.getElementById("clientSecret").value;
    localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret);

    let url = AUTHORIZE;
    url += "?client_id" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url +="&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read user-read-playback-state user-read-recently-played playlist-read-private playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-pub ";
    window.location.href = url;
}
function fetchAccessToken( code ){
    let body = "grant_type=authorization_code";
    body += "&code=" + code; 
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationApi(body);
}

function refreshAccessToken(){
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
}


function segwayTimer() {
  setTimeout(function(){
    $('#segway').hide();
    $("#sliderPage").show();
  }, 2000);
}

$(document).ready(function() {
  // THIS WILL GRAB SLIDER VALUE AND WILL CONVERT TO SPOTIFY DECIMAL FORMAT
  var slider = document.getElementById("How i'm feeling");
  var output = document.getElementById("mood slider");
  // output.innerHTML = slider.value;
  let spotifyValance = 0;
  slider.oninput = function() {
    output.innerHTML = this.value;
    const sliderValue = output.innerHTML;
    spotifyValance = (parseInt(sliderValue)) / 100;
    console.log(sliderValue);
    console.log("depressed => 10")
    console.log("10< sad => 20")
    console.log("20< wtv => 30")
    console.log("30< melancholy => 40")
    console.log("40< chilin => 50")
    console.log("50< Alright => 60")
    console.log("60< Feeling good => 70")
    console.log("70< Happy! => 80")
    console.log("80< REALLY Happy!!! > 90")
    console.log("90< ESTATIC => 100")
    console.log(spotifyValance);
    if (sliderValue < 10) {
      output.innerHTML = '"depressed"';
      $('#depressed').show();
    } else if(sliderValue < 20) {
      $('#sad').hide();
      output.innerHTML = '"sad"';
    } else if(sliderValue < 30) {
      output.innerHTML = '"wtv"';
    } else if(sliderValue < 40) {
      output.innerHTML = '"melancholy"';
    } else if(sliderValue < 50) {
      output.innerHTML = "chillin";
    } else if(sliderValue < 60) {
      output.innerHTML = "Alright";
    } else if(sliderValue < 70) {
      output.innerHTML = "Feeling Good!";
    } else if (sliderValue < 80) {
      output.innerHTML = "¡Happy!";
    } else if (sliderValue < 90) {
      output.innerHTML = "Probably Annoying You With MY POSITIVITY!!";
      $('#rainbows').hide();
    } else {
      output.innerHTML = "ESTATIC";
      $('#rainbows').show();
    }
  }

  if (window.location.hash.length > 10) {
    $('#log-in').hide();
    $('#genreBoxes').show();
  }

  $("#apiButton").on("click",function(){
    $('#sliderPage').hide();
    $('#results').show();
    console.log(window.location)
    var uriHash= window.location.hash //holds the access token
    var accessToken = uriHash.replace('#access_token=', '')
    // console.log(spotifyValance);
    // console.log(genre);
    var apiURL= `https://api.spotify.com/v1/recommendations?limit=12&market=US&seed_genres=${genre}&target_valence=${spotifyValance}`
    $.ajax({
      url: apiURL,
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      success: function(response){
        console.log(response);
        $("#h5-1").append("<h5>1 - "+response.tracks[0].name+" by "+response.tracks[0].album.artists[0].name+",<br>"+ "on the album " +response.tracks[0].album.name+"</h5>")
        $("#h5-2").append("<h5>2 - "+response.tracks[1].name+" by "+response.tracks[1].album.artists[0].name+",<br>"+ " on the album " +response.tracks[1].album.name+"</h5>")
        $("#h5-3").append("<h5>3 - "+response.tracks[2].name+" by "+response.tracks[2].album.artists[0].name+",<br>"+ " on the album " +response.tracks[2].album.name+"</h5>")
        $("#h5-4").append("<h5>4 - "+response.tracks[3].name+" by "+response.tracks[3].album.artists[0].name+",<br>"+ " on the album " +response.tracks[3].album.name+"</h5>")
        $("#h5-5").append("<h5>5 - "+response.tracks[4].name+" by "+response.tracks[4].album.artists[0].name+",<br>"+ " on the album " +response.tracks[4].album.name+"</h5>")
        $("#h5-6").append("<h5>6 - "+response.tracks[5].name+" by "+response.tracks[5].album.artists[0].name+",<br>"+ " on the album " +response.tracks[5].album.name+"</h5>")
        $("#h5-7").append("<h5>7 - "+response.tracks[6].name+" by "+response.tracks[6].album.artists[0].name+",<br>"+ " on the album " +response.tracks[6].album.name+"</h5>")
        $("#h5-8").append("<h5>8 - "+response.tracks[7].name+" by "+response.tracks[7].album.artists[0].name+",<br>"+ " on the album " +response.tracks[7].album.name+"</h5>")
        $("#h5-9").append("<h5>9 - "+response.tracks[8].name+" by "+response.tracks[8].album.artists[0].name+",<br>"+ " on the album " +response.tracks[8].album.name+"</h5>")
        $("#h5-10").append("<h5>10 - "+response.tracks[9].name+" by "+response.tracks[9].album.artists[0].name+",<br>"+ " on the album " +response.tracks[9].album.name+"</h5>")
        $("#h5-11").append("<h5>11 - "+response.tracks[10].name+" by "+response.tracks[10].album.artists[0].name+",<br>"+ " on the album " +response.tracks[10].album.name+"</h5>")
        $("#h5-12").append("<h5>12 - "+response.tracks[11].name+" by "+response.tracks[11].album.artists[0].name+",<br>"+ " on the album " +response.tracks[11].album.name+"</h5>")
        $("#img-1").attr("src", response.tracks[0].album.images[1].url);
        $("#img-2").attr("src", response.tracks[11].album.images[1].url);

      },
      error: function(r){
        console.log(r);
      }
    })
  })

  let genre = "";
  $("#rock").on("click", function(){
    $('#insertGenre').html('Rock').val();
    $('#genreBoxes').hide();
    $('#segway').show();
    segwayTimer();
    genre = "rock%2Crock-n-roll%2Calt-rock%2Cpsych-rock";
  });
  $("#hip-hop").on("click", function(){
    $('#insertGenre').html('Hip-Hop').val();
    $('#genreBoxes').hide();
    $('#segway').show();
    segwayTimer();
    genre = "hip-hop%2Ctrip-hop%2Cr-n-b";
  });
  $("#electronic").on("click", function(){
    $('#insertGenre').html('Electronic').val();
    $('#genreBoxes').hide();
    $('#segway').show();
    segwayTimer();
    genre = "electronic%2Cedm%2Cpost-dubstep%2Ctechno";
  });
  $("#country").on("click", function(){
    $('#insertGenre').html('Country').val();
    $('#genreBoxes').hide();
    $('#segway').show();
    segwayTimer();
    genre = "country%2Cfolk";
  });
  $("#indie").on("click", function(){
    $('#insertGenre').html('Indie').val();
    $('#genreBoxes').hide();
    $('#segway').show();
    segwayTimer();
    genre = "indie%2Cindie-pop";
  });
  $("#metal").on("click", function(){
    $('#insertGenre').html('Metal').val();
    $('#genreBoxes').hide();
    $('#segway').show();
    segwayTimer();
    genre = "metal%2Cmetal-misc%2Ckids%2Cemo";
  });
  $("#world").on("click", function(){
    $('#insertGenre').html('World').val();
    $('#genreBoxes').hide();
    $('#segway').show();
    segwayTimer();
    genre = "world-music%2Cturkish%2Cfrench%2Cbrazil"
  });
  $("#soundtracks").on("click", function(){
    $('#insertGenre').html('Soundtracks').val();
    $('#genreBoxes').hide();
    $('#segway').show();
    segwayTimer();
    genre = "soundtracks%2Cshow-tunes%2Cdisney";
  });
  $("#wildcard").on("click", function(){
    $('#insertGenre').html('Wildcard').val();
    $('#genreBoxes').hide();
    $('#segway').show();
    segwayTimer();
    genre = "opera%2Cromance%2Csleep%2Ccomedy";
  })
})

