import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPriceComparisonComponent } from './product-price-comparison.component';

describe('ProductPriceComparisonComponent', () => {
  let component: ProductPriceComparisonComponent;
  let fixture: ComponentFixture<ProductPriceComparisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductPriceComparisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPriceComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
