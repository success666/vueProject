<template>

    <div ref="history" class="history">
        <!-- search -->
        <div class="search">
            <ul class="clearfix titleul">
                <li>
                    更新日期:
                    <el-select v-model="eareValue" placeholder="请选日期">
                        <el-option
                        v-for="item in eare"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    区：
                    <el-select v-model="eareValue" placeholder="请选身份">
                        <el-option
                        v-for="item in eare"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    学校:
                    <el-input placeholder="请输入学生身份信息" v-model.trim="studentMessage" clearable class="w200"></el-input>
                </li>
                <li>
                    班级:
                    <el-input placeholder="请选择班级" v-model.trim="classValue" clearable class="w200"></el-input>
                </li>
                <li>
                    学生身份信息:
                    <el-input placeholder="请输入学生姓名" v-model.trim="student" clearable class="w200"></el-input> 
                </li>
                <li>
                    学生姓名:
                    <el-input placeholder="请输入疾病" v-model.trim="diseaseName" clearable class="w200"></el-input>
                </li>
                <li>
                    周计划：
                    <el-select v-model="eareValue" placeholder="请选身份">
                        <el-option
                        v-for="item in eare"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <el-button type="" @click="search" style="margin-left:14px;background:#83BDF9;color:#fff;">查询</el-button>
                </li>
                <li>
                    <a id="downlink"></a>
                    <el-button type="" style="margin-left:14px;background:#83BDF9;color:#fff;" @click="down">导出Excel</el-button>
                </li>
            </ul>               
        </div>


        <!-- table -->
        <el-table :data="tabledata.list" style="width:100%;" class="border-radius">
            <el-table-column prop="areaName" label="更新日期">
            </el-table-column>

            <el-table-column prop="schoolName" label="区">
            </el-table-column>

            <el-table-column prop="className" label="学校">
            </el-table-column>

            <el-table-column prop="identityNumber" label="班级">
            </el-table-column>

            <el-table-column prop="name" label="学生身份信息">
            </el-table-column>

            <el-table-column prop="studentRelation" label="学生姓名">
            </el-table-column>

            <el-table-column prop="diseaseName" label="运动点1">
            </el-table-column>

            <el-table-column prop="diseaseName" label="运动点2">
            </el-table-column>

            <el-table-column prop="diseaseName" label="运动点3">
            </el-table-column>

            <el-table-column prop="diseaseName" label="周计划">
            </el-table-column>

        </el-table>


        <!-- page -->
        <div class="block fr" style="padding:14px 26px;">
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

    </div>
</template>
<style src="./motionUpdateStatistics.scss" scoped>
        
</style>

