window.onload = createGrid


var ROWS = 35
var COLS = 60
var GOAL= [Math.floor(Math.random() * ROWS),57]
var START  = [Math.floor(Math.random() * ROWS),2]
var MOUSE_DOWN = false;
var WALL_COLOR =  'rgb(2, 30, 56)';
var VISUALZING = false;

document.addEventListener("mousedown", function(evnt){
    MOUSE_DOWN = true;
    evnt.preventDefault();    
    
});

document.addEventListener("mouseup", function(evnt){
    MOUSE_DOWN = false;

});

function refreshPage(){
    window.location.reload();
} 

function alertNoPath() {

    window.alert('No path');
    refreshPage();
}


function getNeighbors(delta, x, y) {

    neighbors = [];

    for (a = 0; a < delta.length; a++) {            
        let x2 = x + delta[a][0];
        let y2 = y + delta[a][1];   
        neighbors.push([x2,y2]);
    }

    return neighbors;
}
function createGrid() {
   

    var grid = document.getElementById('_grid');

    for (var i = 0; i < ROWS; i++) {
        
        var row = document.createElement('div');
        row.className = 'row '+ (i+1);
        row.id = 'row' + (i+1);

        for (var j = 0; j < COLS; j++) {
            var node = document.createElement('div');
            node.className = 'node ' + ((i)+","+(j));
            node.id = ((i)+","+(j));            

                node.onmouseover = function() {
                    if(MOUSE_DOWN) {             
                        
                        buildWall(this);                        
                    }      
                    
                } 

                node.onmousedown= function() {                  
                    buildWall(this);                        
                }
        
            row.appendChild(node);
        }
        grid.appendChild(row);
    
    }
  
    var startNode = document.getElementById(START);
    // console.log(START)
    var endNode = document.getElementById(GOAL);
    startNode.style.backgroundColor = '#00FF00' // green
    endNode.style.backgroundColor = '#FF0000' // red
    

}



function buildWall(node) {  
    if (VISUALZING) {
        return;
    }  
  
     
    var startNode = document.getElementById(START);
    var endNode = document.getElementById(GOAL);

    if (node.id != startNode.id && node.id != endNode.id) { 
        if (window.getComputedStyle(node).backgroundColor == 'rgb(255, 255, 255)') {
            node.style.borderColor = WALL_COLOR;
            node.style.backgroundColor = WALL_COLOR; // if open node set black wall
        }
        // else {
        //     node.style.backgroundColor = "#FFFFFF"; // white
        // }
        } 
}

function calcHeuristic(pos0, pos1) {
    // Manhattan distance
    var d1 = Math.abs (pos1[0] - pos0[0]);
    var d2 = Math.abs (pos1[1] - pos0[1]);
    return d1 + d2;
  }

function getDirections() {
    var ORTHOGONAL_MOVE_COST = 1
    var DIAGONAL_MOVE_COST = 2
    var diag = false;
    // var diag = true;

    var delta_cost = [ORTHOGONAL_MOVE_COST,
        ORTHOGONAL_MOVE_COST,
        ORTHOGONAL_MOVE_COST,
        ORTHOGONAL_MOVE_COST]

        var delta_directions = ["n", "s", "e", "w"];
        var delta = [[-1, 0],[1, 0],[0, 1],[0, -1]];

    if (diag)  {

    delta_cost = [ORTHOGONAL_MOVE_COST,
        ORTHOGONAL_MOVE_COST,
        ORTHOGONAL_MOVE_COST,
        ORTHOGONAL_MOVE_COST,
        DIAGONAL_MOVE_COST,
        DIAGONAL_MOVE_COST,
        DIAGONAL_MOVE_COST,
        DIAGONAL_MOVE_COST]

    delta = [[-1, 0], [1,0], [0, 1], [0, -1],[-1, -1], [-1, 1],  [1, 1], [1, -1]]
    
    delta_directions = ["n", "s", "e", "w", "nw", "ne", "se", "sw"];



    }

    return [delta,delta_cost, delta_directions]


}

function getMaze() {
    var maze = [];
    for (let i=0; i <= ROWS+1; i++) {
        maze[i] = []
        for (let j=0; j <= COLS+1; j++) {
            maze[i][j] = 0;            
        }
    }
    for (let i=0; i <= ROWS-1; i++) {
        for (let j=0; j <= COLS-1; j++) {

            if(document.getElementById(i+","+j).style.backgroundColor == WALL_COLOR) {
                maze[i][j] = -1;           
            }
        }
    }
    console.log(maze)
    return maze;
}


