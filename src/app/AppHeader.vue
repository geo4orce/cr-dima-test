<template>
<div class="header">
    <h1>{{ h1 }}</h1>
    <div class="subtext">
        <a href="https://github.com/geo4orce/cr-dima-test" target="_blank">
            v{{ version }}
        </a>
        <div v-if="env !== 'production'">
            Env: {{ env }}
        </div>
    </div>
</div>
</template>

<script>
// declare const ENV;
// declare const PKG;
export default {
    name: 'AppHeader',
    data: function() {
        return {
            env: ENV.NODE_ENV,
            h1: PKG.description, // from ./index.js
            version: PKG.version,
        };
    },
};
</script>

<style lang="scss" scoped>
.header {
    align-items: center;
    display: flex;
    justify-content: space-between;
}
</style>
