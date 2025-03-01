document.addEventListener('DOMContentLoaded', function() {
//DOM 불러오고 시작
    let Gdocs_available = document.getElementById("Gdocs_available"); //구글 시트 사용 여부
    let flagGdocsavailable = 0; //플래그

    let save = document.getElementById("save"); //저장버튼
    let errorMessage = document.getElementById("error-message"); //에러메세지
    let saveMessage = document.getElementById("save-message"); // 세이브 메세지
    let flagsaveavailable = 0; //세이브 플래그
    let settingButton = document.getElementById("setting"); // 세팅 버튼

    let teacher = document.getElementById("teacher");
    let locationText = document.getElementById("noGdocs_location");
    let locationSelect = document.getElementById("Gdocs_location");
    let reason = document.getElementById("reason");
    
    function toggleLocationInput(){ //체크박스에 따른 옵션 보이기 + flag
        if (Gdocs_available.checked) {
            locationText.style.display = 'none';
            locationSelect.style.display = 'block';
            locationSelect.value = locationSelect.options[0].value;
            locationText.value = '';
            flagGdocsavailable = 1;
        }
        else {
            locationText.style.display = 'block';
            locationSelect.style.display = 'none';
            locationSelect.value = '';
            flagGdocsavailable = 0;
        
        }
    }
    
    function toggleErrorPrint(){ //입력값이 공란이면 에러 출력

        let errorMessageText = '';
        if (!document.getElementById("teacher").value){
            errorMessageText += '담당쌤/\n';
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
                teacher: teacher.value,
                location: flagGdocsavailable == 0 ? locationText.value : locationSelect.value, // 조건에 따라 위치 저장
                reason: reason.value
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

    chrome.storage.sync.get(null, function(settings) {
        // 기본값 설정
        settings = { ...settings, Gdocs_available: false, teacher: '', location: '', reason: '' };

        if (settings.Gdocs_available !== undefined) {
            Gdocs_available.checked = settings.Gdocs_available; // 체크박스 상태 설정
            toggleLocationInput(); // 체크박스 상태에 따라 입력 필드 보이기
        }
        teacher.value = settings.teacher || ''; 
        locationText.value = settings.location || '';  
        locationSelect.value = settings.location || ''; // 셀렉트박스에 자동으로 찍힘.
        reason.value = settings.reason || '';

        // 1교시와 2교시 체크박스 상태 설정
        document.getElementById("time1").checked = settings.time1 || false; // 1교시 체크박스 상태 설정
        document.getElementById("time2").checked = settings.time2 || false; // 2교시 체크박스 상태 설정
    });


    save.addEventListener("click", toggleErrorPrint);
    save.addEventListener("click", saveDataInput);
    Gdocs_available.addEventListener('change', toggleLocationInput);
    settingButton.addEventListener("click", function(){//설정버튼
        window.open("../options/options.html");
    });
    toggleLocationInput();
});