import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { UserService } from './core';

/**
 * App component.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  /**
   * Construct a new app component.
   *
   * @param titleService - Title service instance
   */
  public constructor(
    private readonly titleService: Title,
    private readonly userService: UserService,
  ) {}

  /**
   * Initialization completed callback.
   */
  public ngOnInit(): void {
    this.setTitle(environment.appName);
    this.userService.populate();
  }

  /**
   * Returns the current title.
   */
  public getTitle(): string {
    return this.titleService.getTitle();
  }

  /**
   * Set the current title.
   */
  public setTitle(title: string): void {
    this.titleService.setTitle(title);
  }
}
