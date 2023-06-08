import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditiontaxationComponent } from './conditiontaxation.component';

describe('ConditiontaxationComponent', () => {
  let component: ConditiontaxationComponent;
  let fixture: ComponentFixture<ConditiontaxationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConditiontaxationComponent]
    });
    fixture = TestBed.createComponent(ConditiontaxationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
