import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAutoMailSetupComponent } from './list-auto-mail-setup.component';

describe('ListAutoMailSetupComponent', () => {
  let component: ListAutoMailSetupComponent;
  let fixture: ComponentFixture<ListAutoMailSetupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAutoMailSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAutoMailSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
