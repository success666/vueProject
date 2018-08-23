<template>

    <div ref="history" class="history">
        <!-- search -->
        <div v-if="$store.state.listStudentRelationDiseaseHistory" class="search">
            <ul class="clearfix titleul">
                <li>
                    区:
                    <el-select v-model="eareValue" placeholder="请选择区" style="width:120px;">
                        <el-option
                        v-for="item in eare"
                        :key="item.dataCode"
                        :label="item.dataName"
                        :value="item.dataCode">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    学校:
                    <el-input placeholder="请输入学校" v-model.trim="school" clearable class="w200"></el-input> 
                </li>
                <li>
                    班级:
                    <el-input placeholder="请选择班级" v-model.trim="classValue" clearable style="width:180px;"></el-input>
                </li>
                <li>
                    学生身份信息:
                    <el-input placeholder="请输入学生身份信息" v-model.trim="studentMessage" clearable class="w200"></el-input>
                </li>
                <li>
                    学生姓名:
                    <el-input placeholder="请输入学生姓名" v-model.trim="student" clearable class="w200"></el-input> 
                </li>
                <li>
                    关系:
                    <el-select v-model="relation" placeholder="请选择关系" style="width:120px;">
                        <el-option
                        v-for="items in relationData"
                        :key="items.id"
                        :label="items.name"
                        :value="items.id">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    疾病:
                    <el-input placeholder="请输入疾病" v-model.trim="diseaseName" clearable class="w200"></el-input>
                </li>
                <li>
                    <el-button type="" @click="search" style="margin-left:14px;background:#83BDF9;color:#fff;">查询</el-button>
                </li>
                <li>
                    <el-button type="" style="margin-left:14px;background:#83BDF9;color:#fff;" @click="down">下载Excel</el-button>
                </li>
            </ul>               
        </div>


        <!-- table -->
        <el-table v-if="$store.state.listStudentRelationDiseaseHistory" :data="tabledata.list" style="width:100%;text-align:center" class="border-radius">
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
                    <span>{{ scope.row.name?scope.row.name:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="关系">
                <template slot-scope="scope">
                    <span>{{ scope.row.studentRelation?scope.row.studentRelation:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="疾病">
                <template slot-scope="scope">
                    <span>{{ scope.row.diseaseName?scope.row.diseaseName:'---' }}</span>
                </template>
            </el-table-column>

        </el-table>


       <!-- page -->
        <div v-if="$store.state.listStudentRelationDiseaseHistory" class="block fr" style="padding:14px 26px;">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage4"
                :page-sizes="[7, 9, 11]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tabledata.total">
            </el-pagination>
        </div>

        <div v-if="!$store.state.listStudentRelationDiseaseHistory" style="text-align:center;">没有此权限</div>
    </div>
</template>
<style src="./diseasesHistory.scss">
        
</style>

<script>
    import http from '../../utils/HttpClient'
    export default {
         data(){
            return {
               
                eareValue:'',
                classValue:'',
                relation:'',
                school:'',
                student:'',
                studentMessage:'',
                diseaseName:'',
                relationData:[{
                    id:'',
                    name:'全部'
                },{
                    id:'0',
                    name:'本人'
                },{
                    id:'1',
                    name:'母亲'
                },{
                    id:'2',
                    name:'父亲'
                },{
                    id:'3',
                    name:'兄弟'
                },{
                    id:'4',
                    name:'姐妹'
                }],


                eare:[],
                tabledata: [],
                // page  .........................
                currentPage4: 1,
                page:{
                    // 当前页
                    pageNum:1,
                    // 每页数量
                    pageSize:7
                },
             }
        },
        methods:{
            forOfType(array){
                // console.log(array);
                for(let key of array){
                    if(key.studentRelation == '0' ){
                        key.studentRelation = '本人'
                    }else if(key.studentRelation == '1' ){
                        key.studentRelation = '母亲'
                    }else if(key.studentRelation == '2' ){
                        key.studentRelation = '父亲'
                    }else if(key.studentRelation == '3' ){
                        key.studentRelation = '兄弟'
                    }else if(key.studentRelation == '4' ){
                        key.studentRelation = '姐妹'
                    }    
                }
            },
            search(){
                let params = {
                    dataCode:this.eareValue,
                    schoolName:this.school,
                    className:this.classValue,
                    name:this.student,
                    identityNumber:this.studentMessage,
                    diseaseName:this.diseaseName,
                    studentRelation:this.relation,
                    pageNum:1,
                    pageSize:7
                }
                console.log(params);

                http.get('/api/auth/v1/diseaseHistory',params).then(res=>{
                    if(res.status.code == '0'){
                        this.tabledata = res.data;
                        this.forOfType(this.tabledata.list)
                    }else if(res.status.code == '2010001'){
                        this.$message({
                            type: 'error',
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
                        message: '获取数据失败'
                    });
                })
            },
             // 每页数量               
            handleSizeChange(val) {
        
                this.page.pageSize = val
                http.get('/api/auth/v1/diseaseHistory',this.page).then(data=>{
                    if(data.status.code == '0'){
                        console.log(data.data);
                        this.tabledata = data.data
                        this.forOfType(this.tabledata.list)
                    }else if(data.status.code == '2010001'){
                        this.$message({
                            type: 'error',
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
                http.get('/api/auth/v1/diseaseHistory',this.page).then(data=>{
                    if(data.status.code === 0){
                        console.log(data.data);
                        this.tabledata = data.data
                        this.forOfType(this.tabledata.list)
                    }else if(data.status.code == '2010001'){
                        this.$message({
                            type: 'error',
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
           
            getTableData(){
                http.get('/api/auth/v1/diseaseHistory',this.page).then(res=>{
                    console.log('table数据',res);   
                    if(res.status.code == '0'){
                        this.tabledata = res.data
                        this.forOfType(this.tabledata.list)
                    }else if(res.status.code == '2010001'){
                        this.$message({
                            type: 'error',
                            message: 'token失效请重新登录'
                        });
                        this.$router.push({name: 'login'});
                    }else{
                        return this.$message({
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
                    dataCode:this.eareValue,
                    schoolName:this.school,
                    className:this.classValue,
                    name:this.student,
                    identityNumber:this.studentMessage,
                    diseaseName:this.diseaseName,
                    studentRelation:this.relation
                }
                let str = '';
                for(let key in obj){
                    // console.log(key);
                    if(obj[key]!=''&&obj[key]!=undefined){
                        str+=key+'='+obj[key]+'&';
                    }
                }
                str = str.slice(0,-1);
                console.log(str);
                window.open("http://s.operation.dev.gzhc.xiaotitong.com/api/auth/v1/diseaseHistory/export?"+str)

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
                            type: 'error',
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
                        message: "获取区域失败"
                    });
                })
            }
           
        },
        mounted(){
            this.getTableData();
            this.getEare();
        }
    }
</script>