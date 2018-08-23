<template>
    <div class="rootelementa">
        <!-- search -->
        <div v-if="$store.state.listUser" class="search">
            账号/手机号/使用人:
            <el-input placeholder="请输入内容" v-model="searchvalue" clearable style="width:180px;"></el-input> 
            角色:
            <el-select v-model="rolevalue" placeholder="请选择角色" style="width:160px;">
                <el-option
                v-for="item in userroledata"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
            状态:
            <el-select v-model="statusvalue" placeholder="请选择状态" style="width:120px;">
                <el-option
                v-for="items in status"
                :key="items.value"
                :label="items.label"
                :value="items.value">
                </el-option>
            </el-select>
            <el-button type="" style="background:#83BDF9;color:#fff;margin-left:12px;" @click="usersearch">查询</el-button>
            <el-button type="" style="background:#83BDF9;color:#fff;" @click="dialogFormVisible = true" :disabled="$store.state.addUser">新增</el-button>
        </div>

        <!-- 新增 -->
        <el-dialog title="新增用户" :visible.sync="dialogFormVisible">
            <el-form :model="adduserdata" status-icon :rules="rules2" ref="adduserdata" label-width="100px" class="demo-ruleForm">
            <p style="display:flex;justify-content:space-around;padding-right:34px;padding-left:16px;">
                <el-form-item label="账号：" prop="account" style="margin-right:80px;">
                    <el-input v-model="adduserdata.account" placeholder="请输入账号" class="w200"></el-input>
                </el-form-item>
                <el-form-item label="角色：" prop="1" style="margin-right:80px;">
                    <el-select v-model="uservalue" placeholder="请选择角色" class="w200">
                        <el-option
                        v-for="item in rolesarray"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </p>
            <p style="display:flex;justify-content:space-around;padding-right:34px;padding-left:16px;">
                <el-form-item label="使用人：" prop="username" style="margin-right:80px;">
                    <el-input v-model="adduserdata.username" placeholder="请输入使用人" class="w200"></el-input>
                </el-form-item>
                <el-form-item label="联系号码：" prop="phoneNo" style="margin-right:80px;">
                    <el-input v-model="adduserdata.phoneNo" placeholder="请输入联系号码" class="w200"></el-input>
                </el-form-item>
            </p>
            <p style="display:flex;justify-content:space-around;padding-right:34px;padding-left:16px;">
                <el-form-item label="邮箱：" prop="emailAddress" style="margin-right:80px;">
                    <el-input v-model="adduserdata.emailAddress" placeholder="请输入邮箱" class="w200"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="password" style="margin-right:80px;">
                    <el-input v-model="adduserdata.password" placeholder="请输入密码" class="w200" type="password"></el-input>
                </el-form-item>
            </p>
            
            <p style="padding:0px 0 10px 0px;padding-left:4px;">
                状态：&nbsp;&nbsp;
                <el-select v-model="addstatus" prop="status" placeholder="请选择状态" class="w200">
                    <el-option
                    v-for="items in status"
                    :key="items.value"
                    :label="items.label"
                    :value="items.value">
                    </el-option>
                </el-select> 
            </p>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button style="background:#83BDF9;color:#fff;" @click="resetForm('adduserdata')">重置</el-button>
                <el-button style="background:#83BDF9;color:#fff;" @click="dialogFormVisible = false">取 消</el-button>
                <el-button style="background:#83BDF9;color:#fff;" type="" @click="adduser('adduserdata')">保 存</el-button>
            </div>
        </el-dialog>

        <!-- table -->
        <el-table v-if="$store.state.listUser" :data="tabledata.list" style="width:100%;text-align:center;" class="border-radius">
            <el-table-column label="账号" width="140">
                <template slot-scope="scope">
                    <span>{{ scope.row.account?scope.row.account:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="角色" width="160">
                <template slot-scope="scope">
                    <span>{{ scope.row.roleId =='0' ? '超级管理员' : scope.row.roleName }}</span>
                </template>
            </el-table-column>

            <el-table-column label="使用人" width="160">
                <template slot-scope="scope">
                    <span>{{ scope.row.username?scope.row.username:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="联系号码" width="160">
                <template slot-scope="scope">
                    <span>{{ scope.row.phoneNo?scope.row.phoneNo:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="状态" width="60">
                <template slot-scope="scope">
                    <span>{{ scope.row.status == 1? '启用':'禁用' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button :disabled="$store.state.getUser" size="mini" style="background:#83BDF9;color:#fff;" @click="handleEdit(scope.$index, scope.row)">查看/编辑</el-button>
                    <el-button :disabled="$store.state.resetPassword" size="mini" style="background:#83BDF9;color:#fff;" @click="resetpasswor(scope.$index, scope.row)">重置密码</el-button>
                    <el-button :disabled="$store.state.deleteUser" size="mini" style="background:#83BDF9;color:#fff;" type="" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 查看/编辑 -->
        <el-dialog title="查看/编辑" :visible.sync="compile" style="line-height:30px;">
            创建时间：
            <el-input v-model="compiledata.createTime" clearable  disabled></el-input>
            更新时间：
            <el-input v-model="compiledata.updateTime" clearable  disabled></el-input>
            创建人：
            <el-input v-model="compiledata.createUser" clearable  disabled></el-input>
            密码：
            <el-input v-model="compiledata.password" clearable  disabled></el-input>
            邮箱地址：
            <el-input v-model="compiledata.emailAddress" clearable  disabled></el-input>
            删除状态：
            <el-input v-model="compiledata.delFlag" clearable  disabled></el-input>
            角色名称：
            <el-input v-model="compiledata.roleName" clearable  disabled></el-input>
            手机号:
            <el-input v-model="compiledata.phoneNo" clearable ></el-input>
            角色ID：
            <el-input v-model="compiledata.roleId" clearable ></el-input>
            账户：
            <el-input v-model="compiledata.account" clearable ></el-input>
            中文名称：
            <el-input v-model="compiledata.username" clearable ></el-input>
            账户状态：<br/>
            <el-select v-model="compiledata.status" prop="1" placeholder="请选择状态" style="width:200px;">
                <el-option
                v-for="items in userStatus"
                :key="items.value"
                :label="items.label"
                :value="items.value">
                </el-option>
            </el-select> 
            <div slot="footer" class="dialog-footer">
                <el-button @click="compile = false" style="background:#83BDF9;color:#fff;">取 消</el-button>
                <el-button type="" style="background:#83BDF9;color:#fff;" @click="compilesave" :disabled="$store.state.updateUser">保 存</el-button>
            </div>
        </el-dialog>

        <!-- page -->
        <div v-if="$store.state.listUser" class="block fr" style="padding:14px 26px;">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage4"
                :page-sizes="[6, 7 , 9]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tabledata.total">
            </el-pagination>
        </div>

        <div v-if="!$store.state.listUser" style="text-align:center;">没有此权限</div>
    </div>
</template>

<style src="./user.scss">

</style>

<script>
    import http from './../../utils/HttpClient'
    export default {
        data(){
            var validateAccount = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('账号不能为空'));
                }
                callback();
            };
            // var validateRoleId = (rule, value, callback) => {
            //     if (!value) {
            //         return callback(new Error('角色不能为空'));
            //     }
            //     callback();
            // };
            var validateUsername = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('使用人不能为空'));
                }
                callback();
            };
            var validateNumber = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('联系号码不能为空'));
                }else if(!(/^1[34578]\d{9}$/.test(value))){
                    return callback(new Error('联系号码格式有误'));
                }
                callback();
            };
            var validateStatus = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('状态不能为空'));
                }
                callback();
            };
            // var validateEmail = (rule, value, callback) => {
            //     if(value && !(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value))){
            //         return callback(new Error('邮箱格式有误'));
            //     }
            //     callback();
            // };
            var validatePassword = (rule, value, callback) => {
                let regExp=/^(?!^\d*$)(?!^[a-zA-Z]*$)(?!^[-_*+@]*$)[-\d\w*+@]{6,16}$/;
                if (!value) {
                    return callback(new Error('密码不能为空'));
                }else if(!regExp.test(value)){
                    return callback(new Error('字母、数字、特殊字符任意两种或以上组合, 6-16位'));
                }
                callback();
            };
            return {
                // 新增
                rolesarray:[],
                dialogFormVisible:false,
                addstatus:'',
                adduserdata:{
                    account:'',
                    roleId:'',
                    username:'',
                    password:'',
                    status:'',
                    phoneNo:'',
                    emailAddress:''
                },
                rules2: {
                    account: [{ validator: validateAccount, trigger: 'blur' }],
                    status:[{ validator: validateStatus, trigger: 'blur' }],
                    // role:[{ validator: validateRoleId, trigger: 'blur' }],
                    username:[{ validator: validateUsername, trigger: 'blur' }],
                    phoneNo:[{ validator: validateNumber, trigger: 'blur' }],
                    // emailAddress:[{ validator: validateEmail, trigger: 'blur' }],
                    password:[{ validator: validatePassword, trigger: 'blur' }],
                },

                // 编辑
                compile:false,
                ID:'',
                compiledata:{},
                userStatus:[{
                    value: '1',
                    label: '启用'
                    }, {
                    value: '0',
                    label: '停用'
                }],
             
                
                value: '',
                uservalue:'',

                searchvalue:'',
                status:[{
                    value:'',
                    label:'请选择状态'
                },{
                    value: '1',
                    label: '启用'
                    }, {
                    value: '0',
                    label: '禁用'
                }],
                rolevalue:'',
                statusvalue:'',

                tabledata:[],


                userroledata:[],


                currentPage4: 1,
                page:{
                    // 当前页
                    pageNum:1,
                    // 每页数量
                    pageSize:6
                }
            }
            
        },
        methods:{
            // 查询
            usersearch(){
                this.page = {
                    condition:this.searchvalue,
                    roleId:this.rolevalue,
                    status:this.statusvalue,
                    pageNum:this.page.pageNum,
                    pageSize:this.page.pageSize
                }
                http.get('/api/auth/v1/user/list',this.page).then(data=>{
                    if(data.status.code === 0){
                        this.tabledata = data.data

                    }else if(data.status.code == '2010001'){
                        this.$message({
                            type: 'warning',
                            message: 'token失效请重新登录'
                        });
                        this.$router.push({name: 'login'});
                    }else{
                        return this.$message({
                            type: 'error',
                            message: data.status.msg
                        });
                    }
                }).catch(error => {
                    console.log(error)
                });
            },


            // 新增用户可选角色
            adduserroles() {
                http.get('/api/auth/v1/user/roles').then(res=>{
                    if(res.status.code == 0){
                        this.rolesarray = res.data;
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
                    this.erroropen('可选角色获取失败');
                })
            },

            open(test) {
                this.$message.warning(test);
            },
            erroropen(test) {
                this.$message.error(test);
            },

            //新增
            adduser(formName){
                this.adduserdata.status = this.addstatus
                this.adduserdata.roleId = this.uservalue;
                console.log(this.adduserdata);
                if(this.adduserdata.emailAddress != '' && !(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(this.adduserdata.emailAddress))){
                    this.erroropen('邮箱格式有误');
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.adduserdata.status == ''){
                            this.open('请选择状态');
                        }else if(this.adduserdata.roleId == ''){
                            this.open('请选择角色');
                        }else{
                            http.post('/api/auth/v1/user',this.adduserdata).then(res=>{
                                console.log(res);
                                if(res.status.code == 0){
                                    this.dialogFormVisible = false
                                    let obj = {
                                        self:this,
                                        type:'success',
                                        text:'编辑成功'
                                    }
                                    this.$store.commit('openSuccess',obj);
                                    setTimeout(()=>{
                                        this.$store.commit('loading',this);
                                        this.getTableData();
                                    },1000);
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
                                this.erroropen('新增用户失败或该用户已存在');
                            })
                        }
                    } else {
                        return false;
                    }
                });
            },    
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },



            // 查看/编辑
            handleEdit(index, row) {
                this.compile = true;
                this.ID = row.id;
                http.get('/api/auth/v1/user/'+row.id).then(res=>{
                    if(res.status.code == '0'){
                        this.compiledata = res.data;
                        if(this.compiledata.delFlag == 0){
                            this.compiledata.delFlag = '否';
                        }else if(this.compiledata.delFlag == 1){
                            this.compiledata.delFlag = '是';
                        }

                        if(this.compiledata.status == 1){
                            this.compiledata.status = '启用';
                        }else if(this.compiledata.status == 0){
                            this.compiledata.status = '停用';
                        }
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
            // 保存编辑
            compilesave(){
                // console.log(this.ID);
                if(this.compiledata.phoneNo !=''){
                    // console.log(this.compiledata.phoneNo);
                    if(!(/^1[34578]\d{9}$/.test(this.compiledata.phoneNo))){
                        return this.$message({
                            type: 'warning',
                            message: '手机号码格式有误'
                        })
                    }
                }
                if(this.compiledata.account==''||this.compiledata.roleId==''&&this.compiledata.roleId!=0||this.compiledata.username==''||this.compiledata.phoneNo==''){
                    this.$message({
                        type: 'warning',
                        message: '请求把数据填写完整'
                    })
                }else{
                    // console.log(this.compiledata.status);
                    if(this.compiledata.status == '停用'){
                        this.compiledata.status = 0;
                    }else if(this.compiledata.status == '启用'){
                        this.compiledata.status = 1;
                    }

                    let obj = {
                        account:this.compiledata.account,
                        roleId:this.compiledata.roleId,
                        username:this.compiledata.username,
                        phoneNo:this.compiledata.phoneNo,
                        status:this.compiledata.status,
                        id:this.ID
                    }
                    // console.log(obj)
                    http.post('/api/auth/v1/user/'+this.ID,obj).then(res=>{
                        if(res.status.code==0){
                            console.log('res',res);
                            this.compile = false;
                            let obj = {
                                self:this,
                                type:'success',
                                text:'编辑成功'
                            }
                            this.$store.commit('openSuccess',obj);
                            setTimeout(()=>{
                                this.$store.commit('loading',this);
                                this.getTableData();
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
                        let obj = {
                            self:this,
                            type:'error',
                            text:'编辑失败'
                        }
                        this.$store.commit('openSuccess',obj);
                    })
                }
            },



            // 删除
            handleDelete(index, row) {
                this.$confirm('删除后账号无法恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    http.get(`/api/auth/v1/user/${row.id}`).then(res=>{
                        console.log(res,'删除成功');
                        if(res.status.code == 0){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.$store.commit('loading',this);
                            this.getTableData();
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
                        return this.$message({
                            type: 'error',
                            message: '删除失败'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });                
            },



            // 重置密码
            resetpasswor(index,row){
                // console.log(index,row);
                this.$confirm('重置后密码将变成aaa111', '提示', {
                    confirmButtonText: '重置',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    http.post('/api/auth/v1/user/resetPassword',{userId:row.id}).then(res=>{
                        console.log(res);
                        if(res.status.code == 0){
                            this.$message({
                                type: 'success',
                                message: '重置成功!'
                            });
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
                            message: '重置失败'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消重置'
                    });          
                });        
            },




            // 每页数量
            handleSizeChange(val) {
                this.page.pageSize = val
                http.get('/api/auth/v1/user/list',this.page).then(data=>{
                    if(data.status.code === 0){
                        console.log(data.data);
                        this.tabledata = data.data
                    }else if(data.status.code == '2010001'){
                        this.$message({
                            type: 'warning',
                            message: 'token失效请重新登录'
                        });
                        this.$router.push({name: 'login'});
                    }else{
                        return this.$message({
                            type: 'error',
                            message: data.status.msg
                        });
                    }
                }).catch(error => {
                    return this.$message({
                        type: 'error',
                        message: '获取数据失败'
                    });
                });
            },
            // go to pageNum
            handleCurrentChange(val) {
                this.page.pageNum = val
                http.get('/api/auth/v1/user/list',this.page).then(data=>{
                    if(data.status.code === 0){
                        console.log(data.data);
                        this.tabledata = data.data
                    }else if(data.status.code == '2010001'){
                        this.$message({
                            type: 'warning',
                            message: 'token失效请重新登录'
                        });
                        this.$router.push({name: 'login'});
                    }else{
                        return this.$message({
                            type: 'error',
                            message: data.status.msg
                        });
                    }
                }).catch(error => {
                    this.erroropen('获取数据失败');
                });
            },



            // table数据
            getTableData(){
                http.get('/api/auth/v1/user/list',this.page).then(data=>{
                    if(data.status.code === 0){
                        // console.log('table数据',data.data);
                        this.tabledata = data.data
                    }else if(data.status.code == '2010001'){
                        this.$message({
                            type: 'warning',
                            message: 'token失效请重新登录'
                        });
                        this.$router.push({name: 'login'});
                    }else{
                        return this.$message({
                            type: 'error',
                            message: data.status.msg
                        });
                    }
                }).catch(error => {
                    this.erroropen('获取数据失败');
                });
            },


            //角色列表
            getRoleData(){
                http.get('/api/auth/v1/user/roles',this.page).then(roledata=>{
                    if(roledata.status.code == 0){
                        this.userroledata = roledata.data
                        this.userroledata.unshift({
                            id:'',
                            name:'全部'
                        })
                    }else if(roledata.status.code == '2010001'){
                        this.$message({
                            type: 'warning',
                            message: 'token失效请重新登录'
                        });
                        this.$router.push({name: 'login'});
                    }else{
                        return this.$message({
                            type: 'error',
                            message: roledata.status.msg
                        });
                    }
                }).catch(error => {
                    this.erroropen('角色列表数据获取失败');
                });
            }
        },
        mounted(){
            // this.$store.commit('loading',this);
            this.getTableData();
            this.getRoleData();
            this.adduserroles();
        }
          
    }
</script>