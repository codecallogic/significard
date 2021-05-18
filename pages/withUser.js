import {API} from '../config'
import axios from 'axios'
import {getUser, getToken} from '../helpers/user'
axios.defaults.withCredentials = true

const withUser = Page => {
    const WithAuthUser = props => <Page {...props} />
    WithAuthUser.getInitialProps = async (context)  => {
      const user = getUser(context.req)
      const token = getToken(context.req)
      let newUser = null
      let newToken = null

      if(user){newUser = user.split('=')[1]}
      if(token){newToken = token.split('=')[1]}

      if(newToken !== null){
        try {
          const responseUser = await axios.get(`${API}/auth/user`, {
            headers: {
                Authorization: `Bearer ${newToken}`,
                contentType: `application/json`
            }
          })
          newUser = responseUser.data
        } catch (error) {
          console.log(error) 
          if(error) newUser = false
        }
      }

      if(newUser == false){
        context.res.writeHead(302, {
          Location: '/signup'
        });
        context.res.end();
      }else{
        return {
            ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
            newUser,
        }
      }
    }

    return WithAuthUser
}

export default withUser