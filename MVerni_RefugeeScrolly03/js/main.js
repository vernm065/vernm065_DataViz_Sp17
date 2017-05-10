var oldWidth = 0

var margin = {top: 20, right: 20, bottom: 300, left: 40}

function render(){
  if (oldWidth == innerWidth) return
  oldWidth = innerWidth
  var width = d3.select('#graph').node().offsetWidth - margin.left - margin.right,
    height = innerWidth > 925 ? width : innerHeight*.5,
    r = 40

  var svgLine = d3.select('#graph').html('')
    .append('svg')
    .attrs({width: width + margin.left + margin.right, height: height + margin.top + margin.bottom})
    .append('g')
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);
  var y = d3.scaleLinear()
    .range([height, 0]);

  var dataOne = [];
  var dataTwo = [];
  var dataThree = [];
  var dataFour = [];
  var dataFive = [];


  d3.csv("data/data.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d,n) {
      var activity = d["Activity"];
      dataOne.push({
        Activity: activity,
        Data:d[2004]
      });
      dataTwo.push({
        Activity: activity,
        Data:d[2010]
      });

      dataThree.push({
        Activity: activity,
        Data:d[2014]
      });

       dataFour.push({
        Activity: activity,
        Data:d[2015]
      });
        dataFive.push({
        Activity: activity,
        Data:d[2017]
      });

    });

    drawInit(dataOne);

    function drawInit(data){

      x.domain(data.map(function(d) { return d.Activity; }));
      y.domain([0, d3.max(data, function(d) { return d.Data; })]);

      svgLine.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.Activity); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.Data); })
        .attr("height", function(d) { return height - y(d.Data);});

      svgLine.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 8)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

      // add the y Axis
      svgLine.append("g")
        .call(d3.axisLeft(y));
    }

    //  redraw the bars on the chart for different years. call this function during scroll below
    function redraw(data){
      // console.log("hello im redrawing")
      console.log(data[16]);

      y.domain([0, d3.max(data, function(d) { return d.Data; })]);

      var bar = svgLine.selectAll(".bar").data(data);
      console.log(bar);

      bar.enter()
      .append("rect")
        .attr("class", "bar")
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .attr("x", function(d) { return x(d.Activity); })
        .attr("y", y(0));

      bar.transition()
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.Data);})
        .attr("x", function(d) { return x(d.Activity); })
        .attr("y", function(d) { return y(d.Data); });

      bar.exit()
        .transition()
        .attr("y", y(0))
        .attr("height", 0)
        .remove();

      // svgLine.selectAll(".bar")
      // .data(data)
      // .transition()
      // .duration(1500)
      // .call(y)
      // .selectAll("text")
      // .style("text-anchor","end");
    }

    //redraw chart depending on scroll
    var gs = d3.graphScroll()
      .container(d3.select('#container'))
      .graph(d3.selectAll('#graph'))
      .sections(d3.selectAll('#sections > div'))
      .on('active', function(i){
        console.log("Section " + i + " is active");
        if (i== 0) {
          redraw(dataOne);
        }
        else if(i==1){
          redraw(dataTwo);
        }
        else if(i==2){
          redraw(dataThree);
        }
           else if(i==3){
          redraw(dataFour);
        }
           else if(i==4){
          redraw(dataFive);
        }
      });
  });
};

render();
d3.select(window).on('resize', render)
