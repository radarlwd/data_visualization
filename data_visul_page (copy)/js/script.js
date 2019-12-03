var xMax = { "value": 600.2 };
var yMax = { "value": 0 };
var yLabels = { abs_pos: "abs_pos (m)", CO: "CO (mg/s)", NOx: "NOx (mg/s)", fuel: "fuel (ml/s)", PMx: "PMx (mg/s)", speed: "speed (m/s)" };
var yLabel;
var graphTitle;
var lineColors;

var curParameter;
var curData = "";
var curDataFile = "";// global var in file_list.js
var curAlgorithm;
var curSetup;

var allCheckboxVal = false;

var algorithmDropdown;
var parameterDropdown;
var numDropdown;

var duration = 500;
const GRAPH_WIDTH = 800 // ADJUST
const GRAPH_HEIGHT = 300 // ADJUST
var margin = { top: 60, right: 20, bottom: 60, left: 50 }, // ADJUST
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

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

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
        .attr("x", width - margin.left)
        .attr("y", height + margin.bottom)
        .text("Time (sec.)");

    graphTitle = svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("text-decoration", "underline")
        .style("font-weight", "bold")
        .text("Value vs. Time");

}

function addCarCheckboxes(car_names) {
    // for (i = 0; i < 22; ++i) {
    //     var checkbox = document.createElement("input");
    //     checkbox.type = "checkbox";
    //     checkbox.id = "carCheck" + i;
    //     document.getElementById("btn_group2").appendChild(checkbox);

    //     var label = document.createElement("Label");
    //     label.setAttribute("for", "carCheck" + i);
    //     label.innerHTML = "car" + i;
    //     document.getElementById("btn_group2").appendChild(label);
    // }
    // str = "<label class="container">Two, <input type="checkbox">, <span class="checkmark">,</span> </label>";

    var allCheckbox = $(`<label id = "allCheckbox" class="container"> ALL <input type="checkbox"> <span class="checkmark"></span> </label>`);
    $("#btn_group2").append(allCheckbox);


    for (i = 0; i < car_names.length; ++i) {
        var $checkbox = $(`<label class="container">` + car_names[i] + `<input type="checkbox"> <span class="checkmark"></span> </label>`);
        $("#btn_group2").append($checkbox);
        $checkbox.on("change", function (d) {

            var childN = document.getElementById("btn_group2").childNodes;
            for (i = 0; i < childN.length; ++i) {
                childN[i].style.color = "#000000";
            }
            if (!this.childNodes[1].checked) {
                childN[0].childNodes[1].checked = false;
            }
        })
    }
    d3.select("#allCheckbox").on("change", function (d) {
        allCheckboxVal = !this.childNodes[1].checked;

        var childN = document.getElementById("btn_group2").childNodes;
        for (i = 0; i < childN.length; ++i) {
            childN[i].childNodes[1].checked = this.childNodes[1].checked;
            childN[i].style.color = "#000000";
        }

    })
}

