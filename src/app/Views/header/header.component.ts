import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SvCacheService } from 'src/app/Services/Cache/sv-cache.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private readonly cacheService = inject(SvCacheService);
  private readonly router = inject(Router);

  async logout(): Promise<void> {
    this.cacheService.removeToken();
    await this.router.navigate(['/']);
  }

}
