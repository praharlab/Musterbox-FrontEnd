import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompensatoryOffAuthorizationRequestComponent } from './compensatory-off-authorization-request.component';

describe('CompensatoryOffAuthorizationRequestComponent', () => {
  let component: CompensatoryOffAuthorizationRequestComponent;
  let fixture: ComponentFixture<CompensatoryOffAuthorizationRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompensatoryOffAuthorizationRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompensatoryOffAuthorizationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
