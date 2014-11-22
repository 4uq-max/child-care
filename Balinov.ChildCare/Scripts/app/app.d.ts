declare module App {
    export interface IScope<TModel> extends ng.IScope {
        model: TModel;
    }
}

