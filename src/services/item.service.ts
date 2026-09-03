import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, map, of} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ItemService {
    private readonly url = 'assets/items.json';

    constructor(private http: HttpClient) {}

    public getItems(): Observable<[]> {
        // TODO: Implement and return data from JSON file
        return of([]);
    }

    public getItemById(id: number): Observable<{}> {
        // TODO: Implement and return specific Item data from JSON file
        return of({});
    }
}
