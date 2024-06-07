import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { RoastService } from '../../services/roast.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';
// import { COUNTRIES } from '../../countries';

@Component({
  selector: 'app-add-roast-form',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    ReactiveFormsModule,
    StarRatingComponent,
  ],
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

            <mat-form-field class="is-fullwidth">
              <mat-label>Notes</mat-label>
              <textarea
                matInput
                formControlName="notes"
                placeholder="Your notes about this coffee..."
                aria-label="Your notes about this coffee"
              ></textarea>
            </mat-form-field>

            <mat-form-field class="is-fullwidth">
              <mat-label>Countries of origin</mat-label>
              <mat-chip-grid #chipGrid aria-label="Enter countries">
                @for (country of countriesOfOrigin!.value; track country) {
                  <mat-chip-row
                    (removed)="removeCountry(country)"
                    [editable]="true"
                    (edited)="editCountry(country, $event)"
                    [aria-description]="'press enter to edit ' + country"
                  >
                    {{ country }}
                    <button matChipRemove [attr.aria-label]="'remove ' + country">
                      <mat-icon>cancel</mat-icon>
                    </button>
                  </mat-chip-row>
                }
                <input
                  placeholder="New country..."
                  [matChipInputFor]="chipGrid"
                  [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                  [matChipInputAddOnBlur]="true"
                  (matChipInputTokenEnd)="addCountry($event)"
                />
              </mat-chip-grid>
            </mat-form-field>

            <app-star-rating
              (valueChanged)="updateRating($event)"
            ></app-star-rating>
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

  readonly separatorKeysCodes = [ ENTER, COMMA ] as const;
  announcer = inject(LiveAnnouncer);

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
    countriesOfOrigin: new FormControl<string[]>([],
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
  */

  private get roast() {
    return this.newRoast.get('roast');
  }

  private get roaster() {
    return this.newRoast.get('roaster');
  }

  public get countriesOfOrigin() {
    return this.newRoast.get('countriesOfOrigin');
  }

  public get rating() {
    return this.newRoast.get('rating');
  }

  updateRating(newRatingValue: number): void {
    this.rating?.setValue(newRatingValue);
  }

  createRoast(): void {
    if (this.roast?.errors) {
      this.invalidRoast = true;
      return;
    }

    if (this.roaster?.errors) {
      this.invalidRoaster = true;
      return;
    }

    if (this.newRoast.valid) {
      const { composition, countriesOfOrigin, processMethod, rating, notes } = this.newRoast.value;
      const newRoast = {
        name: this.roast!.value,
        roaster: this.roaster!.value,
        composition,
        origin: countriesOfOrigin,
        processMethod,
        rating,
        notes,
      };

      this.roastService.createRoast(newRoast)
        .then(() => this.formClosed.emit())
        .catch(() => console.log('Form says there was error!'));
    }
  }

  // methods relating to countryOfOrigin
  addCountry(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      const existingCountries = this.countriesOfOrigin!.value;
      this.countriesOfOrigin!.setValue([...existingCountries, value]);
    }

    // Clear the input value
    event.chipInput!.clear();
  }
  removeCountry(country: string): void {
    const index = this.countriesOfOrigin!.value.indexOf(country);

    if (index >= 0) {
      const existingCountries = this.countriesOfOrigin!.value;
      existingCountries.splice(index, 1);
      this.countriesOfOrigin!.setValue(existingCountries);

      this.announcer.announce(`Removed ${country}`);
    }
  }
  editCountry(country: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove country if it no longer has a name
    if (!value) {
      this.removeCountry(country);
      return;
    }

    // Edit existing country
    const index = this.countriesOfOrigin!.value.indexOf(country);
    if (index >= 0) {
      const existingCountries = this.countriesOfOrigin!.value;
      existingCountries.splice(index, 1, value);
      this.countriesOfOrigin!.setValue(existingCountries);
    }
  }
}
