import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TarjetaAlimentosComponent } from './tarjeta-alimentos.component';

describe('TarjetaAlimentosComponent', () => {
  let component: TarjetaAlimentosComponent;
  let fixture: ComponentFixture<TarjetaAlimentosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TarjetaAlimentosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaAlimentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
