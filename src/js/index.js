const $ = (selector) => document.querySelector(selector);

function App() {
  // form 태그가 자동으로 전송되는 것을 막음
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  // 메뉴 수정
  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      const $menuName = e.target.closest("li").querySelector(".menu-name");
      const menuName = $menuName.innerText;
      const updatedMenuName = prompt("메뉴명을 수정하세요.", menuName);
      $menuName.innerText = updatedMenuName;
    }
  });

  // 메뉴 이름 입력 받기
  const addMenuName = () => {
    // 사용자 입력값이 빈 값이라면 추가되지 않음
    if ($("#espresso-menu-name").value === "") {
      alert("값을 입력해주세요.");
      return;
    }
    // 메뉴 이름 받아서 보관
    const espressoMenuName = $("#espresso-menu-name").value;

    // 보관한 값 마크업 추가
    const menuItemTemplate = (espressoMenuName) => {
      return `<li class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
          >
            수정
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
          >
            삭제
          </button>
        </li>`;
    };
    $("#espresso-menu-list").insertAdjacentHTML(
      "beforeend",
      menuItemTemplate(espressoMenuName)
    );

    // 총 메뉴 갯수 count -> li 갯수를 count
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;

    // 메뉴가 추가되고 나면, input은 빈 값으로 초기화
    $("#espresso-menu-name").value = "";
  };

  // 확인 버튼을 누르면 메뉴가 추가
  $("#espresso-menu-submit-button").addEventListener("click", (e) => {
    addMenuName();
  });

  // 엔터키 입력으로 메뉴 추가
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    addMenuName();
  });
}

App();
