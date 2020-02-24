const indexNavData = [
    {
        text: '附近',
        to: '/near'
    },
    {
        text: '热门',
        to: '/hot'
    },
    {
        text: '活动',
        to: '/activity'
    },
    {
        text: '用户',
        to: '/user'
    }
]

const addressTitle = "湖南省邵阳市邵东县"
const mapMarker = [
    {
        text: `${addressTitle}横店电影城`,
        classification: '娱乐',
        type: ['offLine'],
        id: 1,
        content: "邵东横店电影城！给你五星级的体验。"
    },
    {
        text: `${addressTitle}湘邵厨具`,
        classification: '生活用品',
        type: ['offLine', 'onLine'],
        id: 2,
        content: "湘邵厨具欢迎您的到来！"
    },
    {
        text: `${addressTitle}通程电器`,
        classification: '生活用品',
        type: ['onLine'],
        id: 3,
        content: "通程电器是一家以线上为主的家庭生活用品商家，给你一个完美的家！"

    },
    {
        text: `${addressTitle}人民医院`,
        classification: '医药',
        type: ['offLine'],
        id: 4,
        content: ""
    }
]
module.exports = { indexNavData, mapMarker }
