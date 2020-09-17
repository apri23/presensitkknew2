import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PresensiPage } from './presensi.page';

describe('PresensiPage', () => {
  let component: PresensiPage;
  let fixture: ComponentFixture<PresensiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresensiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PresensiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
