var arrayx = [];
var arrayy = [];
var xtemp = [];
var ytemp = [];
var position = 0;
var id = 'AUG_0';
var length = 0;
var cars = 0;
var autocars = 0;
var posofreg = [];
var posofauto = [];
var iteration = 0;
var namesofreg = [];
var namesofauto = [];
d3.csv("pos_data.csv", function(data) {
    length = data.length;
    while (position < length) { 
        id = data[position].id;
        if (id.substr(0, 3) === 'IDM') {
            cars++
            posofreg.push(iteration);
        } else {
            autocars++
            posofauto.push(iteration);
        }
            
        while (position < length && id === data[position].id) {
            xtemp.push(data[position].x);
            ytemp.push(data[position].y);
            position = position + 1;
        }
        arrayx.push(xtemp);
        arrayy.push(ytemp);
        xtemp = [];
        ytemp = [];
        iteration++
    }
    console.log(arrayx);
    console.log(arrayy)
});

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.lineWidth = 35;
ctx.beginPath();
ctx.arc(310, 268, 215, 0, 2 * Math.PI);
ctx.stroke();

function createelements() {
    for (i = 0; i < posofreg.length; i++) {
        var obj = document.createElement('div');
        var otherobj = document.createElement("IMG");
        otherobj.id = ('IDM' + (posofreg[i]));
        namesofreg.push('IDM' + (posofreg[i]));
        otherobj.setAttribute('src', 'yellow_car.png');
        otherobj.style.position = "absolute";
        obj.appendChild(otherobj);
        document.getElementById("car-container").appendChild(obj);
    }
    for (i = 0; i < posofauto.length; i++) {
        var obj = document.createElement('div');
        var otherobj = document.createElement("IMG");
        otherobj.id = ('AUTO' + (posofauto[i]));
        namesofauto.push('AUTO' + (posofauto[i]))
        otherobj.setAttribute('src', 'blue_car.png');
        otherobj.style.position = "absolute";
        obj.appendChild(otherobj);
        document.getElementById("car-container").appendChild(obj);
    }
    console.log(namesofreg);
    console.log(namesofauto);
}

var created = true;
function carCircle() {
    console.log(created);
    if (created) {
        created = false;
        createelements()
        console.log('cars created!');
    } else {
        console.log('cars already created!');
    }
    var id = setInterval(frame, 7)
    var pos = 0;
    function frame() {
        if (pos >= length) {
            clearInterval(id);
        } else {
            for (i = 0; i < namesofreg.length; i++) {
                eval(namesofreg[i]).style.marginLeft = (eval(arrayx[posofreg[i]][pos]) * 5) + 100 + 'px';
                eval(namesofreg[i]).style.marginTop = (eval(arrayy[posofreg[i]][pos]) * 5) + 100 + 'px';
            }
            for (i = 0; i < namesofauto.length; i++) {
                eval(namesofauto[i]).style.marginLeft = (eval(arrayx[posofauto[i]][pos]) * 5) + 100 + 'px';
                eval(namesofauto[i]).style.marginTop = (eval(arrayy[posofauto[i]][pos]) * 5) + 100 + 'px';  
            }
            pos++;
        }
    }
}
