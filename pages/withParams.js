import {API} from '../config'
import axios from 'axios'
import {getUser, getToken} from '../helpers/user'
axios.defaults.withCredentials = true

const withParams = Page => {
    const WithParams = props => <Page {...props} />
    WithParams.getInitialProps = async (context)  => {
      const token = context.query ? context.query.token ? context.query.token : null : null
      let newToken = null

      return {
          ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
          token,
      }
    }

    return WithParams
}

export default withParams