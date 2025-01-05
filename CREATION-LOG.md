# Creation
[Procedure Framework](https://nextjs.org/learn/dashboard-app/getting-started)

```
npx create-next-app@latest mcdl-v2 --use-npm 
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … No
✔ Would you like to use `src/` directory? … No 
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to customize the default import alias (@/*)? … No
```

# Install MUI
[Procedure](https://mui.com/material-ui/integrations/nextjs/)

* Location of theme.js file different - docs reference src directory - put in root
* use V14 in layout.tsx file
* had to manually install @emotion/styled and @emotion/react


# Install TailwindCSS, Flowbite

* [Procedure](https://flowbite.com/docs/getting-started/next-js/)
* [Example of Navbar](https://www.flowbite-react.com/docs/components/navbar)
* [Component List](https://github.com/themesberg/flowbite-react)

# Useful Tools
* [Suspense and Streaming](https://nextjs.org/learn/dashboard-app/streaming)
* [WP CMS Integration](https://vercel.com/guides/wordpress-with-vercel)
* [Data Caching Deep Dive](https://github.com/vercel/next.js/discussions/54075)

# Sequalize
* [Setup](https://stackoverflow.com/questions/76239621/critical-dependency-the-request-of-a-dependency-sequelize-is-an-expression-in)

## NextJS Wierdness
* loading.jsx file location for dynamic routes: must be in PARENT: [ISSUE](https://github.com/vercel/next.js/issues/43548)

## Auth
* (https://next-auth.js.org/getting-started/example)
* (https://next-auth.js.org/providers/cognito)

### Auth ENV
DATA_URL=http://docker:8095
AUTH_SECRET=<base64 secrect>
AUTH_COGNITO_ID=<COGNITO app id>
AUTH_COGNITO_SECRET=<COGNITO secret>
AUTH_COGNITO_ISSUER=https://cognito-idp.us-east-1.amazonaws.com/{USER POOL ID: e.g. us-east-1_xxxxxxx}

### Auth Flow
```
signin callback (user, account, profile, email, credentials)
user: {
  id: '17327167-7f7a-47cc-a0c4-45140311c7a1',
  email: 'john.m.mackey@gmail.com'
}
account: {
  id_token: 'eyJraWQiOiJWcmx2MlgxbldJZlBpaFlONndkRzYycjNKNTJjODdzdHhuRUdmNmNRSDI0PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiMUtvUU16X2o5SmMzQlZWWEhjWXRUdyIsInN1YiI6IjIyNTgzMmVhLTQzOTQtNDc2ZC04ODFkLTY1OTYzYTQ0ZTYyOCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9SSnhscEJuemMiLCJjb2duaXRvOnVzZXJuYW1lIjoiMjI1ODMyZWEtNDM5NC00NzZkLTg4MWQtNjU5NjNhNDRlNjI4IiwiZ2l2ZW5fbmFtZSI6IkpvaG4iLCJvcmlnaW5fanRpIjoiZDZkMTVmNzQtNjA4MS00MDdhLWI4YzYtYTc4M2FhZDY4ZjgzIiwiYXVkIjoiYmVkdWQ3dnQyZ2ljY203b2Y2aGpkcW1sZSIsImV2ZW50X2lkIjoiMGY2YzM3NWYtNWU0Ni00NGRkLWFkN2MtZmY5ZmJmZjE3MWQzIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MTAwNzY4MTQsImV4cCI6MTcxMDA4MDQxNCwiaWF0IjoxNzEwMDc2ODE0LCJmYW1pbHlfbmFtZSI6Ik1hY2tleSIsImp0aSI6ImFhYTZmOTUyLWU0YjEtNDU4MC1hNzY0LTY0Njc1ZDhkZGJkMiIsImVtYWlsIjoiam9obi5tLm1hY2tleUBnbWFpbC5jb20ifQ.HKf_3WlzCRQSEKqA2q7D1ThbjRhMCs1OZD6UP0ckn8goiAxErjmF2G_UPc9R-n6i8h71MFJwVv-H3GVoiOViJSdibusWAm4BIQXRkHBjqXYLygu8OdKhfGLYs7x_EOlt8qJyj5y7PgkcskAgFGDMgCHo67CPhfzNiayzR8Na-GXwOlxxZDianP16Dw7d99_Ss7JrfgG6aaD8cVf4xzPJ4BI-kfQrW_YGHd7_L2MEcVZNFqJ70NTvkfCfAHr-Vdd2zZ8tXkaKTN-kc_cVoazIF-YdxcZmRJ1HKkorHWN7nZb-uLMG5ByTpoqstkifBmuuKyfr43bvMERgn84Vbj9S3A',
  access_token: 'eyJraWQiOiJYbHNYMGZCZzFUXC80bHQ1Q2diUFlTNFNkWGJGT0FyR204QnRraVMybzhPaz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIyMjU4MzJlYS00Mzk0LTQ3NmQtODgxZC02NTk2M2E0NGU2MjgiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9SSnhscEJuemMiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiJiZWR1ZDd2dDJnaWNjbTdvZjZoamRxbWxlIiwib3JpZ2luX2p0aSI6ImQ2ZDE1Zjc0LTYwODEtNDA3YS1iOGM2LWE3ODNhYWQ2OGY4MyIsImV2ZW50X2lkIjoiMGY2YzM3NWYtNWU0Ni00NGRkLWFkN2MtZmY5ZmJmZjE3MWQzIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF1dGhfdGltZSI6MTcxMDA3NjgxNCwiZXhwIjoxNzEwMDgwNDE0LCJpYXQiOjE3MTAwNzY4MTQsImp0aSI6Ijk4OTljODYxLTI5NzUtNDMwZi04NjVlLWQyYzk5MDEyNTU4NyIsInVzZXJuYW1lIjoiMjI1ODMyZWEtNDM5NC00NzZkLTg4MWQtNjU5NjNhNDRlNjI4In0.XzRO7WrFQSIgBEbkH_9bFtgLAE6rpIAEw5ds1kZ0TbDFNq57nCIpitCiehC7fZujWbVA9o4s5ucYv955xV5tCLQx0HArJJl25nxbPu_X3YN8Yo5lCxEDp2sl8_mavOBIwFqh2RuP14Rz-ZX1gYtZd5r88D_YpGU2DZxXUu1Hl17g6S7EFhOKdqPfZDr8AUSEbjAYB2MZO1rQD64h_ZSqirA87j4xLZ29wf7Add9v9IQKqbX3SH-wBuK37O_kRYUt75uPpWjjegEJIab3WkYRNgHV92RJlIT_OLM2TyNBZWQOtCwLO4HAhC-vepNLqUMrfmcx0uIH4wulGqUmEVG7rw',
  refresh_token: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.C_AQoAHDrjeV_VnTqttmWs4OpHHqYHzj0MEllIifz_QYQJMc3DGr7IVCWj3Dd4OVmz9AX-5kLPL-h7EUbI4PNRsTyY4DP4N9JilIXYGQqQ4pPO59KqWUv6TmphxFf-SqfSJnToBgnW8RE8rPYwizWM0OO6-dFs7pLZNxVWRx8xW73P8dUpPAt1nSVeu8e-GSe1mh3l-JUxhiG604j3nBt161g40DEnPTU7n14XP6BDRFq-_Xum2aPzvK52Pw-Le2AFHD28RLO5SZa1n_6IPTcCV_7MDzW4Lm7QWMz0HJlTexqrTmzsub37nEd3KhiXzHg7taZF7L9OMSzr7PPPngPA.3SVPT2ujBzLY2KlJ.ink_onc06vELztEwlTU-VSlNEP1Wg_zE1eHdAHH6di1e0soJXxpCfVodYfQsqzF5j9gtniN1a-u1Yt2ZWnXqsYr89QFnUTnS8cABOhGVoHnbIRZWWxhJCvC-526OFg6yfv31Z5ciMCK-wDMUaLnxAXSmsV7h0M6ELmqLxkFO6VHQrTWGgPaf2DxmWjtSI-tEmNY29tfEUaXJ1x8LQdS1G9xuk-KqYjfcauId5PDljwXgnUfioQe4O-T1mkSnKqzFdZDt8h45tCVd5fu0DHpKn-lFdkmJN9Io8T9ojNF-tKQD5RqCxq42115NcaPGcyLoHcQHvgLT3kG4U2aLCdzaKdWyuIXMNVmcKzpkIX9TSfY8Erj5SvROzO_SYItA05d3fzj1bUXhII2UIFvlIflfUgiER45SehRQ6exCQPbzf-K0-APoBrIGIWmtmegaFC0hKj93ZaKqt334S5FHFZ072XD5iKGF-aIDOvmfjx2drIIQGMa-VT62pDs8PlT1qKEraEvz2VHwoBXJSacNTeM9N9cc0yW9FiLlRzvwIt2ySq3MRpoSdczDPT_UUygloMIoIWQqxTrlL5pUl-3EWSrUn3EBAvSN4u4bPzXwLAAivc7eEDE4A-lQTG2_OqvizHdyhL_M4OUN58snz1laHnW6xJBUMeZT5pfScGf49_gORwkvxcJmuTiFUggA8TxlQXvA4ZiazvM6touKnG6IfQQTw--vdMbNgdX9vafgPTVZUkjAaacBPdQLXTprydbcdDsL6hv4xXMFyYCXAm4FZk28yY9xTubIJUHgPQLfPCZ-5xWnZu7MPP8GleIDQEmlQdWukBJYz2Grn1F9duhEuVOGAJcf0DnchMCEs78z5zYv4qlqVae0CSojQuwTw4ysyXS7NqNUVoepbEloHeGpzuMc_6N8HQ9OS54JCbutcFXcpOIRt-BxhWAWBoxT7GqjHuDSGMyMuWdlWrX6omZ9KVxhHrFaj4Vnh4ACc7V5PEy6t6KXeocn0p2y9VWDfvmM8ZYXrmG0vmszJM7HP80omkWbrl2K8QLDYxpUO7uez2rgyHrb4f337UlIvsglyOBHdQQvDMRNtVOq3--XMqKzxIznpPe2chWK9R_t3q2cUZfaiVvbAXQWKx7fJ0YrY4aUliuFvQEYqZVspQTXh8Svz_pm8BglalgDtQ3J636iFtcrE3tTmsc7dCpHQWlo6dpvqTdMTO5Wffw7JDVGlTuoMk4Y1E0uEW0kZ9a40gubNTQ7CP5QnVY9GMaPGV2fIewKQGrQyShewmlbQjwsALrhTWByG5qgsU5_bqfLqjHBrtbu4rB7lV500ocybWV5ZuZQng.M6Cc2UzngJSyaNpeTIm2Sg',
  expires_in: 3600,
  token_type: 'bearer',
  expires_at: 1710080414,
  provider: 'cognito',
  type: 'oidc',
  providerAccountId: '225832ea-4394-476d-881d-65963a44e628'
}
profile: {
  at_hash: '1KoQMz_j9Jc3BVVXHcYtTw',
  sub: '225832ea-4394-476d-881d-65963a44e628',
  email_verified: true,
  iss: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_RJxlpBnzc',
  'cognito:username': '225832ea-4394-476d-881d-65963a44e628',
  given_name: 'John',
  origin_jti: 'd6d15f74-6081-407a-b8c6-a783aad68f83',
  aud: 'bedud7vt2giccm7of6hjdqmle',
  event_id: '0f6c375f-5e46-44dd-ad7c-ff9fbff171d3',
  token_use: 'id',
  auth_time: 1710076814,
  exp: 1710080414,
  iat: 1710076814,
  family_name: 'Mackey',
  jti: 'aaa6f952-e4b1-4580-a764-64675d8ddbd2',
  email: 'john.m.mackey@gmail.com'
}
email: undefined
credentials: undefined
```
```
jwt callback (token, user, account, profile, isNewUser)
token: {
  name: undefined,
  email: 'john.m.mackey@gmail.com',
  picture: undefined,
  sub: '17327167-7f7a-47cc-a0c4-45140311c7a1'
}
user: {
  id: '17327167-7f7a-47cc-a0c4-45140311c7a1',
  email: 'john.m.mackey@gmail.com'
}
account: {
  id_token: 'eyJraWQiOiJWcmx2MlgxbldJZlBpaFlONndkRzYycjNKNTJjODdzdHhuRUdmNmNRSDI0PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiMUtvUU16X2o5SmMzQlZWWEhjWXRUdyIsInN1YiI6IjIyNTgzMmVhLTQzOTQtNDc2ZC04ODFkLTY1OTYzYTQ0ZTYyOCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9SSnhscEJuemMiLCJjb2duaXRvOnVzZXJuYW1lIjoiMjI1ODMyZWEtNDM5NC00NzZkLTg4MWQtNjU5NjNhNDRlNjI4IiwiZ2l2ZW5fbmFtZSI6IkpvaG4iLCJvcmlnaW5fanRpIjoiZDZkMTVmNzQtNjA4MS00MDdhLWI4YzYtYTc4M2FhZDY4ZjgzIiwiYXVkIjoiYmVkdWQ3dnQyZ2ljY203b2Y2aGpkcW1sZSIsImV2ZW50X2lkIjoiMGY2YzM3NWYtNWU0Ni00NGRkLWFkN2MtZmY5ZmJmZjE3MWQzIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MTAwNzY4MTQsImV4cCI6MTcxMDA4MDQxNCwiaWF0IjoxNzEwMDc2ODE0LCJmYW1pbHlfbmFtZSI6Ik1hY2tleSIsImp0aSI6ImFhYTZmOTUyLWU0YjEtNDU4MC1hNzY0LTY0Njc1ZDhkZGJkMiIsImVtYWlsIjoiam9obi5tLm1hY2tleUBnbWFpbC5jb20ifQ.HKf_3WlzCRQSEKqA2q7D1ThbjRhMCs1OZD6UP0ckn8goiAxErjmF2G_UPc9R-n6i8h71MFJwVv-H3GVoiOViJSdibusWAm4BIQXRkHBjqXYLygu8OdKhfGLYs7x_EOlt8qJyj5y7PgkcskAgFGDMgCHo67CPhfzNiayzR8Na-GXwOlxxZDianP16Dw7d99_Ss7JrfgG6aaD8cVf4xzPJ4BI-kfQrW_YGHd7_L2MEcVZNFqJ70NTvkfCfAHr-Vdd2zZ8tXkaKTN-kc_cVoazIF-YdxcZmRJ1HKkorHWN7nZb-uLMG5ByTpoqstkifBmuuKyfr43bvMERgn84Vbj9S3A',
  access_token: 'eyJraWQiOiJYbHNYMGZCZzFUXC80bHQ1Q2diUFlTNFNkWGJGT0FyR204QnRraVMybzhPaz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIyMjU4MzJlYS00Mzk0LTQ3NmQtODgxZC02NTk2M2E0NGU2MjgiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9SSnhscEJuemMiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiJiZWR1ZDd2dDJnaWNjbTdvZjZoamRxbWxlIiwib3JpZ2luX2p0aSI6ImQ2ZDE1Zjc0LTYwODEtNDA3YS1iOGM2LWE3ODNhYWQ2OGY4MyIsImV2ZW50X2lkIjoiMGY2YzM3NWYtNWU0Ni00NGRkLWFkN2MtZmY5ZmJmZjE3MWQzIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF1dGhfdGltZSI6MTcxMDA3NjgxNCwiZXhwIjoxNzEwMDgwNDE0LCJpYXQiOjE3MTAwNzY4MTQsImp0aSI6Ijk4OTljODYxLTI5NzUtNDMwZi04NjVlLWQyYzk5MDEyNTU4NyIsInVzZXJuYW1lIjoiMjI1ODMyZWEtNDM5NC00NzZkLTg4MWQtNjU5NjNhNDRlNjI4In0.XzRO7WrFQSIgBEbkH_9bFtgLAE6rpIAEw5ds1kZ0TbDFNq57nCIpitCiehC7fZujWbVA9o4s5ucYv955xV5tCLQx0HArJJl25nxbPu_X3YN8Yo5lCxEDp2sl8_mavOBIwFqh2RuP14Rz-ZX1gYtZd5r88D_YpGU2DZxXUu1Hl17g6S7EFhOKdqPfZDr8AUSEbjAYB2MZO1rQD64h_ZSqirA87j4xLZ29wf7Add9v9IQKqbX3SH-wBuK37O_kRYUt75uPpWjjegEJIab3WkYRNgHV92RJlIT_OLM2TyNBZWQOtCwLO4HAhC-vepNLqUMrfmcx0uIH4wulGqUmEVG7rw',
  refresh_token: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.C_AQoAHDrjeV_VnTqttmWs4OpHHqYHzj0MEllIifz_QYQJMc3DGr7IVCWj3Dd4OVmz9AX-5kLPL-h7EUbI4PNRsTyY4DP4N9JilIXYGQqQ4pPO59KqWUv6TmphxFf-SqfSJnToBgnW8RE8rPYwizWM0OO6-dFs7pLZNxVWRx8xW73P8dUpPAt1nSVeu8e-GSe1mh3l-JUxhiG604j3nBt161g40DEnPTU7n14XP6BDRFq-_Xum2aPzvK52Pw-Le2AFHD28RLO5SZa1n_6IPTcCV_7MDzW4Lm7QWMz0HJlTexqrTmzsub37nEd3KhiXzHg7taZF7L9OMSzr7PPPngPA.3SVPT2ujBzLY2KlJ.ink_onc06vELztEwlTU-VSlNEP1Wg_zE1eHdAHH6di1e0soJXxpCfVodYfQsqzF5j9gtniN1a-u1Yt2ZWnXqsYr89QFnUTnS8cABOhGVoHnbIRZWWxhJCvC-526OFg6yfv31Z5ciMCK-wDMUaLnxAXSmsV7h0M6ELmqLxkFO6VHQrTWGgPaf2DxmWjtSI-tEmNY29tfEUaXJ1x8LQdS1G9xuk-KqYjfcauId5PDljwXgnUfioQe4O-T1mkSnKqzFdZDt8h45tCVd5fu0DHpKn-lFdkmJN9Io8T9ojNF-tKQD5RqCxq42115NcaPGcyLoHcQHvgLT3kG4U2aLCdzaKdWyuIXMNVmcKzpkIX9TSfY8Erj5SvROzO_SYItA05d3fzj1bUXhII2UIFvlIflfUgiER45SehRQ6exCQPbzf-K0-APoBrIGIWmtmegaFC0hKj93ZaKqt334S5FHFZ072XD5iKGF-aIDOvmfjx2drIIQGMa-VT62pDs8PlT1qKEraEvz2VHwoBXJSacNTeM9N9cc0yW9FiLlRzvwIt2ySq3MRpoSdczDPT_UUygloMIoIWQqxTrlL5pUl-3EWSrUn3EBAvSN4u4bPzXwLAAivc7eEDE4A-lQTG2_OqvizHdyhL_M4OUN58snz1laHnW6xJBUMeZT5pfScGf49_gORwkvxcJmuTiFUggA8TxlQXvA4ZiazvM6touKnG6IfQQTw--vdMbNgdX9vafgPTVZUkjAaacBPdQLXTprydbcdDsL6hv4xXMFyYCXAm4FZk28yY9xTubIJUHgPQLfPCZ-5xWnZu7MPP8GleIDQEmlQdWukBJYz2Grn1F9duhEuVOGAJcf0DnchMCEs78z5zYv4qlqVae0CSojQuwTw4ysyXS7NqNUVoepbEloHeGpzuMc_6N8HQ9OS54JCbutcFXcpOIRt-BxhWAWBoxT7GqjHuDSGMyMuWdlWrX6omZ9KVxhHrFaj4Vnh4ACc7V5PEy6t6KXeocn0p2y9VWDfvmM8ZYXrmG0vmszJM7HP80omkWbrl2K8QLDYxpUO7uez2rgyHrb4f337UlIvsglyOBHdQQvDMRNtVOq3--XMqKzxIznpPe2chWK9R_t3q2cUZfaiVvbAXQWKx7fJ0YrY4aUliuFvQEYqZVspQTXh8Svz_pm8BglalgDtQ3J636iFtcrE3tTmsc7dCpHQWlo6dpvqTdMTO5Wffw7JDVGlTuoMk4Y1E0uEW0kZ9a40gubNTQ7CP5QnVY9GMaPGV2fIewKQGrQyShewmlbQjwsALrhTWByG5qgsU5_bqfLqjHBrtbu4rB7lV500ocybWV5ZuZQng.M6Cc2UzngJSyaNpeTIm2Sg',
  expires_in: 3600,
  token_type: 'bearer',
  expires_at: 1710080414,
  provider: 'cognito',
  type: 'oidc',
  providerAccountId: '225832ea-4394-476d-881d-65963a44e628'
}
profile: {
  at_hash: '1KoQMz_j9Jc3BVVXHcYtTw',
  sub: '225832ea-4394-476d-881d-65963a44e628',
  email_verified: true,
  iss: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_RJxlpBnzc',
  'cognito:username': '225832ea-4394-476d-881d-65963a44e628',
  given_name: 'John',
  origin_jti: 'd6d15f74-6081-407a-b8c6-a783aad68f83',
  aud: 'bedud7vt2giccm7of6hjdqmle',
  event_id: '0f6c375f-5e46-44dd-ad7c-ff9fbff171d3',
  token_use: 'id',
  auth_time: 1710076814,
  exp: 1710080414,
  iat: 1710076814,
  family_name: 'Mackey',
  jti: 'aaa6f952-e4b1-4580-a764-64675d8ddbd2',
  email: 'john.m.mackey@gmail.com'
} 
isNewUser: undefined


jwt callback {
  email: 'john.m.mackey@gmail.com',
  sub: '17327167-7f7a-47cc-a0c4-45140311c7a1',
  iat: 1710076814,
  exp: 1712668814,
  jti: '6adabc9f-3156-4e26-93cb-af91afdf85bb'
} undefined undefined undefined undefined
```
```
session callback {
  user: { name: undefined, email: 'john.m.mackey@gmail.com', image: undefined },
  expires: '2024-04-09T13:20:14.834Z'
} undefined {
  email: 'john.m.mackey@gmail.com',
  sub: '17327167-7f7a-47cc-a0c4-45140311c7a1',
  iat: 1710076814,
  exp: 1712668814,
  jti: '6adabc9f-3156-4e26-93cb-af91afdf85bb'
}
```
session object
```
{
  "user":{
    "email":"john.m.mackey@gmail.com",
    "profile":{
      "familyName":"Mackey",
      "givenName":"John",
      "groups":[
        "CG"
      ]
    }
  },
  "expires":"2024-12-29T15:44:06.060Z"
}
```
# Sanity integration
https://www.sanity.io/learn/course/day-one-with-sanity-studio/bringing-content-to-a-next-js-front-end
https://icons.sanity.build/all?scheme=light
https://www.sanity.io/docs/ids