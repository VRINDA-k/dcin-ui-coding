import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { LoadingService } from '@core/services/loading.service';
import { ItemDetailComponent } from '@features/items/pages/item-detail/item-detail.component';
import { ItemService } from '@features/items/services/item.service';
import { configureTestSuite } from 'src/test-utilities/configure-test-suite';
import { mockItemDetail } from 'src/test-utilities/mocks/item.mock';

describe('ItemDetailComponent', () => {
  let itemService: {
    loadError: ReturnType<typeof signal<boolean>>;
    getItemById: jest.Mock;
  };
  let router: Router;

  configureTestSuite(() => {
    itemService = {
      loadError: signal(false),
      getItemById: jest.fn().mockReturnValue(of(mockItemDetail)),
    };

    TestBed.configureTestingModule({
      imports: [ItemDetailComponent],
      providers: [
        provideRouter([]),
        LoadingService,
        { provide: ItemService, useValue: itemService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' })),
          },
        },
      ],
    });
  });

  function setup() {
    const fixture: ComponentFixture<ItemDetailComponent> =
      TestBed.createComponent(ItemDetailComponent);
    const component = fixture.componentInstance;

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();

    return { fixture, component, router };
  }

  it('should create', () => {
    const { component } = setup();

    expect(component).toBeTruthy();
  });

  it('should load item details for the route id', () => {
    const { component } = setup();

    expect(itemService.getItemById).toHaveBeenCalledWith(1);
    expect(component['item']()).toEqual(mockItemDetail);
  });

  it('should render item name, price, and description', () => {
    const { fixture } = setup();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('#item-detail-name')?.textContent?.trim()).toBe('Sunglasses');
    expect(element.querySelector('.item-detail__price')?.textContent?.trim()).toContain('79.99');
    expect(element.querySelector('.item-detail__description')?.textContent?.trim()).toBe(
      mockItemDetail.description,
    );
  });

  it('should render product detail bullets', () => {
    const { fixture } = setup();

    const bullets = fixture.nativeElement.querySelectorAll('.item-detail__details-list li');

    expect(bullets.length).toBe(mockItemDetail.details.length);
    expect(bullets[0].textContent?.trim()).toBe(mockItemDetail.details[0]);
  });

  it('should navigate back to items list', () => {
    const { component, router } = setup();

    component['navigateToItems']();

    expect(router.navigate).toHaveBeenCalledWith(['/items']);
  });

  it('should show not found state when item does not exist', () => {
    itemService.getItemById.mockReturnValue(of(null));

    const fixture = TestBed.createComponent(ItemDetailComponent);
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-empty-state')?.textContent).toContain('Item not found');
  });
});
