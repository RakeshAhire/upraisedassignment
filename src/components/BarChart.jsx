import React, { useEffect, useRef } from 'react';
import {
    axisBottom,
    scaleLinear, select,
    scaleBand,
    axisLeft,
} from 'd3';


const BarChart = ({ data }) => {
    const svgRef = useRef();
    useEffect(() => {
        // console.log(svgRef);
        const svg = select(svgRef.current);
        const width = 540;
        const height = 300;

        svg
            .attr('width', width)
            .attr('height', height)
            .style("overflow", "visible")

        // define the scaling
        const xScale = scaleBand()
            .domain(data.map((value, i) => i+1))
            .range([0, width])
            .padding(0.5);

        const yScale = scaleLinear()
            .domain([0, 60])
            .range([height, 0]);

        // define the axis
        const xAxis = axisBottom(xScale)
            .ticks(data.length)

        const yAxis = axisLeft(yScale)
            .ticks(5);

        svg.select('.x-axis') // select using className
            .call(xAxis)
            .attr("transform", `translate(0,${height})`)
        svg.select(".y-axis") // select using className
            .call(yAxis)

        //setting the svg data
        svg.selectAll('.bar')
            .data(data)
            .join('rect')
            .attr('x', (value, i) => xScale(i+1))
            .attr('y', yScale)
            .attr("width", xScale.bandwidth())
            .attr("height", value => height - yScale(value))
    }, [data]);

    return (
        <>
            <svg className='m-8' ref={svgRef} >
                <g className="x-axis"></g>
                <g className="y-axis"></g>
            </svg>
        </>
    );
};

export default BarChart;
