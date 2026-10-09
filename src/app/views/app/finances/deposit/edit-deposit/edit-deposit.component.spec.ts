import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditDepositComponent } from './edit-deposit.component';

describe('EditDepositComponent', () => {
  let component: EditDepositComponent;
  let fixture: ComponentFixture<EditDepositComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditDepositComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