function animate(explored,path,goal) {
   
 
    var timeout = 15;    
    
    for (var i=0;i<explored.length; i++) {
               
        const node = document.getElementById(explored[i]);
        if (explored[i][0] == goal[0] && explored[i][1] == goal[1]) {
             
            
            setTimeout(() => {
                animatePath(path);
              }, timeout * i);
            
            break;
        }
        setTimeout(() => {
          
            if (node != null && node.style.backgroundColor != 'rgb(0, 255, 0)'){
                if(node.style.backgroundColor != 'rgb(0, 255, 0)') {            
               
                    node.classList.add('visited-node');
                   
                }                
               
            }                  

        },timeout*i)

    }   
    
}

function animatePath(path) {
  
    
    for (var i=0;i<path.length-1; i++) {
        const n = document.getElementById(path[i]);
        setTimeout(() => {      
            n.classList.add('shortest-path-node');

        },50*i)
    }
    

}

function generateRandomMaze() {

    if (VISUALZING) {
        return;
    }

    for (var i = 0; i < 500; i++) {
        x = Math.floor(Math.random() * ROWS);
        y = Math.floor(Math.random() * COLS);
        var node = document.getElementById((x)+","+(y));      
            
            if (node.style.backgroundColor != 'rgb(0, 255, 0)' && node.style.backgroundColor != 'rgb(255, 0, 0)') {
            
                node.style.borderColor = WALL_COLOR;
                node.style.backgroundColor = WALL_COLOR;      
                
        }   
        
    }



}


function aStar() {
    if (VISUALZING) {
        return;
    }  
  

    var directions = getDirections();
    delta = directions[0]
    delta_cost = directions[1]
    delta_directions = directions[2]

    var maze = getMaze();
    
    var closed = [];
    for (let i=0; i <= ROWS+1; i++) {
        closed[i] = []
        for (let j=0; j <= COLS+1; j++) {
            closed[i][j] = Infinity;
        }
    }
    closed[START[0]][START[1]] = 1;


    var heuristic = [];
    for (let i=0; i <= ROWS+1; i++) {
        heuristic[i] = []
        for (let j=0; j <= COLS+1; j++) {
            heuristic[i][j] = calcHeuristic([i,j],GOAL);
        }
    }

    var action = [];
    for (let i=0; i <= ROWS+1; i++) {
        action[i] = []
        for (let j=0; j <= COLS+1; j++) {
            action[i][j] = -1;
        }
    }
  

    
    var x = START[0];
    var y = START[1];
    var g = 0;
    var g2 = 0;
    var h = heuristic[x][y];
    var f = g + h;
    var cost = 1;
    var count = 0;
    var wall = -1;

    var open = [];
    var neighbor = [];
    var explored = [];

    var start = [f,g,h,x,y]
    open.push(start);

    var goalFound = false;
    var noPath = false;
    var wall = -1;

    while (!goalFound && !noPath) {
      
        if (open.length == 0) {
            
            noPath = true;
            console.log('no path');
       
            alertNoPath();
       
            
        } else {

            open = open.sort(function(a, b) { return a[0] - b[0]; });
        
            var currentNode = open.shift();

            explored.push([x,y]);
            x = currentNode[3];
            y = currentNode[4];
            g = currentNode[1];         
  
            count+=1;

            if (x == GOAL[0] && y == GOAL[1]){
                explored.push([x,y]);
                VISUALZING = true;
                goalFound = true;
            } else {
                for (i = 0; i < delta.length; i++) {            
                    let x2 = x + delta[i][0];
                    let y2 = y + delta[i][1];
            
                    if ((x2 >= 0) && (x2 < ROWS) && (y2 >= 0) && (y2 < COLS)) {
                        if (closed[x2][y2] == Infinity && maze[x2][y2] != wall) {
                            g2 = g + cost
                            h2 = heuristic[x2][y2];
                            f2 = g2 + h2;
                            neighbor = [f2,g2,h2,x2,y2];
                            open.push(neighbor);
                            closed[x2][y2] = 1;
                            // explored.push([x,y])
                            action[x2][y2] = i;
                        }
            
                    }
                }
            }


        }


    }
    var path = getPath(delta,action);
    animate(explored,path,GOAL)

}

