import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddSncodesComponent } from './add-sncodes.component';

describe('AddSncodesComponent', () => {
  let component: AddSncodesComponent;
  let fixture: ComponentFixture<AddSncodesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSncodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSncodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
