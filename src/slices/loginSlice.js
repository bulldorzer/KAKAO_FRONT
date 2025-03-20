import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginPost } from "../api/memberApi";

import { getCookie, setCookie, removeCookie } from "../util/cookieUtil";

const initState = {
    email:''
}

export const loginPostAsync = createAsyncThunk('loginPostAsync', (param) => {

  return loginPost(param)

})

const loadMemberCookie = () => {  //쿠키에서 로그인 정보 로딩 

  const memberInfo =  getCookie("member")

  //닉네임 처리 
  if(memberInfo && memberInfo.nickname) {
    memberInfo.nickname = decodeURIComponent(memberInfo.nickname)
  }

  return memberInfo
}


const loginSlice = createSlice({
  name: 'LoginSlice',
  initialState: loadMemberCookie()|| initState, //쿠키가 없다면 초깃값사용 
  reducers: {
    // state : 상태
    // action : dispatch()를 통해서 리듀서에 전달되는 객체, 상태변경 역활함
    //          ㄴ ex) dispatch({type: "LOGIN", payload: userData});
    /*
      state와 action이 어떻게 작동하는지 흐름 정리
      dispatch({ type: "LOGIN", payload: userData })를 호출하면, action 객체가 생성됨.
      useReducer()에 등록된 리듀서 함수(authReducer)가 실행됨.
      authReducer(state, action)가 실행되어 state를 업데이트함.
      새로운 state 값이 리턴되면서 컴포넌트가 리렌더링됨.

      state와 action이 어떻게 작동하는지 쉽게 설명
      버튼을 클릭하면 → dispatch({ type: "LOGIN", payload: userData })가 실행됨.
      → 이것은 "로그인할 거야!"라고 알려주는 신호(명령)를 보낸다고 생각하면 됨.

      이 신호(action)가 리듀서(authReducer)로 전달됨.
      → "지금 로그인해야 하니까 상태(state)를 바꿔줘!"라고 요청하는 거임.

      리듀서(authReducer)가 신호(action)를 보고 새로운 상태를 만듦.
      → 기존 상태(isAuthenticated: false)에서 isAuthenticated: true로 변경됨.
      → 그리고 user 정보도 저장됨.

      새로운 상태(state)가 업데이트되면서 화면이 다시 그려짐.
      → 로그인하면 "로그인하세요" 문구가 "환영합니다, [유저이름]!"으로 바뀌는 것처럼 화면이 바뀌는 거임.

      👉 dispatch()는 신호를 보내는 것, action은 신호의 내용, state는 그 신호에 따라 바뀌는 데이터라고 보면 됨! 🚀
    */
    login: (state, action) => {
      console.log("login.....")
      //{email, pw로 구성 }, 소셜로그인 회원이 사용
      const payload = action.payload
      
      // //새로운 상태 
      // return {email: data.email}
      setCookie("member",JSON.stringify(payload),1) //1일 쿠키유지
      return payload;

    },
    logout: (state, action) => {
        console.log("logout....")

        removeCookie("member")
        return {...initState}
    }
  },
  extraReducers: (builder) => {
    
    builder.addCase( loginPostAsync.fulfilled, (state, action) => { 
      console.log("fulfilled")

      const payload = action.payload

      //닉네임 한글 처리 
      if(payload.nickname){
        payload.nickname = encodeURIComponent(payload.nickname)
      }

      //정상적인 로그인시에만 저장 
      if(!payload.error){
        setCookie("member",JSON.stringify(payload), 1) //1일
      }

      return payload

    })

    .addCase(loginPostAsync.pending, (state,action) => {
        console.log("pending")
    })
    .addCase(loginPostAsync.rejected, (state,action) => {
        console.log("rejected")
    })
  }
})

export const {login,logout} = loginSlice.actions

export default loginSlice.reducer
