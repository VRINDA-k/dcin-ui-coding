import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { LoadingService } from '@core/services/loading.service';
import { ItemsComponent } from '@features/items/pages/items-list/items.component';
import { ItemService } from '@features/items/services/item.service';
import { configureTestSuite } from 'src/test-utilities/configure-test-suite';
import { mockItem } from 'src/test-utilities/mocks/item.mock';

describe('ItemsComponent', () => {
  let itemService: {
    loadError: ReturnType<typeof signal<boolean>>;
    getItemsPage: jest.Mock;
  };

  configureTestSuite(() => {
    itemService = {
      loadError: signal(false),
      getItemsPage: jest.fn().mockReturnValue(
        of({
          items: [mockItem],
          hasMore: false,
        }),
      ),
    };

    TestBed.configureTestingModule({
      imports: [ItemsComponent],
      providers: [
        provideRouter([]),
        LoadingService,
        { provide: ItemService, useValue: itemService },
      ],
    });
  });

  function setup() {
    const fixture: ComponentFixture<ItemsComponent> = TestBed.createComponent(ItemsComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();

    return { fixture, component, itemService };
  }

  it('should create', () => {
    const { component } = setup();

    expect(component).toBeTruthy();
  });

  it('should load the first page of items on init', () => {
    const { component } = setup();

    expect(itemService.getItemsPage).toHaveBeenCalledWith(0, 8, '', false, 'default');
    expect(component['loadedItems']()).toEqual([mockItem]);
    expect(component['hasMore']()).toBe(false);
  });

  it('should mark filters as active when a name filter is applied', () => {
    const { component } = setup();

    component['nameFilter'].set('sunglasses');

    expect(component['hasActiveFilters']()).toBe(true);
  });

  it('should clear all filters', () => {
    const { component } = setup();

    component['nameFilter'].set('camera');
    component['inStockOnly'].set(true);
    component['sortBy'].set('rate-asc');

    component['clearFilters']();

    expect(component['nameFilter']()).toBe('');
    expect(component['inStockOnly']()).toBe(false);
    expect(component['sortBy']()).toBe('default');
    expect(component['hasActiveFilters']()).toBe(false);
  });

  it('should render loaded items in the grid', () => {
    const { fixture } = setup();

    const cards = fixture.nativeElement.querySelectorAll('app-item-card');

    expect(cards.length).toBe(1);
  });

  it('should not load more items when there are no more pages', () => {
    const { component } = setup();

    itemService.getItemsPage.mockClear();
    component['loadMore']();

    expect(itemService.getItemsPage).not.toHaveBeenCalled();
  });
});
