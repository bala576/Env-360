import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Alermsandevents } from './alermsandevents';

describe('Alermsandevents', () => {
  let component: Alermsandevents;
  let fixture: ComponentFixture<Alermsandevents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alermsandevents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Alermsandevents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
