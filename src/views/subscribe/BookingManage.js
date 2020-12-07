import React, { Component } from 'react'
import '../subscribe/Subscribe.css'
import { Image, Popover, Tag, Table, Input, Modal, Select, Radio, Upload, message, InputNumber, Space, Popconfirm } from 'antd'
import { SearchOutlined, SyncOutlined, PlusOutlined } from '@ant-design/icons'
import axios from '../../http'

const { TextArea } = Input
const { Option } = Select

export default class BookingManage extends Component {
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

    }
    render() {
        const { emptyText, loading, subscribeData,
        } = this.state
        const colOnline = [
            {
                title: '预约编号',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: '项目图片',
                dataIndex: 'image',
                key: 'image'
            },
            {
                title: '项目名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '预约客户',
                dataIndex: 'cateName',
                key: 'cateName',
            },
            {
                title: '员工',
                dataIndex: 'cateName',
                key: 'cateName',
            },
            {
                title: '预约时间',
                key: 'ficti',
                dataIndex: 'ficti',
            },
            {
                title: '备注信息',
                key: 'stock',
                dataIndex: 'stock'
            },
            {
                title: '操作',
                key: 'action',
                width: 300,
                render: (text, record) => {
                    return (
                        <Space>
                            <a style={{ color: '#13CE66' }} >修改预约</a>
                            <Popconfirm
                                title="请您确认是否删除?"
                                onConfirm={() => this.goodsfirm(record)}
                                onCancel={this.cancel}
                                okText="是"
                                cancelText="否"
                            >
                                <a style={{ color: '#FF5A5A' }}>取消预约</a>
                            </Popconfirm>
                        </Space>
                    )
                }
            },
        ]
        return (
            <div className="subscribe">
                <div className="homeIndex-header">
                    <span>预约管理</span>
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
                </div>

                <Table columns={colOnline}
                    dataSource={subscribeData}
                    style={{ textAlign: 'center' }}
                    pagination={{ pageSize: 4, position: ['bottomLeft'] }}
                    loading={loading}
                    locale={{ emptyText: emptyText }} />
            </div>
        )
    }
}