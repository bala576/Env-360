import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayloadMapping } from './payload-mapping';

describe('PayloadMapping', () => {
  let component: PayloadMapping;
  let fixture: ComponentFixture<PayloadMapping>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayloadMapping]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayloadMapping);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
