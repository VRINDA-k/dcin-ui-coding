import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  fullSizeImage: string | null = null;

  openFullSize(url: string): void {
    this.fullSizeImage = url;
  }

  closeFullSize(): void {
    this.fullSizeImage = null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeFullSize();
  }
}
