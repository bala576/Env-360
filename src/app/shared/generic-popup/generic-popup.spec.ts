import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericPopup } from './generic-popup';

describe('GenericPopup', () => {
  let component: GenericPopup;
  let fixture: ComponentFixture<GenericPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
