<template>
    <div>
        <div class="clearfix">
            <!-- title -->
            <p style="padding:10px 0px;">
                标题：
                <el-input placeholder="请输入文章标题" v-model="editData.title" clearable style="width:80%;"></el-input>
            </p>
           
            <!-- 推送范围 -->
            <div class="fl clearfix">
                <span class="fl" style="padding-top:8px;">推送范围：</span>   
                
                <!-- 年龄 -->
                <p class="fl clearfix" style="width:900px;margin-bottom:16px;">
                    <span class="fl">
                        <el-radio v-model="radio" label="1" @change="radioChange">年龄</el-radio>
                        <el-select
                            :disabled="age"
                            class="select"
                            style="width:330px;"
                            v-model="puchAge"
                            multiple
                            filterable
                            allow-create
                            default-first-option
                            placeholder="请选择推送年龄">
                            <el-option
                            v-for="item in puchAgeData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </span>

                    <span class="fl" style="margin-left:8px;">
                        <el-radio v-model="radio" label="2" @change="radioChange">健康问题</el-radio>
                        <el-cascader
                            ref="cascader"
                            :disabled="health"
                            :options="options"
                            :props="configuration"
                            v-model="selectedOptions"
                            @change="handleChange">
                        </el-cascader>
                    </span>
                </p>
            </div>
        </div>

        <!-- 富文本编辑器 -->
        <Ueditor :content="content" :config="config" :id="ue" ref="ue"></Ueditor>

        <!-- footer -->
        <div style="text-align:center;padding:18px 0px 18px 0px;">
            <p>
                <el-button @click="goback" style="background:#83BDF9;color:#fff;">取消</el-button>
                <el-button @click="publicSave($event,'1',$store.state.addNutritionScheme,$store.state.updateNutritionScheme)" style="background:#83BDF9;color:#fff;">保存并公开</el-button>
                <el-button @click="saveArticle($event,'1',$store.state.addNutritionScheme,$store.state.updateNutritionScheme)" style="background:#83BDF9;color:#fff;">保存</el-button>
            </p>
        </div>
    </div>
</template>


<style src="./editNutritionScheme.scss" scoped lang="scss">
    
