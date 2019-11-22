export class BaseModel {

    getIgnoreProps(): string[] {
        return [];
    }

    getPropValue(prop) {
        return this[prop];
    }

    setPropValue(prop: any, value: any) {
        this[prop] = value;
    }
    
    unbind(): any {
        let ignoreProps = this.getIgnoreProps();
        let target = {};
        for (var prop in this) {
            // skip loop if the property is from prototype
            if (!this.hasOwnProperty(prop) || ignoreProps.indexOf(prop) >= 0) continue;

            target[''+prop] = this.getPropValue(prop);
        }
        return target;
    }

    bind(obj: object) {
        let ignoreProps = this.getIgnoreProps();
        for (var prop in obj) {
            // skip loop if the property is from prototype
            if (!obj.hasOwnProperty(prop)) continue;

            this.setPropValue(prop, obj[prop]);
        }
    }
}