var tableSize = 10;
var generation = 1;
var run = false;

function initializeGrid() {
	var gameDispElem = document.getElementById('main_grid');
	var table = getTable();
	gameDispElem.appendChild(table);
	updateCount(0);
}
function changTable(selectElem) {
	if (run) {
		reset();
	}

	var num = parseInt(selectElem.value);
	tableSize = num;
	cleanGameElem();
	var table = getTable();
	var gameDispElem = document.getElementById('main_grid');
	gameDispElem.appendChild(table);
	updateCount(0);
}

function cleanGameElem() {
	var gameDispElem = document.getElementById('main_grid');
	while (gameDispElem.hasChildNodes()) {
		gameDispElem.removeChild(gameDispElem.lastChild);
	}
}

function start() {
	if (!run) {
		run = true;
		step(1);
		setTimeout(tick, 1000);
	}
}

function stop() {
	run = false;
}

function tick() {
	if (run) {
		step(1);
		setTimeout(tick, 1000);
	}
}

function getTdElem(name) {
	var tdElem = document.createElement('td');
	tdElem.setAttribute('id', name);
	tdElem.setAttribute('onclick', 'changeState(this)')
	tdElem.style.height = (500 / tableSize) + 'px';
	tdElem.style.width = (500 / tableSize) + 'px';
	return tdElem;
}

function getTrElem(name) {
	var trElem = document.createElement('tr');
	trElem.setAttribute('id', name);
	return trElem;
}

function getTable() {
	var table = document.createElement('table');
	table.setAttribute('id', 'game_table');
	for (var i = 0; i < tableSize; i++) {
		var rowName = 'tr_' + i;
		var tr = getTrElem(rowName);
		for (var j = 0; j < tableSize; j++) {
			var tdName = 'td_' + i + '_' + j;
			var td = getTdElem(tdName);
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	return table;
}

function changeState(td) {
	var background = td.style.background;
	if (background === 'black') {
		td.style.background = '#DCDCDC';
	} else {
		td.style.background = 'black';
	}
	updateCount(calculatePopulation(document.getElementsByTagName('td')));
}

function step(skipCount) {
	var currentState = new Array(tableSize);
	for (var i = 0; i < tableSize; i++) {
		currentState[i] = new Array(tableSize);
		for (var j = 0; j < tableSize; j++) {
			currentState[i][j] = 0;
		}
	}

	var tdList = document.getElementsByTagName('td');
	for (var i = 0; i < tdList.length; i++) {
		var td = tdList[i];
		var id = td.getAttribute('id');
		var idSplit = id.split('_');
		var row = parseInt(idSplit[1]);
		var col = parseInt(idSplit[2]);

		var background = td.style.background;
		if (background === 'black') {
			currentState[row][col] = 1;
		}
	}

	for (var i = 0; i < tdList.length; i++) {
		var td = tdList[i];
		var id = td.getAttribute('id');
		var idSplit = id.split('_');
		var row = parseInt(idSplit[1]);
		var col = parseInt(idSplit[2]);

		var neighborCount = evaluateNeighbours(row, col, currentState);
		var background = td.style.background;
		if (background == 'black' && neighborCount < 2) {
			 td.style.background = '#DCDCDC';
		} else if (background == 'black' && neighborCount > 3) {
			 td.style.background = '#DCDCDC';
		} else if (background != 'black' && neighborCount == 3) {
			td.style.background = 'black';
		}
	}

	generation++;
	skipCount--;
	if (skipCount > 0) {
		step(skipCount);
	} else {
		var numLive = calculatePopulation(tdList);
		if (numLive == 0 & run)
			run = false;
		updateCount(numLive);
	}
}

function randomPopulation() {
	var randPop = Math.random() * (tableSize * tableSize);
	reset();
	for (var i = 0; i < randPop; i++) {
		var x = Math.floor(Math.random() * tableSize);
		var y = Math.floor(Math.random() * tableSize);

		var tdElem = document.getElementById('td_' + x + '_' + y);
		var background = tdElem.style.background;
		if (background === 'black') {
			i--;
		} else {
			tdElem.style.background = 'black';
		}
	}
	updateCount(calculatePopulation(document.getElementsByTagName('td')));
}

function reset() {
	run = false;
	var tdList = document.getElementsByTagName('td');
	for (var i = 0; i < tdList.length; i++) {
		var td = tdList[i];
		td.style.background = '#DCDCDC';
	}
	generation = 1;
	updateCount(0);
}

function calculatePopulation(tdList) {
	var liveCount = 0;
	for (var i = 0; i < tdList.length; i++) {
		var td = tdList[i];
		var background = td.style.background;
		if (background === 'black')
			liveCount++;
	}
	return liveCount;
}

function updateCount(count) {
	var pop = document.getElementById('count_h');
	pop.innerHTML = "Population: " + count;

	var gen = document.getElementById('generation_h');
	gen.innerHTML = "Generation: " + generation;
}

function evaluateNeighbours(row, col, currentState) {
	var count = 0;
	count += evaluateTopLeft(row, col, currentState);
	count += evaluateTop(row, col, currentState);
	count += evaluateTopRight(row, col, currentState);
	count += evaluateSideRight(row, col, currentState);
	count += evaluateBottomRight(row, col, currentState);
	count += evaluateBottom(row, col, currentState);
	count += evaluateBottomLeft(row, col, currentState);
	count += evaluateSideLeft(row, col, currentState);
	return count;
}

function evaluateTopLeft(row, col, currentState) {
	if (row - 1 > -1) {
		if (col - 1 > -1) {
			return currentState[row - 1][col - 1];
		}
	}
	return 0;
}
function evaluateTop(row, col, currentState) {
	if (row - 1 > -1) {
		return currentState[row - 1][col];
	}
	return 0;
}
function evaluateTopRight(row, col, currentState) {
	if (row - 1 > -1) {
		if (col + 1 < tableSize) {
			return currentState[row - 1][col + 1];
		}
	}
	return 0;
}
function evaluateSideRight(row, col, currentState) {
	if (col + 1 < tableSize) {
		return currentState[row][col + 1];
	}
	return 0;
}
function evaluateBottomRight(row, col, currentState) {
	if (row + 1 < tableSize) {
		if (col + 1 < tableSize) {
			return currentState[row + 1][col + 1];
		}
	}
	return 0;
}
function evaluateBottom(row, col, currentState) {
	if (row + 1 < tableSize) {
		return currentState[row + 1][col];
	}
	return 0;
}
function evaluateBottomLeft(row, col, currentState) {
	if (row + 1 < tableSize) {
		if (col - 1 > -1) {
			return currentState[row + 1][col - 1];
		}
	}
	return 0;
}
function evaluateSideLeft(row, col, currentState) {
	if (col - 1 > -1) {
		return currentState[row][col - 1];
	}
	return 0;
}
