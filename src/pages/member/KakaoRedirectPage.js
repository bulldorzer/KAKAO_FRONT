import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAccessToken, getMemberWithAccessToken } from "../../api/kakaoApi";
import { useDispatch } from "react-redux";
import { login } from "../../slices/loginSlice";
import useCustomLogin from "../../hooks/useCustomLogin";

const KakaoRedirectPage = () => {
    const [searchParams] = useSearchParams();
    const {moveToPath} = useCustomLogin();
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
    const dispatch = useDispatch(); // 리듀서 - (state, action)
    const authCode = searchParams.get("code"); // 인가코드 추출

    useEffect(() => {
        // 나 -> 카카오 : 인가코드 보냄 / accessToken 받음
        getAccessToken(authCode).then(accessToken => {
            console.log(accessToken);
            
            getMemberWithAccessToken(accessToken).then(memberInfo =>{
                console.log("----------------------");
                console.log(memberInfo);

                dispatch(login(memberInfo))

                // 소셜 회원이 아니라면
                if (memberInfo && !memberInfo.social) {
                    moveToPath("/")
                } else {
                    moveToPath("/member/modify")
                }
            })
        })
    }, [authCode]) // 인가코드가 변경 될 때마다, 새로운 access token을 발급 받음

    return (
        <div>
            <h2>Kakao Login Redirect</h2>
            <div>{authCode}</div>
        </div>
    )
}

export default KakaoRedirectPage;