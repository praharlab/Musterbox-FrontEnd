import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResignationTaskComponent } from './resignation-task.component';

describe('ResignationTaskComponent', () => {
  let component: ResignationTaskComponent;
  let fixture: ComponentFixture<ResignationTaskComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ResignationTaskComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResignationTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
