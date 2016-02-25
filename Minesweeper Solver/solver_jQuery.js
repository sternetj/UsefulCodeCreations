var boardRows = 16,
	boardCols = 30,
	waitUntil = 2000;

function wait () {
	waitUntil = 10000000000000;
}
function go () {
	waitUntil = 2000;
}
(function() {

	var checker = (function () {
		var seq = 0;
		var lastSeq = 0;
		return {
			clickedBomb: function() {
				seq++;
			},
			bombWasClicked: function() {
				var tLastSeq = lastSeq;
				lastSeq = seq;
				return seq > tLastSeq;
			},
			reset: function() {
				seq=0;
				lastSeq = 0;
			}
		}
	})();

function getNeighborsByType (row, col) {
	var blankNeighbors = [],
		bombNeighbors = [],
		numberNeighbors = [];
	for (var subR = Math.max(row - 1,1); subR <= Math.min(row + 1, boardRows); subR++){
		for (var subC = Math.max(col - 1,1); subC <= Math.min(col + 1, boardCols); subC++){
			var subCell = $("#" + subR + "_" + subC);
			if(subCell.hasClass("bombflagged")){
				bombNeighbors.push(subCell);
			}else if(subCell.hasClass("blank")){
				blankNeighbors.push(subCell);
			}else if(!subCell.hasClass("open0") && !subCell.hasClass("ignored") && !(subR == row && subC == col)){
				numberNeighbors.push(subCell);
			}
		}
	}

	return {
		blank: blankNeighbors,
		bomb: bombNeighbors,
		cell: $("#" + row + "_" + col),
		numbers: numberNeighbors
	}
}

function doClicks (n, squareNum) {
	//setTimeout(function() {
		if ((n.blank.length + n.bomb.length) <= squareNum){
		    for(var i in n.blank){
		    	var bomb = n.blank[i];
		    	if(!bomb.hasClass("bombflagged")){
					bomb.trigger({type:'mousedown',button:2})
			    		.trigger({type:'mouseup', button:2});
			    		checker.clickedBomb();	
		    	}
			}
		} else if(n.bomb.length == squareNum){
			for(var i in n.blank){
				var bomb = n.blank[i];
				if(!bomb.hasClass("bombflagged")){
					$(document).trigger({type:'mouseup', button:1, target:(bomb[0])});
					checker.clickedBomb();
				}
			}
			n.cell.addClass("ignored");
		}
	//},0);
}

setInterval(function() {

if($(".bombdeath").length > 0){
	checker.reset();
	var val = parseInt($("#face").attr("waitBeforeNewGame"));
	if (!val) val = 0;
	if(val < waitUntil){
		$("#face").attr("waitBeforeNewGame", ++val);
		return;
	}
	$("#face").attr("waitBeforeNewGame", 0);
	// console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
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

var solveMines = function(open) {
	//setTimeout(function() {
		open.each(function (ii) {
				var c = $(this);
				var row = parseInt(c.attr('id').split("_")[0]);
				var col = parseInt(c.attr('id').split("_")[1]);
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

				doClicks(n, mineType);

		});
	//}, 0);
}

var before = $(".open1, .open2, .open3, .open4, .open5, .open6, .open7, .open8").not("ignored");
var partitions = 1;
var size = Math.floor(before.length / partitions);
if(size > 0){
	for(var t = 0; t <= before.length - size; t += size){
		solveMines(before.slice(t,t+size - 1));
	}
}

function checkPatterns() {
	var ones = $(".open1").not("ignored"),
		twos = $(".open2").not("ignored"),
		clicked = false;

	ones.each(function(ii){
		var c = $(this);
		var cellRow = parseInt(c.attr('id').split("_")[0]);
		var cellCol = parseInt(c.attr('id').split("_")[1]);
		var n = getNeighborsByType(cellRow, cellCol);

		if (n.bomb.length == 1) return;

		if(n.blank.length <= 3 && n.blank.length > 0){
			var index = 0,
				rowIndex = 0,
				colIndex = 0;
			var row = parseInt($(n.blank[index]).attr('id').split("_")[0]);
			var col = parseInt($(n.blank[index]).attr('id').split("_")[1]);
			while(index < n.blank.length && parseInt($(n.blank[index++]).attr('id').split("_")[0]) == row){rowIndex++;}
			index = 0;
			while(index < n.blank.length && parseInt($(n.blank[index++]).attr('id').split("_")[1]) == col){colIndex++;}

			//if either are true then blanks are in a line
			if (rowIndex == n.blank.length){
				//console.log("pattern candidate: ", this);
				for(var numIndex in n.numbers){
					var numRow = parseInt($(n.numbers[numIndex]).attr('id').split("_")[0]);
					var numCol = parseInt($(n.numbers[numIndex]).attr('id').split("_")[1]);
					var n2 = getNeighborsByType(numRow, numCol);
					if(numRow == cellRow
						&& twos.is($(n.numbers[numIndex]))
						&& (n2.bomb.length == 0
						&& n2.blank.length == 0
						&& n.bomb.length == 0)){
						var toClick = $("#" + row + "_" + (cellCol + (numCol > cellCol ? 2 : -2)));
						if (!toClick.hasClass("blank")){
							continue;
						}
							toClick
							.trigger({type:'mousedown',button:2})
			    			.trigger({type:'mouseup', button:2});
						checker.clickedBomb();
						clicked = true;
						console.log("found pattern R 1-2 at: ", n.cell[0]);
					}
					if(numRow == cellRow
						&& ones.is($(n.numbers[numIndex]))
						&& (n2.blank.length + n2.bomb.length <= 3)
						&& n.blank.length == 2){
						var toClick = $("#" + row + "_" + (cellCol + (numCol > cellCol ? 2 : -2)));
						if (!toClick.hasClass("blank")){
							continue;
						}
						$(document).trigger({
							type: 'mouseup',
							button: 1,
							target: toClick[0]
						});
						checker.clickedBomb();
						clicked = true;
						console.log("found pattern R 1-1 at: ", n.cell[0]);
					}
				}
			} else if(colIndex == n.blank.length){
				for(var numIndex in n.numbers){
					var numRow = parseInt($(n.numbers[numIndex]).attr('id').split("_")[0]);
					var numCol = parseInt($(n.numbers[numIndex]).attr('id').split("_")[1]);
					var n2 = getNeighborsByType(numRow, numCol);
					if(numCol == cellCol
						&& twos.is($(n.numbers[numIndex]))
						&& (n2.bomb.length == 0
						&& n2.blank.length == 0
						&& n.bomb.length == 0)){
						var toClick = $("#" + (cellRow + (numRow > cellRow ? 2 : -2)) + "_" + col);
						if (!toClick.hasClass("blank")){
							continue;
						}
							toClick
							.trigger({type:'mousedown',button:2})
			    			.trigger({type:'mouseup', button:2});
						checker.clickedBomb();
						clicked = true;
						console.log("found pattern C 1-2 at: ", n.cell[0]);
					}
					if(numCol == cellCol
						&& ones.is($(n.numbers[numIndex]))
						&& n2.blank.length + n2.bomb.length <= 3
						&& n.blank.length == 2){
						var toClick = $("#" + (cellRow + (numRow > cellRow ? 2 : -2)) + "_" + col);
						if (!toClick.hasClass("blank")){
							continue;
						}
						$(document).trigger({
							type: 'mouseup',
							button: 1,
							target: toClick[0]
						});
						checker.clickedBomb();
						clicked = true;
						console.log("found pattern C 1-1 at: ", n.cell[0]);
					}
				}
			}
		}
	});

	return clicked;
}

if(!checker.bombWasClicked() && !checkPatterns()){
	var unopened = $(".square.blank").not(".ignored,.open0");
	if (unopened.length <= 0) return;
	var indx = Math.floor(Math.random() * (unopened.length - 1));
	console.log("random guess", unopened[indx]);
	$(document).trigger({
		type:'mouseup',
		button:1,
		target:(unopened[indx])
	});
}

},0);

})();