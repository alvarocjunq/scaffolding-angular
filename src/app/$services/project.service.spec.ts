import { TestBed } from '@angular/core/testing';

import { ProjectService } from './project.service';
import { HttpService } from './http.service';
import { Files, File } from '../$models/file';
import { of } from 'rxjs';

describe('ProjectService', () => {
  let projectService: ProjectService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;
  const expectedFiles: Files = [
    {
      id: '', path: '', content: '', name: '',
      enconding: '', mode: '', technology: 'Angular', type: '',
    },
    {
      id: '', path: '', content: '', name: '',
      enconding: '', mode: '', technology: 'Angular', type: '',
    },
  ];
  const expectedFile: File = {
    id: '', path: '', content: 'conteudo do arquivo', name: '',
    enconding: '', mode: '', technology: 'Angular', type: '',
};
  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpService', ['get', 'post', 'put', 'delete']);
    TestBed.configureTestingModule({
      providers: [ProjectService,
        { provide: HttpService, useValue: httpSpy }],
    });
    projectService = TestBed.get(ProjectService);
    httpServiceSpy = TestBed.get(HttpService);
  });

  it('deve ser criado', () => {
    expect(projectService).toBeTruthy();
  });

  it('deve retornar a lista de arquivos do repositorio', () => {
    httpServiceSpy.get.and.returnValue(of(expectedFiles));
    projectService.getArchives('12345678').subscribe((files: Files) => {
      expect(files).toEqual(expectedFiles, 'expected files');
    });
    expect(httpServiceSpy.get.calls.count()).toBe(1, 'Deve chamar apenas 1 vez');
  });

  // it('deve retornar o conteudo do arquivo em Base 64', () => {
  //   httpServiceSpy.get.and.returnValue(of(expectedFile));
  //   projectService.getFileContent('12345678', 'path/to/my/file/package.json').subscribe((file: File) => {
  //     expect(file).toEqual(expectedFile, 'expected file');
  //   });
  //   expect(httpServiceSpy.get.calls.count()).toBe(1, 'Deve chamar apenas 1 vez');
  // });
});
