import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Files } from '../.models/file';
import { Groups } from '../.models/group';
import { GroupService } from '../.services/group.service';
import { ProjectService } from '../.services/project.service';
import { asyncError } from '../.shared/test-helper';
import { HomeService } from './home.service';

describe('Home Service', () => {
    let homeService: HomeService;
    let groupServiceSpy: jasmine.SpyObj<GroupService>;
    let projectServiceSpy: jasmine.SpyObj<ProjectService>;
    beforeEach(() => {
        const groupSpy = jasmine.createSpyObj('GroupService', ['getAll', 'add']);
        const projectSpy = jasmine.createSpyObj('ProjectService', ['updateFile',
            'getArchives',
            'getFileContent']);
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
        const expectedGroups: Groups = [{ id: 1, full_path: '', name: '', path: '', parent_id: 1 }];
        groupServiceSpy.getAll.and.returnValue(of(expectedGroups));
        homeService.getGroups().subscribe((groups: Groups) => {
            expect(groups).toEqual(expectedGroups, 'expected groups');
        }, fail);

        expect(groupServiceSpy.getAll.calls.count()).toBe(1, 'Deve chamar getAll apenas 1 vez');
    });

    it('deve retornar a lista de grupos do CACHE', () => {
        const expectedGroups: Groups = [
            { id: 1, full_path: '', name: '', path: '', parent_id: 1 },
        ];
        groupServiceSpy.getAll.and.returnValue(of(expectedGroups));
        homeService.getGroups()
            .pipe(switchMap(() => homeService.getGroups()))
            .subscribe((groups: Groups) => {
                expect(groups).toEqual(expectedGroups, 'expected groups');
            }, fail);
        expect(groupServiceSpy.getAll.calls.count()).toBe(1, 'Deve chamar getAll apenas 1 vez');
    });

    it('deve retornar um erro caso a resposta dê 404', () => {
        const errorResponse = new HttpErrorResponse({
            error: 'test 404 error',
            status: 404, statusText: 'Not Found',
        });
        groupServiceSpy.getAll.and.returnValue(asyncError(errorResponse));
        homeService.getGroups().subscribe(
            _ => fail('expected an error, not heroes'),
            res => expect(res.error).toContain('test 404 error'),
        );
    });

    it('deve retornar a lista de templates', () => {
        const expectedFiles: Files = [{
            id: '', path: '', content: '', name: '',
            enconding: '', mode: '', technology: '', type: '',
        }];
        projectServiceSpy.getArchives.and.returnValue(of(expectedFiles));
        homeService.getTemplates().subscribe((files) => {
            expect(files).toEqual(expectedFiles, 'expected files');
        });
        expect(projectServiceSpy.getArchives.calls.count()).toBe(1, 'Deve chamar apenas 1 vez');
    });

    it('deve retornar a lista de templates do CACHE', () => {
        const expectedFiles: Files = [{
            id: '', path: '', content: '', name: '',
            enconding: '', mode: '', technology: '', type: '',
        }];
        projectServiceSpy.getArchives.and.returnValue(of(expectedFiles));
        homeService.getTemplates()
            .pipe(switchMap(() => homeService.getTemplates()))
            .subscribe((files) => {
                expect(files).toEqual(expectedFiles, 'expected files');
            });

        expect(projectServiceSpy.getArchives.calls.count()).toBe(1, 'Deve chamar apenas 1 vez');
    });

    it('', () => {

    });
    it('', () => {

    });
    it('', () => {

    });

});
