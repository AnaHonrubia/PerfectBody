import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TarjetaEjercicioComponent } from './tarjeta-ejercicio.component';

describe('TarjetaEjercicioComponent', () => {
  let component: TarjetaEjercicioComponent;
  let fixture: ComponentFixture<TarjetaEjercicioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TarjetaEjercicioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaEjercicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
