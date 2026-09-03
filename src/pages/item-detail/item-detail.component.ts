import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { ItemService } from '../../services/item.service';

@Component({
    selector: 'app-item-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './item-detail.component.html',
    styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent {

    constructor(private route: ActivatedRoute, private itemService: ItemService) {
    }
}