function deleteCarCheckboxes() {
    const myNode = document.getElementById("btn_group2");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

function getCarCheckedValues() {
    // const myNode = document.getElementById("btn_group2");
    // while (myNode.firstChild) {
    //     myNode.removeChild(myNode.firstChild);
    // }
    var selectedOpts = [];
    var childN = document.getElementById("btn_group2").childNodes;
    for (i = 0; i < childN.length; ++i) {
        if (childN[i].childNodes[1].checked == true) {
            selectedOpts.push(childN[i].textContent.trim());

        }
    }
    return selectedOpts;
}

//change color based on the color scheme
function updateTextCheckboxes() {
    var childN = document.getElementById("btn_group2").childNodes;
    var color = d3.scaleOrdinal(d3.schemeCategory10);  // set the colour scale
    for (i = 0; i < childN.length; ++i) {
        if (childN[i].childNodes[1].checked == true) {
            var myRegex = /(.*)(_)(.*)/g;
            var match = myRegex.exec(childN[i].firstChild.textContent);
            if (match != undefined) {
                childN[i].style.color = color(match[1]);
            }
        }
    }
}

function addButtons() {
    var algorithmGroup = ['Algorithm'];
    var setupGroup = ['Setup'];
    var parameterGroup = ['Parameter', 'abs_pos', 'CO', 'NOx', 'fuel', 'PMx', 'speed'];
    var filename_dict = {};
    var algo_setup_dict = {};
    extractAlgorithmsAndSetups(algorithmGroup, filename_dict, algo_setup_dict, FILE_LIST);

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
        })
    setupDropdown.property("disabled", true);

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

    parameterDropdown.property("disabled", true);

    // When the button is changed, run the updateChart function
    d3.select("#selectAlgorithmButton").on("change", function (d) {
        var curr = d3.select(this).property("value");
        curAlgorithm = curr;
        // d3.select("#selectParameterButton").property("disabled", false);

        var select = document.getElementById('selectSetupButton');
        var length = select.options.length
        while (select.options.length > 1) {
            select.remove(1);
        }

        var option = document.createElement("option");

        for (var i = 0; i < algo_setup_dict[curr].length; i++) {
            var option = document.createElement("option");
            option.text = algo_setup_dict[curr][i];
            option.value = algo_setup_dict[curr][i];
            select.add(option);
        }
        var myDDL1 = $('#selectSetupButton');
        myDDL1[0].selectedIndex = 0;
        var myDDL2 = $("#selectParameterButton");
        myDDL2[0].selectedIndex = 0;
        deleteCarCheckboxes();

    })

    d3.select("#selectSetupButton").on("change", function (d) {
        var key = d3.select("#selectAlgorithmButton").property("value") + d3.select(this).property("value");
        var curr = filename_dict[key];
        if (curr != curDataFile) {
            curDataFile = curr;
            d3.csv(curDataFile, function (error, data) {
                if (error) throw error;
                curData = data;
                curSetup = d3.select("#selectSetupButton").property("value");
                parameterDropdown.property("disabled", false);
                parameterDropdown.each(function (d) {
                    if (d === "Parameter") {
                        d3.select(this).property("disabled", true)
                    }
                });

                var car_ids = d3.map(data, function (d) { return (d.id) }).keys();

                deleteCarCheckboxes();
                addCarCheckboxes(car_ids);
            });
        }
    })

    // d3.select("#selectParameterButton").property("disabled", false);
    d3.select("#startButton").on("click", function (d) {
        console.log("start!!!!");
        updatePage(curParameter, curData, getCarCheckedValues());
        updateTextCheckboxes();
    })


    // When the button is changed, run the updateChart function
    d3.select("#selectParameterButton").on("change", function (d) {
        // recover the option that has been chosen
        curParameter = d3.select(this).property("value");
    })
}

function updatePage(selectedOption, data, selectedKeys) {
    d3.selectAll(".line").remove();
    d3.select(".line").remove();
    d3.select("#vertical_time_line").remove();
    d3.select("#vertical_time_line_text").remove();

    updateDropDownOptions(data);
    var dataToPlot = [];
    var curYMax = Number.NEGATIVE_INFINITY;
    var selectedData; //cars selected

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
        .text(curAlgorithm + " (" + curSetup + "): " + yLabels[curParameter] + " vs. Time(s.)")

    // process each group using id's as keys
    var dataNest = d3.nest()
        .key(function (d) { return d.id; })// use as key
        // .entries(data);
        .entries(dataToPlot);

    selectedData = dataNest;
    if (selectedKeys[0] != "ALL") {
        var filtered = dataNest.filter(
            function (e) {
                return this.indexOf(e["key"]) >= 0;
            },
            selectedKeys
        );
        selectedData = filtered;

    }

    // ***************************************************
    // get all cars' ids
    var car_ids = d3.map(data, function (d) { return (d.id) }).keys();
    var matches = [];
    var opacities = [];

    // extract the type of the id (excluding the number)
    for (i = 0; i < car_ids.length; ++i) {
        var myRegex = /(.*)(_)(\d)*/g;
        var match = myRegex.exec(car_ids[i]);
        matches.push(match[1]);// eg. extract "IDM" from "IDM_01"
    }

    // get all unique ids
    var uniqueMatches = matches.filter(onlyUnique);

    // use differnt opacities based on different type of ids
    for (i = 0; i < matches.length; ++i) {
        for (j = 0; j < uniqueMatches.length; ++j) {
            if (matches[i] == uniqueMatches[j]) {
                opacities.push(Math.pow(0.4, j + 0.9));
                break;
            }
        }
    }

    updateGraph(selectedData, opacities);

    // TODO: CALL RING function here.
    // startRing();
    // You mayt need the following var
    // selectedKeys: selected car
    // dataNest: data grouped by car ID
}

