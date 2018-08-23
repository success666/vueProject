<template>
    <div style="color:#fff;">
        <p class="rootelement" style="height:120px;">
            <img src="./../../assets/imgs/gzhc_icon.png" alt="" style="width:100px;height:100px;" class="center">
        </p>
        <el-tree :data="menuData" :props="defaultProps" @node-click="handleNodeClick" class="eltree" style="padding:10px 0px 10px 0px;background:#29ADFF;color:#E5E5E5;height:100%;"></el-tree>
    </div>
</template>
<style src="./nav.scss">
   
</style>

<script>
import http from "./../../utils/HttpClient";
import url from "./../../baseurl/baseurl";

export default {
    data() {
        return {
            menuData:[],
            defaultProps: {
                children: "children",
                label: "name"
            }
        };
    },
    methods: {
        handleNodeClick(data) {
            // console.log(data);
            if(data.href != '' && data.href != null){
                // console.log(data.href)
                this.$router.push({path:data.href});
            }else if(data.id == 64 || data.id == 1 || data.id == 61 || data.id == 59 || data.id == 62 || data.id == 60){
                return;
            }else{
                this.$router.push({path:'/error'})
            }
        },
        handleOpen(key, keyPath) {
            // console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            // console.log(key, keyPath);
        }




    },
    mounted() {
        this.menuData = JSON.parse(localStorage.getItem("menuData"));
        console.log('菜单',this.menuData);
    }
};
</script>