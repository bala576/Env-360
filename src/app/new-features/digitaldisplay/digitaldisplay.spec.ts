import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Digitaldisplay } from './digitaldisplay';

describe('Digitaldisplay', () => {
  let component: Digitaldisplay;
  let fixture: ComponentFixture<Digitaldisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Digitaldisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Digitaldisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
