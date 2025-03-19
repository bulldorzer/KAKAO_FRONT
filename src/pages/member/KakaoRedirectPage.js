import { useSearchParams } from "react-router-dom";
import { getAccessToken } from "../../api/kakaoApi";
import { useEffect } from "react";

const KakaoRedirectPage = () => {
    const [searchParams] = useSearchParams();
    const authCode = searchParams.get("code"); // 인가코드 추출

    useEffect(() => {
        getAccessToken(authCode).then(data => {
            console.log(data);
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