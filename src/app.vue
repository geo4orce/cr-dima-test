<template>
<div class="body">
    <div class="container-fluid">
        <div class="row">
            <AppHeader v-once/>
        </div>
        <br/><br/>
        <div v-if="isEdit">
            <button @click="doParse" type="button" class="btn btn-lg btn-primary">
                Save
            </button>
            <button @click="doLoadDefaults" type="button" class="btn btn-lg btn-light">
                Defaults
            </button>
            <button @click="doLoadBrands" type="button" class="btn btn-lg btn-light">
                Car Brands
            </button>
            <br/><br/>
            <label for="listStr" class="form-label">
                List of URLs
            </label>
            <textarea v-model="listStr" rows="10" id="listStr" class="form-control">
            </textarea>
            <div class="form-text">
                One per line.
            </div>
        </div>
        <div v-else>
            <div>

                <button
                    v-if="isRunning"
                    @click="doStop"
                    class="btn btn-lg btn-danger"
                    type="button"
                >
                    Stop
                </button>
                <button
                    v-else
                    @click="doStart"
                    class="btn btn-lg btn-primary"
                    type="button"
                >
                    Start
                </button>

                <button
                    @click="doEdit"
                    class="btn btn-lg btn-secondary"
                    type="button"
                >
                    Edit
                </button>

                <div class="summary">
                    <span v-if="list.length" class="badge bg-dark">
                        Total: {{ list.length }}
                    </span>
                    <span v-if="listProcessed" class="badge bg-primary">
                        Processed: {{ listProcessed }}
                    </span>
                    <span v-if="listOk" class="badge bg-success">
                        OK: {{ listOk }}
                    </span>
                    <span v-if="listWarnings" class="badge bg-warning">
                        Warnings: {{ listWarnings }}
                    </span>
                    <span v-if="listErrors" class="badge bg-danger">
                        Errors: {{ listErrors }}
                    </span>
                    <span v-if="listRedirected" class="badge bg-info">
                        Redirected: {{ listRedirected }}
                    </span>
                    <span v-if="listTimer" class="badge bg-dark">
                        Time: {{ listTimer }} sec
                    </span>
                </div>
            </div>
            <br/><br/>
            <ol class="list-group">
                <li v-for="(item, idx) in list" class="list-group-item list-group-item-action">
                    <a :href="item.url" target="_blank">
                        {{ item.url }}
                    </a>
                    <span v-if="item.status" :class="'badge bg-' + getStatusColor(item.status)">
                        {{ item.status }}
                    </span>
                    <span v-if="item.redirected" class="badge bg-info">
                        Redirected
                    </span>
                    <span v-if="item.timer" class="badge bg-dark">
                        {{ item.timer }} ms
                    </span>
                    <div class="url-buttons">
                        <button v-if="!isRunning && item.status !== TESTING" @click="doFetch(idx)" type="button" class="btn btn-sm btn-primary">
                            &#9654;
                        </button>
                        <div v-if="item.status === TESTING" class="spinner-border spinner-border-sm" role="status"></div>
                    </div>
                </li>
            </ol>
        </div>
    </div>
    <div class="container-fluid">
        <AppFooter v-once/>
    </div>
</div>
</template>

<script>
import AppFooter from '/src/app/AppFooter.vue';
import AppHeader from '/src/app/AppHeader.vue';
import urls_default from '/src/app/lists/urls_default';
import urls_brands from '/src/app/lists/urls_brands';
import urls_models from '/src/app/lists/urls_models';

// "vue-template-compiler" must be installed as a prod dependency
// "webpack-cli" must be installed as a prod dependency

const TESTING = 'testing...';

const isTesting = (text) => {
    return text === TESTING;
};
const isOk = (text) => {
    return text.indexOf('20') === 0;
};
const isError = (text) => {
    return text.indexOf('40') === 0 || text.indexOf('50') === 0;
};
const isWarning = (text) => {
    return text.indexOf('Error') >= 0;
};

