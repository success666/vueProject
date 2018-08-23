<template>
    <div class="rootelementa">
        <!-- search -->
        <div v-if="$store.state.listAskQuestion" class="search">
            提问:
            <el-input placeholder="请输入内容" v-model="searchTitle" clearable class="w200"></el-input> 
            类型:
            <el-select v-model="type" placeholder="请选择类型">
                <el-option
                v-for="item in articletype"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            状态:
            <el-select v-model="statusvalue" placeholder="请选择状态">
                <el-option
                v-for="items in status"
                :key="items.value"
                :label="items.label"
                :value="items.value">
                </el-option>
            </el-select>
            <el-button type="" style="background:#83BDF9;color:#fff;" @click="search">查询</el-button>
        </div>

        <!-- table -->
        <el-table v-if="$store.state.listAskQuestion" :data="tabledata.list" style="width: 100%;text-align:center;" class="border-radius">
            
            <el-table-column label="最新提问时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime?scope.row.createTime:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="类型">
                <template slot-scope="scope">
                    <span>{{ scope.row.questionType?scope.row.questionType:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="提问人">
                <template slot-scope="scope">
                    <span>{{ scope.row.askName?scope.row.askName:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="提问">
                <template slot-scope="scope">
                    <span>{{ scope.row.content?scope.row.content:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.replyStatus==0?'未回复':'已回复' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="最新回复时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.updateTime? scope.row.updateTime : '---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button :disabled="$store.state.getQuestionReplyList" size="mini" style="background:#83BDF9;color:#fff;" @click="look(scope.$index,scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- page -->
        <div v-if="$store.state.listAskQuestion" class="block fr" style="padding:14px 26px;">
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

        <div v-if="!$store.state.listAskQuestion" style="text-align:center;">没有此权限</div>
    </div>
</template>

<style src="./issuesManagement.scss">

</style>

<script>
    import http from './../../utils/HttpClient'
    export default {
        data(){
            return {
                // search 
                articletype:[{
                    value:'3',
                    label:'全部'
                },{
                     value:'0',
                    label:'营养'
                },{
                     value:'1',
                    label:'运动'
                },{
                     value:'2',
                    label:'疾病'
                }],
                status:[{
                    value:'',
                    label:'全部'
                },{
                    value: '0',
                    label: '未回复'
                    }, {
                    value: '1',
                    label: '已回复'
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
                // 类型
                type:'',

                // table     
                tabledata:[]
                
            }
        },
        methods:{
            look(index,row){
                console.log(row);
                this.$router.push({path: '/issuesManagement/issuesManagementLook', query:{"id": row.id}})
            },
       
            // questionType 
            forOfType(array){
                for(let key of array){
                    if(key.questionType == 0){
                        key.questionType = '营养';
                    }else if(key.questionType == 1){
                        key.questionType = '运动';
                    }else if(key.questionType == 2){
                        key.questionType = '疾病';
                    }
                }
            },
            // 查询         
            search(){
                this.page = {
                    askName:this.searchTitle,
                    questionType:this.type,
                    replyStatus:this.statusvalue,
                    pageNum:this.page.pageNum,
                    pageSize:this.page.pageSize
                }
                console.log(this.page);
                http.get('/api/auth/v1/askQuestion',this.page).then(data=>{
                    if(data.status.code === 0){
                        this.tabledata = data.data
                        this.forOfType(this.tabledata.list);
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


            // 每页数量            
            handleSizeChange(val) {
                this.page.pageSize = val
                http.get('/api/auth/v1/askQuestion',this.page).then(data=>{
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
                http.get('/api/auth/v1/askQuestion',this.page).then(data=>{
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
                // 
                http.get('/api/auth/v1/askQuestion',this.page).then(data=>{
                    if(data.status.code === 0){
                        console.log('table数据',data.data);
                        this.tabledata = data.data
                        // console.log('data',this.tabledata.list);
                        this.forOfType(this.tabledata.list)
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