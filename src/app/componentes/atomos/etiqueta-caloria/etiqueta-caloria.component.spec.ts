import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EtiquetaCaloriaComponent } from './etiqueta-caloria.component';

describe('EtiquetaCaloriaComponent', () => {
  let component: EtiquetaCaloriaComponent;
  let fixture: ComponentFixture<EtiquetaCaloriaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EtiquetaCaloriaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EtiquetaCaloriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
