import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RoastService } from '../../services/roast.service';

@Component({
  selector: 'app-add-roast-form',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  styleUrl: './add-roast-form.component.css',
  template: `
    <dialog open>
      <article>
        <h2>Add a new roast:</h2>

        <form [formGroup]="newRoast">
          <fieldset>
            <label>
              Roast*
              <input
                type="text"
                formControlName="roast"
                aria-label="Roast name"
                [attr.aria-invalid]="invalidRoast"
                />
            </label>
            <label>
              Roaster*
              <input
                type="text"
                formControlName="roaster"
                aria-label="The roaster"
                [attr.aria-invalid]="invalidRoaster"
                />
            </label>

            <details>
              <summary>More details:</summary>
              <label>
                Roast composition
                <select
                  formControlName="composition"
                  name="composition"
                  aria-label="Select the composition of this roast"
                  >
                  <option selected value="">-</option>
                  <option value="Single Origin">Single Origin</option>
                  <option value="Blend">Blend</option>
                </select>
              </label>
              <label>
                Process method
                <select
                  formControlName="processMethod"
                  name="process-method"
                  aria-label="Select how this roast was processed"
                  >
                  <option selected value="">-</option>
                  <option value="Washed">Washed</option>
                  <option value="Natural">Natural</option>
                </select>
              </label>
              <label>
                Rating: {{ '⭐️'.repeat(rating!.value) }}
                <input
                  type="range"
                  formControlName="rating"
                  min="0" max="5"
                  aria-label="Your notes about this coffee"
                  />
              </label>
              <label>
                Notes
                <textarea
                  formControlName="notes"
                  name="notes"
                  placeholder="Your notes about this coffee..."
                  aria-label="Your notes about this coffee"
                  ></textarea>
              </label>
            </details>
          </fieldset>
        </form>

        <footer>
          <button (click)="formClosed.emit()" class="outline">Cancel</button>
          <button (click)="createRoast()">Add</button>
        </footer>
      </article>
    </dialog>
  `,
})
export class AddRoastFormComponent implements OnInit {
  private roastService = inject(RoastService);

  @Output() formClosed = new EventEmitter<void>();
  invalidRoast?: boolean;
  invalidRoaster?: boolean;

  newRoast = new FormGroup({
    roast: new FormControl<string>('',
      { validators: [ Validators.required ], nonNullable: true }
    ),
    roaster: new FormControl<string>('',
      { validators: [ Validators.required ], nonNullable: true }
    ),
    composition: new FormControl<'' | 'single origin' | 'blend'>('',
      { nonNullable: true }
    ),
    processMethod: new FormControl<'' | 'washed' | 'natural'>('',
      { nonNullable: true }
    ),
    rating: new FormControl<number>(0,
      { nonNullable: true }
    ),
    notes: new FormControl<string>('',
      { nonNullable: true }
    ),
  });

  ngOnInit(): void {
    // clears errors on form change
    this.roast?.valueChanges.subscribe(() => {
      this.invalidRoast = undefined;
    });
    this.roaster?.valueChanges.subscribe(() => {
      this.invalidRoaster = undefined;
    });
  }

  /* TOBE implemented
    roastedFor - some sort of chips
    tastingNotes - some sort of chips
    rating - a star rating
  */

  private get roast() {
    return this.newRoast.get('roast');
  }

  private get roaster() {
    return this.newRoast.get('roaster');
  }

  public get rating() {
    return this.newRoast.get('rating');
  }

  createRoast() {
    if (this.roast?.errors) {
      this.invalidRoast = true;
      return;
    }

    if (this.roaster?.errors) {
      this.invalidRoaster = true;
      return;
    }

    if (this.newRoast.valid) {
      const { composition, processMethod, rating, notes } = this.newRoast.value;
      const newRoast = {
        name: this.roast!.value,
        roaster: this.roaster!.value,
        composition,
        processMethod,
        rating,
        notes,
      };

      this.roastService.createRoast(newRoast)
        .then(() => this.formClosed.emit())
        .catch(() => console.log('Form says there was error!'));
    }
  }
}
