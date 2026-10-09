import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditWorkingAreaComponent } from './edit-working-area.component';

describe('EditWorkingAreaComponent', () => {
  let component: EditWorkingAreaComponent;
  let fixture: ComponentFixture<EditWorkingAreaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWorkingAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWorkingAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
