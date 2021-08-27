
function randint(a, b){
    return parseInt(a + Math.random()*(b-a));
}

function randchoice(lst){
    return lst[randint(0, lst.length - 1)];
}

function random_color(min=0, max=255){
    return [randint(min, max), randint(min, max), randint(min, max)];
}

function set_color(cl, node, node_id){
    if(node!=null){
        node.style.backgroundColor = "rgb("+cl[0]+","+cl[1]+","+cl[2]+")";
    }
    else if(node_id != null){
        var node = document.getElementById(node_id);
        node.style.backgroundColor = "rgb("+cl[0]+","+cl[1]+","+cl[2]+")";
    }
}

function clamp(val, min, max){
    if(val<min){
        val = min;
    }
    else if(val > max){
        val = max;
    }
    return val;
}
// basic implementation, where pivot is the first element
function tri_rapide(array, sens=1) {
    if(array.length < 2) {
      return array;
    }
  
    var pivot = array[0];
    var lesserArray = [];
    var greaterArray = [];
  
    for (var i = 1; i < array.length; i++) {
      if ( array[i] > pivot ) {
        greaterArray.push(array[i]);
      } else {
        lesserArray.push(array[i]);
      }
    }
    if(sens==1){
        return tri_rapide(lesserArray, sens).concat(pivot, tri_rapide(greaterArray, sens));
    }
    else{
        return tri_rapide(greaterArray, sens).concat(pivot, tri_rapide(lesserArray, sens));
    }
  }
