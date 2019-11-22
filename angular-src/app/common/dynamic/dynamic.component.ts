import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    SimpleChange,
    ViewContainerRef,
    ViewChild,
    // ReflectiveInjector,
    ComponentFactoryResolver,
    EventEmitter
} from '@angular/core';

@Component({
    selector: 'dynamic-component',
    template: `
    <div #dynamicComponentContainer></div>
  `,
})
export class DynamicComponent implements OnChanges {
    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef;

    // component: Class for the component you want to create
    // inputs: An object with key/value pairs mapped to input name/input value
    // @Input() set componentData(data: { component: any, inputs: any, outputs: any }) {
    //     if (!data) {
    //         return;
    //     }

    //     let componentFactory = this.resolver.resolveComponentFactory(data.component);
    //     this.dynamicComponentContainer.clear();

    //     let componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
    //     if (data.inputs) {
    //         for (let prop in data.inputs) {
    //             if (data.inputs.hasOwnProperty(prop)) {
    //                 componentRef.instance[prop] = data.inputs[prop];
    //             }
    //         }
    //     }

    //     if (data.outputs) {
    //         for (let prop in data.outputs) {
    //             if (data.outputs.hasOwnProperty(prop)) {
    //                 let emitter = <EventEmitter<any>>componentRef.instance[prop];
    //                 emitter.subscribe((generatorOrNext, error, complete)=>{
    //                     data.outputs[prop](generatorOrNext, error, complete);
    //                 });
    //             }
    //         }
    //     }
    // }

    @Input() componentData: { component: any, inputs: any, outputs: any };
    componentRef: any;

    constructor(private resolver: ComponentFactoryResolver) {
        //this.initComponent()
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes.componentData.firstChange) {
            this.initComponent();
        }
        this.updateComponent();
    }

    initComponent() {
        if (!this.componentData) {
            return;
        }

        let componentFactory = this.resolver.resolveComponentFactory(this.componentData.component);
        this.dynamicComponentContainer.clear();

        this.componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
    }

    updateComponent() {
        if (!this.componentData) {
            return;
        }

        if (this.componentData.inputs) {
            for (let prop in this.componentData.inputs) {
                if (this.componentData.inputs.hasOwnProperty(prop)) {
                    this.componentRef.instance[prop] = this.componentData.inputs[prop];
                }
            }
        }

        if (this.componentData.outputs) {
            for (let prop in this.componentData.outputs) {
                if (this.componentData.outputs.hasOwnProperty(prop)) {
                    let emitter = <EventEmitter<any>>this.componentRef.instance[prop];
                    if (emitter.observers.length == 0) {
                        emitter.subscribe((generatorOrNext, error, complete)=>{
                            this.componentData.outputs[prop](generatorOrNext, error, complete);
                        });
                    }
                }
            }
        }
    }
}
