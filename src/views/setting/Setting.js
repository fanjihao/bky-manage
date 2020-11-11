import React, { Component } from 'react'
import './Setting.css'
import {
    Button, Input, Upload,message
    // Modal
} from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import axios from '../../http/index'
import bankCardAttribution from '../../component/bankCard'

class Setting extends Component {
    state = {
        disabled: true,
        merchantDetailInfo:
        {
            // 注册地址
            province: null,
            city: null,
            district: null,
            // 门店地址
            address: null,
            // 商户名称
            merchantName: null,
            // 成立日期
            addTime: null,
            // 统一社会信用代码
            creditCode: null,
            // 营业期限
            businessTerm: null,
            // 注册资本
            registeredCapital: 0,
            // 法人
            legalPerson: null,
            // 法人身份证号
            idCard: null,
            // 法人手机号
            phone: null,
            // 法人身份证人像面
            humanFace: null,
            // 法人身份证国徽面
            nationalEmblem: null,
            // 营业执照照片
            licensePhoto: null,
            // 开户许可证照片
            accountPhote: null,
            // 收款账户类型
            collectionType: null,
            // 账户名称
            collectionName: null,
            // 开户身份证号
            openCard: null,
            // 账户卡号
            accountNo: null,
            // 预留手机号
            reservePhone: null,
            // 营业时间
            businessTime: null,
            // 门店名称
            name: null,
            // 门店招牌照片
            signboardPhoto: null,
            // 门店内景照片
            storePhoto: null,
            // 门店街景照片
            instaPlacePhoto: null,
            // 其他照片
            otherPhoto: null,
            // 年销售量
            annualSales: 0,
            // 年销售额
            salesVolume: 0,
            // 负责人姓名
            personCharge: null,
            // 负责人身份证号
            personCard: null,
            // 负责人电话
            personPhone: null,
            // 门店ID
            systemStoreId: null,
            // 
            onlineMoeny: 0,
            stagesMoeny: 0,
            // 商户昵称
            nickname: null,
            // 商户头像
            avatar: null,
            // 商户性质
            natureMerchant: null,
            // 账户银行
            depositBank: null
        },
        editStatus: false,
        modalImage: null,
        showModal: false
    }
    // 查询商户详细信息
    getUserInfo = id => {

        axios({
            method: 'GET',
            url: `/merchantOrder/merchantDetails?id=${id}`,
        })
            .then(res => {
                // console.log('商户信息', res.data)
                this.setState({ merchantDetailInfo: res.data })
            })
            .catch(err => {
                console.log('失败', err)
            })
    }
    componentDidMount() {
        console.log('信息', this.props.userInfo)
        console.log(bankCardAttribution('6215584402021608328'))
        const id = JSON.parse(localStorage.getItem('user')).id
        this.getUserInfo(id)
    }
    // 修改信息按钮
    edit = () => {
        this.setState({
            editStatus: true,
            disabled: false
        })
    }
    // 取消修改按钮
    cancel = () => {
        this.setState({
            editStatus: false,
            disabled: true
        })
    }
    // 保存修改
    save = () => {
        const { merchantDetailInfo } = this.state
        // console.log('修改的信息', merchantDetailInfo)
        axios({
            method: 'POST',
            url: '/merchantOrder/updateUserEnter',
            data: {
                // 营业期限
                businessTerm: merchantDetailInfo.businessTerm,
                // 法人
                legalPerson: merchantDetailInfo.legalPerson,
                // 法人身份证号
                idCard: merchantDetailInfo.idCard,
                // 法人手机号
                phone: merchantDetailInfo.phone,
                // 法人身份证人像面
                humanFace: merchantDetailInfo.humanFace,
                // 法人身份证国徽面
                nationalEmblem: merchantDetailInfo.nationalEmblem,
                // 营业执照照片
                licensePhoto: merchantDetailInfo.licensePhoto,
                // 开户许可证照片
                accountPhote: merchantDetailInfo.accountPhote,
                // 收款账户类型
                collectionType: merchantDetailInfo.collectionType,
                // 账户名称
                collectionName: merchantDetailInfo.collectionName,
                // 开户身份证号
                openCard: merchantDetailInfo.openCard,
                // 账户卡号
                accountNo: merchantDetailInfo.accountNo,
                // 预留手机号
                reservePhone: merchantDetailInfo.reservePhone,
                // 营业时间
                businessTime: merchantDetailInfo.businessTime,
                // 门店名称
                name: merchantDetailInfo.name,
                // 门店招牌照片
                signboardPhoto: merchantDetailInfo.signboardPhoto,
                // 门店内景照片
                storePhoto: merchantDetailInfo.storePhoto,
                // 门店街景照片
                instaPlacePhoto: merchantDetailInfo.instaPlacePhoto,
                // 其他照片
                otherPhoto: merchantDetailInfo.otherPhoto,
                // 负责人姓名
                personCharge: merchantDetailInfo.personCharge,
                // 负责人身份证号
                personCard: merchantDetailInfo.personCard,
                // 负责人电话
                personPhone: merchantDetailInfo.personPhone,
                // 账户银行
                depositBank: merchantDetailInfo.depositBank,
                // 商户id
                id: JSON.parse(localStorage.getItem('user')).id,
                systemStoreId: JSON.parse(localStorage.getItem('user')).systemStoreId
            }
        })
            .then(res => {
                console.log('修改成功', res.data)
                if(res.data.status === 200){
                    message.success('修改信息成功')
                }else{
                    message.error('修改信息失败')
                }
                this.setState({
                    editStatus: false,
                    disabled: true
                })
            })
            .catch(err => {
                console.log('修改失败', err)
                message.error('修改信息失败')
            })
    }
    // 上传营业执照照片
    licensePhotoUpload = info => {
        const res = info.fileList[0].response
        if (res) {
            this.setState({
                merchantDetailInfo: {
                    ...this.state.merchantDetailInfo,
                    licensePhoto: 'https://www.bkysc.cn/api/files-upload/' + res.data
                }
            })
        }
    }
    // 上传法人身份证人像面
    humanFaceUpload = info => {
        const res = info.fileList[0].response
        if (res) {
            this.setState({
                merchantDetailInfo: {
                    ...this.state.merchantDetailInfo,
                    humanFace: 'https://www.bkysc.cn/api/files-upload/' + res.data
                }
            })
        }
    }
    // 上传开户许可证照片
    accountPhoteUpload = info => {
        const res = info.fileList[0].response
        if (res) {
            this.setState({
                merchantDetailInfo: {
                    ...this.state.merchantDetailInfo,
                    accountPhote: 'https://www.bkysc.cn/api/files-upload/' + res.data
                }
            })
        }
    }
    // 上传法人身份证国徽面
    nationalEmblemUpload = info => {
        const res = info.fileList[0].response
        if (res) {
            this.setState({
                merchantDetailInfo: {
                    ...this.state.merchantDetailInfo,
                    nationalEmblem: 'https://www.bkysc.cn/api/files-upload/' + res.data
                }
            })
        }
    }

