import { ProjectDetailModule } from './project-detail.module';

describe('ProjectDetailModule', () => {
  let projectDetailModule: ProjectDetailModule;

  beforeEach(() => {
    projectDetailModule = new ProjectDetailModule();
  });

  it('should create an instance', () => {
    expect(projectDetailModule).toBeTruthy();
  });
});
