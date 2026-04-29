import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CalculadoraMetabolicaComponent } from './calculadora-metabolica.component';

describe('CalculadoraMetabolicaComponent', () => {
  let component: CalculadoraMetabolicaComponent;
  let fixture: ComponentFixture<CalculadoraMetabolicaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CalculadoraMetabolicaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalculadoraMetabolicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
