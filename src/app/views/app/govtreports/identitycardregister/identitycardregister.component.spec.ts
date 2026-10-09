import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IdentitycardregisterComponent } from './identitycardregister.component';

describe('IdentitycardregisterComponent', () => {
  let component: IdentitycardregisterComponent;
  let fixture: ComponentFixture<IdentitycardregisterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IdentitycardregisterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentitycardregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
