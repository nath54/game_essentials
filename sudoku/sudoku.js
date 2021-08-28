
window.plateau = [];
window.solution = [];

function init(){
    var res = gen();
    window.plateau = res[0];
    window.solution = res[1];
    //
    var table = document.getElementById("table");
    for(y=0; y<9; y++){
        var line = document.createElement("tr");
        for(x=0; x<9; x++){
            var c = document.createElement("td");
            if(window.plateau[y][x]==null){
                var inp = document.createElement("p");
                c.appendChild(inp);
            }
            else{
                var p = document.createElement("p");
                p.innerHTML = window.plateau[y][x];
                c.appendChild(p);
            }
            line.appendChild(c);
        }
        table.appendChild(line);
    }
}