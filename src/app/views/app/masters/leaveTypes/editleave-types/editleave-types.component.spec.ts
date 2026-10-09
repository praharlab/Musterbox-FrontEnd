import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditleaveTypesComponent } from './editleave-types.component';

describe('EditleaveTypesComponent', () => {
  let component: EditleaveTypesComponent;
  let fixture: ComponentFixture<EditleaveTypesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditleaveTypesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditleaveTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
