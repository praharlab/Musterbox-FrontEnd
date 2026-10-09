import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChangepasswordnewComponent } from './changepasswordnew.component';

describe('ChangepasswordnewComponent', () => {
  let component: ChangepasswordnewComponent;
  let fixture: ComponentFixture<ChangepasswordnewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChangepasswordnewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangepasswordnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
