import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Investor } from './investor';

describe('Investor', () => {
  let component: Investor;
  let fixture: ComponentFixture<Investor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Investor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Investor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