export default {
    el: '#app',
    components: {
        AppFooter,
        AppHeader,
    },
    data: function () {
        return {
            current: 0,
            // debug: false, // set form the URL (currently not used)
            isEdit: true,
            isRunning: false,
            list: [],
            listStr: localStorage.getItem('listStr') || this.parseLists(urls_default),
        };
    },
    computed: {
        listProcessed() {
            return this.list.map(item => {
                return item.status;
            }).filter(Boolean).length;
        },
        listOk() {
            return this.list.map(item => {
                return item.status;
            }).filter(isOk).length;
        },
        listRedirected() {
            return this.list.filter(item => {
                return item.redirected;
            }).length;
        },
        listWarnings() {
            return this.list.map(item => {
                return item.status;
            }).filter(isWarning).length;
        },
        listErrors() {
            return this.list.map(item => {
                return item.status;
            }).filter(isError).length;
        },
        listTimer() {
            const ms = this.list.map(item => {
                return item.timer || 0;
            }).reduce((a, b) => {
                return a + b;
            });
            return Math.round(ms / 1000 * 10) / 10; // sec to the first decimal
        },
    },
    methods: {
        parseLists(arr) {
            return arr.join("\n");
        },
        getStatusColor(text) {
            if (isTesting(text)) {
                return 'light';
            }
            if (isOk(text)) {
                return 'success';
            }
            if (isError(text)) {
                return 'danger';
            }
            if (isWarning(text)) {
                return 'warning';
            }
            return 'dark';
        },
        doParse() {
            this.isEdit = false;
            localStorage.setItem('listStr', this.listStr);
            this.list = this.listStr.trim().split("\n").map(item => {
                item = item.trim();
                if (!item) {
                    return null;
                }
                return { // must set every prop to be reactive!
                    redirected: false,
                    status: '',
                    timer: '', // @todo: consider Vue.set, or migrate to Vue3
                    url: item.trim(),
                };
            }).filter(Boolean);
        },
        doLoadDefaults() {
            this.listStr = this.parseLists(urls_default);
        },
        doLoadBrands() {
            this.listStr = this.parseLists(urls_brands);
        },
        doLoadModels() {
            this.listStr = this.parseLists(urls_models);
        },
        doEdit() {
            this.doStop(); // just in case
            this.isEdit = true;
        },
        doReset() {
            this.list = this.list.map(item => {
                item.status = '';
                item.redirected = false;
                item.timer = '';
                return item;
            });
            this.current = 0;
        },
        doStart() {
            this.doReset();
            this.isRunning = true;
            this.fetchNext();
        },
        doStop() {
            this.isRunning = false;
        },
        async fetchNext() {
            if (!this.isRunning) {
                console.debug('not running. Stop!');
                return;
            }
            const idx = this.current++;
            if (!this.list[idx]) {
                this.isRunning = false;
                console.debug(`index "${idx}" not found, so finishing.`);
                return;
            }
            await this.doFetch(idx);
            this.fetchNext(); // self-recursive
        },
        doFetch(idx) {
            const item = this.list[idx];
            item.redirected = false;
            item.status = TESTING;
            item.timer = '';
            const t0 = performance.now();
            const url = '/proxy?url=' + encodeURIComponent(item.url);
            return fetch(url).then(response => {
                console.debug(item.url, `Proxy response: ${response.status} ${response.statusText}`);
                return response.json();
            }).then(payload => {
                console.debug('Proxy payload', payload);
                item.status = payload.status;
                item.redirected = payload.redirected;
                const t1 = performance.now();
                item.timer = Math.ceil(t1 - t0); // diff in ms
            }).catch(err => {
                console.log('fetch error', err);
            });
        },
    },
    created() {
        this.TESTING = TESTING; // make available in the template
    },
};
</script>

<style lang="scss">
.body {
    margin-bottom: 30px;
}
.summary {
    float: right;

    > span {
        margin-right: 15px;
    }
}
.subtext {
    color: lightgray;
    font-size: 12px;

    a {
        color: inherit;
        display: contents; // huh?
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
}
.footer {
    justify-content: center;
    padding-top: 100px;
}
.url-buttons {
    float: right;

    button {
        font-size: 7px;
    }
}
</style>
