import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InputDatoComponent } from './input-dato.component';

describe('InputDatoComponent', () => {
  let component: InputDatoComponent;
  let fixture: ComponentFixture<InputDatoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [InputDatoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputDatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
