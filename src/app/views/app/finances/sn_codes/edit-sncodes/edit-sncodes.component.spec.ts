import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditSncodesComponent } from './edit-sncodes.component';

describe('EditSncodesComponent', () => {
  let component: EditSncodesComponent;
  let fixture: ComponentFixture<EditSncodesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSncodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSncodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
