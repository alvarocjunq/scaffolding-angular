import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectComAtlasComponent } from './project-com-atlas.component';

describe('ProjectComAtlasComponent', () => {
  let component: ProjectComAtlasComponent;
  let fixture: ComponentFixture<ProjectComAtlasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectComAtlasComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectComAtlasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
