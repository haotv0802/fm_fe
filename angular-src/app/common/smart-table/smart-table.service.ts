import { Injectable } from '@angular/core';
import { get, set } from '../../shared/utils';

@Injectable()
export class SmartTableService {

    get(currentSettings, key): any {
        let settings = {...currentSettings};
        return get(settings, key);
    }

    set(currentSettings, key, val): any {
        let settings = {...currentSettings};
        set(settings, key, val);
        return settings;
    }

    refresh(currentSettings: any, keepState?: boolean): any {
        let settings = {...currentSettings};

        if (!keepState) {
            // reset sort
            set(settings, 'table.sort', {});

        }

        return settings;
    }

    addColumn(currentSettings, colId, colSettings): any {
        let settings = {...currentSettings};
        set(settings, 'column.'+colId, colSettings);
        return settings;
    }

    removeColumn(currentSettings, colId): any {
        let settings = {...currentSettings};
        set(settings, 'column.'+colId, false);
        return settings;
    }

}