var grid = document.getElementById("grid");
var checkCell = document.querySelector("clicked");
const stageButton = document.getElementById('search-btn')
var message;
var bombCount = 12;
var bombsFound;
var flagcount;

function checkLevelDifficulty(){
    if (document.getElementById('easy').checked){
        bombsFound = 11;  
        flagcount = 12;                  
    }else{                       
        bombsFound = 22;
        flagcount = 23;
    }

}

generateGrid();

function generateGrid() {
    checkLevelDifficulty();
    

    document.getElementById("grid").style.pointerEvents = "all";
    grid.innerHTML="";
    for (var i = 0; i < 10; i++) {
        row = grid.insertRow(i);
        for (var j = 0; j < 10; j++) {
            cell = row.insertCell(j);
            cell.onclick = function() {                 
                if(stageButton.classList.contains('flagging')){ 

                    flaggingCell(this);                  

                }else{

                    clickedCell(this);

                }
                 
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
    checkLevelDifficulty();
    location.reload();
}

function addMines() {
    //How many bombs in grid (easy difficulty)
    
    if (document.getElementById('easy').checked){
        bombCount = 12;
        message = "Maybe try the harder difficulty";
    }else{
        //hard difficulty
        bombCount = 23;
        message = "Real MINESWEEPER";
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


function checkIfCompleated(bombsFound) {
    var levelComplete = true;
    for (var i=0; i<10; i++) {
        for(var j=0; j<10; j++) {
            if ((grid.rows[i].cells[j].getAttribute("data-mine")=="false") && (grid.rows[i].cells[j].innerHTML=="")){ 
                levelComplete = false;
            }
        }
    }
    if (bombsFound == 0){
        alert("You won!" + "..." + message);
        revealMines();
        document.getElementById("grid").style.pointerEvents = "none";
        levelComplete = true;
    }
    if (levelComplete == true) {
        alert("You won!" + "..." + message);
        revealMines();
        document.getElementById("grid").style.pointerEvents = "none";
    }
}

function revealMines() {
    for (var i = 0; i < 10; i++) {
        for(var j = 0; j < 10; j++) {
            //finds all mines
            var cell = grid.rows[i].cells[j];
            //if data-mine = true, change cells classname to mine
            if (cell.getAttribute("data-mine") == "true"){
                cell.className = "mine";
            }
                      
        }
    }
}

function searchFlag(){
    stageButton.classList.toggle('flagging');
    if(stageButton.classList.contains('flagging')){
        stageButton.innerText = "Flaging";
    }else{
        stageButton.innerText = "Searching";
    }
}
//Add flags to clicked cell
function flaggingCell(cell){    
    cell.innerHTML = "🚩";
    cell.classList.toggle("flagon");
    //remove flags when clicked on a cell
    if (cell.classList.contains("flagon")){
        cell.innerHTML = "🚩";
        flagcount -= 1;
        if (cell.getAttribute("data-mine") == "true"){
            bombsFound -= 1;
        }
    }else{
        cell.innerHTML = "";
        flagcount += 1;
        if (cell.getAttribute("data-mine") == "true"){
            bombsFound += 1;
        }
    }
    //checks if you have flags
    if (flagcount == -1 ){
        alert("You ran out of flags!");
        cell.innerHTML = "";
        flagcount = 0;
    }      
    checkIfCompleated(); 
}


function clickedCell(cell) {
    if (cell.getAttribute("data-mine") == "true") { 
        if (cell.classList.contains("flagon")){
            return;
        }else{
            revealMines();
            message = "Better luck next time"
            //when lost make grid unclickable
            document.getElementById("grid").style.pointerEvents = "none";
            alert("Game Over" + "........." + message);
        }       
        
    
    } else {
        //adds class "clicked" to clicked cells
        cell.className = "clicked";
        var mineCount = 0;
        var cellCol = cell.cellIndex;
        var cellRow = cell.parentNode.rowIndex;
        //check if there is a mine next to opened cell
        for (var i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) {
            for(var j = Math.max(cellCol -1, 0); j <= Math.min(cellCol + 1, 9); j++) {
                //if there is a mine next to opened cell then add 1 to minecount
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
