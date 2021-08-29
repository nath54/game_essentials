
function randint(a, b){
    return parseInt(a + Math.random() * (b-a));
}

function rchoice(lst){
    return lst[randint(0, lst.length)];
}

function range(a, b){
    var lst = [];
    for(x = a; x <= b; x++){
        lst.push(x);
    }
    return lst;
}

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
  

function gen(){
    var grid = [];
    var cases_to_decide = []; // La liste des cases ayant plusieurs possibilitées
    var a_cacher = [];
    // Creating the grid
    for(y=0; y<9; y++){
        grid.push([]);
        for(x=0; x<9; x++){
            grid[y].push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            cases_to_decide.push([x, y]);
        }
    }
    //
    while(cases_to_decide.length > 0){
        //
        var c = rchoice(cases_to_decide);
        removeItemOnce(cases_to_decide, c);
        //
        grid[c[1]][c[0]] = rchoice(grid[c[1]][c[0]]);
        // On regarde la ligne
        for(x=0; x<9; x++){
            if(Array.isArray(grid[c[1]][x]) && grid[c[1]][x].includes(grid[c[1]][c[0]])){
                removeItemOnce(grid[c[1]][x], grid[c[1]][c[0]]);
                if(grid[c[1]][x].length == 1){
                    grid[c[1]][x] = grid[c[1]][x][0];
                    removeItemOnce(cases_to_decide, [x, c[1]]);
                    a_cacher.push([x, c[1]]);
                }
            }
        }
        // On regarde la colonne
        for(y=0; y<9; y++){
            if(Array.isArray(grid[y][c[0]]) && grid[y][c[0]].includes(grid[c[1]][c[0]])){
                removeItemOnce(grid[y][c[0]], grid[c[1]][c[0]]);
                if(grid[y][c[0]].length == 1){
                    grid[y][c[0]] = grid[y][c[0]][0];
                    removeItemOnce(cases_to_decide, [c[0], y]);
                    a_cacher.push([c[0], y]);
                }
            }
        }
        // On regarde la sous-grille 3x3
        var cx=0;
        var cy=0;
        if(c[0] <= 2){ cx = 0; }
        else if(c[0] <= 5){ cx = 3; }
        else{ cx = 6; }
        if(c[1] <= 2){ cy = 0; }
        else if(c[1] <= 5){ cy = 3; }
        else{ cy = 6; }
        for(xx=cx; xx<cx+3; xx++){
            for(yy=cy; yy<cy+3; yy++){
                if(Array.isArray(grid[yy][xx]) && grid[yy][xx].includes(grid[c[1]][c[0]])){
                    removeItemOnce(grid[yy][xx], grid[c[1]][c[0]]);
                    if(grid[yy][xx].length == 1){
                        grid[yy][xx] = grid[yy][xx][0];
                        removeItemOnce(cases_to_decide, [xx, yy]);
                        a_cacher.push([xx, yy]);
                    }
                }
            }
        }
    }
    // On a maintenant une grille unique
    var partie = [];
    for(y=0; y<9; y++){
        partie.push([]);
        for(x=0; x<9; x++){
            if(a_cacher.includes([x, y])){
                partie[y].push(null);
            }
            else{
                partie[y].push(grid[y][x]);
            }
        }   
    }

    return [partie, grid]; // Plateau, Solution
}