import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditExpenserequestComponent } from './edit-expenserequest.component';

describe('EditExpenserequestComponent', () => {
  let component: EditExpenserequestComponent;
  let fixture: ComponentFixture<EditExpenserequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditExpenserequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExpenserequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
 
  it('should create', () => {
    expect(component).toBeTruthy(); 
  });
});
 