function updateLineColors(dataGroups) {
    var color = d3.scaleOrdinal(d3.schemeCategory10);  // set the colour scale
    lineColors = [];
    for (i = 0; i < dataGroups.length; ++i) {
        var myRegex = /(.*)(_)(.*)/g;
        var match = myRegex.exec(dataGroups[i].key);
        lineColors.push(color(match[1]));
    }
}

// A function that updates the chart
function updateGraph(dataGroups, opacities) {
    updateLineColors(dataGroups);
    // Loop through each symbol / key
    count = 0;


    dataGroups.forEach(function (d, i) {

        var path = svg.append("path")
            .datum(dataGroups)
            .attr("class", "line")
            .attr("d", line(d.values))//
            .style("stroke", function () { // Add dynamically
                // return d.color = color(d.key);
                return d.color = lineColors[count];

            })
            .style("opacity", function () {
                return opacities[count];
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

        count += 1;

    });

    //Add vertical line time line
    var vertical_line_container = svg.append("g")
        .attr("class", "vertical_line_container")


    var vertical_time_line = vertical_line_container.append('line')
        // .attr('x1', vertLineXCoord)
        // .attr('y1', chartHeight - margins.top)
        // .attr('x2', vertLineXCoord)
        // .attr('y2', 0 + margins.top)
        .attr("id", "vertical_time_line")
        .attr('x1', 0)
        .attr('y1', GRAPH_HEIGHT - margin.top * 1.6)
        .attr('x2', 0)
        .attr('y2', 0)
        .style("stroke-width", 2)
        .style("stroke", "red")
        .style("fill", "none")

    vertical_line_container.append("text")
        .attr("id", "vertical_time_line_text")
        .attr("x", 0)
        .attr("y", GRAPH_HEIGHT - margin.top * 1.45)
        .attr('text-anchor', 'middle')
        .text("current time");
}

function updateDropDownOptions(data) {

}

function extractAlgorithmsAndSetups(algorithms, filename_dict, algo_setup_dict, file_strs) {
    //"data/IDM_AVRider_AUG--0IDM_22AUG--sugiyama_20191014-1314411571084081.113794-emission.csv"

    var algos = [];
    for (i = 0; i < file_strs.length; ++i) {
        var myRegex = /(.*\/)(.*)(--)(.*)(--)(.*)/g;
        var match = myRegex.exec(file_strs[i]);
        algos.push(match[2]);
        var algo_str = match[2];

        if (algo_setup_dict[algo_str] === undefined) {
            algo_setup_dict[algo_str] = [];
        }

        algo_setup_dict[algo_str].push(match[4]);

        var key = match[2] + match[4];
        filename_dict[key] = file_strs[i];
    }

    var uniqueAlgos = algos.filter(onlyUnique);
    for (i = 0; i < uniqueAlgos.length; ++i) {
        algorithms.push(uniqueAlgos[i]);
    }

}

//TODO: call this in the ring's setinterval
function changeverticalTimeLinePos(curr_x) {
    // curr_x is the time step in sec.
    if (curr_x < 600.2) {
        d3.select("#vertical_time_line")
            .attr("x1", curr_x)
            .attr("x2", curr_x)
        d3.select("#vertical_time_line_text")
            .attr("x", curr_x)
    }
}


//************************************************************
function startRing() {
    // TODO define ring here
}


function launch() {
    addLine();
    addButtons();
}
launch();
