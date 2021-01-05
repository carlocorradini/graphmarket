import { Component } from '@angular/core';

/**
 * Footer component.
 */
@Component({
  selector: 'app-layout-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  /**
   * Today date.
   */
  private readonly _today: Date = new Date();

  /**
   * Returns the today date.
   */
  public get today(): Date {
    return this._today;
  }
}
