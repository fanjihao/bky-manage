import React from "react"
import './Login.css'
import { Input, Button } from 'antd'
import { UserOutlined, KeyOutlined, UnlockOutlined } from '@ant-design/icons'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            height:'', // 浏览器可视高度
            userphone:'',
            userpass:'',
            phonecode:'',
            forgetPwd:false,
            pwdLogin:true,
            codeLogin:false,
        }
    }
    componentDidMount() {
        this.setState({
            height: window.innerHeight + 'px'
        })
    }
    changeLogin = (type) => {
        this.setState({
            defaultLogin:type
        })
    }
    findPwd = () => {
        // const { defaultLogin } = this.state
        this.setState({
            defaultLogin:false
        })
    }
    toLogin = () => {
        console.log('登录', this.props)
        localStorage.setItem('token', 'fashdkasd')
        // this.props.history.push("/home")
    }
    render() {
        const { height, pwdLogin, userphone, userpass, phonecode, forgetPwd, codeLogin } = this.state
        let dom, formDom
        if(forgetPwd) {
            dom = <div className='codeLoginPart'>
                    <span className='loginCode' onClick={() => this.setState({
                        pwdLogin:false, codeLogin:true, forgetPwd:false
                    })}>验证码登录</span>
                </div>
            formDom = <div className='loginFormItem loginInputGroup'>
                    <KeyOutlined />
                    <Input size="large" bordered={false} 
                        placeholder='请输入验证码'
                        value={phonecode}
                        onChange={e => this.setState({ phonecode: e.target.value})} />
                    <span className='loginCode'>发送验证码</span>
                </div>
        } else if(pwdLogin) {
            dom = <div className='codeLoginPart'>
                    <span className='loginCode' onClick={() => this.setState({
                        pwdLogin:false, codeLogin:true, forgetPwd:false
                    })}>验证码登录</span>
                    <span className='loginCode' onClick={() => this.setState({
                        pwdLogin:false, codeLogin:false, forgetPwd:true
                    })}>忘记密码</span>
                </div>
            formDom = <div className='loginFormItem loginInputGroup'>
                        <UnlockOutlined />
                        <Input size="large" bordered={false} 
                            placeholder='请输入密码'
                            value={userpass}
                            onChange={e => this.setState({ userpass: e.target.value})} />
                    </div>
        } else if(codeLogin) {
            dom = <div className='codeLoginPart'>
                    <span className='loginCode' onClick={() => this.setState({
                        pwdLogin:true, codeLogin:false, forgetPwd:false
                    })}>密码登录</span>
                </div>
            formDom = <div className='loginFormItem loginInputGroup'>
                        <KeyOutlined />
                        <Input size="large" bordered={false} 
                            placeholder='请输入验证码'
                            value={phonecode}
                            onChange={e => this.setState({ phonecode: e.target.value})} />
                        <span className='loginCode'>发送验证码</span>
                    </div>
        }
        return (
            <div className="login" style={{height}}>
                <div className='loginPart'>
                    <div className='loginTitle'>
                        <div className='loginTitleTop'>
                            <div className='loginTopLogo' >
                                <img alt='logo' src={require('../../assets/imgs/ic_launcher.png')} style={{width:'50%',height:'50%'}}></img>
                            </div>
                            <div className='systemName'>
                                博客云商家版后台管理系统
                            </div>
                        </div>
                    </div>
                    <div className='loginContent'>
                        <div className='loginImg'>

                        </div>
                        <div className='loginForm'>
                            <div className='loginFormItem loginLogo'>
                                <img alt='logo' src={require('../../assets/imgs/ic_launcher.png')} 
                                    style={{width:'30px',height:'30px',margin:'0 20px 0'}}></img>
                                <span>博客云</span>
                            </div>
                            <div className='loginFormItem loginInputGroup'>
                                <UserOutlined />
                                <Input size="large" bordered={false} 
                                    placeholder='请输入电话号码'
                                    value={userphone}
                                    onChange={e => this.setState({ userphone: e.target.value})} />
                            </div>
                            {formDom}
                            {dom}
                            <div className='loginBtnBox'>
                                <Button type="primary" size='large' 
                                    className='loginBtn' 
                                    onClick={this.toLogin}>登录</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login