import { MoreInfoModule } from './more-info.module';

describe('MoreInfoModule', () => {
  let moreInfoModule: MoreInfoModule;

  beforeEach(() => {
    moreInfoModule = new MoreInfoModule();
  });

  it('should create an instance', () => {
    expect(moreInfoModule).toBeTruthy();
  });
});
