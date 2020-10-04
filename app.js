var appEl = document.getElementById("app");
var initEl = document.getElementById("init");
var timer;

var field = [];
var nrow;
var ncolumn;
var period;

function init()
{
	nrow = document.getElementById("nrow").value;
	ncolumn = document.getElementById("ncolumn").value;
	period = document.getElementById("period").value;
	var submit = true;

	if (isNaN(nrow) || nrow < 1)
	{
		console.log("Количество строк должно быть от 1");
		submit = false;
	}

	if (isNaN(ncolumn) || ncolumn < 1)
	{
		console.log("Количество столбцов должно быть от 1");
		submit = false;
	}

	if (isNaN(period) || period < 1)
	{
		console.log("Период должно быть от 1 сек");
		submit = false;
	}
	
	return submit;
}

function drawField(field, htmlElement) 
{
	const cellIterator = (cell, columnIndex) => 
	{
		if (cell == 1)
		{
			return `<td style="background-color:#FA58D0; height:10px; width:10px;"></td>`;
		}
		return `<td style="background-color:#FFFFFF; height:10px; width:10px;"></td>`;
	};
	const rowIterator = (row, rowIndex) => { return `<tr>${row.map(cellIterator).join("")}</tr>`; };

	var table = `<table border=1>${field.map(rowIterator).join("")}</table>`;
	htmlElement.innerHTML = table;
}

function initCell(row, column, field)
{
	var i = Math.random() * 10;
	if (i > 5)
	{
		field[row][column] = 1;
	}
	else
	{
		field[row][column] = 0;
	}
}

function getCellState(row, column, field)
{
	if (field[row] === undefined)
	{
		return 0;
	}
	
	if (field[row][column] === undefined)
	{
		return 0;
	}
	
	return field[row][column];
}

function getNumOfAliveNeighbours(row, column, field) 
{
	var neighbours = 0;

	for(var j = column - 1; j <= column + 1; j++)
	{
		neighbours += getCellState(row - 1, j, field);
	}

	for(var j = column - 1; j <= column + 1; j++)
	{
		neighbours += getCellState(row + 1, j, field);
	}

	neighbours += getCellState(row, column - 1, field);
	neighbours += getCellState(row, column + 1, field);

	return neighbours;
}

function getNewCellState(currentCellState, numOfAliveNeighbours)
{
	if (numOfAliveNeighbours == 3)
	{
		return 1;
	}
	
	if (numOfAliveNeighbours > 3 || numOfAliveNeighbours < 2)
	{
		return 0;
	}
	
	if (numOfAliveNeighbours == 2 && currentCellState == 1)
	{
		return 1;
	}
	
	return 0;
}

function isAnyoneAlive(field)
{
	for (var i = 0; i < nrow; i++)
	{
		for (var j = 0; j < ncolumn; j++)
		{
			if (field[i][j]) 
			{
				return true;
			}
		}
	}
	return false;
}

function getNewFieldState(field)
{
	return field.map((row, rowIndex) => 
		{
			return row.map((cell, cellIndex) =>
			{
				var aliveNeighbours = getNumOfAliveNeighbours(rowIndex, cellIndex, field);
				var currentState = getCellState(rowIndex, cellIndex, field);
				var newState = getNewCellState(currentState, aliveNeighbours);
				return newState;
			})
		});
}

function startGame()
{
	if (init() == false)
	{
		return;
	}

	console.log("nrow = " +  nrow);
	console.log("ncolumn = " + ncolumn);
	console.log("period = " + period + " in sec");

	field = new Array(nrow);
	for (var i = 0; i < nrow; i++)
	{
		field[i] = new Array(ncolumn);
		for (var j = 0; j < ncolumn; j++)
		{
			initCell(i, j, field);
		}
	}

	initEl.innerHTML = '';

	drawField(field, appEl);

	timer = setInterval(() => 
	{
		console.log("play!");
		field = getNewFieldState(field);
		drawField(field, appEl);
		if (isAnyoneAlive(field) == false) 
		{
			clearInterval(timer);
			console.log("Every body died!");
		}
	}, period * 1000);
} 
