import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportTaskStagesComponent } from './import-task-stages.component';

describe('ImportTaskStagesComponent', () => {
  let component: ImportTaskStagesComponent;
  let fixture: ComponentFixture<ImportTaskStagesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportTaskStagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTaskStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
