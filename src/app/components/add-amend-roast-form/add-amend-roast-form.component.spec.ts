import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAmendRoastFormComponent } from './add-amend-roast-form.component';

describe('AddAmendRoastFormComponent', () => {
  let component: AddAmendRoastFormComponent;
  let fixture: ComponentFixture<AddAmendRoastFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAmendRoastFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAmendRoastFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
