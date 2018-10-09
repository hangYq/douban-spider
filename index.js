// 抓取豆瓣排行250电影海报
const request = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');


const url = "https://movie.douban.com/top250?start=";
const PAGE_SIZE = 25;
const DIR = 'poster';

// https://movie.douban.com/top250?start=25


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

// 获取所有海报图片
function getAllPosters (urls) {
    for (const url of urls) {
        getPoster(url);
    }
}


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


// 检测图片是否存在
function isExistImg (url) {
    let fileName = url.split('/').pop();
    let dir = path.join(__dirname,'/',DIR,'/',fileName);

    return fs.pathExists(dir, (err, exists) => {
        return exists;
    })
}


// 检测是否存在文件夹,如果不存在，则新建一个文件夹
function isExistFolder () {
    let dir = path.join(__dirname,'/',DIR);
    let isExist = false;

    fs.pathExists(dir, (err, exists) => {
        isExist = exists;
    })

    if(!isExist) {
        fs.ensureDir(dir);
    }
}

async function start() {
    let urls = await getPosterUrls();
    isExistFolder()
    getAllPosters(urls);
}

start();