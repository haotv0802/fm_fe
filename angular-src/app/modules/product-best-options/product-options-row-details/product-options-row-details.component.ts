import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Shape from 'd3-shape';
import * as d3TimeFormat from 'd3-time-format';
import * as moment from 'moment';
import {ProductHistoryDTO} from "../models/product-history-matching";
import {ModalService} from "../../../shared/services/modal.service";
import {BlockUIService} from "../../../shared/services/block-ui.service";
import {formatNumber} from "../../../shared/utils/index";
import * as _ from 'lodash';
import {ProductRankOptionValueComponent} from "../product-rank-option-value/product-rank-option-value.component";

@Component({
    selector: 'product-options-row-details',
    templateUrl: './product-options-row-details.component.html',
    styleUrls: ['./product-options-row-details.component.css']
})
export class ProductOptionsRowDetailsComponent implements OnInit {

    @Input() sources: ProductHistoryDTO[];
    @Input() coId: string;
    @Input() removeDuplicatedRank: boolean;
    @Input() isAdminView: boolean;


    productHists: ProductHistoryDTO[] = [];

    private margin = {top: 70, right: 10, bottom: 30, left: 60};
    private x: any;
    private y: any;
    private svg: any;
    private g: any;
    private width: number;
    private height: number;

    isFirstShowChart: boolean = true;

    productHistSettings: object = {
        table: {
            translate: true,
            id: 'detailtbl'
        }
    };
    ngOnInit(): void {
        this.drawChart(this.productHists);
    }

    ngAfterContentChecked() : void {
        Object.assign(this.productHists, this.sources);
        this.setTableSettings();
        this.initChartData();
        if(this.productHists.length > 0){
            this.redrawChart(this.productHists);
            /*this.isFirstShowChart = false;
            this.saleDataSources = Object.create(this.turnOverChartData);

            this.sortAndRemoveDuplicatedDataIfEnabled();*/

        }

    }

    initChartData() : void {

        this.sortAndRemoveDuplicatedDataIfEnabled();
        let no = 0;
        for (var i = 0; i < this.productHists.length; i++) {
            this.productHists[i]['no'] = ++no;
            this.productHists[i]['xDate'] = moment(this.productHists[i]['createdAt'], moment.ISO_8601).toDate();
        }
    }

    constructor(private modalService: ModalService, private blockUI: BlockUIService) {
       // this.initChartData();
    }

    setTableSettings():void  {
        let settings: object = {
            no: {
                title: 'productHistory.no',
                    width: '20px',
                    align: 'center'
            },
            createdAt: {
                title: 'productHistory.createdAt',
                    render: (data: { value: any, item: object }, settings: object) => {
                    let createdAt = data.item['createdAt'];
                    return moment(createdAt, moment.ISO_8601).format("YYYY-MM-DD HH:mm");
                }
            }
        };

        settings['rank'] = {
            title: 'option.rank',
            width: '20px',
            align: 'center'
        };
        
        settings['optionId'] = {
            title: 'option.optionId',
            width: '20px',
            align: 'center'
        };

        settings['title'] = {
            title: 'option.optionName',
            // render: (data: { value: any, item: object }, settings: object) =>{
            //     return '<a href="' + data.item['title'] + '" target="_blank">' + data.value + '</a>';
            // }
        };
        settings['priceNow'] = {
            title: 'productHistory.priceNow',
            render: (data: { value: any, item: object }, settings: object) => {
                let price = data.item['priceNow'];
                //let priceGap = data.item['priceGap'];
                return `${formatNumber(price)}`;
            }
        };

        this.productHistSettings = {
            table: this.productHistSettings['table'],
            column: settings
        };
    }

    private sortAndRemoveDuplicatedDataIfEnabled(): void {
        this.productHists.sort(function (a, b) {
            var c = moment(a.createdAt).toDate();
            var d = moment(b.createdAt).toDate();
            return d.getTime() - c.getTime();
        });

        if(this.removeDuplicatedRank) {
            this.productHists = _.reduce(this.productHists, (accumulatedSources, histItem)=> {
                let lastItem: ProductHistoryDTO  = _.last(accumulatedSources);
                if(_.isNil(lastItem)) {
                    accumulatedSources.push(histItem);
                } else if(lastItem.rank === histItem.rank) {
                    accumulatedSources.pop();
                    accumulatedSources.push(histItem);
                } else {
                    accumulatedSources.push(histItem)
                }
                return accumulatedSources;
            }, []);
        }

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
        this.y = d3Scale.scaleLinear().range([ 0, this.height]);
        var x = this.x;
        var y = this.y;

        var valueLineTmon = d3Shape.line()
            .x(function (d) {
                return x(d["xDate"]);
            })
            .y(function (d) {
                return y(d["rank"]);
            });


        this.x.domain(d3Array.extent(chartData, function (d) {
            return d["xDate"];
        }));

        this.y.domain([0, d3Array.max(chartData, function (d) {
            return Math.max(d["rank"]);
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
                return y(d["rank"]);
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


