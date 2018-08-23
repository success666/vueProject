<template>
    <div class="articlelook" style="background:#EFEFEF;">
        <div class="clearfix">
            <p class="header fr">
                <el-button :disabled="$store.state.updateSportPoint" @click="goedit" style="background:#83BDF9;color:#fff;">编辑</el-button>
            </p>
        </div>
        <div class="content">
            <P class="lh40">
                <span>标题：{{details.title?details.title:'---'}}</span>   
            </P>
            <div>
                <p class="lh40">
                    <span>缩略图：</span>
                </p>
                <img :src="details.picUrl?details.picUrl:'./../../../../static/imgs/placeholder.jpg'" alt="" style="height:200px;width:300px;">
            </div>
            <hr/>
            <div class="lh40">
                <h2>适合人群</h2>
                <p>
                    <span>年龄：{{details.pushClassName?details.pushClassName:'---'}}</span>
                </p>
                <p>
                    <span>姓别：{{details.sex?details.sex:'---'}}</span>
                </p>
            </div>
            <hr/>

            <div>
                <h5 style="padding:20px 0px;">指导点属性</h5>
                <p class="lh40">
                    <span>运动类型：{{details.sportTypeName?details.sportTypeName:'---'}}</span>
                </p>
                <p class="lh40">
                    <span>锻炼部位：{{details.exercisePositionName?details.exercisePositionName:'---'}}</span>
                </p>
                <p class="lh40">
                    <span>强度：{{details.exerciseIntensity?details.exerciseIntensity:'---'}}</span>
                </p>
                <p class="lh40">
                    <span>场地：{{details.site == '0'?'室内':'室外'}}</span>
                </p>
                
                <p class="lh40">
                    <span>运动数：{{details.exerciseGroup?details.exerciseGroup:'---'}}</span>每组<span>{{details.groupValue}}</span>秒
                </p>
                <p class="lh40">
                    <span>器械：{{details.instrumentName?details.instrumentName:'---'}}</span>
                </p>
                <p class="lh40">
                    <span>关联素质：{{details.relevanceQualityName?details.relevanceQualityName:'---'}}</span>
                </p>
                <p class="lh40">
                    <span>关联运动：{{details.relevanceSportName?details.relevanceSportName:'---'}}</span>
                </p>
            </div>
            <hr/>

            <div class="article">
                <h1 class="lh40 font20">指导点内容</h1>
                <p class="lh40">动作描述：</p>
                <div ref="content"></div>
            </div>
            <div>
                <p class="lh40">
                    <span>缩略图：</span>
                </p>
                <img :src="details.coverPic?details.coverPic:'./../../../../static/imgs/placeholder.jpg'" alt="" style="height:200px;width:300px;">
            </div>
        </div>
    </div>
</template>

<style src="./movingManagementLook.scss" scoped lang="scss">

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
            articleDetails(id){
                http.get('/api/auth/v1/sportPoint/'+id).then(res=>{
                    if(res.status.code == '0'){
                        console.log('详情',res);
                        this.details = res.data;
                        // 文章类型
                        if(this.details.exerciseIntensity == '0'){
                            this.details.exerciseIntensity = '低'
                        }else if(this.details.exerciseIntensity == '1'){
                            this.details.exerciseIntensity = '中'
                        }else if(this.details.exerciseIntensity == '2'){
                            this.details.exerciseIntensity = '高'
                        }

                        // 推送年龄
                        if(this.details.puchAge == null || ''){
                            this.details.puchAge = '未知推送年龄范围'
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
                            this.details.gradeId = '未知推送年级范围'
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
                            this.details.sex = '未知推送性别'
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
                            this.details.schoolType = '未知学校类型'
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
                    console.log(error);
                })
            },
            
            goedit(){
                this.$router.push({path: '/movingManagement/editMovingManagement', query:{"id": this.id}})
            }
        },
        mounted(){
            this.id = this.$route.query.id;
            if(this.id){
                this.articleDetails(this.id)
            }

        }
    }
</script>