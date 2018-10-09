# node爬虫：爬取豆瓣电影排名TOP250海报图


## 一、 先执行一次包更新
`npm install`

## 二、 开发执行
`npm start`


## 三、实现步骤

1. 确定目标页面（豆瓣）
2. 使用superagent库来获取页面
3. 分析页面结构，使用cheerio 获取有效信息
4. 保存图片到本地


## 四、开始编写爬取海报图


本项目需要使用的库

```
npm i superagent cheerio fs-extra --save
```

这儿我们用到了`superagent` ` cheerio` `fs-extra`这三个库

- superagent 是nodejs里一个非常方便的客户端请求代理模块
- cheerio：为服务器特别定制的，快速、灵活、实施的jQuery核心实现
- fs-extra： 丰富了fs模块，同时支持async/await

### 4.1 请求URL获取HTML

使用superagent发起请求并打印出页面内容

```javascript
const request = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs-extra')

let url = 'https://movie.douban.com/top250?start=0';


request
  .get(url + '1')
  .then(function (res) {
    console.log(res.text)
  })

// 你就可以看见HTML内容打印到了控制台
```


### 4.2 获取图片地址

获取到单个图片URL后，我们可以通过图片的`src`属性去拿到真实的图片地址，然后实现下载保存

```javascript
// 获取海报图片路径
async function getPosterUrls () {
    let imgURls =  [];

    for (let i = 0; i < 5; i++) {
        const res = await request.get(url + i * PAGE_SIZE);
        const $ = cheerio.load(res.text);
        $('.grid_view li').each(function() {
            let imgUrl = $(this).find('img').attr('src');
            imgURls.push(imgUrl);
        })
    }

    return imgURls;
}

```

### 4.3 保存图片到本地

现在我们就来实现下载保存图片的方法，这儿我们使用了`stream`(流) 来保存图片

```javascript
// 下载每一张图片保存到本地
async function getPoster (url) {
    // 检测图片是否已经存在，如果不存在则下载
    let isExist = isExistImg(url);
    if(!isExist) {
        let fileName = url.split('/').pop();
        let dir = path.join(__dirname,'/',DIR,'/',fileName);

        const req = await request.get(url);
        req.pipe(fs.createWriteStream(dir));
    }
}
```



## 五、参考链接

- 源码：https://github.com/yuhang04210/douban-spider.git
- superagent： http://visionmedia.github.io/superagent/
- cheerio：https://github.com/cheeriojs/cheerio
- fs-extra：https://github.com/jprichardson/node-fs-extra
