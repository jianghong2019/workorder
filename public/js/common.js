
var hasFaBu = false;//是否是发布人
var hasBianZhi = false;//是否是编制人
//打包地址
// var config_fileUrl = "http://1.192.147.48:30039";
var config_fileUrl = "http://192.168.11.135:19000";
var config_downUrl = "http://192.168.11.135:9006";

//外网
// var config_fileUrl = "http://1.192.147.48:30039";
// 开发
var config_fileUrl_dev = "http://192.168.11.42:19000";
var config_downUrl_dev = "http://192.168.11.42:8083";
// 测试
var config_fileUrl_test = "http://192.168.11.135:19000";
//时间转字符串
//传入date类型返回格式2020-08-20 16:47:22
function formatDateTime(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h=h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second=date.getSeconds();
    second=second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
};

//2020-08-20 12:12:12
function formatStringToTimeInterval(date){
  date = date.replace(/-/g,'/'); //必须把日期'-'转为'/'
  return new Date(date).getTime();
}

//两个时间戳的时间差
function timeInterval(time1,time2){
  var time = Math.abs(time1 - time2);
  return time/1000/60/60;
}

//获取本周时间段传时间对象
function weekTimeSlot(date){
  let week = date.getDay()
  let weekArr = [6,0,1,2,3,4,5]
  let weekStart = date.getTime() - (weekArr[week] * 86400000)
  let weekEnd =  date.getTime() + ((6 - weekArr[week]) * 86400000)
  return [formatDate(new Date(weekStart)),formatDate(new Date(weekEnd))]
}

//获取本月时间段传时间对象
function monthInterval(date){
  let time = formatDate(date).split('-')
  let monthStart = `${time[0]}-${time[1]}-01`
  let month = ''
  if(time[1] < 12){
    month = `${time[0]}-${time[1][0]}${time[1][1]-0+1}-01`
  }else{
    month = `${time[0]-0+1}-01-01`
  }
  let monthTime = new Date(month).getTime() - 86400000
  let monthEnd = formatDate(new Date(monthTime))
  return [monthStart,monthEnd]
}

//时间转字符串
//传入date类型返回格式2020-08-20
function formatDate(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h=h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second=date.getSeconds();
    second=second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d;
};

////num是正数表示之后的时间，num负数表示之前的时间，0表示今天
function dateAfterdays(date,num) {
  var time1 = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  var date2 = new Date(date);
  date2.setDate(date.getDate() + num);

  var time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
  return time2;
}

//时间字符串转时间字符串
//传入时间字符串2020-08-20 12:12:12 返回格式2020-08-20 12:12
function formatDateString2DateString(date) {
  date = date.replace(/-/g,'/');
  date = new Date(date);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h=h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;
  return y + '-' + m + '-' + d+' '+h+':'+minute;
};

// 获取前一天时间
function getYesterday(date){
  let yesterday = date.getTime() - 86400000
  return formatDate(new Date(yesterday))
}
// 获取后一天时间
function getTomorrow(date){
  let tomorrow = date.getTime() + 86400000
  return formatDate(new Date(tomorrow))
}
class Storage{
    constructor(name){
        this.name = 'storage';
    }
    //设置缓存
    setItem(params){
        let obj = {
            name:'',
            value:'',
            expires:"",
            startTime:new Date().getTime()//记录何时将值存入缓存，毫秒级
        }
        let options = {};
        //将obj和传进来的params合并
        Object.assign(options,obj,params);
        if(options.expires){
        //如果options.expires设置了的话
        //以options.name为key，options为值放进去
            localStorage.setItem(options.name,JSON.stringify(options));
        }else{
        //如果options.expires没有设置，就判断一下value的类型
           	let type = Object.prototype.toString.call(options.value);
           	//如果value是对象或者数组对象的类型，就先用JSON.stringify转一下，再存进去
            if(Object.prototype.toString.call(options.value) == '[object Object]'){
                options.value = JSON.stringify(options.value);
            }
            if(Object.prototype.toString.call(options.value) == '[object Array]'){
                options.value = JSON.stringify(options.value);
            }
            localStorage.setItem(options.name,options.value);
        }
    }
    //拿到缓存
    getItem(name){
        let item = localStorage.getItem(name);
        //先将拿到的试着进行json转为对象的形式
        try{
            item = JSON.parse(item);
        }catch(error){
        //如果不行就不是json的字符串，就直接返回
            item = item;
        }
        //如果有startTime的值，说明设置了失效时间
        if(item.startTime){
            let date = new Date().getTime();
            //何时将值取出减去刚存入的时间，与item.expires比较，如果大于就是过期了，如果小于或等于就还没过期
            if(date - item.startTime > item.expires){
            //缓存过期，清除缓存，返回false
                localStorage.removeItem(name);
                return false;
            }else{
            //缓存未过期，返回值
                return item.value;
            }
        }else{
        //如果没有设置失效时间，直接返回值
            return item;
        }
    }
    //移出缓存
    removeItem(name){
        localStorage.removeItem(name);
    }
    //移出全部缓存
    clear(){
        localStorage.clear();
    }
}
//设置按钮延时，默认1秒 e：click事件，d 延迟时间
function setBtnDisabledWithDelay(e,d){
	var delay = 1000;
	if(d){
		delay = d;
	}
	if(e){
		e.currentTarget.disabled = true;
		var target = e.currentTarget;
	    setTimeout(() => {
	    	target.disabled = false;
	    }, delay)
	}
}
//校验特殊字符
function checkSpecial(val){
  let codeReg = new RegExp("^[\u4e00-\u9fa5_a-zA-Z0-9]+$"), //正则 中英文数字加_
    len = val.length,
    str = '';
  for (var i = 0; i < len; i++) {
    if (codeReg.test(val[i])) {
      str += val[i];
    }
  }
  return str;
}
function getFileURL(file) {
  let getUrl = null;
  if (window.createObjectURL !== undefined) { // basic
    getUrl = window.createObjectURL(file);
  } else if (window.URL !== undefined) { // mozilla(firefox)
    getUrl = window.URL.createObjectURL(file);
  } else if (window.webkitURL !== undefined) { // webkit or chrome
    getUrl = window.webkitURL.createObjectURL(file);
  }
  return getUrl;
}

var compare = function (prop) {
  return function (obj1, obj2) {
      var val1 = obj1[prop];
      var val2 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
          val1 = Number(val1);
          val2 = Number(val2);
      }
      if (val1 < val2) {
          return -1;
      } else if (val1 > val2) {
          return 1;
      } else {
          return 0;
      }            
  } 
}