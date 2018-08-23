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
                <el-select v-model="articleType" placeholder="请选择文章类型">
                    <el-option
                    v-for="item in type"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select> 
                &nbsp;&nbsp;&nbsp;&nbsp;作者：
                <el-input placeholder="请输入作者" v-model="addArticleData.author" clearable class="w200"></el-input> 
            </p>
            <!-- 上传图片 -->
            <p class="clearfix">
                <span class="fl" style="margin-top:4px;">缩略图：</span>
                <el-upload
                    accept="image/*"
                    class="upload-demo w200"
                    action="http://s.file.gzhc.dev.xiaotitong.com/api/upload"
                    :on-remove="handleRemove"
                    :on-success="success"
                    :limit="1"
                    :on-error="error"
                    :http-request="request"
                    :on-exceed="handleExceed"
                    :file-list="fileList2"
                    list-type="picture">
                    <el-button size="small" type="primary" style="background:#83BDF9;color:#fff;">点击上传</el-button>
                </el-upload>
            </p>
            <!-- 推送范围 -->
            <div class="fl clearfix" style="width:970px;">
                <span class="fl" style="padding-top:8px;">推送范围：</span>   
                <span class="fl">
                    <el-checkbox-group v-model="checkedCities">
                        <el-checkbox label="个人版" @change="checked1" style="margin-bottom:100px;"></el-checkbox>
                        <el-checkbox label="学校版" @change="checked2" style="margin-bottom:30px;"></el-checkbox>
                        <el-checkbox label="abc" style="display:none;"></el-checkbox>
                    </el-checkbox-group>
                </span>
                <!-- 年龄 -->
                <p class="fl clearfix" style="width:820px;">
                    <span class="fl">
                        <el-radio v-model="radio" label="1" :disabled="self" @change="radioChange">年龄</el-radio>
                        <el-select
                            class="select"
                            style="width:260px;"
                            :disabled="age"
                            v-model="puchAge"
                            multiple
                            collapse-tags
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
                        <!-- 性别 -->
                        <span style="margin-left:22px;">
                            性别
                            <el-select
                                style="width:200px;"
                                :disabled="self"
                                v-model="sex"
                                multiple
                                filterable
                                allow-create
                                default-first-option
                                placeholder="请选推送性别">
                                <el-option
                                v-for="item in sexData"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </span><br/><br/>
                        <!-- 年级 -->
                        <span style="display:inline-block;width:700px;">
                            <el-radio v-model="radio" label="2" :disabled="self" @change="radioChange">年级</el-radio>
                            <el-select
                                style="width:260px;"
                                :disabled="classs"
                                v-model="classValue"
                                multiple
                                collapse-tags
                                filterable
                                allow-create
                                default-first-option
                                placeholder="请选推送年级">
                                <el-option
                                v-for="item in classType"
                                :key="item.id"
                                :label="item.grade"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </span>
                    </span>
                    <!-- 学校类型 -->
                    <span class="fl">
                        <el-select
                            style="width:260px;margin-top:20px;"
                            :disabled="school"
                            v-model="schoolType"
                            multiple
                            filterable
                            allow-create
                            default-first-option
                            placeholder="请选择推送学校类型">
                            <el-option
                            v-for="item in schoolTypeData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </span>
                </p>
            </div>
        </div>
        <!-- 富文本编辑器 -->
        <div>
            <p>文章内容</p><br/>
            <Ueditor :content="content" :config="config" :id="ue" ref="ue"></Ueditor><br/>
        </div>


        <!-- footer -->
        <div style="text-align:center;">
            <p>
                <el-button @click="goback" style="background:#83BDF9;color:#fff;">取消</el-button>
                <el-button @click="publicSave($event,'1',$store.state.addArticle,$store.state.updateArticle)" style="background:#83BDF9;color:#fff;">保存并公开</el-button>
                <el-button @click="saveArticle($event,'0',$store.state.addArticle,$store.state.updateArticle)" style="background:#83BDF9;color:#fff;">保存</el-button>
            </p>
        </div>
    </div>
</template>


<style src="./addarticle.scss" scoped lang="scss">
    
