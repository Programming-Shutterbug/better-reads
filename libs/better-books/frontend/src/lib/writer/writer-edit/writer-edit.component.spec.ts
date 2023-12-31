import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WriterEditComponent } from './writer-edit.component';

describe('WriterEditComponent', () => {
  let component: WriterEditComponent;
  let fixture: ComponentFixture<WriterEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WriterEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WriterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
