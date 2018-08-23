<template>
    <div>
        <div v-if="$store.state.listRole" class="role">
            <p class="clearfix">
                <el-button :disabled="$store.state.addRole" @click="toRoleEdit" type="" style="background:#83BDF9;color:#fff;margin-left:14px;" class="fr">新增</el-button>
            </p>
            <el-table v-if="$store.state.listRole" :data="tableData.list" style="width: 100%;text-align:center;" class="border-radius">
                <el-table-column label="角色" width="180">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name == ''? '--':scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="" style="background:#83BDF9;color:#fff;" @click="handleEdit(scope.$index, scope.row)" :disabled="$store.state.updateRole">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- page -->
            <div class="block fr" style="padding:14px 26px;" v-if="$store.state.listRole">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage4"
                    :page-sizes="[7, 9, 11]"
                    :page-size="100"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableData.total">
                </el-pagination>
            </div>

        </div>
        <p v-if="!$store.state.listRole" style="text-align:center;">
            没有此权限
        </p>
    </div>
</template>
<style src="./role.scss" lang="scss">

</style>

<script>
    import http from './../../utils/HttpClient'
    import {mapState} from 'vuex'
    
    export default {
        
        data(){
            return {
                tableData:[],
                id:'',
                name:'',
                currentPage4: 1,
                page:{
                    // 当前页
                    pageNum:1,
                    // 每页数量
                    pageSize:7
                }
            }
        },
        methods:{
            toRoleEdit(){
                this.$router.push({path: '/role/roleEdit'})
            },
            handleEdit(index, row) {
                // console.log(index, row);
                this.id = row.id;
                this.name = row.name;
                // console.log(this.id);
                this.$router.push({path: '/role/roleEdit', query:{id: this.id,name:this.name}})
            },
            getRoleList(){
                http.get('/api/auth/v1/role',this.page).then(res=>{
                    if(res.status.code == 0){
                        this.tableData = res.data;
                        // console.log(res.data);
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
           // 每页数量
            handleSizeChange(val) {
                this.page.pageSize = val
                // console.log(this.page);
                http.get('/api/auth/v1/role',this.page).then(data=>{
                    if(data.status.code === 0){
                        console.log(data.data);
                        this.tableData = data.data
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
                http.get('/api/auth/v1/role',this.page).then(data=>{
                    if(data.status.code === 0){
                        // console.log(data.data);
                        this.tableData = data.data
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
            // this.$store.commit('loading',this);
            this.getRoleList();
          
        }
    }
</script>