import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay, switchMap, take, timer } from 'rxjs';

import { Item, ItemDetail } from '../models/item.model';
import { ITEM_DETAILS } from '../data/item-details';
import { generateItems, getTemplateId } from '../utils/generate-items';
import { filterItems } from '../utils/filter-items';
import { sortItems } from '../utils/sort-items';
import { ItemSortOption } from '../models/item.model';

export type PaginatedItems = {
  items: Item[];
  hasMore: boolean;
  totalCount: number;
};

export const ITEMS_PAGE_SIZE = 8;

@Injectable({ providedIn: 'root' })
export class ItemService {
  private readonly http = inject(HttpClient);
  private readonly url = 'assets/items.json';
  readonly loadError = signal(false);

  /**
   * @description
   * Loads the catalog from the JSON file and transforms it into a signal.
   * For testing purposes, the catalog is loaded from a JSON file.
   * In a real application, the catalog would be loaded from a backend API so in getItems and getItemById
   * we would need to make HTTP requests to the backend API.
   * @returns A signal containing the catalog.
   */
  private readonly catalog$ = this.http.get<Item[]>(this.url).pipe(
    map((templates) => ({
      items: generateItems(templates),
      templateCount: templates.length,
    })),
    catchError(() => {
      this.loadError.set(true);
      return of(null);
    }),
    shareReplay(1),
  );

  public getItemsPage(
    offset: number,
    limit: number,
    nameQuery: string,
    inStockOnly: boolean,
    sortBy: ItemSortOption,
  ): Observable<PaginatedItems> {
    return this.catalog$.pipe(
      switchMap((catalog) =>
        timer(400).pipe(
          map(() => {
            const filtered = filterItems(catalog?.items ?? [], nameQuery, inStockOnly);
            const sorted = sortItems(filtered, sortBy);
            const pageItems = sorted.slice(offset, offset + limit);

            return {
              items: pageItems,
              hasMore: offset + limit < sorted.length,
              totalCount: sorted.length,
            };
          }),
        ),
      ),
      take(1),
    );
  }

  public getItemById(id: number): Observable<ItemDetail | null> {
    return this.catalog$.pipe(
      map((catalog) => {
        if (!catalog) {
          return null;
        }

        const item = catalog.items.find((entry) => entry.id === id);
        if (!item) {
          return null;
        }

        const templateId = getTemplateId(item.id, catalog.templateCount);

        return {
          ...item,
          details: [...(ITEM_DETAILS[templateId] ?? [])],
        };
      }),
      take(1),
    );
  }
}
