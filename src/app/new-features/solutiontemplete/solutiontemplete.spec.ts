import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Solutiontemplete } from './solutiontemplete';

describe('Solutiontemplete', () => {
  let component: Solutiontemplete;
  let fixture: ComponentFixture<Solutiontemplete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Solutiontemplete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Solutiontemplete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
