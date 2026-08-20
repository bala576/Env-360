import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmTypes } from './alarm-types';

describe('AlarmTypes', () => {
  let component: AlarmTypes;
  let fixture: ComponentFixture<AlarmTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlarmTypes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlarmTypes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
