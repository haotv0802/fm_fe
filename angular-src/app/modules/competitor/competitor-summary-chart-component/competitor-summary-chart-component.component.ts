import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Shape from 'd3-shape';
import * as d3TimeFormat from 'd3-time-format';
import * as d3Time from 'd3-time';
import * as d3Format from 'd3-format';
import * as moment from 'moment';
import {any} from "codelyzer/util/function";

const SITES = {
    1: 'coupang_site',
    2: 'auction_site',
    3: 'wemakeprice_site',
    4: '_11st_site',
    5: 'gmarket_site',
}

@Component({
    selector: 'app-competitor-summary-chart-component',
    templateUrl: './competitor-summary-chart-component.component.html',
    styleUrls: ['./competitor-summary-chart-component.component.css']
})
export class CompetitorSummaryChartComponentComponent implements OnInit {

    title: string;
    message: string;
    public turnOverChartData = [];
    public cumulativeChart = [];
    public chartType: any = 0;
    public providers = []

    private width: number;
    private height: number;

    @Input('chartData')
    public chartData: any;


    private margin = {top: 70, right: 10, bottom: 30, left: 60};
    private x: any;
    private y: any;
    private svg: any;
    private g: any;

    constructor() {

    }

    ngOnInit() {
        if (this.chartData.length != 0) {
            this.loadLineChartData();
        }

    }

    changeChart(chartType: string){
        if(chartType == '0'){
            this.redrawChart(this.turnOverChartData);
        }else
            this.redrawChart(this.cumulativeChart)
    }

