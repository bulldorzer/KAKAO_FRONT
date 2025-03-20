import axios from "axios"
import { API_SERVER_HOST } from "./todoApi"

const rest_api_key = `3e704c588265350d0f636dc2e9b14734` // rest api 키
const redirect_uri = `http://localhost:3000/member/kakao` // 인증 처리 경로

const auth_code_path = `https://kauth.kakao.com/oauth/authorize` // 인가 코드 받기 위한 경로

const access_token_url =`https://kauth.kakao.com/oauth/token` 

export const getKakaoLoginLink = () =>{
    const kakaoURL = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;
    return kakaoURL;
}

export const getAccessToken = async (authCode) =>{
    const header = {
        headers:{
            "Content-Type" : "application/x-www-form-urlencoded",
        }
    }
    const params = {
        grant_type: "authorization_code",
        client_id: rest_api_key,
        redirect_uri: redirect_uri,
        code:authCode
    }

    const res = await axios.post(access_token_url,params,header)
    const accessToken = res.data.access_token
    return accessToken
}

// 내가 개발중인 api에 요청
export const getMemberWithAccessToken = async(accessToken) =>{
    const res = await axios.get(`${API_SERVER_HOST}/api/member/kakao?accessToken=${accessToken}`)

    return res.data
}