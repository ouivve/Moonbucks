import { $ } from "./utils/dom.js";
import store from "./store/index.js";

const BASE_URL = "http://localhost:3000/api";

function App() {
  // 상태(변할 수 있는 데이터) - 메뉴명
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    deresr: [],
  };
  this.currentCategory = "espresso";

  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
      // console.log(this.menu);
    }
    render();
    initEventListeners();
  };

  const initEventListeners = () => {
    // form 태그가 자동으로 전송되는 것을 막음
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    // 확인 버튼을 누르면 메뉴가 추가
    $("#menu-submit-button").addEventListener("click", addMenuName);

    // 엔터키 입력으로 메뉴 추가
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuName();
    });

    // 카테고리별 메뉴판 관리
    $("nav").addEventListener("click", (e) => {
      // 예외처리
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        render();
      }
    });

    // 메뉴 수정 및 삭제(이벤트 위임), 메뉴 품절
    $("#menu-list").addEventListener("click", (e) => {
      // 메뉴 수정
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }
      // 메뉴 삭제
      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        updateMenuCount();
        return;
      }
      // 메뉴 품절
      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });
  };

  // 메뉴 마크업 추가
  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((menuItem, index) => {
        return `
          <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
            <span class="w-100 pl-2 menu-name ${
              menuItem.soldOut ? "sold-out" : ""
            }">${menuItem.name}</span>
            <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
          >
            품절
          </button>
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
      })
      .join("");

    $("#menu-list").innerHTML = template;

    // 총 메뉴 갯수 count -> li 갯수를 count
    updateMenuCount();
  };

  // 총 메뉴 갯수 count -> li 갯수를 count
  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  // 메뉴 이름 입력 받기
  const addMenuName = async () => {
    // 사용자 입력값이 빈 값이라면 추가되지 않음
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요.");
      return;
    }
    // 메뉴 이름 받아서 보관
    const menuName = $("#menu-name").value;
    // this.menu[this.currentCategory].push({ name: menuName });
    await fetch(`${BASE_URL}/category/${this.currentCategory}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: menuName }),
    }).then((response) => {
      // console.log(response);
      return response.json();
    });

    // store.setLocalStorage(this.menu);
    await fetch(`${BASE_URL}/category/${this.currentCategory}/menu`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.menu[this.currentCategory] = data;
        // 보관한 값 마크업 추가
        render();
        // 메뉴가 추가되고 나면, input은 빈 값으로 초기화
        $("#menu-name").value = "";
      });
  };

  // 메뉴 이름 수정
  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요.", $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    render();
  };

  // 메뉴 삭제
  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      render();
    }
  };

  // 메뉴 품절
  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };
}

const app = new App();
app.init();
