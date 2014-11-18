var crypto = require('crypto');

var debug = require('debug');
var log = debug('webot-example:log');
var verbose = debug('webot-example:verbose');
var error = debug('webot-example:error');

var _ = require('underscore')._;
var search = require('../lib/support').search;
var geo2loc = require('../lib/support').geo2loc;

var package_info = require('../package.json');

/**
 * 初始化路由规则
 */
module.exports = exports = function(webot){
  var reg_help = /^(help|\?)$/i
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
          '你可以试试以下指令:',
            'game : 玩玩猜数字的游戏吧',
            '重看本指令请回复help或问号',
            '更多指令请回复more',
            '点击「查看全文」将跳转到我们的博客哟'
        ].join('\n')
      };
      // 返回值如果是list，则回复图文消息列表
      return reply;
    }
  });

  // 更简单地设置一条规则
  webot.set(/^more$/i, function(info){
    var reply = _.chain(webot.gets()).filter(function(rule){
      return rule.description;
    }).map(function(rule){
      //console.log(rule.name)
      return '> ' + rule.description;
    }).join('\n').value();

    return ['我的主人还没教我太多东西,你可以考虑帮我加下.\n可用的指令:\n'+ reply,
      '没有更多啦！当前可用指令：\n' + reply];
  });

  webot.set('career', {
    description: '回复career YourName，查看你担任过的角色和完成的演讲',
    // pattern 既可以是函数，也可以是 regexp 或 字符串(模糊匹配)
    pattern: /^(career )\s*(.*)$/i,
    // 回复handler也可以直接是字符串或数组，如果是数组则随机返回一个子元素
    /*handler: 'career,{2}'*/
    handler: function(info){
      console.log(info.param[2])
      var rf=require("fs");
      var data=rf.readFileSync("roletaken.csv","utf-8");
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

  webot.set('who_are_you', {
    description: '想知道我是谁吗? 发送: who?',
    // pattern 既可以是函数，也可以是 regexp 或 字符串(模糊匹配)
    pattern: /who|你是[谁\?]+/i,
    // 回复handler也可以直接是字符串或数组，如果是数组则随机返回一个子元素
    handler: ['我是北航头马的机器人，叫人家小北北┑(￣▽ ￣)┍', '小玫瑰2号']
  });

  // 正则匹配后的匹配组存在 info.query 中
  webot.set('your_name', {
    description: '自我介绍下吧, 发送: I am [enter_your_name]',
    pattern: /^(?:my name is|i am|我(?:的名字)?(?:是|叫)?)\s*(.*)$/i,

    // handler: function(info, action){
    //   return '你好,' + info.param[1]
    // }
    // 或者更简单一点
    handler: '你好,{1}'
  });

  // 简单的纯文本对话，可以用单独的 yaml 文件来定义
  require('js-yaml');
  webot.dialog(__dirname + '/dialog.yaml');

  // 支持一次性加多个（方便后台数据库存储规则）
  webot.set([{
    name: 'morning',
    description: '打个招呼吧, 发送: good morning',
    pattern: /^(早上?好?|(good )?moring)[啊\!！\.。]*$/i,
    handler: function(info){
      var d = new Date();
      var h = d.getHours();
      if (h < 3) return '[嘘] 我这边还是深夜呢，别吵着大家了';
      if (h < 5) return '这才几点钟啊，您就醒了？';
      if (h < 7) return '早啊官人！您可起得真早呐~ 给你请安了！\n 今天想参加点什么活动呢？';
      if (h < 9) return 'Morning, sir! 新的一天又开始了！您今天心情怎么样？';
      if (h < 12) return '这都几点了，还早啊...';
      if (h < 14) return '人家中午饭都吃过了，还早呐？';
      if (h < 17) return '如此美好的下午，是很适合出门逛逛的';
      if (h < 21) return '早，什么早？找碴的找？';
      if (h >= 21) return '您还是早点睡吧...';
    }
  }, {
    name: 'time',
    description: '想知道几点吗? 发送: time',
    pattern: /^(几点了|time)\??$/i,
    handler: function(info) {
      var d = new Date();
      var h = d.getHours();
      var t = '现在是服务器时间' + h + '点' + d.getMinutes() + '分';
      if (h < 4 || h > 22) return t + '，夜深了，早点睡吧 [月亮]';
      if (h < 6) return t + '，您还是再多睡会儿吧';
      if (h < 9) return t + '，又是一个美好的清晨呢，今天准备去哪里玩呢？';
      if (h < 12) return t + '，一日之计在于晨，今天要做的事情安排好了吗？';
      if (h < 15) return t + '，午后的冬日是否特别动人？';
      if (h < 19) return t + '，又是一个充满活力的下午！今天你的任务完成了吗？';
      if (h <= 22) return t + '，这样一个美好的夜晚，有没有去看什么演出？';
      return t;
    }
  }]);

  // 等待下一次回复
  webot.set('guess my sex', {
    pattern: /是男.还是女.|你.*男的女的/,
    handler: '你猜猜看呐',
    replies: {
      '/女|girl/i': '人家才不是女人呢',
      '/男|boy/i': '是的，我就是翩翩公子一枚',
      'both|不男不女': '你丫才不男不女呢',
      '不猜': '好的，再见',
      // 请谨慎使用通配符
      '/.*/': function reguess(info) {
        if (info.rewaitCount < 2) {
          info.rewait();
          return '你到底还猜不猜嘛！';
        }
        return '看来你真的不想猜啊';
      },
    }

    // 也可以用一个函数搞定:
    // replies: function(info){
    //   return 'haha, I wont tell you'
    // }

    // 也可以是数组格式，每个元素为一条rule
    // replies: [{
    //   pattern: '/^g(irl)?\\??$/i',
    //   handler: '猜错'
    // },{
    //   pattern: '/^b(oy)?\\??$/i',
    //   handler: '猜对了'
    // },{
    //   pattern: 'both',
    //   handler: '对你无语...'
    // }]
  });

  // 定义一个 wait rule
  webot.waitRule('wait_guess', function(info) {
    var r = Number(info.text);

    // 用户不想玩了...
    if (isNaN(r)) {
      info.resolve();
      return null;
    }

    var num = info.session.guess_answer;

    if (r === num) {
      return '你真聪明!';
    }

    var rewaitCount = info.session.rewait_count || 0;
    if (rewaitCount >= 2) {
      return '怎么这样都猜不出来！答案是 ' + num + ' 啊！';
    }

    //重试
    info.rewait();
    return (r > num ? '大了': '小了') +',还有' + (2 - rewaitCount) + '次机会,再猜.';
  });

  webot.set('guess number', {
    description: '发送: game , 玩玩猜数字的游戏吧',
    pattern: /(?:game|玩?游戏)\s*(\d*)/,
    handler: function(info){
      //等待下一次回复
      var num = Number(info.param[1]) || _.random(1,9);

      verbose('answer is: ' + num);

      info.session.guess_answer = num;

      info.wait('wait_guess');
      return '玩玩猜数字的游戏吧, 1~9,选一个';
    }
  });

  webot.waitRule('wait_suggest_keyword', function(info, next){
    if (!info.text) {
      return next();
    }

    // 按照定义规则的 name 获取其他 handler
    var rule_search = webot.get('search');

    // 用户回复回来的消息
    if (info.text.match(/^(好|要|y)$/i)) {
      // 修改回复消息的匹配文本，传入搜索命令执行
      info.param[0] = 's nodejs';
      info.param[1] = 'nodejs';

      // 执行某条规则
      webot.exec(info, rule_search, next);
      // 也可以调用 rule 的 exec 方法
      // rule_search.exec(info, next);
    } else {
      info.param[1] = info.session.last_search_word;
      // 或者直接调用 handler :
      rule_search.handler(info, next);
      // 甚至直接用命名好的 function name 来调用：
      // do_search(info, next);
    }
    // remember to clean your session object.
    delete info.session.last_search_word;
  });
  // 调用已有的action
  /*
  webot.set('suggest keyword', {
    description: '发送: s nde ,然后再回复Y或其他',
    pattern: /^(?:搜索?|search|s\b)\s*(.+)/i,
    handler: function(info){
      var q = info.param[1];
      if (q === 'nde') {
        info.session.last_search_word = q;
        info.wait('wait_suggest_keyword');
        return '你输入了:' + q + '，似乎拼写错误。要我帮你更改为「nodejs」并搜索吗?';
      }
    }
  });
*/
  function do_search(info, next){
    // pattern的解析结果将放在param里
    var q = info.param[1];
    log('searching: ', q);
    // 从某个地方搜索到数据...
    return search(q , next);
  }
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
  webot.set(/^ok webot$/i, function(info) {
    info.wait('list');
    return '可用指令：\n' +
           '1 - 查看程序信息\n' +
           '2 - 进入名字选择';
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
  webot.set('reply_news', {
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

  webot.set('reply_news', {
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

  // 可以指定图文消息的映射关系
  webot.config.mapping = function(item, index, info){
    //item.title = (index+1) + '> ' + item.title;
    return item;
  };

  //所有消息都无法匹配时的fallback
  webot.set(/.*/, function(info){
    // 利用 error log 收集听不懂的消息，以利于接下来完善规则
    // 你也可以将这些 message 存入数据库
    log('unhandled message: %s', info.text);
    info.flag = true;
    return '「' + info.text + '」?人家不懂诶。。。说点我能听懂的呢。要不还是给我发 help吧';
  });
};
