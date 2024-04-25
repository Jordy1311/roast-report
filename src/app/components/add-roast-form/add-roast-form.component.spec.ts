import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoastFormComponent } from './add-roast-form.component';

describe('AddRoastFormComponent', () => {
  let component: AddRoastFormComponent;
  let fixture: ComponentFixture<AddRoastFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRoastFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRoastFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
