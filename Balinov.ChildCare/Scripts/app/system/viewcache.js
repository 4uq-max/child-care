define(["require", "exports"], function(require, exports) {
    var ViewCache = (function () {
        function ViewCache(size) {
            var _this = this;
            this.cacheData = {};
            this.count = 0;
            this.getView = function (name) {
                var data = _this.cacheData[name];
                if (data) {
                    for (var key in _this.cacheData) {
                        var item = _this.cacheData[key];
                        if (item.generation < data.generation) {
                            item.generation++;
                        }
                    }
                    data.generation = 1;
                    return data.view;
                }
            };
            this.addView = function (name, view) {
                if (_this.cacheData[name])
                    return;
                _this.cacheData[name] = { view: view, generation: 0 };
                _this.updateGeneration();
                _this.count++;
                if (_this.count > _this.size) {
                    _this.removeOldestView();
                }
            };
            this.removeOldestView = function () {
                for (var key in _this.cacheData) {
                    if (_this.cacheData[key].generation == _this.size + 1) {
                        delete _this.cacheData[key];
                        _this.count--;
                        break;
                    }
                }
            };
            this.updateGeneration = function () {
                for (var key in _this.cacheData) {
                    _this.cacheData[key].generation++;
                }
            };
            this.size = size;
        }
        return ViewCache;
    })();

    
    return ViewCache;
});
//# sourceMappingURL=viewcache.js.map
