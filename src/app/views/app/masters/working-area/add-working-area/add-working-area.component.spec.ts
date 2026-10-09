import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddWorkingAreaComponent } from './add-working-area.component';

describe('AddWorkingAreaComponent', () => {
  let component: AddWorkingAreaComponent;
  let fixture: ComponentFixture<AddWorkingAreaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWorkingAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkingAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
