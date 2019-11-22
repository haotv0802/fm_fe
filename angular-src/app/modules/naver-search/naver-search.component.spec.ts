import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {NaverSearchComponent} from "./naver-search.component";



describe('NaverSearchComponent', () => {
    let component: NaverSearchComponent;
    let fixture: ComponentFixture<NaverSearchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ NaverSearchComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NaverSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
