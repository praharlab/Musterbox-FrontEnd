import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListpayheadmasterComponent } from './listpayheadmaster.component';

describe('ListpayheadmasterComponent', () => {
  let component: ListpayheadmasterComponent;
  let fixture: ComponentFixture<ListpayheadmasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListpayheadmasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListpayheadmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
