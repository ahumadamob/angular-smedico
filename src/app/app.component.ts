import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { EnvironmentService } from './core/services/environment.service';

interface NavigationLink {
  label: string;
  route: string;
  exact?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly environmentService = inject(EnvironmentService);

  readonly environmentLabel = computed(() => this.environmentService.environmentLabel);
  readonly navigationLinks = signal<NavigationLink[]>([
    { label: 'Dashboard', route: '/dashboard', exact: true }
  ]);
  readonly currentYear = new Date().getFullYear();

  trackByRoute(_: number, link: NavigationLink): string {
    return link.route;
  }
}
