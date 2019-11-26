var xMax = { "value": 600.2 };
var yMax = { "value": 0 };
var yLabels = { abs_pos: "abs_pos (m)", CO: "CO (mg/s)", NOx: "NOx (mg/s)", fuel: "fuel (ml/s)", PMx: "PMx (mg/s)", speed: "speed (m/s)" };
var yLabel;
var graphTitle;

var curParameter;
var curData = "";
var curDataFile = "";// global var in file_list.js

var algorithmDropdown;
var parameterDropdown;
var numDropdown;

var duration = 50000;
const GRAPH_WIDTH = 800 // ADJUST
const GRAPH_HEIGHT = 300 // ADJUST
var margin = { top: 60, right: 20, bottom: 30, left: 50 }, // ADJUST
    width = GRAPH_WIDTH - margin.left - margin.right,
    height = GRAPH_HEIGHT - margin.top - margin.bottom;

var x = d3.scaleLinear()
    .domain([0, xMax.value])
    .range([0, width]);

var y = d3.scaleLinear()
    .domain([0, yMax.value])
    .range([height, 0]);

var xAxis = d3.axisBottom()
    .scale(x);

var yAxis = d3.axisLeft()
    .scale(y);


var line = d3.line()
    // .defined(function (d) { return selectedType != 'abs_pos' || d.y > 1; }) //avoid connecting the end point in one cyle to the start point of the next cycle
    .x(function (d) { return x(d.x); })
    .y(function (d) { return y(d.y); });

var svg = d3.select("#lineGraph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function addLine() {

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")

    yLabel = svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Value");

    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easier to center the text as the transform is applied to the anchor
        .attr("x", width / 2)
        .attr("y", height + margin.bottom)
        .text("Timestep (sec.)");

    graphTitle = svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Value vs Timestep Graph");
}

function addButtons() {
    var algorithmGroup = ['Algorithm'];
    for (i = 0; i < FILE_LIST.length; ++i) { //FILE_LIST is a 
        algorithmGroup.push(FILE_LIST[i]);
    }
    var setupGroup = ['Setup', '1 car', '2 cars'];
    var parameterGroup = ['Parameter', 'abs_pos', 'CO', 'NOx', 'fuel', 'PMx', 'speed'];

    // add the options to the button
    algorithmDropdown = d3.select("#selectAlgorithmButton")
        .selectAll('myOptions')
        .data(algorithmGroup)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button
        .each(function (d) {
            if (d === "Algorithm") {
                d3.select(this).property("disabled", true)
            }
        });

    // add the options to the button
    setupDropdown = d3.select("#selectSetupButton")
        .selectAll('myOptions')
        .data(setupGroup)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button
        .each(function (d) {
            if (d === "Setup") {
                d3.select(this).property("disabled", true)
            }
        });

    // add the options to the button
    parameterDropdown = d3.select("#selectParameterButton")
        .selectAll('myOptions')
        .data(parameterGroup)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button
        .each(function (d) {
            if (d === "Parameter") {
                d3.select(this).property("disabled", true)
            }
        });

    // When the button is changed, run the updateChart function
    d3.select("#selectAlgorithmButton").on("change", function (d) {
        var curr = d3.select(this).property("value");
        if (curr != curDataFile) {

            curDataFile = curr;
            d3.csv(curDataFile, function (error, data) {
                if (error) throw error;
                curData = data;
                updateGraph(curParameter, curData);
            });
        }
    })

    // When the button is changed, run the updateChart function
    d3.select("#selectParameterButton").on("change", function (d) {
        // recover the option that has been chosen
        curParameter = d3.select(this).property("value");
        // run the updateChart function with this selected option

        updateGraph(curParameter, curData);
    })
}

