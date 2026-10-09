import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeclarationInformationComponent } from './declaration-information.component';

describe('DeclarationInformationComponent', () => {
  let component: DeclarationInformationComponent;
  let fixture: ComponentFixture<DeclarationInformationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeclarationInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclarationInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
