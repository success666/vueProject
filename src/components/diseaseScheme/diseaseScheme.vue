<template>
    <div class="rootelementa">
        <!-- search -->
        <div v-if="$store.state.listDiseaseScheme" class="search">
            标题:
            <el-input placeholder="请输入标题" v-model="searchTitle" clearable class="w200"></el-input> 
            推送范围:
            <el-input placeholder="请输入标题" v-model="searchValue" clearable class="w200"></el-input> 
            状态:
            <el-select v-model="statusvalue" placeholder="请选择状态">
                <el-option
                v-for="items in status"
                :key="items.value"
                :label="items.label"
                :value="items.value">
                </el-option>
            </el-select>
            <el-button :disabled="!$store.state.listDiseaseScheme" style="background:#83BDF9;color:#fff;" @click="search">查询</el-button>
            <router-link to="/diseaseScheme/editDiseaseScheme">
                <el-button :disabled="$store.state.addDiseaseScheme" style="background:#83BDF9;color:#fff;">新增</el-button>
            </router-link>
        </div>

        <!-- table -->
        <el-table v-if="$store.state.listDiseaseScheme" :data="tabledata.list" style="width: 100%;text-align:center;" class="border-radius">
            <el-table-column label="标题">
                <template slot-scope="scope">
                    <span>{{ scope.row.title?scope.row.title:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="推送范围">
                <template slot-scope="scope">
                    <span>{{ scope.row.pushValue?scope.row.pushValue:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="更新时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.updateTime? scope.row.updateTime : '--' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button :disabled="$store.state.changeDiseaseSchemeOpenFlag" size="mini" style="background:#83BDF9;color:#fff;" @click="showStatus(scope.$index, scope.row)">{{scope.row.openFlag == 0? '未公开' : '已公开'}}</el-button>
                    <el-button :disabled="$store.state.getDiseaseScheme" size="mini" style="background:#83BDF9;color:#fff;" @click="look(scope.$index,scope.row)">查看</el-button>
                    <el-button :disabled="$store.state.deleteDiseaseScheme" size="mini" style="background:#83BDF9;color:#fff;" type="" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- page -->
        <div v-if="$store.state.listDiseaseScheme" class="block fr" style="padding:14px 26px;">
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
        <div v-if="!$store.state.listDiseaseScheme" style="text-align:center;">没有此权限</div>
    </div>
</template>

<style src="./diseaseScheme.scss">

</style>

<script>
    import http from './../../utils/HttpClient'
    export default {
        data(){
            return {

                // search 
                status:[{
                    value:'',
                    label:'全部'
                },{
                    value: '0',
                    label: '未公开'
                    }, {
                    value: '1',
                    label: '已公开'
                }],
                // page  
                currentPage4: 1,
                page:{
                    // 当前页
                    pageNum:1,
                    // 每页数量
                    pageSize:6
                },
                // 标题
                searchTitle:'',
                // 状态
                statusvalue:'',
                searchValue:'',
               

                // table     
                tabledata:[]
                
            }
        },
        methods:{
            look(index,row){
                console.log(row);
                this.$router.push({path: '/diseaseScheme/diseaseSchemeLook', query:{"id": row.id}})
            },
            // 查询        
            search(){
                this.page = {
                    title:this.searchTitle,
                    openFlag:this.statusvalue,
                    pushValue:this.searchValue,
                    pageNum:this.page.pageNum,
                    pageSize:this.page.pageSize
                }
                console.log(this.page);
                http.get('/api/auth/v1/diseaseScheme',this.page).then(data=>{
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
                    this.$message({
                        type: 'error',
                        message: '请求数据失败!'
                    });
                });
            },


            // 提示   
            open(test) {
                this.$message.warning(test);
            },
            erroropen(test) {
                this.$message.error(test);
            },


            // 删除    
            handleDelete(index, row) {
                this.$confirm('删除后方案将无法恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    http.delete(`/api/auth/v1/article/${row.id}`).then(res=>{
                        // console.log(res,'删除成功');
                        if(res.body.status.code == 0){
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
                            type: 'info',
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



            // 是不公开          
            showStatus(index,row){
                // console.log(index,row);
                let show = row.openFlag
                if(show == 1){
                    show = 0
                    // /api/auth/v1/article/8
                    this.$confirm('确认后，APP用户将无法查看或查找本内容，之后可重新公开','提示',{
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        http.post('/api/auth/v1/diseaseScheme/changeOpenFlag',{"openFlag":show,"id":row.id}).then(res=>{
                            // console.log(res);
                            if(res.status.code == 0){
                                this.$message({
                                    type: 'success',
                                    message: '以设置为未公开状态!'
                                });
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
                            this.$message({
                                type: 'error',
                                message: '设置失败'
                            });
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消设置'
                        });          
                    });        
                }else if(show == 0){
                    show = 1;
                    this.$confirm('确认后,应方案将推送至APP','提示',{
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        http.post('/api/auth/v1/diseaseScheme/changeOpenFlag',{"openFlag":show,"id":row.id}).then(res=>{
                            console.log(res);
                            if(res.status.code == 0){
                                this.$message({
                                    type: 'success',
                                    message: '以设置为已公开状态!'
                                });
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
                            this.$message({
                                type: 'error',
                                message: '设置失败'
                            });
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消设置'
                        });          
                    });        
                }
                
            },




            // 每页数量             
            handleSizeChange(val) {
                this.page.pageSize = val
                http.get('/api/auth/v1/diseaseScheme',this.page).then(data=>{
                    if(data.status.code === 0){
                        // console.log(data.data);
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

            // go to pageNum       
            handleCurrentChange(val) {
                this.page.pageNum = val
                http.get('/api/auth/v1/diseaseScheme',this.page).then(data=>{
                    if(data.status.code === 0){
                        // console.log(data.data);
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
                // 
                http.get('/api/auth/v1/diseaseScheme',this.page).then(data=>{
                    if(data.status.code == '0'){
                        console.log('table数据',data.data);
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
            
        },
        mounted(){
            this.getTableData();
        }
    }
</script>