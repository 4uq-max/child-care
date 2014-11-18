class ViewCache {
    private size;
    private cacheData = {};
    private count = 0;

    constructor(size: Number) {
        this.size = size;
    }

    getView = (name) => {
        var data = this.cacheData[name];
        if (data) {
            for (var key in this.cacheData) {
                var item = this.cacheData[key];
                if (item.generation < data.generation) {
                    item.generation++;
                }
            }
            data.generation = 1;
            return data.view;
        }
    }

    addView = (name, view) => {
        if (this.cacheData[name]) return;
        this.cacheData[name] = { view: view, generation: 0 };
        this.updateGeneration();
        this.count++;
        if (this.count > this.size) {
            this.removeOldestView();
        }
    }

    private removeOldestView = () => {
        for (var key in this.cacheData) {
            if (this.cacheData[key].generation == this.size + 1) {
                delete this.cacheData[key];
                this.count--;
                break;
            }
        }
    }

    private updateGeneration = () => {
        for (var key in this.cacheData) {
            this.cacheData[key].generation++;
        }
    }
}

export = ViewCache;
