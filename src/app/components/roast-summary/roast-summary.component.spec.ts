import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoastSummaryComponent } from './roast-summary.component';

describe('RoastSummaryComponent', () => {
  let component: RoastSummaryComponent;
  let fixture: ComponentFixture<RoastSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoastSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoastSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
