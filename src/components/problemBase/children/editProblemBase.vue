<template>
    <div>
        <div class="clearfix">
            <!-- title -->
            <p style="padding:10px 0px;">
                标题：
                <el-input placeholder="请输入文章标题" v-model="addArticleData.title" clearable style="width:80%;"></el-input>
            </p>
            <p style="padding-bottom:10px;">
                类型：
                <el-select v-model="problemType" placeholder="请选择文章类型">
                    <el-option
                    v-for="item in type"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select> 
            </p>
        </div>
        <!-- 富文本编辑器 -->
        <Ueditor :content="content" :config="config" :id="ue" ref="ue"></Ueditor><br/>

        <!-- footer -->
        <div style="text-align:center;">
            <p>
                <el-button @click="goback" style="background:#83BDF9;color:#fff;">取消</el-button>
                <el-button @click="publicSave($event,'1',$store.state.addProblemLibrary,$store.state.updateProblemLibrary)" style="background:#83BDF9;color:#fff;">保存并公开</el-button>
                <el-button @click="saveArticle($event,'0',$store.state.addProblemLibrary,$store.state.updateProblemLibrary)" style="background:#83BDF9;color:#fff;">保存</el-button>
            </p>
        </div>
    </div>
</template>


<style src="./editProblemBase.scss" scoped lang="scss">
    
</style>
<script>
    import superagent from 'superagent'
    import Ueditor from './ueditor.vue'
    import http from '../../../utils/HttpClient'
import addarticleVue from '../../article/children/addarticle.vue';

    export default {
        components:{
            Ueditor
        },
        data(){
            return {
                
                // 文章类型
                problemType:'',

                type:[{
                    id:0,
                    name:'营养',
                },{
                    id:1,
                    name:'健康'
                },{
                    id:2,
                    name:'运动'
                },{
                    id:3,
                    name:'疾病'
                }],
               
                
                // 参数 
                addArticleData:{
                    id:'',
                    title:'',//标题
                    content:'',//文章内容
                    openFlag:'',//公开状态 0 不公开 1公开
                    problemType:'',//文章类型  0 营养  1 健康  2 运动 3 疾病  
                },

                // 富文本
                content: '',
                editor:'',
                config: {
                    initialFrameWidth: '100%',
                    initialFrameHeight: 1000,
                    wordCount: false,
                },
                ue: "ue", // 不同编辑器必须不同的id

                id:''
            }
        },
        methods:{
           goback(){
               this.$router.go(-1);
           },
           
            publicSave(event,num,addTpye,editType){
                if(this.id == '' && addTpye == true){
                    return this.$message({
                        type: 'error',
                        message: '没此这权限'
                    });
                }

                if(this.id != '' && editType == true){
                    return this.$message({
                        type: 'error',
                        message: '没此这权限'
                    });
                }
                // console.log(num)
                this.saveArticle(event,num)
            },
            saveArticle(event,number,addTpye,editType){
                if(this.id == '' && addTpye == true){
                    return this.$message({
                        type: 'error',
                        message: '没此这权限'
                    });
                }

                if(this.id != '' && editType == true){
                    return this.$message({
                        type: 'error',
                        message: '没此这权限'
                    });
                }
                this.addArticleData.content = this.getUEContent();
                // 一般非空判断
                if(this.addArticleData.title == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请填写标题'
                    });
                }else if(this.problemType.toString == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请选择类型'
                    });
                }else if(this.addArticleData.content == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请选添加内容'
                    });
                }
                
                this.addArticleData.problemType = this.problemType;
                if(number == 1){
                    if(this.id){
                        if(this.addArticleData.problemType == '营养'){
                                this.addArticleData.problemType = '0'
                            }else if(this.addArticleData.problemType == '运动'){
                                this.addArticleData.problemType = '1'
                            }else if(this.addArticleData.problemType == '疾病'){
                                this.addArticleData.problemType = '2'
                        }
                        delete this.addArticleData.createUser
                        delete this.addArticleData.createTime
                        delete this.addArticleData.updateTime

                        this.addpost('/api/auth/v1/problemLibrary/',this.id,this.addArticleData)
                    }else{
                        this.addArticleData.openFlag = '1';
                        this.addpost('/api/auth/v1/problemLibrary/','',this.addArticleData)
                    }
                   
                }else{
                    this.addArticleData.openFlag = 0;
                    if(this.id){
                        this.addArticleData.id = this.id;
                        if(this.addArticleData.problemType == '营养'){
                                this.addArticleData.problemType = '0'
                            }else if(this.addArticleData.problemType == '健康'){
                                this.addArticleData.problemType = '1'
                            }else if(this.addArticleData.problemType == '运动'){
                                this.addArticleData.problemType = '2'
                            }else if(this.addArticleData.problemType == '疾病'){
                                this.addArticleData.problemType = '3'
                        }
                        
                        delete this.addArticleData.createUser
                        delete this.addArticleData.createTime
                        delete this.addArticleData.updateTime
                        
                        this.addpost('/api/auth/v1/problemLibrary/',this.id,this.addArticleData)
                    }else{
                        this.addpost('/api/auth/v1/problemLibrary/','',this.addArticleData)
                    }
                }
            },

            addpost(url,id,data){
                http.post(url+id,data).then(res=>{
                    if(res.status.code == 0){
                        this.$message({
                            type: 'success',
                            message: '保存成功'
                        });
                        setTimeout(()=>{
                            this.$store.commit('loading',this);
                            this.$router.push('/problemBase');
                        },1000)
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
                        message: '保存失败'
                    });
                })

            },

         
            // 获取ueditor的html
            getUEContent() {
                return UE.getEditor(this.ue).getContent();
            },

            edit(id){
                http.get('/api/auth/v1/problemLibrary/'+id).then(res=>{
                    if(res.status.code == 0){
                        console.log('content',res);
                        this.addArticleData = res.data;
                        this.content = res.data.content;
                        this.problemType = res.data.problemType;
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
                        message: '获取内容失败'
                    });
                })
            }
        },
        mounted(){
            this.id = this.$route.query.id || '';

            if(this.id){
                this.edit(this.id);
            }

        }
    }

</script>