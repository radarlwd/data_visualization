
function retrieveData(data) {
    var xarray = [];
    var yarray = [];
    var aArray = []
    var xtemp = [];
    var ytemp = [];
    var angles = [];
    var arrayreg = [];
    var arrayauto = [];
    var position = 0;
    var id = '';
    var length = 0;
    var cars = 0;
    var autocars = 0;
    var iteration = 0;
    length = data.length;
    console.log(data.length)
    while (position < length) { 
        id = data[position].id;
        if (id.substr(0, 3) === 'IDM') {
            cars++
            arrayreg.push(iteration);
        } else {
            autocars++
            arrayauto.push(iteration);
        }
      
            
        while (position < length && id === data[position].id) {
            xtemp.push(data[position].x);
            ytemp.push(data[position].y);
            angles.push(data[position].angle);
            position++;
        }
        xarray.push(xtemp);
        yarray.push(ytemp);
        aArray.push(angles);
        xtemp = [];
        ytemp = [];
        angles = [];
        iteration++
    }
    console.log("x", xarray);
    console.log("y", yarray);
    console.log("ang", aArray)
    console.log("arrayreg", arrayreg);
    console.log("arrayauto", arrayauto);
    return [xarray, yarray, aArray, arrayreg, arrayauto];
}

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.lineWidth = 38;
ctx.beginPath();
ctx.arc(313, 270, 250, 0, 2 * Math.PI);
ctx.strokeStyle = "#808080";
ctx.stroke();


function createelements(arrayreg, arrayauto) {
    var namesofreg = [];
    var namesofauto = [];
    for (i = 0; i < arrayreg.length; i++) {
        var obj = document.createElement('div');
        obj.className = "images";
        var otherobj = document.createElement("IMG");
        otherobj.id = ('IDM' + (arrayreg[i]));
        namesofreg.push('IDM' + (arrayreg[i]));
        otherobj.setAttribute('src', 'yellow_car.png');
        otherobj.style.position = "absolute";
        obj.appendChild(otherobj);
        document.getElementById("car-container").appendChild(obj);
    }
    for (i = 0; i < arrayauto.length; i++) {
        var obj = document.createElement('div');
        obj.className = "images";
        var otherobj = document.createElement("IMG");
        otherobj.id = ('AUTO' + (arrayauto[i]));
        namesofauto.push('AUTO' + (arrayauto[i]))
        otherobj.setAttribute('src', 'blue_car.png');
        otherobj.style.position = "absolute";
        obj.appendChild(otherobj);
        document.getElementById("car-container").appendChild(obj);
    }
    return [namesofreg, namesofauto];
    // console.log(namesofreg);
    // console.log(namesofauto);
}

function carCircle(arrayreg, arrayauto, xarray, yarray, aArray) {
    console.log(xarray)
    console.log(yarray)
    var created = true;
    var time = true;
    var namesofreg;
    var namesofauto;
    console.log(created);
    if (created) {
        created = false;
        var tempList = createelements(arrayreg, arrayauto);
        namesofreg = tempList[0]; 
        namesofauto = tempList[1];
        console.log('cars created!');
    } else {
        console.log('cars already created!');
    }
    if (time) {
        var id = setInterval(frame, 10);
        console.log("framed")
        time = false;
    }
    var pos = 0;
    function frame() {
        if (pos >= xarray[0].length) {
            console.log("cleared")
            clearInterval(id);
            time = true;
        } else {
            changeverticalTimeLinePos(pos*0.1);
            for (i = 0; i < namesofreg.length; i++) {
                eval(namesofreg[i]).style.marginLeft = xarray[arrayreg[i]][pos] * 5.85 + 70 + 'px';
                eval(namesofreg[i]).style.marginTop = yarray[arrayreg[i]][pos] * 5.85 + 60 + 'px';
                eval(namesofreg[i]).style.transform = 'rotate('+ (-aArray[arrayreg[i]][pos]) +'deg)';
            }
            for (i = 0; i < namesofauto.length; i++) {
                eval(namesofauto[i]).style.marginLeft = xarray[arrayauto[i]][pos] * 5.85 + 70 + 'px';
                eval(namesofauto[i]).style.marginTop = yarray[arrayauto[i]][pos] * 5.85 + 60 + 'px';
                eval(namesofauto[i]).style.transform = 'rotate('+ (-aArray[arrayauto[i]][pos]) +'deg)';
            }
           
        }
        pos++;
    }
}