function dijkstra() {  

    if (VISUALZING) {
        return;
    }  
    
    var explored = [];
    var directions = getDirections();
    delta = directions[0]
    delta_cost = directions[1]
    delta_directions = directions[2]

    var maze = getMaze();


    var closed = [];
    for (let i=0; i <= ROWS+1; i++) {
        closed[i] = []
        for (let j=0; j <= COLS+1; j++) {
            closed[i][j] = Infinity;
        }
    }
    closed[START[0]][START[1]] = 1;


    var action = [];
    for (let i=0; i <= ROWS+1; i++) {
        action[i] = []
        for (let j=0; j <= COLS+1; j++) {
            action[i][j] = -1;
        }
    }

 
    var x = START[0];
    var y = START[1];
    var g = 0;
    var cost = 1;    

    var open = [];
    open.push([g,x,y]);
    var delta_cost = directions[1];
   

    var goalFound = false;
    var noPath = false;
    
    

    while (!goalFound && !noPath) {
       
        if (open.length == 0) {    
                 
            noPath = true;
            console.log('no path')
            alertNoPath();
            
        } else {

            open = open.sort(function(a, b) { return a[0] - b[0]; }); // put lowest g value to front of list             
            var currentNode = open.shift(); // pop the first element from the list     
            
            g = currentNode[0];
            x = currentNode[1];
            y = currentNode[2];
            
     
            explored.push([x,y]);          
            
            if (x == GOAL[0] && y == GOAL[1]){
                explored.push([x,y]);
                VISUALZING = true;
                goalFound = true;
            } else {
                for (i = 0; i < delta.length; i++) {            
                    let x2 = x + delta[i][0];
                    let y2 = y + delta[i][1];  
                                       
                                      
                    if (((x2 >= 0) && (x2 < ROWS)) && ((y2 >= 0) && (y2 < COLS))) {
                        if (closed[x2][y2] == Infinity && maze[x2][y2] != -1) {
                            
                            g2 = g + cost;                     
                            open.push([g2,x2,y2]);
                            closed[x2][y2] = 1;
                            action[x2][y2] = i;
                            
                        }
            
                    }
                }
            }


        }


    }

    var path = getPath(delta,action);
    animate(explored,path,GOAL)


}

function dfs() {  

    if (VISUALZING) {
        return;
    }  

    
    var expand = [];
    var directions = getDirections();
    var delta = directions[0]
    var maze = getMaze();

    var explored = [];
    for (let i=0; i <= ROWS+1; i++) {
        explored[i] = []
        for (let j=0; j <= COLS+1; j++) {
            explored[i][j] = false;
        }
    }
    explored[START[0]][START[1]] = true;


    var action = [];
    for (let i=0; i <= ROWS+1; i++) {
        action[i] = []
        for (let j=0; j <= COLS+1; j++) {
            action[i][j] = -1;
        }
    }

 
    var x = START[0];
    var y = START[1];



    var open = [];
    open.push([x,y]);
   

    var goalFound = false;
    var noPath = false;
    
    

    while (!goalFound && !noPath) {
        expand.push([x,y]);
        if (open.length == 0) {    
                 
            noPath = true;
            console.log('no path')
            alertNoPath();
            
        } else {

            var currentNode = open.pop();
         
            x = currentNode[0];
            y = currentNode[1];
 
            
            if (x == GOAL[0] && y == GOAL[1]){
                expand.push([x,y]);
                VISUALZING = true;
                goalFound = true;
            } else {
                for (i = 0; i < delta.length; i++) {            
                    let x2 = x + delta[i][0];
                    let y2 = y + delta[i][1];  
                                  
                                      
                    if (((x2 >= 0) && (x2 < ROWS)) && ((y2 >= 0) && (y2 < COLS))) {
                        if (explored[x2][y2] == false && maze[x2][y2] != -1) {
                            var neighbor = [x2,y2]
                            open.push(neighbor);
                            explored[x2][y2] = true;
                            action[x2][y2] = i;
                            
                        }
            
                    }
                }
            }


        }


    }

    var path = getPath(delta,action);
    animate(expand,path,GOAL)


}

