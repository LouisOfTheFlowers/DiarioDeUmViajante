import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistoviagemPage } from './registoviagem.page';

describe('RegistoviagemPage', () => {
  let component: RegistoviagemPage;
  let fixture: ComponentFixture<RegistoviagemPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistoviagemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
