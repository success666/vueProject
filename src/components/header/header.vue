<template>
    <div>
        <div  class="clearfix">
            <div class="fr header">
                <!-- header -->
                <h2 class="fl font20">健康促进中心个人APP管理后台</h2>
                <el-dropdown :hide-on-click="false" class="fr">
                    <span class="el-dropdown-link">
                        <img src="./../../assets/imgs/user_icon.png" alt="">
                        <span>{{userName}}</span>
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <el-button type="text" @click="dialogFormVisible = true">修改密码</el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <span @click="logout()">退出登录</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                
                <!-- 修改密码 -->
                <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
                    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="原密码" prop="oldpassword">
                            <el-input v-model.number="ruleForm2.oldpassword" type="password"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" prop="pass">
                            <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="checkPass">
                            <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="resetForm('ruleForm2')">重置</el-button>
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button :disabled="$store.state.updatePassword" type="primary" @click="changePassword('ruleForm2')">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
        <div style="height:30px;padding:8px 8px;">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <span v-show="!pathStatus">首页</span>
                <el-breadcrumb-item v-show="pathStatus">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-show="pathStatus">{{this.nav}}</el-breadcrumb-item>
                <el-breadcrumb-item v-show="pathStatus" v-if="pathName">{{this.pathName}}</el-breadcrumb-item>
                <el-breadcrumb-item v-if="editStatus">{{this.edit}}</el-breadcrumb-item>  
            </el-breadcrumb>
        </div>
    </div>
</template>
<style src="./header.scss" scoped lang="scss"></style>

