import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddMygatepassComponent } from './add-mygatepass.component';

describe('AddMygatepassComponent', () => {
  let component: AddMygatepassComponent;
  let fixture: ComponentFixture<AddMygatepassComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddMygatepassComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMygatepassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
