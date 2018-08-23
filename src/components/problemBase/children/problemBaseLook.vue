<template>
    <div class="articlelook">
        <div class="clearfix">
            <p class="header fr">
                <el-button @click="goedit" style="background:#83BDF9;color:#fff;">编辑</el-button>
            </p>
        </div>
        <div class="content">
            <p class="lh40">
                <el-col :span="8">
                    <span>标题：{{details.title?details.title:'---'}}</span>
                </el-col>
                <span>类型：{{details.problemType}}</span>
            </p>
            <p class="lh40">
                <el-col :span="8">
                    <span>创建时间：{{details.createTime?details.createTime:'---'}}</span>
                </el-col>
                <span>更新时间：{{details.updateTime?details.updateTime:'---'}}</span>
            </p>
          
            <div class="article">
                <h2 class="lh40 font20">正文内容</h2>
                <div ref="content" style="padding-bottom:60px;"></div>
            </div>
        </div>
    </div>
</template>

<style src="./problemBaseLook.scss" scoped lang="scss">

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
            // 问题库详情   
            problemBaseDetails(id){
                http.get('/api/auth/v1/problemLibrary/'+id).then(res=>{
                    if(res.status.code == 0){
                        console.log(res);
                        this.details = res.data;
                        console.log('details',this.details)
                        // 文章类型
                        if(this.details.problemType == null){
                            this.details.problemType = '未知类型'
                        }else if(this.details.problemType == 0){
                            this.details.problemType = '营养'
                        }else if(this.details.problemType == 1){
                            this.details.problemType = '运动'
                        }else if(this.details.problemType == 2){
                            this.details.problemType = '疾病'
                        }
                       
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
                this.$router.push({path: '/problemBase/editProblemBase', query:{"id": this.id}})
            }
        },
        mounted(){
            this.id = this.$route.query.id;
            this.problemBaseDetails(this.id)

        }
    }
</script>