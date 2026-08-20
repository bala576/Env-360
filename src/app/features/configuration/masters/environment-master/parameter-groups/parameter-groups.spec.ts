import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterGroups } from './parameter-groups';

describe('ParameterGroups', () => {
  let component: ParameterGroups;
  let fixture: ComponentFixture<ParameterGroups>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParameterGroups]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParameterGroups);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
