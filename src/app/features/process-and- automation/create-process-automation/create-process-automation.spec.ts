import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProcessAutomation } from './create-process-automation';

describe('CreateProcessAutomation', () => {
  let component: CreateProcessAutomation;
  let fixture: ComponentFixture<CreateProcessAutomation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProcessAutomation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProcessAutomation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
