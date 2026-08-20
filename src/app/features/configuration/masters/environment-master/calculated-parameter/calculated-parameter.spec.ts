import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatedParameter } from './calculated-parameter';

describe('CalculatedParameter', () => {
  let component: CalculatedParameter;
  let fixture: ComponentFixture<CalculatedParameter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatedParameter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatedParameter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
