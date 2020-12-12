// 分期项目
import React, { Component } from 'react'
import '../goods/Goods.css'
import {
    Table, Input, Select, message, Image, Modal,
    Radio, Upload, Popover, Tag, Space, Popconfirm,
    InputNumber, Switch
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import axios from '../../http'

const { Option } = Select
const { TextArea } = Input

export default class Installment extends Component {
    state = {
        // 分类
        goodsTable: 1,
        // 表格加载
        loading: false,
        // 分期项目列表
        installmentList: [],
        // 表格暂无数据
        emptyText: '暂无数据',
        // 商品分类列表
        classList: [],
        // 商品分类
        classify: '',
        // 搜索框内容
        searchVal: '',
        // 分期模态框开关
        installmentVisble: false,
        // 分期模态框标题
        installmentTitle: '',
        // 分期模态框类型
        installmentType: '',
        // 卡项类型
        cardType: 0,
        // 分期卡项类型
        astrict: '',
        // 分期项目商品分类
        installmentClass: '',
        // 分期项目名称
        installmentName: '',
        // 分期项目图片
        installmentImage: null,
        // 分期项目价格
        installmentPrice: '',
        // 分期项目虚拟销量
        installmentSales: '',
        // 分期总期数
        installmentTotal: '',
        // 分期预付金额
        installmentAmount: '',
        // 分期项目员工提成
        installmentRoyaltyRate: '',
        // 分期项目详情
        installmentRemarks: '',
        // 每一期价格
        eachInstallmentPrice: '',
        isStageDetailInfo: false,
        // 初始商品分类
        initClass: '',
        // 分期项目id
        installmentId: '',
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
        enableSub: 1,
    }
    componentDidMount() {
        this.getGoodsClass()
        this.getInstallmentList()
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
    // 分期项目列表
    getInstallmentList = () => {
        this.setState({ loading: true })
        const id = JSON.parse(localStorage.getItem('user')).id
        const { searchVal, classify, goodsTable } = this.state
        axios({
            url: '/statistics/phasedProject',
            method: 'GET',
            params: {
                cateName: classify,
                enterId: id,
                name: searchVal,
                type: goodsTable,
                limit: 10,
                offset: 1,
                order: '',
            }
        })
            .then(res => {
                console.log('获取分期项目列表成功', res)
                if (res.data.status === 200) {
                    this.setState({
                        installmentList: res.data.data.list,
                        loading: false
                    })
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('获取分期项目失败', err)
                message.error('服务器出错')
            })
    }
    // 搜索
    search = () => {
        const { searchVal } = this.state
        if (searchVal === '') {
            message.warning('请先输入搜索内容!')
        } else {
            this.getInstallmentList()
        }
    }
    // 打开新增分期项目模态框
    addInstallment = () => {
        let initClass = this.state.initClass
        this.setState({
            cardType: 0,
            astrict: '',
            installmentClass: initClass,
            installmentName: '',
            installmentImage: null,
            installmentPrice: '',
            installmentSales: '',
            installmentTotal: '',
            installmentAmount: '',
            installmentRoyaltyRate: '',
            installmentRemarks: '',
            eachInstallmentPrice: '',
            servicePlepeo: 1,
            serviceTime: '半小时',
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
            isStageDetailInfo: false,
            installmentType: 'add',
            installmentTitle: '新增分期项目',
            installmentVisble: true
        })
    }
    // 上传分期项目图片
    uploadInstallmentImage = info => {
        const res = info.fileList[0].response
        if (res) {
            this.setState({
                installmentImage: 'https://www.bkysc.cn/api/files-upload/' + res.data
            })
        }
    }
    // 计算分期明细
    setEachInstallmentPrice = () => {
        const { installmentPrice, installmentAmount, installmentTotal } = this.state
        let eachPrice
        if (installmentPrice !== '' && installmentTotal !== '' && installmentAmount !== '') {
            eachPrice = (installmentPrice - installmentAmount) / installmentTotal
            this.setState({
                eachInstallmentPrice: Math.round(eachPrice * 100) / 100,
                isStageDetailInfo: true
            })
        } else {
            this.setState({
                isStageDetailInfo: false
            })
        }
    }
    // 新增、修改分期项目
    installmentAction = type => {
        let user = JSON.parse(localStorage.getItem('user'))
        const {
            cardType, astrict, installmentName, installmentClass, installmentImage,
            installmentPrice, installmentSales, installmentTotal, installmentAmount,
            installmentRoyaltyRate, installmentRemarks, installmentId, checkTimeArr,
            serviceTime, servicePlepeo, enableSub
        } = this.state
        if (astrict === '' || installmentName === '' || installmentImage === null ||
            installmentPrice === '' || installmentSales === '' || installmentTotal === '' ||
            installmentAmount === '' || installmentRoyaltyRate === '' || 
            installmentRemarks === '' || checkTimeArr.length === 0) {
            message.warning('请检查是否有未填写的内容！')
        } else {
            let appointJSON = {}
            checkTimeArr.map(item => {
                appointJSON[item] = servicePlepeo
            })
            if (type === 'add') {
                axios({
                    method: 'POST',
                    url: '/statistics/addPhasedProject',
                    data: {
                        classify: cardType,
                        astrict: astrict,
                        enterId: user.id,
                        name: installmentName,
                        photo: installmentImage,
                        cateId: installmentClass,
                        prepaymentAmount: installmentAmount,
                        price: installmentPrice,
                        sales: installmentSales,
                        stagesNumber: installmentTotal,
                        royaltyRate: installmentRoyaltyRate,
                        storeId: user.systemStoreId,
                        remarks: installmentRemarks,
                        appointmentMap: appointJSON,
                        timeQuantum: serviceTime,
                        // enableSub: enableSub,
                    }
                })
                    .then(res => {
                        console.log('新增分期项目成功', res)
                        if (res.data.status === 200) {
                            this.getInstallmentList()
                            this.setState({
                                installmentVisble: false
                            })
                        } else {
                            message.error(res.data.message)
                        }
                    })
                    .catch(err => {
                        console.log('新增分期项目失败', err)
                        message.error('服务器出错')
                    })
            } else if (type === 'edit') {
                axios({
                    url: '/statistics/updatePhasedProject',
                    method: 'POST',
                    data: {
                        classify: cardType,
                        astrict: astrict,
                        enterId: user.id,
                        name: installmentName,
                        photo: installmentImage,
                        cateId: installmentClass,
                        prepaymentAmount: installmentAmount,
                        price: installmentPrice,
                        sales: installmentSales,
                        stagesNumber: installmentTotal,
                        royaltyRate: installmentRoyaltyRate,
                        storeId: user.systemStoreId,
                        remarks: installmentRemarks,
                        id: installmentId,
                        appointmentMap: appointJSON,
                        timeQuantum: serviceTime,
                        // enableSub: enableSub,
                    }
                })
                    .then(res => {
                        console.log('修改分期项目成功', res)
                        if (res.data.status === 200) {
                            this.getInstallmentList()
                            this.setState({ installmentVisble: false })
                        } else {
                            message.error(res.data.message)
                        }
                    })
                    .catch(err => {
                        console.log('修改分期项目失败', err)
                        message.error('服务器出错')
                    })
            }
        }
    }
    // 分期项目上下架
    changeFrame = id => {
        axios({
            method: 'GET',
            url: '/statistics/dismountPhasedProject',
            params: {
                id: id
            }
        })
            .then(res => {
                console.log('上下架成功', res)
                if (res.data.status === 200) {
                    this.getInstallmentList()
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('上下架失败', err)
                message.error('服务器出错')
            })
    }
    // 删除分期项目
    delInstallment = id => {
        axios({
            url: '/statistics/deletePhasedProject',
            method: 'GET',
            params: {
                id: id
            }
        })
            .then(res => {
                console.log('删除分期项目成功', res)
                if (res.data.status === 200) {
                    this.getInstallmentList()
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('删除分期项目失败', err)
                message.error('服务器出错')
            })
    }
    // 回收站恢复分期项目
    restoreInstallment = id => {
        axios({
            method: 'GET',
            url: '/statistics/recoveryPhasedProject',
            params: {
                id: id
            }
        })
            .then(res => {
                console.log('回收站恢复分期项目成功', res)
                if (res.data.status === 200) {
                    this.getInstallmentList()
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('回收站恢复分期项目失败', err)
                message.error('服务器出错')
            })
    }
    // 回收站彻底删除分期项目
    realDelInstallment = id => {
        axios({
            method: 'GET',
            url: '/statistics/recycleBinDeletePhasedProject',
            params: {
                id: id
            }
        })
            .then(res => {
                console.log('回收站彻底删除成功', res)
                if (res.data.status === 200) {
                    this.getInstallmentList()
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('回收站彻底删除失败', err)
                message.error('服务器出错')
            })
    }
    // 打开编辑分期项目模态框
    editInstallment = record => {
        let appointmenTime = []
        for (let key in JSON.parse(record.appointment)) {
            appointmenTime.push(key)
        }
        let limitPerson = JSON.parse(record.appointment)[appointmenTime[0]]
        this.setState({
            cardType: record.classify,
            astrict: record.astrict,
            installmentName: record.name,
            installmentClass: record.cateId,
            installmentImage: record.photo,
            installmentSales: record.sales,
            installmentPrice: record.price,
            installmentTotal: record.stagesNumber,
            installmentAmount: record.prepaymentAmount,
            installmentRoyaltyRate: record.royaltyRate,
            installmentRemarks: record.remarks,
            installmentId: record.id,
            servicePlepeo: limitPerson,
            serviceTime: record.timeQuantum,
            checkTimeArr: appointmenTime,
            installmentType: 'edit',
            installmentTitle: '修改分期项目',
            installmentVisble: true
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
                payType: 0
            }
        })
            .then(res => {
                console.log('开启或关闭预约成功', res)
                if (res.data.status === 200) {
                    message.success(res.data.message)
                    this.getInstallmentList()
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('开启或关闭预约失败', err)
                message.error('服务器出错')
            })
    }
    render() {
        const { goodsTable, loading, installmentList, emptyText, classify, classList,
            searchVal, installmentVisble, installmentTitle, installmentType, cardType,
            astrict, installmentClass, installmentName, installmentImage,
            installmentPrice, installmentSales, installmentTotal, installmentAmount,
            installmentRoyaltyRate, installmentRemarks, eachInstallmentPrice,
            isStageDetailInfo, serviceTime, servicePlepeo, checkTimeArr, timeArr } = this.state

        const installmentColumns = [
            {
                title: '分期项目编号',
                dataIndex: 'id',
                key: 'id',
                align: 'center',
                width: 140
            },
            {
                title: '分期项目图片',
                dataIndex: 'photo',
                key: 'photo',
                align: 'center',
                width: 140,
                render: text => <img src={text} className="goods-table-image tableGoodsImg" />
            },
            {
                title: '分期项目名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center',
                width: 140
            },
            {
                title: '分期项目分类',
                dataIndex: 'cateName',
                key: 'cateName',
                align: 'center',
                width: 140
            },
            {
                title: '分期项目价格',
                dataIndex: 'price',
                key: 'price',
                align: 'center',
                width: 140
            },
            {
                title: '分期项目总期数',
                dataIndex: 'stagesNumber',
                key: 'stagesNumber',
                align: 'center',
                width: 140
            },
            {
                title: '本项目销量',
                dataIndex: 'sales',
                key: 'sales',
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
                title: '分期项目状态',
                dataIndex: 'state',
                key: 'state',
                align: 'center',
                width: 140,
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
                    } else if (goodsTable === 2) {
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
                }
            },
            {
                title: '操作',
                dataIndex: '',
                key: '',
                align: 'center',
                width: 150,
                render: (text, record) => {
                    if (goodsTable === 1) {
                        return (<Space size="middle">
                            <a style={{ color: '#13CE66' }} onClick={() => this.editInstallment(record)} >修改</a>
                            <Popconfirm
                                title="请您确认是否删除?"
                                onConfirm={() => this.delInstallment(record.id)}
                                okText="是"
                                cancelText="否"
                            >
                                <a style={{ color: '#FF5A5A' }}>删除</a>
                            </Popconfirm>
                            {/* <a style={{ color: '#2C9DFF' }} onClick={() => this.spellGroup(record)}>开启拼团</a> */}
                        </Space>)
                    } else if (goodsTable === 2) {
                        return (<Space size="middle">
                            <a style={{ color: '#13CE66' }} onClick={() => this.editInstallment(record)} >修改</a>
                            <Popconfirm
                                title="请您确认是否删除?"
                                onConfirm={() => this.delInstallment(record.id)}
                                okText="是"
                                cancelText="否"
                            >
                                <a style={{ color: '#FF5A5A' }}>删除</a>
                            </Popconfirm>
                        </Space>)
                    } else {
                        return (<Space size="middle">
                            <Popconfirm
                                title="请您确认是否恢复?"
                                onConfirm={() => this.restoreInstallment(record.id)}
                                okText="是"
                                cancelText="否"
                            >
                                <a style={{ color: '#13CE66' }}>恢复</a>
                            </Popconfirm>
                            <Popconfirm
                                title="请您确认是否彻底删除?"
                                onConfirm={() => this.realDelInstallment(record.id)}
                                okText="是"
                                cancelText="否"
                            >
                                <a style={{ color: '#FF5A5A' }}>彻底删除</a>
                            </Popconfirm>
                        </Space>)
                    }
                }
            }
        ]
        const uploadButtonA = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
            </div>
        )
        return (
            <div className="installment">
                {/* 新增、编辑分期项目模态框 */}
                <Modal
                    visible={installmentVisble}
                    onCancel={() => this.setState({ installmentVisble: false })}
                    onOk={() => this.installmentAction(installmentType)}
                    width={800}
                    okText='确定'
                    cancelText="取消"
                    title={installmentTitle}
                >
                    <div className="goods-modal-installment">
                        <div className="goods-modal-header">
                            <span className="goods-modal-header-span">卡项分类</span>
                            <Radio.Group value={cardType} onChange={e => this.setState({ cardType: e.target.value })}>
                                <Radio value={1}>次数卡</Radio>
                                <Radio value={0}>时间卡</Radio>
                            </Radio.Group>
                        </div>
                        {
                            cardType === 1
                                ? <div className="goods-modal-header">
                                    <span className="goods-modal-body-span">有效次数</span>
                                    <Input
                                        className="goods-modal-body-input"
                                        placeholder="请输入有效次数"
                                        value={astrict}
                                        onChange={e => this.setState({ astrict: e.target.value })}
                                    />
                                </div>
                                : <div className="goods-modal-header">
                                    <span className="goods-modal-body-span">有效天数</span>
                                    <Input
                                        className="goods-modal-body-input"
                                        placeholder="请输入有效天数"
                                        value={astrict}
                                        onChange={e => this.setState({ astrict: e.target.value })}
                                    />
                                </div>
                        }
                        <div className='goods-modal-body-item'>
                            <span className='goods-modal-body-span'>项目分类</span>
                            <Select
                                className="goods-modal-body-input"
                                value={installmentClass}
                                onChange={e => this.setState({ installmentClass: e })}
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
                                value={installmentName}
                                onChange={e => this.setState({ installmentName: e.target.value })}
                            />
                        </div>
                        <div className="goods-modal-header">
                            <span className="goods-modal-body-span">项目图片</span>
                            <div className="goods-modal-body-image">
                                <Upload
                                    listType="picture-card"
                                    showUploadList={false}
                                    action="http://47.108.174.202:9010/upload/files-upload"
                                    onChange={this.uploadInstallmentImage}
                                >
                                    {installmentImage === null
                                        ? uploadButtonA
                                        : <img src={installmentImage} alt="photos" className='fItemConimg' />}
                                </Upload>
                            </div>
                        </div>
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
                        <div className="goods-modal-body-item">
                            <span className="goods-modal-body-span">项目价格</span>
                            <Input
                                className="goods-modal-body-input"
                                placeholder="请输入项目价格"
                                value={installmentPrice}
                                onChange={e =>
                                    this.setState({ installmentPrice: e.target.value }, () => this.setEachInstallmentPrice())
                                }
                            />
                        </div>
                        <div className="goods-modal-body-item">
                            <span className="goods-modal-body-span">虚拟销量</span>
                            <Input
                                className="goods-modal-body-input"
                                placeholder="请输入虚拟销量"
                                value={installmentSales}
                                onChange={e => this.setState({ installmentSales: e.target.value })}
                            />
                        </div>
                        <div className="goods-modal-body-item">
                            <span className="goods-modal-body-span">总期数</span>
                            <Input
                                className="goods-modal-body-input"
                                placeholder="请输入总期数"
                                value={installmentTotal}
                                onChange={e =>
                                    this.setState({ installmentTotal: e.target.value }, () => this.setEachInstallmentPrice())
                                }
                            />
                        </div>
                        <div className="goods-modal-body-item">
                            <span className="goods-modal-body-span">预付金额</span>
                            <Input
                                className="goods-modal-body-input"
                                placeholder="请输入预付金额"
                                value={installmentAmount}
                                onChange={e =>
                                    this.setState({ installmentAmount: e.target.value }, () => this.setEachInstallmentPrice())
                                }
                            />
                        </div>
                        {
                            isStageDetailInfo
                                ? <div className="goods-modal-header goods-stageDetailInfo">
                                    项目价格 <span style={{ color: 'red', fontSize: 18 }}>{installmentPrice}</span>,
                                    总期数 <span style={{ color: 'red', fontSize: 18 }}>{installmentTotal}</span>,
                                    每一期价格 <span style={{ color: 'red', fontSize: 18 }}>{eachInstallmentPrice}</span>,
                                    首次付款 <span style={{ color: 'red', fontSize: 18 }}>{installmentAmount + '+' + eachInstallmentPrice}</span>,
                            </div>
                                : null
                        }
                        <div className="goods-modal-body-item">
                            <span className="goods-modal-body-span">员工提成</span>
                            <Input
                                className="goods-modal-body-input"
                                placeholder="请输入整数"
                                value={installmentRoyaltyRate}
                                onChange={e => this.setState({ installmentRoyaltyRate: e.target.value })}
                                onBlur={() => {
                                    if (this.state.installmentRoyaltyRate) {
                                        if (!(/^[0-9][0-9]{0,1}$/.test(this.state.installmentRoyaltyRate))) {
                                            message.warning('请输入1-99的整数')
                                            this.setState({ installmentRoyaltyRate: '' })
                                        }
                                    }
                                }}
                            />
                            <span style={{ fontSize: 18 }}>%</span>
                        </div>

                        <div className="goods-modal-header">
                            <span className="goods-modal-body-span" style={{ verticalAlign: 'top' }}>项目详情</span>
                            <TextArea rows={6} style={{ width: '70%' }}
                                value={installmentRemarks}
                                onChange={e => this.setState({ installmentRemarks: e.target.value })} />

                        </div>
                    </div>
                </Modal>


                <div className='goods-header'>
                    <span>分期项目</span>
                </div>

                <div className="goods-body">
                    <div className='goods-class'>
                        <span
                            className={goodsTable === 1 ? 'goods-check-class' : 'goods-not-check-calss'}
                            onClick={() => this.setState({ goodsTable: 1 }, () => this.getInstallmentList())}
                        >出售中</span>
                        <span
                            className={goodsTable === 2 ? 'goods-check-class' : 'goods-not-check-calss'}
                            onClick={() => this.setState({ goodsTable: 2 }, () => this.getInstallmentList())}
                        >待上架</span>
                        <span
                            className={goodsTable === 3 ? 'goods-check-class' : 'goods-not-check-calss'}
                            onClick={() => this.setState({ goodsTable: 3 }, () => this.getInstallmentList())}
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
                            onClick={() => this.setState({ searchVal: '' }, () => this.getInstallmentList())}>刷新</span>

                        <div className="goods-search-add" onClick={this.addInstallment}>
                            <PlusOutlined className="goods-search-add-icon" />
                            <span className="goods-search-add-span">新增分期项目</span>
                        </div>
                        <Select
                            className="goods-search-class"
                            value={classify}
                            onChange={e => this.setState({ classify: e }, () => this.getInstallmentList())}
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
                        columns={installmentColumns}
                        dataSource={installmentList}
                        locale={{ emptyText: emptyText }}
                        loading={loading}
                    />
                </div>


            </div>
        )
    }
}