import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListDigitalSignatureComponent } from './list-digital-signature.component';

describe('ListDigitalSignatureComponent', () => {
  let component: ListDigitalSignatureComponent;
  let fixture: ComponentFixture<ListDigitalSignatureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListDigitalSignatureComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDigitalSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
