var grid = document.getElementById("grid");
var message;

generateGrid();

function generateGrid() {
    document.getElementById("grid").style.pointerEvents = "all";
    grid.innerHTML="";
    //rows
    for (var i = 0; i < 10; i++) {
        row = grid.insertRow(i);
        for (var j = 0; j < 10; j++) {
            cell = row.insertCell(j);
            cell.onclick = function() { 
                clickedCell(this); 
            };
            //for every td adds in data-mine with false value, only mines vill have value of true
            var mine = document.createAttribute("data-mine");       
            mine.value = "false";
            //make data-mine false for all td's             
            cell.setAttributeNode(mine);
        }
    }
    addMines();
}

function refresh(){
    location.reload();
}

function addMines() {
    //How many bombs in grid (easy difficulty)
    var bombCount = 12;
    if (document.getElementById('easy').checked){
        bombCount = 12;
        message = "Maybe try the harder difficulty";
    }else{
        //hard difficulty
        message = "Real MINESWEEPER";
        bombCount = 23;
    }
    //randomises the number of mines and adds them to grid
    for (var i = 0; i < bombCount; i++) {
        var row = Math.floor(Math.random() * 10);
        var col = Math.floor(Math.random() * 10);
        var cell = grid.rows[row].cells[col];
        //Sets data-mine to true for all mines
        cell.setAttribute("data-mine" , "true");
    }
}

function checkIfCompleated() {
    var levelComplete = true;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            //if there are cells that has data-mine = false, then level isn't compleated
            if ((grid.rows[i].cells[j].getAttribute("data-mine") == "false") && (grid.rows[i].cells[j].innerHTML == "")){
                levelComplete = false;
            }
        }
    }
    if (levelComplete == true) {
        alert("You won!" + "..." + message);
        revealMines();
    }
}

function revealMines() {
    for (var i = 0; i < 10; i++) {
        for(var j = 0; j < 10; j++) {
            //finds all mines
            var cell = grid.rows[i].cells[j];
            //if data-mine = true, change cells classname to mine
            if (cell.getAttribute("data-mine")=="true"){
                cell.className = "mine";
            }           
        }
    }
}

function clickedCell(cell) {
    if (cell.getAttribute("data-mine") == "true") {
        revealMines();
        message = "Better luck next time"
        //when lost make grid unclickable
        document.getElementById("grid").style.pointerEvents = "none";
        alert("Game Over" + "........." + message);
    
    } else {
        //adds class "clicked" to clicked cells
        cell.className = "clicked";
        var mineCount = 0;
        var cellCol = cell.cellIndex;
        var cellRow = cell.parentNode.rowIndex;
        //check if there is a mine next to opened cell
        for (var i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) {
            for(var j = Math.max(cellCol -1, 0); j <= Math.min(cellCol + 1, 9); j++) {
                //if if there is a mine next to opened cell then add 1 to minecount
                if (grid.rows[i].cells[j].getAttribute("data-mine") == "true"){
                    mineCount += 1;
                } 
            }
        }
        cell.innerHTML = mineCount;
        //if clicked on a cell with no mines around, then open cells that are next to it
        if (mineCount == 0) { 
            for (var i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) {
                for(var j = Math.max(cellCol -1, 0); j <= Math.min(cellCol + 1, 9); j++) {
                    if (grid.rows[i].cells[j].innerHTML == ""){
                        clickedCell(grid.rows[i].cells[j]);
                    }
                }
            }
        }
        checkIfCompleated();  
    }
}