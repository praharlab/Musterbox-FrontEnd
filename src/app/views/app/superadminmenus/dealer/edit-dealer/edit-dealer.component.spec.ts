import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditDealerComponent } from './edit-dealer.component';

describe('EditDealerComponent', () => {
  let component: EditDealerComponent;
  let fixture: ComponentFixture<EditDealerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDealerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
