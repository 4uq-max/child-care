define(["require", "exports", 'jquery', 'knockout', 'app/system/view'], function(require, exports, $, ko, View) {
    var LocationPlayerViewModel = (function () {
        function LocationPlayerViewModel(data) {
            var _this = this;
            this.timestep = 10;
            this.CurrentTime = ko.observable(0);
            this.Paused = ko.observable(true);
            this.CurrentActivity = ko.observable('Неизвестно');
            this.CurrentActivityConfidence = ko.observable(0);
            this.CurrentTimeText = ko.observable('00:00:00');
            this.EndTimeText = ko.observable('00:00:00');
            this.show = function () {
                $.blockUI.defaults.overlayCSS.color = "#ccc";
                $.blockUI.defaults.overlayCSS.cursor = 'pointer';
                $.blockUI({ message: '' });
                _this.dialog = $('<div id="player-container"></div>');
                $('body').append(_this.dialog);

                View.render('UserDevice/Player', _this.dialog).then(function () {
                    _this.map.teleport('player-map');
                    ko.applyBindings(_this, ko.cleanNode(_this.dialog[0]));

                    var startTime = _this.getMinTime();
                    var endTime = _this.getMaxTime();
                    var max = (endTime - startTime) / _this.timestep;
                    _this.slider = $('#progress-bar').slider({
                        range: "min",
                        max: max,
                        slide: _this.onSliderChange,
                        change: _this.onSliderChange
                    });
                    _this.CurrentTime(startTime);
                    _this.EndTimeText(_this.secondsToTime(endTime));

                    // Focus map;
                    var transformFn = ol.proj.getTransform('EPSG:4326', 'EPSG:3857');
                    var extent = ol.extent.transform(_this.data.Extent, transformFn);
                    var olMap = _this.map.map;
                    olMap.getView().fitExtent(extent, olMap.getSize());

                    var startPosition = _this.data.Positions[0];
                    var geoJSON = { type: "Point", coordinates: [startPosition.Longitude, startPosition.Latitude] };
                    _this.feature = _this.map.addFeature(geoJSON, false);
                });
            };
            this.list = function () {
                _this.map.removeFeature(_this.feature);
                if (!_this.Paused()) {
                    _this.pause();
                }
                $.unblockUI();
                _this.map.teleport('map');
                _this.dialog.remove();
                delete _this.dialog;
            };
            this.play = function () {
                if (_this.Paused()) {
                    _this.resume();
                } else {
                    _this.pause();
                }
                _this.Paused(!_this.Paused());
            };
            this.stop = function () {
                _this.pause();
                _this.Paused(true);
                _this.CurrentTime(_this.getMinTime());
                _this.slider.slider('value', 0);
            };
            this.onSliderChange = function (e, ui) {
                if (_this.CurrentTime() > _this.getMaxTime()) {
                    _this.stop();
                }
                _this.CurrentTime(_this.getMinTime() + ui.value * _this.timestep);
                _this.CurrentTimeText(_this.secondsToTime(_this.CurrentTime()));

                var closestActivityIndex = _this.findClosestFeedIndex(_this.CurrentTime(), _this.data.Activities);
                var currentActivity = _this.data.Activities[closestActivityIndex];
                if (currentActivity) {
                    _this.CurrentActivity(_this.getTypeName(currentActivity.Type));
                    _this.CurrentActivityConfidence(currentActivity.Confidence);
                }

                var computedPosition = _this.getComputedPosition();
                if (typeof computedPosition === 'undefined')
                    return;

                var geoJSON = { type: "Point", coordinates: [computedPosition.Longitude, computedPosition.Latitude] };
                var geoJsonFormat = new ol.format.GeoJSON();
                var geometry = geoJsonFormat.readGeometry(geoJSON);
                var transformFn = ol.proj.getTransform('EPSG:4326', 'EPSG:3857');
                geometry.transform(transformFn);
                _this.feature.setGeometry(geometry);
            };
            this.resume = function () {
                _this.interval = setInterval(function () {
                    var startTime = _this.getMinTime();
                    if (!_this.CurrentTime()) {
                        _this.CurrentTime(startTime);
                    }
                    _this.slider.slider('value', (_this.CurrentTime() - startTime) / _this.timestep);
                    _this.CurrentTime(_this.CurrentTime() + _this.timestep);
                }, 250);
            };
            this.pause = function () {
                clearInterval(_this.interval);
            };
            this.getComputedPosition = function () {
                var time = _this.CurrentTime();
                var closestPositionIndex = _this.findClosestFeedIndex(time, _this.data.Positions);
                var currentFeed = _this.data.Positions[closestPositionIndex];
                var nextFeed = _this.data.Positions[closestPositionIndex + 1];
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
                position.Longitude = deltaTime2 / deltaTime * currentFeed.Longitude + deltaTime1 / deltaTime * nextFeed.Longitude;
                position.Latitude = deltaTime2 / deltaTime * currentFeed.Latitude + deltaTime1 / deltaTime * nextFeed.Latitude;
                position.TimeStamp = deltaTime2 / deltaTime * currentFeed.TimeStamp + deltaTime1 / deltaTime * nextFeed.TimeStamp;
                return position;
            };
            this.getTypeName = function (value) {
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
            };
            this.findClosestFeedIndex = function (seconds, feedArray) {
                for (var i = 0; i < feedArray.length; i++) {
                    if (feedArray[i].TimeStamp - seconds > 0)
                        return i - 1;
                }
            };
            this.getMinTime = function () {
                var min = Number.MAX_VALUE;
                for (var i in _this.data) {
                    if ($.isArray(_this.data[i]) && _this.data[i].length) {
                        if (_this.data[i][0].TimeStamp < min)
                            min = _this.data[i][0].TimeStamp;
                    }
                }
                min = (min == Number.MAX_VALUE) ? 0 : min;
                return min;
            };
            this.getMaxTime = function () {
                var max = 0;
                for (var i in _this.data) {
                    if ($.isArray(_this.data[i]) && _this.data[i].length) {
                        var seconds = _this.data[i][_this.data[i].length - 1].TimeStamp;
                        if (seconds > max)
                            max = seconds;
                    }
                }
                return max;
            };
            this.secondsToTime = function (sec) {
                sec = sec % 86400;
                var hours = ~~(sec / 3600);
                var minutes = ~~(sec / 60 - hours * 60);
                var seconds = ~~(sec - (hours * 3600 + minutes * 60));
                if (hours < 10) {
                    hours = "0" + hours;
                }
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                return hours + ':' + minutes + ':' + seconds;
            };
            this.data = data;
            this.map = app.getMap();
        }
        return LocationPlayerViewModel;
    })();

    
    return LocationPlayerViewModel;
});
//# sourceMappingURL=LocationPlayerViewModel.js.map
