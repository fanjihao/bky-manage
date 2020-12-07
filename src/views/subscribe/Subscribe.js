import React, { Component } from 'react'
import '../subscribe/Subscribe.css'
import { Image, Popover, Popconfirm, Space, Tag, Table, Input, Modal, Select, Radio, Upload, message, InputNumber } from 'antd'
import { SearchOutlined, SyncOutlined, PlusOutlined } from '@ant-design/icons'
import axios from '../../http'

const { TextArea } = Input
const { Option } = Select

export default class Subscribe extends Component {
    state = {
        emptyText: '暂无信息',
        loading: false,
        subscribeData: [],
        title: '',
        // 商品分类列表
        treeData: [],
        // 商品分类
        classify: 1,
        // 商品图片列表
        goodsImage: null,
        goodsName: '',
        goodsPrice: '',
        postage: 0,
        sales: '',
        stock: '',
        // 是否积分抵换，1是，0否
        integral: 1,
        // 员工提成
        commission: 0,
        // 服务时长
        serviceLengthKey: 1,
        serviceLengthVal: '30分钟',
        // 可预约时间
        timeArr: [
            { id: 5, value: '8:00-8:30' },
            { id: 6, value: '8:30-9:00' },
            { id: 7, value: '9:00-9:30' },
            { id: 8, value: '9:30-10:00' },
            { id: 9, value: '10:00-8:30' },
            { id: 10, value: '10:30-8:00' },
            { id: 11, value: '11:00-8:30' },
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
        appointmenTime: [],
        timeLoading: true,
        // 最大人数
        limitPerson: 1
    }
    componentDidMount() {
        this.goodsFenleiList()
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
    // 打开新增预约服务商品模态框
    addSubscribe = () => {
        this.setState({
            // 商品分类
            classify: 1,
            // 商品图片列表
            goodsImage: null,
            goodsName: '',
            goodsPrice: '',
            postage: 0,
            sales: '',
            stock: '',
            // 是否积分抵换，1是，0否
            integral: 1,
            // 员工提成
            commission: 0,
            visible: true,
            title: '新增预约服务商品'
        })
    }
    // 上传预约服务商品照片
    uploadSpellImage = info => {
        const res = info.fileList[0].response
        if (res) {
            this.setState({
                goodsImage: 'https://www.bkysc.cn/api/files-upload/' + res.data
            })
        }
    }
    // 正则判断员工提成
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
    // 新增预约服务商品
    addSubscribeGoods = () => {
        axios({

        })
    }
    render() {
        const { emptyText, loading, subscribeData, visible, treeData,
            title, classify, goodsImage, goodsName, goodsPrice, postage,
            sales, stock, integral, commission, serviceLengthKey, serviceLengthVal, timeArr, timeLoading, appointmenTime,
            limitPerson
        } = this.state
        const colOnline = [
            {
                title: '服务编号',
                dataIndex: 'id',
                key: 'id',
                align: 'center'
            },
            {
                title: '服务图片',
                dataIndex: 'image',
                key: 'image',
                align: 'center'
            },
            {
                title: '服务名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '分类名称',
                dataIndex: 'cateName',
                key: 'cateName',
                align: 'center'
            },
            {
                title: '价格',
                dataIndex: 'price',
                key: 'price',
                align: 'center'
            },
            {
                title: '销量',
                key: 'ficti',
                dataIndex: 'ficti',
                align: 'center'
            },
            {
                title: '系统状态',
                key: 'isShow',
                dataIndex: 'isShow',
                align: 'center'
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => {
                    return (
                        <Space size="middle">
                            <a style={{ color: '#13CE66' }} >修改</a>
                            <Popconfirm
                                title="请您确认是否删除?"
                                onConfirm={() => this.goodsfirm(record)}
                                onCancel={this.cancel}
                                okText="是"
                                cancelText="否"
                            >
                                <a style={{ color: '#FF5A5A' }}>删除</a>
                            </Popconfirm>
                        </Space>
                    )
                },
                align: 'center',
                width: 500
            },
        ]
        const uploadButtonA = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
            </div>
        )
        return (
            <div className="subscribe">
                <div className="homeIndex-header">
                    <span>线下服务</span>
                </div>

                <div className="search">
                    <Input
                        placeholder="请输入商品名搜索"
                        className="spell-searchInput"
                    />
                    <div className='spell-searchBtn search-btn'>
                        <SearchOutlined />
                        <span>搜索</span>
                    </div>
                    <div className="spell-refresh">
                        <SyncOutlined />
                        <span>刷新</span>
                    </div>
                    <div className='add-btn add-subscribe-btn' onClick={this.addSubscribe}>
                        <PlusOutlined />
                        <span>新增服务</span>
                    </div>
                </div>

                <Table columns={colOnline}
                    dataSource={subscribeData}
                    style={{ textAlign: 'center' }}
                    pagination={{ pageSize: 4, position: ['bottomLeft'] }}
                    loading={loading}
                    locale={{ emptyText: emptyText }} />

                {/* 添加、编辑模态框 */}
                <Modal
                    visible={visible}
                    onCancel={() => this.setState({ visible: false })}
                    onOk={this.addSubscribe}
                    width={800}
                    okText='确定'
                    cancelText="取消"
                    title={title}
                >
                    <div className='goodsModalItem'>
                        <span className='gmiLabel'>商品分类</span>
                        <Select
                            style={{ width: 150 }}
                            onChange={e => this.setState({ value: e })}
                            value={classify}
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
                        <Input
                            placeholder='请输入项目名称'
                            style={{ width: 250 }}
                            value={goodsName}
                            onChange={e => this.setState({ goodsName: e.target.value })}
                        />
                    </div>

                    <div className='goodsModalImg'>
                        <span className='gmiLabel'>商品图片</span>
                        <Upload
                            listType="picture-card"
                            showUploadList={false}
                            action="http://47.108.174.202:9010/upload/files-upload"
                            onChange={this.uploadSpellImage}
                            className='avatar-uploader'
                        >
                            {goodsImage === null
                                ? uploadButtonA
                                : <img src={goodsImage} alt="photos" className='fItemConimg' />}
                        </Upload>
                    </div>

                    <div className='goodsModalItem'>
                        <div className='littleitem'>
                            <span className='littleLabel'>商品价格</span>
                            <Input
                                placeholder='请输入价格'
                                value={goodsPrice}
                                onChange={e => this.setState({ goodsPrice: e.target.value })}
                            />
                        </div>
                        <div className='littleitem'>
                            <span className='littleLabel'>销量</span>
                            <Input
                                placeholder='请输入销量'
                                value={sales}
                                onChange={e => this.setState({ sales: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ margin: '10px 39px' }}>
                        <span className='integralSpan'>使用积分</span>
                        <div className="integral">
                            <Radio.Group value={integral} onChange={e => this.setState({ integral: e.target.value })}>
                                <Radio value={1}>开启</Radio>
                                <Radio value={0}>关闭</Radio>
                            </Radio.Group>
                        </div>
                        <span className='integralSpan'>服务折扣</span>
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
                    <div className='goodsModalItem'>
                        <span className='gmiLabel'>服务时长</span>
                        <Select
                            placeholder='请选择服务时长'
                            style={{ width: 250 }}
                            value={serviceLengthVal}
                            onChange={(key, item) => {
                                this.setState({
                                    serviceLengthKey: item.key,
                                    serviceLengthVal: item.children
                                }, () => {
                                    let timeArr
                                    if (this.state.serviceLengthVal === '30分钟') {
                                        timeArr = [
                                            { id: 5, value: '8:00-8:30' },
                                            { id: 6, value: '8:30-9:00' },
                                            { id: 7, value: '9:00-9:30' },
                                            { id: 8, value: '9:30-10:00' },
                                            { id: 9, value: '10:00-8:30' },
                                            { id: 10, value: '10:30-8:00' },
                                            { id: 11, value: '11:00-8:30' },
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
                                    } else if (this.state.serviceLengthVal === '60分钟') {
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
                                    } else if (this.state.serviceLengthVal === '90分钟') {
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
                                        appointmenTime: []
                                    })
                                })
                            }}
                        >
                            <Option key={1} label='30分钟'>30分钟</Option>
                            <Option key={2} label='60分钟'>60分钟</Option>
                            <Option key={3} label='90分钟'>90分钟</Option>
                            <Option key={4} label='120分钟'>120分钟</Option>
                        </Select>
                    </div>

                    <div className='subTime'>
                        <span className='gmiLabel'>可预约时间</span>
                        <Select
                            placeholder='请选择可预约时间'
                            style={{ width: 500 }}
                            defaultValue={appointmenTime}
                            value={appointmenTime}
                            mode="multiple"
                            optionLabelProp="label"
                            onChange={(value, label) => {
                                console.log(value)
                                this.setState({
                                    appointmenTime: value
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
                    <div className='goodsModalItem'>
                        <span className='gmiLabel'>服务人数上限</span>
                        <InputNumber
                            min={1} max={10} defaultValue={limitPerson}
                            style={{ width: 250 }}
                            onChange={e => this.setState({ limitPerson: e })}
                        />
                    </div>

                    {/* <div className='subscribeService'>
                        <span className='gmiLabel'>预约服务时间</span>
                        <div className='subscribeTime'>

                        </div>
                    </div> */}
                    
                    {/* <div style={{ margin: '10px 39px' }}>
                        <span className='integralSpan'>积分抵扣</span>
                        <div className="integral">
                            <Radio.Group value={integral} onChange={e => this.setState({integral: e.target.value})}>
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
                    </div> */}

                    <div className='itemDirecte'>
                        <span className='gmiLabel'>产品详情</span>
                        <TextArea rows={6} style={{ width: '70%' }} />
                    </div>
                </Modal>
            </div>
        )
    }
}