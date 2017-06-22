// import 'reflect-metadata';
import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  ComponentRef,
  EventEmitter,
  Output
} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'modal',
  templateUrl: 'modal.component.html',
  providers: [],
  encapsulation: ViewEncapsulation.None
})
/**
 * API to an open modal window.
 */
export class ModalComponent {
  /**
   * Caption for the title.
   */
  public modalTitle: string;
  /**
   * component which is to be loaded dynamically.
   */
  public component: any;
  /**
   * Describes if the modal contains Ok Button.
   * The default Ok button will close the modal and emit the callback.
   * Defaults to true.
   */
  public okButton: boolean = true;
  /**
   * Caption for the OK button.
   * Default: Ok
   */
  public okButtonText: string = 'Ok';
  /**
   * Describes if the modal contains cancel Button.
   * The default Cancelbutton will close the modal.
   * Defaults to true.
   */
  public cancelButton: boolean = true;
  /**
   * Caption for the Cancel button.
   * Default: Cancel
   */
  public cancelButtonText: string = 'Cancel';
  /**
   * if the modalMessage is true it will show the message inside modal body.
   */
  public modalMessage: boolean = true;
  /**
   * Some message/content can be set in message which will be shown in modal body.
   */
  public message: string;
  /**
   * if the value is true modal footer will be visible or else it will be hidden.
   */
  public modalFooter: boolean = true;
  /**
   * shows modal header if the value is true.
   */
  public modalHeader: boolean = true;
  /**
   * if the value is true modal will be visible or else it will be hidden.
   */
  public isOpen: boolean = false;

  /**
   * Width of document.
   * @type {number}
   */
  public documentWidth: number = 500;
  /**
   * Emitted when a ok button was clicked
   * or when close method is called.
   */
  cmpRef: ComponentRef<any>;
  @ViewChild("child", {read: ViewContainerRef}) target: any;
  @Output() public modalOutput: EventEmitter<any> = new EventEmitter();

  constructor(public compiler: ComponentFactoryResolver, public viewContainer: ViewContainerRef) {
  }

  /**
   * Opens a modal window creating backdrop.
   * @param component The angular Component that is to be loaded dynamically(optional).
   */
  open(component?: any) {
    this.isOpen = true;
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }
    if (component) {
      let componentFactory = this.compiler.resolveComponentFactory(component);
      this.cmpRef = this.target.createComponent(componentFactory);
    }
  }

  /**
   *  close method dispose the component, closes the modal and optionally emits modalOutput value.
   */
  close(data?: any) {
    this.dispose();
    if (data) {
      this.modalOutput.emit(data);
    }
  }

  /**
   *  ok method dispose the component, closes the modal and emits true.
   */
  submit() {
    this.dispose();
    this.modalOutput.emit(true);
  }

  /**
   *  dispose method dispose the loaded component.
   */
  dispose() {
    this.isOpen = false;
    if (this.component != undefined) {
      this.component.then((componentRef: ComponentRef<any>) => {
        componentRef.destroy();
        return componentRef;
      });
    }
  }

}