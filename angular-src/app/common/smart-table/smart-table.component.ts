import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnChanges,
    SimpleChanges,
    SimpleChange
} from '@angular/core';
import {
    get,
    set,
    formatDate,
    formatNumber,
    formatPercent,
    formatDateTime,
    formatTime,
    isEmpty
} from '../../shared/utils';
import { TranslateService } from '@ngx-translate/core';

const DEFAULT_SETTINGS = {
    table: {
        id: '',
        className: 'table table-bordered',
        translate: false,
        width: '100%',
        sort: {
            column: '_seq',
            type: 'asc'
        },
        sortMode: 'server', // local | server
        tableScroll: false,
        tableScrollHeight: '1000px'
    },
    column: {
        title: 'No.', // or []
        type: 'string', // string | number | date | time | datetime | percent
        emptyValue: '',
        sortable: false,
        clickable: false,
        verticalAlign: false,
        width: 'auto',
        align: false, // left | right | center
        renderType: 'text/html', // text/html | cmp
        formatter: (data: { value: any, item: object }, settings: object) => {
            if (data.value === null || data.value === undefined || data.value === '') {
                return settings['emptyValue'];
            }

            let type = settings['type'];
            if (type === 'number') {
                return formatNumber(data.value);
            }

            if (type === 'percent') {
                return formatPercent(data.value);
            }

            if (type === 'date') {
                return formatDate(data.value);
            }

            if (type === 'time') {
                return formatTime(data.value);
            }

            if (type === 'datetime') {
                return formatDateTime(data.value);
            }

            return data.value;
        },
        render: (data: { value: any, item: object }, settings: object) => {
            return settings['formatter']({ value: data.value, item: data.item }, settings);
        },
        renderCmp: (data: { value: any, item: object }, settings: object) => false
    },
    row: {
        renderSubRow: (item: object, settings: object, rowIndex: number) => false,
        highlight: (data: { index: number, item: object }) => false // return a highlight color
    }
}

@Component({
    selector: 'smart-table',
    templateUrl: 'smart-table.component.html',
    styleUrls: ['smart-table.component.css']
})
export class SmartTableComponent implements OnChanges {
    @Input() settings: object = {};
    @Input() sources: object[];

    columnIds: string[] = [];
    headers: any;
    subRows: any = {}; // key: {component: any, inputs: any}
    nbColumns: number = 0;
    nbIndex: number = 0;

    /**
     * { sort }
     */
    @Output() onTableChange: EventEmitter<{ action: string, data: any, event: any }> = new EventEmitter();

    constructor(private translate: TranslateService, ) {

    }

    ngOnChanges(changes: SimpleChanges) {
        this.updateSettings();
    }

    updateSettings() {
        this.columnIds = [];

        let inputSettings = { ...this.settings };
        let inputColumns = inputSettings['column'];
        let columns = {};
        for (let prop in inputColumns) {
            if (inputColumns.hasOwnProperty(prop)) {
                columns[prop] = {
                    ...DEFAULT_SETTINGS.column,
                    ...inputColumns[prop]
                }

                this.columnIds.push(prop);
            }
        }

        this.settings = {
            table: {
                ...DEFAULT_SETTINGS.table,
                ...inputSettings['table']
            },
            row: {
                ...DEFAULT_SETTINGS.row,
                ...inputSettings['row']
            },
            column: columns
        };
    }

    getTableClassName(): string {
        let customClass = get(this.settings, 'table.className');
        return customClass ? 'smart-table ' + customClass : 'smart-table';
    }

    getHeaderDepth() {
        let count = 1;
        let columns = get(this.settings, 'column', {});
        for (let colId in columns) {
            if (columns.hasOwnProperty(colId)) {
                let title = get(columns, colId + '.title', '');
                if (title instanceof Array) {
                    count = title.length > count ? title.length : count;
                }
            }
        }

        return count;
    }

    generateHeader(): any[][] {
        let headerDepth = this.getHeaderDepth();
        let columns = get(this.settings, 'column', {});
        let columnIds = Object.keys(columns);
        this.nbColumns = this.columnIds.length;
        // init headers array
        let headers = new Array();
        for (let i = 0; i < headerDepth; i++) {
            headers.push([]);
        }

        for (let colId of columnIds) {
            let title = get(columns, colId + '.title', '');
            if (title instanceof Array) {
                for (let i in title) {
                    this.addHeader(headers[i], {
                        id: colId,
                        rowspan: 1,
                        colspan: 1,
                        title: title[i],
                        setting: columns[colId]
                    });
                }
            } else {
                this.addHeader(headers[0], {
                    id: colId,
                    rowspan: headerDepth,
                    colspan: 1,
                    title: title,
                    setting: columns[colId]
                });
            }
        }

        this.headers = headers;
        return headers;
    }

    addHeader(headers, item) {
        let last = headers[headers.length - 1];
        if (headers.length > 0 && last.title === item.title) {
            last.colspan = last.colspan + 1;
            last.rowspan = item.rowspan;
        } else {
            headers.push(item);
        }

    }

    // generateHeaderCellOutput(item, rowIdx) {
    //     let translateRequired = get(this.settings, 'table.translate', false);
    //     if (translateRequired) {
    //         return this.translate.get(item.title).subscribe(res=>res);
    //     }
    //     return item.title;
    // }

    isSortable(item, rowIdx) {
        let isLastRow = this.headers.length === (rowIdx + item.rowspan);
        let sortable = get(this.settings, 'column.' + item.id + '.sortable', false);
        return sortable && isLastRow;
    }

