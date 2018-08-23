<template>

    <div ref="history" class="history">
        <!-- search -->
        <div v-if="$store.state.listAppLoginLog" class="search">
            <ul class="clearfix titleul">
                <li>
                    在线日期:
                    <el-date-picker
                        style="width:140px;"
                        v-model="valueData"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </li>
                <li>
                    手机号:
                    <el-input placeholder="请输入手机号" v-model.trim="number" clearable style="width:140px;"></el-input> 
                </li>
                <li>
                    用户身份:
                    <el-select v-model="userStatus" placeholder="请选择用户身份" style="width:90px;">
                        <el-option
                            v-for="item in userIdentity"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    学校:
                    <el-input placeholder="请输入学校" v-model.trim="schoolName" clearable style="width:150px;"></el-input>
                </li>
                <li>
                    区：
                    <el-select v-model="eareValue" placeholder="请选择区" style="width:120px;">
                        <el-option
                        v-for="item in eare"
                        :key="item.id"
                        :label="item.dataName"
                        :value="item.dataCode">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    班级:
                    <el-input placeholder="请输入班级" v-model.trim="className" clearable style="width:140px;"></el-input>
                </li>
                <li>
                    学生身份信息:
                    <el-input placeholder="请输入学生姓名" v-model.trim="identityNumber" clearable style="width:180px;"></el-input> 
                </li>
                <li>
                    学生姓名:
                    <el-input placeholder="请输入学生姓名" v-model.trim="studentName" clearable style="width:150px;"></el-input>
                </li>
                <li>
                    <el-button :disabled="!$store.state.listAppLoginLog" type="" @click="search" style="margin-left:14px;background:#83BDF9;color:#fff;">查询</el-button>
                </li>
                <li>
                    <el-button :disabled="$store.state.appLoginLogExport" type="" style="margin-left:14px;background:#83BDF9;color:#fff;" @click="down">导出Excel</el-button>
                </li>
            </ul>               
        </div>


        <!-- table -->
        <el-table v-if="$store.state.listAppLoginLog" :data="tabledata.list" style="width:100%;text-align:center;" class="border-radius">

            <el-table-column label="在线日期">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime?scope.row.createTime.slice(0,10):'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="手机号">
                <template slot-scope="scope">
                    <span>{{ scope.row.phoneNo?scope.row.phoneNo:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="用户身份">
                <template slot-scope="scope">
                    <span>{{ scope.row.identityType?scope.row.identityType:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="区">
                <template slot-scope="scope">
                    <span>{{ scope.row.dataName?scope.row.dataName:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="学校">
                <template slot-scope="scope">
                    <span>{{ scope.row.schoolName?scope.row.schoolName:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="班级">
                <template slot-scope="scope">
                    <span>{{ scope.row.classTitle?scope.row.classTitle:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="学生身份信息">
                <template slot-scope="scope">
                    <span>{{ scope.row.identityNumber?scope.row.identityNumber:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="学生姓名">
                <template slot-scope="scope">
                    <span>{{ scope.row.studentName?scope.row.studentName:'---' }}</span>
                </template>
            </el-table-column>
          
        </el-table>


       <!-- page -->
        <div v-if="$store.state.listAppLoginLog" class="block fr" style="padding:14px 26px;">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage4"
                :page-sizes="[6, 7, 8]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tabledata.total">
            </el-pagination>
        </div>

        <div v-if="!$store.state.listAppLoginLog" style="text-align:center">没有此权限</div>

    </div>
</template>
<style src="./onlineStatistics.scss">
        
</style>

<script>
    import http from '../../utils/HttpClient'
    export default {
         data(){
            return {
                valueData: '',
                number:'',
                userStatus:'',
                eareValue:'',
                schoolName:'',
                className:'',
                identityNumber:'',
                studentName:'',
                
                userIdentity:[{
                    id:'',
                    name:'全部'
                },{
                    id:'0',
                    name:'家长'
                },{
                    id:'1',
                    name:'本人'
                }],


                eare:[],
                tabledata: [],
                // page  .........................
                currentPage4: 1,
                page:{
                    pageNum:1,
                    pageSize:6
                },
             }
        },
        methods:{
            identityType(list){
                // console.log('list',list)
                for(let key of list){
                    if(key.identityType == 0){
                        key.identityType = '家长';
                    }else if(key.identityType == 1){
                        key.identityTyp = '学生';
                    }
                }
            },
            search(){

                let params = {
                    phoneNo:this.number,
                    studentName:this.studentName,
                    identityNumber:this.identityNumber,
                    schoolName:this.schoolName,
                    classTitle:this.className,
                    createTime:this.valueData,
                    identityType:this.userStatus,
                    dataCode:this.eareValue,
                    pageNum:1,
                    pageSize:6
                }

                // console.log(params);
                http.get('/api/auth/v1/appLoginLog',params).then(res=>{
                    if(res.status.code == '0'){
                        this.tabledata = res.data;
                        this.identityType(this.tabledata.list)
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
                    return this.$message({
                        type: 'error',
                        message: '获取数据失败'
                    });
                    
                })
            },
             // 每页数量               
            handleSizeChange(val) {
                this.page.pageSize = val
                http.get('/api/auth/v1/appLoginLog',this.page).then(data=>{
                    if(data.status.code === 0){
                        this.tabledata = data.data
                        this.identityType(this.tabledata.list)
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
                    return this.$message({
                        type: 'error',
                        message: '获取数据失败'
                    });
                    
                });
            },
            // go to pageNum     
            handleCurrentChange(val) {
                this.page.pageNum = val
                http.get('/api/auth/v1/appLoginLog',this.page).then(data=>{
                    if(data.status.code === 0){
                        // console.log(data.data);
                        this.tabledata = data.data
                        this.identityType(this.tabledata.list)
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
                    return this.$message({
                        type: 'error',
                        message: '获取数据失败'
                    });
                    
                });
            },
           
            getTableData(){
                http.get('/api/auth/v1/appLoginLog',this.page).then(res=>{
                    console.log('table数据',res);   
                    if(res.status.code === 0){
                        this.tabledata = res.data
                        this.identityType(this.tabledata.list)
                        console.log('tabledata',this.tabledata);
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
                }).catch(error => {
                    return this.$message({
                        type: 'error',
                        message: '获取数据失败'
                    });
                
                });
            },
            down(){
                let obj = {
                    phoneNo:this.number,
                    studentName:this.studentName,
                    identityNumber:this.identityNumber,
                    schoolName:this.schoolName,
                    classTitle:this.className,
                    createTime:this.valueData,
                    identityType:'',
                    dataCode:this.eareValue
                }
                let str = '';
                for(let key in obj){
                    // console.log(key);
                    if(obj[key]!=''&&obj[key]!=undefined){
                        str+=key+'='+obj[key]+'&';
                    }
                }
                str = str.slice(0,-1);
                // console.log(str);
                window.open("http://s.operation.dev.gzhc.xiaotitong.com/api/auth/v1/appLoginLog/export?"+str)

            },
            getEare(){
                http.get('/api/v1/area/list').then(res=>{
                    if(res.status.code == '0'){
                        let eareObj = {
                            dataCode:'',
                            dataName:'全部'
                        }
                        this.eare = res.data;
                        this.eare.unshift(eareObj)
                    }else if(res.status.code == '2010001'){
                        this.$message({
                            type:'error',
                            message:'token失效请重新登录'
                        })
                        this.$router.push({name: 'login'});
                    }else{
                        this.$message({
                            type:'error',
                            message:res.status.msg
                        })
                    }
                }).catch(error=>{
                    this.$message({
                        type:'error',
                        message:'获取区域失败'
                    })
                })
            }
           
        },
        mounted(){
            this.getTableData();
            this.getEare();
        }
    }
</script>