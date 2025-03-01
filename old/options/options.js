document.addEventListener('DOMContentLoaded', function() {
//DOM 불러오고 시작
    let Gdocs_available = document.getElementById("Gdocs_available"); //구글 시트 사용 여부
    let flagGdocsavailable = 0; //플래그

    let save = document.getElementById("save"); //저장버튼
    let errorMessage = document.getElementById("error-message"); //에러메세지
    let saveMessage = document.getElementById("save-message"); // 세이브 메세지
    let flagsaveavailable = 0; //세이브 플래그

    let Onewayedu_link = document.getElementById("Onewayedu-link");
    let pwd = document.getElementById("password");
    let Gdocs_link = document.getElementById("Gdocs-link");
    let number = document.getElementById("number");
    let name = document.getElementById("name");
    let teacher = document.getElementById("teacher");
    let locationText = document.getElementById("noGdocs_location");
    let locationSelect = document.getElementById("Gdocs_location");
    let reason = document.getElementById("reason");    
    
    let default_settings = {
        Gdocs_available: false, // 기본값
        Onewayedu_link: 'https://hansung-hs.onwayedu.co.kr/login/login.php', // 기본값
        Gdocs_link: 'https://docs.google.com/spreadsheets/d/1rRduDZ0Kmo65CcEwc_iEZGmOM3PnEWBr9ES8neQHdzo/edit?gid=0#gid=0', // 기본값
        number: '', // 기본값
        pwd: '', // 기본값
        teacher: '', // 기본값
        location: '', // 기본값
    };

    function toggleLocationInput(){ //체크박스에 따른 옵션 보이기 + flag
        if (Gdocs_available.checked) {
            locationText.style.display = 'none';
            locationSelect.style.display = 'block';
            locationSelect.value = locationSelect.options[0].value; // 기본값 설정
            flagGdocsavailable = 1;
        } else {
            locationText.style.display = 'block';
            locationSelect.style.display = 'none';
            locationText.value = ''; // 텍스트 입력 초기화
            locationSelect.value = ''; // 셀렉트 박스 초기화
            flagGdocsavailable = 0;
        }
    }
    
    function toggleErrorPrint(){ //입력값이 공란이면 에러 출력

        let errorMessageText = '';
        if (!document.getElementById("Onewayedu-link").value){
            errorMessageText += '온웨이에듀 링크/\n';
        }
        if (!document.getElementById("Gdocs-link").value){
            errorMessageText += '구글 시트 링크/\n';
        }
        if (!document.getElementById("number").value){
            errorMessageText += '학번/\n';
        }
        if (!document.getElementById("password").value){
            errorMessageText += '온웨이에듀 비번/\n';
        }
        if (!document.getElementById("teacher").value){
            errorMessageText += '담임 선생님/\n';
        }
        if (!document.getElementById("noGdocs_location").value && !document.getElementById("Gdocs_location").value){
            errorMessageText += '위치/\n';
        }
        if (!document.getElementById("reason").value){
            errorMessageText += '이유/\n';
        }
        if (errorMessageText) {
            errorMessageText += '를(을) 입력해주세요.';
            errorMessage.textContent = errorMessageText;
            errorMessage.style.display = 'block';
            flagsaveavailable = 0;
        } else {
            errorMessage.style.display = 'none';
            flagsaveavailable = 1;
        }
    }

    function saveDataInput() { // 데이터 값 저장
        if (flagsaveavailable == 1) {
            let settings = { // settings 변수를 함수 시작 부분에서 선언
                Gdocs_available: Gdocs_available.checked,
                Onewayedu_link: Onewayedu_link.value,
                Gdocs_link: Gdocs_link.value,
                number: number.value,
                pwd: pwd.value,
                teacher: teacher.value,
                location: flagGdocsavailable == 0 ? locationText.value : locationSelect.value,
                reason: reason.value,
                time1: document.getElementById("time1").checked, // 1교시 체크박스 상태 저장
                time2: document.getElementById("time2").checked  // 2교시 체크박스 상태 저장
            };

            // chrome.storage.sync에 저장
            chrome.storage.sync.set(settings, function() {
                const saveMessageText = "설정이 저장되었습니다.";
                saveMessage.textContent = saveMessageText;
                saveMessage.style.display = 'block';
            });
        } else {
            saveMessage.style.display = 'none';
        }
    }

    chrome.storage.sync.get(null, function(storedSettings) { // 데이터 값 불러오기
        // 기본값 설정 및 저장된 값 병합
        let settings = {
            ...default_settings, // 기본값
            ...storedSettings // 저장된 값으로 덮어쓰기
        };
        
        // 각 입력 필드에 값 설정
        Gdocs_available.checked = settings.Gdocs_available; // 체크박스 상태 설정
        toggleLocationInput(); // 체크박스 상태에 따라 입력 필드 보이기
        Onewayedu_link.value = settings.Onewayedu_link; 
        Gdocs_link.value = settings.Gdocs_link; 
        number.value = settings.number; 
        pwd.value = settings.pwd; 
        teacher.value = settings.teacher; 
        locationText.value = settings.location;  
        locationSelect.value = settings.location; // 셀렉트박스에 자동으로 찍힘.
        reason.value = settings.reason || '';

        // 1교시와 2교시 체크박스 상태 설정
        document.getElementById("time1").checked = settings.time1 || false; // 1교시 체크박스 상태 설정
        document.getElementById("time2").checked = settings.time2 || false; // 2교시 체크박스 상태 설정
    });

    save.addEventListener("click", toggleErrorPrint);
    save.addEventListener("click", saveDataInput);
    Gdocs_available.addEventListener('change', toggleLocationInput);
    toggleLocationInput();

});