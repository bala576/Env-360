import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorTypes } from './sensor-types';

describe('SensorTypes', () => {
  let component: SensorTypes;
  let fixture: ComponentFixture<SensorTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorTypes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SensorTypes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
