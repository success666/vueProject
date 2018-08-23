<template>
    <div class="articlelook">
        <div class="clearfix">
            <p class="header fr">
                <el-button :disabled="$store.state.updateDiseaseScheme" @click="goedit" style="background:#83BDF9;color:#fff;">编辑</el-button>
            </p>
        </div>
        <div class="content">
            <p class="lh40">
                <el-col :span="8">
                    <span>标题：{{details.title?details.title:'---'}}</span>
                </el-col>
                <span>更新时间：{{details.updateTime?details.updateTime:'---'}}</span>
            </p>
          

            <div>
                <span>推送范围：</span>
                <span>{{details.pushValue?details.pushValue:'---'}}</span>
            </div>
            <div>
                <p class="lh40">
                    <span>缩略图：</span>
                </p>
                <img :src="details.picUrl?details.picUrl:'./../../../../static/imgs/placeholder.jpg'" alt="" style="height:200px;width:300px;">
            </div>

            <div class="article">
                <h1 class="lh40 font20">方案内容</h1>
                <div ref="content" style="padding-bottom:60px;"></div>
            </div>
        </div>
    </div>
</template>

<style src="./diseaseSchemeLook.scss" scoped lang="scss">

</style>

<script>
    import http from '../../../utils/HttpClient'
    export default {
        data(){
            return {
                id:'',
                details:[],
            }
        },
        methods:{
            // 文章详情
            Details(id){
                http.get('/api/auth/v1/diseaseScheme/'+id).then(res=>{
                    if(res.status.code == 0){
                        console.log(res);
                        this.details = res.data;
                        console.log('details',this.details)
                       
                        this.$refs.content.innerHTML = this.details.content
                    }else if(res.status.code == '2010001'){
                        this.$message({
                            type: 'warning',
                            message: 'token失效请重新登录'
                        });
                        this.$router.push({name: 'login'});
                    }else{
                        return this.$message({
                            type: 'error',
                            message: res.status.msg
                        });
                    }
                }).catch(error=>{
                    this.$message({
                        type: 'error',
                        message: '请求数据失败!'
                    });
                })
            },

            goedit(){
                this.$router.push({path: '/diseaseScheme/editDiseaseScheme', query:{"id": this.id}})
            }
        },
        mounted(){
            this.id = this.$route.query.id;
            // console.log(this.id);
            this.Details(this.id)

        }
    }
</script>