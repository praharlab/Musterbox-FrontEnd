import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PmsMasterComponent } from './pms-master.component';

describe('PmsMasterComponent', () => {
  let component: PmsMasterComponent;
  let fixture: ComponentFixture<PmsMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PmsMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
