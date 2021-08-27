
window.tx = 14;
window.ty = 30;
window.colors = 2;
window.grille = [];
window.est_fini = false;
window.last_frame = 0;
window.current_block = null;
window.block_colors = {}
window.score = 0;
window.speed = 240;
window.last_augment_speed = 0;
window.speed_augment_speed = 6000;
window.case_size = 25;

const TP_BLOCKS = Object.keys(DATA_BLOCKS);

window.allowed_blocks = [];

function dec(value){
    return decodeURIComponent(value);
}

function init(){
    // On recupere les parametres
    var parameters = location.search.substring(1).split("&");
    for(p of parameters){
        var options = p.split("=");
        if(options.length == 2){
            if(options[0] == "color"){
                window.colors = options[1];
            }
            else if(options[0] == "allowed"){
                var aaa = dec(options[1]);
                window.allowed_blocks = JSON.parse(aaa);
            }
            else if(options[0] == "size"){
                if(options[1] == 1){ // SMALL
                    window.tx = 10;
                    window.ty = 23;
                    window.case_size = 21;
                }
                else if(options[1] == 2){ // NORMAL
                    window.tx = 14;
                    window.ty = 27;
                    window.case_size = 15;
                }
                else if(options[1] == 3){ // BIG
                    window.tx = 20;
                    window.ty = 32;
                    window.case_size = 11;
                }
                else if(options[1] == 4){ // VERY BILL
                    window.tx = 30;
                    window.ty = 32;
                    window.case_size = 8;
                }
                else if(options[1] == 5){
                    window.tx = 10;
                    window.ty = 42;
                    window.case_size = 8;
                }
            }
        }
    }
    // On crée la tableau
    var tableau = document.getElementById("grille");
    for(y=0; y<window.ty; y++){
        var ligne = document.createElement("tr");
        for(x=0; x<window.tx; x++){
            var c = document.createElement("td");
            c.classList.add("case");
            c.id = "case_"+x+"_"+y;
            c.style.width = ""+window.case_size+"px";
            c.style.height = ""+window.case_size+"px";
            set_color([0, 0, 0], c, null);
            if(y == 4){
                c.style.borderBottomColor = "rgb(255, 0, 0)";
            }
            ligne.appendChild(c);
        }
        tableau.appendChild(ligne);
    }
    // On prepare les variables de couleurs
    if(window.colors == 2){
        for(t of TP_BLOCKS){
            window.block_colors[t] = random_color();
        }
    }
    else if(window.colors == 3){
        window.block_colors.last_cl = random_color();
    }
    // On lance le jeu
    window.requestAnimationFrame(mainloop);
}

function get_color(tp_block){
    if(window.colors == 1){ // noir et blanc
        return [255, 255, 255];
    }
    else if(window.colors == 2){ // Chaque block est d'une couleur différente
        return window.block_colors[tp_block];
    }
    else if(window.colors == 3){ // Dégradé
        var chang = 12;
        var cl = window.block_colors.last_cl;
        for(ic of [0, 1, 2]){
            cl[ic] = clamp(cl[ic]+randint(-chang, chang), 50, 255);
        }
        window.block_colors.last_cl = cl;
        return cl;
    }
    else{ // Random colors
        return random_color(min=50);
    }
}

function get_case_cl(x, y){
    var n = document.getElementById("case_"+x+"_"+y);
    return n.style.backgroundColor;
}

function peut_block_bouger(dx, dy){
    for(c of window.current_block.cases){
        var nx = c[0]+dx;
        var ny = c[1]+dy;
        //
        if(nx<0 || ny < 0 || nx>=window.tx || ny>=window.ty){
            return false;
        }
        //
        var est_case_block = false;
        for(cc of window.current_block.cases){
            if(cc[0]==nx && cc[1]==ny){
                est_case_block = true;
                break;
            }
        }
        //
        if(!est_case_block && get_case_cl(nx, ny) != "rgb(0, 0, 0)"){
            return false
        }
    }
    return true;
}

