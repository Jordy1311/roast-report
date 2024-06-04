import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

import { RoastService } from '../../services/roast.service';
// import { COUNTRIES } from '../../countries';

@Component({
  selector: 'app-add-roast-form',
  standalone: true,
  imports: [ ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSelectModule, MatSliderModule ],
  styleUrl: './add-roast-form.component.css',
  template: `
    <div class="modal is-active" open>
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <h2>Add a roast</h2>
        </header>

        <section class="modal-card-body">
          <form [formGroup]="newRoast">
            <mat-form-field class="is-fullwidth">
              <mat-label>Roast</mat-label>
              <input
                matInput
                type="text"
                formControlName="roast"
                aria-label="Roast name"
              />
              <mat-error>Please enter a roast name.</mat-error>
            </mat-form-field>

            <mat-form-field class="is-fullwidth">
              <mat-label>Roaster</mat-label>
              <input
                matInput
                type="text"
                formControlName="roaster"
                aria-label="The roaster"
              />
              <mat-error>Please enter a roaster.</mat-error>
            </mat-form-field>

            <div class="composition-process-select-pair">
              <mat-form-field>
                <mat-label>Roast composition</mat-label>
                <mat-select
                  formControlName="composition"
                  name="composition"
                  aria-label="Select the composition of this roast"
                >
                  <mat-option selected value="">-</mat-option>
                  <mat-option value="Single Origin">Single Origin</mat-option>
                  <mat-option value="Blend">Blend</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field>
                <mat-label>Process method</mat-label>
                <mat-select
                  formControlName="processMethod"
                  name="process-method"
                  aria-label="Select how this roast was processed"
                  >
                  <mat-option selected value="">-</mat-option>
                  <mat-option value="Washed">Washed</mat-option>
                  <mat-option value="Natural">Natural</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="rating-container">
              <label for="rating-slider">
                @if (rating!.pristine) {
                  Your rating...
                } @else {
                  You're rating: {{ rating!.value }} out of 5
                }
              </label>
              <mat-slider min="0" max="5" discrete>
                <input
                  id="rating-slider"
                  matSliderThumb
                  formControlName="rating"
                />
              </mat-slider>
            </div>

            <mat-form-field class="is-fullwidth">
              <mat-label>Notes</mat-label>
              <textarea
                matInput
                formControlName="notes"
                placeholder="Your notes about this coffee..."
                aria-label="Your notes about this coffee"
              ></textarea>
            </mat-form-field>
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
                <span>Add roast</span>
                <mat-icon aria-hidden>add_circle</mat-icon>
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
