<template>
<div class="body">
    <div class="container-fluid">
        <div class="row">
            <h1>{{ h1 }}</h1>
            <div class="sub">
                <div>Version: v{{ version }}</div>
                <div>Env: {{ env }}</div>
            </div>
        </div>
        <br/><br/>
        <div v-if="isEdit">
            <button @click="doParse" type="button" class="btn btn-primary">
                Save
            </button>
            <br/><br/>
            <label for="listStr" class="form-label">
                List of URLs
            </label>
            <textarea v-model="listStr" rows="10" id="listStr" class="form-control">
            </textarea>
            <div class="form-text">
                One per line. Spacing doesn't matter.
            </div>
        </div>
        <div v-else>
            <div class="btn-container">
                <button @click="doEdit" type="button" class="btn btn-secondary">
                    Edit
                </button>
                <button v-if="isRunning" @click="doStop" type="button" class="btn btn-danger">
                    Stop
                </button>
                <button v-else @click="doStart" type="button" class="btn btn-success">
                    Start
                </button>
                <div class="summary">
                    <span v-if="list.length" class="badge bg-dark">Total: {{ list.length }}</span>
                    <span v-if="listProcessed" class="badge bg-primary">Processed: {{ listProcessed }}</span>
                    <span v-if="listOk" class="badge bg-success">OK: {{ listOk }}</span>
                    <span v-if="listRedirected" class="badge bg-info">Redirected: {{ listRedirected }}</span>
                    <span v-if="listWarnings" class="badge bg-warning">Warnings: {{ listWarnings }}</span>
                    <span v-if="listErrors" class="badge bg-danger">Errors: {{ listErrors }}</span>
                </div>
            </div>
            <br/><br/>
            <ol class="list-group">
                <li v-for="item in list" class="list-group-item">
                    {{ item.url }}
                    <span v-if="item.status" :class="getBadge(item.status)">
                        {{ item.status }}
                    </span>
                </li>
            </ol>
        </div>
    </div>
    <div class="container-fluid">
        <div class="row footer">
            Copyright &copy; 2021 <a href="https://web-opt.com" target="_blank">Geo</a> &amp; Dima. All righty then.
        </div>
    </div>
</div>
</template>

<script>
// "vue-template-compiler" must be installed as a prod dependency
// "webpack-cli" must be installed as a prod dependency

// declare const ENV;
// declare const PKG;

const CR_HOST = 'https://www.consumerreports.org';
const KEYS_JSON = ENV.KEYS_JSON || 'keys.json';
const TESTING = 'testing...';
const REDIRECTED = ', redirected';

const isTesting = (text) => {
    return text === TESTING;
};
const isOk = (text) => {
    return text.indexOf('20') === 0;
};
const isRedirected = (text) => {
    return text.indexOf(REDIRECTED) >= 0;
};
const isError = (text) => {
    return text.indexOf('40') === 0 || text.indexOf('50') === 0;
};
const isWarning = (text) => {
    return text.indexOf('Error') >= 0;
};

export default {
    el: '#app',
    data: function () {
        return {
            h1: PKG.description, // from ./index.js
            version: PKG.version,
            env: ENV.NODE_ENV,
            isEdit: true,
            isRunning: false,
            current: 0,
            listStr: localStorage.getItem('listStr') || "http://cr.org\nhttps://cr.org/cars/honda\n",
            list: [{
                url: 'http://cr.org',
                status: 'none',
            }, {
                url: 'abc.com',
                status: 'none',
            }],
            debug: false, // set form the URL
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
            return this.list.map(item => {
                return item.status;
            }).filter(isRedirected).length;
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
    },
    methods: {
        getBadge(text) {
            if (isTesting(text)) {
                return 'badge bg-primary';
            }
            if (isOk(text)) {
                return 'badge bg-success';
            }
            if (isError(text)) {
                return 'badge bg-danger';
            }
            if (isWarning(text)) {
                return 'badge bg-warning';
            }
            return 'badge bg-dark';
        },
        doParse() {
            this.isEdit = false;
            localStorage.setItem('listStr', this.listStr);
            this.list = this.listStr.trim().split("\n").map(item => {
                item = item.trim();
                if (!item) {
                    return null;
                }
                return {
                    url: item.trim(),
                    status: '',
                };
            }).filter(Boolean);
        },
        doEdit() {
            this.doStop(); // just in case
            this.isEdit = true;
        },
        doReset() {
            this.list = this.list.map(item => {
                item.status = '';
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
        fetchNext() {
            if (!this.isRunning) {
                console.debug('not running. Stop!');
                return;
            }
            const currentItem = this.list[this.current++];
            if (!currentItem) {
                this.isRunning = false;
                console.debug('finished');
                return;
            }
            currentItem.status = TESTING;
            const url = '/proxy?url=' + encodeURIComponent(currentItem.url);
            fetch(url).then(res => {
                console.debug(currentItem.url, `Proxy status: ${res.status} ${res.statusText}`);
                return res.json();
            }).then(body => {
                console.debug('Proxy response', body);
                currentItem.status = body.status + (body.redirected ? REDIRECTED : '');
                console.debug('proceed to next');
                this.fetchNext();
            }).catch(err => {
                console.log('fetch error', err);
            });
        }
    },
};
</script>

<style lang="scss">
.body {
    margin-bottom: 30px;
}
.btn-container {

}
.summary {
    float: right;

    > span {
        margin-right: 15px;
    }
}
.footer {
    color: lightgray;
    font-size: 10px;
    justify-content: center;
    padding-top: 100px;

    > a {
        color: lightgray;
        display: contents; // huh?
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