function bfs() {  

    if (VISUALZING) {
        return;
    }  

    
    var explored = [];
    var directions = getDirections();
    var delta = directions[0]
    
    var maze = getMaze();

    var closed = [];
    for (let i=0; i <= ROWS+1; i++) {
        closed[i] = []
        for (let j=0; j <= COLS+1; j++) {
            closed[i][j] = false;
        }
    }
    closed[START[0]][START[1]] = true;


    var action = [];
    for (let i=0; i <= ROWS+1; i++) {
        action[i] = []
        for (let j=0; j <= COLS+1; j++) {
            action[i][j] = -1;
        }
    }

 
    var x = START[0];
    var y = START[1];



    var open = [];
    open.push([x,y]);
   

    var goalFound = false;
    var noPath = false;
 
    
    

    while (!goalFound && !noPath) {
        explored.push([x,y]);
        if (open.length == 0) {    
                 
            noPath = true;
            console.log('no path')
            alertNoPath();
            
        } else {

            var currentNode = open.shift();
          
            x = currentNode[0];
            y = currentNode[1];
 
            
            if (x == GOAL[0] && y == GOAL[1]){
                explored.push([x,y]);
                VISUALZING = true;
                goalFound = true;
            } else {
                for (i = 0; i < delta.length; i++) {            
                    let x2 = x + delta[i][0];
                    let y2 = y + delta[i][1];  
                                  
                                      
                    if (((x2 >= 0) && (x2 < ROWS)) && ((y2 >= 0) && (y2 < COLS))) {
                        if (closed[x2][y2] == false && maze[x2][y2] != -1) {
                            var neighbor = [x2,y2]
                            open.push(neighbor);
                            closed[x2][y2] = true;
                            action[x2][y2] = i;
                          
                            
                        }
            
                    }
                }
            }


        }


    }

    var path = getPath(delta,action);
    animate(explored,path,GOAL)


}
function dynamic() {

    if (VISUALZING) {
        return;
    }  

    
    var directions = getDirections();
    delta = directions[0]
    delta_cost = directions[1]
    delta_directions = directions[2]

    var maze = getMaze();
    var value = [];
    for (let i=0; i <= ROWS+1; i++) {
        value[i] = []
        for (let j=0; j <= COLS+1; j++) {
            value[i][j] = Infinity;
        }
    }

    var policy = [];
    for (let i=0; i <= ROWS+1; i++) {
        policy[i] = []
        for (let j=0; j <= COLS+1; j++) {
            policy[i][j] = '-1';
        }
    }

    var action = [];
    for (let i=0; i <= ROWS+1; i++) {
        action[i] = []
        for (let j=0; j <= COLS+1; j++) {
            action[i][j] = -1;
        }
    }


    let v2 = 0;  
    let change = true;
    let explored = [];
    var wall = -1;
      
    while (change) {
        
        
        change = false;
        for (let x=0; x < ROWS+1; x++) {
            for (let y=0; y < COLS+1; y++) {
                 

                if (GOAL[0] == x && GOAL[1] == y) {
                    if (value[x][y] > 0) {
                        value[x][y] = 0;
                        policy[x][y] = 'goal';     
                    }
               

                } else if (maze[x][y] == 0) {         
                                
                    for (a = 0; a < delta.length; a++) {            
                        let x2 = x + delta[a][0];
                        let y2 = y + delta[a][1];    
                               
                        
                    
                        if ((x2 >= 0) && (x2 < ROWS) && (y2 >= 0) && (y2 < COLS) && maze[x2][y2] != wall) {
                                 
                            v2 = value[x2][y2] + delta_cost[a]                                  
                        
                            if (v2 < value[x][y]) { 
                                explored.push([x,y])  
                                
                                                              
                                value[x][y] = v2;
                                change = true;                                                                                      
                                                            
        
                            }

                        }
                    
                     
                    }                

                }
          
            }
      
        }
    }

    VISUALZING = true;
    
  

    let goalReached = false;
    let path = [];
    let x = START[0];
    let y = START[1];
    let cost = value[x][y];
    var node = [];
    var count = 0;


    while (!goalReached) {  
        
        count+=1;
       
        for (a = 0; a < delta.length; a++) {
            
            let x1 = x + delta[a][0];
            let y1 = y + delta[a][1];
            if (0 <= x1 && x1 < ROWS+1 && 0 <= y1 && y1 < COLS+1) {               
                
                
                if(value[x1][y1] < cost) {
                    cost = value[x1][y1]
                    node = [x1,y1]
                    
                }
            }
        }
        path.push(node)
        
        

        x = node[0]
        y = node[1]

        if (count == 1000) {
            alertNoPath();
            return -1;
            
        }

        if(x == GOAL[0] && y == GOAL[1]) {            
            goalReached = true;
            
        }
    }

 
    animate(explored, path,START);


    
}


function getPath(delta,action) {  
       
    let x = GOAL[0];
    let y = GOAL[1];
    let x2 = 0
    let y2 = 0
    var path = [];

    // policy[x][y] = 'goal';

    while (x != START[0] || y != START[1]) {
        x2 = x - delta[action[x][y]][0]
        y2 = y - delta[action[x][y]][1]
        path.push([x,y])
        x = x2;
        y = y2;
        // path.push([x,y])

    }

    return path.reverse();

}

       


