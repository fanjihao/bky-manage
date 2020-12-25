import React, { Component } from 'react'
import './Employee.css'
import { Input, Button, Table, Space, Popconfirm, Modal, Select, DatePicker, message, Upload, Avatar, notification } from 'antd'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import axios from '../../http/index'
import { UploadOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons'
const { Option } = Select

const nationArr = ["汉族", "蒙古族", "回族", "藏族", "维吾尔族", "苗族", "彝族", "壮族", "布依族", "朝鲜族", "满族", "侗族", "瑶族", "白族", "土家族",
    "哈尼族", "哈萨克族", "傣族", "黎族", "傈僳族", "佤族", "畲族", "高山族", "拉祜族", "水族", "东乡族", "纳西族", "景颇族", "柯尔克孜族",
    "土族", "达斡尔族", "仫佬族", "羌族", "布朗族", "撒拉族", "毛南族", "仡佬族", "锡伯族", "阿昌族", "普米族", "塔吉克族", "怒族", "乌孜别克族",
    "俄罗斯族", "鄂温克族", "德昂族", "保安族", "裕固族", "京族", "塔塔尔族", "独龙族", "鄂伦春族", "赫哲族", "门巴族", "珞巴族", "基诺族"]
export default class Employee extends Component {
    state = {
        detailVisible: false,
        whatDo: '',
        isLook: false,
        employNo: '', // 员工工号
        employId: '', // 员工身份证
        idWrong: false,
        telWrong: false,
        employSex: '', // 员工性别
        employMarital: '', // 员工婚姻状态
        employhomeAdd: '', // 员工户籍地址
        employName: '', // 员工名字
        employPhone: '', // 员工电话
        employBirth: '', // 员工生日
        employNation: '', // 员工民族
        employNowAdd: '', // 员工现居地址
        employSchool: '', // 员工毕业院校
        employHighest: '', // 员工最高学历
        employMajor: '', // 员工所学专业
        employGraduate: '', // 员工毕业时间
        employGrade: 'E', // 员工等级
        employGradeVal: 'E', // 员工等级
        name: '',
        phone: '',
        data: [],
        avatar: '',
        loading: true,
        // 员工底薪
        employSalary: 0
    }
    // 获取员工列表
    getEmploy = () => {
        let user = JSON.parse(localStorage.getItem('user'))
        const { name, phone } = this.state
        axios({
            url: '/merchantOrder/listStoreStaff',
            method: 'GET',
            params: {
                enterId: user.id,
                limit: 10,
                name: name,
                offset: 1,
                order: '',
                phone: phone,
            }
        })
            .then(res => {
                console.log('获取员工信息成功', res)
                if (res.data.data.list) {
                    let list = res.data.data.list
                    list.map((item, index) => {
                        item.key = index + 1
                    })
                    this.setState({
                        data: list,
                        loading: false
                    })
                }
            })
            .catch(err => {
                console.log('获取员工信息失败', err)
                message.error('查询员工列表失败')
            })
    }
    componentDidMount() {
        this.getEmploy()
    }
    setName = e => {
        this.setState({
            name: e.target.value
        })
    }
    setPhone = e => {
        this.setState({
            phone: e.target.value
        })
    }
    publicData = (type) => {
        const { employNo, employId, employSex, employMarital, employhomeAdd,
            employName, employPhone, employBirth, employNation, employNowAdd,
            employSchool, employHighest, employMajor, employGraduate, avatar,
            employGrade, employSalary } = this.state

        let user = JSON.parse(localStorage.getItem('user'))
        let formData = new FormData()
        formData.append("staffName", employName)
        formData.append("storeId", user.systemStoreId)
        formData.append("phone", employPhone)
        formData.append("idCard", employId)
        formData.append("sex", employSex)
        formData.append("birth", employBirth)
        formData.append("maritalStatus", employMarital)
        formData.append("nation", employNation)
        formData.append("address", employhomeAdd)
        formData.append("currentAddress", employNowAdd)
        formData.append("graduateSchool", employSchool)
        formData.append("major", employMajor)
        formData.append("education", employHighest)
        formData.append("avatar", avatar)
        formData.append("graduationTime", employGraduate)
        formData.append("grade", employGrade)
        formData.append('salary', Number(employSalary))
        formData.append('enterId', user.id)
        if (type === 'edit') {
            formData.append("id", employNo)
        }
        return formData
    }
    cleanInfo = () => {
        this.setState({
            employNo: '', // 员工工号
            employId: '', // 员工身份证
            idWrong: false,
            telWrong: false,
            employSex: '', // 员工性别
            employMarital: '', // 员工婚姻状态
            employName: '', // 员工名字
            employPhone: '', // 员工电话
            employBirth: '', // 员工生日
            employNowAdd: '', // 员工现居地址
            employGrade: 'E', // 员工等级
            employGradeVal: '', // 员工等级
            avatar: '',
            employSexVal: ''
        })
    }
    // 添加员工
    addEmploy = () => {
        let formData = this.publicData()
        const { employId, employSex, employName, employPhone, employNowAdd, employGrade } = this.state
        if (employSex === '' || employName === '' || employPhone === '' || employNowAdd === ''
            || employGrade === '' || employId === '') {
            notification.open({
                message: '提示',
                duration: 3,
                description:
                    '*号为必填字段，不能为空，请您检查后再确认',
                style: {
                    color: "red"
                },
                onClick: () => {
                    console.log('Notification Clicked!');
                },
            })
        } else {
            axios({
                url: '/merchantOrder/addStaff',
                method: 'POST',
                data: formData
            })
                .then(res => {
                    console.log('添加员工成功', res)
                    if (res.data.status === 200) {
                        this.setState({
                            detailVisible: false,
                            loading: true,
                            employNo: '', // 员工工号
                            employId: '', // 员工身份证
                            idWrong: false,
                            telWrong: false,
                            employSex: '', // 员工性别
                            employMarital: '', // 员工婚姻状态
                            employhomeAdd: '', // 员工户籍地址
                            employName: '', // 员工名字
                            employPhone: '', // 员工电话
                            employBirth: '', // 员工生日
                            employNation: '', // 员工民族
                            employNowAdd: '', // 员工现居地址
                            employSchool: '', // 员工毕业院校
                            employHighest: '', // 员工最高学历
                            employMajor: '', // 员工所学专业
                            employGraduate: '', // 员工毕业时间
                            employGrade: '', // 员工等级
                            employGradeVal: '', // 员工等级
                            avatar: '',
                        }, () => {
                            this.getEmploy()
                        })
                    }
                })
                .catch(err => {
                    console.log('添加员工失败', err)
                    message.error('添加失败')
                })
        }
    }
    // 气泡取消
    cancel = () => {
        console.log('取消删除')
    }
    // 气泡删除
    confirm = (re) => {
        console.log('确认删除', re)
    }
    // 员工详情
    employDetail = (what, item) => {
        if (what === 'add') {
            this.setState({
                whatDo: '添加员工',
                detailVisible: true,
                isLook: false,
                employGradeVal: 'E'
            })
        } else if (what === 'look') {
            let sex, marital
            if (item.sex === 1) {
                sex = '男'
            } else {
                sex = '女'
            }
            if (item.maritalStatus === 1) {
                marital = '未婚'
            } else {
                marital = '已婚'
            }
            console.log(item)
            this.setState({
                whatDo: '查看',
                detailVisible: true,
                isLook: true,
                employNo: item.id, // 员工工号
                employId: item.idCard, // 员工身份证
                employSexVal: sex, // 员工性别
                employMaritalVal: marital, // 员工婚姻状态
                employhomeAdd: item.address, // 员工户籍地址
                employName: item.staffName, // 员工名字
                employPhone: item.phone, // 员工电话
                employBirth: item.birth, // 员工生日
                employNation: item.nation, // 员工民族
                employNowAdd: item.currentAddress, // 员工现居地址
                employSchool: item.graduateSchool, // 员工毕业院校
                employHighest: item.education, // 员工最高学历
                employMajor: item.major, // 员工所学专业
                employGraduate: item.graduationTime, // 员工毕业时间
                avatar: item.avatar,
                employGrade: item.grade,
                employGradeVal: item.grade,
                employSalary: item.salary
            })
        } else {
            let sex, maritalStatus
            if (item.sex === 1) {
                sex = '男'
            } else {
                sex = '女'
            }
            if (item.maritalStatus === 1) {
                maritalStatus = '未婚'
            } else {
                maritalStatus = '已婚'
            }
            this.setState({
                whatDo: '修改',
                detailVisible: true,
                isLook: false,
                employNo: item.id, // 员工工号
                employId: item.idCard, // 员工身份证
                employSex: item.sex,
                employMarital: item.maritalStatus,
                employSexVal: sex, // 员工性别
                employMaritalVal: maritalStatus, // 员工婚姻状态
                employhomeAdd: item.address, // 员工户籍地址
                employName: item.staffName, // 员工名字
                employPhone: item.phone, // 员工电话
                employBirth: item.birth, // 员工生日
                employNation: item.nation, // 员工民族
                employNowAdd: item.currentAddress, // 员工现居地址
                employSchool: item.graduateSchool, // 员工毕业院校
                employHighest: item.education, // 员工最高学历
                employMajor: item.major, // 员工所学专业
                employGraduate: item.graduationTime, // 员工毕业时间
                avatar: item.avatar,
                employGrade: item.grade,
                employGradeVal: item.grade,
                employSalary: item.salary
            })
        }
    }
    // 改变性别
    sexChange = (val, label) => {
        this.setState({
            employSex: val
        })
    }
    // 婚姻状况
    maritalChange = (val) => {
        this.setState({
            employMarital: val
        })
    }
    nationChange = (val) => {
        this.setState({
            employNation: val
        })
    }
    educateChange = (val) => {
        this.setState({
            employHighest: val
        })
    }
    // 修改员工信息
    changeStaff = () => {
        let data = this.publicData('edit')
        const { employId, employSex, employName, employPhone, employNowAdd, avatar, employGrade, employSalary } = this.state
        if (employSex === '' || employName === '' || employPhone === '' || employNowAdd === ''
            || employGrade === '' || employId === '') {
            notification.open({
                message: '提示',
                duration: 3,
                description:
                    '*号为必填字段，不能为空，请您检查后再确认',
                style: {
                    color: "red"
                },
                onClick: () => {
                    console.log('Notification Clicked!');
                },
            })
        } else {
            axios({
                url: '/merchantOrder/updateStaff',
                method: 'POST',
                data: data
            })
                .then(res => {
                    console.log('修改员工信息成功', res)
                    if (res.data.status === 200) {
                        message.success('修改成功')
                        this.setState({
                            detailVisible: false,
                            loading: true
                        }, () => {
                            this.getEmploy()
                            this.cleanInfo()
                        })
                    }
                })
                .catch(err => {
                    console.log('修改员工信息失败', err)
                    message.error('修改失败')
                })
        }
    }
    // 删除员工
    restore = id => {
        const merId = JSON.parse(localStorage.getItem('user')).id
        axios({
            url: `/merchantOrder/removeStaff?merId=${merId}`,
            method: 'DELETE',
            data: {
                id: id
            }
        })
            .then(res => {
                console.log('删除员工成功', res)
                if (res.data.status === 200) {
                    message.success(res.data.message)
                } else {
                    message.error(res.data.message)
                }
                // this.getEmploy()
            })
            .catch(err => {
                console.log('删除员工失败')
                message.error('删除失败')
            })
    }
    // 员工工号
    setNo = (e, i) => {
        if (i === 'no') {
            this.setState({
                employNo: e.target.value
            })
        } else if (i === 'id') {
            this.setState({
                employId: e.target.value
            }, () => {
                if (!(/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.state.employId))) {
                    this.setState({
                        idWrong: true,
                    })
                } else {
                    this.setState({
                        idWrong: false
                    }, () => {
                        let year = this.state.employId.slice(6, 10)
                        let month = this.state.employId.slice(10, 12)
                        let day = this.state.employId.slice(12, 14)
                        this.setState({
                            employBirth: year + '-' + month + '-' + day
                        })
                    })
                }
            })
        } else if (i === 'home') {
            this.setState({
                employhomeAdd: e.target.value
            })
        } else if (i === 'name') {
            this.setState({
                employName: e.target.value
            })
        } else if (i === 'phone') {
            this.setState({
                employPhone: e.target.value
            }, () => {
                if (!(/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.state.employPhone))) {
                    this.setState({
                        telWrong: true,
                    })
                } else {
                    this.setState({
                        telWrong: false
                    })
                }
            })
        } else if (i === 'now') {
            this.setState({
                employNowAdd: e.target.value
            })
        } else if (i === 'school') {
            this.setState({
                employSchool: e.target.value
            })
        } else if (i === 'major') {
            this.setState({
                employMajor: e.target.value
            })
        }
    }
    onChange = (which, date, dateString) => {
        if (which === '毕业时间') {
            this.setState({
                employGraduate: dateString
            })
        }
    }
    // 选择员工等级
    gradeChange = (val, i) => {
        this.setState({
            employGrade: val,
            employGradeVal: i.label
        })
    }
    render() {
        let nationDom = nationArr.map((item, index) => {
            return <Option value={item} key={index}>{item}</Option>
        })
        const columns = [
            {
                title: '员工编号',
                dataIndex: 'key',
                key: 'key',
                align: 'center'
            },
            {
                title: '员工姓名',
                dataIndex: 'staffName',
                key: 'staffName',
                render: (text, record) => <span>{text}</span>,
                align: 'center'
            },
            {
                title: '员工等级',
                dataIndex: 'grade',
                key: 'grade',
                render: src => {
                    return (
                        <span>{src + '级'}</span>
                    )
                },
                align: 'center'
            },
            {
                title: '手机号',
                dataIndex: 'phone',
                key: 'phone',
                render: (text, record) => <span>{text.substr(0, 3) + '****' + text.substr(7)}</span>,
                align: 'center'
            },
            {
                title: '身份证号码',
                dataIndex: 'idCard',
                key: 'idCard',
                render: (text, record) =>
                    <span>{text.substr(0, 6) + '********'}</span>,
                align: 'center'
            },
            {
                title: '性别',
                dataIndex: 'sex',
                key: 'sex',
                render: (text, record) =>
                    text === 1
                        ? <span>男</span>
                        : <span>女</span>,
                align: 'center'
            },
            {
                title: '现居住地址',
                key: 'currentAddress',
                dataIndex: 'currentAddress',
                render: (text, record) =>
                    record.state === '停用'
                        ? <span style={{ color: '#999' }}>{text}</span>
                        : <span>{text}</span>,
                align: 'center'
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => {
                    return (
                        <Space>
                            {/* <a style={{ color: '#13CE66' }} onClick={() => this.employDetail('look', record)}>查看详细</a> */}
                            <Button type="primary" onClick={() => this.employDetail('edit', record)}>编辑</Button>
                            <Popconfirm
                                title="请您确认是否删除该员工?"
                                onConfirm={() => this.restore(record.id)}
                                onCancel={this.cancel}
                                okText="是"
                                cancelText="否"
                            >
                                <Button type="primary" danger>删除</Button>
                            </Popconfirm>
                        </Space>
                    )
                },
                align: 'center'
            },
        ]
        const { detailVisible, whatDo, isLook, employId,
            employSexVal, employName, employPhone, employBirth,
            employNowAdd, employGradeVal, name, loading,
            data, idWrong, telWrong, employSalary } = this.state
        let modalFootDom
        if (whatDo === '修改') {
            modalFootDom = <Button key="submit" type="primary" onClick={() => this.changeStaff()}>
                确认修改
            </Button>
        } else if (whatDo === '添加员工') {
            modalFootDom =
                <Button key="submit" type="primary" onClick={this.addEmploy}>
                    确认
                </Button>
        } else {
            modalFootDom = null
        }
        let _that = this
        const props = {
            name: 'file',
            action: 'http://47.108.174.202:8009/api/upload/files-upload',
            listType: 'picture',
            headers: {
                authorization: 'authorization-text',
                Content_Type: 'multipart/form-data'
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log('上传的文件', info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 上传成功`);
                    let _src = info.fileList[0].response.data
                    _that.setState({
                        avatar: 'https://www.bkysc.cn/api/files-upload/' + _src
                    })
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败.`);
                }
            },
        }
        return (
            <div className='employee'>
                <div className='emHeaderTop'>
                    <span>员工管理</span>
                </div>
                <div className='emHeaderBody'>
                    <div className='emTableTop'>
                        <Input style={{ width: 150, margin: '0 20px' }}
                            placeholder='请输入姓名搜索'
                            value={name}
                            onChange={e => this.setName(e)}></Input>

                        <div className='search-btn' onClick={() => this.setState({ loading: true }, () => {
                            if (name === '') {
                                message.warning('请先输入搜索内容!')
                                this.setState({ loading: false })
                            } else {
                                this.getEmploy()
                            }
                        })}>
                            <SearchOutlined />搜索
                        </div>
                        <div className='add-btn' onClick={() => this.employDetail('add', 0)}>
                            <PlusOutlined />新增员工
                        </div>
                    </div>
                    <div style={{ width: '100%' }}>
                        <Table columns={columns}
                            dataSource={data}
                            style={{ textAlign: 'center' }}
                            pagination={{ pageSize: 10, position: ['bottomLeft'] }}
                            loading={loading}
                            locale={{ emptyText: '暂无数据' }} />
                    </div>
                </div>
                <Modal
                    visible={detailVisible}
                    title={whatDo}
                    onOk={this.handleOk}
                    onCancel={() => this.setState({ detailVisible: false }, () => this.cleanInfo())}
                    footer={modalFootDom}
                    destroyOnClose={true}
                    bodyStyle={{ fontSize: '12px', fontWeight: 'bold', padding: '10px', color: '#666666' }}
                    width={800}
                    maskClosable={false}
                >
                    <div className='modalItem'>
                        <span style={{ color: '#1089EB', marginLeft: 30 }}>基本信息</span>
                    </div>
                    <div className='modalBody'>
                        <div className='modalBodyChild'>
                            <div className='embLabel'>
                                <span><span style={{ color: 'red' }}>*</span>员工姓名</span>
                                <Input placeholder='请输入员工姓名' disabled={isLook}
                                    value={employName}
                                    onChange={e => this.setNo(e, 'name')}></Input>
                            </div>

                            <div className='embLabel'>
                                <span><span style={{ color: 'red' }}>*</span>手机号码</span>
                                <Input placeholder='请输入员工手机号码' disabled={isLook}
                                    value={employPhone}
                                    onChange={e => this.setNo(e, 'phone')}
                                    style={{ borderColor: telWrong ? 'red' : null }}></Input>
                            </div>

                            <div className='embLabel'>
                                <span><span style={{ color: 'red' }}>*</span>员工等级</span>
                                <Select style={{ width: '60%' }} disabled={isLook}
                                    defaultValue={employGradeVal}
                                    placeholder='请选择等级'
                                    onChange={this.gradeChange}
                                >
                                    <Option value={'A'} key='1'>A</Option>
                                    <Option value={'B'} key='2'>B</Option>
                                    <Option value={'C'} key='3'>C</Option>
                                    <Option value={'D'} key='4'>D</Option>
                                    <Option value={'E'} key='5'>E</Option>
                                </Select>
                            </div>

                            <div className='embLabel'>
                                <span><span style={{ color: 'red' }}>*</span>现居地址</span>
                                <Input placeholder='请输入现在居住地址' disabled={isLook}
                                    value={employNowAdd}
                                    onChange={e => this.setNo(e, 'now')}></Input>
                            </div>

                        </div>

                        <div className='modalBodyChild'>
                            <div className='embLabel'>
                                <span><span style={{ color: 'red' }}>*</span>身份证号</span>
                                <Input placeholder='请输入身份证号' disabled={isLook}
                                    value={employId}
                                    onChange={e => this.setNo(e, 'id')}
                                    style={{ borderColor: idWrong ? 'red' : null }}></Input>
                            </div>

                            <div className='embLabel'>
                                <span>出生日期</span>
                                <Input
                                    value={employBirth}
                                    disabled={true}
                                    style={{ width: '60%' }} />
                            </div>

                            <div className='embLabel'>
                                <span><span style={{ color: 'red' }}>*</span>性别</span>
                                <Select style={{ width: '60%' }} disabled={isLook}
                                    placeholder='请选择性别' defaultValue={employSexVal}
                                    onChange={this.sexChange}>
                                    <Option value={1} label='男' key={1}>男</Option>
                                    <Option value={2} label='女' key={2}>女</Option>
                                </Select>
                            </div>

                            <div className='embLabel'>
                                <span>员工底薪</span>
                                <Input
                                    disabled={isLook}
                                    value={employSalary}
                                    style={{ width: '60%' }}
                                    onChange={e => this.setState({ employSalary: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}