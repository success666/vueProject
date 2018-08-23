<template>
    <div class="rootelementa">
       
        <!-- table -->
        <el-table v-if="$store.state.listAppVersion" :data="tabledata.list" style="width:100%;text-align:center;" class="table border-radius">
            <el-table-column label="版本名" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.name == 1?'家长app' : '学校app' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="创建时间" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime?scope.row.createTime.slice(0,10):'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="平台" width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.platform == 1? 'ios' : '安卓' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="版本号" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.versionNum?scope.row.versionNum:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="安装包路径" width="150">
                <template slot-scope="scope">
                    <span>{{ scope.row.packageUrl?scope.row.packageUrl:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="描述" width="160">
                <template slot-scope="scope">
                    <span>{{ scope.row.description?scope.row.description:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button :disabled="$store.state.addAppVersion" size="mini" @click="dialogFormVisible = true" type="" style="background:#83BDF9;color:#fff;">新增</el-button>
                    <el-button :disabled="$store.state.getAppVersion" size="mini" @click="handleEdit(scope.$index, scope.row)" style="background:#83BDF9;color:#fff;">查看</el-button>
                    <el-button :disabled="$store.state.deleteAppVersion" size="mini" type="" @click="handleDelete(scope.$index, scope.row)" style="background:#83BDF9;color:#fff;">删除</el-button>
                </template>
            </el-table-column>
        </el-table>


        <!-- 新增 -->
        <el-dialog title="新增" :visible.sync="dialogFormVisible">
            <el-form :model="addData" status-icon :rules="rules2" ref="addData" label-width="100px" class="demo-ruleForm">
                <p style="display:flex;justify-content:space-around;padding-right:12px;">
                    <el-form-item label="描述：" prop="description" style="margin-right:80px;">
                        <el-input v-model="addData.description" placeholder="请输入账号" class="w200"></el-input>
                    </el-form-item>
                    <el-form-item label="版本名：" prop="1" style="margin-right:80px;">
                        <el-select v-model="namestatus" placeholder="请选择版本名" class="w200">
                            <el-option
                            v-for="item in versions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </p>

                <p style="display:flex;justify-content:space-around;padding-right:12px;">
                    <el-form-item label="版本号：" prop="versionNum" style="margin-right:80px;">
                        <el-input v-model="addData.versionNum" placeholder="请输入版本号" class="w200"></el-input>
                    </el-form-item>
                    <el-form-item label="安装包路径：" prop="packageUrl" style="margin-right:80px;">
                        <el-input v-model="addData.packageUrl" placeholder="请输入安装包路径" class="w200"></el-input>
                    </el-form-item>
                </p>
           
                <p style="padding:0px 0 10px 12px;">
                    平台：&nbsp;
                    <el-select v-model="platformstatus" placeholder="请选择平台" class="w200">
                        <el-option
                        v-for="items in platform"
                        :key="items.value"
                        :label="items.label"
                        :value="items.value">
                        </el-option>
                    </el-select> 
                </p>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('addData')">重置</el-button>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="adduser('addData')">保 存</el-button>
            </div>
            
        </el-dialog>


        <!-- 查看 -->
        <el-dialog title="查看" :visible.sync="compile">
            版本名：
            <el-input v-model="lookdata.name" :disabled="true"></el-input>
            创建时间：
            <el-input v-model="lookdata.createTime" :disabled="true"></el-input>
            平台：
            <el-input v-model="lookdata.platform" :disabled="true"></el-input>
            版本号：
            <el-input v-model="lookdata.versionNum" :disabled="true"></el-input>
            安装包路径：
            <el-input v-model="lookdata.packageUrl" :disabled="true"></el-input>
            描述：
            <el-input v-model="lookdata.description" :disabled="true"></el-input>
            创建人：
            <el-input v-model="lookdata.createUser" :disabled="true"></el-input>
            <!-- <div slot="footer" class="dialog-footer">
                <el-button @click="compile = false">取 消</el-button>
                <el-button type="primary" @click="compilesave">保 存</el-button>
            </div> -->
        </el-dialog>

        <!-- page -->
        <div v-if="$store.state.listAppVersion" class="block fr" style="padding:14px 26px;">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage4"
                :page-sizes="[8, 10, 12]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tabledata.total">
            </el-pagination>
        </div>

        <div v-if="!$store.state.listAppVersion" style="text-align:center;">没有此权限</div>
    </div>
</template>

<style src="./appVersion.scss">
</style>

<script>
    import http from './../../utils/HttpClient'
    export default {
        data(){
            var validateDescription = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('描述不能为空'));
                }
                callback();
            };
            var validateVersionNum = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('版本号不能为空'));
                }
                callback();
            };
            var validatePackageUrl = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('安装包路径不能为空'));
                }
                callback();
            };
           
            return {
                // 新增
                platformstatus:'',
                namestatus:'',
                dialogFormVisible:false,
                addData:{
                    description:'',
                    versionNum:'',
                    packageUrl:'',
                    platformstatus:'',
                    name:''
                },
                 versions:[{
                    value: '1',
                    label: '家长app'
                    }, {
                    value: '2',
                    label: '学校app'
                }],
                platform:[{
                    value: '1',
                    label: 'ios'
                    }, {
                    value: '2',
                    label: '安卓'
                }],
                rules2: {
                    description: [{ validator: validateDescription, trigger: 'blur' }],
                    versionNum:[{ validator: validateVersionNum, trigger: 'blur' }],
                    packageUrl:[{ validator: validatePackageUrl, trigger: 'blur' }],
                },

                // 查看 
                compile:false,
                lookdata:{},
             
                // table列表 
                tabledata:[],

                //分页
                currentPage4: 1,
                page:{
                    pageNum:1,
                    pageSize:8
                }
            }
            
        },
        methods:{
            // 信息弹窗
            open(test) {
                this.$message.warning(test);
            },
            erroropen(test) {
                this.$message.error(test);
            },


            //新增
            adduser(formName){
                this.$refs[formName].validate((valid) => {
                    // console.log(this.platformstatus,this.name);
                    if(this.platformstatus == ''){
                        return this.open('请选择平台')
                    }else if(this.namestatus == ''){
                        return this.open('请选择版本名')
                    }else{
                        this.addData.platform = this.platformstatus;
                        this.addData.name = this.namestatus;
                        if (valid) {
                            http.post('/api/auth/v1/appVersion',this.addData).then(res=>{
                                if(res.status.code == 0){
                                    // console.log(res);
                                    this.dialogFormVisible = false
                                    let obj = {
                                        self:this,
                                        type:'success',
                                        text:'保存成功'
                                    }
                                    this.$store.commit('openSuccess',obj);
                                    setTimeout(()=>{
                                        this.$store.commit('loading',this);
                                        this.getTableData();
                                        this.$refs[formName].resetFields();
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
                                this.erroropen('新增失败');
                            })
                        }
                    }
                });
            },  
            // 重置  
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },


            // 查看 
            handleEdit(index, row) {
                this.compile = true;
                http.get('/api/auth/v1/appVersion/'+row.id).then(res=>{
                    if(res.status.code == '0'){
                        // console.log('查看',res);
                        this.lookdata = res.data;
                        if(res.data.platform == 1){
                            this.lookdata.platform = 'ios'
                        }else if(res.data.platform == 2){
                            this.lookdata.platform = '安卓'
                        }

                        if(res.data.name == 1){
                            this.lookdata.name = '家长app'
                        }else if(res.data.name == 2){
                            this.lookdata.name = '学校app'
                        }
                        this.lookdata.createTime = this.lookdata.createTime.slice(0,10);
                        
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
                    this.erroropen('获取数据失败');
                })
              
            },
          


            // 删除
            handleDelete(index, row) {
                // console.log(index,row);
                this.$confirm('删除后账号无法恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    http.delete(`/api/auth/v1/appVersion/${row.id}`).then(res=>{
                        // console.log(res,'删除成功');
                        if(res.body.status.code == '0'){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            setTimeout(()=>{
                                this.$store.commit('loading',this);
                                this.getTableData();
                            },1000);
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
                        this.erroropen('删除失败');
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });                
            },


            // 每页数量
            handleSizeChange(val) {
                this.page.pageSize = val
                http.get('/api/auth/v1/appVersion',this.page).then(data=>{
                    if(data.status.code === 0){
                        this.tabledata = data.data
                    }else if(data.status.code == '2010001'){
                        this.$message({
                            type: 'error',
                            message: 'token失效请重新登录'
                        });
                        this.$router.push({name: 'login'});
                    }else{
                        this.$message({
                            type: 'error',
                            message: data.status.msg
                        });
                    }
                }).catch(error => {
                    this.erroropen('获取数据失败');
                });
            },

            // go to pageNum
            handleCurrentChange(val) {
                this.page.pageNum = val
                http.get('/api/auth/v1/appVersion',this.page).then(data=>{
                    if(data.status.code === 0){
                        // console.log(data.data);
                        this.tabledata = data.data
                    }else if(data.status.code == '2010001'){
                        this.$message({
                            type: 'error',
                            message: 'token失效请重新登录'
                        });
                        this.$router.push({name: 'login'});
                    }else{
                        this.$message({
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
                http.get('/api/auth/v1/appVersion',this.page).then(data=>{
                    if(data.status.code === 0){
                        // console.log(data.data.list);
                        this.tabledata = data.data
                    }else if(data.status.code == '2010001'){
                        this.$message({
                            type: 'error',
                            message: 'token失效请重新登录'
                        });
                        this.$router.push({name: 'login'});
                    }else{
                        this.$message({
                            type: 'error',
                            message: data.status.msg
                        });
                    }
                }).catch(error => {
                    this.erroropen('获取数据失败');
                });
            },
        },
        mounted(){
            this.getTableData();
        }
          
    }
</script>