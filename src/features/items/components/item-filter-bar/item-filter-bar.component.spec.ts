import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemFilterBarComponent } from '@features/items/components/item-filter-bar/item-filter-bar.component';
import { configureTestSuite } from 'src/test-utilities/configure-test-suite';

describe('ItemFilterBarComponent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [ItemFilterBarComponent],
    });
  });

  function setup() {
    const fixture: ComponentFixture<ItemFilterBarComponent> =
      TestBed.createComponent(ItemFilterBarComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();

    return { fixture, component };
  }

  it('should create', () => {
    const { component } = setup();

    expect(component).toBeTruthy();
  });

  it('should clear search', () => {
    const { component } = setup();

    component.nameFilter.set('camera');
    component.clearSearch();

    expect(component.nameFilter()).toBe('');
  });

  it('should toggle sort menu', () => {
    const { component } = setup();

    component['toggleSortMenu']();

    expect(component['isSortOpen']()).toBe(true);

    component['toggleSortMenu']();

    expect(component['isSortOpen']()).toBe(false);
  });

  it('should select sort option and close menu', () => {
    const { component } = setup();

    component['isSortOpen'].set(true);
    component['selectSort']('rate-asc');

    expect(component.sortBy()).toBe('rate-asc');
    expect(component['isSortOpen']()).toBe(false);
  });

  it('should close sort menu on escape', () => {
    const { component } = setup();

    component['isSortOpen'].set(true);
    component.onEscape();

    expect(component['isSortOpen']()).toBe(false);
  });

  it('should close sort menu when clicking outside', () => {
    const { component } = setup();

    component['isSortOpen'].set(true);
    component.onDocumentClick(new MouseEvent('click'));

    expect(component['isSortOpen']()).toBe(false);
  });

  it('should keep sort menu open when clicking inside', () => {
    const { fixture, component } = setup();

    component['isSortOpen'].set(true);
    const searchInput = fixture.nativeElement.querySelector('#name-filter') as HTMLElement;
    component.onDocumentClick({ target: searchInput } as unknown as MouseEvent);

    expect(component['isSortOpen']()).toBe(true);
  });

  it('should mark sort as active when a non-default option is selected', () => {
    const { fixture, component } = setup();

    component.sortBy.set('rate-desc');
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();

    expect(component['isSortActive']()).toBe(true);
    expect(component['selectedSortLabel']()).toBe('High to low');
    expect(fixture.nativeElement.querySelector('.filter-bar__sort--active')).toBeTruthy();
  });

  it('should use default label when sort option is unknown', () => {
    const { component } = setup();

    component.sortBy.set('unknown' as never);

    expect(component['selectedSortLabel']()).toBe('Default');
    expect(component['isSortActive']()).toBe(true);
  });

  it('should render sort trigger and search input', () => {
    const { fixture } = setup();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('#sort-by-rate-filter')).toBeTruthy();
    expect(element.querySelector('#name-filter')).toBeTruthy();
  });
});
