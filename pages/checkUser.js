import {API} from '../config'
import axios from 'axios'
import {getUser, getToken} from '../helpers/user'
import absoluteURL from 'next-absolute-url'
axios.defaults.withCredentials = true

const withUser = Page => {
    const WithAuthUser = props => <Page {...props} />
    WithAuthUser.getInitialProps = async (context)  => {
      let userID = null
      if(!context.query.transaction) userID = context.query.id

      let recipients = null
      const user = getUser(context.req)
      const token = getToken(context.req)
      let loggedIn = null
      let newToken = null

      if(user){loggedIn = user.split('=')[1]}
      if(token){newToken = token.split('=')[1]}

      if(newToken !== null){
        try {
          const responseUser = await axios.get(`${API}/auth/user`, {
            headers: {
                Authorization: `Bearer ${newToken}`,
                contentType: `application/json`
            }
          })
          loggedIn = responseUser.data
        } catch (error) {
          console.log({'ERROR': error})
        }
      }

      // console.log(loggedIn)

      if(!loggedIn){
        return {
          ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
          loggedIn
        }
      }else{
        return {
          ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
          loggedIn
        }
      }
    }

    return WithAuthUser
}

export default withUser