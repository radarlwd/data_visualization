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
d3.csv("pos_data.csv", function(data) {
    length = data.length;
    // console.log(data.length)
    while (position < length) { 
        // console.log(position)
        id = data[position].id;
        console.log(id.substr(0,3))
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
    console.log(posofauto);
    console.log(cars)
    console.log(autocars)
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
        obj.id = ('element' + (posofreg[i]));
        otherobj.setAttribute('src', 'car.png');
        otherobj.style.position = "absolute";
        otherobj.style.marginLeft = '250px'
        otherobj.style.marginTop = '110px'
        obj.appendChild(otherobj);
        document.getElementById("ball-container").appendChild(obj);
    }
    for (i = 0; i < posofauto.length; i++) {
        var obj = document.createElement('div');
        var otherobj = document.createElement("IMG");
        obj.id = ('element' + (posofauto[i]));
        otherobj.setAttribute('src', 'car.png');
        otherobj.style.position = "absolute";
        otherobj.style.marginLeft = '250px'
        otherobj.style.marginTop = '110px'
        obj.appendChild(otherobj);
        document.getElementById("ball-container").appendChild(obj);
    }
}
var created = true;
function ballCircle() {
    if (created) {
        created = false;
        createelements()
    }
    console.log(document.getElementById("ball-container"))
    var id = setInterval(frame, 5)
    var pos = 0;
    function frame() {
        // for (i = 1; i < 23; i++) {
        //     eval('element' + i).style.display = "block";
        // }
        if (pos >= length) {
            clearInterval(id);
        } else {
            // (cars + autocars)
            for (i = 0; i < (cars + autocars); i++) {
                eval('element' + (i + 1)).style.marginTop = (arrayy[i][pos] * 5) + 100 + 'px';
                eval('element' + (i + 1)).style.marginLeft = (arrayx[i][pos] * 5) + 100 + 'px';
            }
            pos++;
        }
    }
}

