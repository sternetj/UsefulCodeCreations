// ==UserScript==
// @name       Music Player
// @namespace  http://www.allaccess.com/top40-mainstream/cool-new-music
// @version    2.0
// @description  Allows you to control the player on allaccess.com. Also allows for continuous playing.
// @match      http://www.allaccess.com/*/cool-new-music
// @copyright  2012+, You
// ==/UserScript==
var css = '.flip-container { \
perspective: 1000; \
width: 50%; \
margin: 0 auto; \
padding-bottom: 5px; \
} \
.flip-container:hover .flipper, .flip-container.hover .flipper { \
transform: rotateY(180deg); \
} \
.flip-container, .front, .back { \
text-align:center; \
width: 142px; \
height: 48px; \
} \
.flipper { \
transition: 0.6s; \
transform-style: preserve-3d; \
position: relative; \
} \
.front, .back { \
backface-visibility: hidden; \
position: absolute; \
top: 0; \
left: 0; \
} \
.front { \
z-index: 2; \
/* for firefox 31 */ \
transform: rotateY(0deg); \
} \
.back { \
transform: rotateY(180deg); \
}';

document.addEventListener('DOMContentLoaded',
                          function () {
                              if (Notification && Notification.permission !== "granted"){
                                  Notification.requestPermission();
                              }
                          });

var notify = function(){
    if (Notification){
        if (Notification && Notification.permission !== "granted"){
            Notification.requestPermission();
        }else{
            var info = links[index].title.replace("Listen to '", "").split("' by ");
            var track = info[0];
            var artist = info[1];
            console.log(links[index].parentNode);
            console.log(links[index].parentNode.nextSibling.nextSibling);
            var image = links[index].parentNode.nextSibling.nextSibling.src;
            var nt = new Notification(track, {
                icon: image,
                body: 'by ' + artist,
            });

            nt.onclick = function () { nt.close();};
            setTimeout(function(){
                nt.close();
            },120000);
        }
    }
}

var head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

style.type = 'text/css';
if (style.styleSheet){
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}

head.appendChild(style);

// get all 'play' class links
var mainBlock = document.getElementById( 'mainBlock' );
var links = document.getElementsByClassName('play'); // get all links 

if (mainBlock != null){
    links = mainBlock.getElementsByClassName('play'); // get all links
}

var dislikes = [];
if(typeof(Storage) !== "undefined") {
    if (!localStorage.dislikeList) {
        localStorage.setItem("dislikeList", "");
    }
    dislikes = localStorage.dislikeList.split(',');
}

var nonDups = [];
for (var i = 0; i < links.length; i++) {
    for (var j = 0; j < links.length; j++) {
        if ((links[i].title == links[j].title && i == j) && dislikes.indexOf(links[i].title) == -1){
            nonDups.push(links[i]);
            break;
        }
    }
}

links = nonDups;

// create click event
var theEvent = document.createEvent("MouseEvent");
theEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

//get first index
var items = makeItemArray();
var index = getRandom();

//click the first link
links[index].dispatchEvent(theEvent);
notify();

console.log(links[index]);

//check in on what the player is doing in 10 seconds
setTimeout(musicplayer1, 10000);

var elemDiv = document.createElement('div');
elemDiv.style.cssText = 'position:fixed;top:5px;right:5px;width:145px;height:90px;z-index:10000;background:#eb295c;';
elemDiv.style.cssText += 'text-align:center;vertical-align: middle;border-radius:8px;';
document.body.appendChild(elemDiv);

var frontDiv = document.createElement('div');
frontDiv.className += ' front';
frontDiv.style.cssTxt = "cursor: hand";
var para = document.createElement("p");
para.style.cssText = 'padding-top:10px;padding-bottom:10px;font-weight:bold;font-family:Arial,Helvetica,sans-serif;-webkit-transform: translateY(5px);';
para.style.cssText += 'color:#FFF;font-size: 16px;';

var song_string = document.createTextNode('Song: 1 of ' + links.length);

para.appendChild(song_string);
frontDiv.appendChild(para);

//Dislike
var backDiv = document.createElement('div');
backDiv.className += ' back';
backDiv.style.cssTxt = "cursor: hand";
var dislike = document.createElement("a");
dislike.style.cssText = '-webkit-filter: invert(100%);cursor: pointer;';
dislike.innerHTML = '<img src="http://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Thumbs_down_font_awesome.svg/512px-Thumbs_down_font_awesome.svg.png" alt="Dislike" width="32" height="32">';
dislike.addEventListener('click',doDislike,false);
backDiv.appendChild(dislike);

var containDiv = document.createElement('div');
containDiv.className += ' flip-container';
containDiv.ontouchstart = "this.classList.toggle('hover');";
var flipperDiv = document.createElement('div');
flipperDiv.className += ' flipper';
flipperDiv.appendChild(frontDiv);
flipperDiv.appendChild(backDiv);
containDiv.appendChild(flipperDiv);
elemDiv.appendChild(containDiv);



