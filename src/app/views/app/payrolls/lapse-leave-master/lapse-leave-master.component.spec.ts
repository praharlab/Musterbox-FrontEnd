import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LapseLeaveMasterComponent } from './lapse-leave-master.component';

describe('LapseLeaveMasterComponent', () => {
  let component: LapseLeaveMasterComponent;
  let fixture: ComponentFixture<LapseLeaveMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LapseLeaveMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LapseLeaveMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