function bouge_block(dx, dy){
    var poses_enr = [];
    var est_dessus = false;
    for(c of window.current_block.cases){
        // On enleve l'ancienne position, si l'un des nouveaux blocks n'est pas dessus
        est_dessus = false;
        for(p of poses_enr){
            if(p[0]==c[0] && p[1] == c[1]){
                est_dessus = true;
                break
            }
        }
        if(!est_dessus){
            set_color([0, 0, 0], null, "case_"+c[0]+"_"+c[1]);
        }
        // On bouge le block
        c[0] += dx;
        c[1] += dy;
        // On indique qu'il y a un nouveau block ici
        poses_enr.push([c[0], c[1]]);
        // On change la couleur de l'ancienne position
        set_color(c[2], null, "case_"+c[0]+"_"+c[1]);
    }
    window.current_block.x += dx;
    window.current_block.y += dy;
}

function est_bonne_position(lst_cases){
    var est_block = false;
    for(c of lst_cases){
        console.log("aa", c);
        if(Object.is(c[0], -0)){
            return false;
        }
        if(Object.is(c[1], -0)){
            return false;
        }
        if(c[0]<0){
            return false;
        }
        if(c[1]<0){
            return false;
        }
        if(c[0]>=window.tx){
            return false;
        }

        if(c[1]>=window.ty){
            return false;
        }
        est_block = false;
        for(cc of window.current_block.cases){
            if(c[0]==cc[0] && c[1]==cc[1]){
                est_block = true;
                break;
            }
        }
        if(!est_block && get_case_cl(c[0], c[1]) != "rgb(0, 0, 0)"){
            return false;
        }
    }
    return true;
}

function rotate_block(agl){
    cases = JSON.parse(JSON.stringify(window.current_block.cases));
    cagl = agl;
    //
    while( (cagl/90)*(cagl/90) >= 1){
		if(cagl <= -90){
			for(i=0; i<cases.length; i++){
                var c = cases[i];
                xx = c[0] - window.current_block.x;
                yy = c[1] - window.current_block.y;
				//
				temp = xx;
				xx = -yy;
				yy = temp;
				//
                var cc = [parseInt(xx + window.current_block.x), parseInt(yy + window.current_block.y), c[2]];
                cases[i] = cc;
			}
            cagl += 90;
		}
		else if(cagl >= 90){
			for(i=0; i<cases.length; i++){
                var c = cases[i];
				xx = c[0] - window.current_block.x;
                yy = c[1] - window.current_block.y;
				//
				temp = -xx;
				xx = yy;
				yy = temp;
				//
                var cc = [parseInt(xx + window.current_block.x), parseInt(yy + window.current_block.y), c[2]];
                cases[i] = cc;
			}
            cagl -= 90;
		}
	}
    //
    var bon = est_bonne_position(cases);
    if(bon === true){
        //
        for(c of window.current_block.cases){
            set_color([0, 0, 0], null, "case_"+c[0]+"_"+c[1]);
        }
        //
        window.current_block.cases = cases;
        //
        for(c of window.current_block.cases){
            set_color(c[2], null, "case_"+c[0]+"_"+c[1]);
        }
        //
    }
}

function create_block(x, y, tp){
    if(!Object.keys(DATA_BLOCKS).includes(tp)){
        console.error("Il n'y a pas");
        return;
    }
    var block = {"x": x+DATA_BLOCKS[tp].dx, "y": y+DATA_BLOCKS[tp].dy, "cases":[], "tp": tp};
    for(c of DATA_BLOCKS[tp].cases){
        // On ajoute la case au block
        var cl = get_color(tp);
        var cx = x + c[0];
        var cy = y + c[1];
        block.cases.push([cx, cy, cl]);
        // On met la couleur sur la grille
        set_color(cl, null, "case_"+cx+"_"+cy);
    }
    // On renvoie le block
    return block;
}

