import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ItemsComponent } from './features/items/pages/items-list/items.component';
import { ItemDetailComponent } from './features/items/pages/item-detail/item-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'items/:id', component: ItemDetailComponent },
  { path: '**', redirectTo: 'items' },
];
