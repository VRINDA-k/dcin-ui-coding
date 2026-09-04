import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  Observable,
  combineLatest,
  delay,
  distinctUntilChanged,
  finalize,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { LoadingService } from '@core/services/loading.service';
import {
  ITEMS_PAGE_SIZE,
  ItemService,
  PaginatedItems,
} from '@features/items/services/item.service';
import { Item, ItemSortOption } from '@features/items/models/item.model';
import { ItemFilterBarComponent } from '@features/items/components/item-filter-bar/item-filter-bar.component';
import { ItemCardComponent } from '@features/items/components/item-card/item-card.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { InfiniteScrollDirective } from '@shared/directives/infinite-scroll.directive';

const SEARCH_DEBOUNCE_MS = 300;

type FilterCriteria = {
  nameQuery: string;
  inStockOnly: boolean;
  sortBy: ItemSortOption;
};

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    ItemFilterBarComponent,
    ItemCardComponent,
    LoaderComponent,
    EmptyStateComponent,
    InfiniteScrollDirective,
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsComponent {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly loadingService = inject(LoadingService);
  protected readonly itemService = inject(ItemService);

  protected readonly nameFilter = signal('');
  protected readonly inStockOnly = signal(false);
  protected readonly sortBy = signal<ItemSortOption>('default');

  protected readonly loadedItems = signal<Item[]>([]);
  protected readonly totalCount = signal(0);
  protected readonly hasMore = signal(true);
  protected readonly isLoadingMore = signal(false);
  protected readonly hasCompletedInitialLoad = signal(false);

  protected readonly loadedCount = computed(() => this.loadedItems().length);

  protected readonly showResultsSummary = computed(
    () => this.totalCount() > 0 || this.loadedCount() > 0,
  );

  protected readonly resultsSummary = computed(() => {
    const loaded = this.loadedCount();
    const total = this.totalCount();

    if (total === 0) {
      return '';
    }

    if (loaded >= total) {
      return `${total} results`;
    }

    return `1–${loaded} of ${total} results`;
  });

  protected readonly hasActiveFilters = computed(
    () => this.nameFilter().trim().length > 0 || this.inStockOnly() || this.sortBy() !== 'default',
  );

  private offset = 0;
  private loadRequestId = 0;

  constructor() {
    this.listenToFilterChanges();
  }

  protected loadMore(): void {
    if (!this.hasMore() || this.isLoadingMore() || this.itemService.loadError()) {
      return;
    }

    this.fetchPage$(this.offset, this.currentFilterCriteria(), { append: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected clearFilters(): void {
    this.nameFilter.set('');
    this.inStockOnly.set(false);
    this.sortBy.set('default');
  }

  private listenToFilterChanges(): void {
    this.filterCriteria$()
      .pipe(
        switchMap((criteria) => this.reloadFirstPage$(criteria)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private filterCriteria$(): Observable<FilterCriteria> {
    return combineLatest({
      nameQuery: toObservable(this.nameFilter).pipe(
        distinctUntilChanged(),
        switchMap((value, index) =>
          index === 0 ? of(value) : of(value).pipe(delay(SEARCH_DEBOUNCE_MS)),
        ),
      ),
      inStockOnly: toObservable(this.inStockOnly).pipe(distinctUntilChanged()),
      sortBy: toObservable(this.sortBy).pipe(distinctUntilChanged()),
    });
  }

  private reloadFirstPage$(criteria: FilterCriteria): Observable<PaginatedItems> {
    this.resetPaginationState();

    return this.fetchPage$(0, criteria, { append: false });
  }

  private fetchPage$(
    offset: number,
    criteria: FilterCriteria,
    options: { append: boolean },
  ): Observable<PaginatedItems> {
    const requestId = this.loadRequestId;
    this.isLoadingMore.set(true);

    return this.itemService
      .getItemsPage(
        offset,
        ITEMS_PAGE_SIZE,
        criteria.nameQuery,
        criteria.inStockOnly,
        criteria.sortBy,
      )
      .pipe(
        tap((result) => this.applyPageResult(result, requestId, options.append)),
        finalize(() => {
          if (requestId === this.loadRequestId) {
            this.isLoadingMore.set(false);
          }
        }),
      );
  }

  private resetPaginationState(): void {
    this.loadRequestId += 1;
    this.offset = 0;
    this.loadedItems.set([]);
    this.totalCount.set(0);
    this.hasMore.set(true);
  }

  private applyPageResult(
    { items, hasMore, totalCount }: PaginatedItems,
    requestId: number,
    append: boolean,
  ): void {
    if (requestId !== this.loadRequestId) {
      return;
    }

    if (append) {
      this.loadedItems.update((current) => [...current, ...items]);
    } else {
      this.loadedItems.set(items);
    }

    this.offset += items.length;
    this.totalCount.set(totalCount);
    this.hasMore.set(hasMore);
    this.hasCompletedInitialLoad.set(true);
  }

  private currentFilterCriteria(): FilterCriteria {
    return {
      nameQuery: this.nameFilter(),
      inStockOnly: this.inStockOnly(),
      sortBy: this.sortBy(),
    };
  }
}
