// ==UserScript==
// @name       Music Player
// @namespace  http://www.allaccess.com/top40-mainstream/cool-new-music
// @version    0.1
// @description  enter something useful
// @match      http://www.allaccess.com/top40-mainstream/cool-new-music
// @copyright  2012+, You
// ==/UserScript==


// get all 'play' class links
var links = document.getElementsByClassName('play'); // get all links

// create click event
var theEvent = document.createEvent("MouseEvent");
theEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

// click the first link

var index = getRandom(0, links.length);
//alert(index);
links[index].dispatchEvent(theEvent);
//links.remove(index);
//links[links.length - 24].dispatchEvent(theEvent);

//alert(player.isPlaying());

setTimeout(musicplayer1, 10000);


function musicplayer1()
{
    //setTimeout(function() { alert('hello');}, 3000); //defer the execution of anonymous function for 3 seconds and go to next line of code.
    //alert(player);
    var playing = player.isPlaying()
    var paused = player.isPaused()
    if (playing){
        //alert("PLAYING: waiting for end of song");
        setTimeout(musicplayer1, 10000);
    }
    else if (paused){
        //alert("PAUSED: waiting for no music queued");
        setTimeout(musicplayer1, 10000);
    }
    else{
        //alert("next song!");
        var index = getRandom(0, links.length);
        //var index = 15;
        links[index].dispatchEvent(theEvent);
        //links.splice(index, 1);
        
       	setTimeout(musicplayer1, 10000);
    }
}

function getRandom(minimum, maximum){
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;   
}