    // // 图片预览
    // previewHandle = type => {
    //     console.log(type)
    // }

    // 上传门店招牌照片
    signboardPhotoUpload = info => {
        const res = info.fileList[0].response
        if (res) {
            this.setState({
                merchantDetailInfo: {
                    ...this.state.merchantDetailInfo,
                    signboardPhoto: 'https://www.bkysc.cn/api/files-upload/' + res.data
                }
            })
        }
    }
    // 上传门店街景照片
    instaPlacePhotoUpload = info => {
        const res = info.fileList[0].response
        if (res) {
            this.setState({
                merchantDetailInfo: {
                    ...this.state.merchantDetailInfo,
                    instaPlacePhoto: 'https://www.bkysc.cn/api/files-upload/' + res.data
                }
            })
        }
    }
    // 上传门店内景照片
    storePhotoUpload = info => {
        const res = info.fileList[0].response
        if (res) {
            this.setState({
                merchantDetailInfo: {
                    ...this.state.merchantDetailInfo,
                    storePhoto: 'https://www.bkysc.cn/api/files-upload/' + res.data
                }
            })
        }
    }
    // 上传其他照片
    otherPhotoUpload = info => {
        const res = info.fileList[0].response
        if (res) {
            this.setState({
                merchantDetailInfo: {
                    ...this.state.merchantDetailInfo,
                    otherPhoto: 'https://www.bkysc.cn/api/files-upload/' + res.data
                }
            })
        }
    }

