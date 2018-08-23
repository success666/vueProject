<template>
    <div>
        <div class="review clearfix">
            <p>
                <el-button @click="goback" style="background:#83BDF9;color:#fff;">取消</el-button>
                <el-button :disabled="$store.state.changeArticleCommentShow" @click="toggleSelection" style="background:#83BDF9;color:#fff;">保存</el-button>
            </p>
        </div>

        <!-- table -->
        <el-table
            ref="multipleTable" :data="tabledata.list" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">

            <el-table-column type="selection">
            </el-table-column>

            <el-table-column label="用户">
                <template slot-scope="scope">{{ scope.row.phoneNo?scope.row.phoneNo:'---' }}</template>
            </el-table-column>

            <el-table-column label="评论">
                <template slot-scope="scope">{{ scope.row.content?scope.row.content:'---' }}</template>
            </el-table-column>

            <el-table-column label="评论状态">
                <template slot-scope="scope">{{ scope.row.isShow == 0?'未公开':'已公开' }}</template>
            </el-table-column>

            <el-table-column label="评论时间">
                <template slot-scope="scope">{{ scope.row.createTime?scope.row.createTime.slice(0,10):'---' }}</template>
            </el-table-column>
        </el-table>

        
        <!-- page -->
        <div class="block fr" style="padding:14px 26px;">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage4"
                :page-sizes="[1, 2, 3]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tabledata.total">
            </el-pagination>
        </div>

    </div>
</template>

<style src="./articlereview.scss" lang="scss" scoped>

</style>

<script>
import http from './../../../utils/HttpClient'
export default {
    data() {
        return {
           
            multipleSelection: [],
            // page  .........................
            tabledata:[],
            currentPage4: 1,
            page:{
                articleId:'',
                // 当前页
                pageNum:1,
                // 每页数量
                pageSize:1
            },
               
        }
    },
    methods: {
        goback() {
            this.$router.go(-1)
        },
        // 评论是否公开          
        toggleSelection() {
            for(let key of this.multipleSelection){
                // console.log(key);
                if(key.isShow == 1){
                    key.isShow = 0
                }else{
                    key.isShow = 1;
                }
            }
            http.post('/api/auth/v1/article/changeArticleCommentShow',this.multipleSelection).then(res=>{
                if(res.status.code == 0){
                    // this.multipleSelection = [];
                    // this.handleSelectionChange(this.multipleSelection);
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
                     setTimeout(()=>{
                        this.$store.commit('loading',this);
                        this.getTableData(this.page);
                    },1000)
                    // console.log(res);
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
        // 选择
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

         // 每页数量              
        handleSizeChange(val) {
            this.page.pageSize = val
            // console.log(this.page);
            http.get('/api/auth/v1/article/commentList',this.page).then(data=>{
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
                this.$message({
                    type: 'error',
                    message: '请求数据失败!'
                });
            });
        },
            // go to pageNum        
        handleCurrentChange(val) {
            this.page.pageNum = val
            // console.log(this.page);
            http.get('/api/auth/v1/article/commentList',this.page).then(data=>{
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
                this.$message({
                    type: 'error',
                    message: '请求数据失败!'
                });
            });
        },

        // table数据          
        getTableData(obj){
            http.get('/api/auth/v1/article/commentList',obj).then(data=>{
                if(data.status.code === 0){
                    // console.log('参数',obj,'返回的数据',data.data);
                    this.tabledata = data.data
                    // console.log('data',this.tabledata.list);
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

    },
     mounted(){
        this.page.articleId = this.$route.query.id;
        // console.log(this.page);
        this.getTableData(this.page);

    }
};
</script>