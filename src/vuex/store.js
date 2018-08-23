import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        // app版本号管理 
        listAppVersion:false,
        addAppVersion:true,
        getAppVersion:true,
        delectAppVersion:true,

        // APP用户管理
        listAppAccount:false,
        accountMgmtExport:true,
        deleteRelation:true,

        // 在线统计
        listAppLoginLog:false,
        appLoginLogExport:true,

        // 学生关系疾病史
        listStudentRelationDiseaseHistory:false,

        // 疾病方案管理
        listDiseaseScheme:false,
        addDiseaseScheme:true,
        deleteDiseaseScheme:true,
        getDiseaseScheme:true,
        changeDiseaseSchemeOpenFlag:true,
        updateDiseaseScheme:true,

        // 运动点方案
        lietSportPoint:false,
        addSportPoint:true,
        updateSportPoint:true,
        deleteSportPoint:true,
        getSportPoint:true,

        // 营养方案管理
        listNutritionScheme:false,
        addNutritionScheme:true,
        updateNutritionScheme:true,
        deleteNutritionScheme:true,
        getNutritionScheme:true,
        changeNutritionSchemeOpenFlag:true,

        // 文章
        listArticle:false,
        addArticle:true,
        updateArticle:true,
        deleteArticle:true,
        getArticle:true,
        changeArticleOpenFlag:true,
        getArticleComment:true,
        changeArticleCommentShow:true,

        // 问题库
        listProblemLibrary:false,
        addProblemLibrary:true,
        getProblemLibrary:true,
        deleteProblemLibrary:true,
        changeProblemLibraryOpenFlag:true,
        updateProblemLibrary:true,

        // 提问管理
        listAskQuestion:false,
        getQuestionReplyList:true,
        addAskQuestionReply:true,

        // 用户管理
        listUser:false,
        getUser:true,
        addUser:true,
        updateUser:true,
        deleteUser:true,
        resetPassword:true,

        // 角色管理
        listRole:false,
        updateRole:true,
        addRole:true,

        // 更新密码
        updatePassword:true,
    },
    mutations:{
        // loading
        loading(e,self) {
            const loading = self.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            setTimeout(() => {
                loading.close();
            }, 1000);
        },
      
        // 消息提示 成功 success 警告 warning 错误 error
        openSuccess(e,obj) {
            obj.self.$message({
                showClose: obj.show,
                message: obj.text,
                type: obj.type
            });
        },
        base64(e,token){
            let tokenObj = decodeURIComponent(atob(token).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            tokenObj = JSON.parse(JSON.parse(tokenObj).sub).menus
            // console.log(tokenObj)

            for(let key of tokenObj){
                // app版本号管理 
                if(key.code == "listAppVersion"){
                    this.state.listAppVersion = true;
                }else if(key.code == "addAppVersion"){
                    this.state.addAppVersion = false;
                }else if(key.code == "getAppVersion"){
                    this.state.getAppVersion = false;
                }else if(key.code == "deleteAppVersion"){
                    this.state.deleteAppVersion = false;
                }
                // APP用户管理
                else if(key.code == "listAppAccount"){
                    this.state.listAppAccount = true;
                }else if(key.code == "accountMgmtExport"){
                    this.state.accountMgmtExport = false;
                }else if(key.code == "deleteRelation"){
                    this.state.deleteRelation = false;
                }
                // 在线统计
                else if(key.code == "listAppLoginLog"){
                    this.state.listAppLoginLog = true;
                }else if(key.code == "appLoginLogExport"){
                    this.state.appLoginLogExport = false;
                }
                // 学生关系疾病史
                else if(key.code == "listStudentRelationDiseaseHistory"){
                    this.state.listStudentRelationDiseaseHistory = true;
                }
                // 疾病方案管理
                else if(key.code == "listDiseaseScheme"){
                    this.state.listDiseaseScheme = true;
                }else if(key.code == "addDiseaseScheme"){
                    this.state.addDiseaseScheme = false;
                }else if(key.code == "deleteDiseaseScheme"){
                    this.state.deleteDiseaseScheme = false;
                }else if(key.code == "getDiseaseScheme"){
                    this.state.getDiseaseScheme = false;
                }else if(key.code == "changeDiseaseSchemeOpenFlag"){
                    this.state.changeDiseaseSchemeOpenFlag = false;
                }else if(key.code == "updateDiseaseScheme"){
                    this.state.updateDiseaseScheme = false;
                }
                // 运动点方案
                else if(key.code == "lietSportPoint"){
                    this.state.lietSportPoint = true;
                }else if(key.code == "addSportPoint"){
                    this.state.addSportPoint = false;
                }else if(key.code == "deleteSportPoint"){
                    this.state.deleteSportPoint = false;
                }else if(key.code == "getSportPoint"){
                    this.state.getSportPoint = false;
                }else if(key.code == "updateSportPoint"){
                    this.state.updateSportPoint= false;
                }
                // 营养方案管理
                else if(key.code == "listNutritionScheme"){
                    this.state.listNutritionScheme = true;
                }else if(key.code == "addNutritionScheme"){
                    this.state.addNutritionScheme = false;
                }else if(key.code == "deleteNutritionScheme"){
                    this.state.deleteNutritionScheme = false;
                }else if(key.code == "getNutritionScheme"){
                    this.state.getNutritionScheme = false;
                }else if(key.code == "changeNutritionSchemeOpenFlag"){
                    this.state.changeNutritionSchemeOpenFlag = false;
                }else if(key.code == "updateNutritionScheme"){
                    this.state.updateNutritionScheme = false;
                }
                // 文章 
                else if(key.code == "listArticle"){
                    this.state.listArticle = true;
                }else if(key.code == "addArticle"){
                    this.state.addArticle = false;
                }else if(key.code == "updateArticle"){
                    this.state.updateArticle = false;
                }else if(key.code == "deleteArticle"){
                    this.state.deleteArticle = false;
                }else if(key.code == "getArticle"){
                    this.state.getArticle = false;
                }else if(key.code == "changeArticleOpenFlag"){
                    this.state.changeArticleOpenFlag = false;
                }else if(key.code == "getArticleComment"){
                    this.state.getArticleComment = false;
                }else if(key.code == "changeArticleCommentShow"){
                    this.state.changeArticleCommentShow = false;
                }

                // 问题库
                else if(key.code == "listProblemLibrary"){
                    this.state.listProblemLibrary = true;
                }else if(key.code == "addProblemLibrary"){
                    this.state.addProblemLibrary = false;
                }else if(key.code == "getProblemLibrary"){
                    this.state.getProblemLibrary = false;
                }else if(key.code == "deleteProblemLibrary"){
                    this.state.deleteProblemLibrary = false;
                }else if(key.code == "changeProblemLibraryOpenFlag"){
                    this.state.changeProblemLibraryOpenFlag = false;
                }else if(key.code == "updateProblemLibrary"){
                    this.state.updateProblemLibrary = false;
                }

                // 提问管理
                else if(key.code == "listAskQuestion"){
                    this.state.listAskQuestion = true;
                }else if(key.code == "getQuestionReplyList"){
                    this.state.getQuestionReplyList = false;
                }else if(key.code == "addAskQuestionReply"){
                    this.state.addAskQuestionReply = false;
                }


                // 用户管理 
                else if(key.code == "listUser"){
                    this.state.listUser = true;
                }else if(key.code == "addUser"){
                    this.state.addUser = false;
                }else if(key.code == "updateUser"){
                    this.state.updateUser = false;
                }else if(key.code == "getUser"){
                    this.state.getUser = false;
                }else if(key.code == "deleteUser"){
                    this.state.deleteUser = false;
                }else if(key.code == "resetPassword"){
                    this.state.resetPassword = false;
                }
                
                // 角色管理
                else if(key.code == 'listRole'){
                    this.state.listRole = true;
                }else if(key.code == 'updateRole'){
                    this.state.updateRole = false;
                }else if(key.code == 'addRole'){
                    this.state.addRole = false;
                }

                // 更新密码
                else if(key.code == "updatePassword"){
                    this.state.updatePassword = false;
                }
            }
        }
    },
    actions:{
       
    }
})

export default store;