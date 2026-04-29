import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResumenNutricionalComponent } from './resumen-nutricional.component';

describe('ResumenNutricionalComponent', () => {
  let component: ResumenNutricionalComponent;
  let fixture: ComponentFixture<ResumenNutricionalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ResumenNutricionalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumenNutricionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
