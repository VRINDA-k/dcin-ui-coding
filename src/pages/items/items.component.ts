import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../services/item.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-item-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './items.component.html'
})
export class ItemsComponent {
    public filter = '';

    constructor(private itemService: ItemService) {}
}
