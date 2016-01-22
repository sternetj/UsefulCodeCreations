setInterval(function() {
var boardRows = 16,
	boardCols = 30;

function getNeighborsByType (row, col) {
	var blankNeighbors = [];
	var bombNeighbors = []
	for (var subR = Math.max(row - 1,1); subR <= Math.min(row + 1, boardRows); subR++){
		for (var subC = Math.max(col - 1,1); subC <= Math.min(col + 1, boardCols); subC++){
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

if($(".bombdeath").length > 0){
	$(document).trigger({
			type:'mousedown',
			button:1,
			target:($("#face")[0])
		}).trigger({
			type:'mouseup',
			button:1,
			target:($("#face")[0])
		});
	return;
}

var clicked = false;
var mines = {'1':[],'2':[],'3':[],'4':[],'5':[],'6':[],'7':[],'8':[]};
$(".open1, .open2, .open3, .open4, .open5, .open6, .open7, .open8")
	.each(function (ii) {
		var c = $(this);
		var row = c.attr('id').split("_")[0];
		var col = c.attr('id').split("_")[1];
		//console.log(c);
// for(var row = 1; row <= boardRows; row++){
// 	for(var col = 1; col <= boardCols; col++){
		var c = $("#" + row + "_" + col);
		var n = getNeighborsByType(row, col);
		var mineType = 1;
		if(c.hasClass("open1")){
			mineType = 1;
		}else if(c.hasClass("open2")){
			mineType = 2;
		}else if(c.hasClass("open3")){
			mineType = 3;
		}else if(c.hasClass("open4")){
			mineType = 4;
		}else if(c.hasClass("open5")){
			mineType = 5;
		}else if(c.hasClass("open6")){
			mineType = 6;
		}else if(c.hasClass("open7")){
			mineType = 7;
		}else if(c.hasClass("open8")){
			mineType = 8;
		}else {
			return;
		}

		clicked = clicked || doClicks(n, mineType);
		mines[mineType] = mines[mineType].concat(n.blank);
// 	}
// }

});

if(!clicked){
	var unopened = $(".blank");

	for (var i = 1; i <= 8; i++) {
		unopened = unopened.not(mines[i]);
	}

	var indx = Math.floor(Math.random() * (unopened.length - 1));
	//console.log(unopened[indx]);
	$(document).trigger({
		type:'mouseup',
		button:1,
		target:(unopened[indx])
	});
}

},1);