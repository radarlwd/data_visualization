var arrayx = [];
var arrayy = [];
var xtemp = [];
var ytemp = [];
var position = 0;
var id = 'AUG_0';
var length = 0;
var cars = 0;
var autocars = 0;
d3.csv("pos_data.csv", function(data) {
    length = data.length;
    // console.log(data.length)
    while (position < length) { 
        // console.log(position)
        id = data[position].id;
        console.log(id.substr(0,3))
        if (id.substr(0, 3) === 'IDM') {
            cars++
        } else {
            autocars++
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
    }
    console.log(cars)
    console.log(autocars)
});

function ballCircle() {
       var element1 = document.getElementById('ball1');
       var element2 = document.getElementById('ball2');
       var element3 = document.getElementById('ball3');
       var element4 = document.getElementById('ball4');
       var element5 = document.getElementById('ball5');
       var element6 = document.getElementById('ball6');
       var element7 = document.getElementById('ball7');
       var element8 = document.getElementById('ball8');
       var element9 = document.getElementById('ball9');
       var element10 = document.getElementById('ball10');
       var element11 = document.getElementById('ball11');
       var element12 = document.getElementById('ball12');
       var element13 = document.getElementById('ball13');
       var element14 = document.getElementById('ball14');
       var element15 = document.getElementById('ball15');
       var element16 = document.getElementById('ball16');
       var element17 = document.getElementById('ball17');
       var element18 = document.getElementById('ball18');
       var element19 = document.getElementById('ball19');
       var element20 = document.getElementById('ball20');
       var element21 = document.getElementById('ball21');
       var element22 = document.getElementById('ball22');
    
       var id = setInterval(frame, 5)
       var pos = 0;
       function frame() {
            for (i = 1; i < 23; i++) {
                eval('element' + i).style.display = "block";
            }
            if (pos >= length) {
                clearInterval(id);
            } else {
                for (i = 0; i < 22; i++) {
                    eval('element' + (i + 1)).style.marginTop = (arrayy[i][pos] * 5) + 100 + 'px';
                    eval('element' + (i + 1)).style.marginLeft = (arrayx[i][pos] * 5) + 100 + 'px';
                }
                pos++;
            }
        }
}
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.lineWidth = 30;
ctx.beginPath();
ctx.strokeStyle = "#00BFFF"
ctx.arc(310, 268, 215, 0, 2 * Math.PI);
ctx.stroke();
