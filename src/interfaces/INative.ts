export interface INativeParam {
    type: string;
    name: string;
    ref: boolean;
}

export interface INative {
    name: string;
    hash: string;
    params: INativeParam[];
    result: string | string[];
    build: string;
    comment: string;
}