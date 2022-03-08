const $ = (selector) => document.querySelector(selector);

function App() {
  // form 태그가 자동으로 전송되는 것을 막음
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  // 메뉴 이름 입력 받기
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
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
    }
  });
}

App();
