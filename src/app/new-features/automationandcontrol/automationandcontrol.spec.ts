import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Automationandcontrol } from './automationandcontrol';

describe('Automationandcontrol', () => {
  let component: Automationandcontrol;
  let fixture: ComponentFixture<Automationandcontrol>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Automationandcontrol]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Automationandcontrol);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
