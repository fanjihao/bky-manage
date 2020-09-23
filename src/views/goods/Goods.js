import React, { Component } from 'react'
import './Goods.css'
import { Input, Select, Button, Space, Table, Tag, Popconfirm, message, Upload, Image, Popover } from 'antd'
import axios from '../../http/index'
import Modal from 'antd/lib/modal/Modal'

const { Option } = Select
const { TextArea } = Input

class Goods extends Component {
    state = {
        goodsIndex: 1,
        goodsTable: 1,
        name: '',
        // 分期项目
        stageVisible: false,
        stageFenlei: '',
        stageName: '',
        stageKeyWord: '',
        stageImg: '',
        stagePrice: '',
        stageSales: '',
        stageNumVal:'',
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
        // 
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
        goodsimgVisible: false,
        goodsImage: '',
        goodsFileList: [],
        // 线上商品
        onlineGoods: [],
        goodsFenleiList: [],
        goodsModal: false,
        goodsMoInfo: '',
        goodsClass: '',
        goodsClassVal: '',
        goodsName: '',
        goodsKey1: '',
        goodsKey2: '',
        goodsKey3: '',
        goodsPhoto: '',
        goodsRemarks: '',
        goodsPrice: '',
        goodsVip: '',
        goodsPostage: '',
        goodsSales: '',
        goodsSku: ''
    }
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
                console.log(res.data.data)
                message.success('查询商品成功')
                this.setState({
                    stageData: res.data.data.list
                })
            })
            .catch(err => {
                message.error('查询商品失败')
            })
    }
    getOnlineItem = () => {
        const { name, goodsTable, cateName } = this.state
        let user = JSON.parse(localStorage.getItem('user'))
        axios({
            url: '/merchantOrder/listOnLineProducts',
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
                console.log(res.data.data)
                message.success('查询商品成功')
                this.setState({
                    onlineGoods: res.data.data.list
                })
            })
            .catch(err => {
                message.error('查询商品失败')
            })
    }
    addGoods = () => {
        this.setState({
            goodsModal: true,
            goodsMoInfo: 'add'
        })
    }
    goodsFenleiList = () => {
        axios({
            url: '/api/yxStoreCategory',
            method: 'GET',
            params: {
                page: 1
            }
        })
            .then(res => {
                console.log(res)
                this.setState({
                    goodsFenleiList: res.data.content
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    getFenlei = () => {
        axios({
            url: '/api/yxStoreCategory',
            method: 'GET',
            params: {
                page: 1,
            }
        })
            .then(res => {
                this.setState({
                    fenleiList: res.data.content
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    componentDidMount() {
        this.getStageItem()
        this.getFenlei()
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
            this.getStageItem()
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
            stageSales, stageNumVal, stageAmount, stageRemarks, stageFenlei, stageNo, fenleiList, fileList } = this.state
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
        let cateid = fenleiList.filter(item => stageFenlei === item.cateName)[0].id
        formData.append('cateId', cateid)
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
        axios({
            url: '/statistics/updatePhasedProject',
            method: 'POST',
            data: formData
        })
            .then(res => {
                message.success('分期项目修改成功')
                this.setState({
                    stageVisible: false,
                }, () => {
                    this.getStageItem()
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    // 添加分期
    okShelves = () => {
        let user = JSON.parse(localStorage.getItem('user'))
        const { stageName, stageKeyWord, stagePrice,
            stageSales, stageNumVal, stageAmount, stageRemarks, stageFenlei, fileList } = this.state
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
        formData.append('cateId', stageFenlei)
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
        axios({
            url: '/statistics/addPhasedProject',
            method: 'POST',
            data: formData
        })
            .then(res => {
                console.log(res)
                message.success('分期项目添加成功')
                this.setState({
                    stageVisible: false,
                }, () => {
                    this.getStageItem()
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    changeFenlei = val => {
        this.setState({
            stageFenlei: val
        })
    }
    changefl = val => {
        let checkedFl = this.state.fenleiList.map(item => {
            if (val === item.id) return item
        })
        this.setState({
            cateName: checkedFl.cateName,
            cateId: val
        })
    }
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
    handleOk = () => {
        this.dismount(this.state.sureChange)
        this.setState({
            promptModal: false,
            sureChange: ''
        })
    }
    handleCancel = () => {
        this.setState({
            promptModal: false,
            sureChange: ''
        })
    }
    editStage = (type, i) => {
        this.setState({
            stageVisible: true,
            stageVisiInfo: type
        }, () => {
            if (type === 'edit') {
                console.log(i)
                let fenlei
                fenlei = this.state.fenleiList.filter(item => {
                    if (i.cateId === item.id) return item
                })[0].cateName
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
                    stageFenlei: fenlei,
                    stageName: i.name,
                    stageKeyWord: i.keyWord,
                    fileList: imgArr,
                    stagePrice: i.price,
                    stageSales: i.sales,
                    stageNumVal: i.stagesNumber,
                    stageAmount: i.prepaymentAmount,
                    stageRemarks: i.remarks,
                    stageNo: i.id
                })
            } else {
                this.setState({
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
                    fileList:[]
                })
            }
        })

    }
    checkIndex = (i) => {
        this.setState({
            goodsIndex: i
        }, () => {
            if (i === 1) {
                this.getStageItem()
                this.getFenlei()
            } else {
                this.getOnlineItem()
                this.goodsFenleiList()
            }
        })
    }

    changeGoodsClass = val => {
        let className = this.state.goodsFenleiList.filter(item => item.id === val)[0].cateName
        this.setState({
            goodsClass: val,
            goodsClassVal: className
        })
    }
    // 添加商品-新增并上架
    goodsOkShelves = (which) => {
        let user = JSON.parse(localStorage.getItem('user'))
        const { goodsClass, goodsName, goodsKey1, goodsKey2, goodsKey3, goodsPhoto,
            goodsRemarks, goodsPrice, goodsVip, goodsPostage, goodsSales, goodsSku, } = this.state
        let formData = new FormData()
        formData.append('merId', user.id)
        formData.append('keyword', goodsKey1 + ',' + goodsKey2 + ',' + goodsKey3)
        formData.append('cateId', goodsClass)
        formData.append('name', goodsName)
        formData.append('price', Number(goodsPrice))
        formData.append('vipPrice', Number(goodsVip))
        formData.append('image', goodsPhoto)
        formData.append('ficti', Number(goodsSales))
        formData.append('stock', Number(goodsSku))
        formData.append('storeInfo', goodsRemarks)
        formData.append('postage', Number(goodsPostage))
        formData.append('isShow', which)
        formData.append('isNew', 0)
        formData.append('isBest', 0)
        formData.append('isBenefit', 0)
        axios({
            url: '/statistics/addProducts',
            method: 'POST',
            data: formData
        })
            .then(res => {
                console.log('添加成功', res)
            })
            .catch(err => {
                console.log('添加失败', err)
            })
    }
    stageImgCancel = () => this.setState({ previewVisible: false })
    goodsImgCancel = () => this.setState({ goodsimgVisible: false })

    render() {
        const { goodsIndex, goodsTable, name, stageVisible, stageName, stageKeyWord,
            stagePrice, stageSales, stageNumVal, stageAmount, stageRemarks, fenleiList, stageData, promptModal,
            promptInfo, stageVisiInfo, stageFenlei, goodsFenleiList,
            goodsModal, goodsMoInfo, goodsName, goodsKey1, goodsKey2, goodsKey3, goodsPhoto,
            goodsRemarks, goodsPrice, goodsVip, goodsPostage, goodsSales, goodsSku, goodsClassVal,
            previewVisible, previewImage, fileList, previewTitle,
            goodsimgVisible, goodsImage, goodsFileList } = this.state
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
                title: '分期数上限',
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
                title: '系统状态',
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
                            <a style={{ color: '#13CE66' }} onClick={() => this.editStage('edit', record)}>修改</a>
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
                dataIndex: 'no',
                key: 'no',
                render: text => <a>{text}</a>,
            },
            {
                title: '商品图片',
                dataIndex: 'name',
                key: 'name',
                render: text => <span>{text}</span>
            },
            {
                title: '商品名称',
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: '分类名称',
                dataIndex: 'goodsinfo',
                key: 'goodsinfo',
            },
            {
                title: '商品价格',
                dataIndex: 'truePay',
                key: 'truePay',
            },
            {
                title: '销量',
                key: 'numOfStage',
                dataIndex: 'numOfStage',
            },
            {
                title: '库存',
                key: 'buildTime',
                dataIndex: 'buildTime',
                render: tags => (
                    <span>{tags}</span>
                ),
            },
            {
                title: '系统状态',
                key: 'buildTime',
                dataIndex: 'buildTime',
                render: tags => (
                    <span>{tags}</span>
                ),
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => {
                    if (record.state === '交易完成') {
                        return (<Space size="middle">
                            <a style={{ color: '#1089EB' }} onClick={() => console.log('我点了', record)}>查看订单</a>
                            <Popconfirm
                                title="请您确认是否删除?"
                                onConfirm={() => this.confirm(record)}
                                onCancel={this.cancel}
                                okText="是"
                                cancelText="否"
                            >
                                <a style={{ color: '#FF5A5A' }}>删除</a>
                            </Popconfirm>
                        </Space>)
                    } else if (record.state === '已删除') {
                        return (<Space size="middle">
                            <a style={{ color: '#1089EB' }} onClick={() => this.lookOrder()}>查看订单</a>
                            <Popconfirm
                                title="请您确认是否恢复?"
                                onConfirm={() => this.confirm(record)}
                                onCancel={this.cancel}
                                okText="是"
                                cancelText="否"
                            >
                                <a style={{ color: '#FF5A5A' }}>恢复</a>
                            </Popconfirm>
                            <Popconfirm
                                title="请您确认是否彻底删除?"
                                onConfirm={() => this.confirm(record)}
                                onCancel={this.cancel}
                                okText="是"
                                cancelText="否"
                            >
                                <a style={{ color: '#FF5A5A' }}>彻底删除</a>
                            </Popconfirm>
                        </Space>)
                    } else {
                        return (<Space size="middle">
                            <a style={{ color: '#1089EB' }} onClick={() => console.log('我点了', record)}>查看订单</a>
                        </Space>)
                    }
                }

            },
        ]
        const fenleiDom = fenleiList.map(item => {
            return <Option value={item.id} key={item.id}>{item.cateName}</Option>
        })
        const goodsClassDom = goodsFenleiList.map(item => {
            return <Option value={item.id} key={item.id}>{item.cateName}</Option>
        })
        let _that = this
        const uploadButton = (
            <div>
                <div style={{ marginTop: 8 }}>上传图片</div>
            </div>
        );
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
                let newList = fileList.filter(item => item.uid !== file.uid)
                _that.setState({
                    goodsFileList: newList
                })
            }
        }
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
                            placeholder='请输入搜索条件'
                            value={name}
                            onChange={e => this.setName(e)}></Input>
                        <Select style={{ width: 150, margin: '0 20px 0 0' }}
                            placeholder='分类'
                            onChange={this.changefl}>
                            {fenleiDom}
                        </Select>
                        <Button
                            style={{ margin: '0 20px 0 0', backgroundColor: '#13CE66', borderColor: '#13CE66' }}
                            type='primary'
                            onClick={() => this.getStageItem()}>搜索</Button>
                        {goodsIndex === 1
                            ? <Button style={{ margin: '0 20px 0 0' }} type='primary' onClick={() => this.editStage('add', 0)}>+新增分期项目</Button>
                            : <Button style={{ margin: '0 20px 0 0' }} type='primary' onClick={() => this.addGoods()}>+新增商品</Button>}
                    </div>
                    <div style={{ width: '100%', paddingBottom: 10 }}>
                        {goodsIndex === 1 ?
                            <Table columns={columns}
                                dataSource={stageData}
                                style={{ textAlign: 'center', paddingBottom: '10px' }}
                                pagination={{ pageSize: 10 }} /> :
                            <Table columns={colOnline}
                                dataSource={stageData}
                                style={{ textAlign: 'center' }}
                                pagination={{ pageSize: 10 }} />}
                    </div>
                    <Modal
                        visible={goodsModal}
                        title={goodsMoInfo === 'add' ? "新增商品" : '修改商品'}
                        onOk={() => this.setState({ goodsModal: false })}
                        onCancel={() => this.setState({ goodsModal: false })}
                        footer={goodsMoInfo === 'add' ?
                            [<Button key="submit" type="primary" onClick={() => this.goodsOkShelves(1)}>
                                确定并上架
                        </Button>,
                            <Button onClick={() => this.goodsOkShelves(0)}>
                                保存至待上架
                        </Button>] :
                            [<Button key="submit" type="primary" onClick={() => this.sureChange()}>
                                确定修改
                        </Button>,
                            <Button key="back" type="primary" onClick={() => this.sureChange()}>
                                取消
                        </Button>]}
                        destroyOnClose={true}
                        bodyStyle={{ fontSize: '12px', padding: '10px', color: '#666666' }}
                        width={800}
                    >
                        <div className='goodsModalItem'>
                            <span className='gmiLabel'>商品分类</span>
                            <Select placeholder='请选择商品分类' style={{ width: 150 }}
                                defaultValue={goodsClassVal}
                                onChange={this.changeGoodsClass}>
                                {goodsClassDom}
                            </Select>
                        </div>
                        <div className='goodsModalItem'>
                            <span className='gmiLabel'>商品名称</span>
                            <Input placeholder='请输入项目名称' style={{ width: 250 }}
                                value={goodsName}
                                onChange={e => this.setState({ goodsName: e.target.value })}></Input>
                        </div>
                        <div className='goodsModalItem'>
                            <span className='gmiLabel'>关键词</span>
                            <Input placeholder='请输入关键字' style={{ width: 150, marginRight: 10 }}
                                value={goodsKey1}
                                onChange={e => this.setState({ goodsKey1: e.target.value })}></Input>
                            <Input placeholder='限三个关键字' style={{ width: 150, marginRight: 10 }}
                                value={goodsKey2}
                                onChange={e => this.setState({ goodsKey2: e.target.value })}></Input>
                            <Input placeholder='每个5字以内' style={{ width: 150 }}
                                value={goodsKey3}
                                onChange={e => this.setState({ goodsKey3: e.target.value })}></Input>
                        </div>
                        <div className='goodsModalImg'>
                            <span className='gmiLabel'>商品图片</span>
                            <Upload {...props} className='avatar-uploader'>
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
                        <div className='itemDirecte'>
                            <span className='gmiLabel'>产品详情</span>
                            <TextArea rows={6} style={{ width: '70%' }}
                                value={goodsRemarks}
                                onChange={e => this.setState({ goodsRemarks: e.target.value })} />
                        </div>

                        <div className='goodsModalItem'>
                            <div className='littleitem'>
                                <span className='littleLabel'>商品价格</span>
                                <Input placeholder='请输入价格'
                                    value={goodsPrice}
                                    onChange={e => this.setState({ goodsPrice: e.target.value })}></Input>
                            </div>
                            <div className='littleitem'>
                                <span className='littleLabel'>vip价格</span>
                                <Input placeholder='请输入vip价格'
                                    value={goodsVip}
                                    onChange={e => this.setState({ goodsVip: e.target.value })}></Input>
                            </div>
                            <div className='littleitem'>
                                <span className='littleLabel'>邮费</span>
                                <Input placeholder='不填或输入0即为包邮'
                                    value={goodsPostage}
                                    onChange={e => this.setState({ goodsPostage: e.target.value })}></Input>
                            </div>
                        </div>
                        <div className='goodsModalItem'>
                            <div className='littleitem'>
                                <span className='littleLabel'>销量</span>
                                <Input placeholder='请输入销量'
                                    value={goodsSales}
                                    onChange={e => this.setState({ goodsSales: e.target.value })}></Input>
                            </div>
                            <div className='littleitem'>
                                <span className='littleLabel'>库存</span>
                                <Input placeholder='请输入库存'
                                    value={goodsSku}
                                    onChange={e => this.setState({ goodsSku: e.target.value })}></Input>
                            </div>
                        </div>
                    </Modal>
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
                    <Modal
                        visible={stageVisible}
                        title={stageVisiInfo === 'add' ? "新增分期项目" : '修改分期项目'}
                        onOk={() => this.setState({ stageVisible: false })}
                        onCancel={() => this.setState({ stageVisible: false })}
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
                            <Select placeholder='' style={{ width: 150 }}
                                defaultValue={stageFenlei}
                                onChange={this.changeFenlei}>
                                {fenleiDom}
                            </Select>
                        </div>
                        <div className='goodsModalItem'>
                            <span className='gmiLabel'>项目名称</span>
                            <Input placeholder='请输入项目名称' style={{ width: 150 }}
                                value={stageName}
                                onChange={e => this.setState({ stageName: e.target.value })}></Input>
                        </div>
                        <div className='goodsModalItem'>
                            <span className='gmiLabel'>关键词</span>
                            <Input placeholder='请输入关键字' style={{ width: 150, marginRight: 10 }}
                                value={stageKeyWord}
                                onChange={e => this.setState({ stageKeyWord: e.target.value })}></Input>
                            {/* <Input placeholder='限三个关键字' style={{ width: 150, marginRight: 10 }}></Input>
                            <Input placeholder='每个5字以内' style={{ width: 150 }}></Input> */}
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
                                    onChange={e => this.setState({ stagePrice: e.target.value })}></Input>
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
                                <span className='littleLabel'>分期数上限</span>
                                <Input placeholder='请输入分期数上限'
                                    value={stageNumVal}
                                    onChange={e => this.setState({ stageNumVal: e.target.value})}></Input>
                            </div>
                            <div className='littleitem'>
                                <span className='littleLabel'>预付金额</span>
                                <Input placeholder=''
                                    value={stageAmount}
                                    onChange={e => this.setState({ stageAmount: e.target.value })}></Input>
                            </div>
                        </div>
                        <div style={{ width: '90%', margin: '0 auto' }} className='itemDirecte'>
                            <span className='gmiLabel'>产品详情</span>
                            <TextArea rows={6} style={{ width: '70%' }}
                                value={stageRemarks}
                                onChange={e => this.setState({ stageRemarks: e.target.value })} />
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
}

export default Goods