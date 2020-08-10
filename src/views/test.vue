<template>
<div>ggggg</div>
</template>

<script>
    export default {
        name: "test",
        sockets: {
            connect: function () {
                console.log('socket connected');
            },
            SOCKET_INFO: function (value) {

            }
        },
    }
</script>

<style scoped>

</style>
