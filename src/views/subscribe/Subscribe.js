import React, { Component } from 'react'
import '../subscribe/Subscribe.css'
import { Image, Popover, Tag, Table, Input, Modal, Select, Radio, Upload, message } from 'antd'
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
        commission: 0

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
            sales, stock, integral, commission
        } = this.state
        const colOnline = [
            {
                title: '商品编号',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: '商品图片',
                dataIndex: 'image',
                key: 'image'
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
                key: 'price'
            },
            {
                title: '销量',
                key: 'ficti',
                dataIndex: 'ficti',
            },
            {
                title: '库存',
                key: 'stock',
                dataIndex: 'stock'
            },
            {
                title: '系统状态',
                key: 'isShow',
                dataIndex: 'isShow',
            },
            {
                title: '操作',
                key: 'action',
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
                    <span>预约服务</span>
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
                        <span>新增商品</span>
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
                            <span className='littleLabel'>邮费</span>
                            <Input
                                value={postage}
                                onChange={e => this.setState({ postage: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className='goodsModalItem'>
                        <div className='littleitem'>
                            <span className='littleLabel'>销量</span>
                            <Input 
                            placeholder='请输入销量'
                            value={sales}
                            onChange={e => this.setState({sales: e.target.value})}
                             />
                        </div>
                        <div className='littleitem'>
                            <span className='littleLabel'>库存</span>
                            <Input 
                            placeholder='请输入库存'
                            value={stock}
                            onChange={e => this.setState({stock: e.target.value})}
                             />
                        </div>
                    </div>

                    <div className='goodsModalItem'>
                        <span className='gmiLabel'>预约服务时间</span>
                    </div>
                    
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