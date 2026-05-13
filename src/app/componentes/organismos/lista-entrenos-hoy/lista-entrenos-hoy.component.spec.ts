import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListaEntrenosHoyComponent } from './lista-entrenos-hoy.component';

describe('ListaEntrenosHoyComponent', () => {
  let component: ListaEntrenosHoyComponent;
  let fixture: ComponentFixture<ListaEntrenosHoyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ListaEntrenosHoyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaEntrenosHoyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
