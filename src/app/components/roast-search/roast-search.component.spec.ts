import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoastSearchComponent } from './roast-search.component';

describe('RoastSearchComponent', () => {
  let component: RoastSearchComponent;
  let fixture: ComponentFixture<RoastSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoastSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoastSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
