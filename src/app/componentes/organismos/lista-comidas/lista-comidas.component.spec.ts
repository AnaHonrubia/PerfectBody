import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListaComidasComponent } from './lista-comidas.component';

describe('ListaComidasComponent', () => {
  let component: ListaComidasComponent;
  let fixture: ComponentFixture<ListaComidasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ListaComidasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaComidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
