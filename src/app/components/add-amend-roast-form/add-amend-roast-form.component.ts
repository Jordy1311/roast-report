import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { map, Observable, startWith } from 'rxjs';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {
  MatChipEditedEvent,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { StarRatingComponent } from '../star-rating/star-rating.component';
import { RoastService } from '../../services/roast.service';
import {
  Roast,
  RoastCompositions,
  RoastProcessMethods,
} from '../../types/roast.type';
import { NZROASTERS } from '../../data';

/*
  TODO:
  - auto capitalise chip text content
  - abstract some of the inputs into their own components
*/

@Component({
  selector: 'app-add-amend-roast-form',
  imports: [
    AsyncPipe,
    MatAutocompleteModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    ReactiveFormsModule,
    StarRatingComponent,
  ],
  styleUrl: './add-amend-roast-form.component.scss',
  template: `
    <h2 mat-dialog-title>{{ roast!.value ? 'Editing ' + roast!.value : 'Add a roast' }}</h2>

    <mat-dialog-content>
      <form [formGroup]="roastFormData">
        <mat-stepper orientation="vertical" linear="true" #stepper>
          <mat-step [stepControl]="roastFormData">
            <ng-template matStepLabel>Enter the basics</ng-template>

            <mat-form-field class="is-fullwidth first-in-step" appearance="outline">
              <mat-label>Roast</mat-label>
              <input
                cdkFocusInitial
                matInput
                type="text"
                formControlName="roast"
                aria-label="Roast name"
              />
              <mat-error>Please enter a roast name.</mat-error>
            </mat-form-field>

            <mat-form-field class="is-fullwidth" appearance="outline">
              <mat-label>Roaster</mat-label>
              <input
                matInput
                type="text"
                formControlName="roaster"
                aria-label="The roaster"
                [matAutocomplete]="roasterAuto"
              />
              <mat-autocomplete #roasterAuto="matAutocomplete">
                @for (roaster of filteredNzRoasts | async; track roaster) {
                  <mat-option [value]="roaster">{{roaster}}</mat-option>
                }
              </mat-autocomplete>

              <mat-error>Please enter a roaster.</mat-error>
            </mat-form-field>

            <button
              [disabled]="roastFormData.invalid"
              class="step-next-btn"
              mat-flat-button
              matStepperNext
            >
              Next
            </button>
          </mat-step>

          <mat-step [stepControl]="roastFormData">
            <ng-template matStepLabel>Enter the nitty gritty</ng-template>

            <div class="side-by-side first-in-step">
              <mat-form-field appearance="outline">
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

              <mat-form-field appearance="outline">
                <mat-label>Process method</mat-label>
                <mat-select
                  formControlName="processMethod"
                  name="process-method"
                  aria-label="Select how this roast was processed"
                >
                  <mat-option selected value="">-</mat-option>
                  <mat-option value="Washed">Washed</mat-option>
                  <mat-option value="Natural">Natural</mat-option>
                  <mat-option value="Honey">Honey</mat-option>
                  <mat-option value="Anaerobic Natural"
                    >Anaerobic Natural</mat-option
                  >
                </mat-select>
              </mat-form-field>
            </div>

            <mat-form-field class="is-fullwidth" appearance="outline">
              <mat-label>Notes</mat-label>
              <textarea
                matInput
                formControlName="notes"
                placeholder="Your notes about this coffee..."
                aria-label="Your notes about this coffee"
              ></textarea>
            </mat-form-field>

            <mat-form-field class="is-fullwidth" appearance="outline">
              <mat-label>Countries of origin</mat-label>
              <mat-chip-grid
                #countriesChipGrid
                aria-label="Enter the countries of origin for the roast"
              >
                @for (country of countriesOfOrigin!.value; track country) {
                  <mat-chip-row
                    (removed)="removeCountry(country)"
                    [editable]="true"
                    (edited)="editCountry(country, $event)"
                    [aria-description]="'press enter to edit ' + country"
                  >
                    {{ country }}
                    <button
                      matChipRemove
                      [attr.aria-label]="'remove ' + country"
                    >
                      <mat-icon>cancel</mat-icon>
                    </button>
                  </mat-chip-row>
                }
                <input
                  placeholder="New country..."
                  [matChipInputFor]="countriesChipGrid"
                  [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                  [matChipInputAddOnBlur]="true"
                  (matChipInputTokenEnd)="addCountry($event)"
                />
              </mat-chip-grid>
            </mat-form-field>

            <mat-form-field class="is-fullwidth" appearance="outline">
              <mat-label>Tasting notes</mat-label>
              <mat-chip-grid
                #tastingNotesChipGrid
                aria-label="Enter the tasting notes of the roast"
              >
                @for (tastingNote of tastingNotes!.value; track tastingNote) {
                  <mat-chip-row
                    (removed)="removeTastingNote(tastingNote)"
                    [editable]="true"
                    (edited)="editTastingNote(tastingNote, $event)"
                    [aria-description]="'press enter to edit ' + tastingNote"
                  >
                    {{ tastingNote }}
                    <button
                      matChipRemove
                      [attr.aria-label]="'remove ' + tastingNote"
                    >
                      <mat-icon>cancel</mat-icon>
                    </button>
                  </mat-chip-row>
                }
                <input
                  placeholder="New tasting note..."
                  [matChipInputFor]="tastingNotesChipGrid"
                  [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                  [matChipInputAddOnBlur]="true"
                  (matChipInputTokenEnd)="addTastingNote($event)"
                />
              </mat-chip-grid>
            </mat-form-field>

            <app-star-rating
              (valueChanged)="updateRating($event)"
              [rating]="
                roastToUpdate && roastToUpdate.rating ? roastToUpdate.rating : 0
              "
            ></app-star-rating>

            <button
              class="step-previous-btn"
              mat-stroked-button
              matStepperPrevious
            >
              Previous
            </button>
          </mat-step>
        </mat-stepper>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button (click)="closeDialog()" mat-stroked-button color="primary">
        Cancel
      </button>

      <button
        (click)="isAnUpdate ? updateRoast() : createRoast()"
        [disabled]="roastFormData.invalid"
        mat-flat-button
        color="primary"
      >
        <span>{{ isAnUpdate ? 'Update' : 'Add' }}</span>
        <mat-icon class="material-symbols-rounded" aria-hidden>
          {{ isAnUpdate ? 'edit' : 'add_circle' }}
        </mat-icon>
      </button>
    </mat-dialog-actions>
  `,
})
export class AddAmendRoastFormComponent implements OnInit {
  private roastService = inject(RoastService);
  private dialogRef = inject(MatDialogRef<AddAmendRoastFormComponent>);
  protected roastToUpdate: Roast = inject(MAT_DIALOG_DATA);

  invalidRoast?: boolean;
  invalidRoaster?: boolean;

  nzRoasters = NZROASTERS;
  filteredNzRoasts!: Observable<string[]>; // initialised in ngOnInit

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  announcer = inject(LiveAnnouncer);

  roastFormData = new FormGroup({
    roast: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    roaster: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    composition: new FormControl<RoastCompositions>('', {
      nonNullable: true,
    }),
    countriesOfOrigin: new FormControl<string[]>([], { nonNullable: true }),
    tastingNotes: new FormControl<string[]>([], { nonNullable: true }),
    processMethod: new FormControl<RoastProcessMethods>('', {
      nonNullable: true,
    }),
    rating: new FormControl<number>(0, { nonNullable: true }),
    notes: new FormControl<string>('', { nonNullable: true }),
  });

  ngOnInit(): void {
    if (this.isAnUpdate) {
      const temporaryRoastClone = structuredClone(this.roastToUpdate);

      this.roastFormData.setValue({
        roast: temporaryRoastClone.name || '',
        roaster: temporaryRoastClone.roaster || '',
        composition: temporaryRoastClone.composition || '',
        countriesOfOrigin: temporaryRoastClone.origin || [],
        tastingNotes: temporaryRoastClone.tastingNotes || [],
        processMethod: temporaryRoastClone.processMethod || '',
        rating: temporaryRoastClone.rating || 0,
        notes: temporaryRoastClone.notes || '',
      });
    }

    this.filteredNzRoasts = this.roaster!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAutoComplete(value || '')),
    );

    // clears errors on form change
    this.roast?.valueChanges.subscribe(() => {
      this.invalidRoast = undefined;
    });
    this.roaster?.valueChanges.subscribe(() => {
      this.invalidRoaster = undefined;
    });
  }

  public get isAnUpdate(): boolean {
    return !!this.roastToUpdate;
  }

  public get roast() {
    return this.roastFormData.get('roast');
  }

  private get roaster() {
    return this.roastFormData.get('roaster');
  }

  public get countriesOfOrigin() {
    return this.roastFormData.get('countriesOfOrigin');
  }

  public get tastingNotes() {
    return this.roastFormData.get('tastingNotes');
  }

  public get rating() {
    return this.roastFormData.get('rating');
  }

  closeDialog(): void {
    this.dialogRef.close();
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

    if (this.roastFormData.valid) {
      const {
        composition,
        countriesOfOrigin,
        tastingNotes,
        processMethod,
        rating,
        notes,
      } = this.roastFormData.value;
      const roastFormData = {
        name: this.roast!.value,
        roaster: this.roaster!.value,
        composition,
        origin: countriesOfOrigin,
        tastingNotes,
        processMethod,
        rating,
        notes,
      };

      this.roastService
        .createRoast(roastFormData)
        .then(() => this.closeDialog())
        .catch(() => console.log('Form says there was error!'));
    }
  }

  updateRoast(): void {
    if (this.roast?.errors) {
      this.invalidRoast = true;
      return;
    }

    if (this.roaster?.errors) {
      this.invalidRoaster = true;
      return;
    }

    if (this.roastFormData.valid) {
      const {
        composition,
        countriesOfOrigin,
        tastingNotes,
        processMethod,
        rating,
        notes,
      } = this.roastFormData.value;
      const updateRoastFormData = {
        name: this.roast!.value,
        roaster: this.roaster!.value,
        composition,
        origin: countriesOfOrigin,
        tastingNotes,
        processMethod,
        rating,
        notes,
      };

      this.roastService
        .updateRoast(this.roastToUpdate._id, updateRoastFormData)
        .then(() => this.closeDialog())
        .catch(() => console.log('Form says there was error!'));
    }
  }

  _filterAutoComplete(value: string): string[] {
    const filterValue = value.toLocaleLowerCase();

    const filtered = this.nzRoasters.filter((roaster) => {
      return roaster.toLowerCase().includes(filterValue);
    });

    return filtered;
  }

  // METHODS RELATING TO: countryOfOrigin
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

  // METHODS RELATING TO: tastingNotes
  addTastingNote(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      const existingTastingNotes = this.tastingNotes!.value;
      this.tastingNotes!.setValue([...existingTastingNotes, value]);
    }

    // Clear the input value
    event.chipInput!.clear();
  }
  removeTastingNote(tastingNote: string): void {
    const index = this.tastingNotes!.value.indexOf(tastingNote);

    if (index >= 0) {
      const existingTastingNotes = this.tastingNotes!.value;
      existingTastingNotes.splice(index, 1);
      this.tastingNotes!.setValue(existingTastingNotes);

      this.announcer.announce(`Removed ${tastingNote}`);
    }
  }
  editTastingNote(tastingNote: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove tastingNote if it no longer has a name
    if (!value) {
      this.removeTastingNote(tastingNote);
      return;
    }

    // Edit existing tastingNote
    const index = this.tastingNotes!.value.indexOf(tastingNote);
    if (index >= 0) {
      const existingTastingNotes = this.tastingNotes!.value;
      existingTastingNotes.splice(index, 1, value);
      this.tastingNotes!.setValue(existingTastingNotes);
    }
  }
}
