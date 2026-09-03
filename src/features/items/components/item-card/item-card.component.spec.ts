import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ItemCardComponent } from '@features/items/components/item-card/item-card.component';
import { Item } from '@features/items/models/item.model';
import { configureTestSuite } from 'src/test-utilities/configure-test-suite';
import { mockItem } from 'src/test-utilities/mocks/item.mock';

describe('ItemCardComponent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [ItemCardComponent],
      providers: [provideRouter([])],
    });
  });

  function setup(item: Item = mockItem) {
    const fixture: ComponentFixture<ItemCardComponent> = TestBed.createComponent(ItemCardComponent);
    const component = fixture.componentInstance;

    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();

    return { fixture, component };
  }

  it('should create', () => {
    const { component } = setup();

    expect(component).toBeTruthy();
  });

  it('should render item name and category', () => {
    const { fixture } = setup();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.item-card__name')?.textContent?.trim()).toBe('Sunglasses');
    expect(element.querySelector('.item-card__category')?.textContent?.trim()).toBe('Accessories');
  });

  it('should render stock count for in-stock items', () => {
    const { fixture } = setup();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.item-card__stock')?.textContent?.trim()).toContain(
      '12 left in stock',
    );
  });

  it('should show out of stock overlay when item is not in stock', () => {
    const { fixture } = setup({ ...mockItem, inStock: false });
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.item-card__overlay-badge')?.textContent?.trim()).toBe(
      'Out of Stock',
    );
    expect(element.querySelector('.item-card__stock')).toBeNull();
  });
});
