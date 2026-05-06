import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialSemanalPage } from './historial-semanal.page';

describe('HistorialSemanalPage', () => {
  let component: HistorialSemanalPage;
  let fixture: ComponentFixture<HistorialSemanalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialSemanalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
