import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MailTemplateComponent } from './mail-template.component';

describe('MailTemplateComponent', () => {
  let component: MailTemplateComponent;
  let fixture: ComponentFixture<MailTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MailTemplateComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
