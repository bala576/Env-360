import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Deviceuplaod } from './deviceuplaod';

describe('Deviceuplaod', () => {
  let component: Deviceuplaod;
  let fixture: ComponentFixture<Deviceuplaod>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Deviceuplaod]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Deviceuplaod);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
