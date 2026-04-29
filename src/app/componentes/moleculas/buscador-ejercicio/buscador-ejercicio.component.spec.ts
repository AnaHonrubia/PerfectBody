import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuscadorEjercicioComponent } from './buscador-ejercicio.component';

describe('BuscadorEjercicioComponent', () => {
  let component: BuscadorEjercicioComponent;
  let fixture: ComponentFixture<BuscadorEjercicioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BuscadorEjercicioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscadorEjercicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