var linkStyle = 'padding-top:10px;cursor: pointer; cursor: hand;font-size: 20px;-webkit-filter: invert(100%);';
//Back Arrow
var back = document.createElement("a");
back.style.cssText = linkStyle + 'padding-right:-5px;';
back.innerHTML = '<img src="http://www.flaticon.com/png/256/25641.png" alt="Prev" width="44" height="30">';
back.addEventListener('click',doPlayPrevious,false);
elemDiv.appendChild(back);

//Play\Pause
var play_pause = document.createElement("a");
play_pause.style.cssText = linkStyle + 'padding-right:-5px;';
play_pause.innerHTML = '<img src="http://www.flaticon.com/png/256/25696.png" alt="Pause" width="44" height="30">';
play_pause.addEventListener('click',doPlayPause,false);
elemDiv.appendChild(play_pause);

//Next
var next = document.createElement("a");
next.style.cssText = linkStyle;
next.innerHTML = '<img src="http://www.flaticon.com/png/256/25309.png" alt="Prev" width="44" height="30">';
next.addEventListener('click',doOverride,false);
elemDiv.appendChild(next);

var override = false;
var played = [];
var toPlay = [];
var olderIndex = -1;
var durationSet = false;

played.push(index);


function musicplayer1()
{
    var playing = player.isPlaying();
    var paused = player.isPaused();
    //alert(player.getPlaylist()[0]['fullDuration']);

    if (override){
        playing = false;
        paused = false;
        override = false;
    }
    if (playing){

        //Change image to pause button
        play_pause.innerHTML = '<img src="http://www.flaticon.com/png/256/25696.png" alt="Pause" width="30" height="30">';

        if (durationSet){
            setTimeout(musicplayer1, 10000);
        }
        else{
            try {
                var delay = parseFloat(player.getClip()['fullDuration']) * 1000;
                delay = delay - 10000;
                setTimeout(musicplayer1, delay);
                durationSet = true;
            }
            catch(err) {
                durationSet = false;
            }

        }
    }
    else if (paused){
        //Change image to play button
        play_pause.innerHTML = '<img src="http://www.flaticon.com/png/256/25226.png" alt="Play" width="30" height="30">';
        setTimeout(musicplayer1, 10000);
    }
    else{
        olderIndex = index; // Set the last played song to allow for repeating songs

        //Check for songs to be played and play them first if they exist
        if (toPlay.length > 0){
            index = toPlay.pop();
        }else{
            index = getRandom();
        }

        //Add the index to the played list
        played.push(index);

        //Update the song string to reflect current track number
        song_string.nodeValue = 'Song: ' + (links.length - items.length + Math.max(-1*toPlay.length, 0)) + ' of ' + links.length;

        //Click on the new song to have it start playing
        links[index].dispatchEvent(theEvent);

        notify();

        durationSet = false;

        setTimeout(musicplayer1, 10000);
    }
}

function makeItemArray(){
    var itemArray = [];
    for (var i = 0; i < links.length; i++) { 
        itemArray.push(i);
    }
    return itemArray;
}

//Gets random from index array, removes it, and returns index
function getRandom(){
    if (items.length == 0){
        var nonDups = [];
        for (var i = 0; i < links.length; i++) {
            for (var j = 0; j < links.length; j++) {
                if ((links[i].title == links[j].title && i == j) && dislikes.indexOf(links[i].title) == -1){
                    nonDups.push(links[i]);
                    break;
                }
            }
        }
        links = nonDups;
        items = makeItemArray();
    }
    var i = Math.floor(Math.random()*items.length);
    var item = items[i];
    items.splice(i, 1);

    return item;  
}

function doOverride(){
    override = true;
    musicplayer1();
}

function doDislike(){
    if(typeof(Storage) !== "undefined") {
        if (!localStorage.dislikeList) {
            localStorage.setItem("dislikeList", "");
        }
        dislikes = localStorage.dislikeList.split(',');
        console.log(dislikes);

        dislikes += ((dislikes == "") ? '' : ',') + links[index].title.replace(new RegExp(',', 'g'), '');
        console.log(dislikes);
        localStorage.setItem("dislikeList", dislikes);
    }

    doOverride();
}

if(typeof(Storage) !== "undefined") {
    if (!localStorage.dislikeList) {
        localStorage.setItem("dislikeList", "");
    }
    dislikes = localStorage.dislikeList.split(',');
}

function doPlayPause(){
    var playing = player.isPlaying();

    if (playing){
        player.pause();
        play_pause.innerHTML = '<img src="http://www.flaticon.com/png/256/25226.png" alt="Play" width="30" height="30">';
    }
    else {
        player.play();
        play_pause.innerHTML = '<img src="http://www.flaticon.com/png/256/25696.png" alt="Pause" width="30" height="30">';
    }
    musicplayer1();
}

function doPlayPrevious(){
    if (played.length > 0){
        override = true;
        var tempIndex = played.pop();
        toPlay.push(tempIndex);
        if (index == tempIndex && olderIndex == tempIndex && played.length > 0){
            toPlay.push(played.pop());
        }
        musicplayer1();
    }
}

window.onkeydown = function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code === 32) { //space bar
        doPlayPause();
    } else if (code === 190) { //> key
        doOverride();
    } else if (code === 188) { //< key
        doPlayPrevious();
    }
};