    generateHeaderCellClass(item, rowIdx) {
        let sortable = this.isSortable(item, rowIdx);
        if (!sortable) {
            return '';
        }

        let sortedColumn = get(this.settings, 'table.sort.column');
        let sortType = get(this.settings, 'table.sort.type', 'asc');

        if (sortedColumn && item.id === sortedColumn) {
            return 'sorting_' + sortType;
        }

        return 'sorting';
    }

    handleClickHeaderCell(item, rowIdx, event) {
        if (isEmpty(this.sources)) {
            return;
        }

        let sortable = this.isSortable(item, rowIdx);
        if (sortable) {
            let sortedColumn = get(this.settings, 'table.sort.column');
            let sortType = get(this.settings, 'table.sort.type', 'asc');

            if (sortedColumn && item.id === sortedColumn) {
                sortType = sortType === 'asc' ? 'desc' : 'asc';
            } else {
                sortType = 'asc';
            }

            let sort = {
                column: item.id,
                type: sortType
            };

            set(this.settings, 'table.sort', sort);

            let sortMode = get(this.settings, 'table.sortMode');
            let sortTypeVal = sortType == 'asc' ? 1 : -1;
            if (sortMode == 'local') {
                this.sources.sort((a, b) => {
                    return a[item.id].localeCompare(b[item.id]) * sortTypeVal;
                });

            } else {
                this.onTableChange.emit({
                    action: 'sort',
                    data: sort,
                    event: event
                });
            }
        }
    }

    generateCellOutput(item, colId) {
        let column = get(this.settings, 'column.' + colId, {});
        let param = {
            value: item[colId],
            item: item
        };
        return get(column, 'render', (param, column) => {
            return param.value
        })(param, column);
    }

    generateCellOutputCmp(item, colId) {
        let column = get(this.settings, 'column.' + colId, {});
        let param = {
            value: item[colId],
            item: item
        };

        return column.renderCmp(param, column);
    }

    getHeaderColStyle(item, rowIdx) {
        let style = {};
        let isLastRow = this.headers.length === (rowIdx + item.rowspan);
        if (isLastRow) {
            style['min-width'] = get(item, 'setting.width', 'auto');
        }
        return style;
    }

    getTRHeaderStyle() {

        let style = {};
        let tableScroll = get(this.settings, 'table.tableScroll');
        if (tableScroll !== undefined && tableScroll) {
            let usedColSpanTable = get(this.settings, 'table.usedColSpanTable');
            if (usedColSpanTable == undefined || !usedColSpanTable) {
                style['display'] = 'block';
            }
            let width = get(this.settings, 'table.width');
            if(width != undefined)
                style['width'] = width;
            else
                style['width'] = '99%';
        }
        style['width'] = '99%';
        return style;
    }
    getTableStyle(){
        let style = {};
        let tableScroll = get(this.settings, 'table.tableScroll');
        let width = get(this.settings, 'table.width');
        if(tableScroll == undefined || !tableScroll ){
            if(width != undefined)
                style['width'] = width;
            else
                style['width'] = '100%';
        }
        return style;
    }
    getTBodyStyle(){
        let style = {};
        let tableScroll = get(this.settings, 'table.tableScroll');
        if (tableScroll !== undefined && tableScroll) {
            let usedColSpanTable = get(this.settings, 'table.usedColSpanTable');
            if (usedColSpanTable == undefined || !usedColSpanTable) {
                style['display'] = 'block';
            }
            style['overflow'] = 'scroll';

            let width = get(this.settings, 'table.width');
            if(width != undefined)
                style['width'] = width;
            else
                style['width'] = '100%';

            let tableScrollHeight = get(this.settings, 'table.tableScrollHeight');
            if(tableScrollHeight != undefined && tableScrollHeight)
                style['height'] = tableScrollHeight;
        }
        return style;
    }

    getColStyle(colId) {

        let style = {};
        //if(this.nbIndex > this.nbColumns) {

            let column = get(this.settings, 'column.' + colId, {});

            // align
            if (column['align']) {
                style['text-align'] = column['align'];
            }
            if (column['verticalAlign']){
                style['vertical-align'] = column['verticalAlign'];
            }
            else {
                let type = column['type'];
                if (type === 'number'
                    || type === 'percent'
                    || type === 'date') {

                    style['text-align'] = 'right';
                }
            }
       // }

        let tableScroll = get(this.settings, 'table.tableScroll');
        if (tableScroll !== undefined && tableScroll) {
            if(column['width']){
                style['min-width'] = column['width'];
                style['max-width'] = column['width'];
            }
        }
        style['word-wrap'] = 'break-word';
        return style;
    }

    getRowStyle(item, idx) {
        let style = {};

        let highlight = get(this.settings, 'row.highlight')({ index: idx, item: item });
        if (highlight) {
            style['background-color'] = highlight;
        }

        return style;
    }

    generateSubRow(item, rIdx) {
        let renderFnc = get(this.settings, 'row.renderSubRow');
        let subCmp = false;
        if (!renderFnc) {
            subCmp = false;
        } else {
            subCmp = renderFnc(item, this.settings, rIdx);
        }

        this.subRows['_' + rIdx] = subCmp;
        return !!subCmp;
    }

    handleCellClick(data, event) {
        let clickable = get(this.settings, 'column.' + data.colId + '.clickable');
        if (clickable) {
            this.onTableChange.emit({
                action: 'cellclick',
                data: data,
                event: event
            });
        }
    }
}