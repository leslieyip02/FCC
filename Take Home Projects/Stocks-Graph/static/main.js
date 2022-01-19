const width = 1080;
const height = 400;

function render(input) {
  // Parse data
  let data = JSON.parse(input);
  // Create graph elements
  const graph = d3.select('#graph')
    .append('svg')
    .attr('width', width + 120)
    .attr('height', height + 80)
    .style('padding', 10);
  const tooltip = d3.select("#graph")
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0);
  
  // Find the domain for the dates and prices
  let format = d3.timeFormat('%Y-%m-%d');
  let parse = d3.timeParse('%Y-%m-%d')
  let xMin = format(Date.now());
  let xMax = '2000-01-01';
  let yMin = Infinity;
  let yMax = 0;
  for (let stock in data) {
    for (let i = 0; i < data[stock].length; i ++) {
      if (data[stock][i]["date"] < xMin) xMin = data[stock][i]["date"];
      if (data[stock][i]["date"] > xMax) xMax = data[stock][i]["date"];
      if (data[stock][i]["price"] < yMin) yMin = data[stock][i]["price"];
      if (data[stock][i]["price"] > yMax) yMax = data[stock][i]["price"];
    }
  }

  // Create scales and axes
  const yScale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([height, 0])
    .nice();
  const yAxis = d3.axisLeft(yScale);
  graph.append('g')
    .call(yAxis)
    .attr('class', 'yAxis')
    .attr('transform', 'translate(60, 20)')
    .attr('font-family', 'monospace')
    .attr('stroke','#0f380f')
    .attr('stroke-width','1');
  // Axis label
  graph.append('text')
    .attr('class', 'yLabel')
    .attr('text-anchor', 'end')
    .attr('x', 0)
    .attr('y', 20)
    .attr('transform', 'rotate(270)')
    .text('Price (USD)')
    .attr('font-family', 'monospace');

  const xScale = d3.scaleTime()
    .domain([parse(xMin), parse(xMax)])
    .range([0, width]);
  const xAxis = d3.axisBottom(xScale).tickFormat(format);
  graph.append('g')
    .call(xAxis)
    .attr('class', 'xAxis')
    .attr('transform', 'translate(60, 420)')
    .attr('font-family', 'monospace')
    .attr('stroke','#0f380f')
    .attr('stroke-width','1');
  // Axis label
  graph.append('text')
    .attr('class', 'xLabel')
    .attr('text-anchor', 'end')
    .attr('x', width)
    .attr('y', height)
    .attr('transform', 'translate(110, 24)')
    .text('Date')
    .attr('font-family', 'monospace');

  // Create grid
  d3.selectAll('g.yAxis g.tick')
    .append('line')
    .attr('class', 'gridline')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', width)
    .attr('y2', 0)
    .attr('stroke', '#8bac0f');
  d3.selectAll('g.xAxis g.tick')
    .append('line')
    .attr('class', 'gridline')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', -height)
    .attr('stroke', '#8bac0f');

  // Plot graph for each stock
  for (let stock in data) {
    // Plot line
    graph.append('path')
      .attr('class', 'line')
      .datum(data[stock])
      .attr('fill', 'none')
      .attr('stroke', '#306230')
      .attr('stroke-width', 2)
      .attr('d', d3.line()
        .x(d => { return xScale(parse(d["date"])); })
        .y(d => { return yScale(d["price"]); })
      )
      .attr('transform', 'translate(60, 0)');
    
    let width = (data[stock].length > 100) ? 2 : 4;
    // Plot points
    graph.selectAll()
      .data(data[stock])
      .enter()
      .append('rect')
      .attr('class', 'point')
      .attr('data-xvalue', d => { return d["date"]; })
      .attr('data-yvalue', d => { return d["price"]; })
      .attr('x', d => { return xScale(parse(d["date"])) - width / 2; })
      .attr('y',  (d, i) => {
        let y = yScale(d["price"]) - width / 2;
        // Position line label
        if (i == data[stock].length - 1) {
          document.getElementById(stock).style.top = (y + 95) + 'px';
        }
        return y;
      })
      .attr('width', width)
      .attr('height', width)
      .attr('transform', 'translate(60, 0)')
      .style('stroke', '#306230')
      .style('fill', '#306230')
      .on('click', e => {
        // Display tooltip
        tooltip.style("opacity", 1)
          .html(`${e["originalTarget"]["__data__"]["date"]}<br>${stock}: $${e["originalTarget"]["__data__"]["price"].toFixed(2)}`)
          .style('left', (e.clientX - 160) + 'px')
          .style('top', (e.clientY - 80) + 'px')
          .on('click', e => {
            tooltip.style('opacity', 0)
          });
      });
  }
}