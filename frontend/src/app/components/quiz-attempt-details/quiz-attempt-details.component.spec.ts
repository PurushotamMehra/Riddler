import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizAttemptDetailsComponent } from './quiz-attempt-details.component';

describe('QuizAttemptDetailsComponent', () => {
  let component: QuizAttemptDetailsComponent;
  let fixture: ComponentFixture<QuizAttemptDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuizAttemptDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizAttemptDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
