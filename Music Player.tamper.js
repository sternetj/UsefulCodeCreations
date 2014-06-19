// ==UserScript==
// @name       Music Player
// @namespace  http://www.allaccess.com/top40-mainstream/cool-new-music
// @version    2.0
// @description  Allows you to control the player on allaccess.com. Also allows for continuous playing.
// @match      http://www.allaccess.com/*/cool-new-music
// @copyright  2012+, You
// ==/UserScript==

// get all 'play' class links
var links = document.getElementsByClassName('play'); // get all links

// create click event
var theEvent = document.createEvent("MouseEvent");
theEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

//get first index
var items = makeItemArray();
var index = getRandom();

//click the first link
links[index].dispatchEvent(theEvent);

//check in on what the player is doing in 10 seconds
setTimeout(musicplayer1, 10000);

var elemDiv = document.createElement('div');
elemDiv.style.cssText = 'position:fixed;top:5px;right:5px;width:145px;height:80px;z-index:10000;background:#eb295c;';
elemDiv.style.cssText += 'text-align:center;vertical-align: middle;border-radius:8px;';
document.body.appendChild(elemDiv);

var para = document.createElement("p");
para.style.cssText = 'padding-top:10px;padding-bottom:10px;font-weight:bold;font-family:Arial,Helvetica,sans-serif;';
para.style.cssText += 'color:#FFF;font-size: 16px;';

var song_string = document.createTextNode('Song: 1 of ' + links.length);

para.appendChild(song_string);
elemDiv.appendChild(para);

var linkStyle = 'padding-top:10px;padding-right:-5px;cursor: pointer; cursor: hand;font-size: 20px;';

//Back Arrow
var back = document.createElement("a");
back.style.cssText = linkStyle + '-webkit-filter: invert(100%);';
back.innerHTML = '<img src="http://www.flaticon.com/png/256/25641.png" alt="Prev" width="44" height="30">';
back.addEventListener('click',doPlayPrevious,false);
elemDiv.appendChild(back);

//Play\Pause
var play_pause = document.createElement("a");
play_pause.style.cssText = linkStyle + '-webkit-filter: invert(100%);';
play_pause.innerHTML = '<img src="http://www.flaticon.com/png/256/25696.png" alt="Pause" width="44" height="30">';
play_pause.addEventListener('click',doPlayPause,false);
elemDiv.appendChild(play_pause);

//Next
var next = document.createElement("a");
next.style.cssText = linkStyle + '-webkit-filter: invert(100%);';
next.innerHTML = '<img src="http://www.flaticon.com/png/256/25309.png" alt="Prev" width="44" height="30">';
next.addEventListener('click',doOverride,false);
elemDiv.appendChild(next);

var override = false;
var played = [];
var toPlay = [];
var olderIndex = -1;

played.push(index);


function musicplayer1()
{
    var playing = player.isPlaying();
    var paused = player.isPaused();
    
    if (override){
        playing = false;
        paused = false;
        override = false;
    }
    if (playing){
        //Change image to pause button
        play_pause.innerHTML = '<img src="http://www.flaticon.com/png/256/25696.png" alt="Pause" width="30" height="30">';
        setTimeout(musicplayer1, 10000);
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
        
        //Click on the new son to have it start playing
        links[index].dispatchEvent(theEvent);
        
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
     	//alert("All songs have been played!")
        items = makeItemArray();
    }
    var i = Math.floor(Math.random()*items.length)
    var item = items[i]
    items.splice(i, 1);

    return item;  
}

function doOverride(){
    override = true;
    musicplayer1();
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
