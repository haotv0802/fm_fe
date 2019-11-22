import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ProductBestOptionsComponent} from "./product-best-options.component";



describe('ProductBestOptionsComponent', () => {
  let component: ProductBestOptionsComponent;
  let fixture: ComponentFixture<ProductBestOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBestOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBestOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
