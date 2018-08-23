<template>
    <div style="background:#fff;" class="border-radius">
        <p style="padding:20px;">
            角色名:
            <el-input placeholder="请输入角色名" v-model="username" clearable class="w400"></el-input> 
        </p>
        <el-tree
            :data="treedata"
            show-checkbox
            ref="tree"
            node-key="id"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps">
        </el-tree>
        <div class="buttons" style="padding: 20px;">
            <el-button @click="goback" style="background:#83BDF9;color:#fff;">取消</el-button>
            <el-button @click="resetChecked" style="background:#83BDF9;color:#fff;">清空</el-button>
            <el-button @click="save($store.state.addRole,$store.state.updateRole)" type="" style="background:#83BDF9;color:#fff;">保存</el-button>
        </div>
    </div>
</template>

<style src="./roleedit.scss">
    
</style>

<script>
    import http from './../../../../utils/HttpClient'
    export default {
        data(){
            return {
                username:'',
                treedata:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                arr:[],
                id:''
        
            }
        },
        methods:{
            
            getCheckedKeys() {
                console.log(this.$refs.tree.getCheckedKeys());
            },
            resetChecked() {
                this.$refs.tree.setCheckedKeys([]);
            },
            goback() {
                this.$router.go(-1)
            },
            save(addTpye,editType){
                if(this.id == '' && addTpye == true){
                    return this.$message({
                        type: 'error',
                        message: '没此这权限'
                    });
                }

                if(this.id != '' && editType == true){
                    return this.$message({
                        type: 'error',
                        message: '没此这权限'
                    });
                }
                console.log('statusTpye',addTpye,editType)
                if(this.username){
                    let array = this.$refs.tree.getCheckedKeys()
                    // console.log(array);
                    let obj = {"name":this.username,"menuIds":array};
                    // console.log(obj)
                    http.post('/api/auth/v1/role/'+this.id,{id:this.id,name:this.username,"menuIds":array}).then(res=>{
                        if(res.status.code == 0){
                            // console.log(res)
                            let obj = {
                                self:this,
                                type:'success',
                                text:'保存成功'
                            }
                            this.$store.commit('openSuccess',obj);
                            setTimeout(()=>{
                                this.$store.commit('loading',this);
                                this.$router.push({name: 'role'});
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
                        let obj = {
                            self:this,
                            type:'error',
                            text:'保存失败'
                        }
                        this.$store.commit('openSuccess',obj);
                    });
                }else{
                    let obj = {
                        self:this,
                        type:'warning',
                        text:'请填写角色名'
                    }
                    this.$store.commit('openSuccess',obj);
                }
            },

            getId(id){
                http.get('/api/auth/v1/role/'+id).then(res=>{
                    if(res.status.code == 0){
                        console.log(res)
                        this.treedata = res.data.menuList;
                        this.arr = res.data.permissionIds;
                        setTimeout(()=>{
                            this.$refs.tree.setCheckedKeys(this.arr);
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
                    let obj = {
                        self:this,
                        type:'error',
                        text:'数据获取失败'
                    }
                    this.$store.commit('openSuccess',obj);
            
                })
            },

            getList(){
                http.get('/api/auth/v1/user/menus').then(res=>{
                    if(res.status.code == 0){
                        this.treedata = res.data;
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
                    let obj = {
                        self:this,
                        type:'error',
                        text:'数据获取失败'
                    }
                    this.$store.commit('openSuccess',obj);
                })

            }
        },
        mounted(){
            
            this.id = this.$route.query.id || this.id;
            if(this.id){
                this.username = this.$route.query.name;
                this.getId(this.id)
            }else{
                this.getList();
            }

        }
    }
</script>