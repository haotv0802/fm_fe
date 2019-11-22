
import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { FilterBtnComponent } from '../../common/filter-btn/filter-btn.component';

@Component({
    selector: 'test',
    moduleId: module.id,
    templateUrl: 'test.component.html'
})
export class TestComponent {

    subRows: object = {};
    settings: object = {
        table: {
            id: 'test',
            sort: {
                column: 'email',
                type: 'asc'
            }
        },
        column: {
            idx: {
                title: 'ID'
            },
            group11: {
                title: ['group', 'group1', 'group11']
            },
            group12: {
                title: ['group', 'group1', 'group12']
            },
            group21: {
                title: ['group', 'group2', 'group21'],
                sortable: true
            },
            group22: {
                title: ['group', 'group2', 'group22'],
                sortable: true
            },
            num: {
                title: 'Number',
                type: 'number'
            },
            per: {
                title: 'Percent',
                type: 'percent'
            },
            email: {
                title: 'Email',
                sortable: true,
                clickable: true
            },
            link: {
                title: 'custom value',
                render: (data: { value: any, item: object }, settings: object) => {
                    return '<a href="https://angular.io" target="_blank">' + data.value + '</a>';
                }
            },
            action: {
                title: 'Action',
                render: (data: { value: any, item: object }, settings: object) => {
                    return '<button>Edit</button>';
                }
            }
        },
        row: {
            renderSubRow: (item: object, settings: object, rowIndex: number) => {
                // only render sub rows in subRows list
                if (this.subRows[item['idx']]) {
                    return {
                        component: FilterBtnComponent,
                        inputs: {
                            title: 'Filter button',
                            sources: [{key:'xxx1', label: 'xxxx1'},{key:'xxx2', label: 'xxxx2'}]
                        },
                        outputs: {
                            onSelect: (item) => {console.log(item)}
                        }
                    };
                }

                return false;
            },
            highlight: (data: { index: number, item: object }) => {
                // highlight row with id = 2
                return data.item['idx'] == 2 ? '#EEEEEE' : null;
            }
        }
    };
    sources: object[] = [
        {
            idx: 1,
            name: "Leanne Graham",
            username: "Bret",
            email: "Sincere@april.biz",
            group11: 'group11',
            group12: 'group12',
            group21: 'group21',
            group22: 'group22',
            num: 123456789.543,
            per: 14.5,
            link: 'angular',
            other: 'xxxxx'
        },
        {
            idx: 2,
            name: "Nicholas DuBuque",
            username: "Nicholas.Stanton",
            group11: 'group11 - 1',
            group12: 'group12 - 1',
            group21: 'group21 - 1',
            group22: 'group22 - 1',
            email: "Rey.Padberg@rosamond.biz",
            num: 9876543210,
            per: 4.6789,
            link: 'angular',
            other: 'xxxxx'
        },
        {
            idx: 11,
            name: "Nicholas DuBuque",
            username: "Nicholas.Stanton",
            group11: 'group11 - 1',
            group12: 'group12 - 1',
            group21: 'group21 - 1',
            group22: 'group22 - 1',
            email: "Rey.Padberg@rosamond.biz",
            num: 9876543210,
            per: 4.6789,
            link: 'angular',
            other: 'xxxxx'
        }
    ];

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    handleTableChange(event) {
        console.log(event);
        if (event.action == 'sort') {
            // handle sort
        } else if (event.action == 'cellclick') {
            if (event.data.colId == 'email') {
                // let subRowDiv = document.getElementById(event.data.containerId);
                // let display = subRowDiv.style.display == 'none' ? 'block' : 'none'

                // add to render able subrow list
                this.subRows[event.data.item.idx] = !this.subRows[event.data.item.idx];

                // show subrow
                // subRowDiv.style.display = display;
            }
        }
    }

    addColumn() {
        let column = this.settings['column'];
        column['other'] = {
            title: 'New column'
        };

        this.settings = {
            table: this.settings['table'],
            column: column,
            row: this.settings['row']
        };
    }
}