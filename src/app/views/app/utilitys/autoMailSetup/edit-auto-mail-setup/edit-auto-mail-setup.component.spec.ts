import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditAutoMailSetupComponent } from './edit-auto-mail-setup.component';

describe('EditAutoMailSetupComponent', () => {
  let component: EditAutoMailSetupComponent;
  let fixture: ComponentFixture<EditAutoMailSetupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAutoMailSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAutoMailSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
