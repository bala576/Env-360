import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Devicesandsensor } from './devicesandsensor';

describe('Devicesandsensor', () => {
  let component: Devicesandsensor;
  let fixture: ComponentFixture<Devicesandsensor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Devicesandsensor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Devicesandsensor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
