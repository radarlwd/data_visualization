var xMax = { "value": 600.2 };
var yMax = { "value": 0 };
var yLabels = { abs_pos: "abs_pos (m)", CO: "CO (mg/s)", NOx: "NOx (mg/s)", fuel: "fuel (ml/s)", PMx: "PMx (mg/s)", speed: "speed (m/s)" };
var selectedType;
var duration = 5000;
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
    .defined(function (d) { return selectedType != 'abs_pos' || d.y > 1; }) //avoid connecting the end point in one cyle to the start point of the next cycle
    .x(function (d) { return x(d.x); })
    .y(function (d) { return y(d.y); });

var svg = d3.select("#lineGraph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// *********************************
d3.csv("desired_data.csv", function (error, data) {
    if (error) throw error;
    // console.log(data);

    var typeMap = {
        "abs_pos": { "x": data.time, "y": data.abs_pos, "id": data.id },
        "time": { "x": data.time, "y": data.index, "id": data.id }
    };
    console.log(data);

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

    var yLabel = svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Value");

    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("x", width / 2)
        .attr("y", height + margin.bottom)
        .text("Timestep (sec.)");

    // selectbutton ********************************************

    // List of groups (here I have one group per column)
    var num_cars = d3.map(data, function (d) { return (d.id) }).keys()
    var parameterGroup = ['Parameters', 'abs_pos', 'CO', 'NOx', 'fuel', 'PMx', 'speed'];
    var modelGroup = ['Models', 'model1', 'model2'];
    var numberArray = [];
    for (var i = 1; i <= num_cars.length; i++) {
        numberArray.push(i);
    }
    numberArray.unshift("Number of Vehicles");

    // add the options to the button
    d3.select("#selectModelButton")
        .selectAll('myOptions')
        .data(modelGroup)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button
        .each(function (d) {
            if (d === "Models") {
                d3.select(this).property("disabled", true)
            }
        });

    // add the options to the button
    d3.select("#selectTypeButton")
        .selectAll('myOptions')
        .data(parameterGroup)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button
        .each(function (d) {
            if (d === "Parameters") {
                d3.select(this).property("disabled", true)
            }
        });

    // add the options to the button
    d3.select("#selectNumButton")
        .selectAll('myOptions')
        .data(numberArray)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button
        .each(function (d) {
            if (d === "Number of Vehicles") {
                d3.select(this).property("disabled", true)
            }
        });

    var availableTime = 0;

    //************select button animation****************
    // A function that update the chart
    var numLines = numberArray[0];
    function update(selectedOption) {

        d3.selectAll(".line").remove();
        d3.select(".line").remove();
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
        // curYMax = Math.ceil(curYMax);

        // update axis based on selection
        y = d3.scaleLinear()
            .domain([0, curYMax])
            .range([height, 0]);

        yAxis = d3.axisLeft()
            .scale(y);

        svg.selectAll("g.y.axis")
            .call(yAxis);

        yLabel.text(yLabels[selectedType]);

        // nest ****************************************************
        console.log("update selection " + selectedOption);
        // Nest the entries by symbol
        var dataNest = d3.nest()
            .key(function (d) { return d.id; })// use as key
            // .entries(data);
            .entries(dataToPlot);


        var color = d3.scaleOrdinal(d3.schemeCategory10);  // set the colour scale

        var remainingTime = numLines;
        // Loop through each symbol / key
        dataNest.forEach(function (d) {

            if (remainingTime > 0) {
                --remainingTime;
                console.log("added line " + availableTime);
                // ***************************
                var path = svg.append("path")
                    .datum(data)
                    .attr("class", "line")
                    .attr("d", line(d.values))//
                    .style("stroke", function () { // Add dynamically
                        return d.color = color(d.key);
                    })

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
            }
            else {
                console.log("no more!!!!!!!!!!!!!!!!!!!!")
            }
        });
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectTypeButton").on("change", function (d) {
        //   // recover the option that has been chosen
        selectedType = d3.select(this).property("value");
        //   // run the updateChart function with this selected option
        update(selectedType);
    })

    // When the button is changed, run the updateChart function
    d3.select("#selectNumButton").on("change", function (d) {
        //   // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        //   // run the updateChart function with this selected option
        numLines = selectedOption;
        console.log("I have " + numLines + " lines.");
        // d3.select(".line").remove();
        update(selectedType);

    })

    // Slider
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    output.innerHTML = slider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
        output.innerHTML = this.value;
        duration = 1 / this.value * 100000;
    }

});