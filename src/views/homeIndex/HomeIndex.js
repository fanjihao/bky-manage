import React, { Component } from 'react'
import './homeIndex.css'
import { DatePicker } from 'antd'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import axios from '../../http/index'
import ReactEcharts from 'echarts-for-react'
import moment from 'moment'
import QRCode from 'qrcode.react'

const { RangePicker } = DatePicker;

class HomeIndex extends Component {
    state = {
        merchantInfo: {
            merchantName: "情怀一北",
            legalPerson: "嬴政",
            businessTime: "8:00-23:00",
            province: "北京市",
            city: "北京市",
            district: "东城区",
            address: ""
        },
        startTime: '2020-07-25',
        endTime: '2020-09-25',
        stageTimeList: [],
        stageNumList: [],
        stageTotalList: [],
        stageOne: 0,
        stageTwo: 0,
        stageoThree: 0,
        stageOneMoney: 0,
        stageTwoMoney: 0,
        stageThreeMoney: 0,
        // 分期项目排行榜
        stageRankList: null,
        onlineData: '',
        onlineTimeList: [],
        onlineNumList: [],
        onlineTotalList: [],
        // 线上商品排行榜
        onlineRankList: null
    }
    // 查询商户信息
    getUserInfo = id => {
        axios({
            method: 'GET',
            url: `/statistics/userEnter?id=${id}`,
        })
            .then(res => {
                // console.log('商户信息', res.data)
                this.setState({ merchantInfo: res.data })
            })
            .catch(err => {
                console.log('失败', err)
            })
    }
    // 分期项目统计图表数据
    getStageChartData = id => {
        const { endTime, startTime } = this.state
        axios({
            method: 'GET',
            url: '/statistics/stageLineChart',
            params: {
                endTime: endTime,
                startTime: startTime,
                enterId: id
            }
        })
            .then(res => {
                // console.log('获取分期项目统计图表数据成功', res.data)
                if (res.data === []) {

                } else {
                    let newList1 = []
                    let newList2 = []
                    let newList3 = []
                    res.data.filter(item => {
                        newList1.push(item.createTime)
                        return item
                    })
                    res.data.filter(item => {
                        newList2.push(item.stageCount)
                        return item
                    })
                    res.data.filter(item => {
                        newList3.push(item.stageMoney)
                        return item
                    })
                    this.setState({
                        stageTimeList: newList1.reverse(),
                        stageNumList: newList2.reverse(),
                        stageTotalList: newList3.reverse()
                    })
                }
            })
            .catch(err => {
                console.log('获取分期项目统计图表数据失败', err)
            })
    }
    // 商户分期订单数据
    getStageOrderList = (type, id) => {
        const { endTime, startTime } = this.state
        axios({
            url: '/statistics/stageUnit',
            method: 'GET',
            params: {
                startTime: startTime,
                endTime: endTime,
                enterId: id,
                type: type
            }
        })
            .then(res => {
                // console.log('查询商户分期订单成功', res.data)
                if (type === 1) {
                    this.setState({
                        stageOne: res.data.stageCount,
                        stageOneMoney: res.data.stageMoney
                    })
                } else if (type === 2) {
                    this.setState({
                        stageTwo: res.data.stageCount,
                        stageTwoMoney: res.data.stageMoney
                    })
                } else {
                    this.setState({
                        stageThree: res.data.dstageCount,
                        stageThreeMoney: res.data.stageMoney
                    })
                }
            })
            .catch(err => {
                console.log('查询商户分期订单失败', err)
            })
    }
    // 分期项目排行榜
    getStageRankList = id => {
        axios({
            method: 'GET',
            url: '/statistics/stageShopRanking',
            params: {
                enterId: id
            }
        })
            .then(res => {
                // console.log('查询成功', res.data)
                if (res.data.length === 0) {

                } else {
                    this.setState({ stageRankList: res.data })
                }
            })
            .catch(err => {
                console.log('查询失败', err)
            })
    }
    // 线上商品统计
    getOnlineGoods = id => {
        const { endTime, startTime } = this.state
        axios({
            method: 'GET',
            url: '/statistics/onLine',
            params: {
                startTime: startTime,
                endTime: endTime,
                enterId: id
            }
        })
            .then(res => {
                // console.log('查询成功', res.data)
                this.setState({
                    onlineData: res.data
                })
            })
            .catch(err => {
                console.log('查询失败', err)
            })
    }
    // 线上商品统计图表数据
    getOnlinechartList = id => {
        const { endTime, startTime } = this.state
        axios({
            method: 'GET',
            url: '/statistics/onLineChart',
            params: {
                endTime: endTime,
                startTime: startTime,
                enterId: id
            }
        })
            .then(res => {
                // console.log('获取分期项目统计图表数据成功', res)
                if (res.data === []) {

                } else {
                    let newList1 = []
                    let newList2 = []
                    let newList3 = []
                    res.data.filter(item => {
                        newList1.push(item.createTime)
                        return item
                    })
                    res.data.filter(item => {
                        newList2.push(item.stageCount)
                        return item
                    })
                    res.data.filter(item => {
                        newList3.push(item.stageMoney)
                        return item
                    })
                    this.setState({
                        onlineTimeList: newList1.reverse(),
                        onlineNumList: newList2.reverse(),
                        onlineTotalList: newList3.reverse()
                    })
                }
            })
            .catch(err => {
                console.log('获取分期项目统计图表数据失败', err)
            })
    }
    // 线上商品排行榜
    getOnlineRankList = id => {
        axios({
            method: 'GET',
            url: '/statistics/onLineShopRanking',
            params: {
                enterId: id
            }
        })
            .then(res => {
                // console.log('查询成功', res)
                if (res.data.length === 0) {
                    // console.log(1)
                } else {
                    console.log(2)
                    this.setState({ onlineRankList: res.data })
                }
            })
            .catch(err => {
                console.log('查询失败', err)
            })
    }
    componentDidMount() {
        const date = new Date()
        let Y = date.getFullYear()
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
        let D = date.getDate();
        const nowDate = Y + '-' + M + '-' + D
        // console.log(nowDate)

        date.setMonth(date.getMonth() - 1)
        let y = date.getFullYear()
        let m = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
        let d = date.getDate()
        const preDate = y + '-' + m + '-' + d
        // console.log(preDate)

        const id = JSON.parse(localStorage.getItem('user')).id

        this.setState({
            startTime: preDate,
            endTime: nowDate
        }, () => {

            this.getUserInfo(id)

            // 分期项目统计图表数据
            this.getStageChartData(id)
            // 分期中
            this.getStageOrderList(1, id)
            // 已完成
            this.getStageOrderList(2, id)
            // 异常
            this.getStageOrderList(3, id)
            // 查询分期项目排行榜
            this.getStageRankList(id)

            // 线上商品统计
            this.getOnlineGoods(id)
            // 线上商品统计图表数据
            this.getOnlinechartList(id)
            // 线上商品排行榜
            this.getOnlineRankList(id)
        })
    }
    // 改变日期
    setTime = e => {
        const id = JSON.parse(localStorage.getItem('user')).id
        // console.log(e)
        const startTime = e[0]._d.getFullYear() + '-' + (e[0]._d.getMonth() + 1) + '-' + e[0]._d.getDate()
        const endTime = e[1]._d.getFullYear() + '-' + (e[1]._d.getMonth() + 1) + '-' + e[1]._d.getDate()
        this.setState({
            startTime: startTime,
            endTime: endTime
        }, () => {
            // 分期项目统计图表数据
            this.getStageChartData(id)
            // 分期中
            this.getStageOrderList(1, id)
            // 已完成
            this.getStageOrderList(2, id)
            // 异常
            this.getStageOrderList(3, id)

            // 线上商品统计
            this.getOnlineGoods(id)
            // 线上商品统计图表数据
            this.getOnlinechartList(id)
        })
    }
    render() {
        const {
            merchantInfo, startTime, endTime, stageTimeList,
            stageNumList, stageTotalList, stageOne, stageTwo,
            stageoThree, stageOneMoney, stageTwoMoney, stageThreeMoney,
            stageRankList, onlineData, onlineNumList, onlineTimeList,
            onlineTotalList, onlineRankList } = this.state
        let personInfo = JSON.parse(localStorage.getItem('user'))

        let stageOption, onlineOption

        if (stageNumList.length === 0 && stageTimeList.length === 0 && stageTotalList === 0) {
            stageOption = {
                title: {
                    text: '暂无数据',
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        color: '#65ABE7',
                        fontWeight: 'normal',
                        fontSize: 16
                    }
                }
            }
        } else {
            stageOption = {
                title: {
                    text: '分期项目统计图',
                    textStyle: {
                        fontSize: 14
                    },
                    left: 10,
                    top: 10
                },
                legend: {
                    top: 30
                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '5%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                xAxis: {
                    type: "category",
                    data: stageTimeList,
                    boundaryGap: true,
                },
                yAxis: {
                    type: "value"
                },
                series: [
                    {
                        data: stageNumList,
                        type: "line",
                        smooth: true,
                        name: '单量'
                    },
                    {
                        data: stageTotalList,
                        type: 'line',
                        name: '交易额'
                    }
                ]
            }
        }

