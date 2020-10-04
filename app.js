var appEl = document.getElementById("app");
var initEl = document.getElementById("init");
var timer;

let field = [];
let nrow;
let ncolumn;
let period;

function Init()
{
	nrow = document.getElementById("nrow").value;
	ncolumn = document.getElementById("ncolumn").value;
	period = document.getElementById("period").value;
	submit = "true";

	if (isNaN(nrow) || nrow < 1)
	{
		console.log("Количество строк должно быть от 1");
		submit = "false";
	}

	if (isNaN(ncolumn) || ncolumn < 1)
	{
		console.log("Количество столбцов должно быть от 1");
		submit = "false";
	}

	if (isNaN(period) || period < 1)
	{
		console.log("Период должно быть от 1 сек");
		submit = "false";
	}
	
	return submit;
}

function DrawField(field, htmlElement) 
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

function InitCell(row, column, field)
{
	let i = Math.random() * 10;
	if (i > 5)
	{
		field[row][column] = 1;
	}
	else
	{
		field[row][column] = 0;
	}
}

function GetCellState(row, column, field)
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

function GetNumOfAliveNeighbours(row, column, field) 
{
	var neighbours = 0;

	for(var j = column - 1; j <= column + 1; j++)
	{
		neighbours += GetCellState(row - 1, j, field);
	}

	for(var j = column - 1; j <= column + 1; j++)
	{
		neighbours += GetCellState(row + 1, j, field);
	}

	neighbours += GetCellState(row, column - 1, field);
	neighbours += GetCellState(row, column + 1, field);

	return neighbours;
}

function GetNewCellState(currentCellState, numOfAliveNeighbours)
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

function IsAnyoneAlive(field)
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

function GetNewFieldState(field)
{
	return field.map((row, rowIndex) => 
		{
			return row.map((cell, cellIndex) =>
			{
				var aliveNeighbours = GetNumOfAliveNeighbours(rowIndex, cellIndex, field);
				var currentState = GetCellState(rowIndex, cellIndex, field);
				var newState = GetNewCellState(currentState, aliveNeighbours);
				return newState;
			})
		});
}

function StartGame()
{
	if (Init() == false)
	{
		return;
	}

	console.log("nrow =" +  nrow);
	console.log("ncolumn = " + ncolumn);
	console.log("period = " + period + " in sec");

	field = new Array(nrow);
	for (var i = 0; i < nrow; i++)
	{
		field[i] = new Array(ncolumn);
		for (var j = 0; j < ncolumn; j++)
		{
			InitCell(i, j, field);
		}
	}

	initEl.innerHTML = '';

	DrawField(field, appEl);

	timer = setInterval(() => 
	{
		console.log("play!");
		field = GetNewFieldState(field);
		DrawField(field, appEl);
		if (IsAnyoneAlive(field) == false) 
		{
			clearInterval(timer);
			console.log("Every body died!");
		}
	}, period * 1000);
} 