<script>
    import http from './../../utils/HttpClient'
    export default {
        data(){

            // 修改密码
            let regExp=/^(?!^\d*$)(?!^[a-zA-Z]*$)(?!^[-_*+@]*$)[-\d\w*+@]{6,16}$/;
            var checkAge = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('原密码不能为空'));
                }
                callback();
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else if(value!='' && !regExp.test(value)){
                    callback(new Error('字母、数字、特殊字符任意两种或以上组合, 6-16位'));
                }else {
                    if (this.ruleForm2.checkPass !== '') {
                        this.$refs.ruleForm2.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if(value!='' && !regExp.test(value)){
                    callback(new Error('字母、数字、特殊字符任意两种或以上组合, 6-16位'));
                }else if (value !== this.ruleForm2.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            
            return {
                // 当前用户信息
                userName:'',

                // 修改密码
                dialogFormVisible: false,
                ruleForm2: {
                    pass: '',
                    checkPass: '',
                    oldpassword: ''
                },
                rules2: {
                    pass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    oldpassword: [
                        { validator: checkAge, trigger: 'blur' }
                    ]
                },

                // 导航
                breadlist: '',
                nav:'',
                pathName:'',
                edit:'',
                pathStatus:false,
                editStatus:false
            }
        },
        methods:{

            // 消息提示
            open(test) {
                this.$message.warning(test);
            },
            successopen(){
                this.$message.success('修改密码成功');
            },

            // 退出登录
            logout(){
                http.get('/api/auth/v1/logout').then((res) => {
                    if(res.status.code == '0'){
                        console.log('退出登录',res)
                        localStorage.clear();
                        sessionStorage.clear();
                        this.$message.success('成功退出');

                        this.$router.push({path: '/login'});

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
                    this.open('不能正常退出登录')
                })
            },


            // 修改密码（重置）
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },


            // 修改密码
            changePassword(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.ruleForm2.pass === this.ruleForm2.checkPass){
                            let changepad = {
                                oldPassword:String(this.ruleForm2.oldpassword),
                                newPassword:this.ruleForm2.pass
                            }
                            // console.log(changepad);
                            http.post('/api/auth/v1/user/updatePersonPassword',changepad).then(res=>{
                                if(res.status.code==500){
                                    // console.log(res);
                                    this.open(res.status.msg);
                                }else if(res.status.code==0){
                                    this.successopen()
                                    localStorage.clear();
                                    sessionStorage.clear();
                                    this.$router.push({path: '/login'});
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
                            }).catch(err => {
                                this.open('不能正常修改密码');
                            });
                        }
                        this.dialogFormVisible = false

                    } else {
                        // console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 导航 
            getBread(){
                this.breadlist = this.$route.matched;
                this.$route.matched.forEach((item,index)=>{
                    //先判断父级路由是否是空字符串或者meta是否为首页，直接复写路径到根路径
                    // item.meta.CName === '首页' ? item.path = '/' : this.$route.path === item.path;
                    // console.log('breadlist',this.breadlist)
                    // console.log(this.breadlist);
                    var paths;
                    if(this.breadlist[1] != undefined){
                        this.pathStatus = true;
                        paths = this.breadlist[1].path;
                        // console.log('paths',paths)
                    }else{
                        this.pathStatus = false;
                    }

                    if(paths == '/pagehome'){
                       this.pathStatus = false;
                    }else if(paths== '/appVersion'){
                        this.nav = '系统设置'
                        this.pathName = 'app版本号管理'
                        this.editStatus = false
                    }else if(paths == '/user'){
                        this.nav = '账号管理'
                        this.pathName = '用户管理'
                        this.editStatus = false
                    }else if(paths == '/role'){
                        this.nav = '账号管理'
                        this.pathName = '角色管理'
                        this.editStatus = false
                    }else if(paths == '/article'){
                        this.nav = '文章管理'
                        this.pathName = null
                        this.editStatus = false
                    }else if(paths == '/article/addarticle'){
                        this.nav = '文章管理'
                        this.pathName = '（编辑/新增) 文章'
                        this.editStatus = false
                    }else if(paths == '/article/articlelook'){
                        this.nav = '文章管理'
                        this.pathName = '文章详情'
                        this.editStatus = false
                    }else if(paths == '/diseasesHistory'){
                        this.nav = '体质体检管理'
                        this.pathName = '学生关系疾病史'
                        this.editStatus = false
                    }else if(paths == '/problemBase'){
                        this.nav = '咨询管理'
                        this.pathName = '问题库'  
                        this.editStatus = false
                    }else if(paths == '/problemBase/problemBaseLook'){  
                        this.nav = '咨询管理'
                        this.pathName = '问题库'  
                        this.editStatus = true
                        this.edit = '问题库详情'
                    }else if(paths == '/problemBase/editProblemBase'){ 
                        this.nav = '咨询管理'
                        this.pathName = '问题库'  
                        this.editStatus = true
                        this.edit = '(新增/编辑)问题'
                    }else if(paths == '/diseaseScheme'){
                        this.nav = '专家方案管理'
                        this.pathName = '疾病管理方案'
                        this.editStatus = false
                    }else if(paths == '/diseaseScheme/editDiseaseScheme'){ 
                        this.nav = '专家方案管理'
                        this.pathName = '疾病管理方案'
                        this.editStatus = true
                        this.edit = '(新增/编辑)疾病方案'
                    }else if(paths == '/diseaseScheme/diseaseSchemeLook'){ 
                        this.nav = '专家方案管理'
                        this.pathName = '疾病管理方案'
                        this.editStatus = true
                        this.edit = '疾病方案详情'
                    }else if(paths == '/issuesManagement'){
                        this.nav = '咨询管理'
                        this.pathName = '提问管理'
                        this.editStatus = false
                    }else if(paths == '/issuesManagement/issuesManagementLook'){
                        this.nav = '咨询管理'
                        this.pathName = '提问管理'
                        this.editStatus = true
                        this.edit = '提问详情'
                    }else if(paths == '/nutritionScheme'){
                        this.nav = '专家方案管理'
                        this.pathName = '营养方案管理'
                        this.editStatus = false
                    }else if(paths == '/nutritionScheme/editNutritionScheme'){
                        this.nav = '专家方案管理'
                        this.pathName = '营养方案管理'
                        this.editStatus = true
                        this.edit = '(新增/编辑)营养方案'
                    }else if(paths == '/nutritionScheme/nutritionSchemeLook'){
                        this.nav = '专家方案管理'
                        this.pathName = '营养方案管理'
                        this.editStatus = true
                        this.edit = '营养方案详情'
                    }else if(paths == '/appUser'){
                        this.nav = 'AAP用户管理'
                        this.pathName = 'AAP用户管理'
                        this.editStatus = false
                    }else if(paths == '/onlineStatistics'){
                        this.nav = 'AAP用户管理'
                        this.pathName = '在线统计'
                        this.editStatus = false
                    }else if(paths == '/movingManagement'){
                        this.nav = '专家方案管理'
                        this.pathName = '运动点方案'
                        this.editStatus = false
                    }else if(paths == '/movingManagement/editMovingManagement'){
                        this.nav = '专家方案管理'
                        this.pathName = '运动点方案'
                        this.editStatus = true
                        this.edit = '(新增/编辑)运动点'
                    }else if(paths == '/motionFeedbackStatistics'){
                        this.nav = 'AAP用户管理'
                        this.pathName = '运动记录统计'
                        this.editStatus = false
                    }else if(paths == '/motionUpdateStatistics'){
                        this.nav = 'AAP用户管理'
                        this.pathName = '运动方案更新统计'
                        this.editStatus = false
                    }
                });
            }
        },

        mounted(){
            // 当前用户init
            const user = JSON.parse(window.localStorage.getItem('ydl_user'));
            this.userName = user.username;
        },

        // updated(){
        //     // console.log(location.href);
        // },

        // destroyed(){
        //     // console.log(location.href);
        // },
        
        created(){
            this.getBread();
        },
        watch:{
            $route(){
                this.getBread();
            }
        },
    }

</script>

