<template>
    <div class="articlelook border-radius">
        <div class="content">
            <p class="lh40">
                <el-col :span="8">
                    <span>提问人：{{details.title?details.title:'---'}}</span>
                </el-col>
                <span>类型：{{details.articleType}}</span>
            </p>
            <p class="lh40">
                <el-col :span="8">
                    <span>状态：{{details.author?details.author:'---'}}</span>
                </el-col>
                <span>提问：{{details.updateTime}}</span>
            </p>
            <div>
                <p class="lh40">
                    <span>缩略图：</span>
                </p>
                <img :src="details.picUrl?details.picUrl:'./../../../../static/imgs/placeholder.jpg'" alt="" style="height:200px;width:300px;">
            </div>

            <div style="padding-top:20px;">
                <textarea name="return" id="return" cols="90" rows="10"></textarea>
                <el-button :disabled="$store.state.addAskQuestionReply">回复</el-button>
            </div>
            
        </div>
    </div>
</template>

<style src="./issuesManagementLook.scss" scoped lang="scss">

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
            articleDetails(id){
                http.get('/api/auth/v1/askQuestion/reply',{"id":id}).then(res=>{
                    if(res.status.code == 0){
                        console.log(res);
                        this.details = res.data;    
                        console.log('details',this.details)
                      
                    }else if(res.status.code == '2010001'){
                        this.$message({
                            type: 'error',
                            message: 'token失效请重新登录'
                        });
                        this.$router.push({name: 'login'});
                    }else{
                        this.$message({
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
           
           
        },
        mounted(){
            this.id = this.$route.query.id;
            // console.log(this.id);
            this.articleDetails(this.id)

           
        }
    }
</script>