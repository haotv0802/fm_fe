import {Component, Input, OnInit} from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Shape from 'd3-shape';
import * as d3TimeFormat from 'd3-time-format';
import * as moment from 'moment';

@Component({
  selector: 'app-row-list-details',
  templateUrl: './row-list-details.component.html',
  styleUrls: ['./row-list-details.component.css']
})
export class RowListDetailsComponent implements OnInit {

    @Input() sources: any;
    @Input() options: any;
    @Input() chartType: any;


    private margin = {top: 70, right: 10, bottom: 30, left: 60};
    private x: any;
    private y: any;
    private svg: any;
    private g: any;
    private width: number
    private height: number

    turnOverChartData: any = []

    ngOnInit(): void {

        this.sources.sort(function (a, b) {
            var c = moment(a.date, 'YYYY-MM-DD').toDate();
            var d = moment(b.date, 'YYYY-MM-DD').toDate();
            return c.getTime() - d.getTime();
        });
        for (var i = 0; i < this.sources.length; i++) {
            this.sources[i]["xDate"] = moment(this.sources[i]["date"], "YYYY-MM-DD").toDate();
            this.turnOverChartData.push(this.sources[i]);
        }

        this.drawChart(this.turnOverChartData)
    }


    constructor() {
    }

    optionListSetting = {
        table: {
            translate: true
        },
        column: {
            optionId: {
                title: 'Option number'

            },
            title: {
                title: 'Option name',
                sortable: true

            },
            normal: {
                title: 'Normal'
            },
            originPrice: {
                title: 'Our price',
                sortable: true
            },
            sellCount: {
                title: 'Sales quantity',
                sortable: true
            },
            maxCount: {
                title: 'Maximum',
                sortable: true
            },
            curPrice: {
                title: 'Sales',
                sortable: true
            },
            actions: {
                title: '',
                render: (data: { value: any, item: object }, settings: object) => {
                    //return '<a href="' + data.value + '" target="_blank">' + data.value + '</a>';

                    return '<input type="button" value=" 무시하기 " onclick="handleIgnoreBtnClick("' + data + '"); return false;" /> &nbsp;' +
                        '<input type="button" value=" 보정하기 " onclick="handleComparisonBtnClick("' + data + '"); return false;" />';
                },
            }
        }
    };

    changeChart(chartType): void {
        console.log(chartType)
    }


    handleIgnoreBtnClick(data): void {
        console.log(data)
    }

    handleComparisonBtnClick(data): void {
        console.log(data)
    }


    private drawChart(data) {
        this.initSvg();
        this.initLineChart(data)
    }

    private redrawChart(data) {
        this.g.remove("g");
        this.drawChart(data);
    }

    private initSvg() {
        this.svg = d3.select("svg");
        this.width = +this.svg.attr("width") - this.margin.left - this.margin.right - 20;
        this.height = +this.svg.attr("height") - this.margin.top - this.margin.bottom;
        this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    private initLineChart(chartData) {
        // var parseDate = d3TimeFormat.timeFormat("%d %b");
        this.x = d3Scale.scaleTime().range([0, this.width]);
        this.y = d3Scale.scaleLinear().range([this.height, 0]);
        var x = this.x;
        var y = this.y;

        var valueLineTmon = d3Shape.line()
            .x(function (d) {
                return x(d["xDate"]);
            })
            .y(function (d) {
                return y(d["data"]);
            });


        this.x.domain(d3Array.extent(chartData, function (d) {
            return d["xDate"];
        }));

        this.y.domain([0, d3Array.max(chartData, function (d) {
            return Math.max(d["data"]);
        })]).nice();

        this.g.selectAll("dot")
            .data(chartData)
            .enter().append("circle")
            .attr('class', 'dot-tmon')
            .attr("r", 3.5)
            .attr("cx", function (d) {
                return x(d["xDate"]);
            })
            .attr("cy", function (d) {
                return y(d["data"]);
            })
            .on('mouseover', function (el) {
                d3.select(this)
                    .attr('r', 5);
            })
            .on('mouseout', function (el) {
                d3.select(this)
                    .attr('r', 3.5);
            });

        this.g.append("path")
            .attr("class", "line")
            .style("stroke", "#6A5ACD")
            .attr("d", valueLineTmon(chartData));


        // Add the X Axis
        this.g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3Axis.axisBottom(this.x).tickFormat(d3TimeFormat.timeFormat("%m/%d")));

        // Add the Y Axisƒ
        this.g.append("g")
            .attr("class", "axis axis--y")
            .call(d3Axis.axisLeft(this.y)
                .ticks(20, "s"));

    }

}
