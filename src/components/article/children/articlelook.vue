<template>
    <div class="articlelook" style="background:#EFEFEF;">
        <div class="clearfix">
            <p class="header fr">
                <el-button :disabled="$store.state.getArticleComment" @click="toreview" style="background:#83BDF9;color:#fff;">查看评论</el-button>
                <el-button :disabled="$store.state.updateArticle" @click="goedit" style="background:#83BDF9;color:#fff;">编辑</el-button>
            </p>
        </div>
        <div class="content">
            <p class="lh40">
                <el-col :span="8">
                    <span>标题：{{details.title?details.title:'---'}}</span>
                </el-col>
                <span>类型：{{details.articleType}}</span>
            </p>
            <p class="lh40">
                <el-col :span="8">
                    <span>作者：{{details.author?details.author:'---'}}</span>
                </el-col>
                <span>更新时间：{{details.updateTime?details.updateTime:'---'}}</span>
            </p>
            <div>
                <p class="lh40">
                    <span>缩略图：</span>
                </p>
                <img :src="details.picUrl?details.picUrl:'./../../../../static/imgs/placeholder.jpg'" alt="" style="height:200px;width:300px;">
            </div>

            <div>
                <h5 style="padding:20px 0px;">推送范围：</h5>
                <p class="lh40">
                    <el-col :span="2">
                        <span>个人版：</span>
                    </el-col>
                        <span v-show="details.puchAge">年龄：</span><span v-show="details.puchAge" style="margin-right:30px;">{{details.puchAge?details.puchAge:'---'}}</span>
                        <span v-show="details.gradeId">年级：</span><span v-show="details.gradeId" style="margin-right:30px;">{{details.gradeId?details.gradeId:'---'}}</span>
                        <span v-show="details.gradeId == details.puchAge">年级/年龄：</span><span v-show="details.gradeId == details.puchAge">---</span>
                        <span>性别：</span><span>{{details.sex?details.sex:'---'}}</span>

                </p>
                <p class="lh40"> 
                    <el-col :span="2">
                        <span>学校版：</span>
                    </el-col>
                     <!-- <el-col :span="8"> -->
                        <span>学校类型：</span><span>{{details.schoolType?details.schoolType:'---'}}</span>
                    <!-- </el-col> -->
                </p>
            </div>

            <div class="article">
                <h1 class="lh40 font20">文章内容</h1>
                <div ref="content" style="padding-bottom:60px;"></div>
            </div>
        </div>
    </div>
</template>

<style src="./articlelook.scss" scoped lang="scss">

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
                http.get('/api/auth/v1/article/'+id).then(res=>{
                    if(res.status.code == '0'){
                        // console.log(res);
                        this.details = res.data;
                        // console.log('details',this.details)
                        // 文章类型
                        if(this.details.articleType == null){
                            this.details.articleType = '未知类型'
                        }else if(this.details.articleType == 0){
                            this.details.articleType = '营养'
                        }else if(this.details.articleType == 1){
                            this.details.articleType = '健康'
                        }else if(this.details.articleType == 2){
                            this.details.articleType = '运动'
                        }else if(this.details.articleType == 3){
                            this.details.articleType = '疾病'
                        }

                        // 推送年龄
                        if(this.details.puchAge == null || ''){
                            this.details.puchAge = '---'
                        }else{
                            let arr = this.details.puchAge.split(',');
                            let str = '';
                            for(let key of arr){
                                if(key == '0'){
                                    str += '(6-10岁) '
                                }else if(key == '1'){
                                    str += '(6-10岁) '
                                }else if(key == '2'){
                                    str += '(14岁以上) '
                                }
                            }
                            this.details.puchAge = str
                        }

                        if(this.details.gradeId == null || ''){
                            this.details.gradeId = '---'
                        }else{
                            let arr = this.details.gradeId.split(',');
                            let str = '';
                            for(let key of arr){
                                if(key == '0'){
                                    str += '一年级 '
                                }else if(key == '1'){
                                    str += '二年级 '
                                }else if(key == '2'){
                                    str += '三年级 '
                                }else if(key == '3'){
                                    str += '四年级 '
                                }else if(key == '4'){
                                    str += '五年级 '
                                }else if(key == '5'){
                                    str += '六年级 '
                                }else if(key == '6'){
                                    str += '七年级 '
                                }else if(key == '7'){
                                    str += '八年级 '
                                }else if(key == '8'){
                                    str += '九年级 '
                                }else if(key == '9'){
                                    str += '高一 '
                                }else if(key == '10'){
                                    str += '高二 '
                                }else if(key == '11'){
                                    str += '高三 '
                                }
                            }
                            this.details.gradeId = str
                        }
                        
                      
                        // 推送性别
                        if(this.details.sex == null || ''){
                            this.details.sex = '---'
                        }else{
                            let arr = this.details.sex.split(',');
                            let str = '';
                            for(let key of arr){
                                if(key == '0'){
                                    str += '男 '
                                }else if(key == '1'){
                                    str += '女 '
                                }
                            }
                            this.details.sex = str
                        }
                        
                   

                        // 学校类型
                        if(this.details.schoolType == null || ''){
                            this.details.schoolType = '---'
                        }else{
                            let arr = this.details.schoolType.split(',');
                            let str = '';
                            for(let key of arr){
                                if(key == '0'){
                                    str += '小学 '
                                }else if(key == '1'){
                                    str += '初中 '
                                }else if(key == '2'){
                                    str += '高中 '
                                }
                            }
                            this.details.schoolType = str
                        }

                        this.$refs.content.innerHTML = this.details.content
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
                    console.log(error);
                })
            },
            // 评论
            toreview(){
                this.$router.push({path: '/article/articlereview', query:{"id": this.id}})
            },
            goedit(){
                this.$router.push({path: '/article/addarticle', query:{"id": this.id}})
            }
        },
        mounted(){
            this.id = this.$route.query.id;
            // console.log(this.id);
            this.articleDetails(this.id)

            this.review(this.id);
            // console.log(this.$refs.content);
        }
    }
</script>