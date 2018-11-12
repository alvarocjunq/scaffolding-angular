export interface Commit {
    branch: string;
    commit_message: string;
    actions: Actions [];
}

export interface Actions {
    action: string;
    file_path: string;
    encoding: string;
    content: string;
}