        if (onlineNumList.length === 0 && onlineTimeList.length === 0 && onlineTotalList.length === 0) {
            onlineOption = {
                title: {
                    text: '暂无数据',
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        color: '#65ABE7',
                        fontWeight: 'normal',
                        fontSize: 16
                    }
                }
            }
        } else {
            onlineOption = {
                title: {
                    text: '线上商品统计图',
                    textStyle: {
                        fontSize: 14
                    },
                    left: 10,
                    top: 10
                },
                legend: {
                    top: 30
                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '5%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                xAxis: {
                    type: "category",
                    data: onlineTimeList,
                    boundaryGap: true,
                },
                yAxis: {
                    type: "value"
                },
                series: [
                    {
                        data: onlineNumList,
                        type: "line",
                        smooth: true,
                        name: '单量'
                    },
                    {
                        data: onlineTotalList,
                        type: 'line',
                        name: '交易额'
                    }
                ]
            }
        }
        return (
            <div className="homeIndex">
                <div className="homeIndex-header">
                    <span>首页</span>
                </div>

                <div className="homeIndex-date">
                    <RangePicker
                        locale={locale}
                        className="homeIndex-date"
                        value={[moment(startTime, 'YYYY-MM-DD'), moment(endTime, 'YYYY-MM-DD')]}
                        format={'YYYY-MM-DD'}
                        onChange={this.setTime}
                    />
                </div>
                <div className="homeIndex-statistics">
                    <div className="homeIndex-stage">
                        <div className="homeIndex-stageTitle">
                            <span>分期项目统计：</span>
                            <span className="homeIndex-renderDate">{startTime}至{endTime}</span>
                        </div>

                        {/* 分期类型统计 */}
                        <div className="homeIndex-stageStatistics">
                            <div className="homeIndex-stageItems">
                                <div className="stageItems-top ">
                                    <span>分期中</span>
                                    <span>{stageOne}单</span>
                                </div>
                                <div className="stageItems-bottom">
                                    <span className="stagePrice">{stageOneMoney}</span>
                                    <span className="stageUnit">元</span>
                                </div>
                            </div>

                            <div className="homeIndex-stageItems">
                                <div className="stageItems-top ">
                                    <span>已完成分期</span>
                                    <span>{stageTwo}单</span>
                                </div>
                                <div className="stageItems-bottom">
                                    <span className="stagePrice">{stageTwoMoney}</span>
                                    <span className="stageUnit">元</span>
                                </div>
                            </div>

                            <div className="homeIndex-stageItems">
                                <div className="stageItems-top ">
                                    <span>异常分期</span>
                                    <span>{stageoThree}单</span>
                                </div>
                                <div className="stageItems-bottom">
                                    <span className="stagePrice">{stageThreeMoney}</span>
                                    <span className="stageUnit">元</span>
                                </div>
                            </div>

                        </div>

                        {/* 分期统计图表 */}
                        <div className="homeIndex-stageCharts">
                            <div className="charts">
                                <ReactEcharts option={stageOption} />
                            </div>
                            <div className="stageManage-list">
                                <p className="stageManage-list-title">分期项目排行榜</p>
                                {
                                    stageRankList === null
                                        ? <p className="noData">暂无数据</p>
                                        : stageRankList.map((item, index) => {
                                            if (index < 4 && index >= 0) {
                                                return (
                                                    <div className="stagemanage-list-item" key={index}>
                                                        <span className="stagemanage-list-ranking">{index + 1}</span>
                                                        <img src={item.img.split(',')[0]} className="stagemanage-list-img" alt="rankImg" />
                                                        <div className="stagemenage-list-data">
                                                            <span>{item.stageMoney}元</span>
                                                            <span>{item.stageCount}单</span>
                                                        </div>
                                                        <p className="stagemanage-list-name">{item.name}</p>
                                                    </div>
                                                )
                                            }
                                        })
                                }
                                {/* <div className="moreStages">查看更多</div> */}
                            </div>
                        </div>
                        {/* 线上商品统计图表 */}
                        <div className="homeIndex-stageCharts">
                            <div className="charts">
                                <ReactEcharts option={onlineOption} />
                            </div>
                            <div className="stageManage-list">
                                <p className="stageManage-list-title">线上商品排行榜</p>
                                {
                                    onlineRankList === null
                                        ? <p className="noData">暂无数据</p>
                                        : onlineRankList.map((item, index) => {
                                            if (index < 4 && index >= 0) {
                                                return (
                                                    <div className="stagemanage-list-item" key={index}>
                                                        <span className="stagemanage-list-ranking">{index + 1}</span>
                                                        <img src={item.img.split(',')[0]} className="stagemanage-list-img" alt="rankingImg" />
                                                        <div className="stagemenage-list-data">
                                                            <span>{item.stageMoney}元</span>
                                                            <span>{item.stageCount}单</span>
                                                        </div>
                                                        <p className="stagemanage-list-name">{item.name}</p>
                                                    </div>
                                                )
                                            }
                                        })
                                }
                            </div>
                        </div>
                    </div>

                    <div className="homeIndex-online">
                        <div className="homeIndex-onlineTitle">
                            <span>线上商品统计：</span>
                            <span className="homeIndex-renderDate">{startTime}至{endTime}</span>
                        </div>
                        <div className="onlineGoodsStatistics">
                            <div className="online-top">
                                <span>商品营业总额</span>
                                <span>{onlineData.stageCount}单</span>
                            </div>
                            <div className="stageItems-bottom">
                                <span className="stagePrice">{onlineData.stageMoney}</span>
                                <span className="stageUnit">元</span>
                            </div>
                        </div>
                        {/* 店铺信息 */}
                        <div className="storeInfo">
                            <header className="storeInfo-header">
                                <img src={require('../../assets/imgs/logo.png')} alt="商家图标" />
                                <span style={{ marginLeft: 20 }}>{merchantInfo.merchantName}</span>
                            </header>
                            <section className="storeInfo-section">
                                <div className="storeInfo-section-Items">
                                    <span className="storeInfo-section-span1">门店地址</span>
                                    <span>{merchantInfo.address ? merchantInfo.address : '暂无门店地址信息'}</span>
                                </div>
                                <div className="storeInfo-section-Items">
                                    <span className="storeInfo-section-span1">负责人</span>
                                    <span>{merchantInfo.legalPerson}</span>
                                </div>
                                <div className="storeInfo-section-Items">
                                    <span className="storeInfo-section-span1">营业时间</span>
                                    <span>每天{merchantInfo.businessTime}</span>
                                </div>
                            </section>

                            <div className="download">
                                <QRCode
                                    value={"https://www.bkysc.cn/storeDetail?id=" + personInfo.systemStoreId + "&enterId=" + personInfo.id}
                                    className='qrcode'
                                    size={200}
                                />
                                <div className="download-text">博客云扫码下载</div>
                            </div>

                            <div className="handle">
                                <p>操作步骤</p>
                                <p>1.扫描二维码下载博客云APP</p>
                                <p>2.免注册直接登陆博客云</p>
                                <p>3.扫描门店二维码开始办理分期项目服务</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default HomeIndex