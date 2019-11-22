import {Injectable, ComponentRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import {BlockUIComponent} from "../../common/block-ui/block-ui.component";

@Injectable()
export class BlockUIService {
    private blockUI: ComponentRef<BlockUIComponent>;
    public vRef: ViewContainerRef;
    private started = false;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

    public start() {
        if (!this.started) {
            let factory = this.componentFactoryResolver.resolveComponentFactory(BlockUIComponent);
            this.blockUI = this.vRef.createComponent(factory);
            this.started = true;
        }
    }

    public stop() {
        if (this.blockUI) {
            this.blockUI.destroy();
            this.started = false;
        }
    }

    public isLoading() {
        return this.started;
    }
}