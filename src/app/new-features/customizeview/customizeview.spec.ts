import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Customizeview } from './customizeview';

describe('Customizeview', () => {
  let component: Customizeview;
  let fixture: ComponentFixture<Customizeview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Customizeview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Customizeview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
