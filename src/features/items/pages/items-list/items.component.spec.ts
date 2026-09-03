import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Subject, of } from 'rxjs';

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
          totalCount: 1,
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
    jest.useFakeTimers();

    const fixture: ComponentFixture<ItemsComponent> = TestBed.createComponent(ItemsComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();

    return { fixture, component, itemService };
  }

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create', () => {
    const { component } = setup();

    expect(component).toBeTruthy();
  });

  it('should show loading skeleton before the initial page load completes', () => {
    const pendingPage$ = new Subject<{
      items: (typeof mockItem)[];
      hasMore: boolean;
      totalCount: number;
    }>();
    itemService.getItemsPage.mockReturnValue(pendingPage$.asObservable());
    jest.useFakeTimers();

    const fixture: ComponentFixture<ItemsComponent> = TestBed.createComponent(ItemsComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-empty-state')).toBeNull();
    expect(element.querySelector('app-loader')).toBeTruthy();
  });

  it('should load the first page of items on init', () => {
    const { component } = setup();

    expect(itemService.getItemsPage).toHaveBeenCalledWith(0, 8, '', false, 'default');
    expect(component['loadedItems']()).toEqual([mockItem]);
    expect(component['totalCount']()).toBe(1);
    expect(component['loadedCount']()).toBe(1);
    expect(component['hasMore']()).toBe(false);
  });

  it('should debounce name filter changes before reloading', () => {
    const { component } = setup();

    itemService.getItemsPage.mockClear();
    component['nameFilter'].set('s');
    component['nameFilter'].set('su');
    component['nameFilter'].set('sun');
    TestBed.tick();

    jest.advanceTimersByTime(299);
    expect(itemService.getItemsPage).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    TestBed.tick();

    expect(itemService.getItemsPage).toHaveBeenCalledTimes(1);
    expect(itemService.getItemsPage).toHaveBeenCalledWith(0, 8, 'sun', false, 'default');
  });

  it('should reload immediately when in-stock filter changes', () => {
    const { component } = setup();

    itemService.getItemsPage.mockClear();
    component['inStockOnly'].set(true);
    TestBed.tick();

    expect(itemService.getItemsPage).toHaveBeenCalledWith(0, 8, '', true, 'default');
  });

  it('should reload immediately when sort changes', () => {
    const { component } = setup();

    itemService.getItemsPage.mockClear();
    component['sortBy'].set('rate-desc');
    TestBed.tick();

    expect(itemService.getItemsPage).toHaveBeenCalledWith(0, 8, '', false, 'rate-desc');
  });

  it('should mark filters as active when a name filter is applied', () => {
    const { component } = setup();

    component['nameFilter'].set('sunglasses');

    expect(component['hasActiveFilters']()).toBe(true);
  });

  it('should mark filters as active when in-stock only is enabled', () => {
    const { component } = setup();

    component['inStockOnly'].set(true);

    expect(component['hasActiveFilters']()).toBe(true);
  });

  it('should mark filters as active when sort is not default', () => {
    const { component } = setup();

    component['sortBy'].set('rate-asc');

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

  it('should append items when loadMore is called', () => {
    const secondItem = { ...mockItem, id: 2, name: 'Camera' };
    itemService.getItemsPage
      .mockReturnValueOnce(of({ items: [mockItem], hasMore: true, totalCount: 48 }))
      .mockReturnValueOnce(of({ items: [secondItem], hasMore: false, totalCount: 48 }));

    const { component } = setup();

    expect(component['loadedItems']()).toEqual([mockItem]);
    expect(component['hasMore']()).toBe(true);

    component['loadMore']();
    TestBed.tick();

    expect(itemService.getItemsPage).toHaveBeenLastCalledWith(1, 8, '', false, 'default');
    expect(component['loadedItems']()).toEqual([mockItem, secondItem]);
    expect(component['loadedCount']()).toBe(2);
    expect(component['totalCount']()).toBe(48);
    expect(component['hasMore']()).toBe(false);
    expect(component['isLoadingMore']()).toBe(false);
  });

  it('should not load more items when there are no more pages', () => {
    const { component } = setup();

    itemService.getItemsPage.mockClear();
    component['loadMore']();

    expect(itemService.getItemsPage).not.toHaveBeenCalled();
  });

  it('should not load more items while a page request is in progress', () => {
    const { component } = setup();

    itemService.getItemsPage.mockClear();
    component['isLoadingMore'].set(true);
    component['loadMore']();

    expect(itemService.getItemsPage).not.toHaveBeenCalled();
  });

  it('should not load more items when the catalog failed to load', () => {
    const { component } = setup();

    itemService.getItemsPage.mockClear();
    itemService.loadError.set(true);
    component['hasMore'].set(true);
    component['loadMore']();

    expect(itemService.getItemsPage).not.toHaveBeenCalled();
  });

  it('should ignore stale page responses after filters change', () => {
    const staleLoadMorePage$ = new Subject<{
      items: (typeof mockItem)[];
      hasMore: boolean;
      totalCount: number;
    }>();
    const freshItem = { ...mockItem, id: 99, name: 'Fresh Item' };

    itemService.getItemsPage
      .mockReturnValueOnce(of({ items: [mockItem], hasMore: true, totalCount: 48 }))
      .mockReturnValueOnce(staleLoadMorePage$.asObservable())
      .mockReturnValue(of({ items: [freshItem], hasMore: false, totalCount: 1 }));

    const { component } = setup();

    component['loadMore']();
    component['nameFilter'].set('fresh');
    TestBed.tick();
    jest.advanceTimersByTime(300);
    TestBed.tick();

    staleLoadMorePage$.next({
      items: [{ ...mockItem, id: 50, name: 'Stale Item' }],
      hasMore: false,
      totalCount: 48,
    });
    staleLoadMorePage$.complete();
    TestBed.tick();

    expect(component['loadedItems']()).toEqual([freshItem]);
  });

  it('should display loaded and total product counts', () => {
    itemService.getItemsPage.mockReturnValueOnce(
      of({ items: [mockItem], hasMore: true, totalCount: 48 }),
    );

    const { fixture, component } = setup();

    expect(component['totalCount']()).toBe(48);
    expect(component['loadedCount']()).toBe(1);
    expect(fixture.nativeElement.querySelector('.filter-bar__count')?.textContent?.trim()).toBe(
      '1–1 of 48 results',
    );
  });

  it('should render loaded items in the grid', () => {
    const { fixture } = setup();

    const cards = fixture.nativeElement.querySelectorAll('app-item-card');

    expect(cards.length).toBe(1);
  });

  it('should render infinite scroll sentinel when more pages exist', () => {
    itemService.getItemsPage.mockReturnValueOnce(
      of({ items: [mockItem], hasMore: true, totalCount: 48 }),
    );

    const { fixture } = setup();

    expect(fixture.nativeElement.querySelector('.items-page__scroll-sentinel')).toBeTruthy();
  });

  it('should render load-more spinner while fetching the next page', () => {
    const nextPage$ = new Subject<{
      items: (typeof mockItem)[];
      hasMore: boolean;
      totalCount: number;
    }>();
    itemService.getItemsPage
      .mockReturnValueOnce(of({ items: [mockItem], hasMore: true, totalCount: 48 }))
      .mockReturnValueOnce(nextPage$.asObservable());

    const { fixture, component } = setup();

    component['loadMore']();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.items-page__load-more')).toBeTruthy();
    expect(component['isLoadingMore']()).toBe(true);

    nextPage$.next({
      items: [{ ...mockItem, id: 2, name: 'Camera' }],
      hasMore: false,
      totalCount: 48,
    });
    nextPage$.complete();
    TestBed.tick();
    fixture.detectChanges();

    expect(component['isLoadingMore']()).toBe(false);
    expect(fixture.nativeElement.querySelector('.items-page__load-more')).toBeNull();
  });

  it('should render error state when catalog loading fails', () => {
    const { fixture } = setup();

    itemService.loadError.set(true);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-empty-state')?.textContent).toContain(
      'Unable to load products',
    );
    expect(element.querySelector('app-item-card')).toBeNull();
  });

  it('should render filtered empty state when no items match', () => {
    itemService.getItemsPage.mockReturnValue(of({ items: [], hasMore: false, totalCount: 0 }));

    const { fixture, component } = setup();

    component['nameFilter'].set('missing-product');
    TestBed.tick();
    jest.advanceTimersByTime(300);
    TestBed.tick();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-empty-state')?.textContent).toContain('No items found');
    expect(element.querySelector('app-empty-state')?.textContent).toContain(
      'No products match your current search or filter',
    );
    expect(element.querySelector('.empty-state__action')).toBeTruthy();
  });

  it('should render default empty state when catalog has no products', () => {
    itemService.getItemsPage.mockReturnValue(of({ items: [], hasMore: false, totalCount: 0 }));

    const { fixture } = setup();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-empty-state')?.textContent).toContain('No items found');
    expect(element.querySelector('app-empty-state')?.textContent).toContain(
      'There are no products available right now',
    );
    expect(element.querySelector('.empty-state__action')).toBeNull();
  });

  it('should trigger clear filters from empty state action', () => {
    itemService.getItemsPage.mockReturnValue(of({ items: [], hasMore: false, totalCount: 0 }));

    const { fixture, component } = setup();

    component['nameFilter'].set('missing-product');
    component['inStockOnly'].set(true);
    TestBed.tick();
    jest.advanceTimersByTime(300);
    TestBed.tick();
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement)
      .querySelector('.empty-state__action')
      ?.dispatchEvent(new Event('click'));

    expect(component['nameFilter']()).toBe('');
    expect(component['inStockOnly']()).toBe(false);
    expect(component['sortBy']()).toBe('default');
  });
});
