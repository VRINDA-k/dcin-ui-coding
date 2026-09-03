import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { Item, ItemDetail } from '../models/item.model';
import { ITEM_DETAILS } from '../data/item-details';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private readonly http = inject(HttpClient);
  private readonly url = 'assets/items.json';
  readonly loadError = signal(false);

  private readonly items$ = this.http.get<Item[]>(this.url).pipe(
    catchError(() => {
      this.loadError.set(true);
      return of(null);
    }),
    shareReplay(1),
  );

  public getItems(): Observable<Item[]> {
    return this.items$.pipe(map((items) => items ?? []));
  }

  public getItemById(id: number): Observable<ItemDetail | null> {
    return this.items$.pipe(
      map((items) => {
        if (!items) {
          return null;
        }

        const item = items.find((i) => i.id === id);
        if (!item) {
          return null;
        }

        return {
          ...item,
          details: [...(ITEM_DETAILS[id] ?? [])],
        };
      }),
    );
  }
}
