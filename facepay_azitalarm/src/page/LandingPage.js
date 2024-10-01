import { React, useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";
import hostURL from "../hostURL";
import notificationSound from "../sound/notification.mp3";
import styles from "../css/LandingPage.module.css";

const LandingPage = () => {
  const [latestPayment, setLatestPayment] = useState(null);
  const [isWatching, setIsWatching] = useState(false); // is_done을 기다리는 상태

  // 1초마다 fetchLatestPayment 실행
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const intervalId = setInterval(fetchLatestPayment, 1000); // 1초마다 실행
    return () => clearInterval(intervalId); // 컴포넌트가 unmount될 때 interval을 정리
  }, [isWatching]);

  // Button click Function to play audio
  const onClicked = () => {
    document.getElementById("askStartButton").style.display = "none";
    document.getElementById("notificationBox").style.display = "block";

    const intervalId = setInterval(fetchLatestPayment, 1000); // 1초마다 실행
    return () => clearInterval(intervalId); // 컴포넌트가 unmount될 때 interval을 정리
  };

  // API 요청을 통해 최신 결제 데이터를 가져오는 함수
  const fetchLatestPayment = async () => {
    try {
      // 최신 결제 데이터를 가져오는 API 호출
      const response = await axios.get(
        `${hostURL}/api/payments/latest_payment`
      );
      const paymentData = response.data;

      // 데이터가 존재하는지 확인한 후에 상태 업데이트
      if (paymentData) {
        setLatestPayment(paymentData);
        console.log("Latest payment data:", paymentData);

        // store_id가 3이고 is_done이 false일 때 상태 설정
        if (paymentData.store_id === 3 && paymentData.is_done === false) {
          setIsWatching(true); // is_done을 true로 바꿀 때까지 감시 시작
          console.log("Watching for payment completion...");
        }

        // is_done이 true가 되면 알림 전송
        if (isWatching && paymentData.is_done === true) {
          if ('Notification' in window && Notification.permission === 'granted') {
            // 소리 재생
            const audio = new Audio(notificationSound);
            audio.play(); // 알림과 함께 소리 재생
          }
          setIsWatching(false); // 알림을 보낸 후 감시 중단
          console.log("Payment is done!");
        }
      } else {
        console.log("No payment data available");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  return (
    <div>
      <Header />

      <div id="askStartButton" className={styles.askStartButton}>
        <div>아래 결제 알림 버튼을 눌러주세요</div>
        <button id="start" onClick={onClicked} className={styles.invisible}>
          Start
        </button>
      </div>

      <div id="notificationBox" className={styles.notificationBox}>
        <p>가장 최신 결제 정보:</p>
        {latestPayment && (
          <div>
            <p>Store ID: {latestPayment.store_id}</p>
            <p>Is Done: {latestPayment.is_done ? "Yes" : "No"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
