import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { ItemService, ITEMS_PAGE_SIZE } from '@features/items/services/item.service';
import { configureTestSuite } from 'src/test-utilities/configure-test-suite';
import { mockItem } from 'src/test-utilities/mocks/item.mock';

describe('ItemService', () => {
  let service: ItemService;
  let httpMock: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [ItemService, provideHttpClient(), provideHttpClientTesting()],
    });
  });

  function setup() {
    service = TestBed.inject(ItemService);
    httpMock = TestBed.inject(HttpTestingController);

    return { service, httpMock };
  }

  afterEach(() => {
    httpMock.verify();
  });

  function flushCatalog(httpTestingController: HttpTestingController, templates = [mockItem]) {
    const request = httpTestingController.expectOne('assets/items.json');
    request.flush(templates);
  }

  it('should be created', () => {
    const { service } = setup();

    expect(service).toBeTruthy();
  });

  it('should return item details by id', async () => {
    const { service, httpMock } = setup();
    const itemPromise = firstValueFrom(service.getItemById(1));

    flushCatalog(httpMock);

    const item = await itemPromise;

    expect(item?.name).toBe(mockItem.name);
    expect(item?.details.length).toBeGreaterThan(0);
  });

  it('should return null when item is not found', async () => {
    const { service, httpMock } = setup();
    const itemPromise = firstValueFrom(service.getItemById(999));

    flushCatalog(httpMock);

    const item = await itemPromise;

    expect(item).toBeNull();
  });

  it('should return null when catalog fails to load', async () => {
    const { service, httpMock } = setup();
    const itemPromise = firstValueFrom(service.getItemById(1));

    const request = httpMock.expectOne('assets/items.json');
    request.flush('error', { status: 500, statusText: 'Server Error' });

    const item = await itemPromise;

    expect(item).toBeNull();
    expect(service.loadError()).toBe(true);
  });

  it('should return empty details when template details are missing', async () => {
    const templates = Array.from({ length: 9 }, (_, index) => ({
      ...mockItem,
      id: index + 1,
      name: `Item ${index + 1}`,
    }));
    const { service, httpMock } = setup();
    const itemPromise = firstValueFrom(service.getItemById(9));

    flushCatalog(httpMock, templates);

    const item = await itemPromise;

    expect(item?.details).toEqual([]);
  });

  it('should set loadError on http failure', () => {
    const { service, httpMock } = setup();

    service.getItemById(1).subscribe();

    const request = httpMock.expectOne('assets/items.json');
    request.flush('error', { status: 500, statusText: 'Server Error' });

    expect(service.loadError()).toBe(true);
  });

  it('should return paginated items', async () => {
    jest.useFakeTimers();

    const { service, httpMock } = setup();
    const pagePromise = firstValueFrom(
      service.getItemsPage(0, ITEMS_PAGE_SIZE, '', false, 'default'),
    );

    flushCatalog(httpMock);
    jest.advanceTimersByTime(400);

    const result = await pagePromise;

    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.length).toBeLessThanOrEqual(ITEMS_PAGE_SIZE);
    expect(typeof result.hasMore).toBe('boolean');

    jest.useRealTimers();
  });

  it('should indicate hasMore when more pages exist', async () => {
    jest.useFakeTimers();

    const templates = [mockItem, { ...mockItem, id: 2, name: 'Camera' }];
    const { service, httpMock } = setup();
    const pagePromise = firstValueFrom(service.getItemsPage(0, 2, '', false, 'default'));

    flushCatalog(httpMock, templates);
    jest.advanceTimersByTime(400);

    const result = await pagePromise;

    expect(result.items).toHaveLength(2);
    expect(result.hasMore).toBe(true);

    jest.useRealTimers();
  });

  it('should return empty page when catalog fails to load', async () => {
    jest.useFakeTimers();

    const { service, httpMock } = setup();
    const pagePromise = firstValueFrom(
      service.getItemsPage(0, ITEMS_PAGE_SIZE, '', false, 'default'),
    );

    const request = httpMock.expectOne('assets/items.json');
    request.flush('error', { status: 500, statusText: 'Server Error' });
    jest.advanceTimersByTime(400);

    const result = await pagePromise;

    expect(result.items).toEqual([]);
    expect(result.hasMore).toBe(false);

    jest.useRealTimers();
  });

  it('should filter and sort paginated results', async () => {
    jest.useFakeTimers();

    const templates = [
      mockItem,
      { ...mockItem, id: 2, name: 'Camera', price: 10, inStock: false },
      { ...mockItem, id: 3, name: 'Watch', price: 200, inStock: true },
    ];
    const { service, httpMock } = setup();
    const pagePromise = firstValueFrom(
      service.getItemsPage(0, ITEMS_PAGE_SIZE, 'watch', true, 'rate-desc'),
    );

    flushCatalog(httpMock, templates);
    jest.advanceTimersByTime(400);

    const result = await pagePromise;

    expect(result.items.every((item) => item.inStock)).toBe(true);
    expect(result.items.every((item) => item.name.toLowerCase().includes('watch'))).toBe(true);

    jest.useRealTimers();
  });
});
