import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TdsSubsectionCategoryComponent } from './tds-subsection-category.component';

describe('TdsSubsectionCategoryComponent', () => {
  let component: TdsSubsectionCategoryComponent;
  let fixture: ComponentFixture<TdsSubsectionCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TdsSubsectionCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TdsSubsectionCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
