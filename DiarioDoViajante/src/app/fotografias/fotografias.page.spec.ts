import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FotografiasPage } from './fotografias.page';

describe('FotografiasPage', () => {
  let component: FotografiasPage;
  let fixture: ComponentFixture<FotografiasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FotografiasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
