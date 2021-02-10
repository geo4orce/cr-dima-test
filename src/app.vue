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
            <button @click="doStart" v-if="!isRunning">
                Start
            </button>
            <ol class="title">
                <li v-for="item in list">
                    {{ item.url }}<br/>
                    Status: {{ item.status }}
                </li>
            </ol>
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
                isRunning: false,
                current: 0,
                list: [
                    {
                        url:'https://www.consumerreports.org/cars/honda/',
                        status: '',
                    },
                    {
                        url:'https://www.consumerreports.org/cars/kia/',
                        status: '',
                    },
                    {
                        url:'https://www.consumerreports.org/cars/toyota/',
                        status: '',
                    },
                    {
                        url:'https://www.consumerreports.org/cars/burgers/',
                        status: '',
                    },
                    {
                        url:'https://www.consumerreports.org/cars/mazda/',
                        status: '',
                    },
                    {
                        url:'https://www.consumerreports.org/cars/ford/',
                        status: '',
                    },
                ],
                debug: false, // set form the URL
            };
        },
        computed: {
        },
        methods: {
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