</style>
<script>
    import Ueditor from './ueditor.vue'
    import http from '../../../utils/HttpClient'

    export default {
        components:{
            Ueditor
        },
        data(){
            return {
                options: [],
                configuration:{
                    value:'id',
                    label:'name',
                    children:'children'
                },
                selectedOptions: [],

                puchAgeData:[{
                    id:0,
                    value:'0',
                    label:'6-10岁'
                },{
                    id:1,
                    value:'1',
                    label:'11-13岁'
                },{
                    id:2,
                    value:'2',
                    label:'14岁以上'
                }],
                // 推送年龄
                puchAge:[],
               
                // 参数 
                editData:{
                    createUser:'',
                    title:'',//标题
                    content:'',//文章内容
                    puchAge:'',//推送范围条件-年龄  0-( 6-10岁） 1-(11-13)  2-(14岁以上)
                    openFlag:'',//是否公开
                    pushType:'',//推送类型 1 年龄，2健康问题
                    pushValue:'',//字段
                    healthType:'126' ////健康分类,参考疾病分类表id
                },


                // 年龄 年级单选
                radio: '',
                age:true,
                health:true,


                // 富文本
                content: '',
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
            handleChange(value) {
                return this.$refs.cascader.currentLabels;
            },
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
                // console.log(this.puchAge)
                this.getUEContent();
                this.editData.content = this.getUEContent();
                // 一般非空判断


                if(this.editData.title == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请填写标题'
                    });
                }else if(this.editData.content == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请选添加内容'
                    });
                }else if(this.radio == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请选推送范围'
                    });
                }else if(this.puchAge.length<= '0' && this.selectedOptions.length<= '0'){
                    return this.$message({
                        type: 'warning',
                        message: '请选推送范围'
                    });
                }

                if(this.puchAge.length>=1){
                    let str = '';
                    let ageData = '';
                    for(let key of this.puchAge){
                        if(key == '0'){
                            ageData += '6-10岁,'
                        }else if(key == '1'){
                            ageData += '11-13岁,'
                        }else if(key == '2'){
                            ageData += '14岁以上,'
                        }
                        str += key+',';
                    }
                    this.editData.puchAge = str.slice(0,-1);
                    this.editData.pushValue = ageData.slice(0,-1)
                }else{
                    this.editData.puchAge = '';
                }

                if(this.selectedOptions.length>=1){
                    let valueData = '';
                    let healthValue = this.handleChange();
                    for(var i=0;i<healthValue.length;i++){
                        console.log(healthValue[i])
                        valueData += healthValue[i] + ','
                    }
                    this.editData.healthType = '126';
                    this.editData.pushValue = valueData.slice(0,-1);
                }else{
                    this.editData.healthType = '';
                }


                this.editData.content = this.getUEContent();

                console.log('editData',this.editData);

                if(number == 1){
                    if(this.id){
                        this.editData.id = this.id;
                       
                        this.editPost('/api/auth/v1/nutritionScheme/',this.id,this.editData)
                    }else{
                        this.editData.openFlag = '1';
                        this.editPost('/api/auth/v1/nutritionScheme','',this.editData)
                    }
                   
                }else{
                    this.editData.openFlag = 0;
                    if(this.id){
                        this.editData.id = this.id;
                        
                        this.editPost('/api/auth/v1/nutritionScheme/',this.id,this.editData)
                    }else{
                        this.editPost('/api/auth/v1/nutritionScheme','',this.editData)
                    }
                }
            },

            editPost(url,id,data){
                http.post(url+id,data).then(res=>{
                    if(res.status.code == 0){
                        this.$message({
                            type: 'success',
                            message: '保存成功'
                        });
                        setTimeout(()=>{
                            this.$store.commit('loading',this);
                            this.$router.push('/nutritionScheme');
                        },1000)
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
                        message: '保存失败'
                    });
                })

            },

            // 单选清空多选输入框
            radioChange(){
                if(this.radio == 1){
                    this.age = false;
                    this.health = true;
                    this.selectedOptions = [];
                }else if(this.radio == 2){
                    this.health = false;
                    this.age = true;
                    this.puchAge = [];
                }
            //    console.log('单选框',this.radio)
            },

            // 获取ueditor的html
            getUEContent() {
                return UE.getEditor(this.ue).getContent();
            },
            edit(id){
                http.get('/api/auth/v1/nutritionScheme/'+id).then(res=>{
                    if(res.status.code == '0'){
                        // console.log('44444444444444',res);
                        // content 富文本
                        this.content = res.data.content;
                        this.editData = res.data;
                     

                        if(this.editData.healthType){
                            // console.log(this.editData.healthType)
                            // this.selectedOptions = this.editData.healthType.split(',')
                            this.selectedOptions = [3, 82, 85]
                            // console.log(this.selectedOptions)
                            this.radio = '2';
                            this.age = true;
                            this.health = false;
                            this.puchAge = [];
                        }

                        if(this.editData.pushAge){
                            this.puchAge = this.editData.pushAge.split(',')
                            this.radio = '1';
                            this.age = false;
                            this.health = true;
                            this.selectedOptions = []
                        }

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
                        message: '获取内容失败'
                    });
                })
            },
            dropDownList(){
                http.get('/api/auth/v1/diseaseClassify').then(res=>{
                    if(res.status.code == 0){
                       console.log(res);
                       this.options = res.data;
                       for(let key of this.options){
                        //    console.log(key);
                           if(key.children.length>=1){
                               for(let item of key.children){
                                //    console.log('一级',item)
                                   if(item.children.length>=1){
                                       for(let keys of item.children){
                                        //    console.log('二级',keys)
                                           if(keys.children.length>=1){
                                            //    for(let items of keys.children){
                                            //        console.log('三级',items)

                                            //        if(items.children.length>=1){

                                            //        }else{
                                            //            delete items.children
                                            //        }
                                            //    }
                                           }else{
                                               delete keys.children
                                           }
                                       }
                                   }else{
                                       delete item.children
                                   }
                               }
                           }else{
                               delete key.children;
                           }
                       }

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

            this.dropDownList();

        }
    }

</script>