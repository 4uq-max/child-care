module App.Directives {
    declare var ol;

    interface ILocationPlayer {
        Paused: boolean;
        CurrentActivity: string;
        CurrentActivityConfidence: number;
        CurrentTimeText: string;
        EndTimeText: string;
    }

    class LocationPlayer {
        restrict = "A";
        templateUrl = "./Scripts/app/views/UserDevice/Player.html";

        private data;

        private slider;
        private timestep = 10;
        private CurrentTime = 0;
        private interval;
        private feature;

        locationPlayer: ILocationPlayer = {
            Paused: true,
            CurrentActivity: 'Неизвестно',
            CurrentActivityConfidence: 0,
            CurrentTimeText: '00:00:00',
            EndTimeText: '00:00:00'
        };

        constructor(//public $scope: IScope<LocationPlayer>,
            private mapService: App.Services.MapService) {
                //$scope.model = this;
        }


        link = (scope, element: ng.IAugmentedJQuery, attrs) => {
            $.blockUI.defaults.overlayCSS.color = "#ccc";
            $.blockUI.defaults.overlayCSS.cursor = 'pointer';
            $.blockUI({ message: '' });

            this.mapService.teleport("player-map");


            var startTime = this.getMinTime();
            var endTime = this.getMaxTime();
            var max = (endTime - startTime) / this.timestep;
            this.slider = $('#progress-bar').slider({
                range: "min",
                max: max,
                //slide: this.onSliderChange,
                //change: this.onSliderChange
            });
            //this.CurrentTime(startTime);
            //this.EndTimeText = this.secondsToTime(endTime);
            //// Focus map;
            var transformFn = ol.proj.getTransform('EPSG:4326', 'EPSG:3857');
            var extent = ol.extent.transform(this.data.Extent, transformFn);
            //var olMap = this.map.map;
            //olMap.getView().fitExtent(extent, olMap.getSize());

            //var startPosition = this.data.Positions[0];
            //var geoJSON = { type: "Point", coordinates: [startPosition.Longitude, startPosition.Latitude] };
            //this.feature = this.mapService.addFeature(geoJSON, false);
        };







        list = () => {
            //this.map.removeFeature(this.feature);
            //if (!this.Paused) {
            //    this.pause();
            //}
            //$.unblockUI();
            //this.map.teleport('map');
            //this.dialog.remove();
            //delete this.dialog;
        }

        //play = () => {
        //    if (this.Paused) {
        //        this.resume();
        //    } else {
        //        this.pause();
        //    }
        //    this.Paused = !this.Paused;
        //}

        //stop = () => {
        //    this.pause();
        //    this.Paused = true;
        //    this.CurrentTime = this.getMinTime();
        //    this.slider.slider('value', 0);
        //}


        //onSliderChange = (e, ui) => {
        //    if (this.CurrentTime > this.getMaxTime()) {
        //        this.stop();
        //    }
        //    this.CurrentTime = this.getMinTime() + ui.value * this.timestep;
        //    this.CurrentTimeText = this.secondsToTime(this.CurrentTime);

        //    var closestActivityIndex = this.findClosestFeedIndex(this.CurrentTime, this.data.Activities);
        //    var currentActivity = this.data.Activities[closestActivityIndex];
        //    if (currentActivity) {
        //        this.CurrentActivity = this.getTypeName(currentActivity.Type);
        //        this.CurrentActivityConfidence = currentActivity.Confidence;
        //    }

        //    var computedPosition = this.getComputedPosition();
        //    if (typeof computedPosition === 'undefined') return;

        //    var geoJSON = { type: "Point", coordinates: [computedPosition.Longitude, computedPosition.Latitude] };
        //    var geoJsonFormat = new ol.format.GeoJSON();
        //    var geometry = geoJsonFormat.readGeometry(geoJSON);
        //    var transformFn = ol.proj.getTransform('EPSG:4326', 'EPSG:3857');
        //    geometry.transform(transformFn);
        //    this.feature.setGeometry(geometry);
        //}

        resume = () => {
            this.interval = setInterval(() => {
                var startTime = this.getMinTime();
                if (!this.CurrentTime) {
                    this.CurrentTime = startTime;
                }
                this.slider.slider('value', (this.CurrentTime - startTime) / this.timestep);
                this.CurrentTime = this.CurrentTime + this.timestep;
            }, 250);
        }

        pause = () => {
            clearInterval(this.interval);
        }

        private getComputedPosition = () => {
            var time = this.CurrentTime;
            var closestPositionIndex = this.findClosestFeedIndex(time, this.data.Positions);
            var currentFeed = this.data.Positions[closestPositionIndex];
            var nextFeed = this.data.Positions[closestPositionIndex + 1];
            if (!nextFeed) {
                return currentFeed;
            }

            var position = {
                Latitude: 0,
                Longitude: 0,
                TimeStamp: 0
            };
            var deltaTime = nextFeed.TimeStamp - currentFeed.TimeStamp;
            var deltaTime1 = time - currentFeed.TimeStamp;
            var deltaTime2 = nextFeed.TimeStamp - time;
            position.Longitude = deltaTime2 / deltaTime * currentFeed.Longitude +
            deltaTime1 / deltaTime * nextFeed.Longitude;
            position.Latitude = deltaTime2 / deltaTime * currentFeed.Latitude +
            deltaTime1 / deltaTime * nextFeed.Latitude;
            position.TimeStamp = deltaTime2 / deltaTime * currentFeed.TimeStamp +
            deltaTime1 / deltaTime * nextFeed.TimeStamp;
            return position;
        }

        private getTypeName = (value) => {
            var result = 'Неизвестно';
            switch (value) {
                case 'InVehicle':
                    result = 'В автомобил';
                    break;
                case 'OnBicycle':
                    result = 'С велосипед';
                    break;
                case 'OnFoot':
                    result = 'Пеш';
                    break;
                case 'Still':
                    result = 'Стоене';
                    break;
                case 'Tilling':
                    result = 'Изкачване';
                    break;
                default:
                    break;
            }
            return result;
        }

        private findClosestFeedIndex = (seconds, feedArray) => {
            for (var i = 0; i < feedArray.length; i++) {
                if (feedArray[i].TimeStamp - seconds > 0)
                    return i - 1;
            }
        }

        private getMinTime = () => {
            var min = Number.MAX_VALUE;
            for (var i in this.data) {
                if ($.isArray(this.data[i]) && this.data[i].length) {
                    if (this.data[i][0].TimeStamp < min)
                        min = this.data[i][0].TimeStamp;
                }
            }
            min = (min == Number.MAX_VALUE) ? 0 : min;
            return min;
        }

        private getMaxTime = () => {
            var max = 0;
            for (var i in this.data) {
                if ($.isArray(this.data[i]) && this.data[i].length) {
                    var seconds = this.data[i][this.data[i].length - 1].TimeStamp;
                    if (seconds > max) max = seconds;
                }
            }
            return max;
        }

        private secondsToTime = (sec) => {
            sec = sec % 86400;
            var hours: any = ~~(sec / 3600);
            var minutes: any = ~~(sec / 60 - hours * 60);
            var seconds: any = ~~(sec - (hours * 3600 + minutes * 60));
            if (hours < 10) { hours = "0" + hours; }
            if (minutes < 10) { minutes = "0" + minutes; }
            if (seconds < 10) { seconds = "0" + seconds; }
            return hours + ':' + minutes + ':' + seconds;
        }
    }

    childCare.directive("locationPlayer", (mapService) => {
        return new LocationPlayer(mapService);
    });
}