    // 时间戳转换
    formatTime = (time) => {
        let newMonth, newDay
        // newMin, newSec, newHours
        let date = new Date(time * 1000)
        // console.log(date, time)
        let newYear = date.getFullYear()
        let month = date.getMonth() + 1;
        if (month < 10) {
            newMonth = '0' + month
        } else { newMonth = month }
        let day = date.getDate();
        if (day < 10) {
            newDay = '0' + day
        } else { newDay = day }
        // let hours = date.getHours();
        // if (hours < 10) {
        //     newHours = '0' + hours
        // } else { newHours = hours }
        // let minutes = date.getMinutes();
        // if (minutes < 10) {
        //     newMin = '0' + minutes
        // } else { newMin = minutes }
        // let seconds = date.getSeconds();
        // if (seconds < 10) {
        //     newSec = '0' + seconds
        // } else { newSec = seconds }
        return newYear + '-' + newMonth + '-' + newDay 
    }

    render() {
        const { merchantDetailInfo, disabled, editStatus,
            // modalImage, showModal 
        } = this.state
        const uploadButton = <PlusOutlined />
        return (
            <div className='setting'>
                <div className='setHeaderTop'>
                    <span>设置</span>
                </div>

                {/* <Modal
                    visible={showModal}
                    onCancel={() => this.setState({showModal: false})}
                >
                    <img alt="previewImg" style={{ width: 300 }} src={modalImage} />
                </Modal> */}

                {
                    editStatus === false
                        ? <div className='setHeaderBody'>
                            <Button size='large' type="primary" onClick={this.edit} className='saveEditBtn'>修改</Button>
                        </div>
                        : <div className='setHeaderBody'>
                            <Button size='large' type="primary" className='saveEditBtn' onClick={this.save}>保存修改</Button>
                            <Button size='large' className='shBodyBtn' onClick={this.cancel}>取消</Button>
                        </div>
                }
                <div className='settingBody'>
                    <div className='settingSection'>
                        <div className='sectionTitle'>
                            <span style={{ color: '#1089EB' }}>商户资料</span>
                        </div>
                        <div className='sectionBody'>
                            <div className='sbodyForm'>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>商户名称</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <span>{merchantDetailInfo.merchantName}</span>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>年销售额</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <span>{merchantDetailInfo.salesVolume}</span>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>统一社会信用代码</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <span>{merchantDetailInfo.creditCode}</span>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>注册地址</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <span>{merchantDetailInfo.province + merchantDetailInfo.city + merchantDetailInfo.district}</span>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>法定代表人</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input value={merchantDetailInfo.legalPerson}
                                            disabled={disabled}
                                            onChange={e => this.setState({
                                                merchantDetailInfo: {
                                                    ...this.state.merchantDetailInfo,
                                                    legalPerson: e.target.value
                                                }
                                            })} />
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>法人手机号</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input value={merchantDetailInfo.phone}
                                            disabled={disabled}
                                            onChange={e => this.setState({
                                                merchantDetailInfo: {
                                                    ...this.state.merchantDetailInfo,
                                                    phone: e.target.value
                                                }
                                            })} />
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>营业执照照片</span>
                                    </div>
                                    <div className='formItemImg'>
                                        <Upload
                                            // name="avatar" 
                                            disabled={disabled}
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action="http://47.108.174.202:9010/upload/files-upload"
                                            // beforeUpload={beforeUpload}
                                            onChange={this.licensePhotoUpload}
                                        >
                                            {
                                                merchantDetailInfo.licensePhoto
                                                    ? <img src={merchantDetailInfo.licensePhoto} alt="photos" className='fItemConimg' />
                                                    : uploadButton
                                            }
                                        </Upload>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>法人身份证人像面</span>
                                    </div>
                                    <div className='formItemImg'>
                                        <Upload
                                            // name="avatar" 
                                            disabled={disabled}
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action="http://47.108.174.202:9010/upload/files-upload"
                                            // beforeUpload={beforeUpload}
                                            onChange={this.humanFaceUpload}
                                        >
                                            {
                                                merchantDetailInfo.humanFace
                                                    ? <img src={merchantDetailInfo.humanFace} alt="photos" className='fItemConimg' />
                                                    : uploadButton
                                            }
                                        </Upload>
                                    </div>
                                </div>
                            </div>
                            <div className='sbodyForm'>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>年销售量</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <span>{merchantDetailInfo.annualSales}</span>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>商户性质</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <span>{merchantDetailInfo.natureMerchant}</span>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>成立日期</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <span>{this.formatTime(merchantDetailInfo.addTime)}</span>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>注册资本</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <span>{merchantDetailInfo.registeredCapital}万</span>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>法人身份证号</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input value={merchantDetailInfo.idCard}
                                            disabled={disabled}
                                            onChange={e => this.setState({
                                                merchantDetailInfo: {
                                                    ...this.state.merchantDetailInfo,
                                                    idCard: e.target.value
                                                }
                                            })} />
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>营业期限</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input value={merchantDetailInfo.businessTerm}
                                            disabled={disabled}
                                            onChange={e => this.setState({
                                                merchantDetailInfo: {
                                                    ...this.state.merchantDetailInfo,
                                                    businessTerm: e.target.value
                                                }
                                            })} />
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>开户许可证照片</span>
                                    </div>
                                    <div className='formItemImg'>
                                        <Upload
                                            // name="avatar" 
                                            disabled={disabled}
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action="http://47.108.174.202:9010/upload/files-upload"
                                            // beforeUpload={beforeUpload}
                                            onChange={this.accountPhoteUpload}
                                        >
                                            {merchantDetailInfo.accountPhote
                                                ? <img src={merchantDetailInfo.accountPhote} alt="photos" className='fItemConimg' />
                                                : uploadButton}
                                        </Upload>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>法人身份证国徽面</span>
                                    </div>
                                    <div className='formItemImg'>
                                        <Upload
                                            // name="avatar" 
                                            disabled={disabled}
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action="http://47.108.174.202:9010/upload/files-upload"
                                            // beforeUpload={beforeUpload}
                                            onChange={this.nationalEmblemUpload}
                                        >
                                            {merchantDetailInfo.nationalEmblem
                                                ? <img src={merchantDetailInfo.nationalEmblem} alt="photos" className='fItemConimg' />
                                                : uploadButton}
                                        </Upload>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='settingSection'>
                        <div className='sectionTitle'>
                            <span style={{ color: '#1089EB' }}>账户信息</span>
                        </div>
                        <div className='sectionBody'>
                            <div className='sbodyForm'>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>收款账户类型</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input value={bankCardAttribution(merchantDetailInfo.accountNo).cardTypeName}
                                            disabled={true} />
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>开户身份证号</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input value={merchantDetailInfo.openCard}
                                            disabled={disabled}
                                            onChange={e => this.setState({
                                                merchantDetailInfo: {
                                                    ...this.state.merchantDetailInfo,
                                                    openCard: e.target.value
                                                }
                                            })} />
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>账户卡号</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input value={merchantDetailInfo.accountNo}
                                            disabled={disabled}
                                            onChange={e => this.setState({
                                                merchantDetailInfo: {
                                                    ...this.state.merchantDetailInfo,
                                                    accountNo: e.target.value
                                                }
                                            })} />
                                    </div>
                                </div>
                            </div>
                            <div className='sbodyForm'>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>账户名称</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input value={merchantDetailInfo.collectionName}
                                            disabled={disabled}
                                            onChange={e => this.setState({
                                                merchantDetailInfo: {
                                                    ...this.state.merchantDetailInfo,
                                                    collectionName: e.target.value
                                                }
                                            })} />
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>账户银行</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input value={bankCardAttribution(merchantDetailInfo.accountNo).bankName}
                                            disabled={true} />
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>预留手机号</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input value={merchantDetailInfo.reservePhone}
                                            disabled={disabled}
                                            onChange={e => this.setState({
                                                merchantDetailInfo: {
                                                    ...this.state.merchantDetailInfo,
                                                    reservePhone: e.target.value
                                                }
                                            })} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='settingSection'>
                        <div className='sectionTitle'>
                            <span style={{ color: '#1089EB' }}>门店资料</span>
                        </div>
                        <div className='sectionBody'>
                            <div className='sbodyForm'>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>门店名称</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input value={merchantDetailInfo.name}
                                            disabled={disabled}
                                            onChange={e => this.setState({
                                                merchantDetailInfo: {
                                                    ...this.state.merchantDetailInfo,
                                                    name: e.target.value
                                                }
                                            })} />
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>门店招牌照片</span>
                                    </div>
                                    <div className='formItemImg'>
                                        <Upload
                                            // name="avatar" 
                                            disabled={disabled}
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action="http://47.108.174.202:9010/upload/files-upload"
                                            // onPreview={() => this.previewHandle('signboardPhoto')}
                                            // beforeUpload={beforeUpload}
                                            onChange={this.signboardPhotoUpload}
                                        >
                                            {merchantDetailInfo.signboardPhoto
                                                ? <img src={merchantDetailInfo.signboardPhoto} alt="photos" className='fItemConimg' />
                                                : uploadButton}
                                        </Upload>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>门店街景照片</span>
                                    </div>
                                    <div className='formItemImg'>
                                        <Upload
                                            // name="avatar" 
                                            disabled={disabled}
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action="http://47.108.174.202:9010/upload/files-upload"
                                            // beforeUpload={beforeUpload}
                                            onChange={this.instaPlacePhotoUpload}
                                        >
                                            {merchantDetailInfo.instaPlacePhoto
                                                ? <img src={merchantDetailInfo.instaPlacePhoto} alt="photos" className='fItemConimg' />
                                                : uploadButton}
                                        </Upload>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>负责人姓名</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input value={merchantDetailInfo.personCharge}
                                            disabled={disabled}
                                            onChange={e => this.setState({
                                                merchantDetailInfo: {
                                                    ...this.state.merchantDetailInfo,
                                                    personCharge: e.target.value
                                                }
                                            })} />
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>负责人电话</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input value={merchantDetailInfo.personPhone}
                                            disabled={disabled}
                                            onChange={e => this.setState({
                                                merchantDetailInfo: {
                                                    ...this.state.merchantDetailInfo,
                                                    personPhone: e.target.value
                                                }
                                            })} />
                                    </div>
                                </div>
                            </div>
                            <div className='sbodyForm'>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>营业时间</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input value={merchantDetailInfo.businessTime}
                                            disabled={disabled}
                                            onChange={e => this.setState({
                                                merchantDetailInfo: {
                                                    ...this.state.merchantDetailInfo,
                                                    businessTime: e.target.value
                                                }
                                            })} />
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>门店内景照片</span>
                                    </div>
                                    <div className='formItemImg'>
                                        <Upload
                                            // name="avatar" 
                                            disabled={disabled}
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action="http://47.108.174.202:9010/upload/files-upload"
                                            // beforeUpload={beforeUpload}
                                            onChange={this.storePhotoUpload}
                                        >
                                            {merchantDetailInfo.storePhoto
                                                ? <img src={merchantDetailInfo.storePhoto} alt="photos" className='fItemConimg' />
                                                : uploadButton}
                                        </Upload>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>其他照片</span>
                                    </div>
                                    <div className='formItemImg'>
                                        <Upload
                                            // name="avatar" 
                                            disabled={disabled}
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action="http://47.108.174.202:9010/upload/files-upload"
                                            // beforeUpload={beforeUpload}
                                            onChange={this.otherPhotoUpload}
                                        >
                                            {merchantDetailInfo.otherPhoto
                                                ? <img src={merchantDetailInfo.otherPhoto} alt="photos" className='fItemConimg' />
                                                : uploadButton}
                                        </Upload>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>负责人身份证号</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input value={merchantDetailInfo.personCard}
                                            disabled={disabled}
                                            onChange={e => this.setState({
                                                merchantDetailInfo: {
                                                    ...this.state.merchantDetailInfo,
                                                    personCard: e.target.value
                                                }
                                            })} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        userInfo: state.userReducer.user
    }
}

export default connect(mapStateToProps)(Setting)