</style>
<script>
    import superagent from 'superagent'
    import Ueditor from './ueditor.vue'
    import http from '../../../utils/HttpClient'

    export default {
        components:{
            Ueditor
        },
        data(){
            return {
                // 年级类型
                classType: [],
                // 年级类型
                classValue: [],


                // 推送年龄
                puchAge:[],
                // 推送年级
                schoolType:[],
                // 推送性别
                sex:[],
                // 文章类型
                articleType:'',

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
                sexData:[{
                    id:0,
                    value:'0',
                    label:'男'
                },{
                    id:1,
                    value:'1',
                    label:'女'
                }],
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
                 schoolTypeData:[{
                    id:0,
                    value:'0',
                    label:'小学'
                },{
                    id:1,
                    value:'1',
                    label:'初中'
                },{
                    id:2,
                    value:'2',
                    label:'高中'
                }],
                // 参数 
                addArticleData:{
                    id:'',
                    title:'',//标题
                    author:'',//作者
                    picUrl:'',//缩略图
                    content:'',//文章内容
                    openFlag:'',//公开状态 0 不公开 1公开
                    articleType:'',//文章类型  0 营养  1 健康  2 运动 3 疾病  
                    sex:'',//推送范围条件-性别 0 男 1女     
                    schoolType:'',// 推送范围条件-学校类型 0 小学 1初中 2高中 
                    puchVersion:'',//推送范围条件-版本 0 学校版 1 个人版
                    puchAge:'',//推送范围条件-年龄  0-( 6-10岁） 1-(11-13)  2-(14岁以上)
                    gradeId:''//推送范围条件-年级 引用年级字典表 t_dict_grade
                },

                // 上传图片
                fileList2: [],
               

                // 个人版 学校版 多选
                checkedCities: ['abc'],

                // 年龄 年级单选
                radio: '',

                // 状态 
                self:true,
                school:true,
                age:true,
                classs:true,

                // 富文本
                content: '',
                config: {
                    initialFrameWidth: "100%",
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
            strForOf(output,input){
                
            },
            publicSave(event,num,addType,editType){
                console.log(addType,this.id)
                if(this.id == '' && addType == true){
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

                this.getUEContent();
                
                this.addArticleData.content = this.getUEContent();
                // // 一般非空判断
                if(this.addArticleData.title == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请填写标题'
                    });
                }else if(this.addArticleData.author == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请填写作者'
                    });
                }else if(this.articleType.toString == ''){
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


                // 推送范围非空判断
                let strs = '';
                for(let key of this.checkedCities){
                    // console.log(key);
                    if(key == '个人版'){
                        strs += '1,'
                    }else if(key == '学校版'){
                        strs += '0,';
                    }
                }
                this.addArticleData.puchVersion = strs.slice(0,-1);
                if(this.addArticleData.puchVersion.length == 0){
                    return this.$message({
                        type: 'warning',
                        message: '请选择推送范围'
                    });
                }else{
                    let arr = strs.split(',')
                    // console.log('arr',arr);
                    for(let key of arr){
                        // console.log(key);
                        if(key == '0'){
                            let length = this.schoolType.length;
                            if(length < 1){
                                return this.$message({
                                    type: 'warning',
                                    message: '请选择学校类型'
                                });
                            }
                        }else if(key == '1'){
                            let len = this.sex.length;
                            let ageLeng = this.puchAge;
                            let classLeng = this.classValue;
                            if(len < 1){
                                return this.$message({
                                    type: 'warning',
                                    message: '请选择性别'
                                });
                            }
                            // console.log(ageLeng,classLeng)
                            if(ageLeng.length <1 && classLeng.length <1){
                                return this.$message({
                                    type: 'warning',
                                    message: '请选择推送的年龄或年级'
                                });
                            }

                        }
                    }
               
                }



                // array => string
                if(this.sex.length>=1){
                    let str = '';
                    for(let key of this.sex){
                        str += key+',';
                    }
                    this.addArticleData.sex = str.slice(0,-1);
                }else{
                    this.addArticleData.sex = '';
                }

                if(this.schoolType.length>=1){
                    let str = '';
                    for(let key of this.schoolType){
                        str += key+',';
                    }
                    this.addArticleData.schoolType = str.slice(0,-1);
                }else{
                    this.addArticleData.schoolType = '';
                }

                if(this.puchAge.length>=1){
                    let str = '';
                    for(let key of this.puchAge){
                        str += key+',';
                    }
                    this.addArticleData.puchAge = str.slice(0,-1);
                }else{
                    this.addArticleData.puchAge = '';
                }

              
                // gradeId
                if(this.classValue.length<1){
                    this.addArticleData.gradeId = '';
                    // console.log(this.addArticleData.gradeId,'gradeId');
                }else{
                    let str = '';
                    for(let key of this.classValue){
                        str += key+',';
                    }
                    this.addArticleData.gradeId = str.slice(0,-1);
                }

                // console.log("fileList2",this.fileList2)
                if(this.addArticleData.picUrl == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请上传图片'
                    });
                }

                this.addArticleData.articleType = this.articleType;
                // console.log('this.addArticleData',this.articleType)
                this.addArticleData.content = this.getUEContent();
                // console.log(this.addArticleData,this.checkedCities);
                if(number == 1){
                    if(this.id){
                        if(this.addArticleData.articleType ==''|| this.addArticleData.articleType==undefined){
                            return this.$message({
                                type: 'warning',
                                message: '请选择类型'
                            });
                        }else if(this.addArticleData.articleType == '营养'){
                                this.addArticleData.articleType = '0'
                        }else if(this.addArticleData.articleType == '健康'){
                            this.addArticleData.articleType = '1'
                        }else if(this.addArticleData.articleType == '运动'){
                            this.addArticleData.articleType = '2'
                        }else if(this.addArticleData.articleType == '疾病'){
                            this.addArticleData.articleType = '3'
                        }
                        this.addArticleData.id = this.id;
                        delete this.addArticleData.createTime
                        delete this.addArticleData.updateTime
                        delete this.addArticleData.createUser
                        this.addpost('/api/auth/v1/article/',this.id,this.addArticleData)
                    }else{
                        this.addArticleData.openFlag = '1';
                        this.addpost('/api/auth/v1/article/','',this.addArticleData)
                    }
                   
                }else{
                    this.addArticleData.openFlag = 0;
                    if(this.id){
                        this.addArticleData.id = this.id;
                        if(this.addArticleData.articleType ==''|| this.addArticleData.articleType==undefined){
                            return this.$message({
                                type: 'warning',
                                message: '请选择类型'
                            });
                        }else if(this.addArticleData.articleType == '营养'){
                            this.addArticleData.articleType = '0'
                        }else if(this.addArticleData.articleType == '健康'){
                            this.addArticleData.articleType = '1'
                        }else if(this.addArticleData.articleType == '运动'){
                            this.addArticleData.articleType = '2'
                        }else if(this.addArticleData.articleType == '疾病'){
                            this.addArticleData.articleType = '3'
                        }
                        delete this.addArticleData.createTime
                        delete this.addArticleData.updateTime
                        delete this.addArticleData.createUser
                        
                        this.addpost('/api/auth/v1/article/',this.id,this.addArticleData)
                    }else{
                        this.addpost('/api/auth/v1/article/','',this.addArticleData)
                    }
                }
            },

            addpost(url,id,data){
                console.log('params',data)
                http.post(url+id,data).then(res=>{
                    if(res.status.code == '0'){
                        this.$message({
                            type: 'success',
                            message: '保存成功'
                        });
                        setTimeout(()=>{
                            this.$store.commit('loading',this);
                            this.$router.push('/article');
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

            // 个人版 条件是否可用
            checked1(){
                for(var key of this.checkedCities){
                    // console.log(key);
                    if(key == '个人版'){
                        this.self = false;
                        this.classs = true;
                        this.age = false;
                        this.radio = '1';
                    }else{
                        this.sex = [];
                        this.puchAge = [];
                        this.classValue = [];
                        this.radio = '';
                        this.self = true;
                        this.classs = true;
                        this.age = true;
                    } 
                }
            },

            // 学校版 条件是否可用
            checked2(){
                for(var key of this.checkedCities){
                    if(key == '学校版'){
                        this.school = false;
                    }else{
                        this.school = true;
                        this.schoolType = [];
                    }
                }
            },


            // 单选清空多选输入框
            radioChange(){
                // console.log(this.radio);
                if(this.radio == 1){
                    this.age = false;
                    this.classs = true;
                    this.classValue = [];
                }else if(this.radio == 2){
                    this.classs = false;
                    this.age = true;
                    this.puchAge = [];
                }
            },


            // 年级类型
            getClass(){
                http.get('/api/auth/v1/article/listDictGrade').then(res=>{
                    if(res.status.code == 0){
                        
                        this.classType = res.data;
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
                        message: '年级数据获取失败'
                    });
                })
            },

            // 上传图片成功的钩子函数
            success(response,file,fileList){
                this.$message({
                    type: 'success',
                    message: '上传文件成功'
                });
            },
            // 删除的钩子函数
            handleRemove(file, fileList) {
                this.$message({
                    type: 'success',
                    message: '删除成功'
                });
            },
           
            // 限制文件个数 
            handleExceed(files, fileList) {
                this.$message.warning(
                    `当前限制选择 1 个文件`
                );
            },
            // 上传图片失败的钩子函数
            error(){
                this.$message({
                    type: 'error',
                    message: '上传文件失败'
                });
            },

            // 自定义上传图片 
            request(content){
                let formData = new FormData;
                formData.append('file', content.file);
                // 毫秒数
                var myData = new Date(); 
                var times = myData.getTime()
                let name = content.file.name;

                if(name.endsWith('jpg')){
                    formData.append('fileName',times+'jpg');
                }else if(name.endsWith('jepg')){
                    formData.append('fileName', times+'jepg');
                }else if(name.endsWith('png')){
                    formData.append('fileName', times+'png');
                }

                // console.log('name',times)
                formData.append('dir','/img/article/thumbnail')

                // console.log('formData',formData);
                // 上传
                superagent
                .post('http://s.file.gzhc.dev.xiaotitong.com/api/upload')
                .set('Accept','application/json')
                .send(formData)
                .end((res,rep)=>{
                    // console.log(res,rep)
                    if(rep.body.status.code == '0'){
                        this.addArticleData.picUrl = rep.body.data.url;
                        this.success();
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
                        message: '上传图片失败'
                    });
                })

               
            },
           
            // 获取ueditor的html
            getUEContent() {
                return UE.getEditor(this.ue).getContent();
            },
            edit(id){
                http.get('/api/auth/v1/article/'+id).then(res=>{
                    console.log('editData',res);
                    if(res.status.code == "0"){
                        // console.log('content',res);
                        // content 富文本
                        this.content = res.data.content;
                        this.addArticleData = res.data;
                        // console.log(this.addArticleData)
                        // 缩略图片
                        this.fileList2 = [{
                            url:this.addArticleData.picUrl
                        }];


                        if(this.addArticleData.gradeId){
                            // this.classValue = this.addArticleData.gradeId.split(',')
                            let arr = this.addArticleData.gradeId.split(',')

                            for(let key of arr){
                                if(key == '0'){
                                    this.classValue.push('一年级')
                                }else if(key == '1'){
                                    this.classValue.push('二年级')
                                }else if(key == '2'){
                                    this.classValue.push('三年级')
                                }else if(key == '3'){
                                    this.classValue.push('四年级')
                                }else if(key == '4'){
                                    this.classValue.push('五年级')
                                }else if(key == '5'){
                                    this.classValue.push('六年级')
                                }else if(key == '6'){
                                    this.classValue.push('七年级')
                                }else if(key == '7'){
                                    this.classValue.push('八年级')
                                }else if(key == '8'){
                                    this.classValue.push('九年级')
                                }else if(key == '9'){
                                    this.classValue.push('高一')
                                }else if(key == '10'){
                                    this.classValue.push('高二')
                                }else if(key == '11'){
                                    this.classValue.push('高三')
                                }
                            }
                            
                            if(this.classValue[0] == ''){
                                this.classValue = [];
                            }
                            if(this.classValue.length>0){
                                this.classs = false;
                                this.radio = '2'
                                this.checkedCities.push('个人版')
                            }
                        }

                        // 推送年龄
                        if(this.addArticleData.puchAge){
                            this.puchAge = this.addArticleData.puchAge.split(',')
                            if(this.puchAge[0] == ''){
                                this.puchAge = [];
                            }
                            if(this.puchAge.length>0){
                                this.age = false;
                                this.radio = '1'
                                this.checkedCities.push('个人版')
                            }
                        }



                        // 推送性别
                        this.sex = this.addArticleData.sex.split(',')
                        // console.log(this.sex,'推送性别')
                        if(this.sex[0] == ''){
                            this.sex = [];
                        }
                        if(this.sex.length>0){
                            this.self = false;
                            
                        }

                        // 推送学校
                        this.schoolType = this.addArticleData.schoolType.split(',')
                        if(this.schoolType[0] == ''){
                            this.schoolType = [];
                        }
                        if(this.schoolType.length>0){
                            // console.log('this.schoolType',this.schoolType);
                            this.school = false;
                            this.checkedCities.push('学校版')
                        }

                        if(this.addArticleData.articleType == '0'){
                            this.articleType = '营养'
                        }else if(this.addArticleData.articleType == '1'){
                            this.articleType = '健康'
                        }else if(this.addArticleData.articleType == '2'){
                            this.articleType = '运动'
                        }else if(this.addArticleData.articleType == '3'){
                            this.articleType = '疾病'
                        }


                        // 推送版本
                        if(this.addArticleData.puchVersion){
                            // console.log(this.addArticleData.puchVersion);
                            let array = this.addArticleData.puchVersion.split(',');
                            for(let key of array){
                                if(key == 0){
                                    this.checkedCities.push('学校版')
                                }else if(key == 1){
                                    this.checkedCities.push('个人版')
                                }
                               
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
            this.getClass();
        }
    }

</script>