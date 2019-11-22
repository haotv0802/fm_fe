import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Shape from 'd3-shape';
import * as d3TimeFormat from 'd3-time-format';
import * as moment from 'moment';
import {ModalService} from "../../../../shared/services/modal.service";
import {AreaEditComponent} from "../../../admin/area-edit/area-edit.component";
import {Option} from "../../../../shared/models/option";
import {OptionService} from "../../../../shared/services/option.service";
import {BlockUIService} from "../../../../shared/services/block-ui.service";

@Component({
    selector: 'app-row-details',
    templateUrl: './row-details.component.html',
    styleUrls: ['./row-details.component.css']
})
export class RowDetailsComponent implements OnInit {

    @Input() sources: any;


    @Input() options: any;
    @Input() chartType: any;

    currency: string = '원';


    private margin = {top: 70, right: 10, bottom: 30, left: 60};
    private x: any;
    private y: any;
    private svg: any;
    private g: any;
    private width: number
    private height: number

    turnOverChartData: any = []
    cumulativeChartData: any = []

    isFirstShowChart: boolean = true;

    saleDataSources: any = [];


    ngOnInit(): void {
        this.drawChart(this.turnOverChartData);
    }

    ngAfterContentChecked() : void{
        if(this.sources.length > 0 && this.isFirstShowChart){
            this.initChartData();
            this.redrawChart(this.turnOverChartData);
            this.isFirstShowChart = false;
            this.saleDataSources = Object.create(this.turnOverChartData);

            this.sortStaticsData();

        }
    }

    initChartData() : void {

        // this.sources.sort(function (a, b) {
        //     var c = moment(a.regDate).toDate();
        //     var d = moment(b.regDate).toDate();
        //     return c.getTime() - d.getTime();
        // });

        for (var i = 0; i < this.sources.length; i++) {
            this.sources[i]["xDate"] = moment(this.sources[i]["regDate"], "YYYY-MM-DD HH").toDate();
            this.turnOverChartData.push(this.sources[i]);
        }
    }

    constructor(private modalService: ModalService, private optionService: OptionService, private blockUI: BlockUIService) {
       // this.initChartData();
    }

    optionListSetting = {
        table: {
            translate: true,
            id: 'detailtbl'
        },
        column: {
            optionId: {
                title: 'option.optionId'

            },
            title: {
                title: 'option.optionName'
            },
            originalPrice: {
                title: 'option.normalPrice',
                type: 'number',
                align: 'center',
                render: (data: { value: any, item: object }, settings: object) => {
                    return data.item['originPrice'].toLocaleString() + this.currency;
                }
            },
            currentPrice: {
                title: 'option.ourPrice',
                type: 'number',
                align: 'center',
                render: (data: { value: any, item: object }, settings: object) => {
                    return data.item['curPrice'].toLocaleString() + this.currency;
                }
            },
            sellCount: {
                title: 'option.saleQuantity',
                type: 'number',
                align: 'center',
            },
            maxCount: {
                title: 'option.saleMaximum',
                type: 'number',
                align: 'center',
            },
            sales: {
                title: 'option.sale',
                align: 'center',
                type: 'number',
                render: (data: { value: any, item: object }, settings: object) => {

                    let sellCount: number = data.item['sellCount'];
                    let priceNow: number = data.item['curPrice'];
                    let val = sellCount * priceNow;

                    return val.toLocaleString() + this.currency;

                }
            }

        }
    };

    changeChart(chartType): void {

        if(this.cumulativeChartData.length == 0){
            let saleDiff: number = 0;
            let saleCountDiff: number = 0;
            let sellCountCor: number = 0;
            for (var i = 0; i < this.turnOverChartData.length; i++) {
                let tmp: any = [];
                saleDiff += this.turnOverChartData[i]["saleDiff"];
                saleCountDiff += this.turnOverChartData[i]["sellCountDiff"];
                sellCountCor += this.turnOverChartData[i]["sellCountCor"];

                tmp["saleDiff"] = saleDiff;
                tmp["sellCountDiff"] = saleCountDiff;
                tmp["sellCountCor"] = sellCountCor;
                tmp["xDate"] = this.turnOverChartData[i]["xDate"];
                tmp["regDate"] = this.turnOverChartData[i]["regDate"];
                this.cumulativeChartData[i] = tmp;
            }

            // this.cumulativeChartData.sort(function (a, b) {
            //     var c = moment(a.regDate).toDate();
            //     var d = moment(b.regDate).toDate();
            //     return d.getTime() - c.getTime();
            // });


        }

        if(this.chartType == '0'){
            this.redrawChart(this.turnOverChartData);
            this.saleDataSources = Object.create(this.turnOverChartData);
        }else {
            this.redrawChart(this.cumulativeChartData);
            this.saleDataSources = Object.create(this.cumulativeChartData);

        }

        this.sortStaticsData();

    }

    private sortStaticsData(): void {
        this.saleDataSources.sort(function (a, b) {
            var c = moment(a.regDate).toDate();
            var d = moment(b.regDate).toDate();
            return d.getTime() - c.getTime();
        });
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
        this.x = d3Scale.scaleTime().range([0, this.width]);
        this.y = d3Scale.scaleLinear().range([this.height, 0]);
        var x = this.x;
        var y = this.y;

        var valueLineTmon = d3Shape.line()
            .x(function (d) {
                return x(d["xDate"]);
            })
            .y(function (d) {
                return y(d["saleDiff"]);
            });


        this.x.domain(d3Array.extent(chartData, function (d) {
            return d["xDate"];
        }));

        this.y.domain([0, d3Array.max(chartData, function (d) {
            return Math.max(d["saleDiff"]);
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
                return y(d["saleDiff"]);
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
            .call(d3Axis.axisBottom(this.x).tickFormat(d3TimeFormat.timeFormat("%m/%d %H %p")));

        // Add the Y Axisƒ
        this.g.append("g")
            .attr("class", "axis axis--y")
            .call(d3Axis.axisLeft(this.y)
                .ticks(20, "s"));

    }
    handleTableChange(event): void{
    }
}


