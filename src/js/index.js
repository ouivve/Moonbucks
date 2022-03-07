function App() {
  // form 태그가 자동으로 전송되는 것을 막음
  document
    .querySelector("#espresso-menu-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
    });

  // 메뉴 이름 입력 받기
  document
    .querySelector("#espresso-menu-name")
    .addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        console.log(document.querySelector("#espresso-menu-name").value);
      }
    });
}

App();
