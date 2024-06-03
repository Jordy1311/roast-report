import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

import { RoastService } from '../../services/roast.service';
import { COUNTRIES } from '../../countries';

@Component({
  selector: 'app-add-roast-form',
  standalone: true,
  imports: [ ReactiveFormsModule, MatButtonModule ],
  styleUrl: './add-roast-form.component.css',
  template: `
    <div class="modal is-active" open>
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <h2 class="modal-card-title">Add a roast</h2>
        </header>

        <section class="modal-card-body">
          <form [formGroup]="newRoast">
            <div class="field">
              <label for="roast" class="label">Roast</label>
              <div class="control">
                <input
                  id="roast"
                  type="text"
                  formControlName="roast"
                  class="input"
                  [class.is-danger]="invalidRoast"
                  aria-label="Roast name"
                  [attr.aria-invalid]="invalidRoast"
                  />
              </div>
            </div>

            <div class="field">
              <label for="roaster" class="label">Roaster</label>
              <div class="control">
                <input
                  id="roaster"
                  type="text"
                  formControlName="roaster"
                  class="input"
                  [class.is-danger]="invalidRoaster"
                  aria-label="The roaster"
                  [attr.aria-invalid]="invalidRoaster"
                  />
              </div>
            </div>

            <div class="composition-process-select-pair">
              <div class="field">
                <label for="composition" class="label">Roast composition</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select
                      id="composition"
                      formControlName="composition"
                      name="composition"
                      aria-label="Select the composition of this roast"
                      >
                      <option selected value="">-</option>
                      <option value="Single Origin">Single Origin</option>
                      <option value="Blend">Blend</option>
                    </select>
                  </div>
                </div>
              </div>
  
              <div class="field ml-5">
                <label for="processMethod" class="label">Process method</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select
                      id="processMethod"
                      formControlName="processMethod"
                      name="process-method"
                      aria-label="Select how this roast was processed"
                      >
                      <option selected value="">-</option>
                      <option value="Washed">Washed</option>
                      <option value="Natural">Natural</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="field">
              <label for="rating" class="label">Rating: {{ '⭐️'.repeat(rating!.value) }}</label>
              <div class="control">
                <input
                  id="rating"
                  type="range"
                  formControlName="rating"
                  min="0" max="5"
                  aria-label="Your notes about this coffee"
                  />
              </div>
            </div>

            <div class="field">
              <label for="notes" class="label">Notes</label>
              <div class="control">
                <textarea
                  id="notes"
                  formControlName="notes"
                  class="textarea"
                  name="notes"
                  placeholder="Your notes about this coffee..."
                  aria-label="Your notes about this coffee"
                  ></textarea>
              </div>
            </div>
          </form>
        </section>


        <footer class="modal-card-foot">
          <div class="field is-grouped">
            <div class="control">
              <button
                (click)="createRoast()"
                mat-flat-button
                color="primary"
              >
                Add roast
              </button>
            </div>
            <div class="control">
              <button
                (click)="formClosed.emit()"
                mat-stroked-button
                color="primary"
              >
                Cancel
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
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
