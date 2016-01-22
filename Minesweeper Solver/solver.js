setInterval(function() {

function getNeighborsByType (row, col) {
	var blankNeighbors = [];
	var bombNeighbors = []
	for (var subR = Math.max(row - 1,1); subR <= Math.min(row + 1, 16); subR++){
		for (var subC = Math.max(col - 1,1); subC <= Math.min(col + 1, 30); subC++){
			var subCell = $("#" + subR + "_" + subC);
			if(subCell.hasClass("bombflagged")){
				bombNeighbors.push(subCell);
			}else if(subCell.hasClass("blank")){
				blankNeighbors.push(subCell);
			}
		}
	}

	return {
		blank: blankNeighbors,
		bomb: bombNeighbors
	}
}

function doClicks (n, squareNum) {
	var clicked = false;
	if ((n.blank.length + n.bomb.length) <= squareNum){
	    for(var i in n.blank){
			n.blank[i].trigger({type:'mousedown',button:2})
	    		.trigger({type:'mouseup', button:2});
	    		clicked = true;
		}
	}else if(n.bomb.length == squareNum){
		for(var i in n.blank){
			$(document).trigger({type:'mouseup', button:1, target:(n.blank[i][0])});
			clicked = true;
		}
	}
	return clicked;
}

var clicked = false;
var mines = {'1':[],'2':[],'3':[],'4':[],'5':[],'6':[],'7':[],'8':[]};
$(".open1, .open2, .open3, .open4, .open5, .open6, .open7, .open8")
	.each(function (ii) {
		var c = $(this);
		var row = c.attr('id').split("_")[0];
		var col = c.attr('id').split("_")[1];
		console.log(row + "_" + col);
// for(var row = 1; row <= 16; row++){
// 	for(var col = 1; col <= 30; col++){
// 		var c = $("#" + row + "_" + col);
		var n = getNeighborsByType(row, col);
		if(c.hasClass("open1")){
			clicked = clicked || doClicks(n, 1);
			mines[1].concat(n.blank);
		}else if(c.hasClass("open2")){
			clicked = clicked || doClicks(n, 2);
			mines[2].concat(n.blank);
		}else if(c.hasClass("open3")){
			clicked = clicked || doClicks(n, 3);
			mines[3].concat(n.blank);
		}else if(c.hasClass("open4")){
			clicked = clicked || doClicks(n, 4);
			mines[4].concat(n.blank);
		}else if(c.hasClass("open5")){
			clicked = clicked || doClicks(n, 5);
			mines[5].concat(n.blank);
		}else if(c.hasClass("open6")){
			clicked = clicked || doClicks(n, 6);
			mines[6].concat(n.blank);
		}else if(c.hasClass("open7")){
			clicked = clicked || doClicks(n, 7);
			mines[7].concat(n.blank);
		}else if(c.hasClass("open8")){
			clicked = clicked || doClicks(n, 8);
			mines[8].concat(n.blank);
		}
// 	}
// }

});;

if(!clicked){
	console.log("stuck");
	console.log(mines);
	for (var i = 1; i <= 8; i++) {
		if(mines[i].length > 0){
			console.log("click a: " + i);
			var indx = Math.floor(Math.random() * (mines[i].length - 1)) + 1;
			$(document).trigger({type:'mouseup', button:1, target:(mines[i][indx])});
			i = 9;
		}
	}
}

},50);