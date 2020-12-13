// 线上商品
import React, { Component } from 'react'
import {
    Input, Select, Table, Modal, Radio, Upload, message, InputNumber,
    Image, Popover, Tag, Switch, Space, Popconfirm, DatePicker,
    TimePicker,
    Button
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import axios from '../../http'
import locale from 'antd/lib/date-picker/locale/zh_CN'

const { Option } = Select
const { TextArea } = Input

export default class Goods extends Component {
    state = {
        // 项目状态
        goodsTable: 1,
        // 搜索框内容
        searchVal: '',
        // 向上项目列表
        onlineList: [],
        loading: false,
        emptyText: '暂无数据',
        classify: '',
        classList: [],
        // 商品图片
        goodsImage: null,
        // 项目名
        goodsName: '',
        // 项目价格
        goodsPrice: '',
        // 虚拟销量
        goodsSales: '',
        // 员工提成
        goodsRoyaltyRate: '',
        // 项目详情
        goodsRemarks: '',
        // 
        goodsVisble: false,
        goodsTitle: '',
        actionType: '',
        // 项目类型 0服务类 1商品类
        goodsType: 0,
        // 初始商品分类
        initClass: '',
        // 积分抵扣
        integral: 1,
        // 可抵积分
        intNum: 0,
        // 服务卡项类型
        cardType: 0,
        astrict: 1,
        // 项目库存
        goodsStock: '',
        // 项目邮费
        goodsPostage: '',
        // 服务时长
        serviceTime: '30分钟',
        // 服务时间段
        checkTimeArr: [],
        // 服务人数
        servicePlepeo: 1,
        // 初始可预约时间
        timeArr: [
            { id: 5, value: '8:00-8:30' },
            { id: 6, value: '8:30-9:00' },
            { id: 7, value: '9:00-9:30' },
            { id: 8, value: '9:30-10:00' },
            { id: 9, value: '10:00-10:30' },
            { id: 10, value: '10:30-11:00' },
            { id: 11, value: '11:00-11:30' },
            { id: 12, value: '11:30-12:00' },
            { id: 13, value: '13:00-13:30' },
            { id: 14, value: '13:30-14:00' },
            { id: 15, value: '14:00-14:30' },
            { id: 16, value: '14:30-15:00' },
            { id: 17, value: '15:00-15:30' },
            { id: 18, value: '15:30-16:00' },
            { id: 19, value: '16:00-16:30' },
            { id: 20, value: '16:30-17:00' },
            { id: 21, value: '17:00-17:30' },
            { id: 22, value: '17:30-18:00' },
            { id: 23, value: '18:00-18:30' },
            { id: 24, value: '18:30-19:00' },
            { id: 25, value: '19:00-19:30' },
            { id: 26, value: '19:30-20:00' },
            { id: 27, value: '20:00-20:30' },
            { id: 28, value: '20:30-21:00' },
            { id: 29, value: '21:00-21:30' },
            { id: 30, value: '21:30-22:00' },
        ],
        // 预约状态
        enableSub: 0,
        // 项目类型
        proType: 0,
        // 服务类型
        serviceType: 1,
        // 服务商品列表
        serviceList: [],
        // 服务商品ID
        serviceId: '',
        // 服务商品页数
        servicePage: 1,
        // 普通商品ID
        onlineId: '',
        // 开启拼团模态框
        isSpellGroup: false,
        // 拼团名称
        spellName: '',
        // 拼团时效
        spellTime: 24,
        // 拼团开始日期
        startDate: '',
        startTime: '',
        // 拼团结束日期
        endDate: '',
        endTime: '',
        // 产品图片
        spellImage: null,
        // 拼团价
        spellPrice: '',
        // 拼团人数
        spellPeople: 2,
        // 库存
        spellStock: '',
        // 销量
        spellSales: '',
        // 邮费
        spellPostage: 0,
        // 拼团图片预览
        spellPreview: false,
        // 拼团活动状态
        spellIsShow: 1,
        // 拼团描述
        spellDescription: '',
        // 拼团商品ID
        spellProductId: '',
        // 积分兑换
        integral: 1,
        // 提成比例
        commission: 0,
        // 拼团服务开始时间
        serviceStartTime: '',
        // 拼团服务结束时间
        serviceEndTime: '',
        // 原价
        originalPrice: '',
        // 拼团折扣
        spellDiscount: '',
        // 可抵积分
        intNum: 0
    }
    componentDidMount() {
        this.getGoodsClass()
        this.getGoods()
    }
    // 商品分类
    getGoodsClass = () => {
        axios({
            url: '/api/yxStoreCategory',
            method: 'GET'
        })
            .then(res => {
                console.log('获取商品分类成功', res)
                this.setState({
                    classList: res.data.content,
                    initClass: res.data.content[0].id
                })
            })
            .catch(err => {
                console.log('获取商品分类失败', err)
                message.error('服务器出错')
            })
    }
    // 获取商品类商品列表
    getOnlineList = () => {
        this.setState({ loading: true })
        let id = JSON.parse(localStorage.getItem('user')).id
        const { searchVal, classify, goodsTable, servicePage } = this.state
        axios({
            url: '/statistics/onlineProducts',
            method: 'GET',
            params: {
                cateName: classify,
                enterId: id,
                name: searchVal,
                type: goodsTable,
                limit: 10,
                offset: servicePage
            }
        })
            .then(res => {
                console.log('查询线上商品成功', res)
                if (res.data.status === 200) {
                    this.setState({
                        loading: false,
                        onlineList: res.data.data.list
                    })
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('查询线上商品失败', err)
                message.error('服务器出错')
            })
    }
    // 服务类商品列表
    getService = () => {
        this.setState({ loading: true })
        const { searchVal, goodsTable, classify } = this.state
        let user = JSON.parse(localStorage.getItem('user'))
        axios({
            method: 'GET',
            url: '/statistics/service',
            params: {
                enterId: user.id,
                type: goodsTable,
                name: searchVal,
                cateName: classify
            }
        })
            .then(res => {
                console.log('查询服务商品成功', res)
                if (res.data.status === 200) {
                    this.setState({
                        serviceList: res.data.data,
                        loading: false
                    })
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('查询服务商品失败', err)
                message.error('服务器出错')
            })
    }
    // 上传项目图片
    uploadGoodsImage = info => {
        this.setState({goodsImage: ''})
        const res = info.fileList[0].response
        if (res) {
            this.setState({
                goodsImage: 'https://www.bkysc.cn/api/files-upload/' + res.data
            },() => console.log(res))
        }
    }
    // 打开新增模态框
    addGoods = () => {
        let initClass = this.state.initClass
        this.setState({
            goodsClass: initClass,
            goodsName: '',
            goodsImage: null,
            integral: 1,
            intNum: 0,
            goodsPrice: '',
            goodsSales: '',
            goodsRoyaltyRate: '',
            goodsRemarks: '',
            cardType: 0,
            astrict: 1,
            goodsStock: '',
            goodsPostage: '',
            servicePlepeo: 1,
            serviceTime: '30分钟',
            timeArr: [
                { id: 5, value: '8:00-8:30' },
                { id: 6, value: '8:30-9:00' },
                { id: 7, value: '9:00-9:30' },
                { id: 8, value: '9:30-10:00' },
                { id: 9, value: '10:00-10:30' },
                { id: 10, value: '10:30-11:00' },
                { id: 11, value: '11:00-11:30' },
                { id: 12, value: '11:30-12:00' },
                { id: 13, value: '13:00-13:30' },
                { id: 14, value: '13:30-14:00' },
                { id: 15, value: '14:00-14:30' },
                { id: 16, value: '14:30-15:00' },
                { id: 17, value: '15:00-15:30' },
                { id: 18, value: '15:30-16:00' },
                { id: 19, value: '16:00-16:30' },
                { id: 20, value: '16:30-17:00' },
                { id: 21, value: '17:00-17:30' },
                { id: 22, value: '17:30-18:00' },
                { id: 23, value: '18:00-18:30' },
                { id: 24, value: '18:30-19:00' },
                { id: 25, value: '19:00-19:30' },
                { id: 26, value: '19:30-20:00' },
                { id: 27, value: '20:00-20:30' },
                { id: 28, value: '20:30-21:00' },
                { id: 29, value: '21:00-21:30' },
                { id: 30, value: '21:30-22:00' },
            ],
            goodsVisble: true,
            actionType: 'add',
            goodsTitle: '新增项目',
            serviceType: 1
        })
    }
    // 新增、编辑项目
    goodsAction = actionType => {
        let user = JSON.parse(localStorage.getItem('user'))
        const { goodsType, astrict, goodsName, goodsImage, intNum,
            goodsPrice, goodsSales, goodsRoyaltyRate, goodsRemarks,
            goodsStock, goodsPostage, servicePlepeo, serviceTime,
            checkTimeArr, cardType, goodsClass, integral, enableSub,
            serviceType, serviceId, onlineId } = this.state
        if (goodsType === 0) {
            if (goodsName === '' || goodsImage === null ||
                goodsPrice === '' || goodsSales === '' ||
                goodsRoyaltyRate === '' || goodsRemarks === '' ||
                astrict === '' || checkTimeArr.length === 0) {
                message.warning('请确定内容填写完整！')
            } else {
                let appointJSON = {}
                checkTimeArr.map(item => {
                    appointJSON[item] = servicePlepeo
                })
                if (actionType === 'add') {
                    axios({
                        method: 'POST',
                        url: '/statistics/service',
                        data: {
                            merId: user.id,
                            cateId: goodsClass,
                            storeName: goodsName,
                            otPrice: goodsPrice,
                            image: goodsImage,
                            ficti: goodsSales,
                            storeInfo: goodsRemarks,
                            isNew: 0,
                            isBest: 0,
                            isBennefit: 0,
                            useScore: integral,
                            giveIntegral: intNum,
                            appointmentMap: appointJSON,
                            timeQuantum: serviceTime,
                            enableSub: enableSub,
                            isService: serviceType,
                            astrict: astrict,
                            classify: cardType,
                            royaltyRate: goodsRoyaltyRate,
                            storeId: user.systemStoreId
                        }
                    })
                        .then(res => {
                            console.log('新增服务商品成功', res)
                            if (res.data.status === 200) {
                                console.log('新增服务商品成功', res)
                                this.getService()
                                this.setState({ goodsVisble: false })
                            } else {
                                message.error(res.data.message)
                            }
                        })
                        .catch(err => {
                            console.log('新增服务商品失败', err)
                            message.error('服务器出错')
                        })
                } else if (actionType === 'edit') {
                    axios({
                        method: 'PUT',
                        url: '/statistics/service',
                        data: {
                            merId: user.id,
                            cateId: goodsClass,
                            storeName: goodsName,
                            otPrice: goodsPrice,
                            image: goodsImage,
                            ficti: goodsSales,
                            storeInfo: goodsRemarks,
                            isNew: 0,
                            isBest: 0,
                            isBenefit: 0,
                            useScore: integral,
                            giveIntegral: intNum,
                            appointmentMap: appointJSON,
                            timeQuantum: serviceTime,
                            enableSub: enableSub,
                            isService: serviceType,
                            astrict: astrict,
                            classify: cardType,
                            royaltyRate: goodsRoyaltyRate,
                            id: serviceId,
                            storeId: user.systemStoreId
                        }
                    })
                        .then(res => {
                            console.log('修改服务商品成功', res)
                            if (res.data.status === 200) {
                                console.log('修改服务商品成功', res)
                                this.getService()
                                this.setState({ goodsVisble: false })
                            } else {
                                message.error(res.data.message)
                            }
                        })
                        .catch(err => {
                            console.log('修改服务商品失败', err)
                            message.error('服务器出错')
                        })
                }
            }
        } else if (goodsType === 1) {
            if (goodsName === '' || goodsImage === null || goodsStock === '' ||
                goodsPrice === '' || goodsSales === '' ||
                goodsRoyaltyRate === '' || goodsRemarks === '' || goodsPostage === '') {
                message.warning('请确定内容填写完整！')
            } else {
                if (actionType === 'add') {
                    axios({
                        url: '/statistics/addProducts',
                        method: 'POST',
                        data: {
                            merId: user.id,
                            cateId: goodsClass,
                            name: goodsName,
                            otPrice: goodsPrice,
                            image: goodsImage,
                            ficti: goodsSales,
                            stock: goodsStock,
                            storeInfo: goodsRemarks,
                            postage: goodsPostage,
                            isNew: 0,
                            isBest: 0,
                            isBenefit: 0,
                            useScore: integral,
                            royaltyRate: goodsRoyaltyRate,
                            giveIntegral: intNum,
                            storeId: user.systemStoreId
                        }
                    })
                        .then(res => {
                            console.log('新增线上商品成功', res)
                            if (res.data.status === 200) {
                                this.getOnlineList()
                                this.setState({ goodsVisble: false })
                            } else {
                                message.error(res.data.message)
                            }
                        })
                        .catch(err => {
                            console.log('添加失败', err)
                            message.error('服务器出错')
                        })
                } else if (actionType === 'edit') {
                    axios({
                        url: '/statistics/updateOnlineProducts',
                        method: 'POST',
                        data: {
                            merId: user.id,
                            cateId: goodsClass,
                            name: goodsName,
                            otPrice: goodsPrice,
                            image: goodsImage,
                            ficti: goodsSales,
                            stock: goodsStock,
                            storeInfo: goodsRemarks,
                            postage: goodsPostage,
                            isNew: 0,
                            isBest: 0,
                            isBenefit: 0,
                            useScore: integral,
                            royaltyRate: goodsRoyaltyRate,
                            giveIntegral: intNum,
                            storeId: user.systemStoreId,
                            id: onlineId
                        }
                    })
                        .then(res => {
                            console.log('修改普通商品成功', res)
                            if (res.data.status === 200) {
                                this.getOnlineList()
                                this.setState({ goodsVisble: false })
                            } else {
                                message.error(res.data.message)
                            }
                        })
                        .catch(err => {
                            console.log('修改普通商品失败', err)
                            message.error('服务器出错')
                        })
                }
            }
        }
    }
    // 切换选项卡
    getGoods = () => {
        const { goodsType } = this.state
        if (goodsType === 0) {
            this.getService()
        } else {
            this.getOnlineList()
        }
    }
    // 搜索
    search = () => {
        const { searchVal } = this.state
        if (searchVal === '') {
            message.warning('请先输入搜索内容!')
        } else {
            this.getGoods()
        }
    }
    // 服务类商品上下架
    changeFrame = id => {
        axios({
            method: 'PUT',
            url: `/statistics/dismountService?id=${id}`
        })
            .then(res => {
                console.log('上下架成功', res)
                this.getService()
            })
            .catch(err => {
                console.log('上下架失败', err)
                message.error('服务器出错')
            })
    }
    // 开启关闭预约
    switchService = (e, id) => {
        let enableSub = e ? 0 : 1
        let user = JSON.parse(localStorage.getItem('user'))
        console.log(enableSub, id)
        axios({
            method: 'PUT',
            url: '/sub/operate',
            data: {
                enterId: user.id,
                productId: id,
                operate: enableSub,
                payType: 1
            }
        })
            .then(res => {
                console.log('开启或关闭预约成功', res)
                if (res.data.status === 200) {
                    message.success(res.data.message)
                    this.getService()
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('开启或关闭预约失败', err)
                message.error('服务器出错')
            })
    }
    // 打开服务类编辑框
    editService = record => {
        let appointmenTime = []
        for (let key in JSON.parse(record.appointment)) {
            appointmenTime.push(key)
        }
        let limitPerson = JSON.parse(record.appointment)[appointmenTime[0]]
        this.setState({
            goodsName: record.storeName,
            goodsImage: record.image,
            goodsClass: record.cateId,
            goodsPrice: record.otPrice,
            goodsSales: record.ficti,
            integral: record.useScore,
            intNum: record.giveIntegral,
            servicePlepeo: limitPerson,
            checkTimeArr: appointmenTime,
            goodsRemarks: record.storeInfo,
            serviceId: record.id,
            enableSub: record.enableSub,
            goodsRoyaltyRate: record.royaltyRate,
            serviceTime: record.timeQuantum,
            actionType: 'edit',
            goodsTitle: '修改项目',
            goodsVisble: true,
        })
    }
    // 删除服务商品
    delService = id => {
        axios({
            method: 'DELETE',
            url: `/statistics/service?id=${id}`
        })
            .then(res => {
                if (res.data.status === 200) {
                    console.log('删除服务商品成功', res)
                    this.getService()
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('删除服务商品失败', err)
                message.error('服务器出错')
            })
    }
    // 回收站恢复服务类商品
    restoreService = id => {
        axios({
            method: 'GET',
            url: '/statistics/recoveryService',
            params: {
                id: id
            }
        })
            .then(res => {
                console.log('恢复成功', res)
                if (res.data.status === 200) {
                    this.getService()
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('恢复失败', err)
                message.error('服务器出错')
            })
    }
    // 回收站彻底删除服务类商品
    removeService = id => {
        axios({
            method: 'GET',
            url: '/statistics/removeService',
            params: {
                id: id
            }
        })
            .then(res => {
                if (res.data.status === 200) {
                    console.log('彻底删除成功', res)
                    this.getService()
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('彻底删除失败', err)
                message.error('服务器出错')
            })
    }
    // 普通商品上下架
    changeOnline = id => {
        axios({
            url: '/statistics/dismountOnlineProducts',
            method: 'GET',
            params: {
                id: id
            }
        })
            .then(res => {
                console.log('上下架成功', res)
                this.getOnlineList()
            })
            .catch(err => {
                console.log('上下架失败', err)
                message.error('服务器出错')
            })
    }
    // 删除普通商品
    delOnline = id => {
        axios({
            url: '/statistics/delOnlineProducts',
            method: 'GET',
            params: {
                id: id
            }
        })
            .then(res => {
                console.log('普通商品删除成功', res)
                if (res.data.status === 200) {
                    this.getOnlineList()
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('普通商品删除失败', err)
                message.error('服务器出错')
            })
    }
    // 回收站彻底删除普通商品
    realDelOnline = id => {
        axios({
            url: '/statistics/removeOnlineProducts',
            method: 'GET',
            params: {
                id: id
            }
        })
            .then(res => {
                console.log('彻底删除成功', res)
                if (res.data.status === 200) {
                    this.getOnlineList()
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('彻底删除失败', err)
                message.error('服务器出错')
            })
    }
    // 回收站恢复普通商品
    restoreOnline = id => {
        axios({
            url: '/statistics/recoveryOnlineProducts',
            method: 'GET',
            params: {
                id: id
            }
        })
            .then(res => {
                console.log('恢复成功', res)
                if (res.data.status === 200) {
                    this.getOnlineList()
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('恢复失败', err)
                message.error('服务器出错')
            })
    }
    // 打开普通类商品编辑框
    editOnline = record => {
        this.setState({
            goodsClass: record.cateId,
            goodsName: record.name,
            goodsImage: record.image,
            integral: record.useScore,
            intNum: record.giveIntegral,
            goodsPrice: record.otPrice,
            goodsSales: record.ficti,
            goodsPostage: record.postage,
            goodsStock: record.stock,
            goodsRoyaltyRate: record.royaltyRate,
            goodsRemarks: record.storeInfo,
            onlineId: record.id,
            actionType: 'edit',
            goodsTitle: '修改项目',
            goodsVisble: true,
        })
    }
    // 打开设置拼团模态框
    spellGroup = record => {
        const { goodsType } = this.state
        if (goodsType === 0) {
            this.setState({
                spellName: record.storeName,
                spellImage: record.image,
                spellSales: record.ficti,
                spellProductId: record.id,
                originalPrice: record.otPrice,
                isSpellGroup: true
            })
        } else {
            this.setState({
                spellName: record.name,
                spellImage: record.image,
                spellSales: record.ficti,
                spellPostage: record.postage,
                spellProductId: record.id,
                originalPrice: record.otPrice,
                spellStock: record.stock,
                isSpellGroup: true
            })
        }
    }
    // 上传拼团照片
    uploadSpellImage = info => {
        const res = info.fileList[0].response
        if (res) {
            this.setState({
                spellImage: 'https://www.bkysc.cn/api/files-upload/' + res.data
            })
        }
    }
    // 拼团开始日期
    getStartDate = e => {
        console.log(e)
        const startDate = e._d.getFullYear() + '-' + (e._d.getMonth() + 1) + '-' + e._d.getDate()
        console.log(startDate)
        this.setState({ startDate: startDate })
    }
    // 拼团开始时间
    getStartTime = e => {
        console.log(e)
        let hour = e._d.getHours()
        let minute = e._d.getMinutes()
        let second = e._d.getSeconds()
        if (hour < 10) {
            hour = '0' + hour
        }
        if (minute < 10) {
            minute = '0' + minute
        }
        if (second < 10) {
            second = '0' + second
        }

        const startTime = hour + ':' + minute + ':' + second
        console.log(startTime)
        this.setState({ startTime: startTime })
    }
    // 拼团结束日期
    getEndDate = e => {
        console.log(e)
        const endDate = e._d.getFullYear() + '-' + (e._d.getMonth() + 1) + '-' + e._d.getDate()
        console.log(endDate)
        this.setState({ endDate: endDate })
    }
    // 拼团结束时间
    getEndTime = e => {
        console.log(e)
        let hour = e._d.getHours()
        let minute = e._d.getMinutes()
        let second = e._d.getSeconds()
        if (hour < 10) {
            hour = '0' + hour
        }
        if (minute < 10) {
            minute = '0' + minute
        }
        if (second < 10) {
            second = '0' + second
        }

        const endTime = hour + ':' + minute + ':' + second
        console.log(endTime)
        this.setState({ endTime: endTime })
    }
    // 设置拼团折扣
    setDiscount = e => {
        const { originalPrice } = this.state
        const discount = e.target.value
        this.setState({
            spellDiscount: discount,
            spellPrice: originalPrice * discount
        })
    }
    // 新增拼团
    addSpellGroup = () => {
        const { spellName, spellTime, spellImage, spellPrice,
            spellPeople, spellSales, spellStock, spellPostage,
            startDate, startTime, endTime, endDate, spellDescription,
            spellIsShow, spellProductId, spellDiscount } = this.state
        let merId = JSON.parse(localStorage.getItem('user')).id
        if (startDate === '' || endDate === '' || endTime === ''
            || spellDescription === '' || spellName === ''
            || spellImage === '' || spellPeople === '' || spellSales === ''
            || spellStock === '' || spellPostage === '' || spellPrice === '') {
            message.warning('请确认信息填写完整！')
        } else {
            axios({
                method: 'PUT',
                url: '/api/yxStoreCombination',
                data: {
                    title: spellName,
                    // effectiveTime: spellTime,
                    startTimeDate: startDate + ' ' + startTime,
                    endTimeDate: endDate + ' ' + endTime,
                    image: spellImage,
                    price: spellPrice,
                    people: spellPeople,
                    sales: spellSales,
                    stock: spellStock,
                    postage: spellPostage,
                    isShow: 1,
                    description: spellDescription,
                    productId: spellProductId,
                    merId: merId,
                    isDel: 0,
                    combination: 1,
                    isHost: 0,
                    // discount: spellDiscount,
                    isPostage: 1
                }
            })
                .then(res => {
                    console.log('新增拼团成功', res)
                    message.success('新增拼团成功!')
                    this.setState({ isSpellGroup: false })
                })
                .catch(err => {
                    console.log('新增拼团失败', err)
                })
        }
    }
    render() {
        const { goodsTable, onlineList, loading, emptyText, searchVal, classify,
            classList, goodsImage, goodsClass, goodsName, goodsPrice, goodsSales,
            goodsRoyaltyRate, goodsRemarks, goodsType, goodsVisble, goodsTitle,
            actionType, integral, intNum, cardType, astrict, goodsPostage,
            goodsStock, serviceTime, checkTimeArr, servicePlepeo, timeArr,
            proType, serviceType, serviceList, servicePage, isSpellGroup,
            spellName, spellImage, originalPrice, spellPrice, spellPeople,
            spellStock, spellDiscount, spellSales, spellDescription, spellPostage } = this.state

        const onlineColumns = [
            {
                title: '商品编号',
                dataIndex: 'id',
                key: 'id',
                align: 'center',
                width: 120
            },
            {
                title: '商品图片',
                dataIndex: 'image',
                key: 'image',
                render: src => <img className='tableGoodsImg' src={src} />,
                align: 'center',
                width: 120
            },
            {
                title: '商品名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center',
                width: 120
            },
            {
                title: '分类名称',
                dataIndex: 'cateName',
                key: 'cateName',
                align: 'center',
                width: 120
            },
            {
                title: '商品价格',
                dataIndex: 'price',
                key: 'price',
                render: text => (
                    <span>￥{text.toFixed(2)}</span>
                ),
                align: 'center',
                width: 120
            },
            {
                title: '积分抵扣',
                dataIndex: 'giveIntegral',
                key: 'giveIntegral',
                align: 'center',
                width: 120,
                render: (text, record) => record.useScore === 1 ? <span>{text}</span> : <span>未开启</span>
            },
            {
                title: '销量',
                key: 'ficti',
                dataIndex: 'ficti',
                align: 'center',
                width: 80
            },
            {
                title: '库存',
                key: 'stock',
                dataIndex: 'stock',
                render: tags => (
                    <span>{tags}</span>
                ),
                align: 'center',
                width: 80
            },
            {
                title: '系统状态',
                key: 'isShow',
                dataIndex: 'isShow',
                render: (text, record) => {
                    if (goodsTable === 1) {
                        return <Popover content={
                            <Tag
                                style={{ cursor: 'pointer' }}
                                color='red'
                                onClick={() => this.changeOnline(record.id)}
                            >下架</Tag>
                        }>
                            <Tag color='#2596FF'>已上架</Tag>
                        </Popover>
                    } else if (goodsTable === 0) {
                        return <Popover content={
                            <Tag
                                color='red'
                                style={{ cursor: 'pointer' }}
                                onClick={() => this.changeOnline(record.id)}
                            >上架</Tag>
                        }>
                            <Tag color='#2596FF'>待上架</Tag>
                        </Popover>
                    } else {
                        return <Tag color='#1890FF'>已删除</Tag>
                    }
                }
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => {
                    if (goodsTable === 1) {
                        return (<Space size="middle">
                            <Button type="primary" onClick={() => this.editOnline(record)} >编辑</Button>
                            <Popconfirm
                                title="请您确认是否删除?"
                                onConfirm={() => this.delOnline(record.id)}
                                okText="是"
                                cancelText="否"
                            >
                            <Button type="primary">删除</Button>
                            </Popconfirm>
                            <Button type="default" style={{width: 120}} onClick={() => this.spellGroup(record)}>开启拼团</Button>
                        </Space>)
                    } else if (goodsTable === 0) {
                        return (<Space size="middle">
                        <Button type="primary" onClick={() => this.editOnline(record)} >编辑</Button>
                            <Popconfirm
                                title="请您确认是否删除?"
                                onConfirm={() => this.delOnline(record.id)}
                                okText="是"
                                cancelText="否"
                            >
                                <Button type="primary">删除</Button>
                            </Popconfirm>
                        </Space>)
                    } else {
                        return (<Space size="middle">
                            <Popconfirm
                                title="请您确认是否恢复?"
                                onConfirm={() => this.restoreOnline(record.id)}
                                okText="是"
                                cancelText="否"
                            >
                                <Button type="primary">恢复</Button>
                            </Popconfirm>
                            <Popconfirm
                                title="请您确认是否彻底删除?"
                                onConfirm={() => this.realDelOnline(record.id)}
                                okText="是"
                                cancelText="否"
                            >
                                <Button type="primary" danger style={{width: 120}}>彻底删除</Button>
                            </Popconfirm>
                        </Space>)
                    }
                },
                align: 'center'
            },
        ]
        const serviceColumns = [
            {
                title: '服务编号',
                dataIndex: 'id',
                key: 'id',
                align: 'center',
                width: 120
            },
            {
                title: '服务图片',
                dataIndex: 'image',
                key: 'image',
                align: 'center',
                render: text => <img src={text} className='tableGoodsImg' />,
                width: 120
            },
            {
                title: '服务名称',
                dataIndex: 'storeName',
                key: 'storeName',
                align: 'center',
                width: 120
            },
            {
                title: '服务时长',
                dataIndex: 'timeQuantum',
                key: 'timeQuantum',
                align: 'center',
                width: 120
            },
            {
                title: '价格',
                dataIndex: 'otPrice',
                key: 'otPrice',
                align: 'center',
                width: 80
            },
            {
                title: '积分抵扣',
                dataIndex: 'giveIntegral',
                key: 'giveIntegral',
                align: 'center',
                width: 120,
                render: (text, record) => record.useScore === 1 ? <span>{text}</span> : <span>未开启</span>
            },
            {
                title: '销量',
                key: 'ficti',
                dataIndex: 'ficti',
                align: 'center',
                width: 80
            },
            {
                title: '系统状态',
                key: 'isShow',
                dataIndex: 'isShow',
                render: (text, record) => {
                    if (goodsTable === 1) {
                        return <Popover content={
                            <Tag
                                style={{ cursor: 'pointer' }}
                                color='red'
                                onClick={() => this.changeFrame(record.id)}
                            >下架</Tag>
                        }>
                            <Tag color='#2596FF'>已上架</Tag>
                        </Popover>
                    } else if (goodsTable === 0) {
                        return <Popover content={
                            <Tag
                                color='red'
                                style={{ cursor: 'pointer' }}
                                onClick={() => this.changeFrame(record.id)}
                            >上架</Tag>
                        }>
                            <Tag color='#2596FF'>待上架</Tag>
                        </Popover>
                    } else {
                        return <Tag color='#1890FF'>已删除</Tag>
                    }
                },
                align: 'center',
                width: 120
            },
            {
                title: '预约状态',
                dataIndex: 'enableSub',
                key: 'enableSub',
                align: 'center',
                width: 120,
                render: (text, record) => goodsTable === 1
                    ? <Popover content={<span style={{ color: 'red' }}>开启或关闭预约！！！</span>}>
                        <Switch
                            checkedChildren="开启"
                            unCheckedChildren="关闭"
                            checked={text === 0 ? true : false}
                            onClick={e => this.switchService(e, record.id)}
                        />
                    </Popover>
                    : <span>无</span>
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => {
                    if (goodsTable === 1) {
                        return (<Space size="middle">
                            <Button type="primary" onClick={() => this.editService(record)} >编辑</Button>
                            <Popconfirm
                                title="请您确认是否删除?"
                                onConfirm={() => this.delService(record.id)}
                                okText="是"
                                cancelText="否"
                            >
                                <Button type="primary" danger>删除</Button>
                            </Popconfirm>
                            <Button type="default" style={{width: 120}} onClick={() => this.spellGroup(record)}>开启拼团</Button>
                        </Space>)
                    } else if (goodsTable === 0) {
                        return (<Space size="middle">
                        <Button type="primary" onClick={() => this.editService(record)} >编辑</Button>
                            <Popconfirm
                                title="请您确认是否删除?"
                                onConfirm={() => this.delService(record.id)}
                                okText="是"
                                cancelText="否"
                            >
                            <Button type="primary" danger>删除</Button>
                            </Popconfirm>
                        </Space>)
                    } else {
                        return (<Space size="middle">
                            <Popconfirm
                                title="请您确认是否恢复?"
                                onConfirm={() => this.restoreService(record.id)}
                                okText="是"
                                cancelText="否"
                            >
                                <Button type="primary" >恢复</Button>
                            </Popconfirm>
                            <Popconfirm
                                title="请您确认是否彻底删除?"
                                onConfirm={() => this.removeService(record.id)}
                                okText="是"
                                cancelText="否"
                            >
                                <Button type="primary" danger style={{width: 120}}>彻底删除</Button>
                            </Popconfirm>
                        </Space>)
                    }
                },
                align: 'center',
                // width: 500
            },
        ]
        let columns = [], data = []
        if (goodsType === 0) {
            columns = serviceColumns
            data = serviceList
        } else if (goodsType === 1) {
            columns = onlineColumns
            data = onlineList
        }
        const uploadButtonA = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
            </div>
        )
        return (
            <div className="goods">
                {/* 新增、编辑线上项目模态框 */}
                <Modal
                    visible={goodsVisble}
                    onCancel={() => this.setState({ goodsVisble: false })}
                    onOk={() => this.goodsAction(actionType)}
                    width={800}
                    okText='确定'
                    cancelText="取消"
                    title={goodsTitle}
                >
                    <div className="goods-modal-installment">

                        {
                            goodsType === 0
                                ? <div>
                                    <div className="goods-modal-header">
                                        <span className="goods-modal-header-span">服务类型</span>
                                        <Radio.Group value={serviceType} onChange={e => this.setState({ serviceType: e.target.value })}>
                                            <Radio value={1}>单次</Radio>
                                            <Radio value={2}>卡项</Radio>
                                        </Radio.Group>
                                    </div>
                                    {
                                        serviceType === 2
                                            ? <div>
                                                <div className="goods-modal-body-item">
                                                    <span className="goods-modal-header-span">卡项分类</span>
                                                    <Radio.Group value={cardType} onChange={e => this.setState({ cardType: e.target.value })}>
                                                        <Radio value={1}>次数卡</Radio>
                                                        <Radio value={0}>时间卡</Radio>
                                                    </Radio.Group>
                                                </div>
                                                <div className="goods-modal-body-item">
                                                    <span className="goods-modal-body-span">{cardType === 1 ? '有效次数' : '有效天数'}</span>
                                                    <Input
                                                        className="goods-modal-body-input"
                                                        placeholder={cardType === 1 ? '请输入有效次数' : '请输入有效天数'}
                                                        value={astrict}
                                                        onChange={e => this.setState({ astrict: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            : null
                                    }
                                    <div className="goods-modal-header">
                                        <span className="goods-modal-header-span">单次服务时长</span>
                                        <Select
                                            placeholder='请选择服务时长'
                                            style={{ width: 250 }}
                                            value={serviceTime}
                                            onChange={(key, item) => {
                                                this.setState({
                                                    serviceTime: item.children
                                                }, () => {
                                                    let timeArr
                                                    if (this.state.serviceTime === '30分钟') {
                                                        timeArr = [
                                                            { id: 5, value: '8:00-8:30' },
                                                            { id: 6, value: '8:30-9:00' },
                                                            { id: 7, value: '9:00-9:30' },
                                                            { id: 8, value: '9:30-10:00' },
                                                            { id: 9, value: '10:00-10:30' },
                                                            { id: 10, value: '10:30-11:00' },
                                                            { id: 11, value: '11:00-11:30' },
                                                            { id: 12, value: '11:30-12:00' },
                                                            { id: 13, value: '13:00-13:30' },
                                                            { id: 14, value: '13:30-14:00' },
                                                            { id: 15, value: '14:00-14:30' },
                                                            { id: 16, value: '14:30-15:00' },
                                                            { id: 17, value: '15:00-15:30' },
                                                            { id: 18, value: '15:30-16:00' },
                                                            { id: 19, value: '16:00-16:30' },
                                                            { id: 20, value: '16:30-17:00' },
                                                            { id: 21, value: '17:00-17:30' },
                                                            { id: 22, value: '17:30-18:00' },
                                                            { id: 23, value: '18:00-18:30' },
                                                            { id: 24, value: '18:30-19:00' },
                                                            { id: 25, value: '19:00-19:30' },
                                                            { id: 26, value: '19:30-20:00' },
                                                            { id: 27, value: '20:00-20:30' },
                                                            { id: 28, value: '20:30-21:00' },
                                                            { id: 29, value: '21:00-21:30' },
                                                            { id: 30, value: '21:30-22:00' },
                                                        ]
                                                    } else if (this.state.serviceTime === '60分钟') {
                                                        timeArr = [
                                                            { id: 31, value: '8:00-9:00' },
                                                            { id: 32, value: '9:00-10:00' },
                                                            { id: 33, value: '10:00-11:00' },
                                                            { id: 34, value: '11:00-12:00' },
                                                            { id: 35, value: '13:00-14:00' },
                                                            { id: 36, value: '14:00-15:00' },
                                                            { id: 37, value: '15:00-16:00' },
                                                            { id: 38, value: '16:00-17:00' },
                                                            { id: 39, value: '17:00-18:00' },
                                                            { id: 40, value: '18:00-19:00' },
                                                            { id: 41, value: '19:00-20:00' },
                                                            { id: 42, value: '20:00-21:00' },
                                                            { id: 43, value: '21:00-22:00' },
                                                        ]
                                                    } else if (this.state.serviceTime === '90分钟') {
                                                        timeArr = [
                                                            { id: 44, value: '8:00-9:30' },
                                                            { id: 45, value: '9:30-11:00' },
                                                            { id: 46, value: '11:00-12:30' },
                                                            { id: 47, value: '13:30-15:00' },
                                                            { id: 48, value: '15:00-16:30' },
                                                            { id: 49, value: '16:30-18:00' },
                                                            { id: 50, value: '18:00-19:30' },
                                                            { id: 51, value: '19:30-21:00' },
                                                            { id: 52, value: '21:00-22:30' },
                                                        ]
                                                    } else {
                                                        timeArr = [
                                                            { id: 53, value: '8:00-10:00' },
                                                            { id: 54, value: '10:00-12:00' },
                                                            { id: 55, value: '13:00-15:00' },
                                                            { id: 56, value: '15:00-17:00' },
                                                            { id: 57, value: '17:00-19:00' },
                                                            { id: 58, value: '19:00-21:00' },
                                                        ]
                                                    }
                                                    this.setState({
                                                        timeArr,
                                                        checkTimeArr: []
                                                    })
                                                })
                                            }}
                                        >
                                            <Option value='30分钟'>30分钟</Option>
                                            <Option value='60分钟'>60分钟</Option>
                                            <Option value='90分钟'>90分钟</Option>
                                            <Option value='120分钟'>120分钟</Option>
                                        </Select>
                                    </div>
                                    <div className='goods-modal-header'>
                                        <span className='goods-modal-body-span'>可预约时间</span>
                                        <Select
                                            placeholder='请选择可预约时间'
                                            style={{ width: 500 }}
                                            defaultValue={checkTimeArr}
                                            value={checkTimeArr}
                                            mode="multiple"
                                            optionLabelProp="label"
                                            onChange={(value, label) => {
                                                console.log(value)
                                                this.setState({
                                                    checkTimeArr: value
                                                })
                                            }}
                                        >
                                            {timeArr.map(item => {
                                                return (
                                                    <Option key={item.id} label={item.value} value={item.value}>{item.value}</Option>
                                                )
                                            })}
                                        </Select>
                                    </div>
                                    <div className='goods-modal-header'>
                                        <span className='goods-modal-body-span'>服务人数上限</span>
                                        <InputNumber
                                            className="goods-modal-body-input"
                                            min={1}
                                            max={10}
                                            value={servicePlepeo}
                                            style={{ width: 250 }}
                                            onChange={e => this.setState({ servicePlepeo: e })}
                                        />
                                    </div>
                                </div>
                                : null
                        }

                        <div className='goods-modal-body-item'>
                            <span className='goods-modal-body-span'>项目分类</span>
                            <Select
                                className="goods-modal-body-input"
                                value={goodsClass}
                                onChange={e => this.setState({ goodsClass: e })}
                            >
                                {
                                    classList.map(item =>
                                        <Option key={item.id} value={item.id}>{item.cateName}</Option>
                                    )
                                }
                            </Select>
                        </div>

                        <div className="goods-modal-body-item">
                            <span className="goods-modal-body-span">项目名称</span>
                            <Input
                                className="goods-modal-body-input"
                                placeholder="请输入项目名称"
                                value={goodsName}
                                onChange={e => this.setState({ goodsName: e.target.value })}
                            />
                        </div>
                        <div className="goods-modal-header">
                            <span className="goods-modal-body-span">项目图片</span>
                            <div className="goods-modal-body-image">
                                <Upload
                                    listType="picture-card"
                                    showUploadList={false}
                                    action="http://47.108.174.202:9010/upload/files-upload"
                                    onChange={this.uploadGoodsImage}
                                >
                                    {goodsImage === null
                                        ? uploadButtonA
                                        : <img src={goodsImage} alt="photos" className='fItemConimg' />}
                                </Upload>
                            </div>
                        </div>

                        <div className={integral === 1 ? 'goods-modal-body-item' : 'goods-modal-header'}>
                            <span className="goods-modal-body-span">积分抵扣</span>
                            <Radio.Group
                                value={integral}
                                onChange={e => this.setState({ integral: e.target.value })}>
                                <Radio value={1}>开启</Radio>
                                <Radio value={0}>关闭</Radio>
                            </Radio.Group>
                        </div>
                        {
                            integral === 1
                                ? <div className="goods-modal-body-item">
                                    <span className="goods-modal-body-span">可抵积分</span>
                                    <Input
                                        className="goods-modal-body-input"
                                        placeholder="请输入项目价格"
                                        value={intNum}
                                        onChange={e => this.setState({ intNum: e.target.value })}
                                        onBlur={() => {
                                            if (/^([0-9][0-9]*)$/.test(this.state.intNum)) {

                                            } else {
                                                message.warning('请输入整数')
                                                this.setState({ intNum: null })
                                            }
                                        }}
                                    />
                                </div>
                                : null
                        }

                        <div className="goods-modal-body-item">
                            <span className="goods-modal-body-span">项目价格</span>
                            <Input
                                className="goods-modal-body-input"
                                placeholder="请输入项目价格"
                                value={goodsPrice}
                                onChange={e => this.setState({ goodsPrice: e.target.value })}
                            />
                        </div>
                        <div className="goods-modal-body-item">
                            <span className="goods-modal-body-span">虚拟销量</span>
                            <Input
                                className="goods-modal-body-input"
                                placeholder="请输入虚拟销量"
                                value={goodsSales}
                                onChange={e => this.setState({ goodsSales: e.target.value })}
                            />
                        </div>

                        {
                            goodsType === 1
                                ? <div>
                                    <div className="goods-modal-body-item">
                                        <span className="goods-modal-body-span">项目邮费</span>
                                        <Input
                                            className="goods-modal-body-input"
                                            placeholder="请输入项目邮费"
                                            value={goodsPostage}
                                            onChange={e => this.setState({ goodsPostage: e.target.value })}
                                        />
                                    </div>
                                    <div className="goods-modal-body-item">
                                        <span className="goods-modal-body-span">项目库存</span>
                                        <Input
                                            className="goods-modal-body-input"
                                            placeholder="请输入项目库存"
                                            value={goodsStock}
                                            onChange={e => this.setState({ goodsStock: e.target.value })}
                                        />
                                    </div>
                                </div>
                                : null
                        }

                        <div className="goods-modal-body-item">
                            <span className="goods-modal-body-span">员工提成</span>
                            <Input
                                className="goods-modal-body-input"
                                placeholder="请输入整数"
                                value={goodsRoyaltyRate}
                                onChange={e => this.setState({ goodsRoyaltyRate: e.target.value })}
                                onBlur={() => {
                                    if (this.state.goodsRoyaltyRate) {
                                        if (!(/^[0-9][0-9]{0,1}$/.test(this.state.goodsRoyaltyRate))) {
                                            message.warning('请输入1-99的整数')
                                            this.setState({ goodsRoyaltyRate: '' })
                                        }
                                    }
                                }}
                            />
                            <span style={{ fontSize: 18 }}>%</span>
                        </div>

                        <div className="goods-modal-header">
                            <span className="goods-modal-body-span" style={{ verticalAlign: 'top' }}>项目详情</span>
                            <TextArea rows={6} style={{ width: '70%' }}
                                value={goodsRemarks}
                                onChange={e => this.setState({ goodsRemarks: e.target.value })} />

                        </div>
                    </div>
                </Modal>

                {/* 开启拼团模态框 */}
                <Modal
                    visible={isSpellGroup}
                    onCancel={() => this.setState({ isSpellGroup: false })}
                    onOk={this.addSpellGroup}
                    width={800}
                    okText='确定'
                    cancelText="取消"
                    title="开启拼团"
                >
                    <div style={{ width: '80%', margin: '0 auto' }}>
                        <div className="spellItem">
                            <span className="spellSpan">拼团项目类型</span>
                            <Input
                                className="spellInput"
                                value={goodsType === 0 ? '服务类' : '实物类'}
                                disabled={true}
                            />
                        </div>
                        <div className="spellItem">
                            <span className="spellSpan">拼团名称</span>
                            <Input
                                className="spellInput"
                                value={spellName}
                                onChange={e => this.setState({ spellName: e.target.value })}
                            />
                        </div>

                        <div className="spellItem">
                            <span className="spellSpan">拼团开始时间</span>
                            <DatePicker
                                locale={locale}
                                style={{ marginRight: 10 }}
                                allowClear={false}
                                onChange={this.getStartDate}
                            />
                            <TimePicker
                                locale={locale}
                                allowClear={false}
                                onChange={this.getStartTime}
                            />
                        </div>

                        <div className="spellItem">
                            <span className="spellSpan">拼团结束时间</span>
                            <DatePicker
                                locale={locale}
                                allowClear={false}
                                style={{ marginRight: 10 }}
                                onChange={this.getEndDate}
                            />
                            <TimePicker
                                locale={locale}
                                allowClear={false}
                                onChange={this.getEndTime}
                            />
                        </div>

                        <div className="spellItem">
                            <span className="spellSpan">产品图片</span>
                            <div className="spellItemImage">
                                <Upload
                                    listType="picture-card"
                                    showUploadList={false}
                                    action="http://47.108.174.202:9010/upload/files-upload"
                                    onChange={this.uploadSpellImage}
                                >
                                    {spellImage === null
                                        ? uploadButtonA
                                        : <img src={spellImage} alt="photos" className='fItemConimg' />}
                                </Upload>
                            </div>
                        </div>

                        <div className="spellItem">
                            <div className="timeItem">
                                <span className="smallSpan">原价</span>
                                <Input
                                    disabled={true}
                                    className="smallInput"
                                    value={originalPrice}
                                />
                            </div>
                            <div className="timeItem">
                                <span className="smallSpan">拼成价格</span>
                                <Input
                                    className="smallInput"
                                    placeholder="请输入拼成价格"
                                    value={spellPrice}
                                    onChange={e => this.setState({spellPrice: e.target.value})}
                                />
                            </div>
                            {/* <div className="timeItem">
                                <span className="smallSpan">拼团折扣</span>
                                <Input
                                    className="smallInput"
                                    placeholder="请输入两位小数，例如0.85"
                                    value={spellDiscount}
                                    onChange={e => this.setDiscount(e)}
                                    onBlur={() => {
                                        if (this.state.spellDiscount) {
                                            if (!/^\d+(\.\d{0,2})?$/.test(this.state.spellDiscount)) {
                                                message.warning('折扣请正确输入两位小数')
                                                this.setState({
                                                    spellDiscount: '',
                                                    spellPrice: ''
                                                })
                                            }
                                        }
                                    }}
                                />
                            </div> */}
                        </div>

                        <div className="spellItem">
                            
                            <div className="timeItem">
                                <span className="smallSpan">拼团人数</span>
                                <Input
                                    className="smallInput"
                                    value={spellPeople}
                                    onChange={e => this.setState({ spellPeople: e.target.value })}
                                />
                            </div>
                            <div className="timeItem">
                                <span className="smallSpan">销量</span>
                                <Input
                                    className="smallInput"
                                    value={spellSales}
                                    onChange={e => this.setState({ spellSales: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="spellItem">
                            <div className="timeItem">
                                <span className="smallSpan">库存</span>
                                <Input
                                    placeholder="请输入库存"
                                    className="smallInput"
                                    value={spellStock}
                                    onChange={e => this.setState({ spellStock: e.target.value })}
                                />
                            </div>
                            <div className="timeItem">
                                <span className="smallSpan">邮费</span>
                                <Input
                                    className="smallInput"
                                    value={spellPostage}
                                    onChange={e => this.setState({ spellPostage: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="spellItem">
                            <span className="spellSpan areaSpan">拼团内容</span>
                            <TextArea
                                className="smallInput"
                                rows={4}
                                placeholder="请输入拼团内容及描述"
                                value={spellDescription}
                                onChange={e => this.setState({ spellDescription: e.target.value })}
                            />
                        </div>

                    </div>

                </Modal>

                <div className='goods-header'>
                    <span>线上项目</span>
                </div>

                <div style={{ margin: 20, marginBottom: 0 }}>
                    <span
                        className={goodsType === 0 ? 'goods-check-type' : 'goods-not-check-type'}
                        onClick={() => this.setState({ goodsType: 0, goodsTable: 1 }, () => this.getGoods())}
                    >服务类（可预约）</span>
                    <span
                        className={goodsType === 1 ? 'goods-check-type' : 'goods-not-check-type'}
                        onClick={() => this.setState({ goodsType: 1, goodsTable: 1 }, () => this.getGoods())}
                    >实物类（不可预约）</span>
                </div>

                <div className="goods-body">
                    <div className='goods-class'>
                        <span
                            className={goodsTable === 1 ? 'goods-check-class' : 'goods-not-check-calss'}
                            onClick={() => this.setState({ goodsTable: 1 }, () => this.getGoods())}
                        >出售中</span>
                        <span
                            className={goodsTable === 0 ? 'goods-check-class' : 'goods-not-check-calss'}
                            onClick={() => this.setState({ goodsTable: 0 }, () => this.getGoods())}
                        >待上架</span>
                        <span
                            className={goodsTable === 3 ? 'goods-check-class' : 'goods-not-check-calss'}
                            onClick={() => this.setState({ goodsTable: 3 }, () => this.getGoods())}
                        >回收站</span>
                    </div>

                    <div className="goods-search">
                        <Input
                            className="goods-search-input"
                            value={searchVal}
                            onChange={e => this.setState({ searchVal: e.target.value })}
                            placeholder="输入项目名搜索"
                        />
                        <span className="goods-search-btn" onClick={this.search}>搜索</span>
                        <span className="goods-search-refresh"
                            onClick={() => this.setState({ searchVal: '' }, () => this.getGoods())}>刷新</span>

                        <div className="goods-search-add" onClick={this.addGoods}>
                            <PlusOutlined className="goods-search-add-icon" />
                            <span className="goods-search-add-span">新增线上项目</span>
                        </div>
                        <Select
                            className="goods-search-class"
                            value={classify}
                            onChange={e => this.setState({ classify: e }, () => this.getGoods())}
                        >
                            <Option value="">全部</Option>
                            {
                                classList.map(item =>
                                    <Option key={item.id} value={item.id}>{item.cateName}</Option>
                                )
                            }
                        </Select>
                    </div>
                    <Table
                        style={{ width: '100%' }}
                        columns={columns}
                        dataSource={data}
                        locale={{ emptyText: emptyText }}
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            position: ['bottomLeft'],
                            onChange: (page, pageSize) => {
                                console.log('page：', page)
                                this.setState({
                                    loading: true,
                                    servicePage: page
                                }, () => this.getGoods())
                            },
                            current: servicePage,
                            total: data.length
                        }}
                    />
                </div>
            </div >
        )
    }
}