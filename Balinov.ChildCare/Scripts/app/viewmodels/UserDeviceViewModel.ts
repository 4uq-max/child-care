declare var app;
var platforms;

class UserDeviceViewModel {
    Name = '';
    Platform = '';
    Uuid = '';
    platforms = [];
    private errors: string[];

    constructor() {
        if (!platforms) {
            //$http.get('api/userdevice/getplatforms')
            //.then((data) => {
            //    platforms = data;
            //    ko.utils.arrayPushAll(this.platforms, data);
            //});
        } else {
            //ko.utils.arrayPushAll(this.platforms, platforms);
        }
    }

    submit = (viewModel, event: Event) => {
        var data = JSON.parse(viewModel);
        delete data.platforms;
        //var listViewModel = app.getViewModel('UserDevicesList');
        //$http.post('api/userdevice', data)
        //.then((data) => { 
            //listViewModel.devices.push(data);
            //listViewModel.list();
        //}, errors => this.errors = errors);
    }
}

export = UserDeviceViewModel;