import React, { Component } from 'react'
import './Goods.css'
import {
    Input, Button, Space, Table, Tag,
    Popconfirm, message, Upload, Image,
    Popover, Select, DatePicker, TimePicker,
    Radio
} from 'antd'
import axios from '../../http/index'
import Modal from 'antd/lib/modal/Modal'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'

const { TextArea } = Input
const { Option } = Select
const { RangePicker } = DatePicker

// 预览相关
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class Goods extends Component {
    state = {
        // 表格无数据时显示
        emptyText: '暂无数据',
        goodsIndex: 1,
        goodsTable: 1,
        name: '',
        visible: false,
        cateName: '',
        // 分期项目
        stageVisible: false,
        stageFenlei: '',
        stageName: '',
        stageKeyWord: '',
        stageImg: '',
        stagePrice: '',
        stageSales: 0,
        stageNumVal: '',
        stageAmount: '',
        stageRemarks: '',
        fenleiList: [],
        stageData: [],
        promptModal: false,
        promptInfo: '',
        sureChange: '',
        stageVisiInfo: '',
        stageNo: '',
        cateId: '',
        royaltyRate: 0,
        // 预览
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
        goodsimgVisible: false,
        goodsImage: '',
        goodsFileList: [],
        // 线上商品
        onlineGoods: [],
        goodsModal: false,
        goodsMoInfo: '',
        goodsNo: '',
        goodsClass: '',
        goodsClassVal: '',
        // 线上商品名
        goodsName: '',
        goodsKey1: '',
        goodsKey2: '',
        goodsKey3: '',
        // 产品详情
        goodsRemarks: '',
        // 价格
        goodsPrice: '',
        goodsVip: '',
        // 邮费
        goodsPostage: 0,
        // 销量
        goodsSales: 0,
        goodsSku: '',
        goodsProModal: false,
        goodsProInfo: '',
        goodsProId: '',

        treeData: [],
        // 线上商品分类
        value: 1,
        loading: true,
        // 控制分期明细显示
        isStageDetailInfo: false,
        // 每一期分期价格
        eachStagePrice: '',
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
        spellPrice: 0,
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
        serviceEndTime: ''
    }
    // 获取分期项目列表
    getStageItem = () => {
        const { name, goodsTable, cateName } = this.state
        let user = JSON.parse(localStorage.getItem('user'))
        axios({
            url: '/statistics/phasedProject',
            method: 'GET',
            params: {
                cateName: cateName, // 分类名称
                enterId: user.id, // 商户id
                limit: 10, // 每页数量
                name: name, // 项目名称
                offset: 1, // 页码
                order: '', // 排序方式
                type: goodsTable,
            }
        })
            .then(res => {
                console.log('获取分期项目成功', res)
                if (res.data.data.list) {
                    let list = res.data.data.list
                    list.map(item => {
                        item.key = item.id
                    })
                    this.setState({
                        loading: false,
                        stageData: list
                    })
                }
            })
            .catch(err => {
                console.log('获取分期项目失败', err)
                message.error('获取分期项目失败')
            })
    }
    // 获取线上商品列表
    getOnlineItem = () => {
        const { name, goodsTable, cateName } = this.state
        let user = JSON.parse(localStorage.getItem('user'))
        let type
        if (goodsTable === 2) {
            type = 0
        } else {
            type = 1
        }
        axios({
            url: '/statistics/onlineProducts',
            method: 'GET',
            params: {
                cateName: cateName, // 分类名称
                enterId: user.id, // 商户id
                limit: 10, // 每页数量
                name: name, // 项目名称
                offset: 1, // 页码
                order: '', // 排序方式
                type,
            }
        })
            .then(res => {
                console.log('查询线上商品成功', res)
                if (res.data.data.list) {
                    let list = res.data.data.list
                    list.map(item => {
                        item.key = item.id
                    })
                    this.setState({
                        loading: false,
                        onlineGoods: list
                    })
                }
            })
            .catch(err => {
                console.log('查询线上商品失败', err)
                message.error('查询线上商品失败')
            })
    }
    // 获取商品分类
    goodsFenleiList = () => {
        axios({
            url: '/api/yxStoreCategory',
            method: 'GET',
            params: {
                page: 0,
                size: 1000,
                sort: 'id,desc'
            }
        })
            .then(res => {
                console.log('获取商品分类成功', res)
                let treeArr = []
                treeArr = res.data.content.map(item => {
                    let obj = {}
                    obj = {
                        title: item.label,
                        value: item.id,
                        children: []
                    }
                    if (item.children) {
                        for (let i = 0; i < item.children.length; i++) {
                            let childObj = {}
                            childObj = {
                                title: item.children[i].label,
                                value: item.children[i].id,
                                pid: item.id
                            }
                            obj.children.push(childObj)
                        }
                    }
                    return obj
                })
                this.setState({ treeData: treeArr })
            })
            .catch(err => {
                console.log('获取商品分类失败', err)
            })
    }
    treeChange = (value, label, extra) => {
        console.log(value, label, extra)
        this.setState({ value })
    }
    componentDidMount() {
        this.getStageItem()
        this.goodsFenleiList()
    }
    setName = e => {
        this.setState({
            name: e.target.value
        })
    }
    chooseType = (i) => {
        this.setState({
            goodsTable: i
        }, () => {
            if (this.state.goodsIndex === 1) {
                this.getStageItem()
            } else if (i === 3 && this.state.goodsIndex === 2) {
                this.getRecycle()
            } else {
                this.getOnlineItem()
            }
        })
    }
    // 气泡删除
    confirm = (re) => {
        axios({
            url: '/statistics/deletePhasedProject',
            method: 'GET',
            params: {
                id: re.id
            }
        })
            .then(res => {
                message.success('删除成功，已放入回收站！')
                this.getStageItem()
            })
            .catch(err => {
                message.error('删除失败')
            })
    }
    realDel = (re) => {
        console.log('彻底删除', re)
    }
    restore = re => {
        console.log('恢复', re)
        this.setState({
            promptModal: true,
            sureChange: re.id,
            promptInfo: '下架'
        })
    }
    // 气泡取消
    cancel = () => {
        console.log('取消删除')
    }
    // 修改分期
    sureChange = () => {
        let user = JSON.parse(localStorage.getItem('user'))
        const { stageName, stageKeyWord, stagePrice,
            stageSales, stageNumVal, stageAmount,
            stageRemarks, stageNo, fileList, value, royaltyRate } = this.state
        if (stageName === '' || stagePrice === '' || stageNumVal === ''
            || stageAmount === '' || stageRemarks === '' || fileList.length === 0) {
            message.warning('请检查是否有未填写的内容！')
        } else {
            let photoStr = ''
            let baseUrl = 'https://www.bkysc.cn/api/files-upload/'
            for (let i = 0; i < fileList.length; i++) {
                if (fileList[i].response) {
                    if (photoStr === '') {
                        photoStr = baseUrl + fileList[i].response.data
                    } else {
                        photoStr = baseUrl + fileList[i].response.data + ',' + photoStr
                    }
                } else {
                    if (photoStr === '') {
                        photoStr = fileList[i].url
                    } else {
                        photoStr = fileList[i].url + ',' + photoStr
                    }
                }
            }
            let formData = new FormData()
            formData.append('cateId', value)
            formData.append('enterId', user.id)
            formData.append('id', stageNo)
            formData.append('keyword', stageKeyWord)
            formData.append('name', stageName)
            formData.append('photo', photoStr)
            formData.append('prepaymentAmount', Number(stageAmount))
            formData.append('price', Number(stagePrice))
            formData.append('remarks', stageRemarks)
            formData.append('sales', stageSales)
            formData.append('stagesNumber', Number(stageNumVal))
            formData.append('storeId', user.systemStoreId)
            formData.append('royaltyRate', Number(royaltyRate))
            axios({
                url: '/statistics/updatePhasedProject',
                method: 'POST',
                data: formData
            })
                .then(res => {
                    console.log('修改分期项目成功')
                    message.success('分期项目修改成功', res)
                    this.setState({
                        stageVisible: false,
                    }, () => {
                        this.getStageItem()
                    })
                })
                .catch(err => {
                    console.log('修改分期项目失败', err)
                })
        }
    }
    // 添加分期
    okShelves = () => {
        let user = JSON.parse(localStorage.getItem('user'))
        const { stageName, stageKeyWord, stagePrice,
            stageSales, stageNumVal, stageAmount,
            stageRemarks, fileList, value, royaltyRate } = this.state
        if (stageName === '' || stagePrice === '' || stageNumVal === ''
            || stageAmount === '' || stageRemarks === '' || fileList.length === 0) {
            message.warning('请检查是否有未填写的内容！')
        } else {
            let photoStr = ''
            let baseUrl = 'https://www.bkysc.cn/api/files-upload/'
            for (let i = 0; i < fileList.length; i++) {
                if (photoStr === '') {
                    photoStr = baseUrl + fileList[i].response.data
                } else {
                    photoStr = baseUrl + fileList[i].response.data + ',' + photoStr
                }
            }
            let formData = new FormData()
            formData.append('cateId', value)
            formData.append('enterId', user.id)
            formData.append('keyWord', stageKeyWord)
            formData.append('name', stageName)
            formData.append('photo', photoStr)
            formData.append('prepaymentAmount', Number(stageAmount))
            formData.append('price', Number(stagePrice))
            formData.append('remarks', stageRemarks)
            formData.append('sales', stageSales)
            formData.append('stagesNumber', Number(stageNumVal))
            formData.append('storeId', user.systemStoreId)
            formData.append('royaltyRate', Number(royaltyRate))
            axios({
                url: '/statistics/addPhasedProject',
                method: 'POST',
                data: formData
            })
                .then(res => {
                    console.log('添加分期项目成功', res)
                    message.success('分期项目添加成功')
                    this.setState({
                        stageVisible: false,
                        isStageDetailInfo: false
                    }, () => {
                        this.getStageItem()
                    })
                })
                .catch(err => {
                    console.log('添加分期项目失败', err)
                })
        }
    }
    // 下架和上架分期项目
    dismount = (i, type) => {
        axios({
            url: '/statistics/dismountPhasedProject',
            method: 'GET',
            params: {
                id: i
            }
        })
            .then(res => {
                type === '下架' ? message.success('下架成功') : message.success('上架成功')
                this.getStageItem()
            })
            .catch(err => {
                console.log(err)
            })
    }
    // 下架和上架线上商品
    goodsUpDown = (i, type) => {
        axios({
            url: '/statistics/dismountOnlineProducts',
            method: 'GET',
            params: {
                id: i
            }
        })
            .then(res => {
                type === '下架' ? message.success('下架成功') : message.success('上架成功')
                this.getOnlineItem()
            })
            .catch(err => {
                console.log(err)
            })
    }
    handleOk = () => {
        this.dismount(this.state.sureChange, this.state.promptInfo)
        this.setState({
            promptModal: false,
            sureChange: ''
        })
    }
    handleGoodsOk = () => {
        this.goodsUpDown(this.state.goodsProId, this.state.goodsProInfo)
        this.setState({
            goodsProModal: false,
            goodsProId: ''
        })
    }
    handleCancel = () => {
        this.setState({
            promptModal: false,
            sureChange: '',
            goodsProModal: false,
            goodsProId: ''
        })
    }
    // 打开新增、编辑分期项目模态框
    editStage = (type, i) => {
        if (type === 'edit') {
            let imgArr = []
            let urlArr = i.photo.split(',')
            for (let i = 0; i < urlArr.length; i++) {
                let obj = {
                    uid: i,
                    url: urlArr[i]
                }
                imgArr.push(obj)
            }
            this.setState({
                stageVisible: true,
                stageVisiInfo: type,
                stageName: i.name,
                stageKeyWord: i.keyWord,
                fileList: imgArr,
                stagePrice: i.price,
                stageSales: i.sales,
                stageNumVal: i.stagesNumber,
                stageAmount: i.prepaymentAmount,
                stageRemarks: i.remarks,
                stageNo: i.id,
                value: i.cateId,
                royaltyRate: i.royaltyRate
            }, () => this.stageDetailInfo())
        } else {
            this.setState({
                stageVisible: true,
                stageVisiInfo: type,
                stageFenlei: '',
                stageName: '',
                stageKeyWord: '',
                stagePrice: '',
                stageSales: '',
                stageNumVal: '',
                stageAmount: '',
                stageRemarks: '',
                stageNo: '',
                cateId: '',
                fileList: [],
                value: 1,
                royaltyRate: 0
            }, () => this.stageDetailInfo())
        }

    }
    checkIndex = (i) => {
        this.setState({
            goodsIndex: i,
            goodsTable: 1
        }, () => {
            if (i === 1) {
                this.getStageItem()
            } else {
                this.getOnlineItem()
            }
        })
    }

    // 添加线上商品-新增并上架
    goodsOkShelves = (which) => {
        let user = JSON.parse(localStorage.getItem('user'))
        const { goodsClass, goodsName, goodsKey1, goodsKey2, goodsKey3,
            goodsRemarks, goodsPrice, goodsVip, goodsPostage, goodsSales,
            goodsSku, goodsFileList, value, integral, commission } = this.state
        if (goodsName === '' || goodsRemarks === '' || goodsPrice === ''
            || goodsSku === '' || goodsFileList.length === 0) {
            message.warning('请检查是否有未填写的内容！')
        } else {
            let photoStr = ''
            let baseUrl = 'https://www.bkysc.cn/api/files-upload/'
            for (let i = 0; i < goodsFileList.length; i++) {
                if (photoStr === '') {
                    photoStr = baseUrl + goodsFileList[i].response.data
                } else {
                    photoStr = baseUrl + goodsFileList[i].response.data + ',' + photoStr
                }
            }
            let formData = new FormData()
            formData.append('merId', user.id)
            formData.append('keyword', goodsKey1 + ',' + goodsKey2 + ',' + goodsKey3)
            formData.append('cateId', value)
            formData.append('name', goodsName)
            formData.append('price', Number(goodsPrice))
            formData.append('vipPrice', Number(goodsVip))
            formData.append('image', photoStr)
            formData.append('ficti', Number(goodsSales))
            formData.append('stock', Number(goodsSku))
            formData.append('storeInfo', goodsRemarks)
            formData.append('postage', Number(goodsPostage))
            formData.append('isShow', which)
            formData.append('isNew', 0)
            formData.append('isBest', 0)
            formData.append('isBenefit', 0)
            formData.append('useScore', Number(integral))
            formData.append('royaltyRate', Number(commission))
            axios({
                url: '/statistics/addProducts',
                method: 'POST',
                data: formData
            })
                .then(res => {
                    console.log('新增线上商品成功', res)
                    message.success('添加成功')
                    this.getOnlineItem()
                    this.setState({
                        goodsModal: false
                    })
                })
                .catch(err => {
                    console.log('添加失败', err)
                })
        }
    }
    // 打开新增、编辑线上商品模态框
    editOnline = (type, i) => {
        this.setState({
        }, () => {
            console.log(i)
            if (type === 'edit') {
                let keyArr = i.keyword.split(',')
                let imgArr = []
                let urlArr = i.image.split(',')
                for (let i = 0; i < urlArr.length; i++) {
                    let obj = {
                        uid: i,
                        url: urlArr[i]
                    }
                    imgArr.push(obj)
                }
                this.setState({
                    goodsModal: true,
                    goodsMoInfo: type,
                    goodsNo: i.id,
                    value: i.cateId,
                    goodsName: i.name,
                    goodsKey1: keyArr[0],
                    goodsKey2: keyArr[1],
                    goodsKey3: keyArr[2],
                    goodsRemarks: i.storeInfo,
                    goodsPrice: i.price,
                    goodsVip: i.vipPrice,
                    goodsPostage: i.postage,
                    goodsSales: i.ficti,
                    goodsSku: i.stock,
                    goodsFileList: imgArr,
                    integral: i.useScore,
                    commission: i.royaltyRate
                })
            } else {
                this.setState({
                    goodsModal: true,
                    goodsMoInfo: type,
                    goodsNo: '',
                    goodsClass: '',
                    goodsClassVal: '',
                    goodsName: '',
                    goodsKey1: '',
                    goodsKey2: '',
                    goodsKey3: '',
                    goodsRemarks: '',
                    goodsPrice: '',
                    goodsVip: '',
                    goodsPostage: '',
                    goodsSales: '',
                    goodsSku: '',
                    goodsFileList: [],
                    value: 1,
                    integral: 1,
                    commission: ''
                })
            }
        })
    }
    // 修改线上商品
    onlineSure = (i) => {
        let user = JSON.parse(localStorage.getItem('user'))
        const { goodsNo, goodsName, goodsKey1, goodsKey2, goodsKey3, goodsClass,
            goodsRemarks, goodsPrice, goodsVip, goodsPostage, goodsSales, goodsSku, value,
            goodsFileList, integral, commission } = this.state
        if (goodsName === '' || goodsRemarks === '' || goodsPrice === ''
            || goodsSku === '' || goodsFileList.length === 0) {
            message.warning('请检查是否有未填写的内容！')
        } else {
            let photoStr = ''
            let baseUrl = 'https://www.bkysc.cn/api/files-upload/'
            for (let i = 0; i < goodsFileList.length; i++) {
                if (goodsFileList[i].response) {
                    if (photoStr === '') {
                        photoStr = baseUrl + goodsFileList[i].response.data
                    } else {
                        photoStr = baseUrl + goodsFileList[i].response.data + ',' + photoStr
                    }
                } else {
                    if (photoStr === '') {
                        photoStr = goodsFileList[i].url
                    } else {
                        photoStr = goodsFileList[i].url + ',' + photoStr
                    }
                }
            }
            let isshow
            if (i === 1) {
                isshow = 1
            } else {
                isshow = 0
            }
            let formData = new FormData()
            formData.append('cateId', value)
            formData.append('ficti', goodsSales)
            formData.append('id', goodsNo)
            formData.append('image', photoStr)
            formData.append('isShow', isshow)
            formData.append('keyword', goodsKey1 + ',' + goodsKey2 + ',' + goodsKey3)
            formData.append('merId', user.id)
            formData.append('name', goodsName)
            formData.append('postage', goodsPostage)
            formData.append('price', Number(goodsPrice))
            formData.append('stock', goodsSku)
            formData.append('storeInfo', goodsRemarks)
            formData.append('vipPrice', Number(goodsVip))
            formData.append('useScore', Number(integral))
            formData.append('royaltyRate', Number(commission))
            axios({
                url: '/statistics/updateOnlineProducts',
                method: 'POST',
                data: formData
            })
                .then(res => {
                    message.success('修改成功')
                    this.getOnlineItem()
                    this.setState({
                        goodsModal: false
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    // 回收站商品
    getRecycle = () => {
        const { name, cateName } = this.state
        let user = JSON.parse(localStorage.getItem('user'))
        axios({
            url: '/statistics/recycleBinProducts',
            method: 'GET',
            params: {
                cateName: cateName, // 分类名称
                enterId: user.id, // 商户id
                limit: 10, // 每页数量
                name: name, // 项目名称
                offset: 1, // 页码
                order: '', // 排序方式
                type: 3,
            }
        })
            .then(res => {
                message.success('查询商品成功')
                this.setState({
                    onlineGoods: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    // 商品放入回收站
    goodsfirm = (re) => {
        axios({
            url: '/statistics/delOnlineProducts',
            method: 'GET',
            params: {
                id: re.id
            }
        })
            .then(res => {
                message.success('删除成功，已放入回收站！')
                this.getOnlineItem()
            })
            .catch(err => {
                message.error('删除失败')
            })
    }
    // 商品从回收站 ===> 未上架
    delToNoShow = (re) => {
        axios({
            url: '/statistics/recoveryOnlineProducts',
            method: 'GET',
            params: {
                id: re.id
            }
        })
            .then(res => {
                console.log('===========', res)
                message.success('恢复成功')
                this.getRecycle()
            })
            .catch(err => {
                message.error('恢复失败')
            })
    }
    // 回收站彻底删除
    realDelOnline = (re) => {
        axios({
            url: '/statistics/removeOnlineProducts',
            method: 'GET',
            params: {
                id: re.id
            }
        })
            .then(res => {
                console.log('=============', res)
                this.getRecycle()
            })
            .catch(err => {
                console.log(err)
            })
    }
    handleVisibleChange = visible => {
        this.setState({ visible })
    }
    stageImgCancel = () => this.setState({ previewVisible: false })
    goodsImgCancel = () => this.setState({ goodsimgVisible: false })

    // 分期明细
    stageDetailInfo = () => {
        const { stagePrice, stageNumVal, stageAmount } = this.state
        let eachStagePrice
        if (stageAmount !== '' && stageNumVal !== '' && stagePrice !== '') {
            eachStagePrice = (stagePrice - stageAmount) / stageNumVal
            this.setState({
                eachStagePrice: Math.round(eachStagePrice * 100) / 100,
                isStageDetailInfo: true
            })
        } else {
            this.setState({ isStageDetailInfo: false })
        }
    }

    // 打开设置拼团模态框
    spellGroup = data => {
        console.log(data)
        this.setState({
            spellName: data.name,
            spellImage: data.image,
            spellStock: data.stock,
            spellSales: data.ficti,
            spellPrice: data.price,
            spellProductId: data.id,
            isSpellGroup: true
        })
    }
    // 新增拼团
    addSpellGroup = () => {
        const { spellName, spellTime, spellImage, spellPrice,
            spellPeople, spellSales, spellStock, spellPostage,
            startDate, startTime, endTime, endDate, spellDescription,
            spellIsShow, spellProductId } = this.state
        let merId = JSON.parse(localStorage.getItem('user')).id
        axios({
            method: 'PUT',
            url: '/api/yxStoreCombination',
            data: {
                title: spellName,
                effectiveTime: spellTime,
                startTimeDate: startDate + ' ' + startTime,
                endTimeDate: endDate + ' ' + endTime,
                image: spellImage,
                price: spellPrice,
                people: spellPeople,
                sales: spellSales,
                stock: spellStock,
                postage: spellPostage,
                isShow: spellIsShow,
                description: spellDescription,
                productId: spellProductId,
                merId: merId,
                isDel: 0,
                combination: 1,
                isHost: 0
            }
        })
            .then(res => {
                console.log('新增拼团成功', res)
                this.getOnlineItem()
                this.setState({ isSpellGroup: false })
                message.success('新增拼团商品成功')
            })
            .catch(err => {
                console.log('新增拼团失败', err)
            })
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

    // 正则判断线上商品员工提成
    setCommission = e => {
        this.setState({ commission: e.target.value }, () => {
            if (this.state.commission) {
                if (!(/^[0-9][0-9]{0,1}$/.test(this.state.commission))) {
                    message.warning('请输入1-99的整数')
                    this.setState({ commission: '' })
                }
            }
        })
    }
    // 正则判断分期商品员工提成
    setRoyaltyRate = e => {
        this.setState({ royaltyRate: e.target.value }, () => {
            if (this.state.royaltyRate) {
                if (!(/^[0-9][0-9]{0,1}$/.test(this.state.royaltyRate))) {
                    message.warning('请输入1-99的整数')
                    this.setState({ royaltyRate: '' })
                }
            }
            console.log(this.state.royaltyRate)
        })
    }

    // 拼团商品服务时间
    service = value => {
        console.log(value)
    }
    render() {
        const { goodsIndex, goodsTable, name, stageVisible, stageName,
            stagePrice, stageSales, stageNumVal, stageAmount, stageRemarks,
            stageData, promptModal, promptInfo, stageVisiInfo, goodsModal,
            goodsMoInfo, goodsName, goodsRemarks, goodsPrice, goodsPostage,
            goodsSales, goodsSku, previewVisible, previewImage, fileList,
            previewTitle, loading, goodsimgVisible, goodsImage, goodsFileList,
            onlineGoods, goodsProModal, goodsProInfo, treeData, emptyText,
            isStageDetailInfo, eachStagePrice, value, isSpellGroup,
            spellName, spellTime, spellImage, spellPrice,
            spellPeople, spellSales, spellStock, spellPostage,
            spellIsShow, spellDescription, integral, commission, royaltyRate,
            serviceEndTime, serviceStartTime } = this.state
        const columns = [
            {
                title: '项目编号',
                dataIndex: 'id',
                key: 'id',
                render: text => <a>{text}</a>,
            },
            {
                title: '项目图片',
                dataIndex: 'photo',
                key: 'photo',
                render: src => {
                    let arr = src.split(',')
                    return (
                        <Image className='tableGoodsImg' src={arr[0]}></Image>
                    )
                }
            },
            {
                title: '项目名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '分类名称',
                dataIndex: 'cateName',
                key: 'cateName',
            },
            {
                title: '项目价格',
                dataIndex: 'price',
                key: 'price',
                render: text => <>￥{text}</>,
            },
            {
                title: '总期数',
                key: 'stagesNumber',
                dataIndex: 'stagesNumber',
                render: text => <span>{text}期</span>,
            },
            {
                title: '销量',
                key: 'sales',
                dataIndex: 'sales',
                render: tags => (
                    <>{tags}</>
                ),
            },
            {
                title: '项目状态',
                key: 'state',
                dataIndex: 'state',
                render: (text, record) => {
                    if (goodsTable === 1) {
                        return <Popover content={
                            <Tag color='red'
                                onClick={() => this.setState({
                                    promptModal: true,
                                    sureChange: record.id,
                                    promptInfo: '下架'
                                })} >下架</Tag>
                        }>
                            <Tag color='#2596FF'>出售中</Tag>
                        </Popover>
                    } else if (goodsTable === 2) {
                        return <Popover content={
                            <Tag color='red'
                                onClick={() => this.setState({
                                    promptModal: true,
                                    sureChange: record.id,
                                    promptInfo: '上架'
                                })} >上架</Tag>
                        }>
                            <Tag color='#2596FF'>待上架</Tag>
                        </Popover>
                    } else {
                        return <Tag color='#1890FF' >已删除</Tag>
                    }
                }
                ,
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => {
                    if (goodsTable !== 3) {
                        return <Space size="middle">
                            <a style={{ color: '#13CE66' }} onClick={() => {
                                this.editStage('edit', record)
                            }}>修改</a>
                            <Popconfirm
                                title="请您确认是否删除?"
                                onConfirm={() => this.confirm(record)}
                                onCancel={this.cancel}
                                okText="是"
                                cancelText="否"
                            >
                                <a style={{ color: '#FF5A5A' }}>删除</a>
                            </Popconfirm>
                        </Space>
                    } else {
                        return <Space size="middle">
                            <Popconfirm
                                title="请您确认是否恢复?"
                                onConfirm={() => this.restore(record)}
                                onCancel={this.cancel}
                                okText="是"
                                cancelText="否"
                            >
                                <a style={{ color: '#13CE66' }}>恢复</a>
                            </Popconfirm>
                            <Popconfirm
                                title="请您确认是否彻底删除?"
                                onConfirm={() => this.realDel(record)}
                                onCancel={this.cancel}
                                okText="是"
                                cancelText="否"
                            >
                                <a style={{ color: '#FF5A5A' }}>彻底删除</a>
                            </Popconfirm>
                        </Space>
                    }
                },
            },
        ]
        const colOnline = [
            {
                title: '商品编号',
                dataIndex: 'id',
                key: 'id',
                render: text => <a>{text}</a>,
            },
            {
                title: '商品图片',
                dataIndex: 'image',
                key: 'image',
                render: src => {
                    let arr = src.split(',')
                    return (
                        <Image className='tableGoodsImg' src={arr[0]}></Image>
                    )
                }
            },
            {
                title: '商品名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '分类名称',
                dataIndex: 'cateName',
                key: 'cateName',
            },
            {
                title: '商品价格',
                dataIndex: 'price',
                key: 'price',
                render: text => (
                    <span>￥{text.toFixed(2)}</span>
                ),
            },
            {
                title: '销量',
                key: 'ficti',
                dataIndex: 'ficti',
            },
            {
                title: '库存',
                key: 'stock',
                dataIndex: 'stock',
                render: tags => (
                    <span>{tags}</span>
                ),
            },
            {
                title: '系统状态',
                key: 'isShow',
                dataIndex: 'isShow',
                render: (text, record) => {
                    if (goodsTable === 1) {
                        return <Popover content={
                            <Tag color='red'
                                onClick={() => this.setState({
                                    goodsProModal: true,
                                    goodsProId: record.id,
                                    goodsProInfo: '下架'
                                })} >下架</Tag>
                        }>
                            <Tag color='#2596FF'>已上架</Tag>
                        </Popover>
                    } else if (goodsTable === 2) {
                        return <Popover content={
                            <Tag color='red'
                                onClick={() => this.setState({
                                    goodsProModal: true,
                                    goodsProId: record.id,
                                    goodsProInfo: '上架'
                                })} >上架</Tag>
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
                    if (goodsTable !== 3) {
                        return (<Space size="middle">
                            <a style={{ color: '#13CE66' }} onClick={() => this.editOnline('edit', record)} >修改</a>
                            <Popconfirm
                                title="请您确认是否删除?"
                                onConfirm={() => this.goodsfirm(record)}
                                onCancel={this.cancel}
                                okText="是"
                                cancelText="否"
                            >
                                <a style={{ color: '#FF5A5A' }}>删除</a>
                            </Popconfirm>
                            <Button type="default" onClick={() => this.spellGroup(record)}>开启拼团</Button>
                        </Space>)
                    } else {
                        return (<Space size="middle">
                            <Popconfirm
                                title="请您确认是否恢复?"
                                onConfirm={() => this.delToNoShow(record)}
                                onCancel={this.cancel}
                                okText="是"
                                cancelText="否"
                            >
                                <a style={{ color: '#13CE66' }}>恢复</a>
                            </Popconfirm>
                            <Popconfirm
                                title="请您确认是否彻底删除?"
                                onConfirm={() => this.realDelOnline(record)}
                                onCancel={this.cancel}
                                okText="是"
                                cancelText="否"
                            >
                                <a style={{ color: '#FF5A5A' }}>彻底删除</a>
                            </Popconfirm>
                        </Space>)
                    }
                }

            },
        ]
        let _that = this
        const uploadButton = (
            <div>
                <div style={{ marginTop: 8 }}>上传图片</div>
            </div>
        )
        const props = {
            name: 'file',
            action: 'http://47.108.174.202:9010/upload/files-upload',
            listType: 'picture-card',
            headers: {
                authorization: 'authorization-text',
                Content_Type: 'multipart/form-data'
            },
            fileList: fileList,
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log('上传的文件', info.fileList)
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 上传成功`)
                    _that.setState({
                        fileList: info.fileList,
                    })
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败.`)
                }
            },
            onPreview(file) {
                console.log('预览', file)
                let url
                if (file.response) {
                    url = 'https://www.bkysc.cn/api/files-upload/' + file.response.data
                } else {
                    url = file.url
                }
                _that.setState({
                    previewImage: url,
                    previewVisible: true,
                    previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
                })
            },
            onRemove(file) {
                let newList = fileList.filter(item => item.uid !== file.uid)
                _that.setState({
                    fileList: newList
                })
            }
        }
        const goodsProps = {
            name: 'file',
            action: 'http://47.108.174.202:9010/upload/files-upload',
            listType: 'picture-card',
            headers: {
                authorization: 'authorization-text',
                Content_Type: 'multipart/form-data'
            },
            fileList: goodsFileList,
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log('上传的文件', info.fileList)
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 上传成功`)
                    _that.setState({
                        goodsFileList: info.fileList,
                    })
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败.`)
                }
            },
            onPreview(file) {
                console.log('预览', file)
                let url
                if (file.response) {
                    url = 'https://www.bkysc.cn/api/files-upload/' + file.response.data
                } else {
                    url = file.url
                }
                _that.setState({
                    goodsImage: url,
                    goodsimgVisible: true,
                    previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
                })
            },
            onRemove(file) {
                let newList = goodsFileList.filter(item => item.uid !== file.uid)
                _that.setState({
                    goodsFileList: newList
                })
            }
        }
        const uploadButtonA = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
            </div>
        )
        return (
            <div className='goods'>
                <div className='goodsHeaderTop'>
                    <span>商品管理</span>
                </div>
                <div className='goodsHeaderBody'>
                    <div className={goodsIndex === 1 ? 'goodsActive' : 'ghBodyBtn'}
                        onClick={() => this.checkIndex(1)}>门店分期项目</div>
                    <div className={goodsIndex === 2 ? 'goodsActive' : 'ghBodyBtn'}
                        onClick={() => this.checkIndex(2)}>线上商品</div>
                </div>
                <div className='goodsBody'>
                    <div className='goodsBodyTab'>
                        <div className={goodsTable === 1 ? 'gtActive' : 'gbTabBtn'}
                            onClick={() => this.chooseType(1)}>出售中</div>
                        <div className={goodsTable === 2 ? 'gtActive' : 'gbTabBtn'}
                            onClick={() => this.chooseType(2)}>待上架</div>
                        <div className={goodsTable === 3 ? 'gtActive' : 'gbTabBtn'}
                            onClick={() => this.chooseType(3)}>回收站</div>
                    </div>
                    <div className='gbTableTop'>
                        <Input style={{ width: 150, margin: '0 20px' }}
                            placeholder='请输入项目名搜索'
                            value={name}
                            onChange={e => this.setName(e)} />

                        {goodsIndex === 1
                            ? <div onClick={() => this.setState({ loading: true }, () => { this.getStageItem() })} className='search-btn'>
                                <SearchOutlined />搜索
                            </div>
                            : <div onClick={() => this.setState({ loading: true }, () => { this.getOnlineItem() })} className='search-btn'>
                                <SearchOutlined />搜索
                            </div>}
                        {goodsIndex === 1
                            ? <div className='add-btn' onClick={() => this.editStage('add', 0)} style={{ width: 120 }}>
                                <PlusOutlined />新增分期项目
                            </div>
                            : <div className='add-btn' onClick={() => this.editOnline('add', 0)}>
                                <PlusOutlined />新增线上商品
                            </div>}

                        <Select
                            style={{ width: 150 }}
                            defaultValue="全部"
                            onChange={e => this.setState({ cateName: e }, () => this.getStageItem())}
                        >
                            <Option value="">全部</Option>
                            {
                                treeData.map(item => (
                                    <Option value={item.title} key={item.id}>{item.title}</Option>
                                ))
                            }
                        </Select>

                    </div>
                    <div style={{ width: '100%', paddingBottom: 10 }}>
                        {goodsIndex === 1 ?
                            <Table columns={columns}
                                dataSource={stageData}
                                style={{ textAlign: 'center', paddingBottom: '10px' }}
                                pagination={{ pageSize: 4, position: ['bottomLeft'] }}
                                loading={loading}
                                locale={{ emptyText: emptyText }} /> :
                            <Table columns={colOnline}
                                dataSource={onlineGoods}
                                style={{ textAlign: 'center' }}
                                pagination={{ pageSize: 4, position: ['bottomLeft'] }}
                                loading={loading}
                                locale={{ emptyText: emptyText }} />}
                    </div>
                    {/* 新增、编辑线上商品 */}
                    <Modal
                        visible={goodsModal}
                        title={goodsMoInfo === 'add' ? "新增商品" : '修改商品'}
                        onOk={() => this.setState({ goodsModal: false })}
                        onCancel={() => this.setState({ goodsModal: false })}
                        footer={goodsMoInfo === 'add'
                            ? [<Button key="submit" type="primary" onClick={() => this.goodsOkShelves(1)}>
                                确定并上架
                        </Button>,
                            <Button onClick={() => this.goodsOkShelves(0)}>
                                保存至待上架
                        </Button>]
                            : [<Button key="submit" type="primary" onClick={() => this.onlineSure(goodsTable)}>
                                确定修改
                        </Button>,
                            <Button key="back" type="primary" onClick={() => this.setState({ goodsModal: false })}>
                                取消
                        </Button>]}
                        destroyOnClose={true}
                        bodyStyle={{ fontSize: '12px', padding: '10px', color: '#666666' }}
                        width={800}
                    >
                        <div className='goodsModalItem'>
                            <span className='gmiLabel'>商品分类</span>
                            <Select
                                style={{ width: 150 }}
                                defaultValue={value}
                                onChange={e => this.setState({ value: e })}
                            >
                                {
                                    treeData.map((item) => (
                                        <Option value={item.value}>{item.title}</Option>
                                    ))
                                }
                            </Select>
                        </div>
                        <div className='goodsModalItem'>
                            <span className='gmiLabel'>商品名称</span>
                            <Input placeholder='请输入项目名称' style={{ width: 250 }}
                                value={goodsName}
                                onChange={e => this.setState({ goodsName: e.target.value })} />
                        </div>

                        <div className='goodsModalImg'>
                            <span className='gmiLabel'>商品图片</span>
                            <Upload {...goodsProps} className='avatar-uploader'>
                                {fileList.length >= 3 ? null : uploadButton}
                            </Upload>
                            <Modal
                                visible={goodsimgVisible}
                                title={previewTitle}
                                footer={null}
                                onCancel={this.goodsImgCancel}
                            >
                                <Image alt="example" style={{ width: '100%' }} src={goodsImage} />
                            </Modal>
                        </div>

                        <div className='goodsModalItem'>
                            <div className='littleitem'>
                                <span className='littleLabel'>商品价格</span>
                                <Input placeholder='请输入价格'
                                    value={goodsPrice}
                                    onChange={e => this.setState({ goodsPrice: e.target.value })} />
                            </div>

                            <div className='littleitem'>
                                <span className='littleLabel'>邮费</span>
                                <Input placeholder='不填或输入0即为包邮'
                                    value={goodsPostage}
                                    onChange={e => this.setState({ goodsPostage: e.target.value })} />
                            </div>
                        </div>
                        <div className='goodsModalItem'>
                            <div className='littleitem'>
                                <span className='littleLabel'>销量</span>
                                <Input placeholder='请输入销量'
                                    value={goodsSales}
                                    onChange={e => this.setState({ goodsSales: e.target.value })} />
                            </div>
                            <div className='littleitem'>
                                <span className='littleLabel'>库存</span>
                                <Input placeholder='请输入库存'
                                    value={goodsSku}
                                    onChange={e => this.setState({ goodsSku: e.target.value })} />
                            </div>
                        </div>

                        <div style={{ margin: '10px 39px' }}>
                            <span className='integralSpan'>积分抵扣</span>
                            <div className="integral">
                                <Radio.Group value={integral} onChange={e => this.setState({ integral: e.target.value })}>
                                    <Radio value={1}>开启</Radio>
                                    <Radio value={0}>关闭</Radio>
                                </Radio.Group>
                            </div>
                            <span className='integralSpan'>员工提成</span>
                            <div className="integral">
                                <Input
                                    className="commission"
                                    placeholder="请输入整数"
                                    value={commission}
                                    onChange={e => this.setCommission(e)}
                                />
                                <span style={{ fontSize: 18 }}>%</span>
                            </div>
                        </div>

                        <div className='itemDirecte'>
                            <span className='gmiLabel'>产品详情</span>
                            <TextArea rows={6} style={{ width: '70%' }}
                                value={goodsRemarks}
                                onChange={e => this.setState({ goodsRemarks: e.target.value })} />
                        </div>
                    </Modal>
                    {/* 分期项目上下架 */}
                    <Modal
                        visible={promptModal}
                        title="上架 / 下架"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        okText='确定'
                        cancelText='取消'
                        destroyOnClose={true}
                        bodyStyle={{ padding: '10px', color: '#666666' }}
                        afterClose={() => this.setState({ sureChange: '' })}
                    >
                        <div style={{ width: '90%', margin: '0 auto', height: 50, textAlign: 'center', lineHeight: '50px' }}>
                            {promptInfo === '下架'
                                ? <span style={{ fontSize: 16 }}>您确定要将该分期项目放入待上架？</span>
                                : <span style={{ fontSize: 16 }}>您确定要将该分期项目开始出售？</span>
                            }
                        </div>
                    </Modal>
                    {/* 线上商品上下架 */}
                    <Modal
                        visible={goodsProModal}
                        title="上架 / 下架"
                        onOk={this.handleGoodsOk}
                        onCancel={this.handleCancel}
                        okText='确定'
                        cancelText='取消'
                        destroyOnClose={true}
                        bodyStyle={{ padding: '10px', color: '#666666' }}
                        afterClose={() => this.setState({ goodsProId: '' })}
                    >
                        <div style={{ width: '90%', margin: '0 auto', height: 50, textAlign: 'center', lineHeight: '50px' }}>
                            {goodsProInfo === '下架'
                                ? <span style={{ fontSize: 16 }}>您确定要将该商品下架？</span>
                                : <span style={{ fontSize: 16 }}>您确定要将该商品上架？</span>
                            }
                        </div>
                    </Modal>
                    {/* 新增、编辑分期项目 */}
                    <Modal
                        visible={stageVisible}
                        title={stageVisiInfo === 'add' ? "新增分期项目" : '修改分期项目'}
                        onOk={() => this.setState({ stageVisible: false })}
                        onCancel={() => this.setState({ stageVisible: false, isStageDetailInfo: false })}
                        footer={[
                            stageVisiInfo === 'add' ?
                                <Button key="submit" type="primary" onClick={() => this.okShelves()}>
                                    确定并上架
                            </Button> :
                                <Button key="submit" type="primary" onClick={() => this.sureChange()}>
                                    确定修改
                            </Button>
                        ]}
                        destroyOnClose={true}
                        bodyStyle={{ fontSize: '12px', padding: '10px', color: '#666666' }}
                        width={800}
                    >
                        <div className='goodsModalItem'>
                            <span className='gmiLabel'>项目分类</span>
                            <Select
                                style={{ width: 150 }}
                                defaultValue={value}
                                onChange={e => this.setState({ value: e })}
                            >
                                {
                                    treeData.map((item) => (
                                        <Option value={item.value}>{item.title}</Option>
                                    ))
                                }
                            </Select>
                        </div>
                        <div className='goodsModalItem'>
                            <span className='gmiLabel'>项目名称</span>
                            <Input placeholder='请输入项目名称' style={{ width: 150 }}
                                value={stageName}
                                onChange={e => this.setState({ stageName: e.target.value })}></Input>
                        </div>
                        <div className='goodsModalImg'>
                            <span className='gmiLabel'>项目图片</span>
                            <Upload {...props} className='avatar-uploader'>
                                {fileList.length >= 3 ? null : uploadButton}
                            </Upload>
                            <Modal
                                visible={previewVisible}
                                title={previewTitle}
                                footer={null}
                                onCancel={this.stageImgCancel}
                            >
                                <Image alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                        </div>

                        <div className='goodsModalItem'>
                            <div className='littleitem'>
                                <span className='littleLabel'>项目价格</span>
                                <Input placeholder=''
                                    value={stagePrice}
                                    onChange={e => this.setState({ stagePrice: e.target.value }, () => this.stageDetailInfo())}></Input>
                            </div>
                            <div className='littleitem'>
                                <span className='littleLabel'>虚拟销量</span>
                                <Input placeholder=''
                                    value={stageSales}
                                    onChange={e => this.setState({ stageSales: e.target.value })}></Input>
                            </div>
                        </div>
                        <div className='goodsModalItem'>
                            <div className='littleitem'>
                                <span className='littleLabel'>总期数</span>
                                <Input placeholder='请输入总期数'
                                    value={stageNumVal}
                                    onChange={e => this.setState({ stageNumVal: e.target.value }, () => this.stageDetailInfo())}></Input>
                            </div>
                            <div className='littleitem'>
                                <span className='littleLabel'>预付金额</span>
                                <Input placeholder=''
                                    value={stageAmount}
                                    onChange={e => this.setState({ stageAmount: e.target.value }, () => this.stageDetailInfo())}></Input>
                            </div>
                        </div>

                        {
                            isStageDetailInfo
                                ? <div className='goodsModalItem' style={{ marginLeft: '20%', fontSize: 16, }}>
                                    项目价格 <span style={{ color: 'red', fontSize: 18 }}>{stagePrice}</span>,
                                    总期数 <span style={{ color: 'red', fontSize: 18 }}>{stageNumVal}</span>,
                                    每一期价格 <span style={{ color: 'red', fontSize: 18 }}>{eachStagePrice}</span>,
                                    首次付款 <span style={{ color: 'red', fontSize: 18 }}>{stageAmount + '+' + eachStagePrice}</span>,
                                </div>
                                : null
                        }

                        <div style={{ margin: '10px 39px' }}>
                            <span className='integralSpan'>员工提成</span>
                            <div className="integral">
                                <Input
                                    className="commission"
                                    placeholder="请输入整数"
                                    value={royaltyRate}
                                    onChange={e => this.setRoyaltyRate(e)}
                                />
                                <span style={{ fontSize: 18 }}>%</span>
                            </div>
                        </div>

                        <div style={{ width: '90%', margin: '0 auto' }} className='itemDirecte'>
                            <span className='gmiLabel'>产品详情</span>
                            <TextArea rows={6} style={{ width: '70%' }}
                                value={stageRemarks}
                                onChange={e => this.setState({ stageRemarks: e.target.value })} />
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
                                <span className="spellSpan">拼团名称</span>
                                <Input
                                    className="spellInput"
                                    value={spellName}
                                    allowClear={false}
                                    onChange={e => this.setState({ spellName: e.target.value })}
                                />
                            </div>

                            <div className="spellItem">
                                <span className="spellSpan">拼团时效</span>
                                <Input
                                    className="spellInput"
                                    value={spellTime}
                                    allowClear={false}
                                    onChange={e => this.setState({ spellTime: e.target.value })}
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

                            {/* <div className="spellItem">
                                <span className="spellSpan">服务时间段</span>
                                <RangePicker
                                    locale={locale}
                                    // showTime={{ format: 'HH'}}
                                    format="YYYY-MM-DD"
                                    onChange={this.service}
                                    value={moment[serviceStartTime,serviceEndTime]}
                                />
                            </div> */}

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
                                    <span className="smallSpan">拼团价</span>
                                    <Input
                                        className="smallInput"
                                        value={spellPrice}
                                        onChange={e => this.setState({ spellPrice: e.target.value })}
                                    />
                                </div>
                                <div className="timeItem">
                                    <span className="smallSpan">拼团人数</span>
                                    <Input
                                        className="smallInput"
                                        value={spellPeople}
                                        onChange={e => this.setState({ spellPeople: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="spellItem">
                                <div className="timeItem">
                                    <span className="smallSpan">库存</span>
                                    <Input
                                        className="smallInput"
                                        value={spellStock}
                                        onChange={e => this.setState({ spellStock: e.target.value })}
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
                                    <span className="smallSpan">邮费</span>
                                    <Input
                                        className="smallInput"
                                        value={spellPostage}
                                        onChange={e => this.setState({ spellPostage: e.target.value })}
                                    />
                                </div>

                                <div className="timeItem">
                                    <span className="smallSpan">活动状态</span>
                                    <div className="spellIsShow">
                                        <Radio.Group value={spellIsShow} onChange={e => this.setState({ spellIsShow: e.target.value })}>
                                            <Radio value={1}>开启</Radio>
                                            <Radio value={0}>关闭</Radio>
                                        </Radio.Group>
                                    </div>
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
                </div>
            </div>
        )
    }
}

export default Goods