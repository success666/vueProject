<template>
    <div class="rootelementa">
        <!-- search -->
        <div v-if="$store.state.listArticle" class="search">
            标题:
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
            <el-button :disabled="$store.state.addArticle" @click="toAddArticle" style="background:#83BDF9;color:#fff;margin-left:14px;">新增</el-button>
            <el-button type="" @click="search" style="background:#83BDF9;color:#fff;">查询</el-button>
        </div>

        <!-- table -->
        <el-table v-if="$store.state.listArticle" :data="tabledata.list" style="width: 100%;text-align:center;" class="border-radius">
            <el-table-column label="标题" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.title?scope.row.title:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="类型" width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.articleType?scope.row.articleType:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="赞" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.likeCount?scope.row.likeCount:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="收藏" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.collectCount?scope.row.collectCount:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="评论" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.commentProportion? scope.row.commentProportion : '---'}}</span>
                </template>
            </el-table-column>

            <el-table-column label="更新时间" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.updateTime? scope.row.updateTime.slice(0,10) : '---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button :disabled="$store.state.changeArticleOpenFlag" size="mini" @click="showStatus(scope.$index, scope.row)" style="background:#83BDF9;color:#fff;">{{scope.row.openFlag == 0? '未公开' : '已公开'}}</el-button>
                    <el-button :disabled="$store.state.getArticle" size="mini" @click="look(scope.$index,scope.row)" style="background:#83BDF9;color:#fff;">查看</el-button>
                    <el-button :disabled="$store.state.updateArticle" size="mini" @click="edit(scope.$index,scope.row)" style="background:#83BDF9;color:#fff;">编辑</el-button>
                    <el-button :disabled="$store.state.deleteArticle" size="mini" type="" @click="handleDelete(scope.$index, scope.row)" style="background:#83BDF9;color:#fff;">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- page -->
        <div v-if="$store.state.listArticle" class="block fr" style="padding:14px 26px;">
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

        <div v-if="!$store.state.listArticle" style="text-align:center;">没有此权限</div>
    </div>
</template>

<style src="./article.scss">

</style>

<script>
    import http from './../../utils/HttpClient'
    export default {
        data(){
            return {

                // search 
                articletype:[{
                    value:'',
                    label:'全部'
                },{
                     value:'0',
                    label:'营养'
                },{
                     value:'1',
                    label:'健康'
                },{
                     value:'2',
                    label:'运动'
                },{
                     value:'3',
                    label:'疾病'
                }],
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
                    pageSize:7
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
            toAddArticle(){
                this.$router.push({path: '/article/addarticle'})
            },
            look(index,row){
                // console.log(row);
                this.$router.push({path: '/article/articlelook', query:{"id": row.id}})
            },
            edit(index,row){
                // console.log(row);
                this.$router.push({path: '/article/addarticle', query:{"id": row.id}})
            },
            // articleType    
            forOfType(array){
                for(let key of array){
                    if(key.articleType == 0){
                        key.articleType = '营养';
                    }else if(key.articleType == 1){
                        key.articleType = '健康';
                    }else if(key.articleType == 2){
                        key.articleType = '运动';
                    }else if(key.articleType == 3){
                        key.articleType = '疾病';
                    }
                }
            },
            // 查询       
            search(){
                this.page = {
                    title:this.searchTitle,
                    articleType:this.type,
                    openFlag:this.statusvalue,
                    pageNum:this.page.pageNum,
                    pageSize:this.page.pageSize
                }
                // console.log(this.page);
                http.get('/api/auth/v1/article',this.page).then(data=>{
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


            // 删除    
            handleDelete(index, row) {
                this.$confirm('删除后文章将无法恢复, 是否继续?', '提示', {
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
                    this.$confirm('确认后APP用户将无法查看或查找文章,之后可重新公开','提示',{
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        http.post('/api/auth/v1/article/changeOpenFlag',{"openFlag":show,"id":row.id}).then(res=>{
                            if(res.status.code == '0'){
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
                                message: '设置失败'
                            });
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消设置'
                        });          
                    });        
                }else if(show == '0'){
                    show = 1;
                    this.$confirm('确认后,应文章将推送至APP','提示',{
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        http.post('/api/auth/v1/article/changeOpenFlag',{"openFlag":show,"id":row.id}).then(res=>{
                            if(res.status.code == '0'){
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
                http.get('/api/auth/v1/article',this.page).then(data=>{
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
                http.get('/api/auth/v1/article',this.page).then(data=>{
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
                http.get('/api/auth/v1/article',this.page).then(data=>{
                    if(data.status.code == '0'){
                        // console.log('table数据',data.data);
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