    private loadLineChartData() {

        this.chartData.sort(function (a, b) {
            var c = moment(a.date, 'YYYYMMDD').toDate();
            var d = moment(b.date, 'YYYYMMDD').toDate();
            return c.getTime() - d.getTime();
        });
        this.turnOverChartData = [];
        this.cumulativeChart = [];
        for (var i = 0; i < this.chartData.length; i++) {
            this.chartData[i]["xDate"] = moment(this.chartData[i]["date"], "YYYYMMDD").toDate();
            let sales = any
            sales = this.chartData[i]["sale"]
            for (var j = 0; j < sales.length; j++) {
                this.chartData[i]["data_" + sales[j][0]["coId"]] = sales[j][0]["sale"]
                if(this.providers.indexOf(sales[j][0]["coId"]) == -1)
                    this.providers.push(sales[j][0]["coId"])
            }
            this.turnOverChartData.push(this.chartData[i]);
        }

        this.cumulativeChart.push(this.turnOverChartData[0])
        for(var i = 1 ; i < this.turnOverChartData.length; i++){
            let previousItem : any
            let currentItem: any
            previousItem = Object.create(this.cumulativeChart[i-1]);
            currentItem = Object.create(this.turnOverChartData[i]);

            for(let p of this.providers){
                let cumulativeValue = previousItem["data_"+p] + currentItem["data_"+p]
                previousItem["data_"+p] = cumulativeValue;
            }
            previousItem["xDate"] = moment(currentItem["date"], "YYYYMMDD").toDate();;
            this.cumulativeChart.push(previousItem);
        }

        this.drawChart(this.turnOverChartData);
        console.log(this.turnOverChartData);


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
        this.g = this.svg.append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    private initLineChart(chartData) {
        // var parseDate = d3TimeFormat.timeFormat("%d %b");
        this.x = d3Scale.scaleTime().range([0, this.width]);
        this.y = d3Scale.scaleLinear().range([this.height, 0]);
        var x = this.x;
        var y = this.y;

        var valueLineAuction = d3Shape.line()
            .x(function (d) {
                return x(d["xDate"]);
            })
            .y(function (d) {
                return y(d["data_cj"]);
            });
        var valueLineGmarket = d3Shape.line()
            .x(function (d) {
                return x(d["xDate"]);
            })
            .y(function (d) {
                return y(d["data_grp"]);
            });

        var valueLineCoupang = d3Shape.line()
            .x(function (d) {
                return x(d["xDate"]);
            })
            .y(function (d) {
                return y(d["data_cpn2"]);
            });

        var valueLineTmon = d3Shape.line()
            .x(function (d) {
                return x(d["xDate"]);
            })
            .y(function (d) {
                return y(d["data_tmn"]);
            });

        var valueLineTmonweb = d3Shape.line()
            .x(function (d) {
                return x(d["xDate"]);
            })
            .y(function (d) {
                return y(d["data_tmnw"]);
            });

        var valueLineWemakeprice = d3Shape.line()
            .x(function (d) {
                return x(d["xDate"]);
            })
            .y(function (d) {
                return y(d["data_wmp"]);
            });

        this.x.domain(d3Array.extent(chartData, function (d) {
            return d["xDate"];
        }));

        this.y.domain([0, d3Array.max(chartData, function (d) {
            return Math.max(
                d["data_wmp"] ? d["data_wmp"] : 0,
                d["data_tmn"] ? d["data_tmn"] : 0,
                d["data_tmnw"] ? d["data_tmnw"] : 0,
                d["data_grp"] ? d["data_grp"] : 0,
                d["data_cj"] ? d["data_cj"] : 0,
                d["data_cpn2"] ? d["data_cpn2"] : 0
            );
        })]).nice();

        if (this.providers.includes("wmp")) {
            this.g.selectAll("dot")
                .data(chartData)
                .enter().append("circle")
                .attr('class', 'dot-wemakeprice')
                .attr("r", 3.5)
                .attr("cx", function (d) {
                    return x(d["xDate"]);
                })
                .attr("cy", function (d) {
                    return y(d["data_wmp"]);
                })
                .on('mouseover', function (el) {
                    d3.select(this)
                        .attr('r', 5);
                })
                .on('mouseout', function (el) {
                    d3.select(this)
                        .attr('r', 3.5);
                });

        }
        if (this.providers.includes("tmn")) {
            this.g.selectAll("dot")
                .data(chartData)
                .enter().append("circle")
                .attr('class', 'dot-tmon')
                .attr("r", 3.5)
                .attr("cx", function (d) {
                    return x(d["xDate"]);
                })
                .attr("cy", function (d) {
                    return y(d["data_tmn"]);
                })
                .on('mouseover', function (el) {
                    d3.select(this)
                        .attr('r', 5);
                })
                .on('mouseout', function (el) {
                    d3.select(this)
                        .attr('r', 3.5);
                });

        }
        if (this.providers.includes("tmnw")) {

            this.g.selectAll("dot")
                .data(chartData)
                .enter().append("circle")
                .attr('class', 'dot-tmon')
                .attr("r", 3.5)
                .attr("cx", function (d) {
                    return x(d["xDate"]);
                })
                .attr("cy", function (d) {
                    return y(d["data_tmnw"]);
                })
                .on('mouseover', function (el) {
                    d3.select(this)
                        .attr('r', 5);
                })
                .on('mouseout', function (el) {
                    d3.select(this)
                        .attr('r', 3.5);
                });
        }
        if (this.providers.includes("grp")) {
            this.g.selectAll("dot")
                .data(chartData)
                .enter().append("circle")
                .attr('class', 'dot-gmarket')
                .attr("r", 3.5)
                .attr("cx", function (d) {
                    return x(d["xDate"]);
                })
                .attr("cy", function (d) {
                    return y(d["data_grp"]);
                })
                .on('mouseover', function (el) {
                    d3.select(this)
                        .attr('r', 5);
                })
                .on('mouseout', function (el) {
                    d3.select(this)
                        .attr('r', 3.5);
                });
        }
        if (this.providers.includes("cpn2")) {
            this.g.selectAll("dot")
                .data(chartData)
                .enter().append("circle")
                .attr('class', 'dot-coupang')
                .attr("r", 3.5)
                .attr("cx", function (d) {
                    return x(d["xDate"]);
                })
                .attr("cy", function (d) {
                    return y(d["data_cpn2"]);
                })
                .on('mouseover', function (el) {
                    d3.select(this)
                        .attr('r', 5);
                })
                .on('mouseout', function (el) {
                    d3.select(this)
                        .attr('r', 3.5);
                });
        }

        // Addthe valueline1 path.
        this.g.append("path")
            .attr("class", "line")
            .style("stroke", "#1E90FF")
            .attr("d", valueLineAuction(chartData));

        // Add the valueline2 path.
        this.g.append("path")
            .attr("class", "line")
            .style("stroke", "#A0522D")
            .attr("d", valueLineGmarket(chartData));

        this.g.append("path")
            .attr("class", "line")
            .style("stroke", "#FF8C00")
            .attr("d", valueLineCoupang(chartData));

        this.g.append("path")
            .attr("class", "line")
            .style("stroke", "#6A5ACD")
            .attr("d", valueLineTmon(chartData));

        this.g.append("path")
            .attr("class", "line")
            .style("stroke", "#6A5ACD")
            .attr("d", valueLineTmonweb(chartData));

        this.g.append("path")
            .attr("class", "line")
            .style("stroke", "#00FF7F")
            .attr("d", valueLineWemakeprice(chartData));


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
