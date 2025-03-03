import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayQuizzesComponent } from './display-quizzes.component';

describe('DisplayQuizzesComponent', () => {
  let component: DisplayQuizzesComponent;
  let fixture: ComponentFixture<DisplayQuizzesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayQuizzesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayQuizzesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
