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
    // console.log(data.length)
    while (position < length) { 
        // console.log(position)
        id = data[position].id;
        if (id.substr(0, 3) === 'IDM') {
            cars++
            posofreg.push(iteration);
        } else {
            autocars++
            posofauto.push(iteration);
        }
            
        // console.log(id.valueOf() === data[position].id.valueOf());
        while (position < length && id === data[position].id) {
            // console.log(data[position].x);
            // console.log(data[position].y);
            xtemp.push(data[position].x);
            ytemp.push(data[position].y);
            position = position + 1;
            // console.log(position);
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
ctx.lineWidth = 30;
ctx.beginPath();
ctx.strokeStyle = "#00BFFF"
ctx.arc(310, 268, 215, 0, 2 * Math.PI);
ctx.stroke();

// var obj = document.createElement('img')
// obj.id = ('element' + (i + 1))
// obj.setAttribute('src', 'car.png')
// document.getElementById("ball-container").appendChild(obj);

function createelements() {
    for (i = 0; i < posofreg.length; i++) {
        var obj = document.createElement('div');
        var otherobj = document.createElement("IMG");
        otherobj.id = ('IDM' + (posofreg[i]));
        namesofreg.push('IDM' + (posofreg[i]));
        otherobj.setAttribute('src', 'car.png');
        otherobj.style.position = "absolute";
        obj.appendChild(otherobj);
        document.getElementById("ball-container").appendChild(obj);
    }
    for (i = 0; i < posofauto.length; i++) {
        var obj = document.createElement('div');
        var otherobj = document.createElement("IMG");
        otherobj.id = ('AUTO' + (posofauto[i]));
        namesofauto.push('AUTO' + (posofauto[i]))
        otherobj.setAttribute('src', 'car.png');
        otherobj.style.position = "absolute";
        obj.appendChild(otherobj);
        document.getElementById("ball-container").appendChild(obj);
    }
    console.log(namesofreg);
    console.log(namesofauto);
}
// var truth = [0,0,0,0,0,0,1];
var created = true;
function ballCircle() {
    console.log(created);
    if (created) {
        created = false;
        createelements()
        console.log('cars created!');
    } else {
        console.log('cars already created!');
    }
    console.log(document.getElementById("ball-container"))
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
                // if (i < truth.length && truth[i]) {
                //     console.log(namesofauto[i])
                //     // console.log(eval(namesofauto[i]).style.marginLeft)
                //     console.log(eval(namesofauto[i]).style.marginTop) 
                // }
                
            }
            pos++;
        }
    }
}