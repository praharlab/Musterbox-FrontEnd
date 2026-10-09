import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListIdCardComponent } from './list-id-card.component';

describe('ListIdCardComponent', () => {
  let component: ListIdCardComponent;
  let fixture: ComponentFixture<ListIdCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListIdCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListIdCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
