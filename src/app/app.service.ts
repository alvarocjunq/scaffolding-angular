import { Injectable } from '@angular/core';
import { Project } from './models/project';

@Injectable({
  providedIn: 'root',
})
export class AppService {

  private _project: Project = new Project();

  public get project(): Project {
    return this._project;
  }
  public set project(value: Project) {
    this._project = value;
  }

}
