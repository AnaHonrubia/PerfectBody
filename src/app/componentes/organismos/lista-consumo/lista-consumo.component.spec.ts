import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListaConsumoComponent } from './lista-consumo.component';

describe('ListaConsumoComponent', () => {
  let component: ListaConsumoComponent;
  let fixture: ComponentFixture<ListaConsumoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ListaConsumoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaConsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
