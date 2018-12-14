import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { switchMap, delay } from 'rxjs/operators';
import { Files, File } from '../.models/file';
import { Groups, Group } from '../.models/group';
import { GroupService } from '../.services/group.service';
import { ProjectService } from '../.services/project.service';
import { asyncError, asyncData } from '../.shared/test-helper';
import { HomeService } from './home.service';
import { Project } from '../.models/project';
import { Commit } from '../.models/commit';

describe('Home Service', () => {
    let homeService: HomeService;
    let groupServiceSpy: jasmine.SpyObj<GroupService>;
    let projectServiceSpy: jasmine.SpyObj<ProjectService>;
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
        id: '', path: '', content: '', name: '',
        enconding: '', mode: '', technology: 'Angular', type: '',
    };
    const expectedGroups: Groups = [{ id: 1, full_path: '', name: '', path: '', parent_id: 1 }];
    const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404, statusText: 'Not Found',
    });
    const expectedGroup: Group = { id: 1, full_path: '', name: '', path: '', parent_id: 1 };
    const expectedProject: Project = { name: '', path: '', id: '1', http_url_to_repo: '' };
    const expectedCommit: Commit = {
        branch: 'master',
        commit_message: 'initial commit',
        actions: [
            {
                action: 'update',
                content: btoa('conteudo'),
                encoding: 'base64',
                file_path: '',
            }],
    };
    beforeEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        const groupSpy = jasmine.createSpyObj('GroupService', ['getAll', 'add']);
        const projectSpy = jasmine.createSpyObj('ProjectService', ['updateFile',
            'getArchives',
            'getFileContent',
            'fork',
            'edit',
            'deleteFork']);
        TestBed.configureTestingModule({
            providers: [
                HomeService,
                { provide: GroupService, useValue: groupSpy },
                { provide: ProjectService, useValue: projectSpy },
            ],
        });
        homeService = TestBed.get(HomeService);
        groupServiceSpy = TestBed.get(GroupService);
        projectServiceSpy = TestBed.get(ProjectService);
    });

    it('deve retornar a lista de grupos', () => {
        groupServiceSpy.getAll.and.returnValue(of(expectedGroups));
        homeService.getGroups().subscribe((groups: Groups) => {
            expect(groups).toEqual(expectedGroups, 'expected groups');
        }, fail);

        expect(groupServiceSpy.getAll.calls.count()).toBe(1, 'Deve chamar getAll apenas 1 vez');
    });

    it('deve retornar a lista de grupos do CACHE', () => {
        groupServiceSpy.getAll.and.returnValue(of(expectedGroups));
        homeService.getGroups()
            .pipe(switchMap(() => homeService.getGroups()))
            .subscribe((groups: Groups) => {
                expect(groups).toEqual(expectedGroups, 'expected groups');
            }, fail);
        expect(groupServiceSpy.getAll.calls.count()).toBe(1, 'Deve chamar getAll apenas 1 vez');
    });

    it('deve retornar um erro caso a resposta dê 404', () => {
        groupServiceSpy.getAll.and.returnValue(asyncError(errorResponse));
        homeService.getGroups().subscribe(
            _ => fail('expected an error, not heroes'),
            res => expect(res.error).toContain('test 404 error'),
        );
    });

    it('deve retornar a lista de templates', () => {
        projectServiceSpy.getArchives.and.returnValue(of(expectedFiles));
        homeService.getTemplates().subscribe((files) => {
            expect(files).toEqual(expectedFiles, 'expected files');
        });
        expect(projectServiceSpy.getArchives.calls.count()).toBe(1, 'Deve chamar apenas 1 vez');
    });

    it('deve retornar a lista de templates do CACHE', () => {
        projectServiceSpy.getArchives.and.returnValue(of(expectedFiles));
        homeService.getTemplates()
            .pipe(switchMap(() => homeService.getTemplates()))
            .subscribe((files) => {
                expect(files).toEqual(expectedFiles, 'expected files');
            });

        expect(projectServiceSpy.getArchives.calls.count()).toBe(1, 'Deve chamar apenas 1 vez');
    });

    it('deve criar um fork de um projeto com Hierarquia do Atlas e Atualizar arquivos Angular', (done) => {
        const form = {
            capa: '',
            sistema: '',
            subsistema: '',
            aplicacaoFuncional: '',
            servicoFuncional: '',
            selectedTechnology: 'Angular',
        };
        const files = [
            {
                id: '', path: '', content: '', name: 'Angular-12345678',
                enconding: '', mode: '', technology: 'Angular', type: '',
            },
            {
                id: '', path: '', content: '', name: 'AppConfig-12345678',
                enconding: '', mode: '', technology: 'AppConfig', type: '',
            },
        ];
        groupServiceSpy.add.and.returnValue(of(expectedGroup));
        projectServiceSpy.fork.and.returnValue(of(expectedProject));
        projectServiceSpy.edit.and.returnValue(of(expectedProject));
        projectServiceSpy.getFileContent.and.returnValue(of(expectedFile));
        projectServiceSpy.updateFile.and.returnValue(of(expectedCommit));
        projectServiceSpy.deleteFork.and.returnValue(of({}));
        homeService.forkProject(form, 'nameProject', files)
            .subscribe(() => {
                expect(projectServiceSpy.fork.calls.count()).toBe(1, 'fork Deve chamar apenas 1 vez');
                expect(projectServiceSpy.edit.calls.count()).toBe(1, 'edit Deve chamar apenas 1 vez');
                expect(projectServiceSpy.getFileContent.calls.count()).toBe(2, 'getFileContent Deve chamar 2 vezes');
                expect(projectServiceSpy.updateFile.calls.count()).toBe(1, 'updateFile Deve chamar apenas 1 vez');
                expect(groupServiceSpy.add.calls.count()).toBe(5, ' add Deve chamar apenas 5 vezes');
                done();
            });

    });
    it('deve criar um fork de um projeto com Hierarquia do Atlas e Atualizar arquivos AppConfig', (done) => {
        const form = {
            capa: '',
            sistema: '',
            subsistema: '',
            aplicacaoFuncional: '',
            servicoFuncional: '',
            selectedTechnology: 'AppConfig',
        };
        const files = [
            {
                id: '', path: '', content: '', name: 'Angular-12345678',
                enconding: '', mode: '', technology: 'Angular', type: '',
            },
            {
                id: '', path: '', content: '', name: 'AppConfig-12345678',
                enconding: '', mode: '', technology: 'AppConfig', type: '',
            },
        ];
        groupServiceSpy.add.and.returnValue(of(expectedGroup));
        projectServiceSpy.fork.and.returnValue(of(expectedProject));
        projectServiceSpy.edit.and.returnValue(of(expectedProject));
        projectServiceSpy.getFileContent.and.returnValue(of(expectedFile));
        projectServiceSpy.updateFile.and.returnValue(of(expectedCommit));
        projectServiceSpy.deleteFork.and.returnValue(of({}));
        homeService.forkProject(form, 'nameProject', files)
            .subscribe(() => {
                expect(projectServiceSpy.fork.calls.count()).toBe(1, 'fork Deve chamar apenas 1 vez');
                expect(projectServiceSpy.edit.calls.count()).toBe(1, 'edit Deve chamar apenas 1 vez');
                expect(groupServiceSpy.add.calls.count()).toBe(5, ' add Deve chamar apenas 5 vezes');
                expect(projectServiceSpy.getFileContent.calls.count()).toBe(0, 'getFileContent Não deve ser chamado');
                expect(projectServiceSpy.updateFile.calls.count()).toBe(0, 'updateFile Não deve ser chamado');
                done();
            });
    });
    it('', () => {

    });

});