// A function that update the chart
function updateGraph(selectedOption, data) {
        // var typeMap = {
    //     "abs_pos": { "x": data.time, "y": data.abs_pos, "id": data.id },
    //     "time": { "x": data.time, "y": data.index, "id": data.id }
    // };
    d3.selectAll(".line").remove();
    d3.select(".line").remove();
    updateDropDownOptions(data);
    var dataToPlot = [];
    var curYMax = Number.NEGATIVE_INFINITY;

    if (selectedOption == "abs_pos") {
        for (i = 0; i < data.length; ++i) {
            dataToPlot.push({ "id": data[i].id, "x": data[i].time, "y": data[i].abs_pos });
        }
        curYMax = data.reduce((max, b) => Math.max(max, b.abs_pos), data[0].abs_pos);
    } else if (selectedOption == "CO") {
        for (i = 0; i < data.length; ++i) {
            dataToPlot.push({ "id": data[i].id, "x": data[i].time, "y": data[i].CO });
        }
        curYMax = data.reduce((max, b) => Math.max(max, b.CO), data[0].CO);
    } else if (selectedOption == "NOx") {
        for (i = 0; i < data.length; ++i) {
            dataToPlot.push({ "id": data[i].id, "x": data[i].time, "y": data[i].NOx });
        }
        curYMax = data.reduce((max, b) => Math.max(max, b.NOx), data[0].NOx);
    } else if (selectedOption == "fuel") {
        for (i = 0; i < data.length; ++i) {
            dataToPlot.push({ "id": data[i].id, "x": data[i].time, "y": data[i].fuel });
        }
        curYMax = data.reduce((max, b) => Math.max(max, b.fuel), data[0].fuel);
    } else if (selectedOption == "PMx") {
        for (i = 0; i < data.length; ++i) {
            dataToPlot.push({ "id": data[i].id, "x": data[i].time, "y": data[i].PMx });
        }
        curYMax = data.reduce((max, b) => Math.max(max, b.PMx), data[0].PMx);
    } else if (selectedOption == "speed") {
        for (i = 0; i < data.length; ++i) {
            dataToPlot.push({ "id": data[i].id, "x": data[i].time, "y": data[i].speed });
        }
        curYMax = data.reduce((max, b) => Math.max(max, b.speed), data[0].speed);
    }

    // update axis based on selection
    y = d3.scaleLinear()
        .domain([0, curYMax])
        .range([height, 0]);

    yAxis = d3.axisLeft()
        .scale(y);

    svg.selectAll("g.y.axis")
        .call(yAxis);

    yLabel.text(yLabels[curParameter]);

    // update title
    graphTitle
        .text(curDataFile.substring(0, curDataFile.length / 2) + ": " + yLabels[curParameter] + " vs. Time(sec.)");

    // process each group using id's as keys
    var dataNest = d3.nest()
        .key(function (d) { return d.id; })// use as key
        // .entries(data);
        .entries(dataToPlot);


    var color = d3.scaleOrdinal(d3.schemeCategory10);  // set the colour scale


    var car_ids = d3.map(data, function (d) { return (d.id) }).keys();
    var matches = [];
    var opacities = [];
    for (i = 0; i < car_ids.length; ++i) {
        var myRegex = /(.*)(_)(\d)*/g;
        var match = myRegex.exec(car_ids[i]);
        matches.push(match[1]);
    }
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    var uniqueMatches = matches.filter(onlyUnique);

    for (i = 0; i < matches.length; ++i) {
        for (j = 0; j < uniqueMatches.length; ++j) {
            if (matches[i] == uniqueMatches[j]) {
                opacities.push(Math.pow(0.5, j + 0.5));
                break;
            }
        }
    }
    // console.log("opacity" + opacities);


    // Loop through each symbol / key
    count = 0;
    dataNest.forEach(function (d) {

        var path = svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line(d.values))//
            .style("stroke", function () { // Add dynamically
                // return d.color = color(d.key);
                return d.color = color(matches[count]);
            })
            .style("opacity", function () {
                return opacities[count];
            })
        count += 1;

        // Variable to Hold Total Length
        var totalLength = path.node().getTotalLength();

        // Set Properties of Dash Array and Dash Offset and initiate Transition
        path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition() // Call Transition Method
            .duration(duration) // Set Duration timing (ms) 500000
            .ease(d3.easeLinear) // Set Easing option
            .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition


    });
}

function updateDropDownOptions(data) {

    // var select = document.getElementById('selectNumButton');
    // console.log("delete total len = " + select.options.length);
    // for (var i = 0; i < select.options.length; i++) {
    //     console.log("delete" + select.options[i].value);
    //     select.remove(i);
    // }

    // d3.select("#selectNumButton")
    //     .selectAll('myOptions')
    //     .data(numberArray)
    //     .enter()
    //     .append('option')
    //     .text(function (d) { return d; }) // text showed in the menu
    //     .attr("value", function (d) { return d; }) // corresponding value returned by the button
    //     .each(function (d) {
    //         if (d === "Number of Vehicles") {
    //             d3.select(this).property("disabled", true)
    //         }
    //     });

}

function launch() {
    addLine();
    addButtons();
}
launch();
