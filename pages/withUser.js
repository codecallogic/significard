import {API} from '../config'
import axios from 'axios'
import {getUser, getToken} from '../helpers/user'
import absoluteURL from 'next-absolute-url'
axios.defaults.withCredentials = true

const withUser = Page => {
    const WithAuthUser = props => <Page {...props} />
    WithAuthUser.getInitialProps = async (context)  => {
      let userID = null
      if(context.query) userID = context.query.id

      let recipients = null
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
          console.log({'ERROR': error})
        }
      }

      if(userID){
        if(userID !== 'sprite.svg'){
          if(userID !== 'DragDropTouch.js'){
            try {
              const responseRecipients = await axios.post(`${API}/auth/user-recipients`, {id: userID})
              console.log(responseRecipients)
              recipients = responseRecipients.data
            } catch (error) {
              console.log(error)
            }
          }
        }
      }

      if(!newUser){
        // return {
        //   ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
        //   newUser,
        //   recipients
        // }
        context.res.writeHead(302, {
          Location: '/signup'
        });
        context.res.end();
      }else{
        return {
          ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
          newUser,
          recipients
        }
      }
    }

    return WithAuthUser
}

export default withUser