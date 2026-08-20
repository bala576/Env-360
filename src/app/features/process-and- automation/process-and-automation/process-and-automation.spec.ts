import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessAndAutomation } from './process-and-automation';

describe('ProcessAndAutomation', () => {
  let component: ProcessAndAutomation;
  let fixture: ComponentFixture<ProcessAndAutomation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessAndAutomation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessAndAutomation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
