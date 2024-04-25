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
              Roast
              <input
                type="text"
                formControlName="roast"
                aria-label="Roast"
                [attr.aria-invalid]="roastError"
                />
            </label>
            <label>
              Roaster
              <input
                type="text"
                formControlName="roaster"
                aria-label="Roaster"
                [attr.aria-invalid]="roasterError"
                />
            </label>

            <details>
              <summary>More details?</summary>
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
  roastError: boolean | undefined;
  roasterError: boolean | undefined;

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
    notes: new FormControl<string>('',
      { nonNullable: true }
    ),
  });

  ngOnInit(): void {
    // clears errors on form change
    this.roast?.valueChanges.subscribe(() => {
      if (this.roastError) {
        return this.roastError = undefined;
      }
    });

    // clears errors on form change
    this.roaster?.valueChanges.subscribe(() => {
      if (this.roasterError) {
        return this.roasterError = undefined;
      }
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

  createRoast() {
    if (this.roast?.errors) {
      this.roastError = true;
      return;
    }

    if (this.roaster?.errors) {
      this.roasterError = true;
      return;
    }

    if (this.newRoast.valid) {
      const { composition, processMethod, notes } = this.newRoast.value;
      const newRoast = {
        name: this.roast!.value,
        roaster: this.roaster!.value,
        composition,
        processMethod,
        notes,
      };

      this.roastService.createRoast(newRoast)
        .then(() => this.formClosed.emit())
        .catch(() => console.log('Form says there was error!'));
    }
  }
}
