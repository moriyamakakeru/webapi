document.getElementById("region-select").addEventListener("change", fetchWeather);

let autoUpdateInterval = null; // 自動更新用のインターバルID

async function fetchWeather() {
    const regionCode = document.getElementById("region-select").value;
    const apiUrl = `https://www.jma.go.jp/bosai/forecast/data/forecast/${regionCode}.json`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // 天気データ取得
        const forecast = data[0].timeSeries[0];
        const areas = forecast.areas[0].weathers;

        // 天気アイコン用マッピング
        const weatherIcons = {
            "晴れ": "icons/sunny.png",
            "くもり": "icons/cloudy.png",
            "雨": "icons/rainy.png",
            "雪": "icons/snowy.png",
            "雷": "icons/thunder.png",
            "晴れ時々曇り": "icons/sunnycloudy.png"
        };

        // カード情報を更新
        updateWeatherCard("today", areas[0], weatherIcons);
        updateWeatherCard("tomorrow", areas[1], weatherIcons);
        updateWeatherCard("day-after-tomorrow", areas[2], weatherIcons);

        // 更新日時の表示
        const updateDate = new Date(data[0].reportDatetime); // データの更新日時
        document.getElementById("updated-time").innerText = `データ更新日時: ${updateDate.toLocaleString()}`;
    } catch (error) {
        console.error("データ取得に失敗しました:", error);
        alert("データを取得できませんでした。");
    }
}

// 天気カードを更新する関数
function updateWeatherCard(id, weather, icons) {
    const weatherText = document.getElementById(id);
    const weatherIcon = document.getElementById(`${id}-icon`);

    weatherText.innerText = weather;
    for (const key in icons) {
        if (weather.includes(key)) {
            weatherIcon.src = icons[key];
            weatherIcon.alt = key;
            return;
        }
    }
    weatherIcon.src = "icons/unknown.png"; // 不明な場合
    weatherIcon.alt = "不明";
}

// 自動更新のセットアップ関数
function setupAutoUpdate(interval) {
    if (autoUpdateInterval) {
        clearInterval(autoUpdateInterval); // 既存の自動更新を停止
    }
    autoUpdateInterval = setInterval(fetchWeather, interval);
}

// 初期設定
fetchWeather(); // ページロード時に天気を取得
setupAutoUpdate(10 * 60 * 1000); // 10分ごとに自動更新
