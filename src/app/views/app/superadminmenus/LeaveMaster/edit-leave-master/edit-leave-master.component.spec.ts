import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditLeaveMasterComponent } from './edit-leave-master.component';

describe('EditLeaveMasterComponent', () => {
  let component: EditLeaveMasterComponent;
  let fixture: ComponentFixture<EditLeaveMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditLeaveMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLeaveMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
