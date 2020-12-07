import React, { Component } from 'react'
import '../spell/Spell.css'
import {
    Input, Table, Image, Button, Radio,
    Upload, Modal, DatePicker, TimePicker,
    message, Popconfirm
} from 'antd'
import { SearchOutlined, PlusOutlined, SyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from '../../http/index'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'

const { TextArea } = Input

export default class Spell extends Component {
    state = {
        spellList: [],
        emptyText: '暂无拼团商品',
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
        // 拼团活动状态
        spellIsShow: 1,
        // 拼团描述
        spellDescription: '',
        // 拼团商品ID
        spellProductId: '',
        // 表格加载
        loading: false,

        searchVal: '',
        // 上下架
        visible: false,
        title: '',
        // 拼团ID
        ID: '',
        // 原价
        originalPrice: '',
        // 拼团折扣
        spellDiscount: ''
    }
    // 查询拼团列表
    getSpellList = () => {
        const { searchVal } = this.state
        const id = JSON.parse(localStorage.getItem('user')).id
        console.log(id)
        this.setState({ loading: true })
        axios({
            method: 'GET',
            url: '/api/yxStoreCombination',
            params: {
                // page: 0,
                // size: 10,
                title: searchVal,
                merId: id
            }
        })
            .then(res => {
                console.log('查询拼团列表成功', res)
                this.setState({
                    spellList: res.data.content,
                    loading: false
                })
            })
            .catch(err => {
                console.log('查询拼团列表失败', err)
            })
    }
    componentDidMount() {
        this.getSpellList()
    }
    // 打开编辑模态框
    editSpell = data => {
        console.log(data)
        this.setState({
            // 拼团名称
            spellName: data.title,
            // 拼团时效
            spellTime: data.effectiveTime,
            // // 拼团开始日期
            startDate: data.startTimeDate.split(' ')[0],
            startTime: data.startTimeDate.split(' ')[1],
            // // 拼团结束日期
            endDate: data.endTimeDate.split(' ')[0],
            endTime: data.endTimeDate.split(' ')[1],
            // 产品图片
            spellImage: data.image,
            // 拼团价
            spellPrice: data.price,
            // 拼团人数
            spellPeople: data.people,
            // 库存
            spellStock: data.stock,
            // 销量
            spellSales: data.sales,
            // 邮费
            spellPostage: data.postage,
            // 拼团活动状态
            spellIsShow: data.isShow,
            // 拼团描述
            spellDescription: data.description,
            // 拼团商品ID
            spellProductId: data.productId,
            isSpellGroup: true,
            ID: data.id,
            // 原价
            originalPrice: data.originPrice,
            // 拼团折扣
            spellDiscount: data.discount
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
    // 修改拼团商品
    editSpellGroup = () => {
        const { spellName, spellTime, spellImage, spellPrice,
            spellPeople, spellSales, spellStock, spellPostage,
            startDate, startTime, endTime, endDate, spellDescription,
            spellIsShow, spellProductId, ID, spellDiscount } = this.state
        let merId = JSON.parse(localStorage.getItem('user')).id
        if (startDate === '' || startTime === '' || endDate === '' || endTime === ''
            || spellDescription === '' || spellDiscount === '' || spellName === ''
            || spellImage === '' || spellPeople === '' || spellSales === ''
            || spellStock === '' || spellPostage === '') {
                message.warning('请确认信息填写完整！')
        } else {
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
                    isHost: 0,
                    id: ID,
                    discount: spellDiscount
                }
            })
                .then(res => {
                    console.log('修改拼团成功', res)
                    this.getSpellList()
                    this.setState({ isSpellGroup: false })
                    message.success('修改拼团商品成功')
                })
                .catch(err => {
                    console.log('修改拼团失败', err)
                })
        }

    }
    // 删除拼团商品
    delSpellGroup = data => {
        axios({
            method: 'DELETE',
            url: `/api/yxStoreCombination/${data.id}`
        })
            .then(res => {
                console.log('删除拼团商品成功', res)
                this.getSpellList()
            })
            .catch(err => {
                console.log('删除拼团商品失败', err)
            })
    }
    // 上下架
    setSpellState = () => {
        axios({
            method: 'POST',
            url: `/api/yxStoreCombination/onsale/${this.state.ID}`,
            data: {
                status: this.state.spellIsShow
            }
        })
            .then(res => {
                console.log('上下架成功', res)
                this.getSpellList()
                this.setState({ visible: false })
            })
            .catch(err => {
                console.log('上下架失败', err)
            })
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
    render() {
        const { spellList, emptyText, isSpellGroup, spellName,
            spellTime, spellImage, spellPrice, spellPeople,
            spellSales, spellStock, spellPostage, spellIsShow,
            spellDescription, startDate, startTime, endDate,
            endTime, loading, searchVal, visible, title,
            spellDiscount, originalPrice } = this.state
        const columns = [
            {
                title: 'id',
                key: 'id',
                dataIndex: 'id',
                align: 'center',
                width: 50
            },
            // {
            //     title: '商品ID',
            //     key: 'productId',
            //     dataIndex: 'productId',
            //     align: 'center',
            //     width: 100
            // }, 
            {
                title: '产品图',
                key: 'image',
                dataIndex: 'image',
                render: text => (
                    <Image src={text} width={50} />
                ),
                align: 'center',
                width: 100
            }, {
                title: '拼团名称',
                key: 'title',
                dataIndex: 'title',
                align: 'center',
                width: 100
            }, {
                title: '参团人数',
                key: 'people',
                dataIndex: 'people',
                align: 'center',
                width: 100
            }, {
                title: '拼团价',
                key: 'price',
                dataIndex: 'price',
                align: 'center',
                width: 100
            }, {
                title: '库存',
                key: 'stock',
                dataIndex: 'stock',
                align: 'center',
                width: 80
            }, {
                title: '参与人数',
                key: 'countPeopleAll',
                dataIndex: 'countPeopleAll',
                align: 'center',
                width: 100
            }, {
                title: '成团数量',
                key: 'countPeopleBrowse',
                dataIndex: 'countPeopleBrowse',
                align: 'center',
                width: 100
            }, {
                title: '访客人数',
                key: 'countPeoplePink',
                dataIndex: 'countPeoplePink',
                align: 'center',
                width: 100
            }, {
                title: '状态',
                key: 'isShow',
                dataIndex: 'isShow',
                render: (text, record) => text === 1
                    ? <span className="spellListSpanA" onClick={() => this.setState({
                        title: '确认进行【下架】操作',
                        visible: true,
                        spellIsShow: 0,
                        ID: record.id
                    })}>已开启</span>
                    : <span className="spellListSpanB" onClick={() => this.setState({
                        title: '确认进行【上架】操作',
                        visible: true,
                        spellIsShow: 1,
                        ID: record.id
                    })}>已关闭</span>,
                align: 'center'
            }, {
                title: '结束时间',
                key: 'endTimeDate',
                dataIndex: 'endTimeDate',
                align: 'center',
                width: 200
            }, {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <div>
                        <Button type="primary" style={{ marginRight: 10 }} onClick={() => this.editSpell(record)}>编辑</Button>
                        <Popconfirm
                            title="请您确认是否删除?"
                            onConfirm={() => this.delSpellGroup(record)}
                            okText="是"
                            cancelText="否"
                        >
                            <Button type="primary" danger>删除</Button>
                        </Popconfirm>
                    </div>
                ),
                width: 200,
                align: 'center'
            },
        ]
        console.log(startDate)

        const uploadButtonA = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
            </div>
        )
        return (
            <div className="spell">
                <div className="homeIndex-header">
                    <span>拼团管理</span>
                </div>

                <div className="search">
                    <Input
                        placeholder="请输入拼团商品名搜索"
                        className="spell-searchInput"
                        value={searchVal}
                        onChange={e => this.setState({ searchVal: e.target.value })}
                    />
                    <div className='spell-searchBtn search-btn' onClick={this.getSpellList}>
                        <SearchOutlined />
                        <span>搜索</span>
                    </div>
                    <div className="spell-refresh" onClick={this.getSpellList}>
                        <SyncOutlined />
                        <span>刷新</span>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={spellList}
                        locale={{ emptyText: emptyText }}
                        loading={loading}
                    />
                </div>
                {/* 编辑拼团商品模态框 */}
                <Modal
                    visible={isSpellGroup}
                    onCancel={() => this.setState({ isSpellGroup: false })}
                    onOk={this.editSpellGroup}
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
                                value={moment(startDate, 'YYYY-MM-DD')}
                            />
                            <TimePicker
                                locale={locale}
                                allowClear={false}
                                onChange={this.getStartTime}
                                value={moment(startTime, 'HH:mm:ss')}
                            />
                        </div>

                        <div className="spellItem">
                            <span className="spellSpan">拼团结束时间</span>
                            <DatePicker
                                locale={locale}
                                allowClear={false}
                                style={{ marginRight: 10 }}
                                onChange={this.getEndDate}
                                value={moment(endDate, 'YYYY-MM-DD')}
                            />
                            <TimePicker
                                locale={locale}
                                allowClear={false}
                                onChange={this.getEndTime}
                                value={moment(endTime, 'HH:mm:ss')}
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
                                // onChange={e => this.setState({ spellPrice: e.target.value })}
                                />
                            </div>
                            <div className="timeItem">
                                <span className="smallSpan">拼团折扣</span>
                                <Input
                                    className="smallInput"
                                    value={spellDiscount}
                                    onChange={e => this.setDiscount(e)}
                                />
                            </div>
                        </div>

                        <div className="spellItem">
                            <div className="timeItem">
                                <span className="smallSpan">拼团价</span>
                                <Input
                                    disabled={true}
                                    className="smallInput"
                                    value={spellPrice}
                                // onChange={e => this.setState({ spellPrice: e.target.value })}
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

                            {/* <div className="timeItem">
                                <span className="smallSpan">活动状态</span>
                                <div className="spellIsShow">
                                    <Radio.Group value={spellIsShow} onChange={e => this.setState({ spellIsShow: e.target.value })}>
                                        <Radio value={1}>开启</Radio>
                                        <Radio value={0}>关闭</Radio>
                                    </Radio.Group>
                                </div>
                            </div> */}
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
                {/* 上下架弹框 */}
                <Modal
                    visible={visible}
                    onCancel={() => this.setState({ visible: false })}
                    onOk={this.setSpellState}
                    width={300}
                    okText='确定'
                    cancelText="取消"
                    title="提示">
                    <div>
                        <ExclamationCircleOutlined style={{ color: '#FAAD14', fontSize: 18 }} />
                        <span style={{ marginLeft: 20, display: 'inline-block' }}>{title}</span>
                    </div>

                </Modal>
            </div>
        )
    }
}