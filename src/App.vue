<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    // let str1 = /^ml[0-9]+/;
    // let str2 = /^pl[0-9]+/;
    // let str3 = /^w[0-9]+/;
    // let str4 = /^h[0-9]+/;

    // var aEle = document.getElementsByTagName("*");
    // for (let key of aEle) {
    //   if (key.className.match(str1)) {
    //     var num1 = key.className.slice(2);
    //     key.style.marginLeft = num1 + "px";
    //   }else if(key.className.match(str2)){
    //     var num2 = key.className.slice(2);
    //     key.style.paddingLeft = num2 + 'px';
    //   }else if(key.className.match(str3)){

    //       var num3 = key.className.slice(1);
    //       console.log(key.className.split())
    //       key.style.width = num3 + 'px';
    //   }else if(key.className.match(str4)){
    //       var num4 = key.className.slice(1);
    //       key.style.height = num4 + 'px';
    //   }
    // }
  }
};
</script>

<style>
@charset "UTF-8";
/*css 初始化 */
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
fieldset,
img,
input,
button {
  border: none;
  padding: 0;
  margin: 0;
  outline-style: none;
} /*去掉input等聚焦时的蓝色边框*/
ul,
ol {
  list-style: none;
}
input {
  padding-top: 0;
  padding-bottom: 0;
  font-family: "SimSun", "宋体";
}
select,
input {
  vertical-align: middle;
}
select,
input,
textarea {
  font-size: 12px;
  margin: 0;
}
textarea {
  resize: none;
} /*防止拖动*/
img {
  border: 0;
  vertical-align: middle;
}
/*  去掉图片低测默认的3像素空白缝隙，或者用display：block也可以*/
table {
  border-collapse: collapse;
}

html,
body,
div#app {
  height: 100%;
}

/*添加公共样式*/
body {
  /* font:12px/150% Arial,Verdana,"\5b8b\4f53"; */
  color: #666;
  /* background:#fff */
}
.clearfix:before,
.clearfix:after {
  /*清楚浮动*/
  content: "";
  display: table;
}
.clearfix:after {
  clear: both;
}
.clearfix {
  *zoom: 1; /*IE/7/6*/
}
a {
  color: #666;
  text-decoration: none;
}
a:hover {
  color: #c81623;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  text-decoration: none;
  font-weight: normal;
  font-size: 1em;
} /*设置h标签的大小，设置跟父亲一样大的字体font-size:100%;*/
s,
i,
em {
  font-style: normal;
  text-decoration: none;
}

/*公共类*/
.container {
  /*版心 提取 */
  width: 1210px;
  margin: 0 auto;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.al {
  text-align: left;
}
.ac {
  text-align: center;
}
.ar {
  text-align: right;
}
.hide {
  display: none;
}
.font12 {
  font-size: 12px;
}
.font14 {
  font-size: 14px;
}
.font16 {
  font-size: 16px;
}
.font20 {
  font-size: 20px;
}
.font30 {
  font-size: 30px;
}
.w100 {
  width: 100px;
}
.w200 {
  width: 200px;
}
.w250 {
  width: 250px;
}
.w300 {
  width: 300px;
}
.w400 {
  width: 400px;
}
.w600 {
  width: 600px;
}
.h400 {
  height: 400px;
}
.ml74{
    padding-left: 74px;
}

.rootelement {
  position: relative;
}
.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.border-radius{
  border-radius:18px;
}
.search{
    padding: 14px 20px;
    background: #FFFFFF;
    border-radius: 18px;
    margin-bottom: 14px;
}
/*公共部分*/
</style>