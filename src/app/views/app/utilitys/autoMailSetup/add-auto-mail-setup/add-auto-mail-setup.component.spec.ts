import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAutoMailSetupComponent } from './add-auto-mail-setup.component';

describe('AddAutoMailSetupComponent', () => {
  let component: AddAutoMailSetupComponent;
  let fixture: ComponentFixture<AddAutoMailSetupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAutoMailSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAutoMailSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