<script>
    import XLSX from 'xlsx'
    import http from '../../utils/HttpClient'
    export default {
         data(){
            return {
                // imFile: '', // 导入文件el
                outFile: '', // 导出文件el
                // errorDialog: false, // 错误信息弹窗
                // errorMsg: '', // 错误信息内容

               
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


                eare:[{
                    id:'',
                    name:'全部'
                },{
                    id:1,
                    name:'广州'
                },{
                    id:2,
                    name:'北京'
                }],
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
                    areaName:this.eareValue,
                    schoolName:this.school,
                    className:this.classValue,
                    name:this.student,
                    identityNumber:this.studentMessage,
                    diseaseName:this.diseaseName,
                    studentRelation:this.relation,
                    pageNum:1,
                    pageSize:7
                }
                // console.log(params);

                http.get('/api/auth/v1/diseaseHistory',params).then(res=>{
                    if(res.status.code == '0'){
                        this.tabledata = res.data;
                        this.forOfType(this.tabledata.list)
                    }else{
                        return this.$message({
                            type: 'error',
                            message: '获取数据失败'
                        });
                    }
                }).catch(error=>{
                    return this.$message({
                        type: 'error',
                        message: '获取数据失败'
                    });
                    console.log(error);
                })
            },
             // 每页数量               
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.page.pageSize = val
                http.get('/api/auth/v1/diseaseHistory',this.page).then(data=>{
                    if(data.status.code === 0){
                        // console.log(data.data);
                        this.tabledata = data.data
                        this.forOfType(this.tabledata.list)
                    }else{
                        return this.$message({
                            type: 'error',
                            message: '获取数据失败'
                        });
                    }
                }).catch(error => {
                    return this.$message({
                        type: 'error',
                        message: '获取数据失败'
                    });
                    console.log(error)
                });
            },
            // go to pageNum     
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.page.pageNum = val
                http.get('/api/auth/v1/diseaseHistory',this.page).then(data=>{
                    if(data.status.code === 0){
                        // console.log(data.data);
                        this.tabledata = data.data
                        this.forOfType(this.tabledata.list)
                    }else{
                        return this.$message({
                            type: 'error',
                            message: '获取数据失败'
                        });
                    }
                }).catch(error => {
                    return this.$message({
                        type: 'error',
                        message: '获取数据失败'
                    });
                    console.log(error)
                });
            },
           
            getTableData(){
                http.get('/api/auth/v1/article',this.page).then(res=>{
                    // console.log('table数据',res);   
                    if(res.status.code === 0){
                        this.tabledata = res.data
                        this.forOfType(this.tabledata.list)
                    }else{
                        return this.$message({
                            type: 'error',
                            message: '获取数据失败'
                        });
                    }
                }).catch(error => {
                    return this.$message({
                        type: 'error',
                        message: '获取数据失败'
                    });
                    console.log(error)
                });
            },
            down(){
               
                let obj = {
                    areaName:this.eareValue,
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
                // console.log(str);
                window.open("http://s.operation.dev.gzhc.xiaotitong.com/api/auth/v1/diseaseHistory/export?"+str)

            },
            // 点击导出按钮
            downloadFile: function(rs) { 
                this.page.pageSize = 1000;
                this.getTableData();

                setTimeout(()=>{
                    // console.log('this.tabledata',this.tabledata);
                    let data = [{}]
                    for (let k in this.tabledata.list[0]) {
                        data[0][k] = k
                    }
                    data = data.concat(this.tabledata.list)
                    this.downloadExl(data, '菜单')
                },1000)
            }, 

            downloadExl: function(json, downName, type) {  // 导出到excel
                let keyMap = []; // 获取键
                for (let k in json[0]) {
                    keyMap.push(k)
                }
                console.info('keyMap', keyMap, json)
                let tmpdata = []; // 用来保存转换好的json
                json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
                v: v[k],
                position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
                }))).reduce((prev, next) => prev.concat(next)).forEach(function (v) {
                    tmpdata[v.position] = { v: v.v }
                });
                let outputPos = Object.keys(tmpdata); // 设置区域,比如表格从A1到D10
                let tmpWB = {
                SheetNames: ['mySheet'], // 保存的表标题
                Sheets: {
                    'mySheet': Object.assign({},
                    tmpdata, // 内容
                    {
                        '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
                    })
                }
                };
                let tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
                { bookType: (type === undefined ? 'xlsx' : type), bookSST: false, type: 'binary' } // 这里的数据是用来定义导出的格式类型
                ))], {type: ''}) // 创建二进制对象写入转换好的字节流
                var href = URL.createObjectURL(tmpDown); // 创建对象超链接
                this.outFile.download = downName + '.xlsx'; // 下载名称
                this.outFile.href = href; // 绑定a标签
                this.outFile.click(); // 模拟点击实现下载
                setTimeout(function() { // 延时释放
                    URL.revokeObjectURL(tmpDown) // 用URL.revokeObjectURL()来释放这个object URL
                }, 100)
            }, 
      
            // 导出使用
            s2ab: function(s) { // 字符串转字符流
                var buf = new ArrayBuffer(s.length)
                var view = new Uint8Array(buf)
                for (var i = 0; i !== s.length; ++i) {
                    view[i] = s.charCodeAt(i) & 0xFF
                }
                return buf
            }, 
            getCharCol: function(n) { // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
                let s = '';
                let m = 0;
                while (n > 0) {
                    m = n % 26 + 1;
                    s = String.fromCharCode(m + 64) + s;
                    n = (n - m) / 26
                }
                return s
            }
        },
        mounted(){
            // console.log(window.innerHeight - 78);
            // console.log(this.$refs.history)
            // let height = window.innerHeight - 150
            // this.$refs.history.style.height = height+'px';
            this.getTableData();

            this.outFile = document.getElementById('downlink') // 导出使用
        }
    }
</script>