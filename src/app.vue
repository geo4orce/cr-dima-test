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
                <textarea v-model="listStr" cols="100" rows="10">
                </textarea>
                <br/>
                <button @click="doParse">
                    Parse
                </button>
            </div>
            <div v-else>
                <button @click="doEdit">
                    Edit
                </button>
                <button @click="doStart">
                    Fire
                </button>
                <br/>
                <ol class="title">
                    <li v-for="item in list">
                        {{ item.url }}<br/>
                        Status: {{ item.status }}
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
                isEdit: false,
                isRunning: false,
                current: 0,
                listStr: '',
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
            doParse() {
                this.isEdit = false;
                this.list = this.listStr.trim().split("\n").map(item => {
                    return {
                        url: item.trim(),
                        status: '',
                    };
                });
            },
            doEdit() {
                this.isEdit = true;
                this.listStr = this.list.map(item => {
                    return item.url;
                }).join("\n");
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
