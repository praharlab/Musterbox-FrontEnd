import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListMyOutdoorDutyComponent } from './list-my-outdoor-duty.component';

describe('ListMyOutdoorDutyComponent', () => {
  let component: ListMyOutdoorDutyComponent;
  let fixture: ComponentFixture<ListMyOutdoorDutyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMyOutdoorDutyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMyOutdoorDutyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
