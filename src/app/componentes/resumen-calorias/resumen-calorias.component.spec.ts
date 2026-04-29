import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResumenCaloriasComponent } from './resumen-calorias.component';

describe('ResumenCaloriasComponent', () => {
  let component: ResumenCaloriasComponent;
  let fixture: ComponentFixture<ResumenCaloriasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ResumenCaloriasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumenCaloriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