function test_ligne(y){
    for(x=0; x<window.tx; x++){
        if(get_case_cl(x, y) == "rgb(0, 0, 0)"){
            return false;
        }
    }
    return true;
}

function randtp(){
    return randchoice(window.allowed_blocks);
}

function chute_blocks(ligne){
    for(y=ligne-1; y>=0; y--){
        for(x=0; x<window.tx; x++){
            var cc = get_case_cl(x, y);
            if(cc != "rgb(0, 0, 0)"){
                document.getElementById("case_"+x+"_"+y).style.backgroundColor = "rgb(0, 0, 0)";
                document.getElementById("case_"+x+"_"+(y+1)).style.backgroundColor = cc;
            }
        }
    }
}

function physics(){
    if(window.current_block == null){
        window.current_block = create_block(randint(2, window.tx-2), 3, randtp());
        rotate_block(randchoice([-90, 0, 90, 180]));
    }
    else{
        if(peut_block_bouger(0, 1)){
            bouge_block(0, 1);
        }
        else{
            var bonus = -1;
            var points = 0;
            var lignes = [];
            // On vérifie si une ligne a été créée
            for(c of window.current_block.cases){
                if(c[1] <= 4){
                    fin_jeu();
                }
                if(test_ligne(c[1])){
                    if(!lignes.includes(c[1])){
                        lignes.push(c[1]);
                    }
                    //
                    for(x=0; x<window.tx; x++){
                        set_color([0, 0, 0], null, "case_"+x+"_"+c[1]);
                    }
                    points += window.tx;
                    bonus += 1;
                }
            }
            // On fait tomber les lignes
            for(l of tri_rapide(lignes)){
                chute_blocks(l);
            }
            //
            if(points > 0){
                window.score += points * (2 ** bonus);
                document.getElementById("score").innerHTML = "score : "+window.score;
                chute_blocks();
            }
            window.current_block = null;
        }
    }
}

function fin_jeu(){
    window.est_fini = true;
    document.getElementById("div_fin").style.display = "initial";
    document.getElementById("fin_score").innerHTML = "score : "+window.score;
}

function toggle_pause(){
    if(window.est_pause){
        // Si on est en pause
        window.est_pause = false;
        document.getElementById("text_pause").style.display = "none";
        // On doit relancer le jeu
        window.requestAnimationFrame(mainloop);
    }
    else{
        // Si on est pas en pause
        window.est_pause = true;
        document.getElementById("text_pause").style.display = "initial";
    }
}

function mainloop(){
    var dt = new Date();
    var ti = dt.getTime();
    if(ti-window.last_frame >= window.speed){
        last_frame = ti
        physics();
    }
    if(ti-window.last_augment_speed >= window.speed_augment_speed){
        window.last_augment_speed = ti;
        window.speed = clamp(window.speed-1, 50, 1000);
    }
    //
    if(!window.est_fini && !window.est_pause){
        window.requestAnimationFrame(mainloop);
    }
    else if(window.est_fini){
        fin_jeu();
    }
}

window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
  
    if(window.current_block == null){
        return;
    }
    switch (event.key) {
        case "ArrowDown":
            if(!window.est_pause && peut_block_bouger(0, 1)){
                bouge_block(0, 1);
            }
            break;
        case "ArrowUp":
            if(!window.est_pause){
                rotate_block(-90);
            }
            break;
        case "ArrowLeft":
            if(!window.est_pause && peut_block_bouger(-1, 0)){
                bouge_block(-1, 0);
            }
            break;
        case "ArrowRight":
            if(!window.est_pause && peut_block_bouger(1, 0)){
                bouge_block(1, 0);
            }
            break;
        case " ":
            if(!window.est_pause){
                rotate_block(90);
            }
            break;
        case "q":
            fin_jeu();
            break;
        case "p":
            toggle_pause();
            break;
        case "r":
            window.location.reload();
            break;
        default:
            return; // Quit when this doesn't handle the key event.
    }
  
    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  }, true);
  // the last option dispatches the event to the listener first,
  // then dispatches event to window
  
