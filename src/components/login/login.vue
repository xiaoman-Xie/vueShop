<template>
  <div id="login">
    <el-form id="container" label-width="80px">
      <el-form-item label="帐号">
        <el-input v-model="form_data.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="form_data.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item id="login-btn">
        <el-button type="primary" @click.prevent="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      form_data: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // 登录请求
    async handleLogin () {
      // this.$http.post('login', this.form_data).then(res => {
      //   const {
      //     meta: {msg, status}
      //   } = res.data
      //   if (status === 200) {
      //     this.$router.push('home')
      //     this.$message({
      //       message: msg,
      //       type: 'success'
      //     })
      //   } else {
      //     this.$message.warning(msg)
      //   }
      // })
      // async和await使用

      const res = await this.$http.post('login', this.form_data)
      const {
        data,
        meta: { msg, status }
      } = res.data

      if (status === 200) {
        // 保存token
        localStorage.setItem('token', data.token)
        this.$router.push('home')
        this.$message({
          message: msg,
          type: 'success'
        })
      } else {
        this.$message.warning(msg)
      }
    }
  }
}
</script>

<style scoped>
  #login {
    position: relative;
    top: 200px;
    width: 500px;
    background-color: #e0e0fc;
    margin: 0 auto;
    padding: 40px 0 10px 0px;
    border-radius: 6px;
    box-shadow: 0px 0px 12px 1px #b4adad;
  }
  #container {
    margin: 0 auto;
    width: 380px;
  }
  #login-btn {
    position: relative;
    left: 82px;
  }
  #login-btn button {
    width: 80px;
  }
</style>>
