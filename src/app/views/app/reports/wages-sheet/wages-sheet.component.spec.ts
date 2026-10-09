import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WagesSheetComponent } from './wages-sheet.component';

describe('WagesSheetComponent', () => {
  let component: WagesSheetComponent;
  let fixture: ComponentFixture<WagesSheetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WagesSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WagesSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
