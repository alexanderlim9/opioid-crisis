function randomData(samples) {
  var data = [];
  // var random = d3.randomNormal();

  samples.forEach(function (state) {


    console.log(state)
    let stateData = [];
    let stateName = state["state"];

    for (var j = 0; j < state["year"].length; j++) {
      console.log(state["year"][j]);
      stateData.push({
          x: state["year"][j],
          y: state["deaths"][j]
      });
    }
    data.push({
      [stateName]: stateData
    });
  })
  console.log(data);
  return data;
}

var jsonData = [
  {
    "state": "AL",
    "year": [
      1999,
      2000,
      2001,
      2002,
      2003,
      2004,
      2005,
      2006,
      2007,
      2008,
      2009,
      2010,
      2011,
      2012,
      2013,
      2014,
      2015,
      2016
    ],
    "deaths": [
      169,
      197,
      216,
      211,
      197,
      283,
      283,
      398,
      511,
      607,
      630,
      547,
      552,
      562,
      598,
      723,
      736,
      756
    ]
  },
  {
    "state": "AK",
    "year": [
      1999,
      2000,
      2001,
      2002,
      2003,
      2004,
      2005,
      2006,
      2007,
      2008,
      2009,
      2010,
      2011,
      2012,
      2013,
      2014,
      2015,
      2016
    ],
    "deaths": [
      46,
      48,
      62,
      84,
      83,
      86,
      79,
      76,
      72,
      127,
      131,
      83,
      107,
      129,
      105,
      124,
      122,
      128
    ]
  }
]
var data = randomData(jsonData);
console.log(data);


// ...............
// var data;

// fetch('deaths_by_state_and_year.json')
//   .then(res => res.json())
//   .then(result => data = result)
//   .then(() => {
//     console.log(data);
//     randomData(data);
//   });
// ...............


/*********************** Plot Below *********************/
var margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 50
};
width = 800 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

var xScale = d3.scaleLinear()
  .range([0, width])
  .domain(d3.extent(data, function (d) {
    return d.x;
  })).nice();

var yScale = d3.scaleLinear()
  .range([height, 0])
  .domain(d3.extent(data, function (d) {
    return d.y;
  })).nice();

var xAxis = d3.axisBottom(xScale).ticks(12),
  yAxis = d3.axisLeft(yScale).ticks(12 * height / width);

var plotLine = d3.line()
  .curve(d3.curveMonotoneX)
  .x(function (d) {
    return xScale(d.x);
  })
  .y(function (d) {
    return yScale(d.y);
  });

var svg = d3.select("#plot").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

svg.append("g")
  .attr("class", "x axis ")
  .attr('id', "axis--x")
  .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
  .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr('id', "axis--y")
  .call(yAxis);

var line = svg.append("path").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .data([data])
  .attr("d", plotLine)
  .attr("stroke", "brown")
  .attr("stroke-width", "2")
  .attr("fill", "none");

var totalLength = line.node().getTotalLength();

line.attr("stroke-dasharray", totalLength + " " + totalLength)
  .attr("stroke-dashoffset", totalLength)
  .transition()
  .duration(2000)
  .ease(d3.easePolyInOut)
  .attr("stroke-dashoffset", 0)
  .on('end', changeStyle);

function changeStyle() {
  line.attr("stroke-dasharray", "4,4");
}


/****************** Update Below **************************/
d3.select("#update").on('click', update);

function update() {

  let newData = randomData(50);

  xScale.domain(d3.extent(newData, function (d) {
    return d.x;
  })).nice();
  yScale.domain(d3.extent(newData, function (d) {
    return d.y;
  })).nice();

  line.datum(newData)
    .transition().duration(750)
    .attr("d", plotLine)
    .style("fill", "none")
    .style("stroke-width", "2px")
    .style("stroke", "brown");
}

