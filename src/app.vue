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
                <button @click="doEdit" type="button" class="btn btn-secondary">
                    Edit
                </button>
                <button v-if="isRunning" @click="doStop" type="button" class="btn btn-danger">
                    Stop
                </button>
                <button v-else @click="doStart" type="button" class="btn btn-success">
                    Start
                </button>
                <br/><br/>
                <ol class="list-group">
                    <li v-for="item in list" class="list-group-item">
                        {{ item.url }}<br/>
                        Status: <span v-html="getStatusBadge(item.status)"></span>
                    </li>
                </ol>
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
        },
        methods: {
            getStatusBadge(text) {
                if (text === 'testing...') {
                    return `<span class="badge bg-primary">${text}</span>`;
                }
                if (text.indexOf('200') === 0) {
                    return `<span class="badge bg-success">${text}</span>`;
                }
                if (text.indexOf('40') === 0 || text.indexOf('50') === 0) {
                    return `<span class="badge bg-danger">${text}</span>`;
                }
                return `<span class="badge bg-warning">${text}</span>`;
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
                    console.log('not running!');
                    return;
                }
                const currentItem = this.list[this.current++];
                if (!currentItem) {
                    this.isRunning = false;
                    console.log('finished');
                    return;
                }
                currentItem.status = 'testing...';
                const url = '/proxy?url=' + encodeURIComponent(currentItem.url);
                fetch(url).then(res => {
                    console.log(currentItem.url, `${res.status} ${res.statusText}`);
                    return res.json();
                }).then(body => {
                    currentItem.status = body.status;
                    this.fetchNext();
                }).catch(err => {
                    console.log('err', err);
                });
            }
        },
        mounted: function () {
        },
    }
</script>
