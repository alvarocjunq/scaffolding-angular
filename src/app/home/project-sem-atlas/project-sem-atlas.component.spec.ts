import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSemAtlasComponent } from './project-sem-atlas.component';

describe('ProjectSemAtlasComponent', () => {
  let component: ProjectSemAtlasComponent;
  let fixture: ComponentFixture<ProjectSemAtlasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectSemAtlasComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSemAtlasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
