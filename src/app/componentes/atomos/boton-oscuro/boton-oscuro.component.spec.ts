import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BotonOscuroComponent } from './boton-oscuro.component';

describe('BotonOscuroComponent', () => {
  let component: BotonOscuroComponent;
  let fixture: ComponentFixture<BotonOscuroComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BotonOscuroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BotonOscuroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
