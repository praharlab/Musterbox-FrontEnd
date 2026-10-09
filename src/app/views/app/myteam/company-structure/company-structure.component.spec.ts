import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyStructureComponent } from './company-structure.component';

describe('CompanyStructureComponent', () => {
  let component: CompanyStructureComponent;
  let fixture: ComponentFixture<CompanyStructureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyStructureComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
