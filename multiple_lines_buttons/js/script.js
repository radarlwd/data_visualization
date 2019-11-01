var margin = { top: 60, right: 20, bottom: 30, left: 50 },
    // width = 700 - margin.left - margin.right,
    width = 1000 - margin.left - margin.right,
    height = 365 - margin.top - margin.bottom;

var x = d3.scaleLinear()
    .domain([0, 600.2])
    .range([0, width]);

var y = d3.scaleLinear()
    .domain([0, 260])
    .range([height, 0]);

var xAxis = d3.axisBottom()
    .scale(x);

var yAxis = d3.axisLeft()
    .scale(y);


var line = d3.line()
    .x(function (d) { return x(d.time); })
    .y(function (d) { return y(d.abs_pos); });
    // .x(function (d) { return x(d.x); })
    // .y(function (d) { return y(d.y); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// *********************************


d3.csv("id_abspos_time_0_1.csv", function (error, data) {
    if (error) throw error;
    console.log(data);

    // var typeMap = {"abs_pos" : {"values": {"x": data.time, "y": data.abs_pos}},
    //             "time": {"values": {"x": data.time, "y": data.index}}};
    // x.domain(d3.extent(data, function (d) { return d.index; }));
    // y.domain(d3.extent(data, function (d) { return d.abs_pos; }));

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
        .text("Unemployment Rate (%)");

    // selectbutton ********************************************

    // List of groups (here I have one group per column)
    var allGroup = d3.map(data, function (d) { return (d.id) }).keys()
    var numberArray = [];
    for (var i = 1; i <= allGroup.length; i++) {
        numberArray.push(i);
    }
    // add the options to the button
    d3.select("#selectTypeButton")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // add the options to the button
    d3.select("#selectNumButton")
        .selectAll('myOptions')
        .data(numberArray)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // A color scale: one color for each group
    // var myColor = d3.scaleOrdinal()
    //   .domain(allGroup)
    //   .range(d3.schemeSet2);

    // //*********************************************************

    var availableTime = 0;

    // Reset Animation
    // d3.select("#reset").on("click", function () {
    // if (availableTime > 0) {
    //     d3.select(".line").remove();

    //     availableTime--;

    //     var ts = new Date();
    //     console.log(ts.toLocaleString() + "haha");
    // } else {
    //     console.log("No more line to delete!");
    // };

    // });

    //************select button animation****************
    // A function that update the chart
    var numLines = numberArray[0];
    function update(selectedGroup) {

        // Create new data with the selection?
        // var dataFilter = data.filter(function(d){return d.name==selectedGroup})

        // Give these new data to update line
        // line
        //     .datum(dataFilter)
        //     .transition()
        //     .duration(1000)
        //     .attr("d", d3.line()
        //       .x(function(d) { return x(d.year) })
        //       .y(function(d) { return y(+d.n) })
        //     )
        //     .attr("stroke", function(d){ return myColor(selectedGroup) })

        //************************** single line start*****************************************
        // var color = d3.scaleOrdinal(d3.schemeCategory10);  // set the colour scale    
        // var path = svg.append("path")
        //         .datum(data)
        //         .attr("class", "line")
        //         // .attr("d", line(d.values))
        //         .attr("d", line)
        //         // .style("stroke", function () { // Add dynamically
        //         //     return d.color = color(d.key);
        //         // })
        //     // .attr("d", line(d.values));

        //     // Variable to Hold Total Length
        //     var totalLength = path.node().getTotalLength();

        //     // Set Properties of Dash Array and Dash Offset and initiate Transition
        //     path
        //         .attr("stroke-dasharray", totalLength + " " + totalLength)
        //         .attr("stroke-dashoffset", totalLength)
        //         .transition() // Call Transition Method
        //         .duration(4000) // Set Duration timing (ms) 500000
        //         .ease(d3.easeLinear) // Set Easing option
        //         .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition
        //************************single line end */



        //**************************multiple lines */

        // nest ****************************************************
        console.log("update selection " + numLines);
        // Nest the entries by symbol
        var dataNest = d3.nest()
            .key(function (d) { return d.id; })// use as key
            .entries(data);

        var color = d3.scaleOrdinal(d3.schemeCategory10);  // set the colour scale

        // Loop through each symbol / key
        dataNest.forEach(function (d) {

            if (numLines > 0) {
                --numLines;
                console.log("added line " + availableTime);
                // ***************************
                var path = svg.append("path")
                    .datum(data)
                    .attr("class", "line")
                    .attr("d", line(d.values))//
                    .style("stroke", function () { // Add dynamically
                        return d.color = color(d.key);
                    })
                // .attr("d", line(d.values));

                // Variable to Hold Total Length
                var totalLength = path.node().getTotalLength();

                // Set Properties of Dash Array and Dash Offset and initiate Transition
                path
                    .attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .transition() // Call Transition Method
                    .duration(4000) // Set Duration timing (ms) 500000
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
        var selectedOption = d3.select(this).property("value")
        //   // run the updateChart function with this selected option
        update(selectedOption)
    })

    // When the button is changed, run the updateChart function
    d3.select("#selectNumButton").on("change", function (d) {
        //   // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        //   // run the updateChart function with this selected option
        numLines = selectedOption;
        console.log("I have " + numLines + " lines.");
    })

});