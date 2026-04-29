import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItemDiarioComponent } from './item-diario.component';

describe('ItemDiarioComponent', () => {
  let component: ItemDiarioComponent;
  let fixture: ComponentFixture<ItemDiarioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ItemDiarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemDiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
