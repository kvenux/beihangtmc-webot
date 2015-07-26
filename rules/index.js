var crypto = require('crypto');
var rf=require("fs");

var debug = require('debug');
var log = debug('webot-example:log');
var verbose = debug('webot-example:verbose');
var error = debug('webot-example:error');

var _ = require('underscore')._;
var search = require('../lib/support').search;
var geo2loc = require('../lib/support').geo2loc;

var package_info = require('../package.json');
var Segment = require('segment');

var defaultOptions = {
  url: 'http://api.pullword.com/post.php', /* api url */
  threshold: 0.5, /* must be [0-1] */
  debug: 0, /* debug=1, debug mode in on(show all probabilities of each word) */
  array: 0 /* array=0, return raw-string */

};


var api = require('pullword')(defaultOptions);
/**
 * 初始化路由规则
 */
module.exports = exports = function(webot){
  var global_flag=0
  var global_res=''
  var reg_help = /^(help|\?)$/i
  var last_word=''
  webot.set({
    // name 和 description 都不是必须的
    name: 'hello help',
    description: '获取使用帮助，发送 help',
    pattern: function(info) {
      //首次关注时,会收到subscribe event
      return info.is('event') && info.param.event === 'subscribe' || reg_help.test(info.text);
    },
    handler: function(info){
      var reply = {
        title: '欢迎来到北航Toastmasters',
        pic: 'http://kvenux.qiniudn.com/tags.png',
        url: 'http://beihangtm.sinaapp.com/',
        description: [
          '回复以下关键字，人家就会帮你哟~',
          '[map] 查看北航Toastmaster会议室地图',
          '[who] 北航Toastmaster基本介绍',
          '[rolebook] 查看各类role的入门指导',
          '[visit] 拜访各个俱乐部的地址',
          '[officer] 查看各officer职位介绍',
          '[status] 查看本周会议角色预定情况',
          '[status 106] 查看第106次会议角色预定情况,106表示会议次数',
          '[career Name] 查看Member生涯数据',
          '[booking 92 Timer] 会员预定会议角色，92表示会议次数，Timer表示角色名',
          '[cancel 92 Timer] 会员取消会议角色',
          '[contact Name] 查看Member通讯录',
          '[rolehis Name] 查看会员担任过所有角色的日期',
          '[reg Name] 新会员在公众平台上注册',
          '点击「查看全文」将跳转到我们的博客哟'
        ].join('\n')
      };
      // 返回值如果是list，则回复图文消息列表
      return reply;
    }
  });

  // 更简单地设置一条规则
  /*webot.set(/^more$/i, function(info){*/
  /*var reply = _.chain(webot.gets()).filter(function(rule){*/
  /*return rule.description;*/
  /*}).map(function(rule){*/
  /*//console.log(rule.name)*/
  /*return '> ' + rule.description;*/
  /*}).join('\n').value();*/
  /**/
  /*return ['我的主人还没教我太多东西,你可以考虑帮我加下.\n可用的指令:\n'+ reply,*/
  /*'没有更多啦！当前可用指令：\n' + reply];*/
  /*});*/

  webot.set('career', {
    description: '回复career Name，查看你担任过的角色和完成的演讲',
    // pattern 既可以是函数，也可以是 regexp 或 字符串(模糊匹配)
    pattern: /^(career )\s*(.*)$/i,
    // 回复handler也可以直接是字符串或数组，如果是数组则随机返回一个子元素
    /*handler: 'career,{2}'*/
    handler: function(info){
      console.log(info.param[2])
      /*var rf=require("fs");*/
      var data=rf.readFileSync("roletaken_new.csv","utf-8");
      console.log(data);
      var line=data.split("\n");
      console.log(line[2]);
      var oneline = line[1]
      var words = oneline.split(",")
      /*var rdlist = csv().from(data).to(console.log);*/
      var result = "你好,"+ info.param[2];
      var flag=0
      /*var name=info.param[2].toLowerCase()*/
      var name=info.param[2]
      for (var i=0;i<line.length;i++){
        /*console.log(line[i]);*/
        oneline = line[i]
        words = oneline.split(",")
        var newname = words[1]
        /*console.log(newname+name);*/
        /*console.log(name);*/
        if(newname==name){
          flag=1
          console.log(words[1]);
          result= newname+'于'+words[2]+'加入BeihangToastmasters\n'
          result+= '截止目前你总共完成：\n'
          result+= words[3]+'次 Toastmaster,\n'
          result+= words[4]+'次 TableTopicMaster,\n'
          result+= words[6]+'次 Timer,\n'
          result+= words[7]+'次 Ah-Counter,\n'
          result+= words[8]+'次 Grammarian,\n'
          result+= words[9]+'次 GeneralEvaluator,\n'
          result+= words[10]+'次 TableTopicEvaluator,\n'
          result+= words[11]+'次 PreparedSpeechEvaluator,\n'
          result+= '已经完成'+words[5]+',\n'
          result+= '一共承担角色'+words[14]+'次\n'
          result+= '感谢你对BeihangTMC做出的贡献，一路上因为有你，所以精彩！'
        }

        /*for(var j=0;j<)*/
      }
      if(flag==1){
        return result
      }

      return 'not member,' + info.param[2]
    }
  });

  webot.set('rolehis', {
    description: '回复rolehis Name，查看你担任过的角色和完成的演讲',
    // pattern 既可以是函数，也可以是 regexp 或 字符串(模糊匹配)
    pattern: /^(rolehis )\s*(.*)$/i,
    // 回复handler也可以直接是字符串或数组，如果是数组则随机返回一个子元素
    /*handler: 'career,{2}'*/
    handler: function(info){
      console.log(info.param[2])
      /*var rf=require("fs");*/
      var data=rf.readFileSync("rolehis.csv","utf-8");
      var line=data.split("\n");
      var oneline = line[0]
      var names = oneline.split(",")
      /*var rdlist = csv().from(data).to(console.log);*/
      var flag=0
      /*var name=info.param[2].toLowerCase()*/
      var name=info.param[2]
      name=name.toLowerCase()
      result='Hi, '+name+' 你担任过的角色有：\n'
      for (var i=2;i<names.length;i++){
        /*console.log(names[i])*/
        /*console.log(name)*/
        /*console.log(names[i]==name)*/

        if(names[i].toLowerCase()==name){
          flag=1
          for(j=2;j<line.length-1;j++){
            words=line[j].split(',')
            if(words[i]!=''){
              result+=words[0]+' '+words[1]+' '+words[i]+'\n'
            }
          }
          break;
        }
      }
      if(flag==1){
        return result
      }

      return 'You are not member, ' + info.param[2]
    }
  });
  /*
  webot.set('who_are_you', {
    description: '想知道我是谁吗? 发送: who?',
    // pattern 既可以是函数，也可以是 regexp 或 字符串(模糊匹配)
    pattern: /who|你是[谁\?]+/i,
    // 回复handler也可以直接是字符串或数组，如果是数组则随机返回一个子元素
    handler: ['我是北航头马的机器人，叫人家小北北┑(￣▽ ￣)┍', '小玫瑰2号']
  });
  */


  /*
  // 可以通过回调返回结果
  webot.set('search', {
description: '发送: s 关键词 ',
pattern: /^(?:搜索?|search|百度|s\b)\s*(.+)/i,
//handler也可以是异步的
handler: do_search
});
*/
/*
   webot.waitRule('wait_timeout', function(info) {
   if (new Date().getTime() - info.session.wait_begin > 5000) {
   delete info.session.wait_begin;
   return '你的操作超时了,请重新输入';
   } else {
   return '你在规定时限里面输入了: ' + info.text;
   }
   });

// 超时处理
webot.set('timeout', {
description: '输入timeout, 等待5秒后回复,会提示超时',
pattern: 'timeout',
handler: function(info) {
info.session.wait_begin = new Date().getTime();
info.wait('wait_timeout');
return '请等待5秒后回复';
}
});
*/
/**
 * Wait rules as lists
 *
 * 实现类似电话客服的自动应答流程
 *
 */
  webot.set('status', {
    description: '回复status，查看本周meeting role预定情况',
    // pattern 既可以是函数，也可以是 regexp 或 字符串(模糊匹配)
    pattern: /^(status )\s*(.*)$/i,
    // 回复handler也可以直接是字符串或数组，如果是数组则随机返回一个子元素
    /*handler: 'career,{2}'*/
    handler: function(info){
      /*User.get(info.uid, function(err, user) {
        if (err) return next(err);
        info.user = user; // attach this user object to Info.
        next();
        });*/
      var num=info.param[2]
      var data=rf.readFileSync("roleassign.csv","utf-8");
      var line=data.split("\n");
      var flag=0
      if(num==95){
        data=rf.readFileSync("marason.csv","utf-8");
        line=data.split("\n");
        words=line[0].split(',')
        result='第'+num+'次会议Role Assign情况：\n'
        result+= 'TM: '+words[1]+' \n'
        result+= 'GE: '+words[2]+' \n'
        result+= 'Timer: '+words[3]+' \n'
        result+= 'Ah-Counter: '+words[4]+' \n'
        result+= 'Grammarian: '+words[5]+' \n'
        result+= 'Speaker1: '+words[6]+' \n'
        result+= 'Speaker2: '+words[7]+' \n'
        result+= 'Speaker3: '+words[8]+' \n'
        result+= 'Speaker4: '+words[9]+' \n'
        result+= 'Speaker5: '+words[10]+' \n'
        result+= 'Speaker6: '+words[11]+' \n'
        result+= 'Speaker7: '+words[12]+' \n'
        result+= 'Evaluator1: '+words[13]+' \n'
        result+= 'Evaluator2: '+words[14]+' \n'
        result+= 'Evaluator3: '+words[15]+' \n'
        result+= 'Evaluator4: '+words[16]+' \n'
        result+= 'Evaluator5: '+words[17]+' \n'
        result+= 'Evaluator6: '+words[18]+' \n'
        result+= 'Evaluator7: '+words[19]+' \n'
        return result
      }
      titles=line[0].split(",")
      /*days=(new Date() - new Date(2015,3,10,0,0,0))/1000/60/60/24;*/
      /*num=92+parseInt(days/7);*/
      for (var i=0;i<line.length;i++){
        oneline = line[i]
        words = oneline.split(",")
        var newnum = words[0]
        if(newnum==num){
          flag=1
          result='第'+num+'次会议Role Assign情况：\n'
          console.log(info.uid)
          /*for(var j=1;j<titles.length;j++){*/
          for(var j=1;j<13;j++){
            result+=titles[j]+": "+words[j]+'\n'
          }
          /*result+= 'TM: '+words[1]+' \n'*/
          /*result+= 'TTM: '+words[2]+' \n'*/
          /*result+= 'GE: '+words[3]+' \n'*/
          /*result+= 'Timer: '+words[4]+' \n'*/
          /*result+= 'Ah-Counter: '+words[5]+' \n'*/
          /*result+= 'Grammarian: '+words[6]+' \n'*/
          /*result+= 'Speaker1: '+words[7]+' \n'*/
          /*result+= 'Speaker2: '+words[8]+' \n'*/
          /*result+= 'Speaker3: '+words[9]+' \n'*/
          /*result+= 'Evaluator1: '+words[10]+' \n'*/
          /*result+= 'Evaluator2: '+words[11]+' \n'*/
          /*result+= 'Evaluator3: '+words[12]+' \n'*/
        }

      }
      if(flag==1){
        return result
      }
      return '不知所云'
    }
  });

  webot.set(/^(reg )\s*(.*)$/i, function(info) {
    var data=rf.readFileSync("reg_unchecked.csv","utf-8");
    var line=data.split("\n");
    var flag=0
    console.log(info.param[2])
    /*console.log(info.param[1])*/
    /*var id=info.param[2]*/
    id=info.uid
    for (var i=0;i<line.length-1;i++){
      oneline = line[i]
      words = oneline.split(",")
      var newid = words[1]
      if(id.length == newid.length - 1){
        newid=newid.substring(0, newid.length-1)
      }
      if(newid==id){
        flag=1
        result='Hi '+words[0]+', you have already signed up'
      }
    }
    if(flag==1){
      return result
    }
    else{
      newline=info.param[2]+','+info.uid+'\n'
      line.push(newline)
      lines=line.join('\n')
      rf.writeFile('reg_unchecked.csv',lines)
      return 'Hi '+info.param[2]+', 成功注册!请通知Mauna Loa进行后台审核'
    }
    return '不知所云'
  });

  webot.set(/^status/i, function(info) {
    var data=rf.readFileSync("roleassign.csv","utf-8");
    var line=data.split("\n");
    var flag=0
    titles=line[0].split(",")
    days=(new Date() - new Date(2015,3,18,0,0,0))/1000/60/60/24;
    num=92+parseInt(days/7);
    if(num==95){
      data=rf.readFileSync("marason.csv","utf-8");
      line=data.split("\n");
      words=line[0].split(',')
      result='第'+num+'次会议Role Assign情况：\n'
      result+= 'TM: '+words[1]+' \n'
      result+= 'GE: '+words[2]+' \n'
      result+= 'Timer: '+words[3]+' \n'
      result+= 'Ah-Counter: '+words[4]+' \n'
      result+= 'Grammarian: '+words[5]+' \n'
      result+= 'Speaker1: '+words[6]+' \n'
      result+= 'Speaker2: '+words[7]+' \n'
      result+= 'Speaker3: '+words[8]+' \n'
      result+= 'Speaker4: '+words[9]+' \n'
      result+= 'Speaker5: '+words[10]+' \n'
      result+= 'Speaker6: '+words[11]+' \n'
      result+= 'Speaker7: '+words[12]+' \n'
      result+= 'Evaluator1: '+words[13]+' \n'
      result+= 'Evaluator2: '+words[14]+' \n'
      result+= 'Evaluator3: '+words[15]+' \n'
      result+= 'Evaluator4: '+words[16]+' \n'
      result+= 'Evaluator5: '+words[17]+' \n'
      result+= 'Evaluator6: '+words[18]+' \n'
      result+= 'Evaluator7: '+words[19]+' \n'
      return result

    }
    for (var i=0;i<line.length;i++){
      oneline = line[i]
      words = oneline.split(",")
      var newnum = words[0]
      if(newnum==num){
        flag=1
        result='第'+num+'次会议Role Assign情况：\n'
        /*for(var j=1;j<titles.length;j++){*/
        for(var j=1;j<13;j++){
          result+=titles[j]+": "+words[j]+'\n'
        }
        /*result+= 'TM: '+words[1]+' \n'*/
        /*result+= 'TTM: '+words[2]+' \n'*/
        /*result+= 'GE: '+words[3]+' \n'*/
        /*result+= 'Timer: '+words[4]+' \n'*/
        /*result+= 'Ah-Counter: '+words[5]+' \n'*/
        /*result+= 'Grammarian: '+words[6]+' \n'*/
        /*result+= 'Speaker1: '+words[7]+' \n'*/
        /*result+= 'Speaker2: '+words[8]+' \n'*/
        /*result+= 'Speaker3: '+words[9]+' \n'*/
        /*result+= 'Evaluator1: '+words[10]+' \n'*/
        /*result+= 'Evaluator2: '+words[11]+' \n'*/
        /*result+= 'Evaluator3: '+words[12]+' \n'*/
      }

    }
    if(flag==1){
      return result
    }
    return '不知所云'
  });

  /*
     rs='要预定role的话呢，首先回答我一个问题；\n'
     var Rand = Math.random();
     if(Rand<0.25){
     info.wait('sophie');
     return res+'最会养花的人是谁？'
     }
     if(Rand<0.50){
     info.wait('monk');
     return res+'男女通吃的是谁？'
     }
     if(Rand<0.75){
     info.wait('jane');
     return res+'有一位彪悍的护士叫？'
     }
     else{
     info.wait('elena');
     return res+'软件学院的特别爱放鸽子的？'
     }
     */
  webot.set(/^(booking )\s*(.*)$/i, function(info) {
    var data=rf.readFileSync("reg_checked.csv","utf-8");
    var line=data.split("\n");
    var flag=0
    console.log(info.param[2])
    require=info.text;
    paras=require.split(' ')
    /*console.log(info.param[1])*/
    /*var id=info.param[2]*/
    name=''
    id=info.uid
    console.log(info.uid)
    for (var i=0;i<line.length-1;i++){
      oneline = line[i]
      words = oneline.split(",")
      var newid = words[1]
      /*console.log(newid)*/
      /*console.log(id.length)*/
      /*console.log(newid.length)*/
      if(id.length == newid.length - 1){
        newid=newid.substring(0, newid.length-1)
      }
      if(newid==id){
        flag=1
        name=words[0]
      }
    }
    if(flag==1){
      var newdata=rf.readFileSync("roleassign.csv","utf-8");
      var line=newdata.split("\n");

      if(paras.length>=3){
        num=paras[1]
        role=paras[2]
        titleline=line[0]
        titles=titleline.split(',')
        for (var i=1;i<line.length;i++){
          oneline = line[i]
          words = oneline.split(",")
          var newnum = words[0]
          if(newnum==num){
            for(var j=0;j<words.length;j++){
              if(titles[j]==role){
                if(words[j]==''){
                  words[j]=name
                  line[i]=words.join(',')
                  lines=line.join('\n')
                  rf.writeFile('roleassign.csv',lines)
                  return '成功预定 第'+num+'次会议 '+role+'一枚！积极准备哟~'
                }
                else{
                  return '这个坑被'+words[j]+'给占了，快去把他撵走'
                }
              }
            }
          }
        }
        return '不知所云'
      }
    }
    else{
      return '亲你不是我们的会员哟\n如果你是member，请回复reg Name来注册\n注册后才能预定角色\n还得通知Mauna Loa审核一下哈'
    }
  });

  webot.set(/^(cancel )\s*(.*)$/i, function(info) {
    var data=rf.readFileSync("reg_checked.csv","utf-8");
    var line=data.split("\n");
    var flag=0
    console.log(info.param[2])
    require=info.text;
    paras=require.split(' ')
    /*console.log(info.param[1])*/
    /*var id=info.param[2]*/
    name=''
    id=info.uid
    console.log(info.uid)
    for (var i=0;i<line.length-1;i++){
      oneline = line[i]
      words = oneline.split(",")
      var newid = words[1]
      console.log(newid)
      console.log(id)
      if(id.length == newid.length - 1){
        newid=newid.substring(0, newid.length-1)
      }
      if(newid==id){
        flag=1
        name=words[0]
        /*result='Hi '+words[0]+', you have already signed up'*/
      }
    }
    if(flag==1){
      var newdata=rf.readFileSync("roleassign.csv","utf-8");
      var line=newdata.split("\n");

      if(paras.length>=3){
        num=paras[1]
        role=paras[2]
        titleline=line[0]
        titles=titleline.split(',')
        for (var i=1;i<line.length;i++){
          oneline = line[i]
          words = oneline.split(",")
          var newnum = words[0]
          if(newnum==num){
            for(var j=0;j<words.length;j++){
              if(titles[j]==role){
                if(words[j]==name){
                  words[j]=''
                  line[i]=words.join(',')
                  lines=line.join('\n')
                  rf.writeFile('roleassign.csv',lines)
                  return '第'+num+'次会议 '+role+'取消了。。。\n怎嘛不做啦？╭(╯^╰)╮一脸怨念'
                }
                else if(words[j]==''){
                  return '奏凯！这坑都没人做！'
                }
                else{
                  return '奏凯！这个坑是'+words[j]+'的，你取消个毛线'
                }
              }
            }
          }
        }
        return '不知所云'
      }
    }
    else{
      return '亲你不是我们的会员哟\n如果你是member，请回复reg Name来注册\n注册后才能预定角色\n还得通知Keven审核一下哈'
    }
  });

  webot.set(/^(contact )\s*(.*)$/i, function(info) {
    var data=rf.readFileSync("reg_checked.csv","utf-8");
    var line=data.split("\n");
    var flag=0
    require=info.text;
    paras=require.split(' ')
    name=''
    id=info.uid
    console.log(info.uid)
    for (var i=0;i<line.length-1;i++){
      oneline = line[i]
      words = oneline.split(",")
      var newid = words[1]
      if(id.length == newid.length - 1){
        newid=newid.substring(0, newid.length-1)
      }
      if(newid==id){
        flag=1
        name=words[0]
        /*result='Hi '+words[0]+', you have already signed up'*/
      }
    }
    if(flag==1){
      var newdata=rf.readFileSync("contact.csv","utf-8");
      var line=newdata.split("\n");

      if(paras.length>=2){
        console.log(paras[1])
        name=paras[1]
        name=name.toLowerCase()
        for (var i=1;i<line.length;i++){
          oneline = line[i]
          words = oneline.split(",")
          /*newname = words[1]*/
          newname=words[1].toLowerCase()
          if(newname==name){
            result='姓名:'+words[0]+' '+words[1]
            result+='\n家乡:'+words[2]
            result+='\n星座:'+words[3]
            result+='\n电话:'+words[4]
            result+='\n邮箱:'+words[5]
            return result
          }
        }
        return '不知所云'
      }
    }
    else{
      return '亲你不是我们的会员哟\n如果你是member，请回复reg Name来注册\n注册后才能预定角色\n还得通知Keven审核一下哈'
    }
  });

  webot.set(/^vote/i, function(info) {
    var data=rf.readFileSync("theme.csv","utf-8");
    var line=data.split("\n");
    days=(new Date() - new Date(2015,3,18,0,0,0))/1000/60/60/24;
    num=92+parseInt(days/7);
    res = '欢迎参与第' + num +'次会议主题讨论\n'
    res += '本次投票的主要议题有:\n'
    for (var i=0;i<line.length-1;i++){
      oneline = line[i]
      words = oneline.split(",")
      num = i+1
      res += num+ '.' + words[0] +' '+ words[1]+'票\n'
    }
    res += '直接回复数字参与投票\n'
    info.wait('vote')
    return res
  });

  webot.waitRule('vote', function(info) {
    var data=rf.readFileSync("theme.csv","utf-8");
    var line=data.split("\n");
    num = parseInt(info.text)
    console.log(num)
    for (var i=0;i<line.length;i++){
      oneline = line[i]
      words = oneline.split(",")
      number = i+1
      if(num == number){
        words[1] = parseInt(words[1])+1
        line[i]=words.join(',')
        lines=line.join('\n')
        rf.writeFile('theme.csv',lines)
        break
      }
    }
    line=lines.split('\n')
    res = '投票成功：\n'
    for (var i=0;i<line.length-1;i++){
      oneline = line[i]
      words = oneline.split(",")
      number = i+1
      res += number+ '.' + words[0] +' '+ words[1]+'票\n'
    }
    res += '谢谢支持！'
    return res;
  });

  webot.waitRule('sophie', function(info) {
    if(info.text=='sophie' || info.text=='Sophie'){
      info.wait('number');
      days=(new Date() - new Date(2015,3,10,0,0,0))/1000/60/60/24;
      num=92+parseInt(days/7);
      words='温馨提示：回复数字，下次meeting是第'+num+'次';
      return '咳咳自己人，你要订哪次的？\n'+words;
    }
    res='不是我们的人！拖出去打PP！！'
    return res;
  });
  webot.waitRule('monk', function(info) {
    if(info.text=='monk' || info.text=='Monk'){
      info.wait('number');
      days=(new Date() - new Date(2015,3,10,0,0,0))/1000/60/60/24;
      num=92+parseInt(days/7);
      words='温馨提示：回复数字，下次meeting是第'+num+'次';
      return '咳咳自己人，你要订哪次的？\n'+words;
    }
    res='不是我们的人！拖出去打PP！！'
    return res;
  });
  webot.waitRule('jane', function(info) {
    if(info.text=='jane' || info.text=='Jane'){
      info.wait('number');
      days=(new Date() - new Date(2015,3,10,0,0,0))/1000/60/60/24;
      num=92+parseInt(days/7);
      words='温馨提示：回复数字，下次meeting是第'+num+'次';
      return '咳咳自己人，你要订哪次的？\n'+words;
    }
    res='不是我们的人！拖出去打PP！！'
    return res;
  });
  webot.waitRule('elena', function(info) {
    if(info.text=='elena' || info.text=='Elena'){
      info.wait('number');
      days=(new Date() - new Date(2015,3,10,0,0,0))/1000/60/60/24;
      num=92+parseInt(days/7);
      words='温馨提示：回复数字，下次meeting是第'+num+'次';
      return '咳咳自己人，你要订哪次的？\n'+words;
    }
    res='不是我们的人！拖出去打PP！！'
    return res;
  });
  webot.waitRule('number', function(info) {
    num=info.text;
    /*console.log(info.param[2])*/
    var data=rf.readFileSync("roleassign.csv","utf-8");
    var line=data.split("\n");
    var flag=0
    var name=info.param[2]
    for (var i=0;i<line.length;i++){
      oneline = line[i]
      words = oneline.split(",")
      var newnum = words[0]
      if(newnum==num){
        flag=1
        result='第'+num+'次会议Role Assign情况：\n'
        result+= 'TM: '+words[1]+' \n'
        result+= 'TTM: '+words[2]+' \n'
        result+= 'GE: '+words[3]+' \n'
        result+= 'Timer: '+words[4]+' \n'
        result+= 'Ah-Counter: '+words[5]+' \n'
        result+= 'Grammarian: '+words[6]+' \n'
        result+= 'Speaker1: '+words[7]+' \n'
        result+= 'Speaker2: '+words[8]+' \n'
        result+= 'Speaker3: '+words[9]+' \n'
        result+= 'Evaluator1: '+words[10]+' \n'
        result+= 'Evaluator2: '+words[11]+' \n'
        result+= 'Evaluator3: '+words[12]+' \n'
      }

    }
    if(flag==1){
      info.wait('assign');
      return result+'回复 次数 角色 姓名 预定\n如 92 Speaker1 Keven'
    }

    return '不知道你说的是哪一次T_T'
  });

  webot.waitRule('assign', function(info) {
    /*var newrf=require('fs');*/
    var newdata=rf.readFileSync("roleassign.csv","utf-8");
    var line=newdata.split("\n");
    var flag=0
    var require=info.text;
    var paras=require.split(' ')

    if(paras.length==3){
      num=paras[0];
      role=paras[1];
      name=paras[2];
      titleline=line[0]
      titles=titleline.split(',')
      for (var i=1;i<line.length;i++){
        oneline = line[i]
        words = oneline.split(",")
        var newnum = words[0]
        if(newnum==num){
          for(var j=0;j<words.length;j++){
            if(titles[j]==role){
              flag=1
              if(words[j]==''){
                words[j]=name
                line[i]=words.join(',')
                lines=line.join('\n')
                rf.writeFile('roleassign.csv',lines)
                return '成功预定 第'+num+'次会议 '+role+'一枚！积极准备哟~'
              }
              else{
                return '这个坑被'+words[j]+'给占了，快去把他撵走'
              }
            }
          }
        }
      }
      return '不知所云'
    }
    return '不知所云'
  });

  webot.waitRule('test', {
    'sophie': 'webot ' + package_info.version,
    'Sophie': function(info) {
      info.wait('list-2');
      return '请选择人名:\n' +
        '1 - Marry\n' +
        '2 - Jane\n' +
        '3 - 自定义'
    }
  });
  webot.waitRule('list', {
    '1': 'webot ' + package_info.version,
    '2': function(info) {
      info.wait('list-2');
      return '请选择人名:\n' +
        '1 - Marry\n' +
        '2 - Jane\n' +
        '3 - 自定义'
    }
  });
  webot.waitRule('list-2', {
    '1': '你选择了 Marry',
    '2': '你选择了 Jane',
    '3': function(info) {
      info.wait('list-2-3');
      return '请输入你想要的人';
    }
  });
  webot.waitRule('list-2-3', function(info) {
    if (info.text) {
      return '你输入了 ' + info.text;
    }
  });


  //支持location消息 此examples使用的是高德地图的API
  //http://restapi.amap.com/rgeocode/simple?resType=json&encode=utf-8&range=3000&roadnum=0&crossnum=0&poinum=0&retvalue=1&sid=7001&region=113.24%2C23.08
  /*
     webot.set('check_location', {
description: '发送你的经纬度,我会查询你的位置',
pattern: function(info){
return info.is('location');
},
handler: function(info, next){
geo2loc(info.param, function(err, location, data) {
location = location || info.label;
next(null, location ? '你正在' + location : '我不知道你在什么地方。');
});
}
});
*/
  //图片
  /*
     webot.set('check_image', {
description: '发送图片,我将返回其hash值',
pattern: function(info){
return info.is('image');
},
handler: function(info, next){
verbose('image url: %s', info.param.picUrl);
try{
var shasum = crypto.createHash('md5');

var req = require('request')(info.param.picUrl);

req.on('data', function(data) {
shasum.update(data);
});
req.on('end', function() {
return next(null, '你的图片hash: ' + shasum.digest('hex'));
});
}catch(e){
error('Failed hashing image: %s', e)
return '生成图片hash失败: ' + e;
}
}
});
*/
  // 回复图文消息
  webot.set('reply_letter', {
    description: '发送letter,查看最近的welcome letter',
    pattern: /^letter\s*(\d*)$/,
    handler: function(info){
      var reply = [
        {title: 'Autumn @BeihangTMC 78th Meeting on Fri Nov 14th', description: '', pic: 'http://kvenux.qiniudn.com/78th.jpg', url: 'http://mp.weixin.qq.com/s?__biz=MzA3NDM0NzUyOQ==&mid=201133110&idx=1&sn=200eb3061f3fc8c00be41a6a3b0ee1cc#rd'},
        {title: 'Movies @BeihangTMC 77th Meeting on Fri Nov 7th', description: '', pic: 'http://kvenux.qiniudn.com/77th.jpg', url: 'http://mp.weixin.qq.com/s?__biz=MzA3NDM0NzUyOQ==&mid=201027836&idx=1&sn=9134e2b3f9feab4e36ff28b3d2540d8f#rd'},
        {title: 'Halloween @BeihangTMC 76th Meeting on Fri Oct 31th', description: '', pic: 'http://kvenux.qiniudn.com/76th.jpg', url: 'http://mp.weixin.qq.com/s?__biz=MzA3NDM0NzUyOQ==&mid=200926020&idx=1&sn=f160463064b2441bd275206124522f6e#rd'}
      ];
      // 发送 "news 1" 时只回复一条图文消息
      return Number(info.param[1]) == 1 ? reply[0] : reply;
    }
  });

  webot.set('reply_map', {
    description: '发送map,查看最近的meeting minutes',
    pattern: /^map\s*(\d*)$/,
    handler: function(info){
      var reply = [
        {title: 'How to get to Beihang TMC meeting place', description: '', pic: 'http://beihangtmc.qiniudn.com/map.jpg', url: 'http://mp.weixin.qq.com/s?__biz=MzA3NDM0NzUyOQ==&mid=206313644&idx=2&sn=89536d2ce3c6e8398eebaa327c2b5c63#rd'},
      ];
      // 发送 "news 1" 时只回复一条图文消息
      return Number(info.param[1]) == 1 ? reply[0] : reply;
    }
  });
  webot.set('reply_who', {
    description: '发送map,查看最近的meeting minutes',
    pattern: /^who\s*(\d*)$/,
    handler: function(info){
      var reply = [
        {title: 'Who We Are', description: '', pic: 'http://beihangtmc.qiniudn.com/DSC05116.JPG', url: 'http://mp.weixin.qq.com/s?__biz=MzA3NDM0NzUyOQ==&mid=206313644&idx=3&sn=13d91c4d6811917454f45448e8cc074d#rd'},
      ];
      // 发送 "news 1" 时只回复一条图文消息
      return Number(info.param[1]) == 1 ? reply[0] : reply;
    }
  });
  webot.set('reply_visit', {
    description: '发送map,查看最近的meeting minutes',
    pattern: /^visit\s*(\d*)$/,
    handler: function(info){
      var reply = [
        {title: 'Information for Toastmasters Clubs in Beijing', description: '', pic: 'http://beihangtmc.qiniudn.com/visit.jpg', url: 'http://mp.weixin.qq.com/s?__biz=MzA3NDM0NzUyOQ==&mid=206665464&idx=1&sn=84879ae7e6ec718f70f943fd319f56d6#rd'},
      ];
      // 发送 "news 1" 时只回复一条图文消息
      console.log(reply);
      var newrep = {
        type: "image",
        content: {
          mediaId : 'http://beihangtmc.qiniudn.com/visit.jpg'
        }
      };

      /*return Number(info.param[1]) == 1 ? reply[0] : reply;*/
      /*return newrep;*/
      return reply;
    }
  });

  webot.set('reply_officer', {
    description: '发送map,查看最近的meeting minutes',
    pattern: /^officer\s*(\d*)$/,
    handler: function(info){
      var reply = [
        {title: 'Toastmasters Club各职位介绍', description: '', pic: 'http://beihangtmc.qiniudn.com/officer.jpg', url: 'http://mp.weixin.qq.com/s?__biz=MzA3NDM0NzUyOQ==&mid=206901402&idx=1&sn=6ddbfacaecd122658326212174c5158c#rd'},
      ];
      // 发送 "news 1" 时只回复一条图文消息
      return Number(info.param[1]) == 1 ? reply[0] : reply;
    }
  });

  webot.set('reply_minutes', {
    description: '发送minutes,查看最近的meeting minutes',
    pattern: /^minutes\s*(\d*)$/,
    handler: function(info){
      var reply = [
        {title: 'Autumn @BeihangTMC 78th Meeting Minutes', description: '', pic: 'http://kvenux.qiniudn.com/78th.jpg', url: 'http://mp.weixin.qq.com/s?__biz=MzA3NDM0NzUyOQ==&mid=201154544&idx=1&sn=984d0b91bcc9c877f359f1e6a8168eba#rd'},
        {title: 'Movies @BeihangTMC 77th Meeting Minutes', description: '', pic: 'http://kvenux.qiniudn.com/77th.jpg', url: 'http://mp.weixin.qq.com/s?__biz=MzA3NDM0NzUyOQ==&mid=201043963&idx=1&sn=2dc09d969cfd05d2f304c4d2035d2776#rd'},
        {title: 'Halloween @BeihangTMC 76th Meeting Minutes', description: '', pic: 'http://kvenux.qiniudn.com/76th.jpg', url: 'http://mp.weixin.qq.com/s?__biz=MzA3NDM0NzUyOQ==&mid=200974952&idx=1&sn=4f7e4fa1b5977ac3b290076c03a05af1#rd'}
      ];
      // 发送 "news 1" 时只回复一条图文消息
      return Number(info.param[1]) == 1 ? reply[0] : reply;
    }
  });

  webot.set('reply_rolebook', {
    description: '发送rolebook,查看角色担任指南',
    pattern: /^rolebook\s*(\d*)$/,
    handler: function(info){
      var reply = [
        {title: 'Toastmaster', description: '', pic: 'http://beihangtmc.qiniudn.com/tm.jpg', url: 'http://beihangtm.sinaapp.com/?page_id=115'},
        {title: 'Table Topic Master', description: '', pic: 'http://beihangtmc.qiniudn.com/ttm.jpg', url: 'http://beihangtm.sinaapp.com/?page_id=131'},
        {title: 'General Evaluator', description: '', pic: 'http://beihangtmc.qiniudn.com/ge.jpg', url: 'http://beihangtm.sinaapp.com/?page_id=172'},
        {title: 'Timer', description: '', pic: 'http://beihangtmc.qiniudn.com/timer.jpg', url: 'http://beihangtm.sinaapp.com/?page_id=152'},
        {title: 'Ah-Counter', description: '', pic: 'http://beihangtmc.qiniudn.com/ah.jpg', url: 'http://beihangtm.sinaapp.com/?page_id=157'},
        {title: 'Grammarian', description: '', pic: 'http://beihangtmc.qiniudn.com/gra.jpg', url: 'http://beihangtm.sinaapp.com/?page_id=161'},
        {title: 'Speech Evaluator', description: '', pic: 'http://beihangtmc.qiniudn.com/eva.jpg', url: 'http://beihangtm.sinaapp.com/?page_id=149'}
      ];
      // 发送 "news 1" 时只回复一条图文消息
      return Number(info.param[1]) == 1 ? reply[0] : reply;
    }
  });

  // 可以指定图文消息的映射关系
  webot.config.mapping = function(item, index, info){
    //item.title = (index+1) + '> ' + item.title;
    return item;
  };

  // 简单的纯文本对话，可以用单独的 yaml 文件来定义
  require('js-yaml');
  webot.dialog(__dirname + '/dialog.yaml');
  //所有消息都无法匹配时的fallback

  webot.set(/.*/, function(info){
  // 利用 error log 收集听不懂的消息，以利于接下来完善规则
  // 你也可以将这些 message 存入数据库
  log('unhandled message: %s', info.text);

  /*
  info.flag = true;
  var segment = new Segment();
  segment.useDefault();
  //
  console.log(segment.doSegment(info.text));
  res = segment.doSegment(info.text)
  word=res[0].w
  newdata=rf.readFileSync("material.csv","utf-8");
  line=newdata.split("\n");
  flag=0
  for (var i=1;i<line.length;i++){
    oneline=line[i]
    words = oneline.split(",")
    if(words[0]==word){
      flag=1
      return words[1]
    }
  }
  if(flag==0){
    last_word=word
    info.wait('savewords');
    return word+' 是什么意思？回复一下教教我呗。我会记住的'
  }

  return res[0].w
  */

  return '「' + info.text + '」?人家不懂诶。。。还是发 help吧';
  });

  webot.waitRule('savewords', function(info) {
    newdata=rf.readFileSync("material.csv","utf-8");
    line=newdata.split("\n");
    line[line.length]=last_word+','+info.text
    lines=line.join('\n')
    rf.writeFile('material.csv',lines)

    return '我记住了，'+last_word+' 是 '+info.text
  });
};
